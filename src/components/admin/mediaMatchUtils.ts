import type { CaseRecord } from '@/types/content'

/**
 * Converte o nome de um arquivo em um título legível e amigável:
 * - remove a extensão
 * - substitui hífens e underscores por espaços
 * - limpa espaços duplicados
 * - capitaliza palavras ou a primeira letra
 */
export function formatFilenameToTitle(filename: string): string {
  // Remove extensão
  const base = filename.replace(/\.[^/.]+$/, '')
  // Substitui separadores comuns (_ e -) por espaço
  const cleaned = base.replace(/[-_]+/g, ' ').trim()
  if (!cleaned) return filename

  // Capitaliza a primeira letra e preserva termos técnicos conhecidos
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((word, idx) => {
      // Se for a primeira palavra ou termo relevante, garante primeira maiúscula
      if (idx === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      // Se for número ou sigla (ex: BESS, EPC, KWP, RS, etc)
      if (/^[a-zA-Z]{2,4}$/.test(word) && word === word.toUpperCase()) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

/**
 * Remove acentos e caracteres especiais para comparação flexível
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Encontra o case correspondente baseado no nome do arquivo ou título
 * Usa a mesma lógica do AdminMediaTab (comparando cliente, título, local ou slug)
 */
export function findMatchingCase(
  identifier: string,
  casesList: CaseRecord[],
): CaseRecord | undefined {
  if (!identifier || !casesList || casesList.length === 0) return undefined

  const normId = normalizeString(identifier)

  return casesList.find((c) => {
    const cNome = normalizeString(c.cliente || '')
    const cTit = normalizeString(c.titulo || '')
    const cSlug = normalizeString(c.slug || '')
    const cLocal = normalizeString(c.local || '')

    // Match se o identificador contém o nome do cliente (com pelo menos 3 chars para evitar falsos positivos)
    if (cNome && cNome.length >= 3 && normId.includes(cNome)) return true
    if (cTit && cTit.length >= 4 && normId.includes(cTit)) return true
    if (cSlug && cSlug.length >= 4 && normId.includes(cSlug)) return true
    if (cLocal && cLocal.length >= 4 && normId.includes(cLocal)) return true

    // Caso o cliente seja algo como "Cassul", "Triel", "Aurora", etc
    return false
  })
}

/**
 * Gera a string de destino sugerido padrão para um case encontrado
 */
export function buildDestinoSugerido(caseItem?: CaseRecord): string {
  if (!caseItem) return ''
  const nome = caseItem.cliente || caseItem.titulo
  const setor = caseItem.setor || 'Solar'
  const potencia = caseItem.potencia_capacidade ? ` (${caseItem.potencia_capacidade})` : ''
  return `Case ${nome}${potencia} / ${setor}`
}
