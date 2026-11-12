// Utilitário central para links de WhatsApp do site.
// Garante número único, formato wa.me e mensagem pré-preenchida no padrão
// "Olá! Vim pelo site da Delfos Solar (origem)." — sem tags técnicas visíveis.
// Toda origem do site deve usar o WHATSAPP_ORIGENS aqui definido; links sem
// mensagem (rodapé, formulário) e textos divergentes foram padronizados.

export const WHATSAPP_NUMERO = '5554991292121'

// Origens padronizadas, na fala do cliente (sem tags técnicas).
export const WHATSAPP_ORIGENS = {
  home: 'home',
  menuTopo: 'menu topo',
  barraMobile: 'barra mobile',
  rodape: 'rodapé',
  formulario: 'formulário',
  paginaOm: 'página O&M',
  plantao: 'plantão',
  artigo: 'artigo',
} as const

export type OrigemWhatsApp = keyof typeof WHATSAPP_ORIGENS

// Origens contextuais extras (soluções, segmentos, /admin) — aceitas pelo helper.
export type OrigemContextual = (typeof WHATSAPP_ORIGENS)[OrigemWhatsApp] | (string & {})

// Monta a URL wa.me com a saudação padrão da origem.
// complemento é acrescentado após a saudação (ex.: resumo do chamado no plantão).
export function whatsappUrl(origem: OrigemContextual, complemento?: string): string {
  const base = `Olá! Vim pelo site da Delfos Solar (${origem}).`
  const text = complemento?.trim() ? `${base} ${complemento.trim()}` : base
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(text)}`
}

// Mensagem de saudação padrão da origem (quando o componente precisa só do texto).
export function whatsappMensagem(origem: OrigemContextual, complemento?: string): string {
  const base = `Olá! Vim pelo site da Delfos Solar (${origem}).`
  return complemento?.trim() ? `${base} ${complemento.trim()}` : base
}
