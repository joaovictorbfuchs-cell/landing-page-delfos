import { Link } from 'react-router-dom'
import { Sun, BatteryCharging, Wrench, Car, ArrowRight } from 'lucide-react'

interface NavegacaoSolucoesProps {
  solucaoAtual: 'solar' | 'bess' | 'om' | 'carregadores'
  dark?: boolean
}

export default function NavegacaoSolucoes({ solucaoAtual, dark = false }: NavegacaoSolucoesProps) {
  const solucoes = [
    {
      id: 'solar',
      titulo: 'Energia Solar Fotovoltaica (EPC)',
      descricao: 'On-grid e híbrido, telhado e solo, redução de até 95% na conta de luz.',
      href: '/solucoes/energia-solar',
      icone: Sun,
      corBadge: 'bg-solar-500/15 text-solar-400 border-solar-500/30',
      badgeDark: 'bg-solar-500/20 text-solar-300',
    },
    {
      id: 'bess',
      titulo: 'Sistemas de Armazenamento BESS',
      descricao: 'Peak shaving, arbitragem tarifária e backup ininterrupto C&I e rural.',
      href: '/solucoes/bess',
      icone: BatteryCharging,
      corBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      badgeDark: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'om',
      titulo: 'Manutenção O&M e Monitoramento',
      descricao: 'Termografia por drone, limpeza técnica, planos com SLA e telemetria.',
      href: '/solucoes/om',
      icone: Wrench,
      corBadge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      badgeDark: 'bg-blue-500/20 text-blue-300',
    },
    {
      id: 'carregadores',
      titulo: 'Carregadores Veiculares & DLM',
      descricao: 'Wallbox inteligente, medição individual e recarga sem trocar transformador.',
      href: '/solucoes/carregadores',
      icone: Car,
      corBadge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      badgeDark: 'bg-indigo-500/20 text-indigo-300',
    },
  ]

  const outrasSolucoes = solucoes.filter((s) => s.id !== solucaoAtual)

  return (
    <section
      className={`py-16 ${
        dark
          ? 'bg-[#060B12] text-white border-t border-white/10'
          : 'bg-slate-50 text-slate-800 border-t border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                dark ? 'text-solar-400' : 'text-solar-600'
              }`}
            >
              Ecossistema Integrado Delfos
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold ${dark ? 'text-white' : 'text-slate-900'}`}
            >
              Conheça as outras soluções do ciclo energético
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/projetos"
              className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                dark ? 'text-solar-300 hover:text-solar-200' : 'text-solar-700 hover:text-solar-900'
              }`}
            >
              <span>Ver cases reais de resultados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/#solucoes"
              className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                dark ? 'text-slate-300 hover:text-solar-400' : 'text-slate-600 hover:text-solar-600'
              }`}
            >
              <span>Ver os 4 pilares</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {outrasSolucoes.map((s) => {
            const Icone = s.icone
            return (
              <Link
                key={s.id}
                to={s.href}
                className={`group rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                  dark
                    ? 'bg-white/5 border-white/10 hover:border-solar-400/50 hover:bg-white/[0.08]'
                    : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-solar-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                        dark
                          ? 'bg-white/10 text-solar-400 border-white/15'
                          : 'bg-slate-100 text-midnight-950 border-slate-200'
                      }`}
                    >
                      <Icone className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                        dark ? s.corBadge : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Solução Delfos
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold mb-2 group-hover:text-solar-400 transition-colors ${
                      dark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {s.titulo}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                      dark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {s.descricao}
                  </p>
                </div>

                <div
                  className={`pt-3 border-t text-xs font-bold flex items-center justify-between ${
                    dark ? 'border-white/10 text-solar-400' : 'border-slate-100 text-solar-600'
                  }`}
                >
                  <span>Explorar solução</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
