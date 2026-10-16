import { Sun, BatteryCharging, Wrench, Car, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PilaresProps {
  onSelectPilar: (pilar: string, origem: string) => void
}

export default function Pilares({ onSelectPilar }: PilaresProps) {
  const pilares = [
    {
      id: 'solar',
      numero: '01',
      titulo: 'Energia Solar Fotovoltaica (EPC)',
      subtitulo: 'Geração própria e independência tarifária',
      icone: Sun,
      corIcone: 'bg-solar-100 text-solar-700 border-solar-200',
      tagCor: 'bg-solar-50 text-solar-800 border-solar-200',
      problemaResolvido:
        'Redução imediata da conta de luz em até 95%, previsibilidade de custos contra reajustes e valorização do patrimônio físico.',
      subOfertas: [
        'Projetos on-grid e híbridos em telhado e solo',
        'Dimensionamento residencial, comercial, industrial e rural',
        'Modelagem para geração distribuída (GD)',
        'Homologação completa junto à concessionária',
      ],
      ctaText: 'Simular projeto',
      origem: 'pilar-solar',
      anchorDark: false,
    },
    {
      id: 'bess',
      numero: '02',
      titulo: 'Sistemas de Armazenamento BESS',
      subtitulo: 'Baterias industriais e backup inteligente',
      icone: BatteryCharging,
      corIcone: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      tagCor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      problemaResolvido:
        'Vulnerabilidade a blecautes e oscilações da rede, alto custo de energia no horário de ponta e parada produtiva de indústrias e comércios.',
      subOfertas: [
        'Peak shaving (corte de picos de demanda)',
        'Arbitragem tarifária ponta vs. fora de ponta',
        'Backup ininterrupto C&I e rural crítico',
        'Integração híbrida modular solar + banco de lítio',
      ],
      ctaText: 'Pedir estudo de viabilidade',
      origem: 'pilar-bess',
      anchorDark: true,
      darkLink: '#secao-bess',
    },
    {
      id: 'oem',
      numero: '03',
      titulo: 'Manutenção O&M e Monitoramento',
      subtitulo: 'Gestão preventiva de ativos e proteção de ROI',
      icone: Wrench,
      corIcone: 'bg-blue-100 text-blue-800 border-blue-200',
      tagCor: 'bg-blue-50 text-blue-800 border-blue-200',
      problemaResolvido:
        'Perda silenciosa de até 25% da geração por sujidade, falhas de isolamento, aquecimento de células e falta de acompanhamento técnico.',
      subOfertas: [
        'Monitoramento remoto de performance em tempo real',
        'Termografia aérea com drone e inspeção elétrica',
        'Lavagem técnica especializada com água tratada',
        'Planos com SLA de atendimento e relatórios analíticos',
      ],
      ctaText: 'Solicitar diagnóstico da usina',
      origem: 'pilar-oem',
      anchorDark: false,
    },
    {
      id: 'carregadores',
      numero: '04',
      titulo: 'Carregadores Veiculares',
      subtitulo: 'Eletromobilidade com gestão de carga (DLM)',
      icone: Car,
      corIcone: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      tagCor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      problemaResolvido:
        'Falta de infraestrutura segura de recarga, conflitos em condomínios por rateio de energia e risco de sobrecarga do transformador predial.',
      subOfertas: [
        'Wallboxes inteligentes para residências e empresas',
        'Carregadores semirrápidos e rápidos DC para frotas',
        'Gestão dinâmica de carga (DLM) sem troca de transformador',
        'Medição individualizada e cobrança por aplicativo',
      ],
      ctaText: 'Solicitar vistoria',
      origem: 'pilar-carregadores',
      anchorDark: true,
      darkLink: '#secao-carregadores',
    },
  ]

  return (
    <section id="solucoes" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-800 text-xs font-bold uppercase tracking-wider mb-3">
            Pilares Estratégicos Delfos
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Quatro soluções que operam o seu ciclo energético
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Mais do que instalar placas: desenhamos a arquitetura completa de geração,
            armazenamento, continuidade operacional e mobilidade da sua empresa ou residência.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pilares.map((p) => {
            const Icon = p.icone
            return (
              <div
                key={p.id}
                className="bg-frost rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Number water-mark */}
                <span className="absolute top-4 right-6 text-5xl font-black text-slate-200/60 select-none pointer-events-none group-hover:text-slate-300/80 transition-colors">
                  {p.numero}
                </span>

                <div>
                  {/* Top Header */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${p.corIcone}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1 ${p.tagCor}`}
                      >
                        Solução 0{p.numero.slice(-1)}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                        {p.titulo}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{p.subtitulo}</p>
                    </div>
                  </div>

                  {/* Problema que resolve */}
                  <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Problema que resolve:
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed">{p.problemaResolvido}</p>
                  </div>

                  {/* Sub-ofertas */}
                  <div className="space-y-2 mb-8">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Escopo e diferenciais técnicos:
                    </span>
                    <ul className="space-y-2">
                      {p.subOfertas.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <Button
                    onClick={() => onSelectPilar(p.titulo, p.origem)}
                    className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-2.5 rounded-xl text-sm shadow-md flex items-center justify-center gap-2 group/btn"
                  >
                    <span>{p.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>

                  {p.darkLink && (
                    <a
                      href={p.darkLink}
                      className="text-xs font-semibold text-slate-500 hover:text-midnight-900 text-center sm:text-right hover:underline"
                    >
                      Ver detalhes técnicos (seção dark) ↓
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
