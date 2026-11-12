import pb from '@/lib/pocketbase/client'
import type {
  PostRecord,
  UpsertPostPayload,
  CaseRecord,
  UpsertCasePayload,
  MediaRecord,
  CreateMediaPayload,
  UpdateMediaPayload,
  UpdateMediaGaleriaPayload,
} from '@/types/content'

export type ImageSizeVariant = 'original' | 'grande' | 'leve' | string

// Helper para obter a URL pública de arquivos de uma coleção com suporte a versão otimizada
export function getPocketBaseFileUrl(
  collectionName: string,
  recordId: string,
  filename: string,
  variant?: ImageSizeVariant,
): string {
  if (!filename) return ''
  const baseUrl = `${pb.baseUrl}/api/files/${collectionName}/${recordId}/${filename}`
  if (!variant || variant === 'original') {
    return baseUrl
  }
  // Mapeamento dos formatos de thumb otimizados:
  // - grande: 1600x0 (~1600px de largura mantendo proporção)
  // - leve: 900x0 (~900px de largura para cards e galerias)
  const thumbParam = variant === 'grande' ? '1600x0' : variant === 'leve' ? '900x0' : variant
  return `${baseUrl}?thumb=${encodeURIComponent(thumbParam)}`
}

export function getPostImageUrl(post: PostRecord, variant: ImageSizeVariant = 'original'): string {
  if (!post.foto_capa) return ''
  return getPocketBaseFileUrl('posts', post.id, post.foto_capa, variant)
}

export function getCaseImageUrl(
  caseItem: CaseRecord,
  variant: ImageSizeVariant = 'original',
): string {
  if (!caseItem.foto) return ''
  return getPocketBaseFileUrl('cases', caseItem.id, caseItem.foto, variant)
}

export function getMediaFileUrl(
  media: MediaRecord,
  variant: ImageSizeVariant = 'original',
): string {
  if (!media.arquivo) return ''
  return getPocketBaseFileUrl('media', media.id, media.arquivo, variant)
}

// ----------------------------------------------------
// BLOG / POSTS
// ----------------------------------------------------
export async function listPostsAdmin(): Promise<PostRecord[]> {
  return await pb.collection('posts').getFullList<PostRecord>({
    sort: '-created',
  })
}

export async function listPublishedPosts(): Promise<PostRecord[]> {
  try {
    return await pb.collection('posts').getFullList<PostRecord>({
      filter: "status = 'publicado'",
      sort: '-created',
    })
  } catch (err) {
    console.warn('Erro ao buscar posts publicados:', err)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<PostRecord | null> {
  try {
    return await pb.collection('posts').getFirstListItem<PostRecord>(`slug = "${slug}"`)
  } catch (_) {
    return null
  }
}

export async function createPost(payload: UpsertPostPayload): Promise<PostRecord> {
  const formData = new FormData()
  formData.append('titulo', payload.titulo.trim())
  formData.append('slug', payload.slug.trim())
  if (payload.subtitulo) formData.append('subtitulo', payload.subtitulo.trim())
  if (payload.resumo) formData.append('resumo', payload.resumo.trim())
  if (payload.categoria) formData.append('categoria', payload.categoria)
  if (payload.conteudo) formData.append('conteudo', payload.conteudo.trim())
  if (payload.data_publicacao) formData.append('data_publicacao', payload.data_publicacao.trim())
  formData.append('status', payload.status)
  if (payload.tempo_leitura) formData.append('tempo_leitura', payload.tempo_leitura.trim())
  if (payload.autor_nome) formData.append('autor_nome', payload.autor_nome.trim())
  if (payload.autor_cargo) formData.append('autor_cargo', payload.autor_cargo.trim())
  if (payload.palavra_chave) formData.append('palavra_chave', payload.palavra_chave.trim())

  if (payload.foto_capa instanceof File) {
    formData.append('foto_capa', payload.foto_capa)
  }

  return await pb.collection('posts').create<PostRecord>(formData)
}

export async function updatePost(
  id: string,
  payload: Partial<UpsertPostPayload>,
): Promise<PostRecord> {
  const formData = new FormData()
  if (payload.titulo !== undefined) formData.append('titulo', payload.titulo.trim())
  if (payload.slug !== undefined) formData.append('slug', payload.slug.trim())
  if (payload.subtitulo !== undefined) formData.append('subtitulo', payload.subtitulo.trim())
  if (payload.resumo !== undefined) formData.append('resumo', payload.resumo.trim())
  if (payload.categoria !== undefined) formData.append('categoria', payload.categoria)
  if (payload.conteudo !== undefined) formData.append('conteudo', payload.conteudo.trim())
  if (payload.data_publicacao !== undefined)
    formData.append('data_publicacao', payload.data_publicacao.trim())
  if (payload.status !== undefined) formData.append('status', payload.status)
  if (payload.tempo_leitura !== undefined)
    formData.append('tempo_leitura', payload.tempo_leitura.trim())
  if (payload.autor_nome !== undefined) formData.append('autor_nome', payload.autor_nome.trim())
  if (payload.autor_cargo !== undefined) formData.append('autor_cargo', payload.autor_cargo.trim())
  if (payload.palavra_chave !== undefined)
    formData.append('palavra_chave', payload.palavra_chave.trim())

  if (payload.foto_capa instanceof File) {
    formData.append('foto_capa', payload.foto_capa)
  }

  return await pb.collection('posts').update<PostRecord>(id, formData)
}

export async function togglePostStatus(
  id: string,
  currentStatus: 'rascunho' | 'publicado',
): Promise<PostRecord> {
  const newStatus = currentStatus === 'publicado' ? 'rascunho' : 'publicado'
  return await pb.collection('posts').update<PostRecord>(id, { status: newStatus })
}

export async function deletePost(id: string): Promise<boolean> {
  return await pb.collection('posts').delete(id)
}

// ----------------------------------------------------
// CASES
// ----------------------------------------------------
export async function listCasesAdmin(): Promise<CaseRecord[]> {
  return await pb.collection('cases').getFullList<CaseRecord>({
    sort: '-created',
  })
}

export async function listPublishedCases(): Promise<CaseRecord[]> {
  try {
    return await pb.collection('cases').getFullList<CaseRecord>({
      filter: "status = 'publicado'",
      sort: '-created',
    })
  } catch (err) {
    console.warn('Erro ao buscar cases publicados:', err)
    return []
  }
}

export async function createCase(payload: UpsertCasePayload): Promise<CaseRecord> {
  const formData = new FormData()
  formData.append('titulo', payload.titulo.trim())
  formData.append('slug', payload.slug.trim())
  if (payload.cliente) formData.append('cliente', payload.cliente.trim())
  if (payload.setor) formData.append('setor', payload.setor)
  if (payload.solucao) formData.append('solucao', payload.solucao)
  if (payload.local) formData.append('local', payload.local.trim())
  if (payload.escopo) formData.append('escopo', payload.escopo.trim())
  if (payload.descricao) formData.append('descricao', payload.descricao.trim())
  if (payload.solucao_tecnica) formData.append('solucao_tecnica', payload.solucao_tecnica.trim())
  if (payload.resultado) formData.append('resultado', payload.resultado.trim())
  if (payload.resultado_valor) formData.append('resultado_valor', payload.resultado_valor.trim())
  if (payload.resultado_label) formData.append('resultado_label', payload.resultado_label.trim())
  if (payload.potencia_capacidade)
    formData.append('potencia_capacidade', payload.potencia_capacidade.trim())
  if (payload.data_entrega) formData.append('data_entrega', payload.data_entrega.trim())
  formData.append('status', payload.status)
  formData.append('destaque', payload.destaque ? 'true' : 'false')
  formData.append('is_exemplo', payload.is_exemplo ? 'true' : 'false')

  if (payload.foto instanceof File) {
    formData.append('foto', payload.foto)
  }

  return await pb.collection('cases').create<CaseRecord>(formData)
}

export async function updateCase(
  id: string,
  payload: Partial<UpsertCasePayload>,
): Promise<CaseRecord> {
  const formData = new FormData()
  if (payload.titulo !== undefined) formData.append('titulo', payload.titulo.trim())
  if (payload.slug !== undefined) formData.append('slug', payload.slug.trim())
  if (payload.cliente !== undefined) formData.append('cliente', payload.cliente.trim())
  if (payload.setor !== undefined) formData.append('setor', payload.setor)
  if (payload.solucao !== undefined) formData.append('solucao', payload.solucao)
  if (payload.local !== undefined) formData.append('local', payload.local.trim())
  if (payload.escopo !== undefined) formData.append('escopo', payload.escopo.trim())
  if (payload.descricao !== undefined) formData.append('descricao', payload.descricao.trim())
  if (payload.solucao_tecnica !== undefined)
    formData.append('solucao_tecnica', payload.solucao_tecnica.trim())
  if (payload.resultado !== undefined) formData.append('resultado', payload.resultado.trim())
  if (payload.resultado_valor !== undefined)
    formData.append('resultado_valor', payload.resultado_valor.trim())
  if (payload.resultado_label !== undefined)
    formData.append('resultado_label', payload.resultado_label.trim())
  if (payload.potencia_capacidade !== undefined)
    formData.append('potencia_capacidade', payload.potencia_capacidade.trim())
  if (payload.data_entrega !== undefined)
    formData.append('data_entrega', payload.data_entrega.trim())
  if (payload.status !== undefined) formData.append('status', payload.status)
  // foto === null significa "remover a foto atual" (valor vazio limpa o campo
  // arquivo no PocketBase); foto instanceof File reenvia o arquivo.
  if (payload.foto === null) {
    formData.append('foto', '')
  }
  if (payload.destaque !== undefined)
    formData.append('destaque', payload.destaque ? 'true' : 'false')
  if (payload.is_exemplo !== undefined)
    formData.append('is_exemplo', payload.is_exemplo ? 'true' : 'false')

  if (payload.foto instanceof File) {
    formData.append('foto', payload.foto)
  }

  return await pb.collection('cases').update<CaseRecord>(id, formData)
}

export async function toggleCaseStatus(
  id: string,
  currentStatus: 'rascunho' | 'publicado',
): Promise<CaseRecord> {
  const newStatus = currentStatus === 'publicado' ? 'rascunho' : 'publicado'
  return await pb.collection('cases').update<CaseRecord>(id, { status: newStatus })
}

export async function deleteCase(id: string): Promise<boolean> {
  return await pb.collection('cases').delete(id)
}

// ----------------------------------------------------
// MEDIA LIBRARY
// ----------------------------------------------------
export async function listMedia(): Promise<MediaRecord[]> {
  return await pb.collection('media').getFullList<MediaRecord>({
    sort: '-created',
  })
}

export async function createMedia(payload: CreateMediaPayload): Promise<MediaRecord> {
  const formData = new FormData()
  formData.append('titulo', payload.titulo.trim())
  formData.append('arquivo', payload.arquivo)
  if (payload.categoria) formData.append('categoria', payload.categoria)
  if (payload.descricao) formData.append('descricao', payload.descricao.trim())
  if (payload.destino_sugerido) formData.append('destino_sugerido', payload.destino_sugerido.trim())
  if (payload.case_id !== undefined) formData.append('case_id', payload.case_id)

  return await pb.collection('media').create<MediaRecord>(formData)
}

export async function updateMedia(id: string, payload: UpdateMediaPayload): Promise<MediaRecord> {
  const formData = new FormData()
  if (payload.titulo !== undefined) formData.append('titulo', payload.titulo.trim())
  if (payload.categoria !== undefined) formData.append('categoria', payload.categoria)
  if (payload.descricao !== undefined) formData.append('descricao', payload.descricao.trim())
  if (payload.destino_sugerido !== undefined) {
    formData.append('destino_sugerido', payload.destino_sugerido.trim())
  }
  if (payload.case_id !== undefined) {
    formData.append('case_id', payload.case_id)
  }
  if (payload.arquivo instanceof File) {
    formData.append('arquivo', payload.arquivo)
  }

  return await pb.collection('media').update<MediaRecord>(id, formData)
}

export async function deleteMedia(id: string): Promise<boolean> {
  return await pb.collection('media').delete(id)
}

/**
 * Lista todas as fotos vinculadas a um projeto/case específico, ordenadas por ordem crescente.
 */
export async function listMediaByCaseId(caseId: string): Promise<MediaRecord[]> {
  if (!caseId) return []
  try {
    return await pb.collection('media').getFullList<MediaRecord>({
      filter: `case_id = "${caseId}"`,
      sort: 'ordem,created',
    })
  } catch (err) {
    console.warn(`Erro ao carregar fotos do projeto ${caseId}:`, err)
    return []
  }
}

/** Alias para compatibilidade */
export const listMediaByCase = listMediaByCaseId

/**
 * Vincula uma mídia existente da biblioteca a um projeto/case com uma ordem específica.
 */
export async function attachMediaToCase(
  mediaId: string,
  caseId: string,
  ordem?: number,
): Promise<MediaRecord> {
  const payload: Record<string, unknown> = { case_id: caseId, publicado_galeria: true }
  if (ordem !== undefined) payload.ordem = ordem
  return await pb.collection('media').update<MediaRecord>(mediaId, payload)
}

export const vincularMediaAoCase = attachMediaToCase

/**
 * Faz upload direto de uma imagem e já vincula diretamente ao case.
 */
export async function uploadMediaToCase(
  caseId: string,
  file: File,
  titulo?: string,
  ordem?: number,
): Promise<MediaRecord> {
  const formData = new FormData()
  formData.append('arquivo', file)
  formData.append('titulo', titulo || file.name)
  formData.append('categoria', 'Solar')
  formData.append('case_id', caseId)
  formData.append('publicado_galeria', 'true')
  if (ordem !== undefined) {
    formData.append('ordem', String(ordem))
  }
  return await pb.collection('media').create<MediaRecord>(formData)
}

/**
 * Desvincula uma foto do projeto/case (mantém a foto no acervo geral da biblioteca).
 */
export async function detachMediaFromCase(mediaId: string): Promise<MediaRecord> {
  return await pb.collection('media').update<MediaRecord>(mediaId, { case_id: '' })
}

export const desvincularMediaDoCase = detachMediaFromCase

/**
 * Reordena as fotos de um case. Atualiza o campo `ordem` (1, 2, 3...) de cada registro.
 */
export async function reorderCaseMedia(mediaIds: string[]): Promise<void> {
  for (let i = 0; i < mediaIds.length; i++) {
    const id = mediaIds[i]
    try {
      await pb.collection('media').update(id, { ordem: i + 1 })
    } catch (err) {
      console.warn(`Falha ao reordenar mídia ${id}:`, err)
    }
  }
}

export const reordenarFotosDoCase = reorderCaseMedia

// ----------------------------------------------------
// GALERIA PÚBLICA DE OBRAS (/obras)
// ----------------------------------------------------

/**
 * Lista as fotos publicadas na galeria.
 * Falha em silêncio: se o backend ainda não tiver os campos novos (migração não
 * aplicada no preview), a galeria mostra o estado vazio em vez de quebrar a página.
 */
export async function listGaleriaObras(): Promise<MediaRecord[]> {
  try {
    // Sort no servidor apenas por campos simples: o PocketBase não ordena por
    // booleano nesta coleção (a consulta volta 500). O destaque é aplicado no cliente.
    const registros = await pb.collection('media').getFullList<MediaRecord>({
      filter: 'publicado_galeria = true',
      sort: 'ordem,cidade,-created',
    })
    // Destaques primeiro, preservando a ordem manual dentro de cada grupo
    return registros.sort((a, b) => {
      const destaqueA = a.destaque_galeria ? 0 : 1
      const destaqueB = b.destaque_galeria ? 0 : 1
      if (destaqueA !== destaqueB) return destaqueA - destaqueB
      const ordemA = a.ordem ?? 999
      const ordemB = b.ordem ?? 999
      if (ordemA !== ordemB) return ordemA - ordemB
      return (a.cidade || '').localeCompare(b.cidade || '')
    })
  } catch (err) {
    console.warn('Erro ao buscar a galeria de obras publicadas:', err)
    return []
  }
}

/**
 * Atualiza os dados de obra/publicação de uma foto da biblioteca.
 * Só os campos enviados são alterados.
 */
/** Normaliza texto para compor chaves e slugs: sem acento, minúsculo, hifenizado. */
function slugificar(texto: string): string {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Monta o `obra_slug` a partir de cidade + potência + tipo.
 * É o que agrupa várias fotos no MESMO card da galeria: mudar qualquer um dos
 * três campos move a foto para outro card, que é o comportamento esperado.
 */
function chaveObra(cidade: string, potencia: string, tipo: string): string {
  const partes = [slugificar(cidade), slugificar(potencia), slugificar(tipo)].filter(Boolean)
  return partes.join('-')
}

export async function updateMediaGaleria(
  id: string,
  payload: UpdateMediaGaleriaPayload,
): Promise<MediaRecord> {
  const body: Record<string, unknown> = {}
  if (payload.cidade !== undefined) body.cidade = payload.cidade.trim()
  if (payload.bairro !== undefined) body.bairro = payload.bairro.trim()
  if (payload.uf !== undefined) body.uf = payload.uf.trim().toUpperCase()
  if (payload.potencia !== undefined) body.potencia = payload.potencia.trim()
  if (payload.tipo_obra !== undefined) body.tipo_obra = payload.tipo_obra
  if (payload.alt_texto !== undefined) body.alt_texto = payload.alt_texto.trim()
  if (payload.slug !== undefined) body.slug = payload.slug.trim()
  if (payload.obra_titulo !== undefined) body.obra_titulo = payload.obra_titulo.trim()
  if (payload.obra_descricao !== undefined) body.obra_descricao = payload.obra_descricao.trim()
  if (payload.publicado_galeria !== undefined) body.publicado_galeria = payload.publicado_galeria
  if (payload.destaque_galeria !== undefined) body.destaque_galeria = payload.destaque_galeria
  if (payload.ordem !== undefined) body.ordem = payload.ordem
  if (payload.case_id !== undefined) body.case_id = payload.case_id

  // Sempre que cidade/potência/tipo mudam, recalcula o agrupamento da obra e
  // replica os dados da obra para todas as fotos do mesmo grupo.
  const cidade = (payload.cidade ?? '').trim()
  const potencia = (payload.potencia ?? '').trim()
  const tipo = (payload.tipo_obra ?? '') as string

  const precisaReagrupar =
    payload.cidade !== undefined ||
    payload.potencia !== undefined ||
    payload.tipo_obra !== undefined

  if (precisaReagrupar && cidade && potencia) {
    const obraSlug = chaveObra(cidade, potencia, tipo)
    const obraTitulo = (payload.obra_titulo ?? '').trim()
    const obraDescricao = (payload.obra_descricao ?? '').trim()

    body.obra_slug = obraSlug
    body.obra_cidade = cidade
    body.obra_uf = (payload.uf ?? '').trim().toUpperCase()
    body.obra_potencia = potencia
    body.obra_tipo = tipo
    if (obraTitulo) body.obra_titulo = obraTitulo
    if (obraDescricao) body.obra_descricao = obraDescricao

    // Replica o nome/descrição da obra nas demais fotos do mesmo grupo, para o
    // card mostrar o mesmo título venha a foto que vier.
    if (obraTitulo || obraDescricao) {
      try {
        const irmaos = await pb.collection('media').getFullList<MediaRecord>({
          filter: `obra_slug = "${obraSlug}" && id != "${id}"`,
        })
        for (const irmao of irmaos) {
          const atualizacao: Record<string, unknown> = {}
          if (obraTitulo) atualizacao.obra_titulo = obraTitulo
          if (obraDescricao) atualizacao.obra_descricao = obraDescricao
          if (Object.keys(atualizacao).length > 0) {
            await pb.collection('media').update(irmao.id, atualizacao)
          }
        }
      } catch (err) {
        console.warn('Não foi possível replicar os dados da obra nas outras fotos:', err)
      }
    }
  }

  return await pb.collection('media').update<MediaRecord>(id, body)
}

/** Uma obra da galeria: 1 card, N fotos. */
export interface ObraGaleria {
  slug: string
  titulo: string
  descricao: string
  cidade: string
  uf: string
  potencia: string
  tipo: string
  fotos: MediaRecord[]
  capa: MediaRecord
  destaque: boolean
}

/**
 * Lista a galeria AGRUPADA POR OBRA.
 *
 * Cada card da página é uma obra, não uma foto: publicar as 13 fotos da Cassul
 * continua gerando um único card. As fotos de cada obra aparecem dentro do card,
 * com a capa escolhida por `ordem`.
 */
export async function listObrasGaleria(): Promise<ObraGaleria[]> {
  let registros: MediaRecord[] = []
  try {
    registros = await pb.collection('media').getFullList<MediaRecord>({
      filter: 'publicado_galeria = true && obra_slug != ""',
      sort: 'ordem,-created',
    })
  } catch (err) {
    console.warn('Erro ao buscar a galeria de obras publicadas:', err)
    return []
  }

  const mapa = new Map<string, ObraGaleria>()

  registros
    .filter((r) => Boolean(r.arquivo) && Boolean(r.obra_slug))
    .forEach((registro) => {
      const slug = registro.obra_slug as string
      const existente = mapa.get(slug)

      if (!existente) {
        mapa.set(slug, {
          slug,
          titulo: registro.obra_titulo || registro.titulo || 'Obra Delfos',
          descricao: registro.obra_descricao || '',
          cidade: registro.obra_cidade || registro.cidade || '',
          uf: registro.obra_uf || registro.uf || '',
          potencia: registro.obra_potencia || registro.potencia || '',
          tipo: registro.obra_tipo || registro.tipo_obra || '',
          fotos: [registro],
          capa: registro,
          destaque: Boolean(registro.destaque_galeria),
        })
        return
      }

      existente.fotos.push(registro)
      if (registro.destaque_galeria) existente.destaque = true

      // A capa é a foto de menor `ordem` (1 = capa definida na migração)
      const ordemAtual = existente.capa.ordem ?? 999
      const ordemNova = registro.ordem ?? 999
      if (ordemNova < ordemAtual) existente.capa = registro
    })

  const obras = Array.from(mapa.values())

  // Ordena as fotos dentro de cada obra e garante capa coerente
  obras.forEach((obra) => {
    obra.fotos.sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999))
    if (!obra.fotos.some((f) => f.id === obra.capa.id)) obra.capa = obra.fotos[0]
  })

  // Destaques primeiro; depois maior potência; depois cidade
  const potenciaNumerica = (texto: string) => {
    const m = String(texto)
      .replace(/\./g, '')
      .replace(',', '.')
      .match(/([\d.]+)/)
    return m ? parseFloat(m[1]) : 0
  }

  return obras.sort((a, b) => {
    if (a.destaque !== b.destaque) return a.destaque ? -1 : 1
    const pa = potenciaNumerica(a.potencia)
    const pb2 = potenciaNumerica(b.potencia)
    if (pa !== pb2) return pb2 - pa
    return (a.cidade || '').localeCompare(b.cidade || '')
  })
}

export interface LimparDuplicadasItem {
  id: string
  titulo: string
  arquivo: string
  created: string
  motivo: string
}

export interface LimparDuplicadasResponse {
  sucesso: boolean
  modo: 'simulacao' | 'executado'
  totalRegistrosAtual: number
  totalAposLimpezaEstimado: number
  resumo: {
    totalParaExcluir: number
    totalParaRevisar: number
    totalVinculadosPulados: number
    totalMantidosValidos: number
    totalExcluidosEfetivamente: number
    totalFalhas: number
  }
  detalhes: {
    paraExcluir: LimparDuplicadasItem[]
    paraRevisar: LimparDuplicadasItem[]
    vinculadosPulados: LimparDuplicadasItem[]
    falhas: Array<{ id: string; error: string }>
    /** Ids enviados pelo usuário que eram protegidos e foram ignorados pelo backend */
    protegidosIgnorados?: string[]
  }
  error?: string
}

export async function simularLimpezaDuplicadas(): Promise<LimparDuplicadasResponse> {
  const res = await pb.send<LimparDuplicadasResponse>('/backend/v1/limpar-duplicadas-media', {
    method: 'GET',
  })
  return res
}

export async function executarLimpezaDuplicadas(
  idsExcluir?: string[],
): Promise<LimparDuplicadasResponse> {
  const res = await pb.send<LimparDuplicadasResponse>('/backend/v1/limpar-duplicadas-media', {
    method: 'POST',
    // Sem idsExcluir: comportamento antigo (exclui tudo marcado pelo backend).
    // Com idsExcluir: exclui exatamente a lista escolhida foto a foto no modal.
    body: idsExcluir ? { confirmar: true, ids_excluir: idsExcluir } : { confirmar: true },
  })
  return res
}
