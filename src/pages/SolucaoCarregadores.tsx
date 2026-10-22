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

  // Sub-ofertas especializadas em recarga veicular
  const subOfertas = [
    {
      titulo: 'Carregador inteligente de parede residencial e condominial',
      desc: 'Carregadores modernos para residências e garagens prediais. Identificação por cartão de aproximação ou aplicativo no celular, compatíveis com todos os veículos elétricos e híbridos.',
      badge: 'Carregador de Parede',
      icone: Zap,
    },
    {
      titulo: 'Estações de carregamento rápido para empresas e rodovias',
      desc: 'Estações de alta potência para postos de combustíveis, rodovias, frotas logísticas e centros comerciais, permitindo recargas rápidas em poucos minutos.',
      badge: 'Carregamento Rápido',
      icone: Fuel,
    },
    {
      titulo: 'Gestão de consumo e rateio automático por vaga',
      desc: 'Infraestrutura coletiva para condomínios residenciais e comerciais onde o sistema mede o consumo de cada vaga e rateia sozinho. Cada morador paga apenas o que consumiu, sem gerar atritos em assembleia.',
      badge: 'Rateio Automático',
      icone: CreditCard,
    },
    {
      titulo: 'Infraestrutura completa para frotas corporativas',
      desc: 'Engenharia completa com quadros de proteção dedicados, cabeamento de alta segurança conforme as normas brasileiras e integração com usina solar própria para rodar sua frota com custo mínimo.',
      badge: 'Frotas Corporativas',
      icone: Building2,
    },
  ]

  // Exemplo ilustrativo de aplicação em condomínio
  const exemploCondominio = {
    titulo: 'Condomínio Residencial — Exemplo de Aplicação com Rateio Inteligente',
    subtitulo:
      'Rede dedicada, medição individual e gestão dinâmica sem sobrecarregar o transformador predial',
    desafio:
      'Com moradores adquirindo veículos elétricos e híbridos, o condomínio enfrentava o risco de sobrecarregar a rede elétrica do prédio. A concessionária exigiria obras caras na rede da rua e os condôminos não aceitavam dividir o custo da energia da garagem na taxa comum.',
    solucaoDelfos: [
      'Instalação de cabeamento e quadros dedicados em toda a garagem conforme as normas de segurança brasileiras.',
      'Sistema onde o equipamento mede o consumo de cada vaga e rateia sozinho.',
      'Identificação individual por cartão de aproximação ou celular em cada ponto, vinculada ao apartamento do usuário.',
      'Gestão inteligente da energia: na madrugada, quando o prédio consome pouco, os carros recarregam na potência máxima; nos horários de maior uso do prédio, a recarga se ajusta automaticamente.',
    ],
    resultadosEsperados: [
      'Sem necessidade de obras caras de aumento de transformador com a distribuidora.',
      'Rateio 100% individualizado via aplicativo: o condomínio não gasta a taxa dos moradores com recarga de terceiros.',
      'Infraestrutura pronta para expansão ordenada conforme novos moradores comprarem carros elétricos.',
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070A10] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white pb-16 md:pb-0">
      <SeoMeta
        title="Recarga veicular para condomínios, empresas e residências | Delfos Engenharia"
        description="Infraestrutura de recarga veicular inteligente sem sobrecarregar o transformador predial. Carregadores de parede, carregamento rápido e rateio individual por vaga. Delfos."
        canonicalPath="/solucoes/carregadores"
        ogImage="/og-image.png"
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
            <span className="text-white font-semibold">Recarga veicular</span>
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
                  Solução 04 • Recarga veicular
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Recarga veicular:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-solar-300">
                    infraestrutura inteligente e segura
                  </span>{' '}
                  sem trocar o transformador do seu prédio.
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  A eletrificação da frota gaúcha já começou. A Delfos projeta e executa toda a
                  engenharia elétrica de recarga: o sistema mede o consumo de cada vaga e rateia
                  sozinho, com instalação conforme as normas de segurança brasileiras e aplicativo
                  de controle individual.
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
                    <span>Solicitar orçamento gratuito</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <a
                    href="https://wa.me/5554991292121?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20carregadores%20veiculares%20(Origem:%20solucao-carregadores)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all text-center"
                  >
                    <span>Falar com especialista de recarga</span>
                  </a>
                </div>

                {/* Badges de Normas & Tecnologia */}
                <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Instalação conforme as normas de segurança brasileiras</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>O sistema mede o consumo e rateia sozinho</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-solar-300" />
                    <span>Identificação por cartão ou celular</span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Destaque de Tecnologia e Parâmetros */}
              <div className="lg:col-span-5 space-y-5">
                {/* Card Institucional de Recarga Inteligente */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Mobilidade Elétrica
                    </span>
                    <span className="text-xs text-slate-400">Condomínios e Empresas</span>
                  </div>

                  <div className="flex items-start gap-4 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        Garagens preparadas sem risco de sobrecarga
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Infraestrutura segura com proteção contra choques e sobrecargas,
                        identificação individual e rateio automático na fatura.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parâmetros em linguagem leiga */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <span className="text-xs uppercase text-indigo-300 font-bold">
                      Parâmetros da Solução
                    </span>
                    <span className="text-xs text-slate-400">Engenharia Delfos</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block">Carregadores de Parede</span>
                      <strong className="text-sm font-bold text-white">
                        Ideal para casas e prédios
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Carregamento Rápido</span>
                      <strong className="text-sm font-bold text-solar-400">
                        Ideal para frotas e postos
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Gestão da Energia</span>
                      <strong className="text-sm font-bold text-indigo-300">
                        Ajusta a potência sem sobrecarregar a rede
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Divisão da Conta</span>
                      <strong className="text-sm font-bold text-emerald-400">
                        Cada um paga o que gastou
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXEMPLO DE APLICAÇÃO EM CONDOMÍNIO */}
        <section className="py-20 bg-[#090D15] border-t border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                Exemplo de Aplicação em Condomínio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Como viabilizar recarga para condomínios sem trocar o transformador
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                A solução definitiva para síndicos e moradores: o sistema mede o consumo de cada
                vaga, rateia sozinho e evita sobrecarga da rede elétrica do prédio.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 p-8 lg:p-12 space-y-8 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-solar-400 uppercase tracking-wider">
                    Condomínio Residencial
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {exemploCondominio.titulo}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{exemploCondominio.subtitulo}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Sem Sobrecarga da Rede
                  </span>
                </div>
              </div>

              {/* Grid Desafio vs Solução */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Desafio */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>O Desafio do Condomínio</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0C121E] p-5 rounded-2xl border border-white/5">
                    {exemploCondominio.desafio}
                  </p>
                </div>

                {/* Solução Delfos */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-300">
                    <Cpu className="w-4 h-4" />
                    <span>A Solução de Engenharia Delfos</span>
                  </div>
                  <ul className="space-y-2 bg-[#0C121E] p-5 rounded-2xl border border-white/5">
                    {exemploCondominio.solucaoDelfos.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Benefícios Esperados */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-sky-950/30 to-emerald-950/40 border border-indigo-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-3">
                  Benefícios para o Condomínio:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {exemploCondominio.resultadosEsperados.map((res, idx) => (
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
                  Solicitar orçamento gratuito
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA A GESTÃO INTELIGENTE DE CARGA */}
        <section className="py-20 bg-[#070A10]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 block mb-2">
                Tecnologia Inteligente
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Como a gestão inteligente de carga protege o prédio em tempo real
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                  <Gauge className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">1. Medição Contínua</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Sensores medem a todo instante o quanto o prédio está consumindo com elevadores,
                  bombas de água e os apartamentos.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">2. Ajuste Automático</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Quando o consumo dos apartamentos aumenta, a velocidade de recarga dos carros é
                  ajustada suavemente. Na madrugada, quando o prédio repousa, a potência volta ao
                  máximo.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-solar-400/20 text-solar-300 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">3. Cobrança e Rateio</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  O sistema gera relatórios mensais claros com o consumo exato de cada morador,
                  pronto para rateio direto ou débito por cartão, sem onerar o condomínio.
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
                        <span>Solicitar orçamento gratuito</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FORMULÁRIO 2 ETAPAS COM ORIGEM "solucao-carregadores" E CTA PADRONIZADO */}
        <ContatoForm
          initialNecessidade="Carregadores Veiculares"
          initialOrigem="solucao-carregadores"
          destaqueDark={true}
          tituloSecao="Solicite seu orçamento gratuito para recarga veicular"
          subtituloSecao="Nossos engenheiros analisam as características elétricas do imóvel, o quadro geral e as vagas para desenhar o projeto mais seguro e econômico."
          textoBotaoFinal="Solicitar orçamento gratuito"
        />

        {/* NAVEGAÇÃO CRUZADA ENTRE AS 4 SOLUÇÕES */}
        <NavegacaoSolucoes solucaoAtual="carregadores" dark={true} />
      </main>

      {/* Footer com Diferenciação da Marca */}
      <Footer />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
