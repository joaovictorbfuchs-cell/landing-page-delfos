import { Link } from 'react-router-dom'
import {
  Home,
  Store,
  Factory,
  Tractor,
  Building2,
  TrendingUp,
  Truck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

interface SegmentosProps {
  onSelectSegmento?: (segmento: string, origem: string) => void
}

export default function Segmentos({ onSelectSegmento }: SegmentosProps) {
  const segmentos = [
    {
      id: 'residencias',
      slug: 'residencias',
      href: '/segmentos/residencias',
      titulo: 'Residências',
      pergunta: '“Quanto posso economizar e há opção de backup?”',
      dadoQualificacao: 'Cidade, concessionária e valor da conta',
      cta: 'Simular projeto',
      icone: Home,
      cor: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'comercio-servicos',
      slug: 'comercio-servicos',
      href: '/segmentos/comercio-servicos',
      titulo: 'Comércio e Serviços',
      pergunta: '“Como reduzir custo sem interromper a operação?”',
      dadoQualificacao: 'Conta, horário de consumo, necessidade de continuidade',
      cta: 'Pedir estudo de viabilidade',
      icone: Store,
      cor: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'industria',
      slug: 'industria',
      href: '/segmentos/industria',
      titulo: 'Indústria',
      pergunta: '“Como dimensionar geração, BESS e demanda contratada?”',
      dadoQualificacao: 'Perfil de carga e demanda contratada',
      cta: 'Falar com engenharia',
      icone: Factory,
      cor: 'text-slate-700 bg-slate-100 border-slate-300',
    },
    {
      id: 'agronegocio',
      slug: 'agronegocio',
      href: '/segmentos/agronegocio',
      titulo: 'Agronegócio',
      pergunta: '“Como garantir energia para a operação rural?”',
      dadoQualificacao: 'Local, atividade e qualidade da rede rural',
      cta: 'Avaliar unidade',
      icone: Tractor,
      cor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'condominios',
      slug: 'condominios',
      href: '/segmentos/condominios',
      titulo: 'Condomínios',
      pergunta: '“Como instalar recarga e dividir o consumo?”',
      dadoQualificacao: 'Número de vagas e infraestrutura existente',
      cta: 'Solicitar vistoria',
      icone: Building2,
      cor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      id: 'investidores',
      slug: 'investidores',
      href: '/segmentos/investidores',
      titulo: 'Investidores e Usinas',
      pergunta: '“Como implantar ou recuperar desempenho?”',
      dadoQualificacao: 'Potência, local e etapa do projeto',
      cta: 'Solicitar diagnóstico',
      icone: TrendingUp,
      cor: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      id: 'frotas-eletropostos',
      slug: 'frotas-eletropostos',
      href: '/segmentos/frotas-eletropostos',
      titulo: 'Frotas e Eletropostos',
      pergunta: '“Qual infraestrutura de recarga atende à frota?”',
      dadoQualificacao: 'Número de veículos, local e padrão de uso',
      cta: 'Pedir estudo elétrico',
      icone: Truck,
      cor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
  ]

  return (
    <section id="segmentos" className="py-24 bg-frost border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-solar-600 uppercase tracking-wider block mb-2">
              Portas de Entrada por Setor
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              O que você precisa resolver hoje?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Cada perfil de cliente possui dores regulatórias, operacionais e tarifárias
              específicas. Escolha o seu segmento para falar direto com a equipe especializada.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            7 segmentos atendidos no RS e Sul
          </span>
        </div>

        {/* 7 Segment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {segmentos.map((s) => {
            const Icon = s.icone
            return (
              <Link
                key={s.id}
                to={s.href}
                onClick={() => {
                  if (onSelectSegmento) onSelectSegmento(s.titulo, `segmento-${s.slug}`)
                }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-solar-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.cor} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-solar-600 bg-solar-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      Ver página
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-solar-600 transition-colors mb-2">
                    {s.titulo}
                  </h3>

                  <p className="text-xs text-slate-600 italic leading-relaxed mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 min-h-[3.75rem] flex items-center">
                    {s.pergunta}
                  </p>

                  <div className="space-y-1 mb-4 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 block">
                      Dado de qualificação:
                    </span>
                    <span>{s.dadoQualificacao}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-midnight-900 group-hover:text-solar-600">
                  <span>{s.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
