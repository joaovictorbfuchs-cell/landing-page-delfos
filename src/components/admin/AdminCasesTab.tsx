import { useState, useEffect } from 'react'
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  MapPin,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Star,
  FolderOpen,
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import type {
  CaseRecord,
  UpsertCasePayload,
  CaseSetor,
  CaseSolucao,
  CaseStatus,
  MediaRecord,
} from '@/types/content'
import {
  createCase,
  updateCase,
  toggleCaseStatus,
  deleteCase,
  getCaseImageUrl,
  getMediaFileUrl,
  listMediaByCase,
  uploadMediaToCase,
  attachMediaToCase,
  detachMediaFromCase,
  reorderCaseMedia,
  updateMediaGaleria,
} from '@/services/content'
import MediaLibraryPicker from './MediaLibraryPicker'
import { fetchMediaAsFile } from './mediaCaseUtils'
import { comprimirImagem } from './imageCompress'

const SETORES: CaseSetor[] = [
  'Residências',
  'Comércio e Serviços',
  'Indústria',
  'Agronegócio',
  'Condomínios',
  'Investidores e Usinas',
  'Frotas e Eletropostos',
]

const SOLUCOES: CaseSolucao[] = [
  'Energia Solar',
  'BESS (Armazenamento)',
  'O&M e Monitoramento',
  'Carregadores Veiculares',
]

interface AdminCasesTabProps {
  cases: CaseRecord[]
  loading: boolean
  onRefresh: () => void
  /** Biblioteca de mídia para escolher foto do case sem reenviar arquivo (mobile) */
  mediaList?: MediaRecord[]
  /** ID do case cujo editor deve abrir (atalho vindo da Biblioteca de Mídia) */
  caseIdParaAbrir?: string | null
  /** Chamado quando o editor solicitado foi aberto (para limpar o atalho no pai) */
  onCaseEditorAberto?: () => void
}

export default function AdminCasesTab({
  cases,
  loading,
  onRefresh,
  mediaList = [],
  caseIdParaAbrir = null,
  onCaseEditorAberto,
}: AdminCasesTabProps) {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<CaseRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  // Form State
  const [titulo, setTitulo] = useState('')
  const [slug, setSlug] = useState('')
  const [cliente, setCliente] = useState('')
  const [setor, setSetor] = useState<CaseSetor>('Comércio e Serviços')
  const [solucao, setSolucao] = useState<CaseSolucao>('Energia Solar')
  const [local, setLocal] = useState('Erechim / RS')
  const [escopo, setEscopo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [solucaoTecnica, setSolucaoTecnica] = useState('')
  const [resultado, setResultado] = useState('')
  const [resultadoValor, setResultadoValor] = useState('91%')
  const [resultadoLabel, setResultadoLabel] = useState('Economia na fatura de energia')
  const [potenciaCapacidade, setPotenciaCapacidade] = useState('15 kWp')
  const [dataEntrega, setDataEntrega] = useState('Novembro / 2024')
  const [status, setStatus] = useState<CaseStatus>('publicado')
  const [destaque, setDestaque] = useState(false)
  const [isExemplo, setIsExemplo] = useState(false)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<'capa' | 'galeria'>('capa')
  const [pickerLoadingId, setPickerLoadingId] = useState<string | null>(null)
  const [projectPhotos, setProjectPhotos] = useState<MediaRecord[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [uploadingDirectPhoto, setUploadingDirectPhoto] = useState(false)
  const [fotoRemovida, setFotoRemovida] = useState(false)

  const handleOpenCreate = () => {
    setEditingCase(null)
    setTitulo('')
    setSlug('')
    setCliente('')
    setSetor('Comércio e Serviços')
    setSolucao('Energia Solar')
    setLocal('Erechim / RS')
    setEscopo('')
    setDescricao('')
    setSolucaoTecnica('')
    setResultado('Redução média comprovada em medição de 12 meses')
    setResultadoValor('88%')
    setResultadoLabel('Economia média auditada')
    setPotenciaCapacidade('25 kWp')
    setDataEntrega(new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
    setStatus('publicado')
    setDestaque(false)
    setIsExemplo(false)
    setFotoFile(null)
    setFotoPreview(null)
    setFotoRemovida(false)
    setPickerOpen(false)
    setProjectPhotos([])
    setModalOpen(true)
  }

  // Carrega fotos vinculadas por case_id quando o modal de edição abre
  const carregarFotosDoProjeto = async (caseId: string) => {
    setLoadingPhotos(true)
    try {
      const photos = await listMediaByCase(caseId)
      setProjectPhotos(photos)
    } catch (err) {
      console.error('Erro ao carregar fotos do projeto:', err)
    } finally {
      setLoadingPhotos(false)
    }
  }

  const handleOpenEdit = (caseItem: CaseRecord) => {
    setEditingCase(caseItem)
    setTitulo(caseItem.titulo)
    setSlug(caseItem.slug)
    setCliente(caseItem.cliente || '')
    setSetor(caseItem.setor)
    setSolucao(caseItem.solucao || 'Energia Solar')
    setLocal(caseItem.local || '')
    setEscopo(caseItem.escopo || '')
    setDescricao(caseItem.descricao || '')
    setSolucaoTecnica(caseItem.solucao_tecnica || '')
    setResultado(caseItem.resultado || '')
    setResultadoValor(caseItem.resultado_valor || '')
    setResultadoLabel(caseItem.resultado_label || '')
    setPotenciaCapacidade(caseItem.potencia_capacidade || '')
    setDataEntrega(caseItem.data_entrega || '')
    setStatus(caseItem.status)
    setDestaque(Boolean(caseItem.destaque))
    setIsExemplo(Boolean(caseItem.is_exemplo))
    setFotoFile(null)
    setFotoPreview(getCaseImageUrl(caseItem) || null)
    setFotoRemovida(false)
    setPickerOpen(false)
    setModalOpen(true)
    carregarFotosDoProjeto(caseItem.id)
  }

  // Atalho vindo da Biblioteca: abre o editor do projeto solicitado
  // (clique no selo de status ou botão "Abrir projeto" do aviso de rascunho)
  useEffect(() => {
    if (!caseIdParaAbrir) return
    const alvo = cases.find((c) => c.id === caseIdParaAbrir)
    if (!alvo) return
    handleOpenEdit(alvo)
    onCaseEditorAberto?.()
  }, [caseIdParaAbrir, cases])

  // Escolha de foto da biblioteca (modo capa OU modo vincular à galeria)
  const handleSelectMediaFoto = async (media: MediaRecord) => {
    if (pickerMode === 'galeria' && editingCase) {
      setPickerLoadingId(media.id)
      try {
        const updated = await attachMediaToCase(media.id, editingCase.id, projectPhotos.length + 1)
        setProjectPhotos((prev) => [...prev.filter((p) => p.id !== updated.id), updated])
        setPickerOpen(false)
        toast({
          title: 'Foto vinculada ao projeto',
          description: `"${media.titulo}" agora faz parte da galeria deste projeto.`,
        })
      } catch (err: unknown) {
        console.error('Erro ao vincular mídia:', err)
        toast({
          variant: 'destructive',
          title: 'Erro ao vincular',
          description: (err as Error)?.message || 'Não foi possível vincular a foto.',
        })
      } finally {
        setPickerLoadingId(null)
      }
      return
    }

    // Modo capa legado/fallback
    setPickerLoadingId(media.id)
    try {
      const original = await fetchMediaAsFile(media)
      // Compressão automática (máx. 1600px, WebP) — fotos antigas podem ser grandes
      const file = await comprimirImagem(original)
      if (!file) {
        toast({
          variant: 'destructive',
          title: 'Foto indisponível',
          description: 'Não foi possível obter o arquivo desta mídia.',
        })
        return
      }
      setFotoFile(file)
      setFotoPreview(getMediaFileUrl(media, 'leve'))
      setFotoRemovida(false)
      setPickerOpen(false)
      toast({
        title: 'Foto da biblioteca selecionada',
        description: `"${media.titulo}" será usada como capa ao salvar.`,
      })
    } catch (err: unknown) {
      console.error('Erro ao usar foto da biblioteca:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao usar foto da biblioteca',
        description: (err as Error)?.message || 'Não foi possível carregar a imagem selecionada.',
      })
    } finally {
      setPickerLoadingId(null)
    }
  }

  // Upload direto de foto para a galeria deste projeto
  const handleDirectPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingCase) return

    setUploadingDirectPhoto(true)
    try {
      // Compressão automática (máx. 1600px, WebP) antes de enviar
      const arquivoComprimido = await comprimirImagem(file)
      const newMedia = await uploadMediaToCase(
        editingCase.id,
        arquivoComprimido,
        file.name,
        projectPhotos.length + 1,
      )
      // Atualiza metadados complementares de projeto se possível
      const partesLocal = (editingCase.local || local || '').split(/[/-]/)
      const cid = partesLocal[0]?.trim() || ''
      const uf = partesLocal[1]?.trim() || 'RS'
      await updateMediaGaleria(newMedia.id, {
        cidade: cid,
        uf: uf,
        potencia: editingCase.potencia_capacidade || potenciaCapacidade || '',
        publicado_galeria: true,
      })
      setProjectPhotos((prev) => [
        ...prev,
        { ...newMedia, cidade: cid, uf: uf, potencia: editingCase.potencia_capacidade },
      ])
      toast({
        title: 'Foto adicionada',
        description: 'A foto foi enviada e vinculada a este projeto.',
      })
    } catch (err: unknown) {
      console.error('Erro no upload da foto do projeto:', err)
      toast({
        variant: 'destructive',
        title: 'Erro no envio da foto',
        description: (err as Error)?.message || 'Não foi possível enviar a foto.',
      })
    } finally {
      setUploadingDirectPhoto(false)
      e.target.value = ''
    }
  }

  // Excluir / desvincular foto do projeto
  const handleRemoveProjectPhoto = async (photoId: string) => {
    if (!window.confirm('Deseja desvincular esta foto do projeto?')) return
    try {
      await detachMediaFromCase(photoId)
      const updatedList = projectPhotos.filter((p) => p.id !== photoId)
      setProjectPhotos(updatedList)
      await reorderCaseMedia(updatedList.map((p) => p.id))
      toast({
        title: 'Foto desvinculada',
        description: 'A foto foi removida da galeria deste projeto.',
      })
    } catch (err: unknown) {
      console.error('Erro ao desvincular foto:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao desvincular foto',
        description: (err as Error)?.message || 'Não foi possível desvincular a foto.',
      })
    }
  }

  // Reordenar foto do projeto (sobe ou desce)
  const handleMovePhoto = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= projectPhotos.length) return

    const newList = [...projectPhotos]
    const [moved] = newList.splice(index, 1)
    newList.splice(targetIndex, 0, moved)
    setProjectPhotos(newList)

    try {
      await reorderCaseMedia(newList.map((p) => p.id))
      toast({
        title: 'Ordem atualizada',
        description:
          targetIndex === 0
            ? 'A foto agora é a primeira da galeria (capa).'
            : 'Ordem das fotos salva.',
      })
    } catch (err) {
      console.error('Erro ao salvar reordenação:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao reordenar',
        description: 'Não foi possível salvar a nova ordem das fotos.',
      })
    }
  }

  const handleRemoverFoto = () => {
    setFotoFile(null)
    setFotoPreview(null)
    setFotoRemovida(true)
  }

  const handleTituloChange = (val: string) => {
    setTitulo(val)
    if (!editingCase) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(generatedSlug)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Compressão automática (máx. 1600px, WebP) antes de enviar
      const comprimido = await comprimirImagem(file)
      setFotoFile(comprimido)
      setFotoPreview(URL.createObjectURL(comprimido))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim() || !slug.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Título e slug são obrigatórios.',
      })
      return
    }

    setSubmitting(true)
    try {
      const payload: UpsertCasePayload = {
        titulo: titulo.trim(),
        slug: slug.trim(),
        cliente: cliente.trim(),
        setor,
        solucao,
        local: local.trim(),
        escopo: escopo.trim(),
        descricao: descricao.trim(),
        solucao_tecnica: solucaoTecnica.trim(),
        resultado: resultado.trim(),
        resultado_valor: resultadoValor.trim(),
        resultado_label: resultadoLabel.trim(),
        potencia_capacidade: potenciaCapacidade.trim(),
        data_entrega: dataEntrega.trim(),
        status,
        destaque,
        is_exemplo: isExemplo,
        foto: fotoRemovida ? null : fotoFile,
      }

      if (editingCase) {
        await updateCase(editingCase.id, payload)
        toast({
          title: 'Projeto atualizado',
          description: `O projeto "${titulo}" foi salvo com sucesso.`,
        })
      } else {
        await createCase(payload)
        toast({
          title: 'Projeto criado',
          description: `O projeto "${titulo}" foi adicionado com sucesso.`,
        })
      }

      setModalOpen(false)
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao salvar projeto:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar projeto',
        description: (err as Error)?.message || 'Não foi possível salvar o projeto.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (caseItem: CaseRecord) => {
    setActionLoadingId(caseItem.id)
    try {
      await toggleCaseStatus(caseItem.id, caseItem.status)
      toast({
        title: caseItem.status === 'publicado' ? 'Projeto despublicado' : 'Projeto publicado',
        description: `O projeto agora está em status ${caseItem.status === 'publicado' ? 'rascunho' : 'publicado'}.`,
      })
      onRefresh()
    } catch (err) {
      console.error('Erro ao alternar status do case:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar status',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (caseItem: CaseRecord) => {
    if (!window.confirm(`Tem certeza que deseja excluir o projeto "${caseItem.titulo}"?`)) {
      return
    }

    setActionLoadingId(caseItem.id)
    try {
      await deleteCase(caseItem.id)
      toast({
        title: 'Projeto excluído',
        description: 'O projeto foi removido com sucesso.',
      })
      onRefresh()
    } catch (err) {
      console.error('Erro ao excluir case:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
              Gestão de Conteúdo
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {cases.length} {cases.length === 1 ? 'projeto' : 'projetos'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Projetos Realizados da Delfos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Projetos com status &ldquo;publicado&rdquo; são exibidos automaticamente na página
            pública de Projetos Realizados com suas fotos. Rascunhos nunca aparecem publicamente.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shadow-sm text-xs h-10 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </Button>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-6 h-6 border-2 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Carregando projetos do banco de dados...
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Nenhum projeto cadastrado no banco
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Clique em "Novo Projeto" para adicionar seu primeiro projeto com foto via upload. O
              site exibe os projetos padrão do acervo até novos serem cadastrados!
            </p>
            <Button
              onClick={handleOpenCreate}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl"
            >
              Criar Primeiro Projeto
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Foto</th>
                  <th className="py-4 px-5">Título / Setor</th>
                  <th className="py-4 px-5">Solução / Potência</th>
                  <th className="py-4 px-5">Resultado Auditado</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {cases.map((caseItem) => {
                  const imageUrl = getCaseImageUrl(caseItem, 'leve')
                  const isPublicado = caseItem.status === 'publicado'

                  return (
                    <tr key={caseItem.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Foto */}
                      <td className="py-3 px-5 w-24">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={caseItem.titulo}
                            loading="lazy"
                            decoding="async"
                            className="w-16 h-12 object-cover rounded-xl border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Título & Setor */}
                      <td className="py-3 px-5 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                              {caseItem.setor}
                            </span>
                            {caseItem.is_exemplo && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                                Exemplo de aplicação
                              </span>
                            )}
                            {caseItem.destaque && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                Destaque
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                            {caseItem.titulo}
                          </h4>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {caseItem.local || 'Erechim / RS'}
                          </span>
                        </div>
                      </td>

                      {/* Solução & Potência */}
                      <td className="py-3 px-5 text-xs text-slate-600 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800">
                            {caseItem.solucao || 'Energia Solar'}
                          </div>
                          <div className="text-solar-700 font-mono font-bold text-[11px] flex items-center gap-1">
                            <Zap className="w-3 h-3 text-solar-500" />
                            {caseItem.potencia_capacidade || 'Não inf.'}
                          </div>
                        </div>
                      </td>

                      {/* Resultado */}
                      <td className="py-3 px-5 max-w-xs text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-emerald-700 text-sm block">
                            {caseItem.resultado_valor || 'Métrica auditada'}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {caseItem.resultado || caseItem.resultado_label || ''}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPublicado
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublicado ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          {isPublicado ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Publicar / Despublicar */}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoadingId === caseItem.id}
                            onClick={() => handleToggleStatus(caseItem)}
                            className="text-xs h-8 text-slate-600 hover:text-slate-900"
                            title={isPublicado ? 'Mudar para rascunho' : 'Publicar no site'}
                          >
                            {isPublicado ? (
                              <EyeOff className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            )}
                            <span>{isPublicado ? 'Despublicar' : 'Publicar'}</span>
                          </Button>

                          {/* Editar */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(caseItem)}
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            title="Editar case"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          {/* Excluir */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actionLoadingId === caseItem.id}
                            onClick={() => handleDelete(caseItem)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Excluir case"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Criar / Editar Case — rola internamente, header/rodapé sempre visíveis */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100 animate-fade-in-up">
            <div className="flex items-center justify-between px-6 py-4 sm:px-8 border-b border-slate-100 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-600 block">
                  {editingCase ? 'Editar Projeto' : 'Novo Projeto Delfos'}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingCase ? 'Editor Completo do Projeto' : 'Cadastrar Novo Projeto'}
                </h3>
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

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto space-y-4 p-6 sm:p-8 overscroll-contain"
            >
              {/* Título & Cliente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Título do Projeto *</label>
                  <Input
                    value={titulo}
                    onChange={(e) => handleTituloChange(e.target.value)}
                    placeholder="Ex: Indra Sistemas e Engenharia"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Cliente *</label>
                  <Input
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Ex: Indra Sistemas"
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Slug (URL amigável) *</label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="indra-sistemas-engenharia-erechim"
                    required
                    className="rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Setor / Segmento *</label>
                  <select
                    value={setor}
                    onChange={(e) => setSetor(e.target.value as CaseSetor)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    {SETORES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Solução Técnica</label>
                  <select
                    value={solucao}
                    onChange={(e) => setSolucao(e.target.value as CaseSolucao)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    {SOLUCOES.map((sol) => (
                      <option key={sol} value={sol}>
                        {sol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Localização</label>
                  <Input
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    placeholder="Ex: Erechim / RS (Autorizado) · com bairro: Centro, Erechim / RS"
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Escopo & Potência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Escopo do Projeto</label>
                  <Input
                    value={escopo}
                    onChange={(e) => setEscopo(e.target.value)}
                    placeholder="Ex: 9,75 kWp Projeto e Instalação Solar em telhado metálico"
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Potência / Capacidade</label>
                  <Input
                    value={potenciaCapacidade}
                    onChange={(e) => setPotenciaCapacidade(e.target.value)}
                    placeholder="Ex: 9,75 kWp, 250 kWh, 6 Wallbox DLM"
                    className="rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Desafio e Solução */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Desafio Inicial / Descrição
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={2}
                  placeholder="Qual o problema que o cliente enfrentava antes de contratar a Delfos?"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Solução Técnica de Engenharia Delfos
                </label>
                <textarea
                  value={solucaoTecnica}
                  onChange={(e) => setSolucaoTecnica(e.target.value)}
                  rows={2}
                  placeholder="Detalhes dos equipamentos instalados, inversores, homologação RGE, etc."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                />
              </div>

              {/* Resultado Medido */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-900">Valor em Destaque *</label>
                  <Input
                    value={resultadoValor}
                    onChange={(e) => setResultadoValor(e.target.value)}
                    placeholder="Ex: 91%, R$ 14.500/mês"
                    required
                    className="rounded-xl font-black text-emerald-950 bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-emerald-900">Label do Resultado</label>
                  <Input
                    value={resultadoLabel}
                    onChange={(e) => setResultadoLabel(e.target.value)}
                    placeholder="Ex: Economia média auditada na fatura"
                    className="rounded-xl text-xs bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-bold text-emerald-900">
                    Descrição Completa do Resultado Medido
                  </label>
                  <Input
                    value={resultado}
                    onChange={(e) => setResultado(e.target.value)}
                    placeholder="Ex: Redução média de 91% na fatura mensal de energia elétrica com payback de 3,2 anos"
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
              </div>

              {/* Seção Fotos do Projeto — Vínculo direto Projeto ↔ Fotos */}
              {editingCase ? (
                <div className="space-y-3 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div>
                      <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-solar-600" />
                        Fotos do Projeto ({projectPhotos.length})
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        A primeira foto é a capa do projeto. A ordem abaixo define a galeria do
                        modal público.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-midnight-950 text-white hover:bg-midnight-900 text-xs font-bold cursor-pointer transition-colors shadow-xs">
                        <Upload className="w-3.5 h-3.5 text-solar-400" />
                        <span>{uploadingDirectPhoto ? 'Enviando...' : 'Adicionar Foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingDirectPhoto}
                          onChange={handleDirectPhotoUpload}
                          className="hidden"
                        />
                      </label>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPickerMode('galeria')
                          setPickerOpen(true)
                        }}
                        className="rounded-xl text-xs h-8 border-solar-400/60 text-solar-700 hover:bg-solar-50"
                      >
                        <FolderOpen className="w-3.5 h-3.5 mr-1" />
                        Escolher da Biblioteca
                      </Button>
                    </div>
                  </div>

                  {loadingPhotos ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      <div className="w-5 h-5 border-2 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Carregando fotos vinculadas...
                    </div>
                  ) : projectPhotos.length === 0 ? (
                    <div className="p-6 text-center rounded-xl bg-white/80 border border-dashed border-slate-300">
                      <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">
                        Nenhuma foto vinculada diretamente
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Adicione uma foto por upload ou escolha da Biblioteca de Mídia para compor a
                        galeria pública.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {projectPhotos.map((photo, index) => {
                        const isCapa = index === 0
                        return (
                          <div
                            key={photo.id}
                            className={`relative group bg-white rounded-xl border overflow-hidden transition-all shadow-xs ${
                              isCapa ? 'ring-2 ring-solar-500 border-solar-400' : 'border-slate-200'
                            }`}
                          >
                            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                              <img
                                src={getMediaFileUrl(photo, 'media')}
                                alt={photo.titulo || `Foto ${index + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {isCapa && (
                                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-solar-400 text-midnight-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  Capa
                                </div>
                              )}

                              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                                #{index + 1}
                              </div>
                            </div>

                            <div className="p-2 space-y-1">
                              <p
                                className="text-[11px] font-bold text-slate-800 truncate"
                                title={photo.titulo}
                              >
                                {photo.titulo || 'Sem título'}
                              </p>
                              {photo.potencia && (
                                <p className="text-[10px] text-slate-500 font-mono">
                                  {photo.potencia} kWp
                                </p>
                              )}

                              {/* Ações: subir, descer, excluir */}
                              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                <div className="flex items-center gap-0.5">
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => handleMovePhoto(index, 'up')}
                                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                    title="Mover para a esquerda / cima"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={index === projectPhotos.length - 1}
                                    onClick={() => handleMovePhoto(index, 'down')}
                                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                    title="Mover para a direita / baixo"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveProjectPhoto(photo.id)}
                                  className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Remover foto do projeto"
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
                </div>
              ) : (
                /* Para novo projeto ainda não salvo: foto de capa inicial */
                <div className="space-y-2 p-4 bg-frost rounded-2xl border border-slate-200/80">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-solar-600" />
                    Foto de Capa Inicial (opcional)
                  </label>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Você pode subir a foto principal agora. Após salvar o projeto, você poderá
                    adicionar mais fotos e ordenar a galeria.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-midnight-950 file:text-white hover:file:bg-midnight-900 cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPickerMode('capa')
                        setPickerOpen(true)
                      }}
                      disabled={pickerLoadingId !== null}
                      className="rounded-xl text-xs h-9 border-solar-400/60 text-solar-700 hover:bg-solar-50 shrink-0 w-full sm:w-auto"
                      title="Escolher a capa entre as fotos já enviadas na Biblioteca de Mídia"
                    >
                      <FolderOpen className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      {pickerLoadingId ? 'Carregando foto...' : 'Usar foto da biblioteca'}
                    </Button>
                    {fotoPreview && (
                      <div className="relative">
                        <img
                          src={fotoPreview}
                          alt="Preview"
                          className="w-20 h-14 object-cover rounded-xl border border-slate-300 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={handleRemoverFoto}
                          title="Remover foto"
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Data Entrega, Status & Destaque */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Data de Entrega</label>
                  <Input
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                    placeholder="Ex: Novembro / 2024"
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CaseStatus)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    <option value="publicado">Publicado (visível no site)</option>
                    <option value="rascunho">Rascunho (oculto no site)</option>
                  </select>
                </div>

                <div className="pt-5 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="destaque-check"
                    checked={destaque}
                    onChange={(e) => setDestaque(e.target.checked)}
                    className="w-4 h-4 rounded text-solar-500 focus:ring-solar-400"
                  />
                  <label
                    htmlFor="destaque-check"
                    className="text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Marcar como Destaque
                  </label>
                </div>
              </div>

              {/* Opção para Case Exemplo de Aplicação */}
              <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-200/80 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="exemplo-check"
                  checked={isExemplo}
                  onChange={(e) => setIsExemplo(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <label
                    htmlFor="exemplo-check"
                    className="text-xs font-bold text-cyan-950 cursor-pointer block"
                  >
                    Marcar como Exemplo de Aplicação (ilustrativo)
                  </label>
                  <p className="text-[11px] text-cyan-800 leading-relaxed mt-0.5">
                    Exibe a badge &ldquo;Exemplo de aplicação&rdquo; nos cards e modais para fins
                    educativos/referenciais. Desmarque para converter em case real com métricas
                    oficiais.
                  </p>
                </div>
              </div>

              {/* Botões do Rodapé — sempre visíveis fora da área rolável */}
              <div className="sticky bottom-0 -mx-6 sm:-mx-8 px-6 sm:px-8 pt-4 pb-2 bg-white/95 backdrop-blur border-t border-slate-100 flex items-center justify-end gap-3">
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
                  {submitting ? 'Salvando...' : editingCase ? 'Atualizar Projeto' : 'Criar Projeto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Picker de foto da Biblioteca de Mídia */}
      {pickerOpen && (
        <MediaLibraryPicker
          mediaList={mediaList}
          casesList={cases}
          contextTerm={cliente || titulo}
          onSelect={handleSelectMediaFoto}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
