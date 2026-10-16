import pb from '@/lib/pocketbase/client'
import type { Lead, CreateLeadPayload } from '@/types/leads'

export async function createLead(payload: CreateLeadPayload): Promise<Lead> {
  const data: Record<string, unknown> = {
    nome: payload.nome.trim(),
    telefone: payload.telefone.trim(),
    email: payload.email.trim().toLowerCase(),
    tipo_imovel: payload.tipo_imovel,
  }

  if (payload.consumo_mensal !== undefined && !Number.isNaN(payload.consumo_mensal)) {
    data.consumo_mensal = payload.consumo_mensal
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
