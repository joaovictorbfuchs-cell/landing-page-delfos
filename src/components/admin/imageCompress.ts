/**
 * Compressão de imagem no cliente, antes do upload:
 * - redimensiona para no máximo 1600px na maior borda
 * - converte para WebP (qualidade 0.85)
 * Mantém o fluxo do usuário igual: o arquivo sai do input e já vai comprimido.
 * Em qualquer falha (navegador sem suporte, imagem corrompida etc.) devolve o
 * arquivo original — o upload nunca é bloqueado por causa da compressão.
 */
const MAX_BORDA = 1600
const QUALIDADE_WEBP = 0.85

export async function comprimirImagem(file: File): Promise<File> {
  if (!file || !file.type.startsWith('image/')) return file
  // GIF animado perde a animação ao redesenhar no canvas — mantém como está.
  if (file.type === 'image/gif') return file

  try {
    const bitmap = await createImageBitmap(file)
    const { width, height } = bitmap
    const escala = Math.min(1, MAX_BORDA / Math.max(width, height))
    const precisaConverter = file.type !== 'image/webp'

    if (escala === 1 && !precisaConverter) {
      bitmap.close()
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width * escala))
    canvas.height = Math.max(1, Math.round(height * escala))
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', QUALIDADE_WEBP),
    )
    if (!blob || blob.size === 0) return file

    const nomeBase = file.name.replace(/\.[^/.]+$/, '')
    return new File([blob], `${nomeBase}.webp`, { type: 'image/webp' })
  } catch (err) {
    console.warn('Compressão de imagem falhou, enviando o arquivo original:', err)
    return file
  }
}
