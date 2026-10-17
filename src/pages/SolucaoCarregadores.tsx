import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Car,
  Zap,
  Building,
  Sliders,
  ShieldCheck,
  ArrowRight,
  Gauge,
  Cpu,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Fuel,
  Sparkles,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'
import WhatsAppFloating from '@/components/WhatsAppFloating'
import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import NavegacaoSolucoes from '@/components/NavegacaoSolucoes'
import { Button } from '@/components/ui/button'

export default function SolucaoCarregadores() {
  const [tipoAplicacao, setTipoAplicacao] = useState<'condominio' | 'frota' | 'residencial'>(
    'condominio',
  )

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Sub-ofertas conforme item 5.4 da especificação
  const subOfertas = [
    {
      titulo: 'Wallbox Inteligente Residencial e Condominial',
      desc: 'Carregadores de 7 kW a 22 kW em corrente alternada (AC) com cabo integrado Tipo 2. Autenticação por cartão RFID ou aplicativo no smartphone, conectividade Wi-Fi/4G e compatibilidade com 100% dos veículos elétricos e híbridos plug-in.',
      badge: 'Wallbox Inteligente',
      icone: Zap,
    },
    {
      titulo: 'Carregadores Semirrápidos e DC Fast Chargers',
      desc: 'Estações ultrarrápidas em corrente contínua (DC) de 30 kW até 150+ kW para postos de combustíveis, rodovias, frotas logísticas e centros comerciais. Recarga de 20% a 80% da bateria em menos de 30 minutos.',
      badge: 'DC Fast Charge',
      icone: Fuel,
    },
    {
      titulo: 'Gestão de Carga Inteligente e Medição Individualizada',
      desc: 'Infraestrutura coletiva em condomínios residenciais e comerciais com tecnologia DLM (mede o consumo por vaga e rateia individualmente). A energia consumida por cada morador é faturada direto no cartão ou aplicativo — eliminando atritos e discussões em assembleia.',
      badge: 'Gestão Inteligente & Rateio',
      icone: CreditCard,
    },
    {
      titulo: 'Infraestrutura para Frotas Corporativas e Eletropostos',
      desc: 'Engenharia completa de eletromobilidade: barramento blindado, quadros de proteção dedicados com DR Tipo B, SPDA e integração com usina solar própria para rodar frotas com custo próximo de zero por km.',
      badge: 'Frotas Corporativas',
      icone: Building2,
    },
  ]

  // Prova / Case de referência de condomínio da especificação
  const caseCondominio = {
    titulo:
      'Condomínio Residencial Multifamiliar — Case de Referência com Gestão de Carga Inteligente',
    subtitulo:
      'Rede dedicada, medição individual e gestão dinâmica sem aumento de demanda do transformador',
    desafio:
      'O prédio possuía demanda contratada de 75 kVA no transformador geral e mais de 40 vagas de garagem. Três moradores compraram carros elétricos e outros 10 planejavam adquirir. A concessionária exigia a troca onerosa do transformador da rua (orçada em mais de R$ 90.000) e os condôminos não aceitavam dividir a conta de luz da garagem.',
    solucaoDelfos: [
      'Implantação de barramento blindado com eletrocalhas dedicadas e proteção NBR 17019 em toda a garagem.',
      'Instalação de software DLM (Dynamic Load Management) conectado ao medidor de entrada do condomínio.',
      'Autenticação individual via RFID em cada ponto de recarga, vinculada ao apartamento do usuário.',
      'Modulação inteligente da potência: de madrugada, quando o prédio consome pouco, os carros recebem carga máxima; no início da noite, a potência é reduzida automaticamente.',
    ],
    resultadosMedidos: [
      'Zero aumento na demanda contratada do transformador (economia imediata de R$ 90.000+ em obra na concessionária).',
      'Rateio 100% individualizado via aplicativo — o condomínio não gasta um centavo da taxa ordinária com carros dos moradores.',
      'Capacidade de expansão futura para até 32 vagas sem necessidade de nova intervenção de engenharia civil.',
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070A10] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white pb-16 md:pb-0">
      <SeoMeta
        title="Carregadores Veiculares com Gestão de Carga Inteligente para Condomínios e Frotas"
        description="Infraestrutura de recarga veicular com gestão de carga inteligente sem sobrecarregar o transformador predial. Wallbox, DC fast charge e medição individual. Delfos."
        canonicalPath="/solucoes/carregadores"
      />

      {/* Header Escuro Integrado */}
      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb dark */}
        <div className="bg-[#090D15] border-b border-white/10 py-3">
          <div className="max-w-7xl mx-auto px-6 text-xs text-slate-400 flex items-center gap-2">
            <Link to="/" className="hover:text-solar-400 transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link to="/#solucoes" className="hover:text-solar-400 transition-colors">
              Soluções
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Carregadores Veiculares</span>
          </div>
        </div>

        {/* HERO SECTION DARK (Estilo Tesla Wall Connector / Supercharger) */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#090D15] via-[#070A10] to-[#05070C]">
          {/* Luzes e efeitos visuais estilo Tesla */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-solar-400/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Car className="w-3.5 h-3.5" />
                  Solução 04 • Eletromobilidade com Gestão de Carga Inteligente
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Carregadores Veiculares:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-solar-300">
                    infraestrutura inteligente e segura
                  </span>{' '}
                  sem trocar o transformador do seu prédio.
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  A eletrificação da frota gaúcha já começou. A Delfos projeta e executa toda a
                  engenharia elétrica de recarga com{' '}
                  <strong>
                    gestão de carga inteligente (DLM: mede o consumo por vaga e rateia
                    individualmente)
                  </strong>
                  , cabeamento antichamas conforme a NBR 17019 e aplicativo de rateio individual.
                </p>

                {/* Bloco do problema resolvido */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-400 block mb-1">
                    Problema que esta solução resolve:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Ausência de infraestrutura segura para carros elétricos e híbridos, risco de
                    superaquecimento em tomadas comuns da garagem, brigas entre vizinhos por divisão
                    da fatura do condomínio e custos proibitivos de aumento de carga junto à
                    concessionária.
                  </p>
                </div>

                {/* CTAs exclusivos */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Button
                    onClick={scrollToContato}
                    className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black px-8 py-6 text-base rounded-xl shadow-xl shadow-solar-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Solicitar vistoria</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <a
                    href="https://wa.me/5554991292121?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20vistoria%20para%20carregadores%20veiculares%20(Origem:%20solucao-carregadores)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all text-center"
                  >
                    <span>Falar com especialista de recarga</span>
                  </a>
                </div>

                {/* Badges de Normas & Tecnologia */}
                <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Conforme Norma NBR 17019</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Gestão Inteligente em Nuvem</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-solar-300" />
                    <span>Medição Individual por RFID/App</span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Foto real reservada + Painel de Tecnologia DLM */}
              <div className="lg:col-span-5 space-y-5">
                {/* Espaço reservado de foto real de carregadores */}
                <div className="rounded-3xl border-2 border-dashed border-indigo-500/30 bg-indigo-950/20 p-6 backdrop-blur-md relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Foto real de carregadores — aguardando
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Garagem / Condomínio
                    </span>
                  </div>

                  <div className="aspect-video rounded-2xl bg-[#09101C] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-3 group-hover:scale-105 transition-transform">
                      <Car className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Wallboxes Inteligentes & Barramento Blindado
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Instalação real em garagem predial com eletrocalhas suspensas, disjuntores DR
                      Tipo B e identificação de vaga personalizada.
                    </p>
                  </div>
                </div>

                {/* Tesla-style Specs Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <span className="text-xs font-mono uppercase text-indigo-300 font-bold">
                      Parâmetros de Recarga Inteligente
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Delfos Mobility</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Potência AC (Wallbox)
                      </span>
                      <strong className="text-sm font-bold text-white">7,4 kW até 22 kW</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Potência DC Rápida
                      </span>
                      <strong className="text-sm font-bold text-solar-400">30 kW a 150+ kW</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Gestão Dinâmica
                      </span>
                      <strong className="text-sm font-bold text-indigo-300">
                        Gestão de Carga Inteligente 100% Automática
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Rateio Financeiro
                      </span>
                      <strong className="text-sm font-bold text-emerald-400">
                        Fatura Direta por RFID / App
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROVA CENTRAL: CASE DE REFERÊNCIA DE CONDOMÍNIO (Item 5.4 da especificação) */}
        <section className="py-20 bg-[#090D15] border-t border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                Elemento de Prova • Case de Referência
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Como viabilizamos recarga para condomínios sem trocar de transformador
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                A solução definitiva para síndicos e condôminos: gestão de carga inteligente com
                rede dedicada e faturamento individualizado.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 lg:p-12 space-y-8 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold text-solar-400 uppercase tracking-wider">
                    Condomínio Residencial Gaúcho
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{caseCondominio.titulo}</h3>
                  <p className="text-xs text-slate-400 mt-1">{caseCondominio.subtitulo}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                    Sem Aumento de Demanda
                  </span>
                </div>
              </div>

              {/* Grid Desafio vs Solução */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Desafio */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>O Desafio Inicial do Condomínio</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0C121E] p-5 rounded-2xl border border-white/5">
                    {caseCondominio.desafio}
                  </p>
                </div>

                {/* Solução Delfos */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-300">
                    <Cpu className="w-4 h-4" />
                    <span>A Solução de Engenharia Delfos</span>
                  </div>
                  <ul className="space-y-2 bg-[#0C121E] p-5 rounded-2xl border border-white/5">
                    {caseCondominio.solucaoDelfos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Resultados Medidos */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-sky-950/30 to-emerald-950/40 border border-indigo-500/30">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-3">
                  Resultados Medidos e Auditados:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {caseCondominio.resultadosMedidos.map((res, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="leading-snug">{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  Quer levar essa solução para o seu condomínio ou empresa?
                </span>
                <Button
                  onClick={scrollToContato}
                  className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-3 text-xs sm:text-sm rounded-xl cursor-pointer"
                >
                  Solicitar vistoria técnica gratuita no condomínio
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA O SMART DLM (GESTÃO DINÂMICA DE CARGA) */}
        <section className="py-20 bg-[#070A10]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                Tecnologia Inteligente
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Como a gestão dinâmica de carga protege o prédio em tempo real
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Gauge className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">1. Medição em Alta Frequência</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Sensores instalados no barramento de entrada medem segundo a segundo quanto o
                  prédio está consumindo com elevadores, bombas d'água e apartamentos.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">2. Modulação Instantânea</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Quando o consumo dos apartamentos aumenta, o sistema reduz temporariamente a
                  amperagem dos carros. Quando o prédio entra em repouso (madrugada), a potência
                  volta ao máximo.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-solar-400/20 text-solar-300 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">3. Cobrança Automatizada</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  O software gera relatórios mensais discriminando o consumo de cada morador por
                  kWh, pronto para envio à administradora do condomínio ou desconto direto em
                  cartão.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUB-OFERTAS DETALHADAS (Item 5.4 da especificação) */}
        <section className="py-20 bg-[#090D15] border-t border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                Quatro Verticais de Eletromobilidade
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Soluções completas para residências, condomínios e eletropostos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subOfertas.map((sub, idx) => {
                const Icone = sub.icone
                return (
                  <div
                    key={idx}
                    className="rounded-3xl p-8 bg-white/5 border border-white/10 hover:border-indigo-400/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                            <Icone className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {sub.badge}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          0{idx + 1}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                        {sub.titulo}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-6">{sub.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-300">
                      <span>Engenharia Delfos</span>
                      <button
                        type="button"
                        onClick={scrollToContato}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Solicitar vistoria para este modelo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FORMULÁRIO 2 ETAPAS COM ORIGEM "solucao-carregadores" E CTA "Solicitar vistoria" */}
        <ContatoForm
          initialNecessidade="Carregadores Veiculares"
          initialOrigem="solucao-carregadores"
          destaqueDark={true}
          tituloSecao="Solicite uma vistoria técnica para recarga veicular"
          subtituloSecao="Nossos engenheiros inspecionam o quadro geral, a demanda contratada e as vagas de garagem para desenhar o projeto mais seguro e econômico."
          textoBotaoFinal="Solicitar vistoria técnica"
        />

        {/* NAVEGAÇÃO CRUZADA ENTRE AS 4 SOLUÇÕES */}
        <NavegacaoSolucoes solucaoAtual="carregadores" dark={true} />
      </main>

      {/* Footer com Diferenciação da Marca */}
      <Footer />

      {/* WhatsApp contextual para Carregadores */}
      <WhatsAppFloating
        contextMessage="Olá! Estou na página de Carregadores Veiculares da Delfos e gostaria de solicitar uma vistoria técnica para meu condomínio/empresa."
        origemSecao="solucao-carregadores"
      />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
