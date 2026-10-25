import { useEffect, useState, useRef } from 'react'
import { Sun, Activity, Calendar, CheckCircle2 } from 'lucide-react'

interface CounterProps {
  end: number
  decimals?: number
  suffix?: string
  prefix?: string
  duration?: number
}

function Counter({ end, decimals = 0, suffix = '', prefix = '', duration = 1800 }: CounterProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let start = 0
    const stepTime = 20
    const totalSteps = duration / stepTime
    const increment = end / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [hasStarted, end, duration])

  const formattedValue = count.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}

export default function Metricas() {
  return (
    <section
      id="metricas"
      className="py-20 bg-gradient-to-b from-[#061325] via-[#091C36] to-[#061325] text-white border-y border-white/10 relative overflow-hidden"
    >
      {/* Luz ambiente sutil de fundo para profundidade */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-solar-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-white/10">
          <div>
            <span className="inline-block text-xs font-bold text-solar-400 uppercase tracking-widest mb-1.5 px-3 py-1 rounded-full bg-solar-400/10 border border-solar-400/20">
              Solidez &amp; Experiência
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Nossos números
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            Resultados consolidados com dedicação técnica, conformidade de normas e engenharia de
            ciclo completo.
          </p>
        </div>

        {/* 4 Stat Cards lado a lado: 4 colunas desktop, 2 colunas mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {/* Card 1: 12,05 MWp — Potência instalada (dourado) */}
          <div className="bg-gradient-to-br from-[#0D2545] to-[#08182D] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-solar-400/30 shadow-xl hover:border-solar-400/60 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-solar-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-solar-400/20 transition-all" />
            <div className="h-1.5 w-full bg-gradient-to-r from-solar-400 to-amber-500 absolute top-0 left-0" />

            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 pt-1 sm:pt-2">
                <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-solar-400 text-midnight-950 flex items-center justify-center shadow-lg shadow-solar-500/20 group-hover:scale-105 transition-transform">
                  <Sun className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-solar-400 tracking-tight leading-none drop-shadow-sm mb-2">
                <Counter end={12.05} decimals={2} suffix=" MWp" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
                Potência instalada
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-2">
              Capacidade de geração limpa em operação contínua gerando economia real.
            </p>
          </div>

          {/* Card 2: 468 — Usinas sob monitoramento (dourado) */}
          <div className="bg-gradient-to-br from-[#0D2545] to-[#08182D] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-solar-400/30 shadow-xl hover:border-solar-400/60 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-solar-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-solar-400/20 transition-all" />
            <div className="h-1.5 w-full bg-gradient-to-r from-solar-400 to-amber-500 absolute top-0 left-0" />

            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 pt-1 sm:pt-2">
                <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-solar-400 text-midnight-950 flex items-center justify-center shadow-lg shadow-solar-500/20 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-solar-400 tracking-tight leading-none drop-shadow-sm mb-2">
                <Counter end={468} suffix=" usinas" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
                Usinas sob monitoramento
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-2">
              Supervisão em tempo real pela engenharia de O&amp;M para máxima disponibilidade.
            </p>
          </div>

          {/* Card 3: 12 — Anos de mercado (verde) */}
          <div className="bg-gradient-to-br from-[#0D2545] to-[#08182D] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-emerald-400/30 shadow-xl hover:border-emerald-400/60 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-400/20 transition-all" />
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500 absolute top-0 left-0" />

            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 pt-1 sm:pt-2">
                <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-emerald-500 text-midnight-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 tracking-tight leading-none drop-shadow-sm mb-2">
                <Counter end={12} suffix=" anos" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
                Anos de mercado
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-2">
              Atuação técnica contínua no RS, SC e PR desde o início do marco legal elétrico.
            </p>
          </div>

          {/* Card 4: 3.000+ — Projetos entregues (verde) */}
          <div className="bg-gradient-to-br from-[#0D2545] to-[#08182D] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-emerald-400/30 shadow-xl hover:border-emerald-400/60 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-400/20 transition-all" />
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500 absolute top-0 left-0" />

            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 pt-1 sm:pt-2">
                <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl bg-emerald-500 text-midnight-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 tracking-tight leading-none drop-shadow-sm mb-2">
                <Counter end={3000} suffix="+" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
                Projetos entregues
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed mt-2">
              Sistemas homologados e gerando economia em diversos segmentos do Sul do Brasil.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
