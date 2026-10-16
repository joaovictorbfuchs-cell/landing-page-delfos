import pb from '@/lib/pocketbase/client'
import type { Lead, CreateLeadPayload } from '@/types/leads'

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const data: Record<string, unknown> = {
    nome: payload.nome.trim(),
    telefone: payload.telefone.trim(),
    email: payload.email.trim().toLowerCase(),
  }

  if (payload.tipo_imovel) {
    data.tipo_imovel = payload.tipo_imovel
  }

  if (payload.consumo_mensal !== undefined && !Number.isNaN(payload.consumo_mensal)) {
    data.consumo_mensal = payload.consumo_mensal
  }

  if (payload.valor_conta !== undefined && !Number.isNaN(payload.valor_conta)) {
    data.valor_conta = payload.valor_conta
  }

  if (payload.cidade && payload.cidade.trim()) {
    data.cidade = payload.cidade.trim()
  }

  if (payload.necessidade && payload.necessidade.trim()) {
    data.necessidade = payload.necessidade.trim()
  }

  if (payload.tipo_ligacao && payload.tipo_ligacao.trim()) {
    data.tipo_ligacao = payload.tipo_ligacao.trim()
  }

  if (payload.posse_area && payload.posse_area.trim()) {
    data.posse_area = payload.posse_area.trim()
  }

  if (payload.ja_possui_solar && payload.ja_possui_solar.trim()) {
    data.ja_possui_solar = payload.ja_possui_solar.trim()
  }

  if (payload.origem && payload.origem.trim()) {
    data.origem = payload.origem.trim()
  }

  if (payload.concessionaria && payload.concessionaria.trim()) {
    data.concessionaria = payload.concessionaria.trim()
  }

  if (payload.mensagem && payload.mensagem.trim()) {
    data.mensagem = payload.mensagem.trim()
  }

  const record = await pb.collection('leads').create<Lead>(data)
  return record
}

export async function listLeads(): Promise<Lead[]> {
  const records = await pb.collection('leads').getFullList<Lead>({
    sort: '-created',
  })
  return records
}

export async function deleteLead(id: string): Promise<boolean> {
  return await pb.collection('leads').delete(id)
}
