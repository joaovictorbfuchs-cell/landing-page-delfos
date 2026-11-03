import { useState } from 'react'
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
} from '@/services/content'
import MediaLibraryPicker from './MediaLibraryPicker'
import { fetchMediaAsFile } from './mediaCaseUtils'

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
}

export default function AdminCasesTab({
  cases,
  loading,
  onRefresh,
  mediaList = [],
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
  const [pickerLoadingId, setPickerLoadingId] = useState<string | null>(null)
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
    setModalOpen(true)
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
  }

  // Escolha de foto direto da Biblioteca de Mídia: baixa o arquivo original da
  // mídia escolhida e o transforma em File, que será enviado junto ao salvar o
  // case — sem o usuário precisar reenviar o arquivo manualmente.
  const handleSelectMediaFoto = async (media: MediaRecord) => {
    setPickerLoadingId(media.id)
    try {
      const file = await fetchMediaAsFile(media)
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
        description: `"${media.titulo}" será usada como capa do case ao salvar.`,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoFile(file)
      setFotoPreview(URL.createObjectURL(file))
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
          title: 'Case atualizado',
          description: `O case "${titulo}" foi salvo com sucesso.`,
        })
      } else {
        await createCase(payload)
        toast({
          title: 'Case criado',
          description: `O case "${titulo}" foi adicionado com sucesso.`,
        })
      }

      setModalOpen(false)
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao salvar case:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar case',
        description: (err as Error)?.message || 'Não foi possível salvar o case.',
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
        title: caseItem.status === 'publicado' ? 'Case despublicado' : 'Case publicado',
        description: `O case agora está em status ${caseItem.status === 'publicado' ? 'rascunho' : 'publicado'}.`,
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
    if (!window.confirm(`Tem certeza que deseja excluir o case "${caseItem.titulo}"?`)) {
      return
    }

    setActionLoadingId(caseItem.id)
    try {
      await deleteCase(caseItem.id)
      toast({
        title: 'Case excluído',
        description: 'O case foi removido com sucesso.',
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
              {cases.length} {cases.length === 1 ? 'case' : 'cases'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Cases de Sucesso e Projetos Auditados
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cases com status "publicado" são exibidos automaticamente na seção e página de Cases do
            site. Rascunhos nunca aparecem publicamente.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shadow-sm text-xs h-10 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Case</span>
        </Button>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-6 h-6 border-2 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Carregando cases do banco de dados...
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Nenhum case cadastrado no banco</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Clique em "Novo Case" para adicionar seu primeiro projeto auditado com foto via
              upload. O site exibe os cases padrão do acervo até novos serem cadastrados!
            </p>
            <Button
              onClick={handleOpenCreate}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl"
            >
              Criar Primeiro Case
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
                  {editingCase ? 'Editar Case' : 'Novo Case de Sucesso'}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingCase ? 'Editar Case Auditado' : 'Cadastrar Novo Case'}
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
              {/* Título & Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título do Case *</label>
                <Input
                  value={titulo}
                  onChange={(e) => handleTituloChange(e.target.value)}
                  placeholder="Ex: Indra Sistemas e Engenharia"
                  required
                  className="rounded-xl"
                />
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

              {/* Foto do Case: upload direto ou escolha na Biblioteca de Mídia */}
              <div className="space-y-2 p-4 bg-frost rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-solar-600" />
                  Foto do Case (upload ou Biblioteca de Mídia)
                </label>
                <p className="text-[10px] text-slate-500 leading-snug">
                  SEO de imagens: nomeie o arquivo como instalacao-cliente-cidade.jpg antes de
                  enviar (ex.: instalacao-cassul-erechim.jpg). A legenda e o texto alternativo da
                  foto são gerados automaticamente no padrão: serviço de potência em bairro, cidade
                  — cliente — resultado.
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
                    onClick={() => setPickerOpen(true)}
                    disabled={pickerLoadingId !== null}
                    className="rounded-xl text-xs h-9 border-solar-400/60 text-solar-700 hover:bg-solar-50 shrink-0 w-full sm:w-auto"
                    title="Escolher a capa do case entre as fotos já enviadas na Biblioteca de Mídia"
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
                        title="Remover foto do case"
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 10MB. A foto escolhida da
                  biblioteca é copiada para o case ao salvar.
                </p>
              </div>

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
                  {submitting ? 'Salvando...' : editingCase ? 'Atualizar Case' : 'Criar Case'}
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
