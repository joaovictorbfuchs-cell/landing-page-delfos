import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

function readPng(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47 || buffer.readUInt32BE(4) !== 0x0d0a1a0a) {
    throw new Error('Invalid PNG signature')
  }

  let offset = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let colorType = 0
  let compressionMethod = 0
  let filterMethod = 0
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
      compressionMethod = data[10]
      filterMethod = data[11]
      interlaceMethod = data[12]
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    } else if (type === 'IEND') {
      break
    }
  }

  console.log({ width, height, bitDepth, colorType, interlaceMethod, idatCount: idatChunks.length })

  if (interlaceMethod !== 0) throw new Error('Interlaced PNG not supported')
  if (bitDepth !== 8) throw new Error(`Unsupported bit depth: ${bitDepth}`)
  if (colorType !== 6 && colorType !== 2) throw new Error(`Unsupported color type: ${colorType}`)

  const compressed = Buffer.concat(idatChunks)
  const decompressed = zlib.inflateSync(compressed)

  const bpp = colorType === 6 ? 4 : 3
  const rowBytes = width * bpp
  const expectedLength = height * (1 + rowBytes)

  if (decompressed.length !== expectedLength) {
    throw new Error(
      `Unexpected decompressed length: got ${decompressed.length}, expected ${expectedLength}`,
    )
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
        throw new Error(`Unknown filter type: ${filter}`)
      }
      currentRow[x] = val
    }

    // Copy currentRow into RGBA buffer
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

const paths = [
  'src/assets/imagemgerada1793232546020-bf0d0.png',
  'src/assets/delfos-solar-c6f93.png',
]

for (const p of paths) {
  const fullP = path.resolve(p)
  if (fs.existsSync(fullP)) {
    const fileBuf = fs.readFileSync(fullP)
    const decoded = readPng(fileBuf)
    console.log(`Decoded ${p} successfully:`, {
      width: decoded.width,
      height: decoded.height,
      dataLength: decoded.data.length,
    })
  } else {
    console.log(`File not found: ${p}`)
  }
}
