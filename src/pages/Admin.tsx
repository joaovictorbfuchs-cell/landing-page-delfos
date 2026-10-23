import { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sun,
  Zap,
  LogOut,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Building,
  Home,
  CheckCircle,
  ExternalLink,
  MapPin,
  Tag,
  BatteryCharging,
  Layers,
  Info,
  Wrench,
  AlertTriangle,
  Bot,
  Users,
  FileText,
  Award,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DelfosLogo from '@/components/DelfosLogo'
import { useToast } from '@/hooks/use-toast'
import { isAuthenticated, logout, getCurrentUser } from '@/services/auth'
import { listLeads, deleteLead } from '@/services/leads'
import { listPostsAdmin, listCasesAdmin, listMedia } from '@/services/content'
import type { Lead } from '@/types/leads'
import type { PostRecord, CaseRecord, MediaRecord } from '@/types/content'
import AdminPostsTab from '@/components/admin/AdminPostsTab'
import AdminCasesTab from '@/components/admin/AdminCasesTab'
import AdminMediaTab from '@/components/admin/AdminMediaTab'

type AdminSection = 'leads' | 'posts' | 'cases' | 'media'

export default function Admin() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<AdminSection>('leads')

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterNecessidade, setFilterNecessidade] = useState<string>('todos')
  const [filterOrigem, setFilterOrigem] = useState<string>('todos')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedLeadModal, setSelectedLeadModal] = useState<Lead | null>(null)

  // Posts state
  const [posts, setPosts] = useState<PostRecord[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  // Cases state
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [loadingCases, setLoadingCases] = useState(false)

  // Media state
  const [mediaList, setMediaList] = useState<MediaRecord[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [importingFotos, setImportingFotos] = useState(false)

  const currentUser = getCurrentUser()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }
    fetchLeads()
    fetchPosts()
    fetchCases()
    fetchMedia()
  }, [navigate])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const data = await listLeads()
      setLeads(data)
    } catch (err) {
      console.error('Erro ao buscar leads:', err)
      toast({
        variant: 'destructive',
        title: 'Falha ao carregar leads',
        description: 'Verifique se você está conectado com as permissões corretas.',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const data = await listPostsAdmin()
      setPosts(data)
    } catch (err) {
      console.error('Erro ao buscar posts:', err)
    } finally {
      setLoadingPosts(false)
    }
  }

  const fetchCases = async () => {
    setLoadingCases(true)
    try {
      const data = await listCasesAdmin()
      setCases(data)
    } catch (err) {
      console.error('Erro ao buscar cases:', err)
    } finally {
      setLoadingCases(false)
    }
  }

  const fetchMedia = async () => {
    setLoadingMedia(true)
    try {
      const data = await listMedia()
      setMediaList(data)
    } catch (err) {
      console.error('Erro ao buscar mídia:', err)
    } finally {
      setLoadingMedia(false)
    }
  }

  const handleRefreshCurrentTab = () => {
    if (activeTab === 'leads') fetchLeads()
    else if (activeTab === 'posts') fetchPosts()
    else if (activeTab === 'cases') fetchCases()
    else if (activeTab === 'media') fetchMedia()
  }

  const handleLogout = () => {
    logout()
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu do painel de administração.',
    })
    navigate('/login', { replace: true })
  }

  const handleDelete = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o lead "${nome}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      await deleteLead(id)
      setLeads((prev) => prev.filter((lead) => lead.id !== id))
      toast({
        title: 'Lead excluído',
        description: 'Registro removido com sucesso.',
      })
      if (selectedLeadModal?.id === id) {
        setSelectedLeadModal(null)
      }
    } catch (err) {
      console.error('Erro ao excluir:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível remover o lead.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  // Origens únicas para o filtro
  const origensDisponiveis = useMemo(() => {
    const set = new Set<string>()
    set.add('plantao-ia') // Sempre disponível no seletor de filtros
    leads.forEach((l) => {
      if (l.origem) set.add(l.origem)
    })
    return Array.from(set)
  }, [leads])

  // Filtragem
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const term = search.toLowerCase()
      const matchSearch =
        item.nome.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.telefone.toLowerCase().includes(term) ||
        (item.cidade && item.cidade.toLowerCase().includes(term)) ||
        (item.necessidade && item.necessidade.toLowerCase().includes(term)) ||
        (item.origem && item.origem.toLowerCase().includes(term)) ||
        (item.mensagem && item.mensagem.toLowerCase().includes(term))

      const matchNecessidade =
        filterNecessidade === 'todos' ||
        (item.necessidade &&
          item.necessidade.toLowerCase().includes(filterNecessidade.toLowerCase())) ||
        (item.tipo_imovel && item.tipo_imovel === filterNecessidade)

      const matchOrigem = filterOrigem === 'todos' || item.origem === filterOrigem

      return matchSearch && matchNecessidade && matchOrigem
    })
  }, [leads, search, filterNecessidade, filterOrigem])

  const exportCSV = () => {
    if (filteredLeads.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum lead para exportar',
      })
      return
    }

    const headers = [
      'ID',
      'Data/Hora',
      'Nome',
      'Telefone',
      'E-mail',
      'Cidade',
      'Necessidade / Pilar',
      'Tipo de Ligação',
      'Valor da Conta (R$)',
      'Concessionária',
      'Posse da Área',
      'Já Possui Solar',
      'Origem / Campanha',
      'Mensagem / Obs',
    ]

    const rows = filteredLeads.map((l) => [
      l.id,
      new Date(l.created).toLocaleString('pt-BR'),
      `"${l.nome.replace(/"/g, '""')}"`,
      `"${l.telefone}"`,
      `"${l.email}"`,
      `"${(l.cidade || '').replace(/"/g, '""')}"`,
      `"${(l.necessidade || l.tipo_imovel || '').replace(/"/g, '""')}"`,
      `"${l.tipo_ligacao || ''}"`,
      l.valor_conta ? l.valor_conta : l.consumo_mensal ? l.consumo_mensal : '',
      `"${l.concessionaria || ''}"`,
      `"${l.posse_area || ''}"`,
      `"${l.ja_possui_solar || ''}"`,
      `"${l.origem || 'direto'}"`,
      `"${(l.mensagem || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `delfos_leads_fase1_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Exportação Concluída',
      description: `${filteredLeads.length} leads exportados para CSV com sucesso.`,
    })
  }

  // Stats calculation
  const totalLeads = leads.length
  const plantaoIaLeads = leads.filter((l) => l.origem === 'plantao-ia').length
  const solarLeads = leads.filter(
    (l) => (l.necessidade && l.necessidade.includes('Solar')) || l.tipo_imovel === 'Residencia',
  ).length
  const bessLeads = leads.filter((l) => l.necessidade && l.necessidade.includes('BESS')).length
  const manutencaoLeads = leads.filter(
    (l) =>
      l.origem !== 'plantao-ia' &&
      l.necessidade &&
      (l.necessidade === 'Manutenção' || l.necessidade.toLowerCase().includes('manuten')),
  ).length
  const outrosPilaresLeads = leads.filter(
    (l) =>
      l.necessidade &&
      (l.necessidade.includes('Carregadores') ||
        (l.necessidade.includes('O&M') && l.necessidade !== 'Manutenção')),
  ).length

  return (
    <div className="min-h-screen bg-frost flex flex-col text-slate-800">
      {/* Top Navbar */}
      <header className="bg-midnight-950 text-white border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <DelfosLogo height={34} variant="dark-bg" />
            </Link>
            <div className="border-l border-white/20 pl-3 hidden sm:block">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-solar-400/20 text-solar-300 uppercase block w-fit">
                Painel Administrativo
              </span>
              <span className="text-xs text-slate-400 block leading-tight mt-0.5">
                Erechim/RS • {currentUser?.email || 'Administrador'}
              </span>
            </div>
          </div>

          {/* Abas Centrais de Navegação do Painel */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-solar-400 text-midnight-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Leads & Métricas</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                {leads.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-solar-400 text-midnight-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Blog / Conteúdos</span>
              {posts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {posts.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cases')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cases'
                  ? 'bg-solar-400 text-midnight-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cases</span>
              {cases.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {cases.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-solar-400 text-midnight-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Biblioteca de Mídia</span>
              {mediaList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {mediaList.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Link to="/solucoes/energia-solar">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-[11px] h-8 px-2"
                >
                  Solar EPC
                </Button>
              </Link>
              <Link to="/solucoes/bess">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-[11px] h-8 px-2"
                >
                  BESS
                </Button>
              </Link>
              <Link to="/solucoes/om">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-[11px] h-8 px-2"
                >
                  O&M
                </Button>
              </Link>
              <Link to="/solucoes/carregadores">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-[11px] h-8 px-2"
                >
                  Carregadores
                </Button>
              </Link>
              <Link to="/projetos">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-[11px] h-8 px-2"
                >
                  Cases
                </Button>
              </Link>
              <Link to="/conteudos">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-[11px] h-8 px-2"
                >
                  Blog
                </Button>
              </Link>
              <Link to="/sobre">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-300 hover:text-white hover:bg-white/10 text-[11px] h-8 px-2"
                >
                  Sobre
                </Button>
              </Link>
            </div>

            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5"
              >
                <span>Ver Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-red-300 text-xs flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sub-Nav Tab Bar */}
      <div className="lg:hidden bg-midnight-900 border-b border-white/10 px-4 py-2 flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === 'leads'
              ? 'bg-solar-400 text-midnight-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Leads ({leads.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === 'posts'
              ? 'bg-solar-400 text-midnight-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Blog ({posts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cases')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === 'cases'
              ? 'bg-solar-400 text-midnight-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Cases ({cases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
            activeTab === 'media'
              ? 'bg-solar-400 text-midnight-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Mídia ({mediaList.length})
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        {activeTab === 'posts' && (
          <AdminPostsTab posts={posts} loading={loadingPosts} onRefresh={fetchPosts} />
        )}

        {activeTab === 'cases' && (
          <AdminCasesTab cases={cases} loading={loadingCases} onRefresh={fetchCases} />
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Banner de Sincronização de Fotos Reais Delfos */}
            <div className="bg-gradient-to-r from-[#0B2C4F] to-[#081B30] text-white p-5 rounded-2xl border border-solar-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-400 block">
                  Acervo Histórico Delfos Engenharia
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Fotos Reais de Obras e Instalações (WordPress Delfos)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Importa automaticamente fotos de obras (Cassul 155 kWp, Clanel 123 kWp,
                  Panificadora Garcia 112 kWp, Silo Erebango, etc.) para o banco de dados e vincula
                  aos respectivos cases.
                </p>
              </div>
              <Button
                disabled={importingFotos}
                onClick={async () => {
                  setImportingFotos(true)
                  try {
                    const pbUrl = import.meta.env.VITE_POCKETBASE_URL || ''
                    // Processamento em lotes encadeados de no máximo 6 fotos por chamada
                    // garantindo resposta ultra rápida e sem risco de 504 Gateway Timeout
                    const limit = 6
                    let currentOffset = 0
                    let hasMore = true
                    let totalFotosProcessadas = 0
                    let totalSalvas = 0
                    let totalExistentes = 0
                    let casesAfetadosCount = 0

                    while (hasMore) {
                      const res = await fetch(
                        `${pbUrl}/backend/v1/importar-fotos-delfos?offset=${currentOffset}&limit=${limit}`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        },
                      )

                      if (!res.ok) {
                        const errJson = await res.json().catch(() => ({}))
                        throw new Error(
                          errJson.error || `Erro HTTP ${res.status} ao processar lote de fotos.`,
                        )
                      }

                      const json = await res.json()
                      const batchSize = json.loteProcessado || 0
                      totalFotosProcessadas += batchSize
                      totalSalvas += json.fotosSalvas || 0
                      totalExistentes += json.fotosPuladas || 0
                      if (Array.isArray(json.casesAtualizados)) {
                        casesAfetadosCount += json.casesAtualizados.length
                      }

                      if (json.temMais && json.proximoOffset !== null && batchSize > 0) {
                        currentOffset = json.proximoOffset
                      } else {
                        hasMore = false
                      }
                    }

                    toast({
                      title: 'Fotos sincronizadas e otimizadas!',
                      description: `${totalFotosProcessadas} fotos processadas (${totalSalvas} novas salvas, ${totalExistentes} já existentes reaproveitadas). Versões otimizadas 1600px e 900px geradas.`,
                    })
                    fetchMedia()
                    fetchCases()
                  } catch (err: unknown) {
                    toast({
                      variant: 'destructive',
                      title: 'Erro na sincronização',
                      description:
                        (err as Error)?.message || 'Falha ao acionar rotina de importação.',
                    })
                  } finally {
                    setImportingFotos(false)
                  }
                }}
                className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl shadow-md shrink-0 h-10 px-4"
              >
                <RefreshCw className={`w-4 h-4 mr-1.5 ${importingFotos ? 'animate-spin' : ''}`} />
                <span>
                  {importingFotos ? 'Sincronizando fotos...' : 'Sincronizar Fotos Delfos'}
                </span>
              </Button>
            </div>

            <AdminMediaTab mediaList={mediaList} loading={loadingMedia} onRefresh={fetchMedia} />
          </div>
        )}

        {activeTab === 'leads' && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-solar-100 text-solar-700 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Total Leads
                  </span>
                  <p className="text-xl font-bold text-slate-900">{totalLeads}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-4 border-2 border-red-200/90 shadow-sm flex items-center gap-3.5 relative overflow-hidden">
                <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-red-700 uppercase tracking-wider block">
                      Plantão IA
                    </span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-600 text-white uppercase">
                      Alta
                    </span>
                  </div>
                  <p className="text-xl font-black text-red-900">{plantaoIaLeads}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Fotovoltaico EPC
                  </span>
                  <p className="text-2xl font-bold text-slate-900">{solarLeads}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BatteryCharging className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    BESS (Baterias)
                  </span>
                  <p className="text-2xl font-bold text-slate-900">{bessLeads}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Manutenção
                  </span>
                  <p className="text-2xl font-bold text-slate-900">{manutencaoLeads}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    O&M / Recarga
                  </span>
                  <p className="text-2xl font-bold text-slate-900">{outrosPilaresLeads}</p>
                </div>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nome, WhatsApp, cidade, origem..."
                    className="pl-9 h-10 rounded-xl bg-frost border-slate-200 text-sm"
                  />
                </div>

                {/* Filter by Pilar / Necessidade */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                  <select
                    value={filterNecessidade}
                    onChange={(e) => setFilterNecessidade(e.target.value)}
                    aria-label="Filtrar por necessidade ou pilar"
                    className="h-10 px-3 bg-frost border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    <option value="todos">Todos os pilares</option>
                    <option value="Solar">Energia Solar (EPC)</option>
                    <option value="BESS">BESS (Armazenamento)</option>
                    <option value="Manutenção">Manutenção / Assistência Técnica</option>
                    <option value="O&M">O&M / Monitoramento</option>
                    <option value="Carregadores">Carregadores Veiculares</option>
                  </select>
                </div>

                {/* Filter by Origem */}
                {origensDisponiveis.length > 0 && (
                  <select
                    value={filterOrigem}
                    onChange={(e) => setFilterOrigem(e.target.value)}
                    aria-label="Filtrar por origem do lead"
                    className="h-10 px-3 bg-frost border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    <option value="todos">Todas as origens</option>
                    {origensDisponiveis.map((orig) => (
                      <option key={orig} value={orig}>
                        Origem: {orig}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchLeads}
                  disabled={loading}
                  className="h-10 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>

                <Button
                  onClick={exportCSV}
                  size="sm"
                  className="h-10 rounded-xl bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold shadow-sm"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-5">Data</th>
                      <th className="py-4 px-5">Cliente</th>
                      <th className="py-4 px-5">Contato & Cidade</th>
                      <th className="py-4 px-5">Pilar / Necessidade</th>
                      <th className="py-4 px-5">Qualificação Técnica</th>
                      <th className="py-4 px-5">Origem</th>
                      <th className="py-4 px-5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-solar-500" />
                          Carregando leads do banco...
                        </td>
                      </tr>
                    ) : filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          Nenhum lead encontrado com os filtros atuais.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const dateFormatted = new Date(lead.created).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })

                        const cleanPhone = lead.telefone.replace(/\D/g, '')
                        const whatsappLink = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(
                          lead.nome,
                        )}%2C%20aqui%20%C3%A9%20da%20Delfos%20Engenharia%20de%20Erechim/RS%20sobre%20sua%20avalia%C3%A7%C3%A3o!`

                        const valorFinal = lead.valor_conta || lead.consumo_mensal

                        return (
                          <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Data */}
                            <td className="py-4 px-5 text-xs text-slate-500 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{dateFormatted}</span>
                              </div>
                            </td>

                            {/* Nome */}
                            <td className="py-4 px-5">
                              <button
                                onClick={() => setSelectedLeadModal(lead)}
                                className="font-bold text-slate-900 hover:text-solar-600 text-left block"
                              >
                                {lead.nome}
                              </button>
                            </td>

                            {/* Contatos & Cidade */}
                            <td className="py-4 px-5 whitespace-nowrap">
                              <div className="space-y-1">
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-xs text-emerald-700 hover:underline font-semibold"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{lead.telefone}</span>
                                </a>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{lead.cidade || 'Não informada'}</span>
                                </div>
                              </div>
                            </td>

                            {/* Pilar / Necessidade */}
                            <td className="py-4 px-5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                  (lead.necessidade || '') === 'Manutenção' ||
                                  (lead.necessidade || '').toLowerCase().includes('manuten')
                                    ? 'bg-rose-100 text-rose-800'
                                    : (lead.necessidade || '').includes('BESS')
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : (lead.necessidade || '').includes('Carregadores')
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : (lead.necessidade || '').includes('O&M')
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-solar-100 text-solar-800'
                                }`}
                              >
                                {(lead.necessidade || '') === 'Manutenção'
                                  ? 'Manutenção / Assistência'
                                  : lead.necessidade || lead.tipo_imovel || 'Solar EPC'}
                              </span>
                            </td>

                            {/* Qualificação Técnica */}
                            <td className="py-4 px-5 text-xs text-slate-700 whitespace-nowrap">
                              <div>
                                {valorFinal ? (
                                  <span className="font-bold text-emerald-800">
                                    R$ {valorFinal.toLocaleString('pt-BR')}
                                    <span className="text-[10px] text-slate-400 font-normal">
                                      /mês
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">Conta não inf.</span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {lead.tipo_ligacao ? `Ligação: ${lead.tipo_ligacao}` : ''}
                                {lead.concessionaria ? ` • ${lead.concessionaria}` : ''}
                              </div>
                            </td>

                            {/* Origem */}
                            <td className="py-4 px-5 whitespace-nowrap">
                              {lead.origem === 'plantao-ia' ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 font-bold text-xs shadow-xs">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                  </span>
                                  <Bot className="w-3.5 h-3.5 text-red-700" />
                                  <span>Plantão IA</span>
                                  <span className="text-[10px] bg-red-600 text-white px-1 rounded uppercase tracking-wider font-mono">
                                    Alta
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  <Tag className="w-3 h-3 text-slate-400" />
                                  {lead.origem || 'direto'}
                                </span>
                              )}
                            </td>

                            {/* Ações */}
                            <td className="py-4 px-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedLeadModal(lead)}
                                  className="text-xs text-slate-600 hover:text-slate-900"
                                >
                                  Ver ficha
                                </Button>
                                <a
                                  href={whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                  title="Chamar no WhatsApp"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={deletingId === lead.id}
                                  onClick={() => handleDelete(lead.id, lead.nome)}
                                  className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                  title="Remover lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Ficha Completa do Lead */}
      {selectedLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-600 block">
                  Ficha Técnica do Lead
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedLeadModal.nome}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLeadModal(null)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-frost p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">WhatsApp</span>
                <strong className="text-slate-900">{selectedLeadModal.telefone}</strong>
              </div>
              <div className="bg-frost p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">E-mail</span>
                <strong className="text-slate-900 truncate block">{selectedLeadModal.email}</strong>
              </div>
              <div className="bg-frost p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Cidade</span>
                <strong className="text-slate-900">
                  {selectedLeadModal.cidade || 'Não informada'}
                </strong>
              </div>
              <div className="bg-frost p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Necessidade</span>
                <strong className="text-slate-900">
                  {selectedLeadModal.necessidade || selectedLeadModal.tipo_imovel}
                </strong>
              </div>
              <div className="bg-frost p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Conta Média</span>
                <strong className="text-emerald-700">
                  {selectedLeadModal.valor_conta || selectedLeadModal.consumo_mensal
                    ? `R$ ${(selectedLeadModal.valor_conta || selectedLeadModal.consumo_mensal)?.toLocaleString('pt-BR')}`
                    : 'Não informado'}
                </strong>
              </div>
              <div className="bg-frost p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Tipo Ligação</span>
                <strong className="text-slate-900">
                  {selectedLeadModal.tipo_ligacao || 'Não informado'}
                </strong>
              </div>
              <div className="bg-frost p-3 rounded-xl">
                <span className="text-slate-400 block font-semibold">Posse Imóvel</span>
                <strong className="text-slate-900">
                  {selectedLeadModal.posse_area || 'Próprio'}
                </strong>
              </div>
              <div
                className={`p-3 rounded-xl ${selectedLeadModal.origem === 'plantao-ia' ? 'bg-red-50 border border-red-200' : 'bg-frost'}`}
              >
                <span className="text-slate-400 block font-semibold">Origem do Lead</span>
                {selectedLeadModal.origem === 'plantao-ia' ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <strong className="text-red-700 font-mono">plantao-ia</strong>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-600 text-white">
                      Prioridade Alta
                    </span>
                  </div>
                ) : (
                  <strong className="text-slate-900 font-mono">
                    {selectedLeadModal.origem || 'direto'}
                  </strong>
                )}
              </div>
            </div>

            {selectedLeadModal.mensagem && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-400 font-semibold block mb-1">
                  Observações do Cliente:
                </span>
                <p className="text-slate-700 leading-relaxed">{selectedLeadModal.mensagem}</p>
              </div>
            )}

            {selectedLeadModal.arquivo_conta && (
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-blue-900 font-bold block">Fatura de Energia Anexada:</span>
                  <span className="text-slate-600 truncate block max-w-[280px]">
                    {selectedLeadModal.arquivo_conta}
                  </span>
                </div>
                <a
                  href={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/leads/${selectedLeadModal.id}/${selectedLeadModal.arquivo_conta}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Abrir fatura
                </a>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(selectedLeadModal.id, selectedLeadModal.nome)}
                className="text-xs"
              >
                Excluir Lead
              </Button>

              <a
                href={`https://wa.me/55${selectedLeadModal.telefone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(
                  selectedLeadModal.nome,
                )}%2C%20aqui%20%C3%A9%20da%20Delfos%20Engenharia!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Iniciar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
