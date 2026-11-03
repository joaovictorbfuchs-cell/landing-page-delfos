import type { MediaRecord } from '@/types/content'
import { getMediaFileUrl } from '@/services/content'
import { formatFilenameToTitle } from './mediaMatchUtils'

/**
 * Baixa o arquivo de uma mídia da biblioteca e o transforma em File,
 * permitindo usá-lo como foto de case sem o usuário precisar reenviar
 * o arquivo manualmente (a cópia é feita pelo navegador no salvamento).
 */
export async function fetchMediaAsFile(media: MediaRecord): Promise<File | null> {
  const url = getMediaFileUrl(media)
  if (!url) return null

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Falha ao baixar a imagem da biblioteca (HTTP ${res.status}).`)
  }
  const blob = await res.blob()
  const type = blob.type || 'image/jpeg'
  const name = media.arquivo || `foto-${media.id}.jpg`
  return new File([blob], name, { type })
}

function titleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word, idx) => {
      if (idx > 0 && /^[a-zA-Z]{2,4}$/.test(word) && word === word.toUpperCase()) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export interface CaseDerivadoDeMedia {
  titulo: string
  cliente: string
  local: string
  slugBase: string
}

/**
 * Deriva título, cliente e local (destino) a partir do nome do arquivo de mídia,
 * seguindo o padrão usado no site: cliente_cidade.jpg / cliente-cidade.jpg.
 * Ex.: "cassul_erechim.jpg" → cliente "Cassul", local "Erechim".
 */
export function deriveCaseFromMedia(media: MediaRecord): CaseDerivadoDeMedia {
  const base = (media.arquivo || media.titulo || '').replace(/\.[^/.]+$/, '')
  const tokens = base.split(/[-_\s]+/).filter(Boolean)

  const cliente = tokens.length > 0 ? titleCase(tokens[0]) : ''
  const local = tokens.length > 1 ? titleCase(tokens.slice(1).join(' ')) : ''

  return {
    titulo: formatFilenameToTitle(base) || 'Novo Case',
    cliente,
    local,
    slugBase:
      base
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `case-${media.id}`,
  }
}

/**
 * Garante slug único entre os cases existentes (adiciona sufixo -2, -3...).
 */
export function gerarSlugUnico(slugBase: string, casesExistentes: Array<{ slug: string }>): string {
  const slugs = new Set(casesExistentes.map((c) => c.slug))
  if (!slugs.has(slugBase)) return slugBase
  let n = 2
  while (slugs.has(`${slugBase}-${n}`)) n += 1
  return `${slugBase}-${n}`
}
