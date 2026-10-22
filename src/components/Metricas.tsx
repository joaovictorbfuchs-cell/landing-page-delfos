import { useEffect, useState, useRef } from 'react'
import { Calendar, CheckCircle2, Star } from 'lucide-react'

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
    <section id="metricas" className="py-16 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-solar-600 uppercase tracking-wider block mb-1">
              Solidez & Experiência
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nossos números
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Resultados construídos com dedicação e engenharia de ponta no Rio Grande do Sul e em
            todo o Sul do Brasil.
          </p>
        </div>

        {/* 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Anos de Mercado */}
          <div className="bg-frost rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-baseline gap-3.5 mb-3">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-solar-100 text-solar-700 flex items-center justify-center group-hover:scale-105 transition-transform self-end">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-midnight-950 tracking-tight leading-none">
                <Counter end={12} suffix=" anos" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">de mercado contínuo</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pioneirismo em geração distribuída e engenharia de campo desde o início do marco
              legal.
            </p>
          </div>

          {/* 2. Projetos Entregues */}
          <div className="bg-frost rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-baseline gap-3.5 mb-3">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform self-end">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-midnight-950 tracking-tight leading-none">
                <Counter end={3000} suffix="+" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">projetos entregues</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Obras residenciais, comerciais, industriais e rurais ativas no Sul do país.
            </p>
          </div>

          {/* 3. Avaliação Google */}
          <div className="bg-frost rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-baseline gap-3.5 mb-3">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform self-end">
                <Star className="w-6 h-6 fill-solar-400 text-solar-400" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-midnight-950 tracking-tight leading-none flex items-baseline gap-1">
                <span>4.9</span>
                <span className="text-lg sm:text-xl font-bold text-slate-400">/ 5.0</span>
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">avaliação no Google</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Índice máximo de satisfação e recomendação comprovada por clientes reais de Erechim e
              região.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
