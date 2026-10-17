import { Car, Zap, Building, Sliders, ShieldCheck, ArrowRight, Gauge } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SecaoCarregadoresProps {
  onSolicitarVistoria: () => void
}

export default function SecaoCarregadores({ onSolicitarVistoria }: SecaoCarregadoresProps) {
  return (
    <section
      id="secao-carregadores"
      className="py-24 bg-[#0A0D14] text-white relative overflow-hidden border-t border-white/10"
    >
      {/* Glow styling */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-solar-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Top Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5" />
            Solução 04 • Eletromobilidade & Infraestrutura
          </span>
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">
            Gestão Inteligente de Carga
          </span>
        </div>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Recarga Veicular Inteligente:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-solar-300">
                infraestrutura pronta sem sobrecarregar seu prédio.
              </span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
              O maior obstáculo em condomínios e empresas é o transformador saturado e a briga por
              rateio de conta. A Delfos implementa gestão de carga inteligente (DLM: mede o consumo
              por vaga e rateia individualmente) e faturamento direto por app.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col lg:items-end gap-3">
            <Button
              onClick={onSolicitarVistoria}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-7 py-6 text-base rounded-xl shadow-lg shadow-solar-500/20 flex items-center gap-2"
            >
              <span>Solicitar vistoria técnica</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <a
              href="/solucoes/carregadores"
              className="text-xs font-bold text-solar-400 hover:text-solar-300 flex items-center gap-1.5 transition-colors"
            >
              <span>
                Acessar página completa de Carregadores Veiculares com Gestão de Carga Inteligente
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Core Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-indigo-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gestão de Carga Inteligente</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              O sistema monitora o consumo geral do prédio em tempo real e modula a potência enviada
              aos veículos para nunca desarmar o disjuntor geral nem exigir troca de transformador.
            </p>
            <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-900/60">
              Economiza centenas de milhares em obras civis
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-indigo-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-4">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Medição Individual & Rateio</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Cada morador ou condutor autentica a recarga por cartão RFID ou aplicativo no celular.
              A energia consumida vai direto para a fatura individual da unidade — zero atrito no
              condomínio.
            </p>
            <div className="text-[11px] font-mono text-sky-300 bg-sky-950/40 p-2.5 rounded-lg border border-sky-900/60">
              Transparência total para síndicos e administradoras
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-indigo-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-solar-400/20 text-solar-300 flex items-center justify-center mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Frotas e Eletropostos</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Estações semirrápidas AC (7 a 22 kW) e ultrarrápidas DC (30 a 120 kW) com integração
              direta à usina solar fotovoltaica para recarregar sua frota com custo próximo de zero.
            </p>
            <div className="text-[11px] font-mono text-solar-300 bg-solar-950/40 p-2.5 rounded-lg border border-solar-900/60">
              Projetos corporativos e comerciais no Sul
            </div>
          </div>
        </div>

        {/* Case / Spec highlight */}
        <div className="rounded-3xl border-2 border-dashed border-indigo-500/30 bg-indigo-950/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 mb-1">
                Foto real / Estudo técnico — aguardando
              </span>
              <h4 className="text-sm font-bold text-white">
                Instalação de Wallboxes e Barramento Blindado em Garagem
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Infraestrutura com eletrocalhas metálicas, proteção antichamas e cabeamento conforme
                NBR 17019.
              </p>
            </div>
          </div>

          <Button
            onClick={onSolicitarVistoria}
            variant="outline"
            className="border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500 hover:text-midnight-950 text-indigo-200 text-xs font-bold"
          >
            Agendar Vistoria do Condomínio
          </Button>
        </div>
      </div>
    </section>
  )
}
