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
  Edit2,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import type {
  MediaRecord,
  CreateMediaPayload,
  UpdateMediaPayload,
  MediaCategoria,
  CaseRecord,
} from '@/types/content'
import {
  createMedia,
  updateMedia,
  deleteMedia,
  getMediaFileUrl,
  updateCase,
  simularLimpezaDuplicadas,
  executarLimpezaDuplicadas,
  type LimparDuplicadasResponse,
} from '@/services/content'

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
  casesList?: CaseRecord[]
  loading: boolean
  onRefresh: () => void
}

export default function AdminMediaTab({
  mediaList,
  casesList = [],
  loading,
  onRefresh,
}: AdminMediaTabProps) {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string>('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Edit State & Modal
  const [editingItem, setEditingItem] = useState<MediaRecord | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editCategoria, setEditCategoria] = useState<MediaCategoria>('Geral')
  const [editDescricao, setEditDescricao] = useState('')
  const [editDestinoSugerido, setEditDestinoSugerido] = useState('')
  const [editCaseId, setEditCaseId] = useState<string>('')
  const [editArquivoFile, setEditArquivoFile] = useState<File | null>(null)
  const [editPreview, setEditPreview] = useState<string | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  // Limpeza de duplicadas Modal & State
  const [limpezaModalOpen, setLimpezaModalOpen] = useState(false)
  const [carregandoLimpeza, setCarregandoLimpeza] = useState(false)
  const [executandoLimpeza, setExecutandoLimpeza] = useState(false)
  const [resultadoLimpeza, setResultadoLimpeza] = useState<LimparDuplicadasResponse | null>(null)
  const [abaDetalhes, setAbaDetalhes] = useState<'excluir' | 'revisar' | 'vinculados'>('excluir')

  // Upload Form
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState<MediaCategoria>('Geral')
  const [descricao, setDescricao] = useState('')
  const [destinoSugerido, setDestinoSugerido] = useState('')
  const [arquivoFile, setArquivoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleAbrirLimpeza = async () => {
    setLimpezaModalOpen(true)
    setCarregandoLimpeza(true)
    try {
      const res = await simularLimpezaDuplicadas()
      setResultadoLimpeza(res)
    } catch (err: unknown) {
      console.error('Erro ao simular limpeza:', err)
      toast({
        variant: 'destructive',
        title: 'Falha ao analisar duplicadas',
        description: (err as Error)?.message || 'Não foi possível carregar a simulação.',
      })
    } finally {
      setCarregandoLimpeza(false)
    }
  }

  const handleConfirmarLimpeza = async () => {
    setExecutandoLimpeza(true)
    try {
      const res = await executarLimpezaDuplicadas()
      setResultadoLimpeza(res)
      toast({
        title: 'Limpeza concluída com sucesso!',
        description: `${res.resumo.totalExcluidosEfetivamente} arquivos obsoletos/duplicados foram removidos da biblioteca.`,
      })
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao executar limpeza:', err)
      toast({
        variant: 'destructive',
        title: 'Falha na exclusão',
        description: (err as Error)?.message || 'Ocorreu um erro ao excluir as duplicadas.',
      })
    } finally {
      setExecutandoLimpeza(false)
    }
  }

  const handleOpenUpload = () => {
    setTitulo('')
    setCategoria('Geral')
    setDescricao('')
    setDestinoSugerido('')
    setArquivoFile(null)
    setPreview(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (item: MediaRecord) => {
    setEditingItem(item)
    setEditTitulo(item.titulo || '')
    setEditCategoria(item.categoria || 'Geral')
    setEditDescricao(item.descricao || '')
    setEditDestinoSugerido(item.destino_sugerido || '')
    setEditArquivoFile(null)
    setEditPreview(null)

    // Se houver algum case com nome/slug contido no destino_sugerido ou título, sugerir pré-seleção
    const matchCase = casesList.find((c) => {
      const dest = (item.destino_sugerido || '').toLowerCase()
      const tit = (item.titulo || '').toLowerCase()
      const cNome = (c.cliente || '').toLowerCase()
      const cTit = (c.titulo || '').toLowerCase()
      return (
        (cNome && (dest.includes(cNome) || tit.includes(cNome))) ||
        (cTit && (dest.includes(cTit) || tit.includes(cTit)))
      )
    })
    setEditCaseId(matchCase ? matchCase.id : '')
  }

  const handleCloseEdit = () => {
    setEditingItem(null)
    setEditArquivoFile(null)
    setEditPreview(null)
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEditArquivoFile(file)
      setEditPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    if (!editTitulo.trim()) {
      toast({
        variant: 'destructive',
        title: 'Título obrigatório',
        description: 'Informe um título/identificador para a imagem.',
      })
      return
    }

    setSavingEdit(true)
    try {
      // 1. Atualizar registro em media
      const payload: UpdateMediaPayload = {
        titulo: editTitulo.trim(),
        categoria: editCategoria,
        descricao: editDescricao.trim(),
        destino_sugerido: editDestinoSugerido.trim(),
      }
      if (editArquivoFile) {
        payload.arquivo = editArquivoFile
      }

      await updateMedia(editingItem.id, payload)

      // 2. Se o usuário vinculou ou trocou a imagem no case selecionado e forneceu novo arquivo
      if (editCaseId && editArquivoFile) {
        await updateCase(editCaseId, { foto: editArquivoFile })
      }

      toast({
        title: 'Imagem atualizada!',
        description: `As informações de "${editTitulo}" foram salvas na biblioteca com sucesso.`,
      })
      handleCloseEdit()
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao atualizar mídia:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: (err as Error)?.message || 'Não foi possível salvar as alterações da imagem.',
      })
    } finally {
      setSavingEdit(false)
    }
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

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleAbrirLimpeza}
            variant="outline"
            className="border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 font-bold rounded-xl text-xs h-10 px-3.5 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Limpar duplicadas</span>
          </Button>

          <Button
            onClick={handleOpenUpload}
            className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shadow-sm text-xs h-10 px-4 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 shrink-0" />
            <span>Fazer Upload de Foto</span>
          </Button>
        </div>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                      className="text-[11px] h-7 px-2 text-slate-600 hover:text-solar-700 hover:bg-solar-50 flex items-center gap-1"
                      title="Editar informações da imagem"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Editar</span>
                    </Button>

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

      {/* Modal Edição de Imagem */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full my-6 overflow-hidden shadow-2xl border border-slate-100 space-y-6 p-6 sm:p-8 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-600 block">
                  Editar Imagem da Biblioteca
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">Editar Detalhes da Imagem</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEdit}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Preview e Troca de Arquivo */}
              <div className="p-4 bg-frost rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-20 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                  <img
                    src={editPreview || getMediaFileUrl(editingItem, 'leve')}
                    alt={editTitulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Substituir arquivo da foto (opcional)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Arquivo atual:{' '}
                    <span className="font-mono text-slate-700">{editingItem.arquivo}</span>
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                  />
                </div>
              </div>

              {/* Título */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título / Identificador *</label>
                <Input
                  value={editTitulo}
                  onChange={(e) => setEditTitulo(e.target.value)}
                  placeholder="Ex: Instalação usina de solo Erechim 300 kWp"
                  required
                  className="rounded-xl text-xs sm:text-sm"
                />
                <p className="text-[11px] text-slate-400">
                  Nome amigável da foto. Evite nomes de clientes que não correspondam à obra real.
                </p>
              </div>

              {/* Categoria e Case Vinculado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Categoria</label>
                  <select
                    value={editCategoria}
                    onChange={(e) => setEditCategoria(e.target.value as MediaCategoria)}
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
                  <label className="text-xs font-bold text-slate-700">
                    Case / Projeto Vinculado
                  </label>
                  <select
                    value={editCaseId}
                    onChange={(e) => {
                      const selectedId = e.target.value
                      setEditCaseId(selectedId)
                      if (selectedId) {
                        const targetCase = casesList.find((c) => c.id === selectedId)
                        if (targetCase) {
                          setEditDestinoSugerido(
                            `Case ${targetCase.cliente || targetCase.titulo} / ${targetCase.setor || 'Solar'}`,
                          )
                        }
                      }
                    }}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    <option value="">Nenhum / Não vinculado</option>
                    {casesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.cliente
                          ? `${c.cliente} (${c.potencia_capacidade || c.local || ''})`
                          : c.titulo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destino Sugerido */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Destino Sugerido / Onde Usar
                </label>
                <Input
                  value={editDestinoSugerido}
                  onChange={(e) => setEditDestinoSugerido(e.target.value)}
                  placeholder="Ex: Case Cassul / Solução Solar / Comércio"
                  className="rounded-xl text-xs"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descrição / Legenda</label>
                <textarea
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  rows={2}
                  placeholder="Detalhes da foto: tipo de estrutura, módulos solares, ângulo..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                />
              </div>

              {/* Ações */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEdit}
                  className="rounded-xl text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl text-xs shadow-md"
                >
                  {savingEdit ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Limpar Duplicadas */}
      {limpezaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-6 overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-amber-50/50 via-white to-white">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Manutenção da Biblioteca
                  </span>
                  {resultadoLimpeza?.modo === 'executado' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Concluído
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Limpeza Segura de Fotos Duplicadas
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Exclui os registros obsoletos da 1ª importação e cópias redundantes, preservando
                  fotos vinculadas aos cases do site.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLimpezaModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 -mr-2"
              >
                ✕
              </Button>
            </div>

            {/* Conteúdo / Resumo */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
              {carregandoLimpeza ? (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                  <p className="font-semibold text-slate-700">
                    Analisando banco de dados e verificando vínculos de mídia...
                  </p>
                  <p className="text-xs text-slate-400">
                    Conferindo coleções de cases, posts e leads para garantir segurança total.
                  </p>
                </div>
              ) : !resultadoLimpeza ? (
                <div className="py-8 text-center text-slate-500">
                  <p>Não foi possível carregar a análise de duplicadas.</p>
                  <Button onClick={handleAbrirLimpeza} variant="outline" className="mt-3 text-xs">
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <>
                  {/* Cards de Resumo */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-red-50/80 border border-red-200/80 rounded-2xl p-3 text-center">
                      <span className="text-[11px] font-bold text-red-700 block uppercase">
                        {resultadoLimpeza.modo === 'executado' ? 'Excluídas' : 'A Apagar'}
                      </span>
                      <span className="text-2xl font-extrabold text-red-900 block my-0.5">
                        {resultadoLimpeza.modo === 'executado'
                          ? resultadoLimpeza.resumo.totalExcluidosEfetivamente
                          : resultadoLimpeza.resumo.totalParaExcluir}
                      </span>
                      <span className="text-[10px] text-red-600 block leading-tight">
                        obsoletas / 1ª rodada
                      </span>
                    </div>

                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-center">
                      <span className="text-[11px] font-bold text-amber-800 block uppercase">
                        Para Revisão
                      </span>
                      <span className="text-2xl font-extrabold text-amber-950 block my-0.5">
                        {resultadoLimpeza.resumo.totalParaRevisar}
                      </span>
                      <span className="text-[10px] text-amber-700 block leading-tight">
                        aéreas / únicas mantidas
                      </span>
                    </div>

                    <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 text-center">
                      <span className="text-[11px] font-bold text-emerald-800 block uppercase">
                        Vinculadas
                      </span>
                      <span className="text-2xl font-extrabold text-emerald-950 block my-0.5">
                        {resultadoLimpeza.resumo.totalVinculadosPulados}
                      </span>
                      <span className="text-[10px] text-emerald-700 block leading-tight">
                        protegidas no site
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                      <span className="text-[11px] font-bold text-slate-700 block uppercase">
                        Total Final
                      </span>
                      <span className="text-2xl font-extrabold text-slate-900 block my-0.5">
                        {resultadoLimpeza.modo === 'executado'
                          ? resultadoLimpeza.totalRegistrosAtual -
                            resultadoLimpeza.resumo.totalExcluidosEfetivamente
                          : resultadoLimpeza.totalAposLimpezaEstimado}
                      </span>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        de {resultadoLimpeza.totalRegistrosAtual} atuais
                      </span>
                    </div>
                  </div>

                  {/* Aviso de segurança e regras atendidas */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-start gap-2 text-slate-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 text-xs">
                          Garantia de segurança do site público
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Nenhum registro utilizado em cases de sucesso, posts de blog ou
                          formulários será excluído. As fotos aéreas genéricas do acervo histórico
                          que não possuem cópia explícita foram preservadas e sinalizadas para
                          revisão manual.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs de Detalhamento */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="flex border-b border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setAbaDetalhes('excluir')}
                        className={`flex-1 py-2 px-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                          abaDetalhes === 'excluir'
                            ? 'border-red-500 text-red-700 bg-white'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {resultadoLimpeza.modo === 'executado' ? 'Excluídos' : 'A Apagar'} (
                        {resultadoLimpeza.detalhes.paraExcluir.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setAbaDetalhes('revisar')}
                        className={`flex-1 py-2 px-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                          abaDetalhes === 'revisar'
                            ? 'border-amber-500 text-amber-800 bg-white'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Revisar ({resultadoLimpeza.detalhes.paraRevisar.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setAbaDetalhes('vinculados')}
                        className={`flex-1 py-2 px-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
                          abaDetalhes === 'vinculados'
                            ? 'border-emerald-500 text-emerald-700 bg-white'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Protegidos ({resultadoLimpeza.detalhes.vinculadosPulados.length})
                      </button>
                    </div>

                    <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 p-1">
                      {abaDetalhes === 'excluir' &&
                        (resultadoLimpeza.detalhes.paraExcluir.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-xs">
                            Nenhum registro para excluir.
                          </div>
                        ) : (
                          resultadoLimpeza.detalhes.paraExcluir.map((item) => (
                            <div
                              key={item.id}
                              className="p-2.5 flex items-start justify-between gap-2 text-xs"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 truncate">
                                  {item.titulo}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono truncate">
                                  {item.arquivo}
                                </p>
                                <span className="inline-block mt-0.5 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.2 rounded font-medium">
                                  {item.motivo}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                {item.created ? item.created.substring(0, 10) : ''}
                              </span>
                            </div>
                          ))
                        ))}

                      {abaDetalhes === 'revisar' &&
                        (resultadoLimpeza.detalhes.paraRevisar.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-xs">
                            Nenhum registro marcado para revisão.
                          </div>
                        ) : (
                          resultadoLimpeza.detalhes.paraRevisar.map((item) => (
                            <div
                              key={item.id}
                              className="p-2.5 flex items-start justify-between gap-2 text-xs bg-amber-50/30"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                  <p className="font-semibold text-amber-950 truncate">
                                    {item.titulo}
                                  </p>
                                </div>
                                <p className="text-[11px] text-slate-500 font-mono truncate">
                                  {item.arquivo}
                                </p>
                                <span className="inline-block mt-0.5 text-[10px] text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded font-medium">
                                  {item.motivo}
                                </span>
                              </div>
                            </div>
                          ))
                        ))}

                      {abaDetalhes === 'vinculados' &&
                        (resultadoLimpeza.detalhes.vinculadosPulados.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-xs">
                            Nenhuma foto vinculada corria risco de exclusão.
                          </div>
                        ) : (
                          resultadoLimpeza.detalhes.vinculadosPulados.map((item) => (
                            <div
                              key={item.id}
                              className="p-2.5 flex items-start justify-between gap-2 text-xs bg-emerald-50/30"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <p className="font-semibold text-emerald-950 truncate">
                                    {item.titulo}
                                  </p>
                                </div>
                                <p className="text-[11px] text-slate-500 font-mono truncate">
                                  {item.arquivo}
                                </p>
                                <span className="inline-block mt-0.5 text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-medium">
                                  {item.motivo}
                                </span>
                              </div>
                            </div>
                          ))
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Modal / Ações */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLimpezaModalOpen(false)}
                className="w-full sm:w-auto rounded-xl text-xs h-10"
              >
                {resultadoLimpeza?.modo === 'executado' ? 'Fechar' : 'Cancelar'}
              </Button>

              {resultadoLimpeza?.modo !== 'executado' && (
                <Button
                  type="button"
                  onClick={handleConfirmarLimpeza}
                  disabled={
                    carregandoLimpeza ||
                    executandoLimpeza ||
                    (resultadoLimpeza?.resumo.totalParaExcluir || 0) === 0
                  }
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs h-10 px-5 shadow-sm flex items-center justify-center gap-2"
                >
                  {executandoLimpeza ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Excluindo registros...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>
                        Confirmar e Excluir {resultadoLimpeza?.resumo.totalParaExcluir || 0}{' '}
                        Duplicadas
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
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
