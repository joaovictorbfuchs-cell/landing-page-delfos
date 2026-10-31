import React, { useState, useRef, useEffect } from 'react'
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Trash2,
  FileImage,
  FolderPlus,
  Sparkles,
  Link as LinkIcon,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import type { MediaCategoria, CaseRecord, CreateMediaPayload } from '@/types/content'
import { createMedia } from '@/services/content'
import { formatFilenameToTitle, findMatchingCase, buildDestinoSugerido } from './mediaMatchUtils'

export interface BatchItem {
  id: string
  file: File
  previewUrl: string
  titulo: string
  suggestedCase?: CaseRecord
  destinoSugerido: string
  status: 'idle' | 'uploading' | 'success' | 'error'
  errorMessage?: string
}

interface AdminBatchMediaModalProps {
  isOpen: boolean
  onClose: () => void
  casesList: CaseRecord[]
  categorias: MediaCategoria[]
  onSuccessBatch: () => void
  initialFiles?: File[]
}

export default function AdminBatchMediaModal({
  isOpen,
  onClose,
  casesList,
  categorias,
  onSuccessBatch,
  initialFiles = [],
}: AdminBatchMediaModalProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Categoria unificada para o lote
  const [categoriaLote, setCategoriaLote] = useState<MediaCategoria>('Solar EPC')
  const [descricaoGeral, setDescricaoGeral] = useState('')

  // Lista de arquivos e estado de progresso
  const [items, setItems] = useState<BatchItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Inicializa quando abrir com arquivos pré-selecionados
  useEffect(() => {
    if (isOpen && initialFiles.length > 0) {
      addFilesToBatch(initialFiles)
    }
  }, [isOpen, initialFiles])

  // Limpa URLs de preview quando fechar ou desmontar
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    }
  }, [])

  if (!isOpen) return null

  const addFilesToBatch = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'))

    if (fileArray.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhuma foto válida',
        description: 'Selecione apenas arquivos de imagem (JPG, PNG, WEBP, etc).',
      })
      return
    }

    const newItems: BatchItem[] = fileArray.map((file, idx) => {
      const autoTitle = formatFilenameToTitle(file.name)
      // Sugestão automática de case pelo nome do arquivo
      const matchedCase = findMatchingCase(file.name, casesList)
      const suggestedDestino = matchedCase ? buildDestinoSugerido(matchedCase) : ''

      return {
        id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        titulo: autoTitle,
        suggestedCase: matchedCase,
        destinoSugerido: suggestedDestino,
        status: 'idle',
      }
    })

    setItems((prev) => [...prev, ...newItems])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToBatch(e.target.files)
    }
    // Reseta o input para permitir selecionar o mesmo arquivo se desejar
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToBatch(e.dataTransfer.files)
    }
  }

  const handleRemoveItem = (id: string) => {
    if (isUploading) return
    setItems((prev) => {
      const target = prev.find((i) => i.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  const handleUpdateItemTitle = (id: string, newTitle: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, titulo: newTitle } : item)))
  }

  const handleUpdateItemCase = (id: string, caseId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const selected = casesList.find((c) => c.id === caseId)
        return {
          ...item,
          suggestedCase: selected,
          destinoSugerido: selected ? buildDestinoSugerido(selected) : item.destinoSugerido,
        }
      }),
    )
  }

  // Upload de um item individual
  const uploadSingleItem = async (item: BatchItem): Promise<boolean> => {
    try {
      const payload: CreateMediaPayload = {
        titulo: item.titulo.trim() || item.file.name,
        arquivo: item.file,
        categoria: categoriaLote,
        descricao: descricaoGeral.trim(),
        destino_sugerido: item.destinoSugerido.trim(),
      }

      await createMedia(payload)
      return true
    } catch (err: unknown) {
      console.error(`Erro ao subir ${item.file.name}:`, err)
      const errorMsg = (err as Error)?.message || 'Falha no envio'
      throw new Error(errorMsg)
    }
  }

  // Executar upload do lote inteiro ou dos pendentes/erros
  const handleStartUpload = async (onlyErrors = false) => {
    if (items.length === 0) return

    const targets = items.filter((item) => {
      if (onlyErrors) return item.status === 'error'
      return item.status === 'idle' || item.status === 'error'
    })

    if (targets.length === 0) return

    setIsUploading(true)

    let successCount = 0
    let failureCount = 0

    for (const item of targets) {
      // Atualiza status para uploading
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: 'uploading', errorMessage: undefined } : i,
        ),
      )

      try {
        await uploadSingleItem(item)
        successCount++
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'success' } : i)))
      } catch (err: unknown) {
        failureCount++
        const msg = (err as Error)?.message || 'Erro no envio'
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', errorMessage: msg } : i)),
        )
      }
    }

    setIsUploading(false)
    onSuccessBatch()

    if (failureCount === 0) {
      toast({
        title: 'Lote enviado com sucesso!',
        description: `${successCount} fotos foram adicionadas à biblioteca.`,
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Lote parcialmente concluído',
        description: `${successCount} enviadas, mas ${failureCount} apresentaram erro. Você pode tentar reenviar as com falha.`,
      })
    }
  }

  // Repetir apenas um item específico que falhou
  const handleRetrySingle = async (item: BatchItem) => {
    if (isUploading) return
    setIsUploading(true)
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: 'uploading', errorMessage: undefined } : i,
      ),
    )

    try {
      await uploadSingleItem(item)
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: 'success' } : i)))
      toast({
        title: 'Foto enviada!',
        description: `"${item.titulo}" foi adicionada à biblioteca.`,
      })
      onSuccessBatch()
    } catch (err: unknown) {
      const msg = (err as Error)?.message || 'Erro no envio'
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'error', errorMessage: msg } : i)),
      )
      toast({
        variant: 'destructive',
        title: 'Erro ao reenviar foto',
        description: msg,
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Contadores
  const totalItems = items.length
  const successItems = items.filter((i) => i.status === 'success').length
  const errorItems = items.filter((i) => i.status === 'error').length
  const idleItems = items.filter((i) => i.status === 'idle').length
  const uploadingItems = items.filter((i) => i.status === 'uploading').length
  const allCompleted = totalItems > 0 && successItems === totalItems

  const handleCloseModal = () => {
    if (isUploading) {
      if (!window.confirm('Um upload está em andamento. Deseja realmente cancelar?')) {
        return
      }
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-4 sm:my-6 overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Cabeçalho */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-solar-50/60 via-white to-white shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-solar-700 bg-solar-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Layers className="w-3 h-3" /> Upload Múltiplo
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'foto selecionada' : 'fotos selecionadas'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Adicionar Lote de Fotos à Biblioteca
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Envie várias fotos de uma só vez com títulos automáticos e sugestão de case pelo nome
              do arquivo.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseModal}
            className="text-slate-400 hover:text-slate-900 -mr-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Corpo com scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
          {/* Zona de Drop & Seleção */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 sm:p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
              isDragOver
                ? 'border-solar-500 bg-solar-50/60 scale-[0.99]'
                : 'border-slate-300 hover:border-solar-400 bg-frost hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-solar-100 text-solar-700 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-xs sm:text-sm">
                Toque para selecionar ou arraste fotos aqui
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Seleção de múltiplos arquivos habilitada (JPG, PNG, WEBP). No celular, toque e
                selecione várias da sua galeria.
              </p>
            </div>
          </div>

          {/* Configurações Unificadas do Lote */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <FolderPlus className="w-3.5 h-3.5 text-solar-600" />
              <span>Configurações para todo o lote</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Categoria única do lote *
                </label>
                <select
                  value={categoriaLote}
                  onChange={(e) => setCategoriaLote(e.target.value as MediaCategoria)}
                  disabled={isUploading}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                >
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Todas as fotos do lote serão salvas nesta categoria.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Descrição/Legenda opcional para o lote
                </label>
                <Input
                  value={descricaoGeral}
                  onChange={(e) => setDescricaoGeral(e.target.value)}
                  disabled={isUploading}
                  placeholder="Ex: Registro da obra de solo com inversores e módulos"
                  className="h-10 rounded-xl bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Resumo de Progresso do Lote */}
          {totalItems > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-800">
                  Fila de fotos ({totalItems}):
                </span>
                <div className="flex items-center gap-1.5 text-[11px]">
                  {successItems > 0 && (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {successItems} ok
                    </span>
                  )}
                  {uploadingItems > 0 && (
                    <span className="font-bold text-solar-700 bg-solar-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> {uploadingItems} enviando
                    </span>
                  )}
                  {errorItems > 0 && (
                    <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errorItems} falharam
                    </span>
                  )}
                  {idleItems > 0 && (
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {idleItems} pendentes
                    </span>
                  )}
                </div>
              </div>

              {/* Botão de Repetir Todas com Falha se houver erros */}
              {errorItems > 0 && !isUploading && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleStartUpload(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] h-8 px-3 rounded-xl inline-flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    Repetir {errorItems} {errorItems === 1 ? 'que falhou' : 'que falharam'}
                  </span>
                </Button>
              )}
            </div>
          )}

          {/* Lista Individual de Fotos com Progresso e Sugestão de Case */}
          {items.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-2">
              <FileImage className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Nenhuma foto adicionada ainda.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl text-xs"
              >
                Escolher Arquivos
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {items.map((item, index) => {
                const isItemUploading = item.status === 'uploading'
                const isItemSuccess = item.status === 'success'
                const isItemError = item.status === 'error'

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isItemSuccess
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : isItemError
                          ? 'bg-red-50/60 border-red-200'
                          : isItemUploading
                            ? 'bg-amber-50/60 border-amber-300 animate-pulse'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Imagem + Detalhes + Título editável */}
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                      {/* Thumbnail com indicador de status sobreposto */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                        <img
                          src={item.previewUrl}
                          alt={item.titulo}
                          className="w-full h-full object-cover"
                        />
                        {isItemSuccess && (
                          <div className="absolute inset-0 bg-emerald-900/60 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          </div>
                        )}
                        {isItemError && (
                          <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                          </div>
                        )}
                        {isItemUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-solar-400 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Dados editáveis da foto */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            #{index + 1}
                          </span>
                          {/* Input inline de título */}
                          <Input
                            value={item.titulo}
                            onChange={(e) => handleUpdateItemTitle(item.id, e.target.value)}
                            disabled={isUploading || isItemSuccess}
                            placeholder="Título da foto..."
                            className="h-8 py-1 px-2 text-xs font-semibold rounded-lg bg-transparent hover:bg-slate-50 focus:bg-white border-transparent hover:border-slate-200 focus:border-solar-400"
                            title="Clique para editar o título individual da foto"
                          />
                        </div>

                        {/* Nome original do arquivo */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span
                            className="font-mono truncate max-w-[160px] sm:max-w-[200px]"
                            title={item.file.name}
                          >
                            {item.file.name}
                          </span>
                          <span>•</span>
                          <span>{(item.file.size / 1024).toFixed(0)} KB</span>
                        </div>

                        {/* Sugestão de Case Automática ou Seletor */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {item.suggestedCase ? (
                            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                              <span className="truncate max-w-[180px] sm:max-w-[240px]">
                                Case sugerido:{' '}
                                {item.suggestedCase.cliente || item.suggestedCase.titulo}
                              </span>
                            </div>
                          ) : null}

                          {/* Seletor compacto de case para ajustar ou associar se quiser */}
                          {!isItemSuccess && (
                            <select
                              value={item.suggestedCase?.id || ''}
                              onChange={(e) => handleUpdateItemCase(item.id, e.target.value)}
                              disabled={isUploading}
                              className="text-[10px] h-6 px-1.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-md text-slate-600 focus:outline-none"
                              title="Vincular a um case específico"
                            >
                              <option value="">
                                {item.suggestedCase ? 'Trocar case...' : 'Vincular case...'}
                              </option>
                              {casesList.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.cliente || c.titulo}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Mensagem de Erro se houver */}
                        {isItemError && item.errorMessage && (
                          <p className="text-[11px] text-red-600 font-medium">
                            {item.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status e Ações por item */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Tag de Status */}
                      {isItemSuccess && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enviada
                        </span>
                      )}

                      {isItemUploading && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Subindo...
                        </span>
                      )}

                      {isItemError && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Falhou
                          </span>
                          {!isUploading && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleRetrySingle(item)}
                              className="h-7 px-2 text-[11px] border-red-300 text-red-700 hover:bg-red-50 rounded-lg"
                              title="Tentar esta novamente"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" /> Reenviar
                            </Button>
                          )}
                        </div>
                      )}

                      {item.status === 'idle' && (
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          Pronta
                        </span>
                      )}

                      {/* Botão de Remover se não estiver subindo ou se já foi enviada */}
                      {!isUploading && !isItemSuccess && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Remover do lote"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Rodapé e Ações do Modal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
              disabled={isUploading}
              className="w-full sm:w-auto rounded-xl text-xs h-10"
            >
              {allCompleted ? 'Concluir e Fechar' : 'Fechar'}
            </Button>

            {/* Botão adicional para adicionar mais fotos */}
            {!isUploading && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto text-slate-600 hover:text-slate-900 text-xs h-10 rounded-xl"
              >
                + Adicionar mais fotos
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {allCompleted ? (
              <Button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs h-10 px-6 shadow-sm"
              >
                Todas as {totalItems} fotos salvas! Fechar
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isUploading || items.filter((i) => i.status !== 'success').length === 0}
                onClick={() => handleStartUpload(false)}
                className="w-full sm:w-auto bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl text-xs h-10 px-6 shadow-md flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      Subindo lote ({uploadingItems || successItems}/{totalItems})...
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>
                      {errorItems > 0 && idleItems === 0
                        ? `Repetir ${errorItems} com falha`
                        : `Confirmar e Subir ${items.filter((i) => i.status !== 'success').length} Fotos`}
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
