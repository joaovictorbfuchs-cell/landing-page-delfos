export type TipoImovel = 'Residencia' | 'Empresa' | 'Outro'

export interface Lead {
  id: string
  nome: string
  telefone: string
  email: string
  tipo_imovel: TipoImovel
  consumo_mensal?: number
  mensagem?: string
  created: string
  updated: string
}

export interface CreateLeadPayload {
  nome: string
  telefone: string
  email: string
  tipo_imovel: TipoImovel
  consumo_mensal?: number
  mensagem?: string
}
