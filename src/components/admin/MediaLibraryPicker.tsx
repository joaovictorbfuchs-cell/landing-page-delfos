import { useState } from 'react'
import { Search, Check, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { MediaRecord, CaseRecord } from '@/types/content'
import { getMediaFileUrl } from '@/services/content'
import { normalizeString } from './mediaMatchUtils'

interface MediaLibraryPickerProps {
  mediaList: MediaRecord[]
  casesList: CaseRecord[]
  /** Cliente (ou nome do case) já digitado no formulário, usado para pré-filtrar a grade */
  contextTerm?: string
  onSelect: (media: MediaRecord) => void
  onClose: () => void
}

/**
 * Grade de fotos da biblioteca para escolher a capa de um case.
 * Pré-filtra pelo cliente/nome do case quando já informado (o mesmo casamento
 * por nome de arquivo usado no upload em lote) e mantém busca manual.
 */
export default function MediaLibraryPicker({
  mediaList,
  casesList,
  contextTerm,
  onSelect,
  onClose,
}: MediaLibraryPickerProps) {
  const [busca, setBusca] = useState('')

  const termoContexto = (contextTerm || '').trim()
  const normContexto = normalizeString(termoContexto)

  // Termo de casamento derivado do contexto: cliente do case, título, slug ou local.
  // Encontra cases que casam com o texto digitado e usa seus identificadores.
  const termosCaso = new Set<string>()
  if (normContexto.length >= 3) {
    termosCaso.add(normContexto)
    for (const c of casesList) {
      const alvos = [c.cliente, c.titulo, c.slug, c.local]
      if (
        alvos.some((a) => {
          const na = normalizeString(a || '')
          return na.length >= 3 && (normContexto.includes(na) || na.includes(normContexto))
        })
      ) {
        if (c.cliente && normalizeString(c.cliente).length >= 3) {
          termosCaso.add(normalizeString(c.cliente))
        }
      }
    }
  }

  const filtradas = mediaList.filter((m) => {
    if (termosCaso.size > 0) {
      const alvosArquivo = [m.arquivo, m.titulo, m.destino_sugerido, m.descricao]
      const casaContexto = alvosArquivo.some((a) => {
        const na = normalizeString(a || '')
        return na && Array.from(termosCaso).some((t) => na.includes(t))
      })
      if (!casaContexto) return false
    }
    if (!busca.trim()) return true
    const term = busca.toLowerCase()
    return (
      m.titulo.toLowerCase().includes(term) ||
      (m.arquivo || '').toLowerCase().includes(term) ||
      (m.destino_sugerido || '').toLowerCase().includes(term) ||
      (m.descricao || '').toLowerCase().includes(term)
    )
  })

  const temFiltroContexto = termosCaso.size > 0

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[92vh] sm:h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-fade-in-up">
        {/* Header fixo */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-solar-600 block">
              Biblioteca de Mídia
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 truncate">
              Escolher Foto do Case
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Busca */}
        <div className="px-5 py-3 border-b border-slate-100 shrink-0 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar foto na biblioteca..."
              className="pl-9 h-10 rounded-xl bg-frost border-slate-200 text-xs sm:text-sm"
            />
          </div>
          {temFiltroContexto && (
            <p className="text-[11px] text-solar-700 font-semibold">
              Mostrando fotos relacionadas a &ldquo;{termoContexto}&rdquo;
            </p>
          )}
        </div>

        {/* Grade rolável */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtradas.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
              <ImageIcon className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Nenhuma foto encontrada</p>
              <p className="text-xs max-w-sm">
                {temFiltroContexto
                  ? 'Nenhuma foto da biblioteca casa com este cliente. Limite o filtro subindo a foto antes pela Biblioteca de Mídia ou envie o arquivo direto no campo de upload.'
                  : 'Nenhuma foto corresponde à busca.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtradas.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-solar-400 hover:shadow-md transition-all text-left focus:outline-none focus:ring-2 focus:ring-solar-400 bg-slate-900 aspect-video"
                >
                  <img
                    src={getMediaFileUrl(item, 'leve')}
                    alt={item.titulo}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute inset-x-0 bottom-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent text-[10px] font-bold text-white truncate">
                    {item.titulo}
                  </span>
                  <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 items-center justify-center hidden group-hover:flex">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé fixo */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 truncate">
            {filtradas.length} {filtradas.length === 1 ? 'foto disponível' : 'fotos disponíveis'}
            {temFiltroContexto ? ' (filtro por cliente ativo)' : ''}
          </span>
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs shrink-0">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
