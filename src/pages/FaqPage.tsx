import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  ChevronDown,
  Sparkles,
  Zap,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoMeta from '@/components/SeoMeta'
import MobileCtaBar from '@/components/MobileCtaBar'
import { FAQ_ITEMS } from '@/data/faq'
import { cn } from '@/lib/utils'

// Schema.org FAQPage — gerado a partir dos mesmos dados renderizados na página
const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.pergunta,
    acceptedAnswer: {
      '@type': 'Answer',
      text: `${item.respostaRapida} ${item.detalheTecnico}`.trim(),
    },
  })),
}

export function FaqPage() {
  const [busca, setBusca] = useState('')

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'pergunta-1': true,
  })
  const [activeNavId, setActiveNavId] = useState<string>('pergunta-1')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Filtragem ao vivo
  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return FAQ_ITEMS

    return FAQ_ITEMS.filter((item) => {
      const emPergunta = item.pergunta.toLowerCase().includes(termo)
      const emRapida = item.respostaRapida.toLowerCase().includes(termo)
      const emTecnico = item.detalheTecnico.toLowerCase().includes(termo)
      const emTituloNav = item.tituloNav.toLowerCase().includes(termo)
      return emPergunta || emRapida || emTecnico || emTituloNav
    })
  }, [busca])

  // Se digitar na busca com mais de 2 letras, abre os itens encontrados automaticamente
  useEffect(() => {
    if (busca.trim().length >= 2) {
      const nextOpen: Record<string, boolean> = {}
      itensFiltrados.forEach((item) => {
        nextOpen[item.id] = true
      })
      setOpenIds(nextOpen)
    }
  }, [busca, itensFiltrados])

  // Scroll spy para active link no desktop
  useEffect(() => {
    const handleScroll = () => {
      const offsets = FAQ_ITEMS.map((item) => {
        const el = document.getElementById(item.id)
        if (!el) return { id: item.id, top: Infinity }
        const rect = el.getBoundingClientRect()
        return { id: item.id, top: rect.top }
      })

      // Encontra o elemento que está mais perto do topo (margem de 150px)
      const visible = offsets.filter((o) => o.top <= 200)
      if (visible.length > 0) {
        const current = visible[visible.length - 1]
        setActiveNavId(current.id)
      } else if (offsets.length > 0) {
        setActiveNavId(offsets[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const todasAbertas = useMemo(() => {
    if (itensFiltrados.length === 0) return false
    return itensFiltrados.every((item) => openIds[item.id])
  }, [itensFiltrados, openIds])

  const alternarTodas = () => {
    const novoEstado = !todasAbertas
    const next: Record<string, boolean> = {}
    itensFiltrados.forEach((it) => {
      next[it.id] = novoEstado
    })
    setOpenIds(next)
  }

  const handleNavClick = (id: string) => {
    setMobileNavOpen(false)
    setOpenIds((prev) => ({ ...prev, [id]: true }))
    setActiveNavId(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-800 selection:text-white">
      <SeoMeta
        title="Perguntas Frequentes sobre Energia Solar | Delfos"
        description="Respostas diretas e detalhes técnicos sobre instalação solar, payback, créditos com a Lei 14.300, baterias de energia para backup no apagão e recarga veicular."
        canonicalPath="/faq"
        schemaJsonLd={faqPageSchema}
      />

      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero do FAQ */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 border-b border-slate-200/80 pt-8 sm:pt-12 pb-10 sm:pb-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-950 border border-emerald-200 mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.3)] animate-pulse" />
              <span>Conteúdo com revisão técnica — regulação ANEEL vigente</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-950 tracking-tight leading-tight mb-4">
              Perguntas Frequentes
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Tire dúvidas sobre energia solar, baterias de energia para backup em apagões,
              carregadores veiculares e manutenção preventiva de usinas fotovoltaicas.
            </p>

            {/* Barra de Pesquisa e Ações */}
            <div className="max-w-2xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-md shadow-emerald-950/5 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por tema (ex.: payback, baterias, carro elétrico, Lei 14.300)..."
                  className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition"
                  aria-label="Buscar perguntas frequentes"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 px-1 sm:px-0">
                <button
                  type="button"
                  onClick={alternarTodas}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <span>{todasAbertas ? 'Recolher todas' : 'Expandir todas'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Layout Principal: Sidebar Índice + Acordeão */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          {/* Menu sanfona Mobile */}
          <div className="lg:hidden mb-6">
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-emerald-950"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                Índice de Perguntas ({FAQ_ITEMS.length} tópicos)
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-slate-500 transition-transform duration-200',
                  mobileNavOpen && 'rotate-180',
                )}
              />
            </button>

            {mobileNavOpen && (
              <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-2 flex flex-col gap-1">
                {FAQ_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      'text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-2 transition',
                      activeNavId === item.id
                        ? 'bg-emerald-50 text-emerald-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    <span className="w-5 h-5 rounded bg-slate-100 text-[11px] font-bold text-slate-600 flex items-center justify-center shrink-0">
                      {item.numero}
                    </span>
                    <span className="truncate">{item.tituloNav}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            {/* Sidebar Sticky Desktop */}
            <aside className="hidden lg:block sticky top-24">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-950 pb-3 mb-3 border-b border-slate-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Navegação Rápida
                </div>
                <nav className="flex flex-col gap-1">
                  {FAQ_ITEMS.map((item) => {
                    const isActive = activeNavId === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={cn(
                          'w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition',
                          isActive
                            ? 'bg-emerald-900 text-white font-semibold shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                        )}
                      >
                        <span
                          className={cn(
                            'w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 transition',
                            isActive ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-500',
                          )}
                        >
                          {item.numero}
                        </span>
                        <span className="truncate">{item.tituloNav}</span>
                      </button>
                    )
                  })}
                </nav>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-2">Dúvida específica do seu projeto?</p>
                  <Link
                    to="/#contato"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition"
                  >
                    Falar com especialista
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Lista de Perguntas (Acordeão) */}
            <section className="flex flex-col gap-4">
              {itensFiltrados.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center my-6">
                  <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 mb-1">
                    Nenhuma pergunta encontrada
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                    Não localizamos resultados para &ldquo;{busca}&rdquo;. Tente buscar por outros
                    termos ou fale diretamente com nossa equipe técnica.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBusca('')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Limpar pesquisa
                  </button>
                </div>
              ) : (
                itensFiltrados.map((item) => {
                  const isOpen = Boolean(openIds[item.id])
                  return (
                    <article
                      key={item.id}
                      id={item.id}
                      className={cn(
                        'bg-white rounded-2xl border transition-all duration-200 scroll-mt-28 overflow-hidden',
                        isOpen
                          ? 'border-emerald-300 shadow-md shadow-emerald-900/5 ring-1 ring-emerald-400/20'
                          : 'border-slate-200 hover:border-slate-300 shadow-sm',
                      )}
                    >
                      {/* Gatilho da Pergunta */}
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={isOpen}
                        className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <span
                            className={cn(
                              'w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition',
                              isOpen
                                ? 'bg-emerald-900 text-white shadow-sm'
                                : 'bg-slate-100 text-emerald-900',
                            )}
                          >
                            {item.numero}
                          </span>
                          <h2 className="text-base sm:text-lg font-bold text-emerald-950 leading-snug tracking-tight">
                            {item.pergunta}
                          </h2>
                        </div>
                        <div
                          className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200',
                            isOpen
                              ? 'rotate-180 bg-emerald-100 text-emerald-900'
                              : 'bg-slate-100 text-slate-500',
                          )}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {/* Corpo com Resposta Rápida e Detalhe Técnico */}
                      {isOpen && (
                        <div className="px-4 sm:px-6 pb-6 pt-1 border-t border-slate-100 animate-in fade-in duration-200">
                          {/* Caixa Destacada: Resposta Rápida */}
                          <div className="bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-xl p-4 sm:p-4.5 my-3">
                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-emerald-900 mb-1.5">
                              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              Resposta Rápida
                            </div>
                            <p className="text-emerald-950 text-sm sm:text-base font-semibold leading-relaxed">
                              {item.respostaRapida}
                            </p>
                          </div>

                          {/* Detalhe Técnico */}
                          <div className="mt-4 pt-1">
                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                              Detalhe Técnico
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                              {item.detalheTecnico}
                            </p>
                          </div>

                          {/* Rodapé do Card com CTA contextual */}
                          {item.ctaTexto && item.ctaHref && (
                            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                              <Link
                                to={item.ctaHref}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-900 hover:bg-emerald-800 text-white transition shadow-sm hover:shadow"
                              >
                                <span>{item.ctaTexto}</span>
                                <ArrowRight className="w-4 h-4 text-amber-400" />
                              </Link>

                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                                Base técnica regulatória ANEEL
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  )
                })
              )}
            </section>
          </div>
        </div>

        {/* Banner Final de Conversão */}
        <section className="mt-16 sm:mt-20 border-t border-emerald-950/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white py-14 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-3">
              Atendimento Consultivo Especializado
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Sua dúvida não está aqui?
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Converse com a engenharia da Delfos. Avaliamos a viabilidade técnica e a
              regulamentação do seu caso de forma personalizada.
            </p>
            <Link
              to="/#contato"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-base font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-black/20"
            >
              <span>Falar com um especialista</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </section>

        {/* Disclaimer Regulatório */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-slate-500 leading-relaxed">
          <p>
            As respostas desta página têm caráter informativo e consideram a regulação vigente da
            ANEEL (SCEE e Lei nº 14.300/2022). Faixas de valores, prazos e percentuais citados são
            referências de mercado: o resultado exato depende do dimensionamento técnico de cada
            projeto. © Delfos — Engenharia e Soluções Energéticas.
          </p>
        </div>
      </main>

      <Footer />
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
