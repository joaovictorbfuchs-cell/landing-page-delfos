import { FileText, Search, Wrench, CheckCircle } from 'lucide-react'

export default function ComoFunciona() {
  const steps = [
    {
      step: '01',
      title: 'Contato',
      description:
        'Você envia seus dados e o consumo médio da sua fatura pelo nosso formulário em menos de 1 minuto.',
      icon: FileText,
      duration: 'Imediato',
    },
    {
      step: '02',
      title: 'Análise Técnica',
      description:
        'Nossos engenheiros analisam a radiação solar do local, telhado ou terreno e o histórico de consumo da distribuidora.',
      icon: Search,
      duration: 'Até 15 dias úteis',
    },
    {
      step: '03',
      title: 'Projeto Personalizado',
      description:
        'Elaboramos o dimensionamento exato, escolha dos inversores e painéis de fabricantes de primeira linha, e garantimos a aprovação junto à concessionária.',
      icon: Wrench,
      duration: 'Sob Medida',
    },
    {
      step: '04',
      title: 'Instalação e Conexão',
      description:
        'Nossa equipe técnica credenciada instala tudo com normas de segurança, liga o sistema e você já começa a economizar.',
      icon: CheckCircle,
      duration: 'Chave na Mão',
    },
  ]

  return (
    <section id="como-funciona" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-700 text-xs font-bold uppercase tracking-wider mb-3">
            Passo a Passo
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Nosso processo em 4 passos simples
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Da primeira conversa à ligação do sistema na rede elétrica: cuidamos de 100% da
            burocracia e da engenharia para você.
          </p>
        </div>

        {/* Steps Grid with connecting horizontal line on desktop */}
        <div className="relative">
          {/* Connecting line for desktop (hidden on mobile) */}
          <div className="hidden lg:block absolute top-28 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-solar-300 via-solar-400 to-leaf -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group relative"
                >
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-extrabold text-solar-500 tracking-tighter">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      {item.duration}
                    </span>
                  </div>

                  {/* Icon circle */}
                  <div className="w-14 h-14 rounded-2xl bg-midnight-900 text-solar-400 flex items-center justify-center mb-5 group-hover:bg-solar-400 group-hover:text-midnight-950 transition-colors shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
