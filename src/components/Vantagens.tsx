import { TrendingDown, Home, Leaf, ShieldAlert } from 'lucide-react'

export default function Vantagens() {
  const cards = [
    {
      icon: TrendingDown,
      title: 'Economia de até 90%',
      description:
        'Redução drástica e imediata na fatura de energia elétrica, com retorno total do investimento estimado em 3 a 5 anos.',
      gradient: 'from-amber-400 to-solar-500',
      tag: 'Retorno Garantido',
    },
    {
      icon: Home,
      title: 'Valorização do Imóvel',
      description:
        'Imóveis residenciais e comerciais equipados com sistema fotovoltaico valorizam entre 10% e 20% no mercado imobiliário.',
      gradient: 'from-blue-500 to-midnight-800',
      tag: '+20% no Mercado',
    },
    {
      icon: Leaf,
      title: 'Sustentabilidade Real',
      description:
        'Energia 100% limpa e renovável. Reduza toneladas de emissões de carbono gerando a sua própria energia a partir do sol.',
      gradient: 'from-emerald-400 to-leaf-dark',
      tag: 'Zero Emissão CO₂',
    },
    {
      icon: ShieldAlert,
      title: 'Independência Energética',
      description:
        'Fique protegido contra aumentos abusivos de tarifas, bandeiras tarifárias vermelhas e inflação energética pelos próximos 25 anos.',
      gradient: 'from-orange-400 to-red-500',
      tag: 'Proteção Tarifária',
    },
  ]

  return (
    <section id="vantagens" className="py-24 bg-frost border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-700 text-xs font-bold uppercase tracking-wider mb-3">
            Vantagens Exclusivas
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Por que escolher a energia solar?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Descubra como a Delfos Engenharia transforma o sol em economia financeira líquida e
            autonomia para sua família ou negócio em Erechim.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-md">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-solar-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-solar-600 group-hover:translate-x-1 transition-transform">
                  <span>Alta eficiência Delfos →</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
