import { BatteryCharging, Zap, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SecaoBessProps {
  onSolicitarViabilidade: () => void
}

export default function SecaoBess({ onSolicitarViabilidade }: SecaoBessProps) {
  return (
    <section
      id="secao-bess"
      className="py-24 bg-[#080E18] text-white relative overflow-hidden border-t border-white/10"
    >
      {/* Background glow and engineering pattern */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Top Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <BatteryCharging className="w-3.5 h-3.5" />
            Pilar 02 • Armazenamento em Baterias (BESS)
          </span>
          <span className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">
            Tesla-Grade Engineering
          </span>
        </div>

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-14">
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Sistema de armazenamento de energia (BESS):{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                economia no horário de ponta, backup e proteção.
              </span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
              Sistema de armazenamento de energia em baterias (BESS) não é um acessório de painel: é
              uma oferta estratégica própria. Proteja sua operação contra quedas de energia na rede
              gaúcha e economize no horário de ponta com bloqueio programado.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col lg:items-end gap-3">
            <Button
              onClick={onSolicitarViabilidade}
              className="bg-emerald-500 hover:bg-emerald-400 text-midnight-950 font-bold px-7 py-6 text-base rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <span>Pedir estudo de viabilidade de baterias (BESS)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <a
              href="/solucoes/bess"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Acessar página completa da Solução de Armazenamento (BESS)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Pillars of BESS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: 1º Economia no horário de ponta / Bloqueio do horário de ponta */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Economia e Bloqueio do Horário de Ponta
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Carrega de madrugada, quando a energia é barata, e usa de noite, quando fica caro
              (onde o kWh custa até 4x a 5x mais). E se a empresa já tem energia solar, carrega as
              baterias de graça durante o dia.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-900/60">
              Despacho inteligente no horário mais caro
            </div>
          </div>

          {/* Card 2: 2º Backup e energia de reserva */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Backup e Energia de Reserva</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Comutação em milissegundos sem queda de servidores, compressores, câmaras frias
              industriais ou equipamentos essenciais durante blecautes e oscilações da rede.
            </p>
            <div className="text-[11px] font-mono text-amber-400 bg-amber-950/40 p-2.5 rounded-lg border border-amber-900/60">
              Zero tempo de parada e sem ruído de gerador fóssil
            </div>
          </div>

          {/* Card 3: 3º Pico de demanda (redução da cobrança de demanda na fatura / peak shaving) */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Redução da Cobrança de Demanda na Fatura
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              Injeta energia instantaneamente nas partidas pesadas para aplainar picos e eliminar
              multas por ultrapassagem contratual (peak shaving).
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/60">
              Economia direta em demanda contratada (kW)
            </div>
          </div>
        </div>

        {/* Real photo / Diagram placeholder */}
        <div className="rounded-3xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <BatteryCharging className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 mb-1">
                Foto real / Estudo técnico — aguardando
              </span>
              <h4 className="text-sm font-bold text-white">
                Gabinete de Baterias (BESS) e Módulos de Lítio (LiFePO4)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Dimensionamentos modulares de 30 kWh até 1+ MWh sob projeto de engenharia de campo
                no RS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block">Atendimento por Engenheiro</span>
              <span className="text-xs font-bold text-emerald-400">ART / CREA-RS</span>
            </div>
            <Button
              onClick={onSolicitarViabilidade}
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500 hover:text-midnight-950 text-emerald-300 text-xs font-bold"
            >
              Pedir Dimensionamento de Baterias (BESS)
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
