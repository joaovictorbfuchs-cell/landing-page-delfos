import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const fileBuf = fs.readFileSync(path.resolve('src/assets/imagemgerada1793232546020-ef8fc.png'))

// Ler dimensões básicas PNG
const width = fileBuf.readUInt32BE(16)
const height = fileBuf.readUInt32BE(20)
const bitDepth = fileBuf[24]
const colorType = fileBuf[25]

// Análise concluída
