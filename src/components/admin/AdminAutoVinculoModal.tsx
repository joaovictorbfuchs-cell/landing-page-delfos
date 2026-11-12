import { useState } from 'react'
import { Link2, Check, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { CaseRecord } from '@/types/content'
import { attachMediaToCase, getMediaFileUrl } from '@/services/content'
import type { ItemVinculacaoPendente } from './mediaMatchUtils'

interface AdminAutoVinculoModalProps {
  isOpen: boolean
  onClose: () => void
  itens: ItemVinculacaoPendente[]
  casesList: CaseRecord[]
  onRefresh: () => void
}

/**
 * Modal de revisão da vinculação automática: lista as fotos que não puderam ser
 * vinculadas automaticamente (duvidosas) e permite decidir manualmente.
 * Regra: NUNCA descarta mídia — o que não vincular fica para decisão humana.
 * Mobile-first: max-h 92vh, cabeçalho fixo, rolagem interna, rodapé sempre visível.
 */
export default function AdminAutoVinculoModal({
  isOpen,
  onClose,
  itens,
  casesList,
  onRefresh,
}: AdminAutoVinculoModalProps) {
  const { toast } = useToast()
  const [salvandoId, setSalvandoId] = useState<string | null>(null)
  const [ignoradas, setIgnoradas] = useState<Set<string>>(new Set())
  const [escolhas, setEscolhas] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const pendentes = itens.filter((it) => !ignoradas.has(it.media.id))

  const handleVincular = async (mediaId: string, caseId: string) => {
    setSalvandoId(mediaId)
    try {
      await attachMediaToCase(mediaId, caseId)
      toast({
        title: 'Foto vinculada!',
        description: 'O vínculo projeto↔foto foi criado e a foto já está pronta para a galeria.',
      })
      setIgnoradas((prev) => new Set(prev).add(mediaId))
      onRefresh()
    } catch (err) {
      console.error('Erro ao vincular mídia:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao vincular',
        description: (err as Error)?.message || 'Não foi possível criar o vínculo.',
      })
    } finally {
      setSalvandoId(null)
    }
  }

  const handleIgnorar = (mediaId: string) => {
    setIgnoradas((prev) => new Set(prev).add(mediaId))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Cabeçalho fixo */}
        <div className="shrink-0 px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-solar-600" />
              Revisão da vinculação automática
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {pendentes.length === 0
                ? 'Tudo revisado! Nenhuma foto pendente.'
                : `${pendentes.length} ${pendentes.length === 1 ? 'foto pendente' : 'fotos pendentes'} de revisão — nada foi descartado.`}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 rounded-xl h-8 w-8"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Conteúdo com rolagem interna */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-3">
          {pendentes.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              <Check className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              Nenhuma foto pendente de revisão. Você pode fechar este modal.
            </div>
          ) : (
            pendentes.map((it) => {
              const caseSel =
                escolhas[it.media.id] || (it.candidatos.length === 1 ? it.candidatos[0].id : '')
              const url = getMediaFileUrl(it.media)
              return (
                <div
                  key={it.media.id}
                  className="border border-slate-200 rounded-xl p-3 flex gap-3 bg-slate-50/60"
                >
                  {url && (
                    <img
                      src={url}
                      alt={it.media.titulo}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{it.media.titulo}</p>
                    <p className="text-xs text-slate-500 truncate mb-1.5">
                      {it.media.arquivo || 'sem nome de arquivo'}
                    </p>
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {it.motivo}
                    </p>
                    <select
                      value={caseSel}
                      onChange={(e) =>
                        setEscolhas((prev) => ({ ...prev, [it.media.id]: e.target.value }))
                      }
                      className="w-full h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                    >
                      <option value="">— Escolha o projeto —</option>
                      {casesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cliente || c.titulo}
                          {c.potencia_capacidade ? ` (${c.potencia_capacidade})` : ''}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={!caseSel || salvandoId === it.media.id}
                        onClick={() => handleVincular(it.media.id, caseSel)}
                        className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-lg text-xs h-8 px-3"
                      >
                        {salvandoId === it.media.id ? 'Vinculando...' : 'Vincular'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleIgnorar(it.media.id)}
                        className="border-slate-300 text-slate-600 rounded-lg text-xs h-8 px-3"
                      >
                        Ignorar (manter sem vínculo)
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Rodapé de ações sempre visível */}
        <div className="shrink-0 px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-2 bg-slate-50">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Nenhuma foto é descartada — ignorar apenas mantém a foto solta na biblioteca.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs h-9 px-4"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
