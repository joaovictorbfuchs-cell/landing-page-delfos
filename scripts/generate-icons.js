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
  bgColor = [0x08, 0x1b, 0x30], // Fundo institucional sólido #081B30 da marca
  bbox = null,
}) {
  const box = bbox || getBoundingBox(srcImage)
  const outBuf = Buffer.alloc(targetSize * targetSize * 4)

  // Preenche todo o buffer com o fundo sólido institucional #081B30
  for (let i = 0; i < targetSize * targetSize; i++) {
    const idx = i * 4
    outBuf[idx] = bgColor[0]
    outBuf[idx + 1] = bgColor[1]
    outBuf[idx + 2] = bgColor[2]
    outBuf[idx + 3] = 255
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

// Cria um arquivo ICO simples com 1 ou mais imagens PNG embutidas (suportado por todos os navegadores modernos)
function createIcoFromPngs(pngEntries) {
  // Cabeçalho ICO: 6 bytes (Reserved=0 (2b), Type=1 (2b, 1=icon), Count (2b))
  const count = pngEntries.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)

  const dirEntries = []
  let offset = 6 + count * 16

  for (const entry of pngEntries) {
    const dir = Buffer.alloc(16)
    dir.writeUInt8(entry.width >= 256 ? 0 : entry.width, 0)
    dir.writeUInt8(entry.height >= 256 ? 0 : entry.height, 1)
    dir.writeUInt8(0, 2) // Color count (0 se >= 8bpp)
    dir.writeUInt8(0, 3) // Reserved
    dir.writeUInt16LE(1, 4) // Color planes
    dir.writeUInt16LE(32, 6) // Bits per pixel
    dir.writeUInt32LE(entry.data.length, 8) // Size of image data
    dir.writeUInt32LE(offset, 12) // Offset of image data
    offset += entry.data.length
    dirEntries.push(dir)
  }

  const parts = [header, ...dirEntries, ...pngEntries.map((e) => e.data)]
  return Buffer.concat(parts)
}

export function generateAllIcons() {
  const newImgPath = path.resolve('src/assets/imagemgerada1793232546020-bf0d0.png')
  const newBuf = fs.readFileSync(newImgPath)
  const newImg = decodePng(newBuf)

  const samplePixel = (x, y) => {
    const idx = (y * newImg.width + x) * 4
    return [newImg.data[idx], newImg.data[idx + 1], newImg.data[idx + 2], newImg.data[idx + 3]]
  }

  // Identificação dos limites do logo completo
  let minX = newImg.width,
    minY = newImg.height,
    maxX = -1,
    maxY = -1
  for (let y = 0; y < newImg.height; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const idx = (y * newImg.width + x) * 4
      const r = newImg.data[idx],
        g = newImg.data[idx + 1],
        b = newImg.data[idx + 2]
      if (r > 15 || g > 15 || b > 15) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  const croppedW = maxX - minX + 1
  const croppedH = maxY - minY + 1
  const startCropX = minX
  const startCropY = minY

  // 1. Buffer transparente do LOGO COMPLETO (arcos + texto "delfos")
  const fullTransparentBuf = Buffer.alloc(croppedW * croppedH * 4)
  // 2. Buffer transparente APENAS DOS ARCOS (sem a palavra "delfos") para o FAVICON DA ABA
  const arcsOnlyTransparentBuf = Buffer.alloc(croppedW * croppedH * 4)

  for (let y = 0; y < croppedH; y++) {
    for (let x = 0; x < croppedW; x++) {
      const srcX = startCropX + x
      const srcY = startCropY + y
      const p = samplePixel(srcX, srcY)
      const dstIdx = (y * croppedW + x) * 4

      const maxC = Math.max(p[0], p[1], p[2])
      let alpha = 0
      if (maxC > 30) {
        alpha = 255
      } else if (maxC > 6) {
        alpha = Math.round(((maxC - 6) / 24) * 255)
      }

      if (alpha > 0) {
        fullTransparentBuf[dstIdx] = p[0]
        fullTransparentBuf[dstIdx + 1] = p[1]
        fullTransparentBuf[dstIdx + 2] = p[2]
        fullTransparentBuf[dstIdx + 3] = alpha

        // Detecta se o pixel faz parte da palavra "delfos" (região central y ~ 286..665 e cor azul)
        // No anexo, a palavra delfos é em azul cobalto #015BA1 e fica entre os dois arcos
        const isCenterY = srcY >= 286 && srcY <= 665
        const isBlueText = isCenterY && p[2] > 70 && p[2] > p[0] * 1.25 && p[1] < 155

        if (!isBlueText) {
          arcsOnlyTransparentBuf[dstIdx] = p[0]
          arcsOnlyTransparentBuf[dstIdx + 1] = p[1]
          arcsOnlyTransparentBuf[dstIdx + 2] = p[2]
          arcsOnlyTransparentBuf[dstIdx + 3] = alpha
        } else {
          arcsOnlyTransparentBuf[dstIdx] = 0
          arcsOnlyTransparentBuf[dstIdx + 1] = 0
          arcsOnlyTransparentBuf[dstIdx + 2] = 0
          arcsOnlyTransparentBuf[dstIdx + 3] = 0
        }
      } else {
        fullTransparentBuf[dstIdx] = 0
        fullTransparentBuf[dstIdx + 1] = 0
        fullTransparentBuf[dstIdx + 2] = 0
        fullTransparentBuf[dstIdx + 3] = 0

        arcsOnlyTransparentBuf[dstIdx] = 0
        arcsOnlyTransparentBuf[dstIdx + 1] = 0
        arcsOnlyTransparentBuf[dstIdx + 2] = 0
        arcsOnlyTransparentBuf[dstIdx + 3] = 0
      }
    }
  }

  const fullTransparentPng = encodePngRgba(croppedW, croppedH, fullTransparentBuf)
  fs.writeFileSync(path.resolve('src/assets/delfos-logo-transparent.png'), fullTransparentPng)
  fs.writeFileSync(path.resolve('public/delfos-logo.png'), fullTransparentPng)

  const fullImg = decodePng(fullTransparentPng)
  const fullBbox = getBoundingBox(fullImg)

  const arcsImg = {
    width: croppedW,
    height: croppedH,
    data: arcsOnlyTransparentBuf,
  }
  const arcsBbox = getBoundingBox(arcsImg)

  // =========================================================================
  // REQUISITO 3: NÃO MUDAR ÍCONES GRANDES DE CELULAR (MANTÊM A ARTE COMPLETA)
  // apple-touch-icon (180x180), icon-192.png (192x192), icon-512.png (512x512)
  // =========================================================================

  // 1. apple-touch-icon.png (180x180) - iOS (arte completa arcos + delfos)
  const appleIcon = createIcon({
    srcImage: fullImg,
    targetSize: 180,
    safeMarginRatio: 0.12,
    bgColor: [0x08, 0x1b, 0x30],
    bbox: fullBbox,
  })
  fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), appleIcon)

  // 2. icon-192.png (192x192) - Android PWA (arte completa arcos + delfos)
  const icon192 = createIcon({
    srcImage: fullImg,
    targetSize: 192,
    safeMarginRatio: 0.14,
    bgColor: [0x08, 0x1b, 0x30],
    bbox: fullBbox,
  })
  fs.writeFileSync(path.resolve('public/icon-192.png'), icon192)

  // 3. icon-512.png (512x512) - PWA Splash & Maskable (arte completa arcos + delfos)
  const icon512 = createIcon({
    srcImage: fullImg,
    targetSize: 512,
    safeMarginRatio: 0.16,
    bgColor: [0x08, 0x1b, 0x30],
    bbox: fullBbox,
  })
  fs.writeFileSync(path.resolve('public/icon-512.png'), icon512)

  // =========================================================================
  // REQUISITO 1 & 2: REGENERAR APENAS OS ÍCONES PEQUENOS DA ABA DO NAVEGADOR
  // favicon.svg, favicon-32x32.png, favicon-32.png, favicon-16.png e favicon.ico
  // Todos mostrando SOMENTE os arcos em gradiente, sem texto, altamente legíveis em 16-32px!
  // =========================================================================

  // A. favicon-32x32.png e favicon-32.png (32x32) com os arcos
  const favicon32 = createIcon({
    srcImage: arcsImg,
    targetSize: 32,
    safeMarginRatio: 0.08, // Arcos ocupam boa parte do quadradinho para máxima legibilidade
    bgColor: [0x08, 0x1b, 0x30],
    bbox: arcsBbox,
  })
  fs.writeFileSync(path.resolve('public/favicon-32x32.png'), favicon32)
  fs.writeFileSync(path.resolve('public/favicon-32.png'), favicon32)
  fs.writeFileSync(path.resolve('public/favicon.png'), favicon32)

  // B. favicon-16.png (16x16) com os arcos
  const favicon16 = createIcon({
    srcImage: arcsImg,
    targetSize: 16,
    safeMarginRatio: 0.06,
    bgColor: [0x08, 0x1b, 0x30],
    bbox: arcsBbox,
  })
  fs.writeFileSync(path.resolve('public/favicon-16.png'), favicon16)

  // C. favicon.ico multi-resolução legítimo (16x16 e 32x32) com somente os arcos
  const faviconIco = createIcoFromPngs([
    { width: 32, height: 32, data: favicon32 },
    { width: 16, height: 16, data: favicon16 },
  ])
  fs.writeFileSync(path.resolve('public/favicon.ico'), faviconIco)

  // D. favicon.svg vetorial limpo com curvas perfeitas dos arcos em gradiente
  // Fundo escuro da marca (#081B30), borda suave dourada e os dois arcos em gradiente (sem texto)
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <!-- Fundo escuro oficial da marca Delfos Solar -->
    <linearGradient id="fav-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B2447" />
      <stop offset="100%" stop-color="#081B30" />
    </linearGradient>

    <!-- Gradiente Arco Superior: Azul cobalto -> Verde Esmeralda -> Amarelo Ouro Solar -->
    <linearGradient id="fav-top-arc" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#015BA1" />
      <stop offset="28%" stop-color="#17768A" />
      <stop offset="52%" stop-color="#5DA55F" />
      <stop offset="76%" stop-color="#C4C048" />
      <stop offset="100%" stop-color="#FDE107" />
    </linearGradient>

    <!-- Gradiente Arco Inferior: Amarelo Ouro Solar -> Verde Esmeralda -> Azul Cobalto -->
    <linearGradient id="fav-bot-arc" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#FFE304" />
      <stop offset="24%" stop-color="#C4C048" />
      <stop offset="48%" stop-color="#53A063" />
      <stop offset="72%" stop-color="#17768A" />
      <stop offset="100%" stop-color="#015BA1" />
    </linearGradient>

    <filter id="fav-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <!-- Fundo escuro com cantos arredondados padrão favicon moderno -->
  <rect width="128" height="128" rx="28" fill="url(#fav-bg)" />
  <rect width="126" height="126" x="1" y="1" rx="27" fill="none" stroke="#FDE107" stroke-width="1.2" stroke-opacity="0.35" />

  <!-- Arcos da marca Delfos Solar sem texto, ocupando área nobre e altamente legíveis em 16-32px -->
  <g filter="url(#fav-glow)" transform="translate(10, 20) scale(0.0704)">
    <!-- Arco Superior: M 15 285 C ... -->
    <path
      d="M 15 285 C 80 150, 410 5, 767 5 C 1124 5, 1450 150, 1513 285 C 1320 120, 1060 90, 767 90 C 474 90, 210 120, 15 285 Z"
      fill="url(#fav-top-arc)"
    />

    <!-- Arco Inferior: M 0 666 C ... -->
    <path
      d="M 0 666 C 210 825, 474 855, 767 855 C 1060 855, 1320 825, 1497 666 C 1450 805, 1124 935, 767 935 C 410 935, 80 805, 0 666 Z"
      fill="url(#fav-bot-arc)"
    />
  </g>
</svg>`
  fs.writeFileSync(path.resolve('public/favicon.svg'), faviconSvg)

  // 6. Atualizar og-image.png (1200x630 padrão OpenGraph / Twitter Cards)
  const ogW = 1200
  const ogH = 630
  const ogBuf = Buffer.alloc(ogW * ogH * 4)
  for (let i = 0; i < ogW * ogH; i++) {
    const idx = i * 4
    ogBuf[idx] = 0x08
    ogBuf[idx + 1] = 0x1b
    ogBuf[idx + 2] = 0x30
    ogBuf[idx + 3] = 255
  }

  const targetOgLogoW = 750
  const targetOgLogoH = 460
  const scaleOg = Math.min(targetOgLogoW / fullBbox.width, targetOgLogoH / fullBbox.height)
  const scaledOgW = fullBbox.width * scaleOg
  const scaledOgH = fullBbox.height * scaleOg
  const startOgX = (ogW - scaledOgW) / 2
  const startOgY = (ogH - scaledOgH) / 2 - 15

  for (let dy = 0; dy < ogH; dy++) {
    for (let dx = 0; dx < ogW; dx++) {
      const srcX = (dx - startOgX) / scaleOg + fullBbox.x
      const srcY = (dy - startOgY) / scaleOg + fullBbox.y
      if (
        srcX >= fullBbox.x &&
        srcX <= fullBbox.x + fullBbox.width - 1 &&
        srcY >= fullBbox.y &&
        srcY <= fullBbox.y + fullBbox.height - 1
      ) {
        const x0 = Math.floor(srcX)
        const y0 = Math.floor(srcY)
        const idx = (y0 * fullImg.width + x0) * 4
        const a = fullImg.data[idx + 3] / 255
        if (a > 0.01) {
          const dstIdx = (dy * ogW + dx) * 4
          ogBuf[dstIdx] = Math.round(fullImg.data[idx] * a + ogBuf[dstIdx] * (1 - a))
          ogBuf[dstIdx + 1] = Math.round(fullImg.data[idx + 1] * a + ogBuf[dstIdx + 1] * (1 - a))
          ogBuf[dstIdx + 2] = Math.round(fullImg.data[idx + 2] * a + ogBuf[dstIdx + 2] * (1 - a))
          ogBuf[dstIdx + 3] = 255
        }
      }
    }
  }
  const ogPng = encodePngRgba(ogW, ogH, ogBuf)
  fs.writeFileSync(path.resolve('public/og-image.png'), ogPng)

  fs.writeFileSync(path.resolve('public/icons-timestamp.txt'), String(Date.now()))
  console.log('Todos os ícones e favicons gerados com sucesso!')
}

generateAllIcons()
