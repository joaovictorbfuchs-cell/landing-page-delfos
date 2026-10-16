import { Link } from 'react-router-dom'
import { Calendar, MapPin, Zap, CheckCircle, TrendingDown, Award, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CaseDestaqueProps {
  onSolicitarProjeto: () => void
}

export default function CaseDestaque({ onSolicitarProjeto }: CaseDestaqueProps) {
  return (
    <section id="projetos-resultados" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-800 text-xs font-bold uppercase tracking-wider mb-3">
            Case em Destaque • Estrutura de Engenharia
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Projetos e Resultados Reais
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Metodologia transparente com dados auditáveis: cada case documenta o desafio inicial, o
            escopo técnico de engenharia e os resultados medidos pós-comissionamento.
          </p>
          <div className="mt-4">
            <Link
              to="/projetos"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-solar-700 hover:text-solar-900 underline"
            >
              <span>Explorar todos os cases no grid com filtro por segmento</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Featured Case Card with exact structure from specification */}
        <div className="bg-frost rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Column / Photo placeholder */}
            <div className="lg:col-span-5 relative bg-gradient-to-br from-midnight-950 via-midnight-900 to-[#0F355E] text-white p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-solar-400 text-midnight-950 text-xs font-bold uppercase">
                    Comercial & Industrial
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-slate-300 font-medium">
                    Homologado
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
                  Indra Sistemas e Engenharia
                </h3>
                <div className="flex items-center gap-2 text-slate-300 text-xs">
                  <MapPin className="w-4 h-4 text-solar-400" />
                  <span>Erechim / RS</span>
                </div>
              </div>

              {/* Photo placeholder marked */}
              <div className="my-8 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-6 text-center">
                <Zap className="w-10 h-10 text-solar-400 mx-auto mb-2 opacity-80" />
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-solar-400/20 text-solar-300 mb-1">
                  Foto real — aguardando
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  Registro aéreo da cobertura metálica e quadro de proteção CA/CC
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  9,75 kWp instalados com inversores de alta frequência
                </p>
              </div>

              {/* Mini Stat Summary */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-[10px] uppercase text-slate-400 block">Potência Pico</span>
                  <span className="text-lg font-black text-solar-300">9,75 kWp</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl">
                  <span className="text-[10px] uppercase text-slate-400 block">Economia Anual</span>
                  <span className="text-lg font-black text-emerald-400">~R$ 13.500</span>
                </div>
              </div>
            </div>

            {/* Structured Info Column (Segmento, Local, Desafio, Escopo, Solução, Resultado, Data) */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
              <div className="space-y-6">
                {/* Meta line */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-6 border-b border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Segmento
                    </span>
                    <strong className="text-slate-800">Comércio / Engenharia</strong>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Localização
                    </span>
                    <strong className="text-slate-800">Erechim/RS</strong>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Escopo
                    </span>
                    <strong className="text-slate-800">9,75 kWp Solar EPC</strong>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                      Data de Entrega
                    </span>
                    <strong className="text-slate-800">2023 (Operação ativa)</strong>
                  </div>
                </div>

                {/* Desafio Inicial */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Desafio Inicial
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    Alto consumo energético contínuo com computadores, estações de trabalho e
                    sistemas de climatização, associado ao risco de oscilações da rede e perda de
                    previsibilidade orçamentária para novos investimentos da empresa.
                  </p>
                </div>

                {/* Solução de Engenharia */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-solar-500" />
                    Solução Técnica Delfos
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    Estudo de viabilidade com modelagem 3D de sombreamento, dimensionamento em
                    estrutura metálica com fixadores certificados e homologação expressa junto à
                    concessionária RGE, sem parada da rotina de trabalho.
                  </p>
                </div>

                {/* Resultado Medido */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Resultado Medido & ROI
                  </h4>
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-emerald-950">
                        Redução média de 91% na fatura mensal de energia elétrica
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 w-fit">
                        Payback ~3,2 anos
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Método de medição: telemetria em tempo real com inversor conectado +
                      conferência auditada das faturas mensais emitidas pela concessionária local.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  to="/projetos"
                  className="text-xs font-bold text-solar-700 hover:text-solar-900 flex items-center gap-1"
                >
                  <span>Ver todos os cases com filtros por segmento</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Button
                  onClick={onSolicitarProjeto}
                  className="w-full sm:w-auto bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-2.5 rounded-xl shadow-md text-sm cursor-pointer"
                >
                  Solicitar estudo similar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
