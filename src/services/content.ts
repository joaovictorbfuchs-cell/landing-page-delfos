import pb from '@/lib/pocketbase/client'
import type {
  PostRecord,
  UpsertPostPayload,
  CaseRecord,
  UpsertCasePayload,
  MediaRecord,
  CreateMediaPayload,
} from '@/types/content'

// Helper para obter a URL pública de arquivos de uma coleção
export function getPocketBaseFileUrl(
  collectionName: string,
  recordId: string,
  filename: string,
): string {
  if (!filename) return ''
  return `${pb.baseUrl}/api/files/${collectionName}/${recordId}/${filename}`
}

export function getPostImageUrl(post: PostRecord): string {
  if (!post.foto_capa) return ''
  return getPocketBaseFileUrl('posts', post.id, post.foto_capa)
}

export function getCaseImageUrl(caseItem: CaseRecord): string {
  if (!caseItem.foto) return ''
  return getPocketBaseFileUrl('cases', caseItem.id, caseItem.foto)
}

export function getMediaFileUrl(media: MediaRecord): string {
  if (!media.arquivo) return ''
  return getPocketBaseFileUrl('media', media.id, media.arquivo)
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
  if (payload.destaque !== undefined)
    formData.append('destaque', payload.destaque ? 'true' : 'false')

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

  return await pb.collection('media').create<MediaRecord>(formData)
}

export async function deleteMedia(id: string): Promise<boolean> {
  return await pb.collection('media').delete(id)
}
