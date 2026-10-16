import { Filter, Layers, Check } from 'lucide-react'
import { SEGMENTOS_FILTRO, SOLUCOES_FILTRO } from '@/data/cases'

interface CaseFiltersProps {
  segmentoSelecionado: string
  onSelectSegmento: (segmento: string) => void
  solucaoSelecionada: string
  onSelectSolucao: (solucao: string) => void
  totalResultados: number
}

export default function CaseFilters({
  segmentoSelecionado,
  onSelectSegmento,
  solucaoSelecionada,
  onSelectSolucao,
  totalResultados,
}: CaseFiltersProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* 1. Filtro por Segmento (Obrigatório do Documento - 7 segmentos + Todos) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-solar-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Filtrar por Segmento (Porta de Entrada)
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {totalResultados} {totalResultados === 1 ? 'case exibido' : 'cases exibidos'}
          </span>
        </div>

        {/* Chips/Pills horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
          {SEGMENTOS_FILTRO.map((seg) => {
            const isSelected = segmentoSelecionado === seg.id
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => onSelectSegmento(seg.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-midnight-950 text-white shadow-md shadow-midnight-950/20 scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-solar-400" />}
                <span>{seg.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Filtro Secundário por Solução (Solar, BESS, O&M, Carregadores) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Filtrar por Solução Técnica (4 Pilares)
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-2 px-2">
          {SOLUCOES_FILTRO.map((sol) => {
            const isSelected = solucaoSelecionada === sol.id
            return (
              <button
                key={sol.id}
                type="button"
                onClick={() => onSelectSolucao(sol.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-solar-400 text-midnight-950 font-bold shadow-xs'
                    : 'bg-frost text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-midnight-950" />}
                <span>{sol.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
