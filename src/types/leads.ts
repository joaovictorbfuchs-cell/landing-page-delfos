export type TipoImovel = 'Residencia' | 'Empresa' | 'Outro'

export type NecessidadePilar =
  | 'Energia Solar Fotovoltaica'
  | 'BESS (Armazenamento)'
  | 'O&M e Monitoramento'
  | 'Carregadores Veiculares'
  | 'Multiplas Solucoes'
  | 'Manutenção'

export type TipoLigacao = 'Monofasico' | 'Bifasico' | 'Trifasico' | 'Nao sei'

export type PosseArea = 'Proprio' | 'Alugado' | 'Outro'

export type JaPossuiSolar = 'Sim' | 'Nao'

export interface Lead {
  id: string
  nome: string
  telefone: string
  email: string
  tipo_imovel?: TipoImovel
  consumo_mensal?: number
  mensagem?: string
  cidade?: string
  necessidade?: string
  tipo_ligacao?: string
  valor_conta?: number
  posse_area?: string
  ja_possui_solar?: string
  origem?: string
  concessionaria?: string
  arquivo_conta?: string
  created: string
  updated: string
}

export interface CreateLeadPayload {
  nome: string
  telefone: string
  email: string
  tipo_imovel?: TipoImovel
  consumo_mensal?: number
  mensagem?: string
  cidade?: string
  necessidade?: string
  tipo_ligacao?: string
  valor_conta?: number
  posse_area?: string
  ja_possui_solar?: string
  origem?: string
  concessionaria?: string
  arquivo_conta?: File
}
