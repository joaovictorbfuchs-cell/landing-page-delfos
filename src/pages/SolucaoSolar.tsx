import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listCasesAdmin, getCaseImageUrl } from '@/services/content'
import { CaseRecord } from '@/types/content'
import {
  Sun,
  Zap,
  TrendingDown,
  ShieldCheck,
  Building,
  Home,
  Tractor,
  Coins,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'

import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import NavegacaoSolucoes from '@/components/NavegacaoSolucoes'
import { Button } from '@/components/ui/button'

export default function SolucaoSolar() {
  const [contaSimulador, setContaSimulador] = useState<number>(1200)
  const [pbCases, setPbCases] = useState<CaseRecord[]>([])

  useEffect(() => {
    listCasesAdmin()
      .then((res) => setPbCases(res))
      .catch((err) => console.log('Erro ao carregar cases do backend:', err))
  }, [])

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Sub-ofertas especializadas
  const subOfertas = [
    {
      titulo: 'Conectado à rede ou com baterias',
      desc: 'Sistemas que enviam o excedente gerado para a rede da distribuidora e contam com opção de baterias para manter sua estrutura funcionando mesmo quando a energia cai.',
      badge: 'Conectado ou com Baterias',
    },
    {
      titulo: 'Usinas em telhado e solo',
      desc: 'Engenharia completa com fixação estrutural segura: telhas cerâmicas, fibrocimento, coberturas metálicas e estruturas reforçadas para usinas em solo.',
      badge: 'Estruturas Certificadas',
    },
    {
      titulo: 'Projetos para empresas, indústrias, residências e agronegócio',
      desc: 'Dimensionamento sob medida para a sua necessidade real: desde residências a pavilhões industriais com alta demanda e propriedades rurais.',
      badge: 'Multissetorial',
    },
    {
      titulo: 'Enquadramento legal e regulatório completo',
      desc: 'Cuidamos de todo o enquadramento legal da geração própria: aprovação formal junto à distribuidora, compensação entre imóveis e consórcios.',
      badge: 'Engenharia & Aprovação',
    },
  ]

  // Provas comprovadas da engenharia Delfos
  const provas = [
    {
      metrica: 'Até 90%',
      label: 'Economia na Fatura de Energia',
      detalhe: 'Redução direta no valor pago à distribuidora de energia (RGE, CEEE e cooperativas)',
      destaque: true,
    },
    {
      metrica: '+3.000',
      label: 'Projetos Entregues no Sul',
      detalhe: '12 anos de engenharia de campo comprovada no Rio Grande do Sul e Santa Catarina',
      destaque: false,
    },
    {
      metrica: '12 anos',
      label: 'Tradição e Solidez Técnica',
      detalhe:
        'Engenharia própria com sede em Erechim/RS e atuação contínua em mais de 60 municípios',
      destaque: false,
    },
    {
      metrica: '100% ART',
      label: 'Engenharia Responsável CREA-RS',
      detalhe:
        'Projetos homologados com Anotação de Responsabilidade Técnica e laudo de engenharia',
      destaque: false,
    },
  ]

  // Segmentos atendidos em formato resumido
  const segmentosResumo = [
    { icon: Home, nome: 'Residências e Condomínios', rota: '/segmentos/residencias' },
    { icon: Building, nome: 'Comércio e Serviços', rota: '/segmentos/comercio' },
    { icon: Zap, nome: 'Indústrias', rota: '/segmentos/industria' },
    { icon: Tractor, nome: 'Agronegócio', rota: '/segmentos/agronegocio' },
    { icon: Coins, nome: 'Investidores e Usinas de Solo', rota: '/segmentos/investidores' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Energia solar em Erechim e Sul do Brasil | Delfos Engenharia"
        description="Reduza até 90% da conta de energia com engenharia de ciclo completo da Delfos Solar. Mais de 3.000 projetos conectados à rede ou com baterias, telhado e solo no RS."
        canonicalPath="/solucoes/energia-solar"
        ogImage="/og-image.png"
      />

      {/* Header institucional */}
      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb simples */}
        <div className="bg-slate-50 border-b border-slate-200/70 py-3">
          <div className="max-w-7xl mx-auto px-6 text-xs text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-solar-600 transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link to="/#solucoes" className="hover:text-solar-600 transition-colors">
              Soluções
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Energia solar</span>
          </div>
        </div>

        {/* HERO SECTION DA SOLUÇÃO */}
        <section className="relative bg-gradient-to-b from-[#081B30] via-[#0B2C4F] to-[#0D3661] text-white py-20 lg:py-28 overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-solar-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-400/15 border border-solar-400/30 text-solar-300 text-xs font-bold uppercase tracking-wider">
                  <Sun className="w-3.5 h-3.5 text-solar-400" />
                  Solução 01 • Energia solar
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Energia solar:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-300 via-amber-300 to-solar-400">
                    engenharia de ponta a ponta
                  </span>{' '}
                  para zerar até 90% da sua conta.
                </h1>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Projetos conectados à rede ou com baterias desenvolvidos por engenheiros com
                  registro no CREA-RS. Dimensionamento rigoroso com base na incidência de sol real
                  do Sul do Brasil, aprovação ágil junto à distribuidora e máxima eficiência de
                  geração.
                </p>

                {/* Destaque do Problema que Resolve */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-300 block mb-1">
                    Problema que esta solução resolve:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Constantes aumentos na tarifa de energia (bandeiras tarifárias),
                    imprevisibilidade orçamentária para empresas e residências, e perda de
                    competitividade frente ao custo do insumo elétrico.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Button
                    onClick={scrollToContato}
                    className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-extrabold px-8 py-6 text-base rounded-xl shadow-xl shadow-solar-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Solicitar orçamento</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <a
                    href="https://wa.me/5554991292121?text=Ol%C3%A1!%20Gostaria%20de%20simular%20um%20projeto%20fotovoltaico%20com%20a%20engenharia%20da%20Delfos%20(Origem:%20solucao-solar)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all text-center"
                  >
                    <span>Falar com especialista no WhatsApp</span>
                  </a>
                </div>

                {/* Quick Trust Badges */}
                <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Painéis de fabricantes de primeira linha com 25 anos de garantia</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-solar-400" />
                    <span>Inversores homologados Inmetro</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-solar-300" />
                    <span>Engenharia CREA-RS em Erechim</span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Foto Real de Obra + Calculadora rápida de economia */}
              <div className="lg:col-span-5 space-y-4">
                {/* Foto Real de Instalação Comercial Delfos */}
                <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-md relative overflow-hidden group">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 border border-white/20 shadow-xl bg-slate-900">
                    <img
                      src={(() => {
                        const cassul = pbCases.find((c) => c.slug === 'cassul-erechim-rs-155-0-kwp')
                        return (
                          (cassul && cassul.foto ? getCaseImageUrl(cassul, 'grande') : null) ||
                          'https://www.delfos.eng.br/site/wp-content/uploads/2020/05/DJI_0120.jpg'
                        )
                      })()}
                      alt="Obra real Delfos Engenharia — Cassul 155 kWp em Erechim/RS"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2.5 left-3 text-[11px] font-mono font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20">
                      Obra Real: Cassul Distribuidora • 155 kWp
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-solar-300">
                      Engenharia Própria de Campo
                    </span>
                    <span className="text-xs text-slate-300">Erechim e +60 municípios</span>
                  </div>
                </div>

                {/* Simulador rápido de economia conectado ao formulário */}
                <div className="bg-white rounded-3xl p-6 text-slate-800 shadow-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-solar-600">
                      Simulação Estimada
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Até 90% de economia
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-2">
                    Quanto você paga hoje de energia?
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Valor médio mensal:</span>
                      <span className="text-xl font-black text-slate-900">
                        R$ {contaSimulador.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={300}
                      max={15000}
                      step={100}
                      value={contaSimulador}
                      onChange={(e) => setContaSimulador(Number(e.target.value))}
                      className="w-full accent-solar-500 cursor-pointer"
                      aria-label="Ajustar valor da conta de energia"
                    />

                    <div className="p-3 rounded-xl bg-solar-50/80 border border-solar-200/60 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Economia média estimada em 1 ano:</span>
                        <strong className="text-emerald-700 font-bold">
                          ~ R$ {Math.round(contaSimulador * 12 * 0.9).toLocaleString('pt-BR')}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Economia em 25 anos (vida útil):</span>
                        <strong className="text-slate-900 font-bold">
                          ~ R$ {Math.round(contaSimulador * 12 * 25 * 0.85).toLocaleString('pt-BR')}
                        </strong>
                      </div>
                    </div>

                    <Button
                      onClick={scrollToContato}
                      className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold py-3 text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
                    >
                      Solicitar orçamento (conta de R$ {contaSimulador})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROVAS OBRIGATÓRIAS (Item 5.1 da especificação) */}
        <section className="py-16 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-1">
                Autoridade Comprovada
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Elementos de prova da engenharia fotovoltaica Delfos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {provas.map((p, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 border transition-all ${
                    p.destaque
                      ? 'bg-gradient-to-br from-solar-50 to-white border-solar-300 shadow-md'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-3xl lg:text-4xl font-black ${
                        p.destaque ? 'text-solar-600' : 'text-slate-900'
                      }`}
                    >
                      {p.metrica}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{p.label}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.detalhe}</p>
                </div>
              ))}
            </div>

            {/* Mapa de atuação no Sul */}
            <div className="mt-8 rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-solar-100 text-solar-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Mapa de Atuação Consolidada no Sul do Brasil
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Sede operacional em <strong>Erechim/RS</strong>, com equipes de engenharia de
                    campo e obras entregues em mais de 60 municípios gaúchos e catarinenses (RGE,
                    CEEE e Cooperativas).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  RS & SC Cobertos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* GALERIA DE INSTALAÇÕES REAIS DE OBRAS DA DELFOS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-1">
                  Evidência de Obras
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Instalações reais da Delfos Engenharia no Sul
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                  Registros fotográficos de projetos comerciais, industriais, agrícolas e
                  residenciais construídos e homologados pela nossa equipe.
                </p>
              </div>

              <Link
                to="/projetos"
                className="inline-flex items-center gap-2 text-xs font-bold text-solar-700 hover:text-solar-900 bg-solar-50 px-4 py-2.5 rounded-xl border border-solar-200 w-fit transition-colors"
              >
                <span>Ver todos os cases com métricas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  titulo: 'Cassul Distribuidora — 155 kWp',
                  local: 'Erechim / RS',
                  setor: 'Comércio e Serviços',
                  slug: 'cassul-erechim-rs-155-0-kwp',
                  fallbackImg:
                    'https://www.delfos.eng.br/site/wp-content/uploads/2020/05/DJI_0120.jpg',
                  destaque: '20.000 kWh/mês',
                },
                {
                  titulo: 'Clanel Confecções — 123,5 kWp',
                  local: 'Erechim / RS',
                  setor: 'Indústria Têxtil',
                  slug: 'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
                  fallbackImg:
                    'https://www.delfos.eng.br/site/wp-content/uploads/2019/02/DJI_0075.jpg',
                  destaque: '390 módulos solares',
                },
                {
                  titulo: 'Panificadora Garcia — 112,5 kWp',
                  local: 'Passo Fundo / RS',
                  setor: 'Comércio e Serviços',
                  slug: 'panificadora-garcia-passo-fundo-rs-112-5-kwp',
                  fallbackImg:
                    'https://www.delfos.eng.br/site/wp-content/uploads/2022/07/DJI_0047.jpg',
                  destaque: '112,5 kWp instalados',
                },
                {
                  titulo: 'Silo de Armazenagem — 76,16 kWp',
                  local: 'Erebango / RS',
                  setor: 'Agronegócio',
                  slug: 'silo-erebango-rs-76-16-kwp',
                  fallbackImg:
                    'https://www.delfos.eng.br/site/wp-content/uploads/2020/02/DJI_0023.jpg',
                  destaque: '9.000 kWh/mês gerados',
                },
              ].map((item, idx) => {
                // Tenta buscar case correspondente no PocketBase com versão leve (900px) para cards
                const caseDb = pbCases.find((c) => c.slug === item.slug)
                const imgSrc =
                  (caseDb && caseDb.foto ? getCaseImageUrl(caseDb, 'leve') : null) ||
                  item.fallbackImg

                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden hover:shadow-lg hover:border-solar-400 transition-all group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={imgSrc}
                        alt={item.titulo}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                        {item.setor}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {item.titulo}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{item.local}</span>
                        <strong className="text-emerald-700 font-bold">{item.destaque}</strong>
                      </div>
                    </div>
                  </div>
                )
              })}{' '}
            </div>
          </div>
        </section>

        {/* SUB-OFERTAS DETALHADAS (Item 5.1 da especificação) */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-2">
                Sub-Ofertas Especializadas
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Projeto e instalação completos para cada modalidade de usina
              </h2>
              <p className="text-base text-slate-600 mt-3 leading-relaxed">
                Projeto e instalação completos: cuidamos de 100% das etapas — do estudo preliminar e
                compra de painéis de fabricantes de primeira linha até a montagem, laudos e ativação
                definitiva na rede.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subOfertas.map((sub, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-8 bg-frost border border-slate-200/90 shadow-sm hover:shadow-md hover:border-solar-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-solar-100 text-solar-800 border border-solar-200">
                        {sub.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-400">0{idx + 1}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">{sub.titulo}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{sub.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-solar-700">
                    <span>Dimensionamento técnico sob medida</span>
                    <button
                      type="button"
                      onClick={scrollToContato}
                      className="hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Solicitar orçamento</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEGMENTOS ATENDIDOS — ENXUTO COM PILLS E TEXTO CORRIDO */}
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                Soluções Sob Medida
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Projetos solares dimensionados para cada necessidade
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Desenvolvemos projetos específicos para cada setor: residências e condomínios,
                comércio, indústrias, propriedades rurais e investidores de usinas de energia.
              </p>

              {/* Pills simples com links para as páginas dedicadas */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                {segmentosResumo.map((seg, idx) => {
                  const Icone = seg.icon
                  return (
                    <Link
                      key={idx}
                      to={seg.rota}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:border-solar-400 hover:text-solar-700 shadow-2xs transition-all"
                    >
                      <Icone className="w-4 h-4 text-solar-600" />
                      <span>{seg.nome}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA O PROJETO SOLAR DA DELFOS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-2">
                Processo de Engenharia
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Ciclo completo do seu projeto solar em 4 etapas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  passo: '01',
                  titulo: 'Diagnóstico & Simulação',
                  desc: 'Análise detalhada da fatura de energia, histórico de consumo e perfil de demanda em kW.',
                },
                {
                  passo: '02',
                  titulo: 'Vistoria Técnica In Loco',
                  desc: 'Inspeção do telhado/solo com drone, análise estrutural das tesouras e do quadro elétrico geral.',
                },
                {
                  passo: '03',
                  titulo: 'Engenharia & Homologação',
                  desc: 'Elaboração do projeto elétrico com emissão de ART/CREA-RS e trâmite formal na concessionária.',
                },
                {
                  passo: '04',
                  titulo: 'Instalação, Teste & O&M',
                  desc: 'Montagem rápida por equipe própria, comissionamento e conexão à plataforma de monitoramento.',
                },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 bg-frost border border-slate-200/80 relative"
                >
                  <span className="text-3xl font-black text-solar-400/60 block mb-2">
                    {p.passo}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{p.titulo}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORMULÁRIO 2 ETAPAS CONTEXTUAL COM ORIGEM "solucao-solar" E CTA PADRONIZADO */}
        <ContatoForm
          initialNecessidade="Energia Solar Fotovoltaica"
          initialOrigem="solucao-solar"
          initialValorConta={contaSimulador}
          tituloSecao="Solicite seu orçamento de energia solar"
          subtituloSecao="Receba um dimensionamento técnico preliminar e estudo financeiro elaborado por nossa equipe de engenharia em Erechim/RS."
          textoBotaoFinal="Solicitar orçamento"
        />

        {/* NAVEGAÇÃO CRUZADA ENTRE AS 4 SOLUÇÕES */}
        <NavegacaoSolucoes solucaoAtual="solar" />
      </main>

      {/* Footer com Diferenciação da Marca */}
      <Footer />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
