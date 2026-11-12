import type { CaseRecord, MediaRecord } from '@/types/content'

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
      // Se for número ou sigla (ex: BESS, KWP, RS, etc)
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

/** Quanto o nome do arquivo casou com o projeto: 'confiavel' | 'duvidoso' | 'nenhum'. */
export type NivelMatch = 'confiavel' | 'duvidoso' | 'nenhum'

/** Uma opção de vínculo apresentada no modal de revisão da vinculação automática. */
export interface OpcaoVinculo {
  case: CaseRecord
  motivo: string
}

/**
 * Devolve TODOS os projetos cujo cliente/título/slug casam com o nome do arquivo
 * (identificador único de cliente: só é confiável quando bate exatamente um projeto).
 */
export function findMatchingCases(identifier: string, casesList: CaseRecord[]): CaseRecord[] {
  if (!identifier || !casesList || casesList.length === 0) return []
  const normId = normalizeString(identifier)
  return casesList.filter((c) => {
    const cNome = normalizeString(c.cliente || '')
    const cTit = normalizeString(c.titulo || '')
    const cSlug = normalizeString(c.slug || '')
    const cLocal = normalizeString(c.local || '')
    if (cNome && cNome.length >= 3 && normId.includes(cNome)) return true
    if (cTit && cTit.length >= 4 && normId.includes(cTit)) return true
    if (cSlug && cSlug.length >= 4 && normId.includes(cSlug)) return true
    if (cLocal && cLocal.length >= 4 && normId.includes(cLocal)) return true
    return false
  })
}

/**
 * Classifica o casamento de UMA foto com os projetos publicados:
 * - confiável: exatamente um projeto casa com o nome do arquivo
 * - duvidoso: mais de um projeto casa (ambiguidade) ou nenhum casa (sem sinal)
 * Nunca sugere descarte: duvidoso significa "precisa de decisão humana".
 */
export function classificarVinculoMedia(
  media: MediaRecord,
  casesList: CaseRecord[],
): { nivel: NivelMatch; candidatos: CaseRecord[] } {
  const identifier = media.arquivo || media.titulo || ''
  const candidatos = findMatchingCases(identifier, casesList)
  if (candidatos.length === 1) return { nivel: 'confiavel', candidatos }
  return { nivel: candidatos.length > 1 ? 'duvidoso' : 'nenhum', candidatos }
}

/** Itens para o modal de revisão: fotos sem projeto que casaram com algum projeto. */
export interface ItemVinculacaoPendente {
  media: MediaRecord
  candidatos: CaseRecord[]
  motivo: string
}

/**
 * Status de vínculo de UMA foto com um projeto:
 * - 'publicado': case_id aponta para um projeto publicado (verde)
 * - 'rascunho': case_id aponta para um projeto em rascunho (cinza)
 * - 'sem-vinculo': sem case_id ou o projeto vinculado não existe mais (âmbar)
 */
export type StatusVinculoMedia = 'publicado' | 'rascunho' | 'sem-vinculo'

/**
 * Lê o status de vínculo da foto a partir do case_id e do status do projeto
 * vinculado. Não altera nada: é só leitura, para selo e filtros da Biblioteca.
 */
export function statusVinculoMedia(
  media: MediaRecord,
  casesList: CaseRecord[],
): StatusVinculoMedia {
  if (!media.case_id) return 'sem-vinculo'
  const vinculado = casesList.find((c) => c.id === media.case_id)
  if (!vinculado) return 'sem-vinculo'
  return vinculado.status === 'publicado' ? 'publicado' : 'rascunho'
}
