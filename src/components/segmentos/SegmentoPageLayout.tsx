import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Phone,
  FileCheck,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'

import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import { Button } from '@/components/ui/button'
import CaseModal from '@/components/cases/CaseModal'
import { CASES_DATA, type CaseStudy } from '@/data/cases'
import { SEGMENTOS_CONFIG, LISTA_SEGMENTOS_ORDEM, type SegmentoInfo } from '@/data/segmentos'

interface SegmentoPageLayoutProps {
  segmentoKey: keyof typeof SEGMENTOS_CONFIG
  fotoRealDescricao: string
  fotoRealLocal: string
}

export default function SegmentoPageLayout({
  segmentoKey,
  fotoRealDescricao,
  fotoRealLocal,
}: SegmentoPageLayoutProps) {
  const seg: SegmentoInfo = SEGMENTOS_CONFIG[segmentoKey]
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)

  // Cases reais cadastrados vinculados a este segmento
  const casesDoSegmento = CASES_DATA.filter((c) => c.segmento === seg.caseSegmentoKey)

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const IconeSegmento = seg.icone
  const isDark = seg.isDarkMode

  // WhatsApp contextual com origem e CTA do segmento
  const whatsappUrl = `https://wa.me/5554991292121?text=${encodeURIComponent(
    `Olá! Estava na página de ${seg.nome} no site da Delfos e gostaria de: ${seg.ctaRecomendado}. (Origem: segmento-${seg.slug})`,
  )}`

  return (
    <div
      className={`min-h-screen flex flex-col antialiased pb-16 md:pb-0 ${
        isDark
          ? 'bg-[#060D17] text-slate-100 selection:bg-emerald-500 selection:text-midnight-950'
          : 'bg-white text-slate-800 selection:bg-solar-400 selection:text-midnight-950'
      }`}
    >
      <SeoMeta title={seg.seo.title} description={seg.seo.description} canonicalPath={seg.path} />

      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb */}
        <div
          className={`border-b py-3 text-xs ${
            isDark
              ? 'bg-[#081220] border-white/10 text-slate-400'
              : 'bg-slate-50 border-slate-200/70 text-slate-500'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2">
            <Link to="/" className="hover:text-solar-400 transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link to="/#segmentos" className="hover:text-solar-400 transition-colors">
              Segmentos
            </Link>
            <span>/</span>
            <span className={isDark ? 'text-white font-semibold' : 'text-slate-900 font-semibold'}>
              {seg.nome}
            </span>
          </div>
        </div>

        {/* HERO SECTION DO SEGMENTO */}
        <section
          className={`relative py-16 lg:py-24 overflow-hidden border-b ${
            isDark
              ? 'bg-gradient-to-b from-[#091322] via-[#070F1B] to-[#050A12] border-white/10 text-white'
              : 'bg-gradient-to-b from-[#081B30] via-[#0B2C4F] to-[#0D3661] border-slate-200/20 text-white'
          }`}
        >
          {/* Background Glows */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-solar-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Coluna Texto & Pergunta Principal */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-solar-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  <IconeSegmento className="w-3.5 h-3.5 text-solar-400" />
                  Porta de Entrada • {seg.nome}
                </div>

                {/* PERGUNTA PRINCIPAL COMO HEADLINE OBRIGATÓRIA DA SEÇÃO 6 */}
                <div className="space-y-2">
                  <span className="text-xs sm:text-sm font-mono font-semibold text-solar-300 uppercase tracking-wider block">
                    Pergunta central do setor:
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                    “{seg.perguntaPrincipal}”
                  </h1>
                </div>

                {/* Resposta técnica e posicionamento Delfos */}
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal">
                  <strong className="text-white font-semibold">{seg.headlineComplemento}</strong>{' '}
                  {seg.descricaoHero}
                </p>

                {/* Box de Qualificação Inicial da Seção 6 */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-300 block">
                    Dado de qualificação inicial analisado:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-100 font-mono">
                    {seg.dadoQualificacao}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Button
                    onClick={scrollToContato}
                    className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black px-8 py-6 text-base rounded-xl shadow-xl shadow-solar-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{seg.ctaRecomendado}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all text-center"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Falar com especialista pelo WhatsApp</span>
                  </a>
                </div>

                {/* Trust Signals Rápidos */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Engenharia com ART / CREA-RS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-solar-400" />
                    <span>Sede em Erechim • Atuação em todo o Sul</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span>12 anos de experiência de campo</span>
                  </div>
                </div>
              </div>

              {/* Coluna Visual: Card de Foto Real Reservada + Snapshot de Qualificação */}
              <div className="lg:col-span-5 space-y-4">
                {/* Placeholder de Foto Real marcado explicitamente (GOVERNANÇA DO DOC) */}
                <div className="rounded-3xl border-2 border-dashed border-solar-400/40 bg-solar-950/20 p-6 backdrop-blur-md relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-solar-400/20 text-solar-300 border border-solar-400/30">
                      Foto real — aguardando
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-solar-400" />
                      {fotoRealLocal}
                    </span>
                  </div>

                  <div className="aspect-video rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-solar-400/10 border border-solar-400/30 flex items-center justify-center text-solar-400 mb-3 group-hover:scale-105 transition-transform">
                      <IconeSegmento className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Obra Real Delfos em {seg.nome}</h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                      {fotoRealDescricao}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Sem banco de imagens genérico</span>
                    <span className="text-solar-400 font-mono font-bold">Registro de Campo</span>
                  </div>
                </div>

                {/* Card de Qualificação Rápida com Callout */}
                <div
                  className={`rounded-3xl p-6 border shadow-xl ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-solar-500">
                      Engenharia de Aplicação
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                      Sul do Brasil
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold mb-2">
                    Como a Delfos avalia seu projeto em {seg.nome}:
                  </h3>

                  <ul className="space-y-2 text-xs leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Coleta dos parâmetros:</strong> {seg.dadoQualificacao}.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Simulação solarimétrica & elétrica:</strong> irradiação real da sua
                        cidade e perfil de carga.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Estudo de retorno:</strong> payback estimado, redução na fatura e
                        proposta sem compromisso.
                      </span>
                    </li>
                  </ul>

                  <Button
                    onClick={scrollToContato}
                    className="w-full mt-4 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold py-2.5 text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Preencher qualificação e solicitar proposta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO A DELFOS ATUA NO SEGMENTO: CROSS-LINK PARA AS SOLUÇÕES RELEVANTES */}
        <section
          className={`py-20 border-b ${
            isDark ? 'bg-[#050A12] border-white/10' : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-500 block mb-2">
                Arquitetura de Soluções
              </span>
              <h2
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Como a Delfos atua no segmento de {seg.nome}
              </h2>
              <p
                className={`text-sm sm:text-base mt-3 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Integramos o ecossistema completo — da geração fotovoltaica ao armazenamento em
                baterias (BESS), manutenção O&M com drone e recarga veicular — sob medida para as
                necessidades deste setor.
              </p>
            </div>

            {/* Grid de Soluções Relevantes (Cross-links) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seg.solucoesRelevantes.map((sol, idx) => {
                const IconeSolucao = sol.icone
                return (
                  <Link
                    key={idx}
                    to={sol.href}
                    className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between group ${
                      isDark
                        ? 'bg-white/5 border-white/10 hover:border-solar-400 hover:bg-white/10'
                        : 'bg-white border-slate-200/90 shadow-sm hover:shadow-lg hover:border-solar-400 hover:-translate-y-1'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-solar-400/15 border border-solar-400/30 flex items-center justify-center text-solar-400 group-hover:scale-105 transition-transform">
                          <IconeSolucao className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-solar-500/15 text-solar-400 uppercase">
                          {sol.badge}
                        </span>
                      </div>

                      <h3
                        className={`text-lg font-bold mb-2 group-hover:text-solar-500 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {sol.titulo}
                      </h3>

                      <p
                        className={`text-xs leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {sol.subtitulo}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/20 flex items-center justify-between text-xs font-bold text-solar-400">
                      <span>Conhecer solução completa</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* DORES E COMO RESOLVEMOS */}
        <section
          className={`py-20 border-b ${isDark ? 'bg-[#081220] border-white/10' : 'bg-white border-slate-200/80'}`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-500 block mb-2">
                Dores do Setor vs. Resposta de Engenharia
              </span>
              <h2
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Desafios específicos que resolvemos no seu dia a dia
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seg.doresERespostas.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 border space-y-4 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-500 block mb-1">
                      Desafio Frequente #{idx + 1}
                    </span>
                    <h3
                      className={`text-base font-bold leading-snug ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.dor}
                    </h3>
                  </div>

                  <div
                    className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                      isDark
                        ? 'bg-emerald-950/30 border border-emerald-900/50 text-emerald-300'
                        : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <span className="font-bold block uppercase text-[10px] tracking-wider">
                      Resposta Delfos:
                    </span>
                    <strong className="block font-semibold">{item.resposta}</strong>
                    <p
                      className={`text-[11px] leading-relaxed pt-1 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {item.comoResolvemos}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROVAS SOCIAIS E CASES REAIS DO SEGMENTO */}
        <section
          className={`py-20 border-b ${
            isDark ? 'bg-[#060D17] border-white/10' : 'bg-frost border-slate-200/80'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-500 block mb-2">
                  Provas Reais e Resultados Medidos
                </span>
                <h2
                  className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Cases da Delfos em {seg.nome}
                </h2>
                <p
                  className={`text-sm sm:text-base mt-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Projetos entregues com autorização para divulgação, monitoramento remoto conferido
                  e dados auditados.
                </p>
              </div>

              <Link
                to="/projetos"
                className="text-xs sm:text-sm font-bold text-solar-400 hover:underline flex items-center gap-1.5 shrink-0"
              >
                <span>Ver todos os cases de todos os segmentos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid de Cases */}
            {casesDoSegmento.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {casesDoSegmento.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                      isDark
                        ? 'bg-white/5 border-white/10 hover:border-solar-400 hover:bg-white/10'
                        : 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-solar-400 hover:-translate-y-1'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-solar-500/15 text-solar-400 uppercase">
                          {c.solucao}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{c.local}</span>
                      </div>

                      <h3
                        className={`text-lg font-bold mb-1 group-hover:text-solar-400 transition-colors ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {c.titulo}
                      </h3>

                      <p
                        className={`text-xs line-clamp-2 leading-relaxed mb-4 ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {c.desafioInicial}
                      </p>

                      {/* Métrica de destaque do Case */}
                      <div
                        className={`p-3.5 rounded-xl border mb-4 ${
                          isDark
                            ? 'bg-[#091322] border-white/10'
                            : 'bg-solar-50/80 border-solar-200/60'
                        }`}
                      >
                        <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                          {c.resultadoMedido.destaqueLabel}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-emerald-500">
                            {c.resultadoMedido.destaqueValor}
                          </span>
                          {c.resultadoMedido.dadoPendente && (
                            <span className="text-[10px] font-mono text-amber-500">
                              (a confirmar)
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-[11px] mt-1 leading-snug ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {c.resultadoMedido.descricao}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/20 flex items-center justify-between text-xs font-bold text-solar-400">
                      <span>Ver ficha técnica completa</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Caso o segmento ainda não tenha case publicado em cases.ts */
              <div
                className={`rounded-2xl p-8 border text-center max-w-xl mx-auto space-y-3 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-solar-400/20 text-solar-400 flex items-center justify-center mx-auto">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Projetos em {seg.nome} em fase de auditoria oficial
                </h3>
                <p className="text-xs leading-relaxed">
                  Conforme a governança da especificação Delfos, publicamos apenas cases com medição
                  auditada de ciclo completo e autorização formal do cliente. Temos dezenas de
                  instalações em operação neste perfil no Sul.
                </p>
                <Button
                  onClick={scrollToContato}
                  className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs"
                >
                  Solicitar referência técnica ao engenheiro
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* FAQ CURTO ESPECÍFICO DO SEGMENTO */}
        <section
          className={`py-20 border-b ${
            isDark ? 'bg-[#081220] border-white/10' : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-500 block mb-2">
                Dúvidas Frequentes
              </span>
              <h2
                className={`text-3xl font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Perguntas comuns sobre {seg.nome}
              </h2>
            </div>

            <div className="space-y-4">
              {seg.faq.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <h3
                    className={`text-base font-bold mb-2 flex items-start gap-2.5 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <HelpCircle className="w-5 h-5 text-solar-400 shrink-0 mt-0.5" />
                    <span>{item.pergunta}</span>
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed pl-7.5 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.resposta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTROS SEGMENTOS (ATALHOS CROSS-NAVIGATION ENTRE PORTAS DE ENTRADA) */}
        <section
          className={`py-16 border-b ${
            isDark ? 'bg-[#050A12] border-white/10' : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-500 block">
                  Outras Portas de Entrada
                </span>
                <h3
                  className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                  Conheça também nossas soluções para outros setores
                </h3>
              </div>
              <Link
                to="/#segmentos"
                className="text-xs font-semibold text-solar-400 hover:underline hidden sm:block"
              >
                Ver todos os 7
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {LISTA_SEGMENTOS_ORDEM.filter((s) => s.id !== seg.id).map((outro) => {
                const OutroIcon = outro.icone
                return (
                  <Link
                    key={outro.id}
                    to={outro.path}
                    className={`p-3.5 rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-2 group ${
                      isDark
                        ? 'bg-white/5 border-white/10 hover:border-solar-400 hover:bg-white/10'
                        : 'bg-white border-slate-200 hover:border-solar-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-solar-400/10 flex items-center justify-center text-solar-400 group-hover:scale-110 transition-transform">
                      <OutroIcon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-xs font-bold leading-tight group-hover:text-solar-400 ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {outro.nome}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE 2 ETAPAS COM QUALIFICAÇÃO ESPECÍFICA DO SEGMENTO */}
        <ContatoForm
          initialNecessidade={seg.necessidadePadrao}
          initialOrigem={`segmento-${seg.slug}`}
          tituloSecao={`Solicite seu estudo técnico para ${seg.nome}`}
          subtituloSecao={`Em 2 etapas rápidas, roteamos seus dados para o engenheiro especialista em ${seg.nome}. Coletamos seus parâmetros elétricos para dimensionamento preciso sem custos.`}
          textoBotaoFinal={seg.ctaRecomendado}
          destaqueDark={isDark}
          qualificacaoEspecificaLabel={seg.qualificacaoCampoLabel}
          qualificacaoEspecificaPlaceholder={seg.qualificacaoCampoPlaceholder}
          qualificacaoEspecificaObrigatoria={false}
        />
      </main>

      <Footer />
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />

      {/* Modal de Detalhes do Case se clicado */}
      <CaseModal
        caseStudy={selectedCase}
        onClose={() => setSelectedCase(null)}
        onSolicitarEstudo={() => {
          setSelectedCase(null)
          scrollToContato()
        }}
      />
    </div>
  )
}
