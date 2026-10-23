import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Zap, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react'
import { type FaqSegmentoItem } from '@/data/faqSegmentos'
import { cn } from '@/lib/utils'

interface FaqSegmentoSectionProps {
  segmentoNome: string
  itens: FaqSegmentoItem[]
  isDark?: boolean
  descricao?: string
}

export function FaqSegmentoSection({
  segmentoNome,
  itens,
  isDark = false,
  descricao,
}: FaqSegmentoSectionProps) {
  // Por padrão, a primeira pergunta fica aberta
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [itens[0]?.id || '']: true,
  })

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!itens || itens.length === 0) return null

  return (
    <section
      id="faq-segmento"
      className={cn(
        'py-20 border-b scroll-mt-24 transition-colors',
        isDark ? 'bg-[#081220] border-white/10' : 'bg-slate-50/70 border-slate-200/80',
      )}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Cabeçalho da Seção */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Revisão técnica — regulação ANEEL vigente</span>
          </div>

          <h2
            className={cn(
              'text-3xl sm:text-4xl font-extrabold tracking-tight',
              isDark ? 'text-white' : 'text-slate-900',
            )}
          >
            Perguntas Frequentes — {segmentoNome}
          </h2>

          <p
            className={cn(
              'text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed',
              isDark ? 'text-slate-300' : 'text-slate-600',
            )}
          >
            {descricao ||
              `Dúvidas dos clientes de ${segmentoNome} respondidas com resposta rápida para consulta direta e detalhe técnico para análise aprofundada.`}
          </p>
        </div>

        {/* Acordeão de 5 Perguntas */}
        <div className="space-y-4">
          {itens.map((item) => {
            const isOpen = Boolean(openIds[item.id])

            return (
              <article
                key={item.id}
                id={item.id}
                className={cn(
                  'rounded-2xl border transition-all duration-200 overflow-hidden',
                  isDark
                    ? isOpen
                      ? 'bg-white/10 border-solar-400/40 shadow-lg shadow-black/20 ring-1 ring-solar-400/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                    : isOpen
                      ? 'bg-white border-emerald-300 shadow-md shadow-emerald-950/5 ring-1 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs',
                )}
              >
                {/* Gatilho / Cabeçalho do Card */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className={cn(
                    'w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition',
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50/60',
                  )}
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <span
                      className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 transition',
                        isDark
                          ? isOpen
                            ? 'bg-solar-400 text-midnight-950 font-black'
                            : 'bg-white/10 text-slate-300'
                          : isOpen
                            ? 'bg-[#0b3d2e] text-white shadow-xs'
                            : 'bg-emerald-50 text-[#0b3d2e] border border-emerald-100',
                      )}
                    >
                      {item.numero}
                    </span>

                    <h3
                      className={cn(
                        'text-base sm:text-lg font-bold leading-snug tracking-tight',
                        isDark
                          ? isOpen
                            ? 'text-white'
                            : 'text-slate-200'
                          : isOpen
                            ? 'text-slate-900'
                            : 'text-slate-800',
                      )}
                    >
                      {item.pergunta}
                    </h3>
                  </div>

                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200',
                      isDark
                        ? isOpen
                          ? 'rotate-180 bg-solar-400/20 text-solar-300'
                          : 'bg-white/10 text-slate-400'
                        : isOpen
                          ? 'rotate-180 bg-emerald-100 text-[#0b3d2e]'
                          : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Conteúdo Expandido */}
                {isOpen && (
                  <div
                    className={cn(
                      'px-4 sm:px-6 pb-6 pt-1 border-t animate-in fade-in duration-200',
                      isDark ? 'border-white/10' : 'border-slate-100',
                    )}
                  >
                    {/* Caixa Destacada: Resposta Rápida (Verde Floresta / Âmbar) */}
                    <div
                      className={cn(
                        'rounded-r-xl p-4 sm:p-4.5 my-3 border-l-4',
                        isDark
                          ? 'bg-emerald-950/40 border-solar-400 text-slate-100'
                          : 'bg-[#eaf5f0] border-[#0f5132] text-[#0f3627]',
                      )}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mb-1.5 text-amber-500 dark:text-solar-400">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Resposta rápida
                      </div>
                      <p
                        className={cn(
                          'text-sm sm:text-base font-semibold leading-relaxed',
                          isDark ? 'text-slate-100' : 'text-[#064e3b]',
                        )}
                      >
                        {item.respostaRapida}
                      </p>
                    </div>

                    {/* Detalhe Técnico (Jargão do setor que mata objeções) */}
                    <div className="mt-4 pt-1">
                      <div
                        className={cn(
                          'flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2',
                          isDark ? 'text-slate-400' : 'text-slate-500',
                        )}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-solar-400" />
                        Detalhe técnico
                      </div>
                      <div
                        className={cn(
                          'text-xs sm:text-sm leading-relaxed space-y-2.5',
                          isDark ? 'text-slate-300' : 'text-slate-700',
                        )}
                      >
                        {item.detalheTecnico.map((paragrafo, pIdx) => (
                          <p key={pIdx}>{paragrafo}</p>
                        ))}
                      </div>
                    </div>

                    {/* CTA Contextual (quando existir no item) */}
                    {item.ctaTexto && item.ctaHref && (
                      <div
                        className={cn(
                          'mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3',
                          isDark ? 'border-white/10' : 'border-slate-100',
                        )}
                      >
                        {item.ctaNota && (
                          <span
                            className={cn(
                              'text-xs italic',
                              isDark ? 'text-slate-400' : 'text-slate-500',
                            )}
                          >
                            {item.ctaNota}
                          </span>
                        )}

                        <Link
                          to={item.ctaHref}
                          className={cn(
                            'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm hover:shadow group',
                            isDark
                              ? 'bg-solar-400 hover:bg-solar-500 text-midnight-950'
                              : 'bg-[#0b3d2e] hover:bg-[#145943] text-white',
                          )}
                        >
                          <span>{item.ctaTexto}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* Banda / CTA Suave Final para Atendimento Técnico */}
        <div
          className={cn(
            'mt-10 p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4',
            isDark
              ? 'bg-white/5 border-white/10 text-white'
              : 'bg-white border-slate-200 text-slate-800 shadow-xs',
          )}
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-solar-400/15 flex items-center justify-center text-solar-400 shrink-0 mx-auto sm:mx-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Tem outra dúvida técnica sobre {segmentoNome}?</h4>
              <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Nossa equipe de engenharia analisa seu caso com a regulação e curva de carga.
              </p>
            </div>
          </div>

          <Link
            to="/#contato"
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition',
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200',
            )}
          >
            <span>Falar com um especialista</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
