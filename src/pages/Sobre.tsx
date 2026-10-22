import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sun,
  Zap,
  ShieldCheck,
  Award,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  FileCheck2,
  Activity,
  Plane,
  Wrench,
  BatteryCharging,
  Compass,
  Star,
  Layers,
  HelpCircle,
  Building,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'

import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import { Button } from '@/components/ui/button'

export default function Sobre() {
  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Schema.org LocalBusiness enriquecido para a página Sobre
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://delfosengenharia.com.br/#empresa',
    name: 'Delfos Engenharia Solar',
    alternateName: 'Delfos Solar',
    legalName: 'Delfos Engenharia Solar LTDA',
    taxID: '21.379.952/0001-38',
    description:
      'Integradora de engenharia de campo em energia solar fotovoltaica, BESS industrial, operação e manutenção (O&M) com tempo de resposta combinado e recarga veicular com sede em Erechim/RS, atuando em todo o Sul do Brasil há 12 anos com mais de 3.000 projetos entregues.',
    url: 'https://delfosengenharia.com.br/sobre',
    telephone: '+55-54-99129-2121',
    email: 'contato@delfosengenharia.com.br',
    foundingDate: '2014',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Espírito Santo, 275, bairro Fátima',
      addressLocality: 'Erechim',
      addressRegion: 'RS',
      addressCountry: 'BR',
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Rio Grande do Sul' },
      { '@type': 'AdministrativeArea', name: 'Santa Catarina' },
      { '@type': 'AdministrativeArea', name: 'Paraná' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '3000',
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Sobre a Delfos Solar | Engenharia de Campo em Erechim e no Sul"
        description="Conheça a história de 12 anos da Delfos Solar: mais de 3.000 projetos entregues no Sul do Brasil, equipe própria com ART/CREA-RS e monitoramento remoto."
        canonicalPath="/sobre"
        schemaJsonLd={localBusinessSchema}
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
            <span className="text-slate-900 font-semibold">Sobre a Delfos Solar</span>
          </div>
        </div>

        {/* HERO INSTITUCIONAL */}
        <section className="relative bg-gradient-to-b from-[#081B30] via-[#0B2C4F] to-[#0D3661] text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-solar-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-400/15 border border-solar-400/30 text-solar-300 text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-solar-400" />
                Seção 11 da Especificação • Posicionamento e Autoridade
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Da geração à operação da sua energia:{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-300 via-amber-300 to-solar-400">
                  12 anos de engenharia real
                </span>{' '}
                no Sul do Brasil.
              </h1>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Nascida em Erechim/RS, a <strong>Delfos Engenharia Solar</strong> é uma integradora
                gaúcha de ciclo completo: projetamos, instalamos, garantimos aprovação junto à
                concessionária (homologação), operamos e mantemos ativos energéticos. São mais de
                3.000 projetos em campo, com respaldo de engenharia registrada no CREA-RS e índice
                de satisfação 4.9/5 e 5.0/5 no Google.
              </p>

              {/* Métricas-chave em linha */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-solar-400 block">
                    12 anos
                  </span>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    De mercado no Sul
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                    +3.000
                  </span>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Projetos entregues
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 block">
                    4.9 / 5
                  </span>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Avaliação Google
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-white block">100% ART</span>
                  <span className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">
                    Registrada CREA-RS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HISTÓRIA E ORIGEM EM ERECHIM/RS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-1">
                    Nossa Trajetória
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Construída sobre o rigor técnico gaúcho.
                  </h2>
                </div>

                <p className="text-base text-slate-600 leading-relaxed">
                  Fundada em Erechim, capital regional do Alto Uruguai gaúcho, a Delfos nasceu com
                  uma missão objetiva: desmistificar a transição energética e entregar projetos que
                  gerassem exatamente o que prometiam nos estudos preliminares.
                </p>

                <p className="text-base text-slate-600 leading-relaxed">
                  Ao longo de mais de uma década, acompanhamos todas as evoluções do setor no Brasil
                  — desde os primeiros inversores conectados à rede (on-grid) regulamentados pela RN
                  482 até o Marco Legal da Lei 14.300/2022, a chegada dos sistemas BESS para
                  empresas e indústrias e a modernização de recarga veicular com gestão de carga
                  inteligente (DLM).
                </p>

                <div className="p-5 rounded-2xl bg-frost border border-slate-200/80 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-solar-700 block">
                    Nossa Filosofia Operacional
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    "Não vendemos caixas de equipamentos fechadas. Nós projetamos usinas, calculamos
                    demandas elétricas reais, assumimos responsabilidade técnica formal no CREA-RS e
                    permanecemos ao lado do cliente durante as próximas décadas de operação."
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6">
                {/* Placeholder de Foto Real com regra de aguardando */}
                <div className="relative aspect-4/3 rounded-3xl bg-gradient-to-br from-[#081B30] via-[#0B2C4F] to-[#0D3661] border border-white/10 flex flex-col items-center justify-center p-8 text-center text-white overflow-hidden shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-solar-400/20 text-solar-300 flex items-center justify-center mb-3 border border-solar-400/30">
                    <Building className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-solar-300">
                    Foto Real — Aguardando
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Sede Técnica e Operacional em Erechim/RS
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    Escritório de engenharia, laboratório de monitoramento remoto e pátio logístico
                    da Delfos Solar no Alto Uruguai.
                  </p>
                  <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono">
                    Rua Espírito Santo, 275 • Fátima, Erechim/RS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS TÉCNICOS: ENGENHARIA DE CAMPO */}
        <section className="py-20 bg-slate-50 border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                Por Que a Delfos
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Os 4 Diferenciais da Nossa Engenharia de Campo
              </h2>
              <p className="text-base text-slate-600">
                O que separa uma integradora com corpo técnico permanente de representantes
                comerciais pontuais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Diferencial 1 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-solar-400/60 transition-all">
                <div className="w-12 h-12 rounded-xl bg-solar-100 text-solar-800 flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">100% ART no CREA-RS</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Todo projeto possui Anotação de Responsabilidade Técnica registrada. Garantia
                  legal, conformidade com a NBR 5410, NBR 16690 e segurança para seguradoras.
                </p>
              </div>

              {/* Diferencial 2 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-solar-400/60 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Termografia por Drone</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inspeção aérea de alta resolução que identifica microfissuras, sombreamento oculto
                  e pontos quentes (hotspots) sem interromper a operação da usina.
                </p>
              </div>

              {/* Diferencial 3 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-solar-400/60 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Monitoramento Remoto em Tempo Real
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monitoramento remoto contínuo dos inversores com comparação entre a geração
                  prevista e a geração solar real. Alertas imediatos caso ocorra qualquer desvio de
                  curva.
                </p>
              </div>

              {/* Diferencial 4 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-solar-400/60 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Equipes Próprias de Campo</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Montadores e eletricistas treinados com NR-10 e NR-35. Frotas equipadas com
                  ferramental calibrado para montagem rápida e limpa em telhados e solo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAPA DE ATUAÇÃO NO SUL DO BRASIL */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                  Presença Regional
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Atuação em todo o Sul do Brasil
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Com base operacional em <strong>Erechim/RS</strong>, atendemos com rapidez
                  municípios gaúchos, o oeste e meio-oeste de Santa Catarina e o sudoeste do Paraná.
                </p>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-frost border border-slate-200">
                    <MapPin className="w-4 h-4 text-solar-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Rio Grande do Sul:</strong>
                      <span>
                        Erechim, Passo Fundo, Marau, Caxias do Sul, Bento Gonçalves, Região
                        Metropolitana e Fronteira Noroeste.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-frost border border-slate-200">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Santa Catarina:</strong>
                      <span>Chapecó, Concórdia, Joaçaba, Xanxerê e Planalto Serrano.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-frost border border-slate-200">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">Paraná:</strong>
                      <span>Pato Branco, Francisco Beltrão e região Sudoeste.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                {/* Placeholder de Foto Real com regra de aguardando */}
                <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-[#081B30] to-[#0D3661] border border-white/10 flex flex-col items-center justify-center p-8 text-center text-white overflow-hidden shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-solar-400/20 text-solar-300 flex items-center justify-center mb-3 border border-solar-400/30">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-solar-300">
                    Foto Real / Mapa Oficial — Aguardando
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    Mapa de Cobertura Geográfica e Polos de Atendimento
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    Distribuição das 3.000+ usinas instaladas pela Delfos Solar nos três estados do
                    Sul brasileiro.
                  </p>
                  <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono">
                    Geolocalização Delfos • RS/SC/PR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST SIGNALS & CERTIFICAÇÕES */}
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-1">
                Garantias e Conformidade
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Certificações e Entidades Homologadas
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">CREA-RS</h3>
                <p className="text-xs text-slate-500">
                  Empresa registrada sob responsabilidade de engenheiro habilitado.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <Star className="w-8 h-8 text-amber-500 mx-auto fill-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Nota 4.9 no Google</h3>
                <p className="text-xs text-slate-500">
                  Avaliações reais e auditadas de clientes em Erechim e região.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <Zap className="w-8 h-8 text-solar-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">Fabricantes de Primeira Linha</h3>
                <p className="text-xs text-slate-500">
                  Parcerias diretas com fabricantes de primeira linha com garantia de até 30 anos.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                <Award className="w-8 h-8 text-blue-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">Normas ABNT & NR</h3>
                <p className="text-xs text-slate-500">
                  Cumprimento estrito de NR-10, NR-35 e normas NBR 5410 e 17019.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE CONTATO COM ORIGEM INSTITUCIONAL */}
        <ContatoForm
          initialNecessidade="Energia Solar Fotovoltaica"
          initialOrigem="sobre-delfos-institucional"
          tituloSecao="Inicie sua jornada energética com a Delfos Solar"
          subtituloSecao="Fale diretamente com nossa engenharia de Erechim/RS para simular sua usina solar, avaliar seu projeto de BESS industrial ou estruturar manutenção com tempo de resposta garantido."
          textoBotaoFinal="Solicitar atendimento de engenharia"
        />
      </main>

      {/* Rodapé com Nota Obrigatória de Diferenciação */}
      <Footer />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
