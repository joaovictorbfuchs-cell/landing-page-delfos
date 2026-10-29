import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Briefcase,
  FileCheck2,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'
import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import { Button } from '@/components/ui/button'
import { ARTIGOS_BLOG } from '@/data/blog'
import { getArticlePortfolioPhoto } from '@/services/portfolioImages'

export default function AutorJoaoVictor() {
  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const autorNomeCompleto = 'Eng. Eletricista João Victor Bagetti Fuchs'
  const creaRegistro = 'CREA-RS 151894'

  // Artigos de autoria ou co-autoria do autor
  const artigosAutor = ARTIGOS_BLOG.filter(
    (art) =>
      art.autor.nome.includes('João Victor') ||
      art.slug === 'manutencao-de-placa-solar-perda-geracao',
  )

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'João Victor Bagetti Fuchs',
    jobTitle: 'Engenheiro Eletricista e Responsável Técnico',
    worksFor: {
      '@type': 'Organization',
      name: 'Delfos Engenharia',
      url: 'https://landing-page-delfos-engenharia-672ab.goskip.app',
    },
    alumniOf: 'Engenharia Elétrica',
    knowsAbout: [
      'Operação e Manutenção Fotovoltaica (O&M)',
      'Termografia de Usinas Solares (IEC 62446-3)',
      'Projetos Fotovoltaicos de Média e Baixa Tensão',
      'Comissionamento e Ensaios ABNT NBR 16274',
    ],
    identifier: creaRegistro,
    url: 'https://landing-page-delfos-engenharia-672ab.goskip.app/conteudos/autor/joao-victor-bagetti-fuchs',
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Eng. João Victor Bagetti Fuchs | Responsável Técnico CREA-RS 151894 | Delfos Engenharia"
        description="Perfil profissional do Eng. Eletricista João Victor Bagetti Fuchs, Responsável Técnico da Delfos Engenharia (CREA-RS 151894). Artigos sobre O&M, termografia e geração solar."
        canonicalPath="/conteudos/autor/joao-victor-bagetti-fuchs"
        ogType="article"
        ogImage="/og-image.png"
        schemaJsonLd={personSchema}
      />

      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb */}
        <div className="bg-slate-50 border-b border-slate-200/70 py-3">
          <div className="max-w-5xl mx-auto px-6 text-xs text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-solar-600 transition-colors shrink-0">
              Início
            </Link>
            <span>/</span>
            <Link to="/conteudos" className="hover:text-solar-600 transition-colors shrink-0">
              Conteúdos
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate">
              Autor: {autorNomeCompleto}
            </span>
          </div>
        </div>

        {/* HERO DO AUTOR */}
        <section className="bg-gradient-to-b from-[#081B30] via-[#0B2C4F] to-[#0D3661] text-white py-14 sm:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Avatar com badge */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-solar-400 to-amber-500 text-midnight-950 font-black text-3xl sm:text-4xl flex items-center justify-center shadow-2xl border-4 border-white/10">
                  JV
                </div>
                <div
                  className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-[#081B30]"
                  title="Registro CREA ativo"
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Informações centrais */}
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-solar-400/20 text-solar-300 border border-solar-400/30 text-xs font-bold uppercase tracking-wider">
                    Responsável Técnico
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono font-bold">
                    {creaRegistro}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {autorNomeCompleto}
                </h1>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Engenheiro Eletricista com atuação focada em engenharia de campo, comissionamento
                  de usinas, diagnóstico termográfico com drone (IEC 62446-3) e programas
                  corporativos de Operação &amp; Manutenção (O&amp;M) na{' '}
                  <strong>Delfos Engenharia</strong>.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-solar-400" />
                    Responsável Técnico — Delfos Engenharia
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-solar-400" />
                    Engenharia Elétrica
                  </span>
                  <Link
                    to="/sobre"
                    className="inline-flex items-center gap-1 text-solar-300 hover:text-white font-semibold underline underline-offset-4"
                  >
                    Conhecer a história da Delfos Engenharia
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BIO COMPLETA E CREDENCIAIS TÉCNICAS */}
        <section className="py-16 max-w-5xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Coluna da esquerda: Bio detalhada */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                  Sobre o Engenheiro
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Engenharia de campo com rigor normativo
                </h2>
              </div>

              <div className="space-y-4 text-slate-700 leading-relaxed text-base">
                <p>
                  À frente da responsabilidade técnica da <strong>Delfos Engenharia</strong>, João
                  Victor Bagetti Fuchs lidera as rotinas de comissionamento, inspeção e recuperação
                  de geração em usinas solares de micro e minigeração em todo o Rio Grande do Sul e
                  Santa Catarina.
                </p>
                <p>
                  Sua atuação alia medições elétricas de precisão (curvas I-V, isolamento elétrico e
                  resistência de aterramento conforme a norma <strong>ABNT NBR 16274</strong>) à
                  termografia aérea calibrada (norma <strong>IEC 62446-3</strong>), permitindo
                  detectar falhas invisíveis antes que causem paradas não planejadas ou riscos de
                  arco elétrico.
                </p>
                <p>
                  Todos os diagnósticos e laudos de O&amp;M emitidos contam com{' '}
                  <strong>
                    Anotação de Responsabilidade Técnica (ART) formal registrada no CREA-RS
                  </strong>
                  , assegurando validade jurídica perante distribuidoras de energia, fabricantes
                  para acionamento de garantias e companhias seguradoras.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/solucoes/om"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 bg-frost hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl transition-colors"
                >
                  <span>Ver planos de O&amp;M da Delfos</span>
                  <ArrowRight className="w-4 h-4 text-solar-600" />
                </Link>

                <Link
                  to="/sobre"
                  className="text-xs font-semibold text-slate-600 hover:text-solar-600 underline underline-offset-4"
                >
                  Sobre a Delfos Engenharia (/sobre)
                </Link>
              </div>
            </div>

            {/* Coluna da direita: Ficha de Credenciais */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-solar-600" />
                  Credenciais e Especialidades
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>CREA-RS 151894:</strong> Registro profissional habilitado para emissão
                      de ART elétrica.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>ABNT NBR 16274:</strong> Ensaios de comissionamento e inspeção
                      periódica.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>IEC 62446-3:</strong> Inspeção termográfica externa em módulos
                      fotovoltaicos.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Laudos de Seguro:</strong> Dossiês técnicos para seguradoras e
                      fabricantes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>NR-10 e NR-35:</strong> Supervisão de segurança elétrica e trabalho em
                      altura.
                    </span>
                  </li>
                </ul>

                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                  Sede operacional: Rua Espírito Santo, 275 • Erechim/RS
                </div>
              </div>

              {/* Card de Prova Social Oficial */}
              <div className="p-5 rounded-2xl bg-[#081B30] text-white border border-white/10 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-400 block">
                  Volume de Atuação Oficial
                </span>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xl font-black text-solar-400 font-mono">12,05 MWp</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Potência instalada</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xl font-black text-emerald-400 font-mono">468 usinas</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Sob monitoramento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ARTIGOS PUBLICADOS POR ESTE AUTOR */}
          <div className="pt-8 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                  Acervo Técnico
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Artigos técnicos publicados
                </h3>
              </div>
              <Link
                to="/conteudos"
                className="text-xs font-bold text-solar-700 hover:text-solar-900 flex items-center gap-1"
              >
                <span>Ver todos os conteúdos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {artigosAutor.map((artigo) => {
                const foto = getArticlePortfolioPhoto(artigo.slug, artigo.categoria, 'leve')
                return (
                  <Link
                    key={artigo.slug}
                    to={`/conteudos/${artigo.slug}`}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-solar-400/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 relative">
                        <img
                          src={foto.url}
                          alt={foto.alt}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-midnight-950/80 text-[10px] font-bold text-solar-300 border border-white/10">
                          {artigo.categoria}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-400 font-medium">{artigo.tempoLeitura}</span>
                        <span className="text-slate-400">{artigo.dataPublicacao}</span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-solar-600 transition-colors leading-snug">
                        {artigo.titulo}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {artigo.resumo}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Obra Delfos Solar</span>
                      <span className="text-solar-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Ler artigo completo <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Formulário de contato para falar com a equipe de engenharia */}
        <ContatoForm
          initialNecessidade="O&M e Monitoramento"
          initialOrigem="autor-joao-victor-bagetti-fuchs"
          tituloSecao="Fale com a engenharia da Delfos"
          subtituloSecao="Solicite um diagnóstico técnico assinado com ART pelo Eng. João Victor Bagetti Fuchs para a sua usina."
          textoBotaoFinal="Solicitar Diagnóstico com o Engenheiro"
        />
      </main>

      <Footer />
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
