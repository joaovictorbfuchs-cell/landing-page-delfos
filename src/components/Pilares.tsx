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
      corIcone: 'bg-solar-100 text-solar-700 border-solar-200',
      tagCor: 'bg-solar-50 text-solar-800 border-solar-200',
      paginaUrl: '/solucoes/energia-solar',
    },
    {
      id: 'bess',
      numero: '02',
      titulo: 'Baterias de energia',
      beneficio: 'Energia de reserva quando falta luz, e mais economia nas horas de consumo alto.',
      icone: BatteryCharging,
      corIcone: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      tagCor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      paginaUrl: '/solucoes/bess',
    },
    {
      id: 'oem',
      numero: '03',
      titulo: 'Manutenção e monitoramento',
      beneficio:
        'Vistorias periódicas e atendimento rápido quando algo sair do normal — sua usina sempre gerando no máximo.',
      icone: Wrench,
      corIcone: 'bg-blue-100 text-blue-800 border-blue-200',
      tagCor: 'bg-blue-50 text-blue-800 border-blue-200',
      paginaUrl: '/solucoes/om',
    },
    {
      id: 'carregadores',
      numero: '04',
      titulo: 'Recarga veicular',
      beneficio:
        'Carregue veículos sem estourar a rede elétrica do seu imóvel — para casas, condomínios e empresas.',
      icone: Car,
      corIcone: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      tagCor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      paginaUrl: '/solucoes/carregadores',
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
                    </div>
                  </div>

                  {/* Frase de benefício */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
                    {p.beneficio}
                  </p>
                </div>

                {/* Footer Action - Botão 'Ver como funciona' */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center">
                  <a
                    href={p.paginaUrl}
                    className="inline-flex items-center justify-center gap-2 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] group/btn"
                  >
                    <span>Ver como funciona</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
