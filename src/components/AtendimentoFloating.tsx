import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, X, Bot, FileText, Phone, ArrowRight, Headphones } from 'lucide-react'
import PlantaoWidgetFlutuante from '@/components/PlantaoWidgetFlutuante'
import { trackWhatsappClick } from '@/lib/analytics'

interface AtendimentoFloatingProps {
  telefoneDisplay?: string
  numeroWhatsApp?: string
}

export default function AtendimentoFloating({
  telefoneDisplay = '(54) 99129-2121',
  numeroWhatsApp = '5554991292121',
}: AtendimentoFloatingProps = {}) {
  const location = useLocation()
  const pathname = location.pathname.toLowerCase()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  // Origem do lead segundo a página:
  // Se estiver na página O&M (/solucoes/om), origem deve ser 'plantao-ia'
  // Nas demais páginas públicas, origem normal do site (ex: 'atendimento-site')
  const isOmPage = pathname === '/solucoes/om' || pathname.startsWith('/solucoes/om')
  const leadOrigin = isOmPage ? 'plantao-ia' : 'atendimento-site'

  // Fechar menu se rota mudar
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Ocultar em rotas administrativas e de autenticação
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null
  }

  // Número puro e link WhatsApp direto
  const cleanPhone = numeroWhatsApp.replace(/\D/g, '')

  // Se estiver no artigo de manutenção de placa solar, usa a mensagem pré-preenchida exata requerida
  const isArtigoManutencao = pathname.includes('manutencao-de-placa-solar-perda-geracao')
  const defaultWhatsAppMsg = isArtigoManutencao
    ? 'Olá! Li o artigo sobre manutenção de placas solares e quero saber mais sobre o diagnóstico da minha usina.'
    : 'Olá! Vim pelo site da Delfos Engenharia e gostaria de atendimento técnico.'

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultWhatsAppMsg)}`

  // Opção 1: Abrir assistente de atendimento automático
  const handleOpenAssistant = () => {
    setIsMenuOpen(false)
    setIsAssistantOpen(true)
  }

  // Opção 2: Falar no WhatsApp agora (direto)
  const handleOpenWhatsApp = () => {
    setIsMenuOpen(false)
    trackWhatsappClick(
      isArtigoManutencao ? 'floating_whatsapp_artigo_manutencao' : 'floating_whatsapp_menu',
      defaultWhatsAppMsg,
    )
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  // Opção 3: Rolar suavemente até o formulário da página atual
  const handleScrollToOrcamento = () => {
    setIsMenuOpen(false)
    const el = document.querySelector('#contato')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Se a página não tiver #contato direto (fallback), ir para /#contato
      window.location.href = '/#contato'
    }
  }

  return (
    <>
      {/* Balão circular / botão "Atendimento" fixo no canto inferior direito */}
      {/* bottom-20 no mobile para ter folga clara acima da MobileCtaBar e evitar sobreposição, bottom-6 no desktop */}
      <aside
        aria-label="Atendimento Delfos Engenharia"
        className="fixed bottom-[4.75rem] md:bottom-6 right-3 sm:right-6 z-40"
      >
        {!isAssistantOpen && (
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Fechar menu de atendimento' : 'Abrir menu de atendimento'}
            className="group relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
          >
            <div className="relative flex items-center justify-center">
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
              )}
              {!isMenuOpen && (
                <>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-solar-300 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-solar-300 rounded-full" />
                </>
              )}
            </div>
            <span className="hidden sm:inline-block text-xs font-bold tracking-wide pr-1">
              {isMenuOpen ? 'Fechar' : 'Atendimento'}
            </span>
          </button>
        )}

        {/* Menu de atendimento flutuante com 3 opções grandes e limpas */}
        {isMenuOpen && !isAssistantOpen && (
          <div
            role="dialog"
            aria-label="Opções de atendimento"
            className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 text-slate-800 pointer-events-auto"
          >
            {/* Header do Menu */}
            <div className="bg-gradient-to-r from-midnight-950 to-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-solar-400 text-midnight-950 flex items-center justify-center font-bold">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold leading-tight">Como deseja falar?</h3>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Equipe de engenharia Delfos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                title="Fechar menu"
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* As 3 opções grandes com ícones */}
            <div className="p-3 space-y-2">
              {/* Opção 1: Atendimento automático (abre assistente de triagem) */}
              <button
                type="button"
                onClick={handleOpenAssistant}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all group flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                      Atendimento automático
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Triagem rápida com nosso assistente virtual de plantão
                  </p>
                </div>
              </button>

              {/* Opção 2: Falar no WhatsApp agora (direto) */}
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full text-left p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all group flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                      Falar no WhatsApp agora
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Conversar direto com a equipe técnica • {telefoneDisplay}
                  </p>
                </div>
              </button>

              {/* Opção 3: Solicitar orçamento (rola até o formulário) */}
              <button
                type="button"
                onClick={handleScrollToOrcamento}
                className="w-full text-left p-3 rounded-xl bg-solar-50/40 hover:bg-solar-50 border border-solar-200 hover:border-solar-300 transition-all group flex items-start gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-solar-400 text-midnight-950 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-midnight-950">
                      Solicitar orçamento
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-solar-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Preencher formulário para dimensionamento e proposta
                  </p>
                </div>
              </button>
            </div>

            {/* Rodapé sutil */}
            <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200/70 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Erechim/RS e Região Sul</span>
              <span className="font-semibold text-emerald-600">Online</span>
            </div>
          </div>
        )}
      </aside>

      {/* Assistente de Triagem integrado com opção de voltar ao menu */}
      <PlantaoWidgetFlutuante
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onBackToMenu={() => {
          setIsAssistantOpen(false)
          setIsMenuOpen(true)
        }}
        origemLead={leadOrigin}
        hideFloatingButton={true}
      />
    </>
  )
}
