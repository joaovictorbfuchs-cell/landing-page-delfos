import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

// Tabela de CRC32 padrão IEEE 802.3
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1)
    } else {
      c = c >>> 1
    }
  }
  crcTable[n] = c >>> 0
}

function calculateCrc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length, 0)

  const crcTarget = Buffer.concat([typeBuf, data])
  const crc = calculateCrc32(crcTarget)

  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc, 0)

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function encodePngRgba(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  // IHDR: 13 bytes
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 6 // color type 6 (RGBA)
  ihdrData[10] = 0 // compression method (deflate)
  ihdrData[11] = 0 // filter method
  ihdrData[12] = 0 // interlace method (none)

  const ihdrChunk = makeChunk('IHDR', ihdrData)

  // Raw scanlines com filter byte 0 (None) por linha
  const rowBytes = width * 4
  const rawScanlines = Buffer.alloc(height * (1 + rowBytes))
  let srcOffset = 0
  let dstOffset = 0

  for (let y = 0; y < height; y++) {
    rawScanlines[dstOffset++] = 0 // Filter: None
    rgbaBuffer.copy(rawScanlines, dstOffset, srcOffset, srcOffset + rowBytes)
    dstOffset += rowBytes
    srcOffset += rowBytes
  }

  const compressedData = zlib.deflateSync(rawScanlines, { level: 9 })
  const idatChunk = makeChunk('IDAT', compressedData)
  const iendChunk = makeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function decodePng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47 || buffer.readUInt32BE(4) !== 0x0d0a1a0a) {
    throw new Error('Assinatura PNG inválida')
  }

  let offset = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let colorType = 0
  let interlaceMethod = 0
  const idatChunks = []

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString('ascii', offset + 4, offset + 8)
    const data = buffer.subarray(offset + 8, offset + 8 + length)
    offset += 12 + length

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      interlaceMethod = data[12]
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    } else if (type === 'IEND') {
      break
    }
  }

  if (interlaceMethod !== 0) throw new Error('Interlaced PNG não suportado')
  if (bitDepth !== 8) throw new Error(`Bit depth não suportado: ${bitDepth}`)
  if (colorType !== 6 && colorType !== 2) throw new Error(`Color type não suportado: ${colorType}`)

  const compressed = Buffer.concat(idatChunks)
  const decompressed = zlib.inflateSync(compressed)

  const bpp = colorType === 6 ? 4 : 3
  const rowBytes = width * bpp
  const expectedLength = height * (1 + rowBytes)

  if (decompressed.length !== expectedLength) {
    throw new Error(`Tamanho descomprimido inesperado: ${decompressed.length} != ${expectedLength}`)
  }

  const rgba = Buffer.alloc(width * height * 4)
  let srcOffset = 0
  let prevRow = Buffer.alloc(rowBytes)

  function paeth(a, b, c) {
    const p = a + b - c
    const pa = Math.abs(p - a)
    const pb = Math.abs(p - b)
    const pc = Math.abs(p - c)
    if (pa <= pb && pa <= pc) return a
    if (pb <= pc) return b
    return c
  }

  for (let y = 0; y < height; y++) {
    const filter = decompressed[srcOffset++]
    const currentRow = Buffer.alloc(rowBytes)

    for (let x = 0; x < rowBytes; x++) {
      const raw = decompressed[srcOffset++]
      const left = x >= bpp ? currentRow[x - bpp] : 0
      const up = prevRow[x]
      const upLeft = x >= bpp ? prevRow[x - bpp] : 0

      let val = 0
      if (filter === 0) {
        val = raw
      } else if (filter === 1) {
        val = (raw + left) & 0xff
      } else if (filter === 2) {
        val = (raw + up) & 0xff
      } else if (filter === 3) {
        val = (raw + Math.floor((left + up) / 2)) & 0xff
      } else if (filter === 4) {
        val = (raw + paeth(left, up, upLeft)) & 0xff
      } else {
        throw new Error(`Filtro PNG desconhecido: ${filter}`)
      }
      currentRow[x] = val
    }

    const dstRowOffset = y * width * 4
    for (let i = 0; i < width; i++) {
      const dstIdx = dstRowOffset + i * 4
      if (colorType === 6) {
        const srcIdx = i * 4
        rgba[dstIdx] = currentRow[srcIdx]
        rgba[dstIdx + 1] = currentRow[srcIdx + 1]
        rgba[dstIdx + 2] = currentRow[srcIdx + 2]
        rgba[dstIdx + 3] = currentRow[srcIdx + 3]
      } else {
        const srcIdx = i * 3
        rgba[dstIdx] = currentRow[srcIdx]
        rgba[dstIdx + 1] = currentRow[srcIdx + 1]
        rgba[dstIdx + 2] = currentRow[srcIdx + 2]
        rgba[dstIdx + 3] = 255
      }
    }

    prevRow = currentRow
  }

  return { width, height, data: rgba }
}

// Encontra a bounding box do conteúdo não transparente
function getBoundingBox(image, alphaThreshold = 10) {
  let minX = image.width
  let minY = image.height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const idx = (y * image.width + x) * 4
      const a = image.data[idx + 3]
      if (a > alphaThreshold) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX === -1) {
    return { x: 0, y: 0, width: image.width, height: image.height }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

// Redimensionamento de alta qualidade com interpolação bilinear e alpha-blending
function createIcon({
  srcImage,
  targetSize,
  safeMarginRatio = 0.16, // margem segura recomendada para PWA / iOS (16% em cada borda => 68% para o logo)
  bgColor = [0x06, 0x13, 0x25], // Fundo institucional sólido #061325
  bbox = null,
}) {
  const box = bbox || getBoundingBox(srcImage)
  const outBuf = Buffer.alloc(targetSize * targetSize * 4)

  // Preenche todo o buffer com o fundo sólido institucional #061325 (opaco, alfa = 255)
  for (let i = 0; i < targetSize * targetSize; i++) {
    const idx = i * 4
    outBuf[idx] = bgColor[0]
    outBuf[idx + 1] = bgColor[1]
    outBuf[idx + 2] = bgColor[2]
    outBuf[idx + 3] = 255 // Sólido sem transparência para iOS e PWA maskable
  }

  // Área disponível dentro do target para o logo centralizado
  const maxLogoWidth = targetSize * (1 - safeMarginRatio * 2)
  const maxLogoHeight = targetSize * (1 - safeMarginRatio * 2)

  const scale = Math.min(maxLogoWidth / box.width, maxLogoHeight / box.height)
  const scaledWidth = box.width * scale
  const scaledHeight = box.height * scale

  const startX = (targetSize - scaledWidth) / 2
  const startY = (targetSize - scaledHeight) / 2

  // Bilinear sampling com blending sobre a cor de fundo
  for (let dy = 0; dy < targetSize; dy++) {
    for (let dx = 0; dx < targetSize; dx++) {
      const srcX = (dx - startX) / scale + box.x
      const srcY = (dy - startY) / scale + box.y

      if (
        srcX >= box.x &&
        srcX <= box.x + box.width - 1 &&
        srcY >= box.y &&
        srcY <= box.y + box.height - 1
      ) {
        const x0 = Math.floor(srcX)
        const y0 = Math.floor(srcY)
        const x1 = Math.min(x0 + 1, srcImage.width - 1)
        const y1 = Math.min(y0 + 1, srcImage.height - 1)

        const wx = srcX - x0
        const wy = srcY - y0

        const idx00 = (y0 * srcImage.width + x0) * 4
        const idx10 = (y0 * srcImage.width + x1) * 4
        const idx01 = (y1 * srcImage.width + x0) * 4
        const idx11 = (y1 * srcImage.width + x1) * 4

        // Canais R, G, B, A interpolados
        const a00 = srcImage.data[idx00 + 3] / 255
        const a10 = srcImage.data[idx10 + 3] / 255
        const a01 = srcImage.data[idx01 + 3] / 255
        const a11 = srcImage.data[idx11 + 3] / 255

        // Pre-multiplied alpha para evitar fringing escuro nas bordas
        const r00 = srcImage.data[idx00] * a00
        const g00 = srcImage.data[idx00 + 1] * a00
        const b00 = srcImage.data[idx00 + 2] * a00

        const r10 = srcImage.data[idx10] * a10
        const g10 = srcImage.data[idx10 + 1] * a10
        const b10 = srcImage.data[idx10 + 2] * a10

        const r01 = srcImage.data[idx01] * a01
        const g01 = srcImage.data[idx01 + 1] * a01
        const b01 = srcImage.data[idx01 + 2] * a01

        const r11 = srcImage.data[idx11] * a11
        const g11 = srcImage.data[idx11 + 1] * a11
        const b11 = srcImage.data[idx11 + 2] * a11

        const topR = r00 * (1 - wx) + r10 * wx
        const topG = g00 * (1 - wx) + g10 * wx
        const topB = b00 * (1 - wx) + b10 * wx
        const topA = a00 * (1 - wx) + a10 * wx

        const botR = r01 * (1 - wx) + r11 * wx
        const botG = g01 * (1 - wx) + g11 * wx
        const botB = b01 * (1 - wx) + b11 * wx
        const botA = a01 * (1 - wx) + a11 * wx

        const interpR = topR * (1 - wy) + botR * wy
        const interpG = topG * (1 - wy) + botG * wy
        const interpB = topB * (1 - wy) + botB * wy
        const alpha = topA * (1 - wy) + botA * wy

        const dstIdx = (dy * targetSize + dx) * 4

        if (alpha > 0.001) {
          // Normaliza as cores pre-multiplicadas e mistura sobre o fundo institucional #061325
          const finalR = Math.round(interpR + bgColor[0] * (1 - alpha))
          const finalG = Math.round(interpG + bgColor[1] * (1 - alpha))
          const finalB = Math.round(interpB + bgColor[2] * (1 - alpha))

          outBuf[dstIdx] = Math.min(255, Math.max(0, finalR))
          outBuf[dstIdx + 1] = Math.min(255, Math.max(0, finalG))
          outBuf[dstIdx + 2] = Math.min(255, Math.max(0, finalB))
          outBuf[dstIdx + 3] = 255
        }
      }
    }
  }

  return encodePngRgba(targetSize, targetSize, outBuf)
}

export function generateAllIcons() {
  const logoPath = path.resolve('src/assets/delfos-solar-c6f93.png')
  const fileBuf = fs.readFileSync(logoPath)
  const srcImage = decodePng(fileBuf)
  const bbox = getBoundingBox(srcImage)

  // 1. apple-touch-icon.png (180x180) - iOS
  // Para iOS safe-area e cantos arredondados automáticos, margem segura de ~15%
  const appleIcon = createIcon({
    srcImage,
    targetSize: 180,
    safeMarginRatio: 0.15,
    bbox,
  })
  fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), appleIcon)

  // 2. icon-192.png (192x192) - Android PWA
  const icon192 = createIcon({
    srcImage,
    targetSize: 192,
    safeMarginRatio: 0.16,
    bbox,
  })
  fs.writeFileSync(path.resolve('public/icon-192.png'), icon192)

  // 3. icon-512.png (512x512) - PWA Splash & Maskable
  // Margem segura de 18% para atender perfeitamente a safe zone de ícones maskable do W3C
  const icon512 = createIcon({
    srcImage,
    targetSize: 512,
    safeMarginRatio: 0.18,
    bbox,
  })
  fs.writeFileSync(path.resolve('public/icon-512.png'), icon512)

  // 4. favicon-32x32.png (32x32) - fallback para navegadores antigos
  const favicon32 = createIcon({
    srcImage,
    targetSize: 32,
    safeMarginRatio: 0.12,
    bbox,
  })
  fs.writeFileSync(path.resolve('public/favicon-32x32.png'), favicon32)

  // Também salvar como favicon.png por conveniência
  fs.writeFileSync(path.resolve('public/favicon.png'), favicon32)

  console.log('Todos os PNGs foram gerados com sucesso em public/!')
}

generateAllIcons()
