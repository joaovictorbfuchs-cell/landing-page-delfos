import { useState, useMemo } from 'react'
import {
  Sun,
  Zap,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Calculator,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeroProps {
  onSolicitarAvaliacao: (context?: {
    origem?: string
    valorConta?: number
    concessionaria?: string
  }) => void
}

const CONCESSIONARIAS_RS = [
  { id: 'rge', nome: 'RGE (CPFL Energia)', tarifaMediaKwh: 0.96 },
  { id: 'ceee', nome: 'CEEE Equatorial', tarifaMediaKwh: 0.94 },
  {
    id: 'cooperativas',
    nome: 'Cooperativas Regionais (Creral, Ceriluz, etc.)',
    tarifaMediaKwh: 0.89,
  },
  { id: 'outra', nome: 'Outra concessionária / RS', tarifaMediaKwh: 0.93 },
]

export default function Hero({ onSolicitarAvaliacao }: HeroProps) {
  const [concessionariaId, setConcessionariaId] = useState('rge')
  const [valorContaInput, setValorContaInput] = useState('650')

  // Parse numeric bill
  const valorConta = useMemo(() => {
    const clean = valorContaInput.replace(/[^\d.,]/g, '').replace(',', '.')
    const parsed = parseFloat(clean)
    return isNaN(parsed) || parsed <= 0 ? 0 : parsed
  }, [valorContaInput])

  // Simple client-side simulation (tarifa típica RS, ~90-95% redução menos custo de disponibilidade/taxa mínima)
  const estimativa = useMemo(() => {
    if (valorConta <= 0) return null
    const conc = CONCESSIONARIAS_RS.find((c) => c.id === concessionariaId) || CONCESSIONARIAS_RS[0]
    // Consumo aprox em kWh
    const consumoKwh = Math.round(valorConta / conc.tarifaMediaKwh)
    // Custo de disponibilidade mínimo residual (ex: trifásico ~R$ 60-80 ou bifásico ~R$ 50)
    const taxaResidual = Math.min(65, valorConta * 0.1)
    const economiaMensal = Math.max(0, Math.round(valorConta - taxaResidual))
    const economiaAnual = Math.round(economiaMensal * 12)
    const economia25Anos = Math.round(economiaAnual * 25)
    // Potência do sistema recomendada estimada (RS: irradiância média ~4.2 kWh/m²/dia, PR ~75%)
    const potenciaEstimadaKwp = (consumoKwh / (4.2 * 30 * 0.78)).toFixed(1)

    return {
      consumoKwh,
      economiaMensal,
      economiaAnual,
      economia25Anos,
      potenciaEstimadaKwp,
      taxaResidual: Math.round(taxaResidual),
    }
  }, [valorConta, concessionariaId])

  const handleSimularSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const conc = CONCESSIONARIAS_RS.find((c) => c.id === concessionariaId)?.nome || 'RGE'
    onSolicitarAvaliacao({
      origem: 'calculadora-hero',
      valorConta: valorConta || undefined,
      concessionaria: conc,
    })
  }

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-[#081B30] via-[#0B2C4F] to-[#0A223E] text-white"
    >
      {/* Subtle engineering grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F5A623 1px, transparent 1px),
            linear-gradient(to bottom, #F5A623 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient glows */}
      <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-solar-400/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[420px] h-[420px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        {/* Top Badges: Pilares */}
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solar-400/15 border border-solar-400/30 text-solar-300 text-xs font-semibold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-solar-400" />
            Ecossistema Completo de Energia
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-300 hidden sm:inline-block">
            Solar Fotovoltaico • BESS • O&M • Eletromobilidade
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Novo Posicionamento */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Da geração à operação{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-300 via-solar-400 to-amber-200">
                  da sua energia.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl">
                A <strong>Delfos Engenharia</strong> projeta, constrói e opera sistemas solares de
                alta performance, armazenamento inteligente em baterias (BESS), planos com SLA de
                monitoramento contínuo e infraestrutura de recarga veicular no Sul do Brasil.
              </p>
            </div>

            {/* Sub-pilares visuais em badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-[11px] font-bold text-solar-300 uppercase tracking-wider">
                  01. Solar
                </span>
                <span className="text-xs text-slate-200 font-medium">EPC Geração Própria</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  02. BESS
                </span>
                <span className="text-xs text-slate-200 font-medium">Baterias & Backup</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                  03. O&M
                </span>
                <span className="text-xs text-slate-200 font-medium">Gestão com SLA</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  04. Recarga
                </span>
                <span className="text-xs text-slate-200 font-medium">Mobilidade & DLM</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                onClick={() => onSolicitarAvaliacao({ origem: 'home-hero' })}
                size="lg"
                className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-7 py-6 text-base rounded-xl shadow-lg shadow-solar-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Solicitar avaliação
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <a
                href="#solucoes"
                className="inline-flex items-center justify-center px-6 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold backdrop-blur-sm transition-colors text-center"
              >
                Conhecer os 4 Pilares
              </a>
            </div>

            {/* Micro trust row */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Engenharia própria com ART / CREA-RS</span>
              </div>
              <span className="hidden sm:inline-block text-slate-600">•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-solar-400" />
                <span>Atendimento regional Erechim e todo Sul</span>
              </div>
            </div>
          </div>

          {/* Right Column: Calculadora de Economia + Espaço Foto Real */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Calculadora Card */}
            <div className="bg-gradient-to-br from-[#0F355E] to-[#0A223E] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-solar-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-solar-400/20 text-solar-300 flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      Simulador de Economia
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Cálculo instantâneo baseado em tarifas do RS
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Até -95%
                </span>
              </div>

              <form onSubmit={handleSimularSubmit} className="space-y-4">
                {/* Concessionária */}
                <div>
                  <label
                    htmlFor="sim-conc"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Concessionária de Energia
                  </label>
                  <select
                    id="sim-conc"
                    value={concessionariaId}
                    onChange={(e) => setConcessionariaId(e.target.value)}
                    className="w-full bg-[#081B30] text-white border border-white/20 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    {CONCESSIONARIAS_RS.map((c) => (
                      <option key={c.id} value={c.id} className="bg-midnight-950 text-white">
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Valor da conta */}
                <div>
                  <label
                    htmlFor="sim-valor"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Valor médio da sua conta de luz (R$/mês)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-semibold">
                      R$
                    </span>
                    <Input
                      id="sim-valor"
                      value={valorContaInput}
                      onChange={(e) => setValorContaInput(e.target.value)}
                      placeholder="Ex: 650"
                      className="pl-11 bg-[#081B30] border-white/20 text-white font-bold text-base h-11 rounded-xl focus-visible:ring-solar-400"
                    />
                  </div>
                </div>

                {/* Resultado Dinâmico */}
                {estimativa && (
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase font-medium block">
                          Economia Estimada
                        </span>
                        <div className="text-2xl font-black text-emerald-400">
                          R$ {estimativa.economiaMensal.toLocaleString('pt-BR')}
                          <span className="text-xs font-normal text-slate-300"> / mês</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 uppercase font-medium block">
                          Em 25 anos
                        </span>
                        <div className="text-sm font-bold text-solar-300">
                          R$ {estimativa.economia25Anos.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="bg-[#081B30]/60 p-2 rounded-lg">
                        <span className="text-slate-400 block">Potência sugerida:</span>
                        <strong className="text-white text-xs">
                          ~{estimativa.potenciaEstimadaKwp} kWp
                        </strong>
                      </div>
                      <div className="bg-[#081B30]/60 p-2 rounded-lg">
                        <span className="text-slate-400 block">Taxa residual est.:</span>
                        <strong className="text-white text-xs">
                          R$ {estimativa.taxaResidual}/mês
                        </strong>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 italic leading-snug">
                      * Estimativa paramétrica orientativa para o RS, sujeita a projeto detalhado,
                      sombreamento e tipo de ligação.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold h-12 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Solicitar proposta com este cálculo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Espaço Marcado para Imagem Real de Destaque */}
            <div className="relative rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-4 flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-xl bg-midnight-900 border border-white/10 flex flex-col items-center justify-center shrink-0 text-solar-300">
                <Sun className="w-6 h-6 mb-1 text-solar-400" />
                <span className="text-[9px] font-bold uppercase">Sul/RS</span>
              </div>
              <div className="flex-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-solar-400/20 text-solar-300 mb-1">
                  Foto real — aguardando
                </span>
                <p className="text-xs font-semibold text-white leading-tight">
                  Usinas de solo, telhados industriais e comerciais em Erechim/RS
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Proibido banco de imagens genérico — documentação fotográfica com drone em
                  homologação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow anchor */}
      <a
        href="#metricas"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity text-slate-400 text-xs"
        aria-label="Ir para métricas"
      >
        <span className="text-[10px] tracking-widest uppercase">Métricas</span>
        <ChevronDown className="w-4 h-4 text-solar-400 animate-bounce" />
      </a>
    </section>
  )
}
