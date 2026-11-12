import { Check, RotateCcw, Trash2, X } from 'lucide-react'

export type DecisaoLimpeza = 'excluir' | 'manter'

interface AcoesLimpezaItemProps {
  /** Onde a foto aparece: aba "A Apagar" (só Manter) ou "Revisar" (Apagar + Manter) */
  contexto: 'excluir' | 'revisar'
  /** Decisão atual do dono sobre esta foto (ausente = sem decisão ainda) */
  decisao?: DecisaoLimpeza
  disabled?: boolean
  onDecidir: (decisao: DecisaoLimpeza) => void
}

/**
 * Botões de decisão por foto do modal "Limpeza Segura de Fotos Duplicadas".
 * Aba "Revisar": Apagar / Manter. Aba "A Apagar": Manter (tirar da exclusão).
 * Depois de decidida, a foto mostra um único botão com o estado e a reversão.
 * Botões grandes (h-10) para uso confortável no celular.
 */
export default function AcoesLimpezaItem({
  contexto,
  decisao,
  disabled,
  onDecidir,
}: AcoesLimpezaItemProps) {
  if (decisao) {
    const eParaApagar = decisao === 'excluir'
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDecidir(decisao)}
        className={`shrink-0 h-10 px-3 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${
          eParaApagar
            ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
            : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
        }`}
        title={
          eParaApagar
            ? 'Foto marcada para APAGAR. Toque para desfazer esta decisão.'
            : 'Foto marcada para MANTER na biblioteca. Toque para desfazer esta decisão.'
        }
      >
        {eParaApagar ? <Trash2 className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
        <span>{eParaApagar ? 'Vai apagar' : 'Vai manter'}</span>
        <RotateCcw className="w-3 h-3 opacity-80" />
      </button>
    )
  }

  return (
    <div className="shrink-0 flex flex-col sm:flex-row gap-1.5">
      {contexto === 'revisar' && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => onDecidir('excluir')}
          className="h-10 px-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-[11px] font-bold inline-flex items-center justify-center gap-1.5 hover:bg-red-100 cursor-pointer disabled:opacity-60"
          title="Marcar esta foto para exclusão na próxima limpeza"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Apagar</span>
        </button>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDecidir('manter')}
        className="h-10 px-3 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 text-[11px] font-bold inline-flex items-center justify-center gap-1.5 hover:bg-emerald-100 cursor-pointer disabled:opacity-60"
        title={
          contexto === 'excluir'
            ? 'Manter esta foto na biblioteca (tirar da exclusão)'
            : 'Manter esta foto na biblioteca'
        }
      >
        <X className="w-3.5 h-3.5" />
        <span>Manter</span>
      </button>
    </div>
  )
}
