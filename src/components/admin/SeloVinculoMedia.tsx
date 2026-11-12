import { Link2 } from 'lucide-react'
import type { CaseRecord, MediaRecord } from '@/types/content'
import { statusVinculoMedia } from './mediaMatchUtils'

interface SeloVinculoMediaProps {
  media: MediaRecord
  casesList: CaseRecord[]
  /** Ação executada ao clicar: abre o editor do projeto vinculado na aba Projetos */
  onAbrirProjeto?: (caseId: string) => void
  /** Classes extras de posicionamento (ex.: canto da imagem no card) */
  className?: string
}

const ESTILOS: Record<string, string> = {
  publicado: 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200',
  rascunho: 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300/80',
  'sem-vinculo': 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200',
}

const PONTO: Record<string, string> = {
  publicado: 'bg-emerald-600',
  rascunho: 'bg-slate-500',
  'sem-vinculo': 'bg-amber-500',
}

const ROTULO: Record<string, string> = {
  publicado: 'Publicado',
  rascunho: 'Rascunho',
  'sem-vinculo': 'Sem vínculo',
}

/**
 * Selo de status do vínculo foto↔projeto na Biblioteca de Mídia.
 * Verde (Publicado) / cinza (Rascunho) / âmbar (Sem vínculo). Quando a foto
 * está vinculada, o clique abre o editor do projeto na aba Projetos.
 * Sem vínculo o selo fica desabilitado (apenas informativo).
 */
export default function SeloVinculoMedia({
  media,
  casesList,
  onAbrirProjeto,
  className = '',
}: SeloVinculoMediaProps) {
  const status = statusVinculoMedia(media, casesList)
  const vinculada = status !== 'sem-vinculo'
  const clicavel = vinculada && Boolean(onAbrirProjeto)

  const conteudo = (
    <>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PONTO[status]}`} />
      <span className="max-w-[7.5rem] truncate">{ROTULO[status]}</span>
      {clicavel && <Link2 className="w-3 h-3 shrink-0 opacity-60" />}
    </>
  )

  if (!clicavel) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap cursor-default ${ESTILOS[status]} ${className}`}
        title={
          vinculada
            ? 'Foto vinculada a um projeto (entre no editor para detalhes)'
            : 'Sem projeto vinculado'
        }
      >
        {conteudo}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onAbrirProjeto?.(media.case_id as string)}
      title="Abrir editor do projeto vinculado"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap cursor-pointer transition-colors ${ESTILOS[status]} ${className}`}
    >
      {conteudo}
    </button>
  )
}
