import { LayoutGrid, Link2Off, PencilLine, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StatusVinculoMedia } from './mediaMatchUtils'

export type FiltroVinculo = 'todas' | StatusVinculoMedia

const FILTROS: Array<{
  valor: FiltroVinculo
  rotulo: string
  icone: typeof LayoutGrid
  ativo: string
  inativo: string
}> = [
  {
    valor: 'todas',
    rotulo: 'Todas',
    icone: LayoutGrid,
    ativo: 'bg-midnight-800 text-white border-midnight-800',
    inativo: 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
  },
  {
    valor: 'sem-vinculo',
    rotulo: 'Sem vínculo',
    icone: Link2Off,
    ativo: 'bg-amber-500 text-white border-amber-500',
    inativo: 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50',
  },
  {
    valor: 'rascunho',
    rotulo: 'Rascunho',
    icone: PencilLine,
    ativo: 'bg-slate-600 text-white border-slate-600',
    inativo: 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
  },
  {
    valor: 'publicado',
    rotulo: 'Publicadas',
    icone: CircleCheck,
    ativo: 'bg-emerald-600 text-white border-emerald-600',
    inativo: 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50',
  },
]

interface AdminMediaFiltroVinculoProps {
  filtro: FiltroVinculo
  onFiltroChange: (f: FiltroVinculo) => void
  /** Contagem por filtro, para mostrar junto ao rótulo (opcional) */
  contagem?: Partial<Record<FiltroVinculo, number>>
}

/**
 * Chips de filtro rápido por status de vínculo no topo da Biblioteca de Mídia.
 * Rolagem horizontal em telas pequenas — nenhum chip é cortado.
 */
export default function AdminMediaFiltroVinculo({
  filtro,
  onFiltroChange,
  contagem,
}: AdminMediaFiltroVinculoProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -my-0.5">
      {FILTROS.map((f) => {
        const Icone = f.icone
        const ativo = filtro === f.valor
        const n = contagem?.[f.valor]
        return (
          <button
            key={f.valor}
            type="button"
            onClick={() => onFiltroChange(f.valor)}
            aria-pressed={ativo}
            title={
              f.valor === 'todas'
                ? 'Mostrar todas as fotos'
                : f.valor === 'sem-vinculo'
                  ? 'Somente fotos sem projeto vinculado'
                  : f.valor === 'rascunho'
                    ? 'Somente fotos vinculadas a projeto em rascunho'
                    : 'Somente fotos vinculadas a projeto publicado'
            }
            className={cn(
              'inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer',
              ativo ? f.ativo : f.inativo,
            )}
          >
            <Icone className="w-3.5 h-3.5 shrink-0" />
            <span>{f.rotulo}</span>
            {typeof n === 'number' && (
              <span
                className={cn(
                  'inline-flex items-center justify-center min-w-[1.1rem] px-1 py-px rounded-full text-[9px] font-mono leading-none',
                  ativo ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600',
                )}
              >
                {n}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
