import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import WhatsAppFloating from '@/components/WhatsAppFloating'
import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import NavegacaoSolucoes from '@/components/NavegacaoSolucoes'
import { Button } from '@/components/ui/button'

export default function SolucaoSolar() {
  const [contaSimulador, setContaSimulador] = useState<number>(1200)

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Sub-ofertas conforme item 5.1 da especificação
  const subOfertas = [
    {
      titulo: 'Projetos On-Grid e Híbridos',
      desc: 'Sistemas conectados à rede com injeção de excedente e opção de integração híbrida para baterias quando há oscilações na rede da concessionária.',
      badge: 'Geração Conectada',
    },
    {
      titulo: 'Usinas em Telhado e Solo',
      desc: 'Engenharia completa de fixação estrutural: telhas cerâmicas, fibrocimento, trapezoidais/metálicas e estruturas monoposte ou biposte para usinas de solo.',
      badge: 'Estruturas Certificadas',
    },
    {
      titulo: 'Projetos C&I, Residencial e Rural',
      desc: 'Dimensionamento voltado à realidade de cada perfil: desde residências de alto padrão a galpões industriais com alta demanda contratada e aviários/leite no agro.',
      badge: 'Multissetorial',
    },
    {
      titulo: 'Modelagem para Geração Distribuída (GD)',
      desc: 'Enquadramento regulatório nas regras da Lei 14.300/2022, autoconsumo remoto, geração compartilhada e consórcios para investidores de energia.',
      badge: 'Regulatório GD',
    },
  ]

  // Provas obrigatórias da especificação
  const provas = [
    {
      metrica: 'Até 90%',
      label: 'Economia na Fatura de Energia',
      detalhe: 'Redução drástica do valor pago à concessionária (RGE / CEEE / Cooperativas)',
      destaque: true,
    },
    {
      metrica: '+3.000',
      label: 'Projetos Entregues no Sul',
      detalhe: '12 anos de engenharia de campo comprovada no Rio Grande do Sul e Santa Catarina',
      destaque: false,
    },
    {
      metrica: 'XX MWp',
      label: 'Potência Total Instalada',
      detalhe:
        'Placeholder oficial: a confirmar (aguardando consolidação oficial com data de corte)',
      destaque: false,
      placeholder: true,
    },
    {
      metrica: '100% ART',
      label: 'Engenharia Responsável CREA-RS',
      detalhe: 'Projetos homologados com Anotação de Responsabilidade Técnica e laudo mecânico',
      destaque: false,
    },
  ]

  // Segmentos atendidos
  const segmentosAtendidos = [
    {
      icon: Home,
      nome: 'Residências e Condomínios',
      foco: 'Conforto térmico (ar-condicionado), piscina aquecida e valorização imediata do imóvel.',
    },
    {
      icon: Building,
      nome: 'Comércio e Serviços',
      foco: 'Supermercados, padarias, academias e varejo: redução de custo operacional sem parar a operação.',
    },
    {
      icon: Zap,
      nome: 'Indústrias',
      foco: 'Alta tensão, mitigação de custos de demanda contratada e previsibilidade de planilha fabril.',
    },
    {
      icon: Tractor,
      nome: 'Agronegócio',
      foco: 'Granjas, suinocultura, ordenha e irrigação: segurança de suprimento com linhas Pronaf/Pronamp.',
    },
    {
      icon: Coins,
      nome: 'Investidores e Usinas de Solo',
      foco: 'Modelagem de rentabilidade para locação de cotas de geração e proteção patrimonial indexada à inflação.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Energia Solar Fotovoltaica (Projeto e Instalação) em Erechim e Sul do Brasil"
        description="Reduza até 90% da conta de energia com engenharia de ciclo completo da Delfos Solar. Mais de 3.000 projetos on-grid, híbridos, telhado e solo no RS."
        canonicalPath="/solucoes/energia-solar"
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
            <span className="text-slate-900 font-semibold">
              Energia Solar Fotovoltaica (Projeto e Instalação)
            </span>
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
                  Solução 01 • Engenharia Completa (Projeto e Instalação)
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Energia Solar Fotovoltaica:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-300 via-amber-300 to-solar-400">
                    engenharia de ponta a ponta
                  </span>{' '}
                  para zerar até 90% da sua conta.
                </h1>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Projetos on-grid e híbridos desenvolvidos por engenheiros com registro no CREA-RS.
                  Dimensionamento rigoroso com simulação de irradiação solar real do Sul do Brasil,
                  homologação ágil junto à concessionária e máxima eficiência de geração.
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
                    <span>Simular projeto</span>
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
                    <span>Módulos Tier 1 com 25 anos de garantia</span>
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

              {/* Right Hero: Espaço Reservado de Foto Real + Calculadora rápida */}
              <div className="lg:col-span-5 space-y-4">
                {/* Placeholder de Foto Real marcado explicitamente */}
                <div className="rounded-3xl border-2 border-dashed border-solar-400/40 bg-solar-950/30 p-6 backdrop-blur-md relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-solar-400/20 text-solar-300 border border-solar-400/30">
                      Foto real de obra — aguardando
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Erechim / Alto Uruguai
                    </span>
                  </div>

                  <div className="aspect-video rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-solar-400/10 border border-solar-400/30 flex items-center justify-center text-solar-400 mb-3 group-hover:scale-105 transition-transform">
                      <Sun className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Instalação Fotovoltaica Real em Telhado Gaúcho
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Foto aérea de drone da usina fotovoltaica comercial/industrial com estrutura
                      de alumínio anodizado e módulos monocristalinos.
                    </p>
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
                      Simular projeto com esta conta (R$ {contaSimulador})
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
                    {p.placeholder && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase font-mono">
                        A confirmar
                      </span>
                    )}
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
                compra de equipamentos Tier 1 até a montagem, laudos e ativação definitiva na rede.
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
                      <span>Simular este modelo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEGMENTOS ATENDIDOS */}
        <section className="py-20 bg-slate-50 border-t border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-2">
                Portas de Entrada
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Soluções solares dimensionadas por segmento
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {segmentosAtendidos.map((seg, idx) => {
                const Icone = seg.icon
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-solar-100 text-solar-700 flex items-center justify-center mb-3">
                        <Icone className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-2">{seg.nome}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{seg.foco}</p>
                    </div>

                    <button
                      type="button"
                      onClick={scrollToContato}
                      className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-solar-600 hover:text-solar-800 text-left flex items-center gap-1 cursor-pointer"
                    >
                      <span>Simular para este perfil</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
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

        {/* FORMULÁRIO 2 ETAPAS CONTEXTUAL COM ORIGEM "solucao-solar" E CTA "Simular projeto" */}
        <ContatoForm
          initialNecessidade="Energia Solar Fotovoltaica"
          initialOrigem="solucao-solar"
          initialValorConta={contaSimulador}
          tituloSecao="Simule o projeto fotovoltaico da sua empresa ou residência"
          subtituloSecao="Receba um dimensionamento técnico preliminar e estudo de ROI elaborado por nossa equipe de engenharia em Erechim/RS."
          textoBotaoFinal="Simular projeto agora"
        />

        {/* NAVEGAÇÃO CRUZADA ENTRE AS 4 SOLUÇÕES */}
        <NavegacaoSolucoes solucaoAtual="solar" />
      </main>

      {/* Footer com Diferenciação da Marca */}
      <Footer />

      {/* WhatsApp contextual para esta página */}
      <WhatsAppFloating
        contextMessage="Olá! Estou na página de Energia Solar da Delfos e gostaria de simular um projeto fotovoltaico."
        origemSecao="solucao-solar"
      />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
