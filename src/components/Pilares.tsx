import { Link } from 'react-router-dom'
import { Sun, BatteryCharging, Wrench, Car, ArrowRight } from 'lucide-react'

export default function Pilares() {
  const pilares = [
    {
      id: 'solar',
      numero: '01',
      titulo: 'Energia solar',
      beneficio:
        'Redução de até 90% na conta de luz, com toda a papelada e a aprovação na concessionária resolvidas por nós.',
      icone: Sun,
      corIcone: 'bg-solar-400 text-midnight-950 shadow-solar-500/20',
      barraCor: 'bg-gradient-to-r from-solar-400 to-amber-500',
      tagCor: 'bg-solar-50 text-solar-900 border-solar-200',
      paginaUrl: '/solucoes/energia-solar',
      textoBotao: 'Ver como funciona',
      bordaHover: 'hover:border-solar-400/70',
    },
    {
      id: 'bess',
      numero: '02',
      titulo: 'Baterias de energia',
      beneficio: 'Energia de reserva quando falta luz, e mais economia nas horas de consumo alto.',
      icone: BatteryCharging,
      corIcone: 'bg-emerald-600 text-white shadow-emerald-600/20',
      barraCor: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      tagCor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      paginaUrl: '/solucoes/bess',
      textoBotao: 'Ver como funciona',
      bordaHover: 'hover:border-emerald-500/70',
    },
    {
      id: 'oem',
      numero: '03',
      titulo: 'Manutenção e monitoramento',
      beneficio:
        'Vistorias periódicas e atendimento rápido quando algo sair do normal — sua usina sempre gerando no máximo.',
      icone: Wrench,
      corIcone: 'bg-sky-600 text-white shadow-sky-600/20',
      barraCor: 'bg-gradient-to-r from-sky-500 to-blue-600',
      tagCor: 'bg-sky-50 text-sky-900 border-sky-200',
      paginaUrl: '/solucoes/om',
      textoBotao: 'Ver detalhes do serviço',
      bordaHover: 'hover:border-sky-500/70',
    },
    {
      id: 'carregadores',
      numero: '04',
      titulo: 'Recarga veicular',
      beneficio:
        'Carregue veículos sem estourar a rede elétrica do seu imóvel — para casas, condomínios e empresas.',
      icone: Car,
      corIcone: 'bg-indigo-600 text-white shadow-indigo-600/20',
      barraCor: 'bg-gradient-to-r from-indigo-500 to-violet-600',
      tagCor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      paginaUrl: '/solucoes/carregadores',
      textoBotao: 'Ver como funciona',
      bordaHover: 'hover:border-indigo-500/70',
    },
  ]

  return (
    <section id="solucoes" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-800 text-xs font-bold uppercase tracking-wider mb-3">
            Nossas soluções
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Tudo para a sua energia, em um só lugar
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Projeto, instalação e manutenção de energia solar, baterias e recarga veicular — com uma
            única equipe responsável, do orçamento ao suporte.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pilares.map((p) => {
            const Icon = p.icone
            return (
              <Link
                key={p.id}
                to={p.paginaUrl}
                aria-label={`${p.titulo} - ${p.textoBotao}`}
                className={`bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm hover:shadow-2xl ${p.bordaHover} hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer`}
              >
                {/* Barra de cor no topo para identidade visual marcante */}
                <div className={`h-2 w-full ${p.barraCor}`} />

                <div className="p-7 sm:p-9">
                  {/* Top Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${p.corIcone} group-hover:scale-105 transition-transform duration-300 shrink-0`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <span
                        className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-1.5 ${p.tagCor}`}
                      >
                        Solução {p.numero}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight group-hover:text-midnight-950 transition-colors">
                        {p.titulo}
                      </h3>
                    </div>
                  </div>

                  {/* Frase de benefício */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {p.beneficio}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="px-7 sm:px-9 pb-7 sm:pb-9 pt-4 border-t border-slate-100 flex items-center">
                  <div className="inline-flex items-center gap-2 bg-solar-400 group-hover:bg-solar-500 text-midnight-950 font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all group-hover:scale-[1.02]">
                    <span>{p.textoBotao}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
