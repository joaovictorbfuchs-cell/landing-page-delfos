import {
  MapPin,
  Calendar,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CaseStudy } from '@/data/cases'

interface CaseCardProps {
  caseStudy: CaseStudy
  onVerDetalhes: (caseStudy: CaseStudy) => void
  onSolicitarEstudo: (caseStudy: CaseStudy) => void
}

export default function CaseCard({ caseStudy, onVerDetalhes, onSolicitarEstudo }: CaseCardProps) {
  const { resultadoMedido } = caseStudy

  const getSolucaoBadge = (solucao: string) => {
    switch (solucao) {
      case 'Energia Solar (EPC)':
        return 'bg-solar-500 text-midnight-950'
      case 'BESS (Armazenamento)':
        return 'bg-emerald-500 text-midnight-950'
      case 'O&M e Monitoramento':
        return 'bg-blue-600 text-white'
      case 'Carregadores Veiculares':
        return 'bg-indigo-600 text-white'
      default:
        return 'bg-solar-400 text-midnight-950'
    }
  }

  return (
    <article
      onClick={() => onVerDetalhes(caseStudy)}
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-solar-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Top Visual Area (Dark Tesla/Industrial feel) */}
        <div className="relative bg-gradient-to-br from-[#081829] via-[#0B2540] to-[#0A1E33] p-6 text-white overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-solar-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Badges line: Segmento & Solução */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getSolucaoBadge(
                caseStudy.solucao,
              )}`}
            >
              {caseStudy.solucao}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15">
              {caseStudy.segmento}
            </span>
            {caseStudy.destaque && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ★ Destaque
              </span>
            )}
          </div>

          {/* Title and Short Capacity */}
          <h3 className="text-xl font-black tracking-tight text-white mb-2 leading-snug group-hover:text-solar-300 transition-colors">
            {caseStudy.titulo}
          </h3>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-solar-400 shrink-0" />
              <span className="truncate">{caseStudy.local.split('(')[0].trim()}</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-solar-300 text-xs shrink-0">
              <Zap className="w-3.5 h-3.5 text-solar-400" />
              <span>{caseStudy.potenciaOuCapacidadeCurta}</span>
            </div>
          </div>

          {/* Photo Placeholder Card */}
          <div className="mt-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-3 text-center">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="px-1.5 py-0.5 rounded bg-solar-400/20 text-solar-300 font-bold uppercase">
                {caseStudy.fotoPlaceholderNota}
              </span>
              <span className="text-slate-400">{caseStudy.dataEntrega.split('(')[0].trim()}</span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1 leading-tight text-left">
              {caseStudy.fotoDescricao}
            </p>
          </div>
        </div>

        {/* Card Body: Key Results in Big Numbers (Tesla style) */}
        <div className="p-6 space-y-4">
          {/* Big number callout */}
          <div className="p-4 rounded-2xl bg-frost border border-slate-200/80">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
              {resultadoMedido.destaqueLabel}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {resultadoMedido.destaqueValor}
              </span>
              {resultadoMedido.dadoPendente && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  a confirmar
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
              {resultadoMedido.descricao}
            </p>
          </div>

          {/* Escopo resumido */}
          <div className="text-xs space-y-1 text-slate-600">
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-slate-800 shrink-0">Escopo:</span>
              <span className="text-slate-700 line-clamp-1">{caseStudy.escopo}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="font-bold text-slate-800 shrink-0">Desafio:</span>
              <span className="text-slate-500 line-clamp-2 leading-tight">
                {caseStudy.desafioInicial}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Action buttons */}
      <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onVerDetalhes(caseStudy)
          }}
          className="text-xs font-bold text-solar-700 hover:text-solar-800 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Ver case completo</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onSolicitarEstudo(caseStudy)
          }}
          className="bg-midnight-900 hover:bg-midnight-950 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer"
        >
          Solicitar similar
        </Button>
      </div>
    </article>
  )
}
