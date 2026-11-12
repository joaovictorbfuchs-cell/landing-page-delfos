import { useState, useRef, useMemo } from 'react'
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
  CheckSquare,
  Edit2,
  Image as ImageIcon,
  Sparkles,
  Link2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Eye,
  Layers,
  Award,
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
  TipoObraGaleria,
} from '@/types/content'
import {
  createMedia,
  updateMedia,
  updateMediaGaleria,
  deleteMedia,
  getMediaFileUrl,
  updateCase,
  createCase,
  simularLimpezaDuplicadas,
  executarLimpezaDuplicadas,
  attachMediaToCase,
  type LimparDuplicadasResponse,
} from '@/services/content'
import AdminBatchMediaModal from './AdminBatchMediaModal'
import AdminAutoVinculoModal from './AdminAutoVinculoModal'
import SeloVinculoMedia from './SeloVinculoMedia'
import LimpezaMiniatura from './LimpezaMiniatura'
import AcoesLimpezaItem, { type DecisaoLimpeza } from './AcoesLimpezaItem'
import AdminMediaFiltroVinculo, { type FiltroVinculo } from './AdminMediaFiltroVinculo'
import { comprimirImagem } from './imageCompress'
import {
  formatFilenameToTitle,
  findMatchingCase,
  buildDestinoSugerido,
  classificarVinculoMedia,
  statusVinculoMedia,
  type ItemVinculacaoPendente,
  type StatusVinculoMedia,
} from './mediaMatchUtils'
import { fetchMediaAsFile, deriveCaseFromMedia, gerarSlugUnico } from './mediaCaseUtils'
import type { CaseSetor, CaseSolucao } from '@/types/content'

const MEDIA_CATEGORIAS: MediaCategoria[] = [
  'Geral',
  'Solar',
  'BESS Baterias',
  'O&M Manutenção',
  'Carregadores',
  'Segmentos',
  'Equipe e Empresa',
]

const TIPOS_PROJETO: TipoObraGaleria[] = [
  'Telhado industrial',
  'Telhado comercial',
  'Telhado residencial',
  'Usina de solo',
  'Solo rural',
  'Carport',
  'BESS',
  'Carregadores',
  'O&M',
]

/** Estado inicial dos campos da galeria pública (/projetos) */
const GALERIA_VAZIA = {
  cidade: '',
  bairro: '',
  uf: '',
  potencia: '',
  tipo_obra: '' as TipoObraGaleria | '',
  alt_texto: '',
  publicado_galeria: false,
  destaque_galeria: false,
}

interface AdminMediaTabProps {
  mediaList: MediaRecord[]
  casesList?: CaseRecord[]
  loading: boolean
  onRefresh: () => void
  /** Abre o editor de um projeto na aba Projetos (atalho pedido pelo dono) */
  onAbrirEditorCase?: (caseId: string) => void
}

export default function AdminMediaTab({
  mediaList,
  casesList = [],
  loading,
  onRefresh,
  onAbrirEditorCase,
}: AdminMediaTabProps) {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<string>('todos')
  const [modalOpen, setModalOpen] = useState(false) // Modal de upload único (legado/compatibilidade)
  const [batchModalOpen, setBatchModalOpen] = useState(false) // Modal de upload múltiplo (novo)
  const [batchInitialFiles, setBatchInitialFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [virandoCaseId, setVirandoCaseId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const filePickerRef = useRef<HTMLInputElement>(null)

  // Modo de seleção múltipla: checkbox em cada card + ação "Criar projeto com selecionadas"
  const [selecaoAtiva, setSelecaoAtiva] = useState(false)
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const toggleSelecao = (id: string) => {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }
  const toggleSelecaoAtiva = () => {
    if (selecaoAtiva) {
      setSelecaoAtiva(false)
      setSelecionadas([])
    } else {
      setSelecaoAtiva(true)
    }
  }
  // Seleção é limitada às fotos visíveis pelos filtros atuais
  const selecionadasVisiveis = selecionadas.filter((id) => filteredMedia.some((m) => m.id === id))

  // Edit State & Modal
  // Campos da galeria pública de projetos
  const [editGaleria, setEditGaleria] = useState(GALERIA_VAZIA)

  const [editingItem, setEditingItem] = useState<MediaRecord | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editCategoria, setEditCategoria] = useState<MediaCategoria>('Geral')
  const [editDescricao, setEditDescricao] = useState('')
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
  // Decisões foto a foto dentro do modal: 'excluir' | 'manter' (por id de mídia)
  const [decisoesLimpeza, setDecisoesLimpeza] = useState<Record<string, DecisaoLimpeza>>({})

  // Contagem de decisões do dono (Revisar com decisão conta para o botão final)
  const totalDecisoesApagar = useMemo(
    () => Object.values(decisoesLimpeza).filter((d) => d === 'excluir').length,
    [decisoesLimpeza],
  )

  // Vinculação automática de fotos a projetos (pelo nome do arquivo)
  const [vinculando, setVinculando] = useState(false)
  const [vincModalOpen, setVincModalOpen] = useState(false)
  const [itensRevisao, setItensRevisao] = useState<ItemVinculacaoPendente[]>([])

  // Filtro rápido por status de vínculo (Todas / Sem vínculo / Rascunho / Publicadas)
  const [filtroVinculo, setFiltroVinculo] = useState<FiltroVinculo>('todas')

  // Upload Form
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState<MediaCategoria>('Geral')
  const [descricao, setDescricao] = useState('')
  const [arquivoFile, setArquivoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleAbrirLimpeza = async () => {
    setLimpezaModalOpen(true)
    setCarregandoLimpeza(true)
    setDecisoesLimpeza({})
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

  const handleDecidirItemLimpeza = (id: string, decisao: DecisaoLimpeza) => {
    setDecisoesLimpeza((prev) => {
      const atual = prev[id]
      // Clicar de novo no mesmo botão desfaz a decisão daquela foto
      if (atual === decisao) {
        const { [id]: _removida, ...resto } = prev
        return resto
      }
      return { ...prev, [id]: decisao }
    })
  }

  const handleConfirmarLimpeza = async () => {
    if (!resultadoLimpeza) return
    const idsMarcadosApagar = Object.entries(decisoesLimpeza)
      .filter(([, decisao]) => decisao === 'excluir')
      .map(([id]) => id)
    const idsMarcadosManter = Object.entries(decisoesLimpeza)
      .filter(([, decisao]) => decisao === 'manter')
      .map(([id]) => id)

    // Modo foto a foto: só quando o dono decidiu algo, envia exatamente essa lista
    // para o backend; fotos sem decisão seguem o comportamento padrão.
    const idsExcluir = idsMarcadosApagar.length
      ? resultadoLimpeza.detalhes.paraExcluir
          .concat(resultadoLimpeza.detalhes.paraRevisar)
          .filter(
            (item) => idsMarcadosManter.includes(item.id) || idsMarcadosApagar.includes(item.id),
          )
          .map((item) => item.id)
          .filter((id) => !idsMarcadosManter.includes(id))
          .concat(idsMarcadosApagar)
      : undefined
    const listaUnica = idsExcluir ? Array.from(new Set(idsExcluir)) : undefined

    setExecutandoLimpeza(true)
    try {
      const res = await executarLimpezaDuplicadas(listaUnica)
      setResultadoLimpeza(res)
      setDecisoesLimpeza({})
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
    setArquivoFile(null)
    setPreview(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (item: MediaRecord) => {
    setEditingItem(item)
    setEditTitulo(item.titulo || '')
    setEditCategoria(item.categoria || 'Geral')
    setEditDescricao(item.descricao || '')
    setEditArquivoFile(null)
    setEditPreview(null)
    // Carrega os dados já preenchidos da galeria (migração 0032 preencheu
    // cidade/potência a partir do nome do arquivo; o dono ajusta o resto).
    setEditGaleria({
      cidade: item.cidade || '',
      bairro: item.bairro || '',
      uf: item.uf || '',
      potencia: item.potencia || '',
      tipo_obra: item.tipo_obra || '',
      alt_texto: item.alt_texto || '',
      publicado_galeria: Boolean(item.publicado_galeria),
      destaque_galeria: Boolean(item.destaque_galeria),
    })

    // Se a foto já tem case_id vinculado, usar diretamente; senão sugerir casamento
    const matchCase =
      (item.case_id ? casesList.find((c) => c.id === item.case_id) : null) ||
      findMatchingCase(item.destino_sugerido || '', casesList) ||
      findMatchingCase(item.titulo || '', casesList) ||
      findMatchingCase(item.arquivo || '', casesList)
    setEditCaseId(item.case_id || (matchCase ? matchCase.id : ''))
  }

  const handleCloseEdit = () => {
    setEditingItem(null)
    setEditArquivoFile(null)
    setEditPreview(null)
  }

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Compressão automática (máx. 1600px, WebP) antes de enviar
      const comprimido = await comprimirImagem(file)
      setEditArquivoFile(comprimido)
      setEditPreview(URL.createObjectURL(comprimido))
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

    // Trava da galeria: publicar sem cidade e potência deixaria a foto competindo
    // como "imagem solta" no Google, sem valor de SEO local. Melhor barrar no painel.
    if (
      editGaleria.publicado_galeria &&
      (!editGaleria.cidade.trim() || !editGaleria.potencia.trim())
    ) {
      toast({
        variant: 'destructive',
        title: 'Faltam dados do projeto',
        description:
          'Para publicar na galeria, informe pelo menos a cidade e a potência. Sem elas a foto não aparece em Projetos Realizados (/projetos).',
      })
      return
    }

    setSavingEdit(true)
    try {
      // 1. Atualizar registro em media com vínculo direto de case_id
      let arquivoFinal = editArquivoFile
      if (arquivoFinal) {
        // Compressão automática (máx. 1600px, WebP) antes de enviar
        arquivoFinal = await comprimirImagem(arquivoFinal)
      }
      const payload: UpdateMediaPayload = {
        titulo: editTitulo.trim(),
        categoria: editCategoria,
        descricao: editDescricao.trim(),
        case_id: editCaseId || '',
      }
      if (arquivoFinal) {
        payload.arquivo = arquivoFinal
      }

      await updateMedia(editingItem.id, payload)

      // 1b. Publicação na galeria — título e descrição únicos (os mesmos do card)
      await updateMediaGaleria(editingItem.id, {
        cidade: editGaleria.cidade,
        bairro: editGaleria.bairro,
        uf: editGaleria.uf,
        potencia: editGaleria.potencia,
        tipo_obra: editGaleria.tipo_obra,
        alt_texto: editGaleria.alt_texto,
        obra_titulo: editTitulo.trim(),
        obra_descricao: editDescricao.trim(),
        publicado_galeria: editGaleria.publicado_galeria,
        destaque_galeria: editGaleria.destaque_galeria,
      })

      // 2. Se o usuário vinculou ou trocou a imagem no case selecionado e forneceu novo arquivo
      if (editCaseId && arquivoFinal) {
        await updateCase(editCaseId, { foto: arquivoFinal })
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
        const formattedTitle = formatFilenameToTitle(file.name)
        setTitulo(formattedTitle)
      }
    }
  }

  // Gatilho rápido ao escolher arquivos múltiplos pelo botão principal
  const handleQuickMultipleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      if (filesArray.length > 1) {
        // Se selecionou múltiplos, abre direto o modal de lote
        setBatchInitialFiles(filesArray)
        setBatchModalOpen(true)
      } else if (filesArray.length === 1) {
        // Se selecionou apenas 1, abre o modal de lote já com ele (ou o usuário pode usar normalmente)
        setBatchInitialFiles(filesArray)
        setBatchModalOpen(true)
      }
    }
    if (e.target) {
      e.target.value = ''
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
      // Compressão automática (máx. 1600px, WebP) antes de enviar
      const arquivoComprimido = await comprimirImagem(arquivoFile)
      const payload: CreateMediaPayload = {
        titulo: titulo.trim(),
        arquivo: arquivoComprimido,
        categoria,
        descricao: descricao.trim(),
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

  // Vinculação automática: varre fotos sem projeto e vincula as confiáveis pelo
  // nome do arquivo; duvidosas vão para o modal de revisão. NUNCA descarta mídia.
  const handleVincularAutomatico = async () => {
    setVinculando(true)
    try {
      const semVinculo = mediaList.filter((m) => !m.case_id)
      const projetosPublicados = casesList.filter((c) => c.status === 'publicado')
      const vinculadas: ItemVinculacaoPendente[] = []
      const duvidosas: ItemVinculacaoPendente[] = []

      for (const media of semVinculo) {
        const { nivel, candidatos } = classificarVinculoMedia(media, projetosPublicados)
        if (nivel === 'confiavel') {
          const alvo = candidatos[0]
          try {
            await attachMediaToCase(media.id, alvo.id)
            vinculadas.push({
              media,
              candidatos,
              motivo: `Casou com "${alvo.cliente || alvo.titulo}" pelo nome do arquivo`,
            })
          } catch (err) {
            console.warn(`Falha ao vincular mídia ${media.id}:`, err)
            duvidosas.push({
              media,
              candidatos,
              motivo: 'Falha ao salvar o vínculo — confirme manualmente abaixo',
            })
          }
        } else if (candidatos.length > 1) {
          duvidosas.push({
            media,
            candidatos,
            motivo: 'Nome do arquivo casou com mais de um projeto — escolha o correto',
          })
        } else {
          duvidosas.push({
            media,
            candidatos: [],
            motivo: 'Nenhum projeto casou com o nome do arquivo — vincule manualmente ou ignore',
          })
        }
      }

      setItensRevisao(duvidosas)
      setVincModalOpen(true)
      if (vinculadas.length > 0) {
        onRefresh()
        toast({
          title: `${vinculadas.length} ${vinculadas.length === 1 ? 'foto vinculada' : 'fotos vinculadas'} automaticamente`,
          description:
            'Os vínculos projeto↔foto foram criados. As fotos duvidosas estão aguardando sua revisão no modal.',
        })
      } else if (duvidosas.length === 0) {
        toast({
          title: 'Nada a vincular',
          description: 'Todas as fotos já estão vinculadas a um projeto.',
        })
      }
    } finally {
      setVinculando(false)
    }
  }

  /**
   * Cria um projeto (case) em rascunho a partir de uma mídia da biblioteca —
   * MESMA lógica do botão "Criar projeto" foto a foto: título, cliente e local
   * derivados do nome do arquivo e casamento com projeto existente.
   * Usada tanto pelo botão individual quanto pelo "Criar projeto com selecionadas".
   */
  const criarCaseDeMedia = async (item: MediaRecord): Promise<CaseRecord> => {
    const original = await fetchMediaAsFile(item)
    // Compressão automática (máx. 1600px, WebP) antes de enviar
    const file = await comprimirImagem(original)
    if (!file) {
      throw new Error('Não foi possível obter o arquivo desta mídia.')
    }

    const derivado = deriveCaseFromMedia(item)
    const matchCase = findMatchingCase(item.arquivo || item.titulo, casesList)
    if (matchCase) {
      derivado.cliente = matchCase.cliente || derivado.cliente
      derivado.local = matchCase.local || derivado.local
      derivado.titulo = matchCase.titulo || derivado.titulo
    }

    const setor: CaseSetor = 'Comércio e Serviços'
    const solucao: CaseSolucao = 'Energia Solar'
    const slug = gerarSlugUnico(derivado.slugBase, casesList)

    const caseCriado = await createCase({
      titulo: derivado.titulo,
      slug,
      cliente: derivado.cliente,
      setor,
      solucao,
      local: derivado.local || 'Erechim / RS',
      escopo: '',
      descricao: '',
      solucao_tecnica: '',
      resultado: '',
      resultado_valor: '',
      resultado_label: '',
      potencia_capacidade: '',
      data_entrega: '',
      // Case nasce em rascunho para o usuário revisar antes de publicar —
      // nunca publicado automaticamente.
      status: 'rascunho',
      destaque: false,
      is_exemplo: false,
      foto: file,
    })

    // Capa criada: a mídia de origem vira capa oficial (case_id) e o restante
    // das fotos selecionadas entra na galeria do projeto (ordem crescente).
    await attachMediaToCase(item.id, caseCriado.id, 1)
    const demais = selecionadas.filter((id) => id !== item.id)
    for (let i = 0; i < demais.length; i++) {
      await attachMediaToCase(demais[i], caseCriado.id, i + 2)
    }

    return caseCriado
  }

  /**
   * Ação em lote "Criar projeto com selecionadas": cria UM único projeto em
   * rascunho usando a MESMA lógica do "Criar projeto" individual — a primeira
   * foto da seleção vira capa e as demais vão para a galeria dele.
   */
  const handleCriarCaseComSelecionadas = async () => {
    if (selecionadas.length === 0) return
    if (
      !window.confirm(
        `Criar 1 projeto em rascunho com as ${selecionadas.length} fotos selecionadas? A primeira vira capa e as demais entram na galeria.`,
      )
    ) {
      return
    }

    const ordenadas = selecionadas
      .map((id) => mediaList.find((m) => m.id === id))
      .filter((m): m is MediaRecord => Boolean(m))

    setVirandoCaseId('__lote__')
    try {
      const caseCriado = await criarCaseDeMedia(ordenadas[0])
      const { dismiss: fecharToast } = toast({
        title: 'Projeto criado em rascunho!',
        description: `"${caseCriado.titulo}" foi criado com ${ordenadas.length} ${ordenadas.length === 1 ? 'foto' : 'fotos'} (a primeira como capa). Revise os dados e publique quando estiver pronto.`,
        duration: 12000,
        action: (
          <button
            type="button"
            onClick={() => {
              onAbrirEditorCase?.(caseCriado.id)
              fecharToast()
            }}
            className="inline-flex shrink-0 items-center gap-1 h-9 px-3 rounded-lg bg-solar-400 hover:bg-solar-500 text-midnight-950 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Abrir projeto</span>
          </button>
        ),
      })
      setSelecaoAtiva(false)
      setSelecionadas([])
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao criar projeto com fotos selecionadas:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao criar projeto',
        description:
          (err as Error)?.message || 'Não foi possível criar o projeto com as fotos selecionadas.',
      })
    } finally {
      setVirandoCaseId(null)
    }
  }

  // "Criar projeto": cria um case novo (sempre em rascunho) já com a foto da
  // biblioteca como capa, título, cliente e local derivados do nome do arquivo
  // (padrão cliente_cidade.jpg), usando a mesma lógica de casamento do lote.
  const handleVirarCase = async (item: MediaRecord) => {
    setVirandoCaseId(item.id)
    try {
      const original = await fetchMediaAsFile(item)
      // Compressão automática (máx. 1600px, WebP) antes de enviar
      const file = await comprimirImagem(original)
      if (!file) {
        toast({
          variant: 'destructive',
          title: 'Foto indisponível',
          description: 'Não foi possível obter o arquivo desta mídia.',
        })
        return
      }

      const derivado = deriveCaseFromMedia(item)
      const matchCase = findMatchingCase(item.arquivo || item.titulo, casesList)
      if (matchCase) {
        derivado.cliente = matchCase.cliente || derivado.cliente
        derivado.local = matchCase.local || derivado.local
        derivado.titulo = matchCase.titulo || derivado.titulo
      }

      const setor: CaseSetor = 'Comércio e Serviços'
      const solucao: CaseSolucao = 'Energia Solar'
      const slug = gerarSlugUnico(derivado.slugBase, casesList)

      const caseCriado = await createCase({
        titulo: derivado.titulo,
        slug,
        cliente: derivado.cliente,
        setor,
        solucao,
        local: derivado.local || 'Erechim / RS',
        escopo: '',
        descricao: '',
        solucao_tecnica: '',
        resultado: '',
        resultado_valor: '',
        resultado_label: '',
        potencia_capacidade: '',
        data_entrega: '',
        // Case nasce em rascunho para o usuário revisar antes de publicar —
        // nunca publicado automaticamente.
        status: 'rascunho',
        destaque: false,
        is_exemplo: false,
        foto: file,
      })

      // Aviso com atalho direto ao editor do projeto recém-criado
      const { dismiss: fecharToast } = toast({
        title: 'Projeto criado em rascunho!',
        description: `"${derivado.titulo}" foi criado com esta foto como capa. Revise os dados e publique quando estiver pronto.`,
        duration: 12000,
        action: (
          <button
            type="button"
            onClick={() => {
              onAbrirEditorCase?.(caseCriado.id)
              fecharToast()
            }}
            className="inline-flex shrink-0 items-center gap-1 h-9 px-3 rounded-lg bg-solar-400 hover:bg-solar-500 text-midnight-950 text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Abrir projeto</span>
          </button>
        ),
      })
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao criar case a partir da mídia:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao criar projeto',
        description:
          (err as Error)?.message || 'Não foi possível criar o projeto a partir desta foto.',
      })
    } finally {
      setVirandoCaseId(null)
    }
  }

  // Status de vínculo calculado uma única vez por foto (selo + filtros rápidos)
  const statusPorId = useMemo(() => {
    const mapa = new Map<string, StatusVinculoMedia>()
    mediaList.forEach((m) => mapa.set(m.id, statusVinculoMedia(m, casesList)))
    return mapa
  }, [mediaList, casesList])

  // Contagem por filtro (com 'todas' incluída) para os chips do topo
  const contagemFiltros = useMemo(() => {
    const contagem: Partial<Record<FiltroVinculo, number>> = { todas: mediaList.length }
    statusPorId.forEach((st) => (contagem[st] = (contagem[st] || 0) + 1))
    return contagem
  }, [mediaList, statusPorId])

  // Abre o editor do projeto vinculado na aba Projetos (atalho do selo de status)
  const handleAbrirProjetoDoSelo = (caseId: string) => {
    if (!onAbrirEditorCase) return
    if (!casesList.some((c) => c.id === caseId)) {
      toast({
        variant: 'destructive',
        title: 'Projeto não encontrado',
        description:
          'O projeto vinculado a esta foto não existe mais. Use o modal de edição da foto para rever o vínculo.',
      })
      return
    }
    onAbrirEditorCase(caseId)
  }

  const filteredMedia = mediaList.filter((m) => {
    const matchCat = filterCat === 'todos' || m.categoria === filterCat
    const matchVinculo = filtroVinculo === 'todas' || statusPorId.get(m.id) === filtroVinculo
    const term = search.toLowerCase()
    const matchSearch =
      !term ||
      m.titulo.toLowerCase().includes(term) ||
      (m.descricao && m.descricao.toLowerCase().includes(term)) ||
      (m.destino_sugerido && m.destino_sugerido.toLowerCase().includes(term))
    return matchCat && matchVinculo && matchSearch
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
            Suba fotos reais de projetos, usinas, baterias BESS e equipamentos uma única vez. Elas
            ficam armazenadas com URL permanente e pronta para substituir os placeholders nas
            páginas de soluções e segmentos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            onClick={handleVincularAutomatico}
            disabled={vinculando}
            className="bg-midnight-800 hover:bg-midnight-900 text-white font-bold rounded-xl shadow-sm text-xs h-10 px-3.5 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
            title="Vincula automaticamente as fotos soltas aos projetos publicados, pelo nome do arquivo"
          >
            {vinculando ? (
              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
            ) : (
              <Link2 className="w-4 h-4 shrink-0" />
            )}
            <span>{vinculando ? 'Vinculando...' : 'Vincular fotos automaticamente'}</span>
          </Button>

          <Button
            type="button"
            onClick={handleAbrirLimpeza}
            variant="outline"
            className="border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 font-bold rounded-xl text-xs h-10 px-3.5 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Limpar duplicadas</span>
          </Button>

          {/* Input oculto com multiple para seleção direta se o usuário quiser disparar a partir do botão */}
          <input
            ref={filePickerRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleQuickMultipleSelect}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={toggleSelecaoAtiva}
            className={
              selecaoAtiva
                ? 'border-midnight-800 bg-midnight-900 text-white font-bold rounded-xl text-xs h-10 px-3.5 flex-1 sm:flex-initial flex items-center justify-center gap-1.5'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs h-10 px-3.5 flex-1 sm:flex-initial flex items-center justify-center gap-1.5'
            }
            title="Ativa o modo de seleção para escolher várias fotos e criar um projeto com elas"
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            <span>{selecaoAtiva ? 'Sair da seleção' : 'Selecionar'}</span>
          </Button>

          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
            <Button
              type="button"
              onClick={() => {
                setBatchInitialFiles([])
                setBatchModalOpen(true)
              }}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shadow-sm text-xs h-10 px-3.5 flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
              title="Enviar várias fotos simultaneamente com título automático e sugestão de case"
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              <span>Upload Múltiplo</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleOpenUpload}
              className="border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs h-10 px-2.5 hidden sm:inline-flex items-center justify-center"
              title="Upload tradicional de arquivo único"
            >
              Único
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, projeto ou descrição..."
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

      {/* Filtros rápidos por status de vínculo */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm flex items-center gap-2">
        <AdminMediaFiltroVinculo
          filtro={filtroVinculo}
          onFiltroChange={setFiltroVinculo}
          contagem={contagemFiltros}
        />
      </div>

      {/* Barra do modo de seleção (fixa no mobile) */}
      {selecaoAtiva && (
        <div className="sticky top-2 z-30 bg-midnight-950 rounded-2xl p-3 shadow-lg flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 text-xs sm:text-sm text-white font-semibold pl-1">
            {selecionadasVisiveis.length}{' '}
            {selecionadasVisiveis.length === 1 ? 'foto selecionada' : 'fotos selecionadas'}
            {selecionadas.length !== selecionadasVisiveis.length && (
              <span className="text-slate-400 font-normal">
                {' '}
                ({selecionadas.length - selecionadasVisiveis.length} fora dos filtros)
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelecionadas([])}
              disabled={selecionadas.length === 0 || virandoCaseId !== null}
              className="flex-1 sm:flex-initial h-11 sm:h-10 px-3.5 border-midnight-700 bg-transparent hover:bg-midnight-800 text-slate-200 text-xs font-semibold rounded-xl"
            >
              Limpar seleção
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelecaoAtiva(false)
                setSelecionadas([])
              }}
              disabled={virandoCaseId !== null}
              className="flex-1 sm:flex-initial h-11 sm:h-10 px-3.5 border-midnight-700 bg-transparent hover:bg-midnight-800 text-slate-200 text-xs font-semibold rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCriarCaseComSelecionadas}
              disabled={selecionadas.length === 0 || virandoCaseId !== null}
              className="flex-1 sm:flex-initial h-11 sm:h-10 px-3.5 bg-solar-400 hover:bg-solar-500 text-midnight-950 text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5"
            >
              {virandoCaseId === '__lote__' ? (
                <div className="w-4 h-4 border-2 border-midnight-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Award className="w-4 h-4 shrink-0" />
              )}
              <span>Criar projeto com selecionadas</span>
            </Button>
          </div>
        </div>
      )}

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
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button
                onClick={() => {
                  setBatchInitialFiles([])
                  setBatchModalOpen(true)
                }}
                className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl h-10 px-4"
              >
                <Layers className="w-4 h-4 mr-1.5" />
                Upload Múltiplo de Fotos
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenUpload}
                className="rounded-xl text-xs h-10 px-4"
              >
                Upload Individual
              </Button>
            </div>
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
                className={
                  'bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all group ' +
                  (selecaoAtiva && selecionadas.includes(item.id)
                    ? 'border-solar-500 ring-2 ring-solar-400/60 '
                    : 'border-slate-200/90 hover:border-solar-400')
                }
              >
                <div>
                  {/* Image container - usa versão leve (900px) com fallback */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {selecaoAtiva && (
                      <button
                        type="button"
                        onClick={() => toggleSelecao(item.id)}
                        aria-label={
                          selecionadas.includes(item.id)
                            ? 'Desmarcar foto da seleção'
                            : 'Marcar foto para seleção'
                        }
                        aria-pressed={selecionadas.includes(item.id)}
                        className="absolute top-2 right-2 z-10 h-9 w-9 rounded-full bg-midnight-950/70 backdrop-blur-xs flex items-center justify-center cursor-pointer hover:bg-midnight-950/90 active:scale-95 transition-transform"
                      >
                        <span
                          className={
                            'flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ' +
                            (selecionadas.includes(item.id)
                              ? 'border-solar-400 bg-solar-400'
                              : 'border-white/80 bg-transparent')
                          }
                        >
                          {selecionadas.includes(item.id) && (
                            <Check className="w-4 h-4 text-midnight-950" strokeWidth={3.5} />
                          )}
                        </span>
                      </button>
                    )}
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
                    <SeloVinculoMedia
                      media={item}
                      casesList={casesList}
                      onAbrirProjeto={onAbrirEditorCase ? handleAbrirProjetoDoSelo : undefined}
                      className="absolute bottom-2 left-2 shadow-sm backdrop-blur-[2px]"
                    />
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
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                  <Button
                    size="sm"
                    disabled={virandoCaseId === item.id}
                    onClick={() => handleVirarCase(item)}
                    className="w-full text-[11px] h-8 px-2 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-lg shadow-sm flex items-center justify-center gap-1"
                    title="Criar um projeto novo em rascunho usando esta foto como capa (título e local vêm do nome do arquivo)"
                  >
                    {virandoCaseId === item.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-midnight-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Award className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {virandoCaseId === item.id ? 'Criando projeto...' : 'Criar projeto'}
                    </span>
                  </Button>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyUrl(item)}
                      className="text-[11px] h-7 px-2 text-slate-600 hover:text-slate-900 flex items-center gap-1 hidden sm:flex"
                      title="Copiar URL direta da foto"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{isCopied ? 'Copiado!' : 'URL'}</span>
                    </Button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] my-auto">
            <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 sm:px-8 border-b border-slate-100 bg-white">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-600 block">
                  Editar Imagem da Biblioteca
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                  Editar Detalhes da Imagem
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEdit}
                className="text-slate-400 hover:text-slate-900 shrink-0"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-5 sm:px-8 space-y-4">
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

                {/* Topo: Projeto Vinculado + Publicar (definem a publicação na galeria) */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                    Galeria pública de projetos
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                    <div className="space-y-1 flex-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        Projeto Vinculado
                      </label>
                      <select
                        value={editCaseId}
                        onChange={(e) => {
                          const selectedId = e.target.value
                          setEditCaseId(selectedId)
                          if (selectedId) {
                            const targetCase = casesList.find((c) => c.id === selectedId)
                            if (targetCase) {
                              // Se vinculou a projeto, preencher dados do card caso vazios
                              const partesLocal = (targetCase.local || '').split(/[/-]/)
                              const cid = partesLocal[0]?.trim() || ''
                              const uf = partesLocal[1]?.trim() || 'RS'
                              setEditGaleria((prev) => ({
                                ...prev,
                                publicado_galeria: true,
                                cidade: prev.cidade || cid,
                                uf: prev.uf || uf,
                                potencia: prev.potencia || targetCase.potencia_capacidade || '',
                              }))
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
                    <label className="flex items-center gap-1.5 shrink-0 cursor-pointer sm:pb-2.5">
                      <input
                        type="checkbox"
                        checked={editGaleria.publicado_galeria}
                        onChange={(e) =>
                          setEditGaleria((p) => ({ ...p, publicado_galeria: e.target.checked }))
                        }
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 cursor-pointer"
                      />
                      <span className="text-[11px] font-bold text-slate-700">Publicar</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-amber-900/80 leading-snug">
                    A foto aparece em <strong>/projetos</strong> quando está{' '}
                    <strong>Publicada</strong> e vinculada a um projeto no campo{' '}
                    <strong>Projeto Vinculado</strong>.
                  </p>
                </div>

                {/* Título (único — o mesmo do card) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Título do card *</label>
                  <Input
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    placeholder="Ex: Cassul Distribuidora — usina de 155 kWp"
                    required
                    className="rounded-xl text-xs sm:text-sm"
                  />
                  <p className="text-[11px] text-slate-400">
                    Nome amigável da foto. Evite nomes de clientes que não correspondam ao projeto
                    real.
                  </p>
                </div>

                {/* Categoria */}
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

                {/* Descrição (única — a mesma do card) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Descrição do card</label>
                  <textarea
                    value={editDescricao}
                    onChange={(e) => setEditDescricao(e.target.value)}
                    rows={2}
                    placeholder="Detalhes da foto: tipo de estrutura, módulos solares, ângulo..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  />
                  <p className="text-[10px] text-slate-500">
                    Exibida no card da galeria de projetos, abaixo do título.
                  </p>
                </div>

                {/* Complementos do card (opcionais) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Complementos do card (opcional)
                    </span>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Cidade e potência são obrigatórias para publicar; bairro, UF e tipo completam
                      o card da galeria.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Cidade</label>
                      <Input
                        value={editGaleria.cidade}
                        onChange={(e) => setEditGaleria((p) => ({ ...p, cidade: e.target.value }))}
                        placeholder="Erechim"
                        className="rounded-xl text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">UF</label>
                      <Input
                        value={editGaleria.uf}
                        onChange={(e) => setEditGaleria((p) => ({ ...p, uf: e.target.value }))}
                        placeholder="RS"
                        maxLength={2}
                        className="rounded-xl text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Bairro</label>
                      <Input
                        value={editGaleria.bairro}
                        onChange={(e) => setEditGaleria((p) => ({ ...p, bairro: e.target.value }))}
                        placeholder="Fátima"
                        className="rounded-xl text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Potência</label>
                      <Input
                        value={editGaleria.potencia}
                        onChange={(e) =>
                          setEditGaleria((p) => ({ ...p, potencia: e.target.value }))
                        }
                        placeholder="155,0 kWp"
                        className="rounded-xl text-xs h-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Tipo de projeto</label>
                    <select
                      value={editGaleria.tipo_obra}
                      onChange={(e) =>
                        setEditGaleria((p) => ({
                          ...p,
                          tipo_obra: e.target.value as TipoObraGaleria | '',
                        }))
                      }
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                    >
                      <option value="">Não informado</option>
                      {TIPOS_PROJETO.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Texto alternativo (SEO) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Texto alternativo da foto (SEO)
                  </label>
                  <textarea
                    value={editGaleria.alt_texto}
                    onChange={(e) => setEditGaleria((p) => ({ ...p, alt_texto: e.target.value }))}
                    rows={2}
                    placeholder="Instalação solar fotovoltaica de 155,0 kWp em Erechim/RS — Cassul Distribuidora"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  />
                  <p className="text-[10px] text-slate-500">
                    Deixe em branco para o site gerar automaticamente a partir de cidade, potência e
                    tipo de projeto.
                  </p>
                </div>
              </div>

              {/* Ações — rodapé sempre visível */}
              <div className="shrink-0 px-6 py-4 sm:px-8 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
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

                    <div className="max-h-[28rem] overflow-y-auto divide-y divide-slate-100 p-1">
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
                              <LimpezaMiniatura
                                mediaId={item.id}
                                arquivo={item.arquivo}
                                titulo={item.titulo}
                              />
                              <div className="min-w-0 flex-1">
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
                              <AcoesLimpezaItem
                                contexto="excluir"
                                decisao={decisoesLimpeza[item.id]}
                                disabled={executandoLimpeza}
                                onDecidir={(novaDecisao) =>
                                  handleDecidirItemLimpeza(item.id, novaDecisao)
                                }
                              />
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
                              <LimpezaMiniatura
                                mediaId={item.id}
                                arquivo={item.arquivo}
                                titulo={item.titulo}
                              />
                              <div className="min-w-0 flex-1">
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
                              <AcoesLimpezaItem
                                contexto="revisar"
                                decisao={decisoesLimpeza[item.id]}
                                disabled={executandoLimpeza}
                                onDecidir={(novaDecisao) =>
                                  handleDecidirItemLimpeza(item.id, novaDecisao)
                                }
                              />
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
                              <LimpezaMiniatura
                                mediaId={item.id}
                                arquivo={item.arquivo}
                                titulo={item.titulo}
                              />
                              <div className="min-w-0 flex-1">
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
                        Confirmar e Excluir{' '}
                        {(resultadoLimpeza?.resumo.totalParaExcluir || 0) + totalDecisoesApagar}{' '}
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
                    Selecione o arquivo da imagem (ou vários para modo lote) *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 1) {
                        // Se o usuário selecionou mais de um arquivo aqui, redireciona suavemente para o lote
                        const files = Array.from(e.target.files)
                        setModalOpen(false)
                        setBatchInitialFiles(files)
                        setBatchModalOpen(true)
                      } else {
                        handleFileChange(e)
                      }
                    }}
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
                  Formatos: JPG, PNG, WEBP, SVG, GIF. Seleção múltipla suportada.
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

              {/* Descrição */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Descrição / Legenda</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={2}
                  placeholder="Detalhes da foto: ângulo, instalação, equipamentos retratados..."
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

      {/* Modal Upload Múltiplo em Lote */}
      <AdminBatchMediaModal
        isOpen={batchModalOpen}
        onClose={() => {
          setBatchModalOpen(false)
          setBatchInitialFiles([])
        }}
        casesList={casesList}
        categorias={MEDIA_CATEGORIAS}
        initialFiles={batchInitialFiles}
        onSuccessBatch={() => {
          onRefresh()
        }}
      />

      {/* Modal de revisão da vinculação automática */}
      <AdminAutoVinculoModal
        isOpen={vincModalOpen}
        onClose={() => setVincModalOpen(false)}
        itens={itensRevisao}
        casesList={casesList}
        onRefresh={onRefresh}
      />
    </div>
  )
}
