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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { isAuthenticated, logout, getCurrentUser } from '@/services/auth'
import { listLeads, deleteLead } from '@/services/leads'
import type { Lead, TipoImovel } from '@/types/leads'

export default function Admin() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState<string>('todos')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const currentUser = getCurrentUser()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }
    fetchLeads()
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
      'Tipo de Imóvel',
      'Consumo Mensal (R$)',
      'Mensagem',
    ]
    const rows = filteredLeads.map((l) => [
      l.id,
      new Date(l.created).toLocaleString('pt-BR'),
      `"${l.nome.replace(/"/g, '""')}"`,
      `"${l.telefone}"`,
      `"${l.email}"`,
      `"${l.tipo_imovel}"`,
      l.consumo_mensal ? l.consumo_mensal : '',
      `"${(l.mensagem || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `delfos_leads_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Exportação Concluída',
      description: `${filteredLeads.length} leads exportados para CSV com sucesso.`,
    })
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const matchSearch =
        item.nome.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.telefone.toLowerCase().includes(search.toLowerCase()) ||
        (item.mensagem && item.mensagem.toLowerCase().includes(search.toLowerCase()))

      const matchTipo = filterTipo === 'todos' || item.tipo_imovel === filterTipo

      return matchSearch && matchTipo
    })
  }, [leads, search, filterTipo])

  // Stats calculation
  const totalLeads = leads.length
  const residenciaLeads = leads.filter((l) => l.tipo_imovel === 'Residencia').length
  const empresaLeads = leads.filter((l) => l.tipo_imovel === 'Empresa').length
  const consumoEstimadoMedio = useMemo(() => {
    const comConsumo = leads.filter((l) => l.consumo_mensal && l.consumo_mensal > 0)
    if (comConsumo.length === 0) return 0
    const sum = comConsumo.reduce((acc, curr) => acc + (curr.consumo_mensal || 0), 0)
    return Math.round(sum / comConsumo.length)
  }, [leads])

  return (
    <div className="min-h-screen bg-frost flex flex-col text-slate-800">
      {/* Top Navbar */}
      <header className="bg-midnight-950 text-white border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-solar-400 flex items-center justify-center text-midnight-950 shadow">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base leading-tight">DELFOS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-solar-400/20 text-solar-300 uppercase">
                  Painel de Leads
                </span>
              </div>
              <span className="text-xs text-slate-400 block leading-none">
                Erechim/RS • {currentUser?.email || 'Administrador'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5"
              >
                <span>Ver Landing Page</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-solar-100 text-solar-700 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total de Leads
              </span>
              <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Residencial
              </span>
              <p className="text-2xl font-bold text-slate-900">{residenciaLeads}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Empresas
              </span>
              <p className="text-2xl font-bold text-slate-900">{empresaLeads}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Consumo Médio
              </span>
              <p className="text-2xl font-bold text-slate-900">
                {consumoEstimadoMedio > 0 ? `R$ ${consumoEstimadoMedio}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Actions Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, telefone, e-mail..."
                className="pl-9 h-10 rounded-xl bg-frost border-slate-200 text-sm"
              />
            </div>

            {/* Filter by Property Type */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                aria-label="Filtrar por tipo de imóvel"
                className="h-10 px-3 bg-frost border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-solar-400"
              >
                <option value="todos">Todos os tipos</option>
                <option value="Residencia">Residencial</option>
                <option value="Empresa">Empresarial</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
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
                  <th className="py-4 px-6">Data</th>
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Contato</th>
                  <th className="py-4 px-6">Tipo</th>
                  <th className="py-4 px-6">Conta Atual</th>
                  <th className="py-4 px-6">Mensagem</th>
                  <th className="py-4 px-6 text-right">Ações</th>
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
                    )}%2C%20aqui%20%C3%A9%20da%20Delfos%20Engenharia%20Solar%20de%20Erechim!`

                    return (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Data */}
                        <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dateFormatted}</span>
                          </div>
                        </td>

                        {/* Nome */}
                        <td className="py-4 px-6 font-semibold text-slate-900">{lead.nome}</td>

                        {/* Contatos */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="space-y-1">
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-leaf-dark hover:underline font-semibold"
                            >
                              <Phone className="w-3.5 h-3.5 text-leaf" />
                              <span>{lead.telefone}</span>
                            </a>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`mailto:${lead.email}`} className="hover:underline">
                                {lead.email}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Tipo de Imóvel */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              lead.tipo_imovel === 'Residencia'
                                ? 'bg-solar-100 text-solar-800'
                                : lead.tipo_imovel === 'Empresa'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {lead.tipo_imovel === 'Residencia'
                              ? 'Residencial'
                              : lead.tipo_imovel === 'Empresa'
                                ? 'Empresa'
                                : 'Outro'}
                          </span>
                        </td>

                        {/* Consumo Mensal */}
                        <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-900">
                          {lead.consumo_mensal ? (
                            <span className="text-leaf-dark font-bold">
                              R${' '}
                              {lead.consumo_mensal.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Não informado</span>
                          )}
                        </td>

                        {/* Mensagem */}
                        <td className="py-4 px-6 max-w-xs text-xs text-slate-600">
                          {lead.mensagem ? (
                            <span className="line-clamp-2" title={lead.mensagem}>
                              {lead.mensagem}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Sem observações</span>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
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
      </div>
    </div>
  )
}
