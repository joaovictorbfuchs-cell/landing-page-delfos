import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, X } from 'lucide-react'
import { trackWhatsappClick } from '@/lib/analytics'
import { whatsappUrl, whatsappMensagem, WHATSAPP_ORIGENS, OrigemContextual } from '@/lib/whatsapp'

// Origem do WhatsApp flutuante por página (na fala do cliente, sem tags técnicas).
// Rotas sem entrada caem na origem padrão "home".
const ORIGEM_POR_ROTA: Record<string, OrigemContextual> = {
  '/solucoes/energia-solar': 'solução energia solar',
  '/energia-solar': 'solução energia solar',
  '/solucoes/bess': 'solução baterias (BESS)',
  '/baterias': 'solução baterias (BESS)',
  '/solucoes/om': WHATSAPP_ORIGENS.paginaOm,
  '/manutencao': WHATSAPP_ORIGENS.paginaOm,
  '/solucoes/carregadores': 'solução carregadores',
  '/recarga': 'solução carregadores',
  '/projetos': 'página de projetos',
  '/sobre': 'página sobre',
  '/conteudos': 'página de conteúdos',
  '/conteudos/autor/joao-victor-bagetti-fuchs': 'página de conteúdos',
  '/faq': 'página de perguntas frequentes',
  '/segmentos/residencias': 'segmento residências',
  '/segmentos/comercio-servicos': 'segmento comércio e serviços',
  '/segmentos/industria': 'segmento indústria',
  '/segmentos/agronegocio': 'segmento agronegócio',
  '/segmentos/condominios': 'segmento condomínios',
  '/segmentos/investidores': 'segmento investidores',
  '/segmentos/frotas-eletropostos': 'segmento frotas e eletropostos',
}

export default function AtendimentoFloating() {
  const location = useLocation()
  const pathname = location.pathname.toLowerCase()

  // Botão dispensado pelo cliente (fica oculto até recarregar a página)
  const [dispensado, setDispensado] = useState(false)

  // Ocultar em rotas administrativas e de autenticação
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null
  }

  if (dispensado) {
    return null
  }

  // Origem do WhatsApp conforme a página aberta (sempre na fala do cliente):
  // home → "home"; artigo → "artigo"; demais páginas → origem contextual do helper.
  const isArtigoManutencao = pathname.includes('manutencao-de-placa-solar-perda-geracao')
  const origemWhatsApp: OrigemContextual = isArtigoManutencao
    ? WHATSAPP_ORIGENS.artigo
    : ORIGEM_POR_ROTA[pathname] || WHATSAPP_ORIGENS.home
  const whatsappLink = whatsappUrl(origemWhatsApp)
  const defaultWhatsAppMsg = whatsappMensagem(origemWhatsApp)

  const handleClick = () => {
    trackWhatsappClick(
      isArtigoManutencao ? 'floating_whatsapp_artigo_manutencao' : 'floating_whatsapp_menu',
      defaultWhatsAppMsg,
    )
  }

  return (
    // bottom-20 no mobile para ter folga clara acima da MobileCtaBar e evitar sobreposição, bottom-6 no desktop
    <aside
      aria-label="Atendimento Delfos Engenharia"
      className="fixed bottom-[4.75rem] md:bottom-6 right-3 sm:right-6 z-40"
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Abrir conversa no WhatsApp com a equipe Delfos"
        className="group relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-solar-300 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-solar-300 rounded-full" />
        </div>
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide pr-1">
          Atendimento
        </span>
      </a>

      {/* Dispensar o botão flutuante (discreto, sobre a bolha) */}
      <button
        type="button"
        onClick={() => setDispensado(true)}
        aria-label="Fechar botão de atendimento"
        title="Fechar"
        className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-white text-slate-600 border border-slate-300 shadow flex items-center justify-center hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
      >
        <X className="w-3 h-3" />
      </button>
    </aside>
  )
}
