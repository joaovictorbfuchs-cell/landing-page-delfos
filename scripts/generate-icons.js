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
  const newImgPath = path.resolve('src/assets/imagemgerada1793232546020-bf0d0.png')
  const newBuf = fs.readFileSync(newImgPath)
  const newImg = decodePng(newBuf)

  const samplePixel = (x, y) => {
    const idx = (y * newImg.width + x) * 4
    return [newImg.data[idx], newImg.data[idx + 1], newImg.data[idx + 2], newImg.data[idx + 3]]
  }

  // Find non-black bounding box
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

  // Find blue text color and bounding box of text vs arcs
  // Amostragem de pixels e cores do texto delfos
  // No anexo o fundo é preto (#000000) e os elementos têm cores bem definidas
  let textMinX = newImg.width,
    textMaxX = 0,
    textMinY = newImg.height,
    textMaxY = 0

  for (let y = 286; y <= 665; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const p = samplePixel(x, y)
      // Azul característico da palavra delfos:
      if (p[2] > 80 && p[2] > p[0] * 1.3 && p[2] >= p[1] * 0.9) {
        if (x < textMinX) textMinX = x
        if (x > textMaxX) textMaxX = x
        if (y < textMinY) textMinY = y
        if (y > textMaxY) textMaxY = y
      }
    }
  }

  // Top arc boundaries (y from 0 to textMinY):
  let topArcMinX = newImg.width,
    topArcMaxX = 0,
    topArcMinY = newImg.height,
    topArcMaxY = 0
  for (let y = 0; y < textMinY; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const p = samplePixel(x, y)
      if (p[0] > 15 || p[1] > 15 || p[2] > 15) {
        if (x < topArcMinX) topArcMinX = x
        if (x > topArcMaxX) topArcMaxX = x
        if (y < topArcMinY) topArcMinY = y
        if (y > topArcMaxY) topArcMaxY = y
      }
    }
  }

  // Bottom arc boundaries (y from textMaxY to height):
  let botArcMinX = newImg.width,
    botArcMaxX = 0,
    botArcMinY = newImg.height,
    botArcMaxY = 0
  for (let y = textMaxY + 1; y < newImg.height; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const p = samplePixel(x, y)
      if (p[0] > 15 || p[1] > 15 || p[2] > 15) {
        if (x < botArcMinX) botArcMinX = x
        if (x > botArcMaxX) botArcMaxX = x
        if (y < botArcMinY) botArcMinY = y
        if (y > botArcMaxY) botArcMaxY = y
      }
    }
  }

  const arcSamples = {
    topArc: {
      leftTip: samplePixel(15, 280),
      p10: samplePixel(150, 150),
      p25: samplePixel(380, 70),
      p50: samplePixel(750, 30),
      p75: samplePixel(1150, 70),
      p90: samplePixel(1380, 150),
      rightTip: samplePixel(1510, 280),
    },
    botArc: {
      leftTip: samplePixel(15, 670),
      p10: samplePixel(150, 780),
      p25: samplePixel(380, 860),
      p50: samplePixel(750, 900),
      p75: samplePixel(1150, 860),
      p90: samplePixel(1380, 780),
      rightTip: samplePixel(1495, 670),
    },
    letters: {
      d: samplePixel(100, 480),
      e: samplePixel(400, 480),
      l: samplePixel(680, 480),
      f: samplePixel(850, 480),
      o: samplePixel(1100, 480),
      s: samplePixel(1400, 480),
    },
  }

  const croppedW =
    Math.max(topArcMaxX, botArcMaxX, textMaxX) - Math.min(topArcMinX, botArcMinX, textMinX) + 1
  const croppedH = botArcMaxY - topArcMinY + 1
  const startCropX = Math.min(topArcMinX, botArcMinX, textMinX)
  const startCropY = topArcMinY

  const transparentBuf = Buffer.alloc(croppedW * croppedH * 4)
  for (let y = 0; y < croppedH; y++) {
    for (let x = 0; x < croppedW; x++) {
      const srcX = startCropX + x
      const srcY = startCropY + y
      const p = samplePixel(srcX, srcY)
      const dstIdx = (y * croppedW + x) * 4

      // Fundo preto puro: desmuting com anti-aliasing suave
      const maxC = Math.max(p[0], p[1], p[2])
      let alpha = 0
      if (maxC > 30) {
        alpha = 255
      } else if (maxC > 6) {
        alpha = Math.round(((maxC - 6) / 24) * 255)
      }

      if (alpha > 0) {
        transparentBuf[dstIdx] = p[0]
        transparentBuf[dstIdx + 1] = p[1]
        transparentBuf[dstIdx + 2] = p[2]
        transparentBuf[dstIdx + 3] = alpha
      } else {
        transparentBuf[dstIdx] = 0
        transparentBuf[dstIdx + 1] = 0
        transparentBuf[dstIdx + 2] = 0
        transparentBuf[dstIdx + 3] = 0
      }
    }
  }

  const encodedTransparent = encodePngRgba(croppedW, croppedH, transparentBuf)
  fs.writeFileSync(path.resolve('src/assets/delfos-logo-transparent.png'), encodedTransparent)

  // Write a marker in public/icons-timestamp.txt so we can verify the icons were updated
  fs.writeFileSync(path.resolve('public/icons-timestamp.txt'), String(Date.now()))

  // Let's trace letter outlines and arc geometries precisely:
  // Find contours/boxes for each letter d, e, l, f, o, s
  // In the region textYStart to textYEnd (286 to 665):
  const letterColumns = []
  for (let x = 0; x < croppedW; x++) {
    let blueCount = 0
    for (let y = 286; y <= 665; y++) {
      const p = samplePixel(startCropX + x, y)
      if (p[0] < 50 && p[2] > 110 && p[1] < 140) {
        blueCount++
      }
    }
    letterColumns.push(blueCount)
  }

  // Find arcs outer and inner curves
  // Top arc: for each x from 0 to croppedW: find highest y (outer edge) and lowest y (inner edge)
  const topArcProfile = []
  for (let x = 0; x < croppedW; x += 10) {
    let minY = null,
      maxY = null
    for (let y = 0; y <= 286; y++) {
      const p = samplePixel(startCropX + x, y)
      if (p[0] > 20 || p[1] > 20 || p[2] > 20) {
        if (minY === null) minY = y
        maxY = y
      }
    }
    if (minY !== null) topArcProfile.push({ x, minY, maxY })
  }

  const botArcProfile = []
  for (let x = 0; x < croppedW; x += 10) {
    let minY = null,
      maxY = null
    for (let y = 665; y <= 935; y++) {
      const p = samplePixel(startCropX + x, y)
      if (p[0] > 20 || p[1] > 20 || p[2] > 20) {
        if (minY === null) minY = y
        maxY = y
      }
    }
    if (minY !== null) botArcProfile.push({ x, minY, maxY })
  }

  fs.writeFileSync(
    path.resolve('public/arc-profiles.json'),
    JSON.stringify(
      {
        croppedW,
        croppedH,
        topArcProfile: topArcProfile.filter((_, idx) => idx % 5 === 0),
        botArcProfile: botArcProfile.filter((_, idx) => idx % 5 === 0),
      },
      null,
      2,
    ),
  )

  // Trace pixel contours for letter glyphs:
  // Let's find bounds of each letter in delfos:
  // d, e, l, f, o, s
  let inLetter = false
  let letterRanges = []
  let curStart = 0
  for (let x = 0; x < letterColumns.length; x++) {
    if (!inLetter && letterColumns[x] > 5) {
      inLetter = true
      curStart = x
    } else if (inLetter && letterColumns[x] <= 5) {
      inLetter = false
      if (x - curStart > 20) {
        letterRanges.push({ start: curStart, end: x - 1, w: x - curStart })
      }
    }
  }
  if (inLetter) {
    letterRanges.push({
      start: curStart,
      end: letterColumns.length - 1,
      w: letterColumns.length - curStart,
    })
  }

  fs.writeFileSync(path.resolve('public/letters.json'), JSON.stringify(letterRanges, null, 2))
  // Detailed letter boundaries:
  // For each letter in delfos, let's sample the exact letter bounds:
  const letterBoundsDetailed = []
  for (let i = 0; i < letterRanges.length; i++) {
    const range = letterRanges[i]
    let topY = 9999,
      botY = -1
    for (let x = range.start; x <= range.end; x++) {
      for (let y = 286; y <= 665; y++) {
        const p = samplePixel(startCropX + x, y)
        if (p[0] < 50 && p[2] > 110 && p[1] < 140) {
          if (y < topY) topY = y
          if (y > botY) botY = y
        }
      }
    }
    letterBoundsDetailed.push({
      index: i,
      xStart: range.start,
      xEnd: range.end,
      w: range.w,
      topY,
      botY,
      h: botY - topY + 1,
    })
  }

  fs.writeFileSync(
    path.resolve('public/letter-bounds.json'),
    JSON.stringify(letterBoundsDetailed, null, 2),
  )
  fs.writeFileSync(
    path.resolve('public/sample-info.json'),
    JSON.stringify(
      {
        width: newImg.width,
        height: newImg.height,
        minX,
        minY,
        maxX,
        maxY,
        croppedW,
        croppedH,
        textMinX,
        textMaxX,
        textMinY,
        textMaxY,
        topArcMinX,
        topArcMaxX,
        topArcMinY,
        topArcMaxY,
        botArcMinX,
        botArcMaxX,
        botArcMinY,
        botArcMaxY,
        dSample: samplePixel(160, 480),
        eSample: samplePixel(460, 480),
        lSample: samplePixel(670, 480),
        fSample: samplePixel(860, 480),
        oSample: samplePixel(1080, 480),
        sSample: samplePixel(1380, 480),
      },
      null,
      2,
    ),
  )
  fs.writeFileSync(path.resolve('public/image-analysis.json'), JSON.stringify(arcSamples, null, 2))
  // Usar a nova imagem recortada e transparente para gerar todos os ícones PWA/Favicon
  const newTransparentImg = decodePng(encodedTransparent)
  const newBbox = getBoundingBox(newTransparentImg)

  // 1. apple-touch-icon.png (180x180) - iOS
  const appleIcon = createIcon({
    srcImage: newTransparentImg,
    targetSize: 180,
    safeMarginRatio: 0.12,
    bbox: newBbox,
  })
  fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), appleIcon)

  // 2. icon-192.png (192x192) - Android PWA
  const icon192 = createIcon({
    srcImage: newTransparentImg,
    targetSize: 192,
    safeMarginRatio: 0.14,
    bbox: newBbox,
  })
  fs.writeFileSync(path.resolve('public/icon-192.png'), icon192)

  // 3. icon-512.png (512x512) - PWA Splash & Maskable
  const icon512 = createIcon({
    srcImage: newTransparentImg,
    targetSize: 512,
    safeMarginRatio: 0.16,
    bbox: newBbox,
  })
  fs.writeFileSync(path.resolve('public/icon-512.png'), icon512)

  // 4. favicon-32x32.png (32x32)
  const favicon32 = createIcon({
    srcImage: newTransparentImg,
    targetSize: 32,
    safeMarginRatio: 0.08,
    bbox: newBbox,
  })
  fs.writeFileSync(path.resolve('public/favicon-32x32.png'), favicon32)
  fs.writeFileSync(path.resolve('public/favicon.png'), favicon32)

  // 5. favicon.ico
  fs.writeFileSync(path.resolve('public/favicon.ico'), favicon32)

  // 4b. Favicon SVG atualizado com o PNG oficial embutido em alta resolução Base64 (nítido em qualquer tamanho e 100% idêntico)
  const logoBase64 = encodedTransparent.toString('base64')
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="fav-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B2447" />
      <stop offset="100%" stop-color="#061325" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#fav-bg)" />
  <rect width="126" height="126" x="1" y="1" rx="27" fill="none" stroke="#FDE107" stroke-width="1.2" stroke-opacity="0.35" />
  <image
    href="data:image/png;base64,${logoBase64}"
    x="14"
    y="28"
    width="100"
    height="72"
    preserveAspectRatio="xMidYMid meet"
  />
</svg>`
  fs.writeFileSync(path.resolve('public/favicon.svg'), faviconSvg)

  // Salvar cópia do asset recortado transparente em public/ e src/assets/
  fs.writeFileSync(path.resolve('public/delfos-logo.png'), encodedTransparent)
  fs.writeFileSync(path.resolve('src/assets/delfos-logo-transparent.png'), encodedTransparent)

  // 6. Atualizar og-image.png (1200x630 padrão OpenGraph / Twitter Cards)
  // Com o logo oficial novo centralizado e fundo institucional #061325
  const ogW = 1200
  const ogH = 630
  const ogBuf = Buffer.alloc(ogW * ogH * 4)
  for (let i = 0; i < ogW * ogH; i++) {
    const idx = i * 4
    ogBuf[idx] = 0x06
    ogBuf[idx + 1] = 0x13
    ogBuf[idx + 2] = 0x25
    ogBuf[idx + 3] = 255
  }

  // Escalar newTransparentImg para caber em ~720x440 no centro do og-image
  const targetOgLogoW = 750
  const targetOgLogoH = 460
  const scaleOg = Math.min(targetOgLogoW / newBbox.width, targetOgLogoH / newBbox.height)
  const scaledOgW = newBbox.width * scaleOg
  const scaledOgH = newBbox.height * scaleOg
  const startOgX = (ogW - scaledOgW) / 2
  const startOgY = (ogH - scaledOgH) / 2 - 15

  for (let dy = 0; dy < ogH; dy++) {
    for (let dx = 0; dx < ogW; dx++) {
      const srcX = (dx - startOgX) / scaleOg + newBbox.x
      const srcY = (dy - startOgY) / scaleOg + newBbox.y
      if (
        srcX >= newBbox.x &&
        srcX <= newBbox.x + newBbox.width - 1 &&
        srcY >= newBbox.y &&
        srcY <= newBbox.y + newBbox.height - 1
      ) {
        const x0 = Math.floor(srcX)
        const y0 = Math.floor(srcY)
        const idx = (y0 * newTransparentImg.width + x0) * 4
        const a = newTransparentImg.data[idx + 3] / 255
        if (a > 0.01) {
          const dstIdx = (dy * ogW + dx) * 4
          ogBuf[dstIdx] = Math.round(newTransparentImg.data[idx] * a + ogBuf[dstIdx] * (1 - a))
          ogBuf[dstIdx + 1] = Math.round(
            newTransparentImg.data[idx + 1] * a + ogBuf[dstIdx + 1] * (1 - a),
          )
          ogBuf[dstIdx + 2] = Math.round(
            newTransparentImg.data[idx + 2] * a + ogBuf[dstIdx + 2] * (1 - a),
          )
          ogBuf[dstIdx + 3] = 255
        }
      }
    }
  }
  const ogPng = encodePngRgba(ogW, ogH, ogBuf)
  fs.writeFileSync(path.resolve('public/og-image.png'), ogPng)

  console.log('Todos os PNGs, Favicons, ICO e og-image foram gerados com sucesso em public/!')
}

generateAllIcons()
