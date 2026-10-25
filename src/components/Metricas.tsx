import { useEffect, useState, useRef } from 'react'
import { Calendar, CheckCircle2 } from 'lucide-react'

interface CounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

function Counter({ end, suffix = '', prefix = '', duration = 1800 }: CounterProps) {
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
        setCount(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [hasStarted, end, duration])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString('pt-BR')}
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

        {/* 2 Stat Cards bem distribuídos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* 1. Anos de Mercado */}
          <div className="bg-gradient-to-br from-[#0D2545] to-[#08182D] rounded-3xl p-7 lg:p-9 border-2 border-solar-400/30 shadow-xl hover:border-solar-400/60 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-solar-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-solar-400/20 transition-all" />
            <div className="h-1.5 w-full bg-gradient-to-r from-solar-400 to-amber-500 absolute top-0 left-0" />

            <div className="flex items-center gap-4 mb-5 pt-2">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-solar-400 text-midnight-950 flex items-center justify-center shadow-lg shadow-solar-500/20 group-hover:scale-105 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-solar-400 tracking-tight leading-none drop-shadow-sm">
                <Counter end={12} suffix=" anos" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">de mercado contínuo</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pioneirismo em geração distribuída e engenharia de campo desde o início do marco legal
              do setor elétrico.
            </p>
          </div>

          {/* 2. Projetos Entregues */}
          <div className="bg-gradient-to-br from-[#0D2545] to-[#08182D] rounded-3xl p-7 lg:p-9 border-2 border-emerald-400/30 shadow-xl hover:border-emerald-400/60 hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-400/20 transition-all" />
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-500 absolute top-0 left-0" />

            <div className="flex items-center gap-4 mb-5 pt-2">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-500 text-midnight-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 tracking-tight leading-none drop-shadow-sm">
                <Counter end={3000} suffix="+" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">projetos entregues</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Obras ativas e gerando economia em aplicações residenciais, comerciais, industriais e
              rurais.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
