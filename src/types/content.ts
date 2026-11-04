export type PostStatus = 'rascunho' | 'publicado'

export type PostCategoria =
  | 'Energia Solar'
  | 'Armazenamento BESS'
  | 'Operação & Manutenção'
  | 'Mobilidade Elétrica'
  | 'Institucional e Outros'

export interface PostRecord {
  id: string
  titulo: string
  slug: string
  subtitulo?: string
  resumo?: string
  categoria: PostCategoria
  conteudo?: string
  foto_capa?: string
  data_publicacao?: string
  status: PostStatus
  tempo_leitura?: string
  autor_nome?: string
  autor_cargo?: string
  palavra_chave?: string
  created: string
  updated: string
}

export interface UpsertPostPayload {
  titulo: string
  slug: string
  subtitulo?: string
  resumo?: string
  categoria: PostCategoria
  conteudo?: string
  foto_capa?: File | null
  data_publicacao?: string
  status: PostStatus
  tempo_leitura?: string
  autor_nome?: string
  autor_cargo?: string
  palavra_chave?: string
}

export type CaseStatus = 'rascunho' | 'publicado'

export type CaseSetor =
  | 'Residências'
  | 'Comércio e Serviços'
  | 'Indústria'
  | 'Agronegócio'
  | 'Condomínios'
  | 'Investidores e Usinas'
  | 'Frotas e Eletropostos'

export type CaseSolucao =
  | 'Energia Solar'
  | 'BESS (Armazenamento)'
  | 'O&M e Monitoramento'
  | 'Carregadores Veiculares'

export interface CaseRecord {
  id: string
  titulo: string
  slug: string
  cliente?: string
  setor: CaseSetor
  solucao?: CaseSolucao
  local?: string
  escopo?: string
  descricao?: string
  solucao_tecnica?: string
  resultado?: string
  resultado_valor?: string
  resultado_label?: string
  potencia_capacidade?: string
  data_entrega?: string
  foto?: string
  status: CaseStatus
  destaque?: boolean
  is_exemplo?: boolean
  created: string
  updated: string
}

export interface UpsertCasePayload {
  /** Passar null remove a foto atual do case (valor vazio limpa o campo arquivo no PocketBase) */
  foto?: File | null
  titulo: string
  slug: string
  cliente?: string
  setor: CaseSetor
  solucao?: CaseSolucao
  local?: string
  escopo?: string
  descricao?: string
  solucao_tecnica?: string
  resultado?: string
  resultado_valor?: string
  resultado_label?: string
  potencia_capacidade?: string
  data_entrega?: string
  status: CaseStatus
  destaque?: boolean
  is_exemplo?: boolean
}

export type MediaCategoria =
  | 'Geral'
  | 'Solar'
  | 'BESS Baterias'
  | 'O&M Manutenção'
  | 'Carregadores'
  | 'Segmentos'
  | 'Equipe e Empresa'

export type TipoObraGaleria =
  | 'Telhado industrial'
  | 'Telhado comercial'
  | 'Telhado residencial'
  | 'Usina de solo'
  | 'Solo rural'
  | 'Carport'
  | 'BESS'
  | 'Carregadores'
  | 'O&M'

export interface MediaRecord {
  id: string
  titulo: string
  arquivo: string
  categoria: MediaCategoria
  descricao?: string
  destino_sugerido?: string
  /** Dados da obra — usados pela galeria pública /obras */
  obra_slug?: string
  obra_titulo?: string
  obra_descricao?: string
  obra_cidade?: string
  obra_uf?: string
  obra_potencia?: string
  obra_tipo?: string
  cidade?: string
  bairro?: string
  uf?: string
  potencia?: string
  tipo_obra?: TipoObraGaleria | ''
  alt_texto?: string
  slug?: string
  publicado_galeria?: boolean
  destaque_galeria?: boolean
  ordem?: number
  case_id?: string
  created: string
  updated: string
}

export interface UpdateMediaGaleriaPayload {
  cidade?: string
  bairro?: string
  uf?: string
  potencia?: string
  tipo_obra?: TipoObraGaleria | ''
  alt_texto?: string
  slug?: string
  obra_titulo?: string
  obra_descricao?: string
  publicado_galeria?: boolean
  destaque_galeria?: boolean
  ordem?: number
  case_id?: string
}

export interface CreateMediaPayload {
  titulo: string
  arquivo: File
  categoria: MediaCategoria
  descricao?: string
  destino_sugerido?: string
  case_id?: string
  publicado_galeria?: boolean
}

export interface UpdateMediaPayload {
  titulo?: string
  categoria?: MediaCategoria
  descricao?: string
  destino_sugerido?: string
  arquivo?: File | null
  case_id?: string
}
