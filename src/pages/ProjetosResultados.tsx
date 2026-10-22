import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  Zap,
  TrendingDown,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight,
  Filter,
  Layers,
  FileCheck2,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'

import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import CaseHeroFeatured from '@/components/cases/CaseHeroFeatured'
import CaseFilters from '@/components/cases/CaseFilters'
import CaseCard from '@/components/cases/CaseCard'
import CaseModal from '@/components/cases/CaseModal'
import { CASES_DATA, type CaseStudy, type SegmentoCase, type SolucaoCase } from '@/data/cases'
import { Button } from '@/components/ui/button'
import { listPublishedCases, getCaseImageUrl } from '@/services/content'
import type { CaseRecord } from '@/types/content'

export default function ProjetosResultados() {
  const [segmentoFiltro, setSegmentoFiltro] = useState<string>('todos')
  const [solucaoFiltro, setSolucaoFiltro] = useState<string>('todas')
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseStudy | null>(null)
  const [dynamicCases, setDynamicCases] = useState<CaseRecord[]>([])

  useEffect(() => {
    async function loadCases() {
      try {
        const published = await listPublishedCases()
        setDynamicCases(published)
      } catch (err) {
        console.warn('Erro ao carregar cases publicados do PocketBase:', err)
      }
    }
    loadCases()
  }, [])

  // Context for form conversion when clicking CTA from case
  const [leadOrigem, setLeadOrigem] = useState<string>('case-projetos-grid')
  const [leadNecessidade, setLeadNecessidade] = useState<string>('Energia Solar Fotovoltaica')
  const [leadTituloSecao, setLeadTituloSecao] = useState<string>(
    'Solicite um estudo com base em resultados reais',
  )

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Unifica os cases estáticos com os dinâmicos do PocketBase (apenas os com status "publicado")
  const todosCases = useMemo<CaseStudy[]>(() => {
    // 1. Converter cases do PocketBase
    const fromDb: CaseStudy[] = dynamicCases.map((c) => {
      const imageUrl = getCaseImageUrl(c)
      return {
        id: c.slug || c.id,
        slug: c.slug || c.id,
        titulo: c.titulo,
        cliente: c.cliente || c.titulo,
        segmento: c.setor as SegmentoCase,
        solucao: (c.solucao || 'Energia Solar (EPC)') as SolucaoCase,
        local: c.local || 'Erechim / RS',
        dataEntrega: c.data_entrega || 'Auditado',
        escopo: c.escopo || `${c.potencia_capacidade || ''} Projeto Turnkey Delfos`,
        desafioInicial: c.descricao || 'Redução de custos operacionais e segurança energética.',
        solucaoTecnica: c.solucao_tecnica || 'Engenharia de precisão e homologação completa.',
        resultadoMedido: {
          destaqueValor: c.resultado_valor || 'Redução auditada',
          destaqueLabel: c.resultado_label || 'Resultado medido em campo',
          descricao: c.resultado || 'Economia verificada após comissionamento.',
          periodoMedicao: 'Medição formal pós-energização',
          metodoMedicao: 'Auditoria cruzada com faturas RGE',
        },
        destaque: Boolean(c.destaque),
        fotoDescricao: c.descricao || 'Case auditado pela Delfos Engenharia.',
        fotoPlaceholderNota: 'Foto real oficial',
        potenciaOuCapacidadeCurta: c.potencia_capacidade || 'Não informado',
        fotoUrl: imageUrl || undefined,
      }
    })

    // 2. Cases estáticos evitando duplicar por id/slug
    const existingIds = new Set(fromDb.map((c) => c.id))
    const fromStatic: CaseStudy[] = CASES_DATA.filter((c) => !existingIds.has(c.id))

    return [...fromDb, ...fromStatic]
  }, [dynamicCases])

  // Find featured case
  const caseDestaque = useMemo(() => {
    return todosCases.find((c) => c.destaque) || todosCases[0]
  }, [todosCases])

  // Filter cases dynamically by Segmento and Solucao
  const casesFiltrados = useMemo(() => {
    return todosCases.filter((item) => {
      const matchSegmento = segmentoFiltro === 'todos' || item.segmento === segmentoFiltro
      const matchSolucao = solucaoFiltro === 'todas' || item.solucao === solucaoFiltro
      return matchSegmento && matchSolucao
    })
  }, [todosCases, segmentoFiltro, solucaoFiltro])

  // Open modal
  const handleVerDetalhes = (c: CaseStudy) => {
    setSelectedCaseModal(c)
  }

  // Trigger contextual lead request
  const handleSolicitarEstudo = (c: CaseStudy) => {
    setSelectedCaseModal(null)
    setLeadOrigem(`case-${c.id}`)
    setLeadNecessidade(
      c.solucao === 'BESS (Armazenamento)'
        ? 'BESS (Armazenamento)'
        : c.solucao === 'O&M e Monitoramento'
          ? 'O&M e Monitoramento'
          : c.solucao === 'Carregadores Veiculares'
            ? 'Carregadores Veiculares'
            : 'Energia Solar Fotovoltaica',
    )
    setLeadTituloSecao(`Solicite um estudo similar ao case "${c.titulo}"`)
    scrollToContato()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Projetos e Resultados Reais | Cases Auditados Delfos Solar"
        description="Conheça os cases reais de engenharia da Delfos: solar fotovoltaico, BESS, O&M e recarga veicular com métricas auditadas, período de medição e comprovação."
        canonicalPath="/projetos"
      />

      {/* Header Institucional */}
      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb simples */}
        <div className="bg-slate-50 border-b border-slate-200/70 py-3">
          <div className="max-w-7xl mx-auto px-6 text-xs text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-solar-600 transition-colors">
              Início
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Projetos e Resultados</span>
          </div>
        </div>

        {/* HERO SECTION DE PROJETOS E RESULTADOS */}
        <section className="relative bg-gradient-to-b from-[#081B30] via-[#0B2C4F] to-[#0D3661] text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          {/* Background subtle blurs */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-solar-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-400/15 border border-solar-400/30 text-solar-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-solar-400" />
                Seção 9 e 10 • Metodologia Transparente e Auditável
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Projetos e Resultados:{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-300 via-amber-300 to-solar-400">
                  engenharia comprovada
                </span>{' '}
                com dados medidos em campo.
              </h1>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Na Delfos, números não são promessas: são métricas conferidas após a energização.
                Cada case documenta o desafio inicial, a solução técnica aplicada e o resultado real
                com período e método de medição formal.
              </p>

              {/* Regra de Governança e Transparência do documento */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <FileCheck2 className="w-5 h-5 text-solar-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-solar-300">Diretriz de Transparência Delfos:</strong>{' '}
                  Nenhuma métrica é publicada sem conferência técnica, data e definição clara
                  (capacidade instalada vs. sob contrato). Dados em aprovação recente junto à
                  concessionária são marcados explicitamente como <em>"a confirmar"</em>.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>3.000+ projetos entregues no Sul</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-solar-400" />
                  <span>Nota Google 4.9 / 5.0</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>100% ART no CREA-RS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CASE EM DESTAQUE NO TOPO (Item 5 da task - Case Indra Sistemas) */}
        <section className="py-14 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-1">
                Projeto em Destaque
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Case Completo com Resultado Medido e Auditado
              </h2>
            </div>

            <CaseHeroFeatured
              caseStudy={caseDestaque}
              onVerDetalhes={handleVerDetalhes}
              onSolicitarEstudo={handleSolicitarEstudo}
            />
          </div>
        </section>

        {/* FILTROS & GRID DE CASES (Item 1, 2 e 4 da task) */}
        <section id="grid-cases" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            {/* Header da seção de filtros */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-1">
                  Grid de Casos Reais
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Casos de sucesso por segmento e solução
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                  Selecione o seu setor para encontrar empreendimentos gaúchos e catarinenses que já
                  resolveram problemas semelhantes aos seus.
                </p>
              </div>

              {/* Botão limpar filtros se ativo */}
              {(segmentoFiltro !== 'todos' || solucaoFiltro !== 'todas') && (
                <button
                  type="button"
                  onClick={() => {
                    setSegmentoFiltro('todos')
                    setSolucaoFiltro('todas')
                  }}
                  className="text-xs font-bold text-solar-700 hover:text-solar-900 underline cursor-pointer w-fit"
                >
                  Limpar filtros aplicados
                </button>
              )}
            </div>

            {/* Painel de Filtros Componentizado */}
            <CaseFilters
              segmentoSelecionado={segmentoFiltro}
              onSelectSegmento={setSegmentoFiltro}
              solucaoSelecionada={solucaoFiltro}
              onSelectSolucao={setSolucaoFiltro}
              totalResultados={casesFiltrados.length}
            />

            {/* Grid Responsivo de Cards Mobile-first */}
            {casesFiltrados.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-frost">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">
                  Nenhum case encontrado para este filtro específico
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  A Delfos possui mais de 3.000 projetos entregues. Fale diretamente com a equipe
                  técnica para solicitar referências específicas do seu nicho.
                </p>
                <Button
                  onClick={() => {
                    setSegmentoFiltro('todos')
                    setSolucaoFiltro('todas')
                  }}
                  className="mt-4 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl"
                >
                  Mostrar todos os cases
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {casesFiltrados.map((item) => (
                  <CaseCard
                    key={item.id}
                    caseStudy={item}
                    onVerDetalhes={handleVerDetalhes}
                    onSolicitarEstudo={handleSolicitarEstudo}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SEÇÃO INFORMATIVA SOBRE A METODOLOGIA DE MEDIÇÃO */}
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-solar-100 text-solar-700 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Monitoramento Remoto em Tempo Real
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inversores conectados via Wi-Fi/4G e sensores enviam dados para comparação de
                  geração prevista vs. real.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">Auditoria das Faturas da RGE</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conferência cruzada dos créditos injetados (kWh) e das faturas reais emitidas pela
                  concessionária ao longo de 12 meses de ciclo sazonal.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">Laudo Técnico CREA-RS</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Todos os projetos contam com emissão formal de ART, atestando conformidade com as
                  normas ABNT, NBR 17019 e regulamentação da Aneel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO EM 2 ETAPAS COM ORIGEM CONTEXTUAL */}
        <ContatoForm
          initialNecessidade={leadNecessidade}
          initialOrigem={leadOrigem}
          tituloSecao={leadTituloSecao}
          subtituloSecao="Receba um dimensionamento técnico personalizado para a sua operação com estimativa precisa de investimento, payback e economia comprovada."
          textoBotaoFinal="Solicitar estudo preliminar de engenharia"
        />
      </main>

      {/* Modal de Detalhe Completo do Case */}
      <CaseModal
        caseStudy={selectedCaseModal}
        onClose={() => setSelectedCaseModal(null)}
        onSolicitarEstudo={handleSolicitarEstudo}
      />

      {/* Rodapé com Diferenciação da Marca */}
      <Footer />

      {/* Barra Fixa Mobile CTA */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
