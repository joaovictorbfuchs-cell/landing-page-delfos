import { useState } from 'react'
import {
  FolderOpen,
  UploadCloud,
  Trash2,
  Copy,
  ExternalLink,
  Tag,
  Search,
  Filter,
  Check,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import type { MediaRecord, CreateMediaPayload, MediaCategoria } from '@/types/content'
import { createMedia, deleteMedia, getMediaFileUrl } from '@/services/content'

const MEDIA_CATEGORIAS: MediaCategoria[] = [
  'Geral',
  'Solar EPC',
  'BESS Baterias',
  'O&M Manutenção',
  'Carregadores',
  'Segmentos',
  'Equipe e Empresa',
]

interface AdminMediaTabProps {
  mediaList: MediaRecord[]
  loading: boolean
  onRefresh: () => void
}

export default function AdminMediaTab({ mediaList, loading, onRefresh }: AdminMediaTabProps) {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string>('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Upload Form
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState<MediaCategoria>('Geral')
  const [descricao, setDescricao] = useState('')
  const [destinoSugerido, setDestinoSugerido] = useState('')
  const [arquivoFile, setArquivoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleOpenUpload = () => {
    setTitulo('')
    setCategoria('Geral')
    setDescricao('')
    setDestinoSugerido('')
    setArquivoFile(null)
    setPreview(null)
    setModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArquivoFile(file)
      setPreview(URL.createObjectURL(file))
      if (!titulo) {
        // Tenta inferir nome amigável a partir do arquivo
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        setTitulo(nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1))
      }
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!arquivoFile || !titulo.trim()) {
      toast({
        variant: 'destructive',
        title: 'Dados incompletos',
        description: 'Selecione uma imagem e preencha o título.',
      })
      return
    }

    setSubmitting(true)
    try {
      const payload: CreateMediaPayload = {
        titulo: titulo.trim(),
        arquivo: arquivoFile,
        categoria,
        descricao: descricao.trim(),
        destino_sugerido: destinoSugerido.trim(),
      }

      await createMedia(payload)
      toast({
        title: 'Foto adicionada à biblioteca',
        description: `A imagem "${titulo}" foi salva no banco e está pronta para reuso.`,
      })
      setModalOpen(false)
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao subir mídia:', err)
      toast({
        variant: 'destructive',
        title: 'Falha no upload',
        description: (err as Error)?.message || 'Não foi possível enviar o arquivo.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (item: MediaRecord) => {
    if (
      !window.confirm(`Tem certeza que deseja excluir a imagem "${item.titulo}" da biblioteca?`)
    ) {
      return
    }

    setDeletingId(item.id)
    try {
      await deleteMedia(item.id)
      toast({
        title: 'Imagem removida',
        description: 'O arquivo foi excluído da biblioteca.',
      })
      onRefresh()
    } catch (err) {
      console.error('Erro ao deletar mídia:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopyUrl = (item: MediaRecord) => {
    const url = getMediaFileUrl(item)
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
    toast({
      title: 'Link copiado!',
      description: 'A URL permanente da imagem foi copiada para sua área de transferência.',
    })
  }

  const filteredMedia = mediaList.filter((m) => {
    const matchCat = filterCat === 'todos' || m.categoria === filterCat
    const term = search.toLowerCase()
    const matchSearch =
      !term ||
      m.titulo.toLowerCase().includes(term) ||
      (m.descricao && m.descricao.toLowerCase().includes(term)) ||
      (m.destino_sugerido && m.destino_sugerido.toLowerCase().includes(term))
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
              Biblioteca de Mídia Geral
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {mediaList.length} {mediaList.length === 1 ? 'arquivo' : 'arquivos'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Acervo de Fotos para Reuso no Site
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suba fotos reais de obras, usinas, baterias BESS e equipamentos uma única vez. Elas
            ficam armazenadas com URL permanente e pronta para substituir os placeholders nas
            páginas de soluções e segmentos.
          </p>
        </div>

        <Button
          onClick={handleOpenUpload}
          className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shadow-sm text-xs h-10 px-4 flex items-center gap-1.5"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Fazer Upload de Foto</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, destino sugerido ou descrição..."
            className="pl-9 h-10 rounded-xl bg-frost border-slate-200 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="h-10 px-3 bg-frost border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-solar-400"
          >
            <option value="todos">Todas as categorias</option>
            {MEDIA_CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 text-slate-500">
          <div className="w-6 h-6 border-2 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Carregando acervo de mídia...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {mediaList.length === 0
              ? 'Nenhuma foto na biblioteca ainda'
              : 'Nenhum arquivo encontrado com esses filtros'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Adicione fotos da sua empresa, equipe e projetos de campo para manter um catálogo
            centralizado e usar em qualquer página do site.
          </p>
          {mediaList.length === 0 && (
            <Button
              onClick={handleOpenUpload}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl"
            >
              Fazer Primeiro Upload
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => {
            const urlLeve = getMediaFileUrl(item, 'leve')
            const urlOriginal = getMediaFileUrl(item, 'original')
            const isCopied = copiedId === item.id

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:border-solar-400 transition-all group"
              >
                <div>
                  {/* Image container - usa versão leve (900px) com fallback */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {urlLeve ? (
                      <img
                        src={urlLeve}
                        alt={item.titulo}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-solar-300 border border-white/10 uppercase">
                      {item.categoria}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-3.5 space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                      {item.titulo}
                    </h4>

                    {item.destino_sugerido && (
                      <div className="flex items-center gap-1 text-[11px] text-solar-700 font-semibold">
                        <Tag className="w-3 h-3 shrink-0" />
                        <span className="truncate">Destino: {item.destino_sugerido}</span>
                      </div>
                    )}

                    {item.descricao && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                        {item.descricao}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyUrl(item)}
                    className="text-[11px] h-7 px-2 text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    title="Copiar URL direta da foto"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{isCopied ? 'Copiado!' : 'Copiar URL'}</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {urlOriginal && (
                      <a
                        href={urlOriginal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/60"
                        title="Ver imagem em tamanho real"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Excluir imagem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Upload */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full my-6 overflow-hidden shadow-2xl border border-slate-100 space-y-6 p-6 sm:p-8 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-600 block">
                  Biblioteca Geral
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">Upload de Nova Foto</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Arquivo Input */}
              <div className="p-4 bg-frost rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-3">
                <UploadCloud className="w-10 h-10 text-solar-500 mx-auto" />
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1 cursor-pointer">
                    Selecione o arquivo da imagem *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-midnight-950 file:text-white hover:file:bg-midnight-900 cursor-pointer"
                  />
                </div>
                {preview && (
                  <div className="pt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-36 mx-auto rounded-xl border border-slate-200 shadow-sm"
                    />
                  </div>
                )}
                <p className="text-[11px] text-slate-400">
                  Formatos: JPG, PNG, WEBP, SVG, GIF. Limite: 15MB.
                </p>
              </div>

              {/* Título & Categoria */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título / Identificador *</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Instalação usina de solo Erechim 300 kWp"
                  required
                  className="rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as MediaCategoria)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    {MEDIA_CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Destino Sugerido</label>
                  <Input
                    value={destinoSugerido}
                    onChange={(e) => setDestinoSugerido(e.target.value)}
                    placeholder="Ex: Página BESS, Segmento Agro"
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descrição / Legenda</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={2}
                  placeholder="Detalhes da foto: ângulo, obra, equipamentos retratados..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                />
              </div>

              {/* Ações */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl text-xs shadow-md"
                >
                  {submitting ? 'Salvando...' : 'Salvar na Biblioteca'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
