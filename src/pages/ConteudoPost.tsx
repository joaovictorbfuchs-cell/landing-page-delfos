import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Tag,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Phone,
  Sun,
  BatteryCharging,
  Wrench,
  Car,
  ChevronRight,
  UserCheck,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'

import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import { ARTIGOS_BLOG, type ArtigoBlog } from '@/data/blog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { getPostBySlug, getPostImageUrl } from '@/services/content'
import type { PostRecord } from '@/types/content'

export default function ConteudoPost() {
  const { slug } = useParams<{ slug: string }>()
  const { toast } = useToast()

  const [dynamicPost, setDynamicPost] = useState<PostRecord | null>(null)
  const [loadingDb, setLoadingDb] = useState(true)

  useEffect(() => {
    async function loadPost() {
      if (!slug) return
      setLoadingDb(true)
      try {
        const item = await getPostBySlug(slug)
        // Garante que só exibe se o status for publicado (se rascunho, ignora)
        if (item && item.status === 'publicado') {
          setDynamicPost(item)
        }
      } catch (err) {
        console.warn('Erro ao buscar post por slug:', err)
      } finally {
        setLoadingDb(false)
      }
    }
    loadPost()
  }, [slug])

  const staticArtigo = useMemo(() => {
    return ARTIGOS_BLOG.find((item) => item.slug === slug)
  }, [slug])

  const artigosRelacionados = useMemo(() => {
    return ARTIGOS_BLOG.filter((item) => item.slug !== slug).slice(0, 3)
  }, [slug])

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Se não encontrar nem estático nem dinâmico e já terminou de buscar
  if (!loadingDb && !dynamicPost && !staticArtigo) {
    return <Navigate to="/conteudos" replace />
  }

  // Prepara modelo unificado
  const titulo = dynamicPost?.titulo || staticArtigo?.titulo || ''
  const subtitulo = dynamicPost?.subtitulo || staticArtigo?.subtitulo || ''
  const categoria = dynamicPost?.categoria || staticArtigo?.categoria || 'Energia Solar'
  const tempoLeitura =
    dynamicPost?.tempo_leitura || staticArtigo?.tempoLeitura || '5 min de leitura'
  const dataPublicacao = dynamicPost?.data_publicacao || staticArtigo?.dataPublicacao || ''
  const autorNome = dynamicPost?.autor_nome || staticArtigo?.autor.nome || 'Engenharia Delfos'
  const autorCargo =
    dynamicPost?.autor_cargo || staticArtigo?.autor.cargo || 'Especialista em Energia'
  const palavraChave =
    dynamicPost?.palavra_chave || staticArtigo?.palavraChavePrincipal || categoria
  const fotoUrl = dynamicPost ? getPostImageUrl(dynamicPost) : ''
  const conteudoTexto = dynamicPost?.conteudo || ''
  const resumo = dynamicPost?.resumo || staticArtigo?.resumo || ''
  const metaDescription = dynamicPost
    ? dynamicPost.resumo || dynamicPost.subtitulo || dynamicPost.titulo
    : staticArtigo?.metaDescription || ''
  const formNecessidade =
    staticArtigo?.solucaoRelacionada.necessidadeForm || 'Energia Solar Fotovoltaica'
  const formOrigem = staticArtigo?.origemLead || `conteudo-post-${slug}`

  const handleCompartilhar = () => {
    if (navigator.share) {
      navigator
        .share({
          title: titulo,
          text: resumo,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copiado!',
        description: 'O link do artigo foi copiado para sua área de transferência.',
      })
    }
  }

  const CategoryIcon =
    categoria === 'Armazenamento BESS'
      ? BatteryCharging
      : categoria === 'Operação & Manutenção'
        ? Wrench
        : categoria === 'Mobilidade Elétrica'
          ? Car
          : Sun

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title={`${titulo} | Delfos Solar Erechim`}
        description={metaDescription}
        canonicalPath={`/conteudos/${slug}`}
      />

      {/* Header Institucional */}
      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb Semântico */}
        <div className="bg-slate-50 border-b border-slate-200/70 py-3">
          <div className="max-w-4xl mx-auto px-6 text-xs text-slate-500 flex items-center gap-2 overflow-x-auto">
            <Link to="/" className="hover:text-solar-600 transition-colors shrink-0">
              Início
            </Link>
            <span>/</span>
            <Link to="/conteudos" className="hover:text-solar-600 transition-colors shrink-0">
              Conteúdos
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
              {titulo}
            </span>
          </div>
        </div>

        {/* Artigo Principal */}
        <article className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
          {/* Header do Post */}
          <header className="space-y-6 pb-10 border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/conteudos"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-solar-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar aos conteúdos</span>
              </Link>

              <button
                type="button"
                onClick={handleCompartilhar}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-frost hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-solar-600" />
                <span>Compartilhar artigo</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solar-100 text-solar-900 font-bold uppercase tracking-wider">
                <CategoryIcon className="w-3.5 h-3.5 text-solar-600" />
                {categoria}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {tempoLeitura}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {dataPublicacao}
              </span>
            </div>

            {/* H1 OBRIGATÓRIO */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2]">
              {titulo}
            </h1>

            {/* Subtítulo H2 semântico de apoio */}
            {subtitulo && (
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                {subtitulo}
              </p>
            )}

            {/* Ficha do Autor e Credenciais */}
            <div className="pt-4 flex items-center justify-between gap-4 p-4 rounded-2xl bg-frost border border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#081B30] text-solar-400 flex items-center justify-center font-bold shadow-xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{autorNome}</span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    {autorCargo}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Artigo Técnico Revisado</span>
              </div>
            </div>
          </header>

          {/* Foto de Capa (se houver via upload) ou Placeholder */}
          {fotoUrl ? (
            <div className="my-10 aspect-video w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
              <img src={fotoUrl} alt={titulo} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="my-10 aspect-video w-full rounded-3xl bg-gradient-to-br from-[#081B30] via-[#0B2C4F] to-[#0D3661] border border-white/10 flex flex-col items-center justify-center p-8 text-center text-white relative overflow-hidden shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-solar-400/20 text-solar-300 flex items-center justify-center mb-3 border border-solar-400/30">
                <CategoryIcon className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-solar-300">
                Foto Real de Campo — Aguardando
              </span>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Registro fotográfico da engenharia da Delfos Solar em obra no Sul do Brasil (
                {palavraChave}).
              </p>
              <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono">
                Erechim/RS • Delfos Engenharia
              </div>
            </div>
          )}

          {/* CONTEÚDO DO ARTIGO */}
          <div className="space-y-12 text-slate-700 leading-relaxed text-base sm:text-lg">
            {/* Se for do banco (texto completo) */}
            {dynamicPost && conteudoTexto && (
              <div className="space-y-6">
                {conteudoTexto.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Se for estático, renderiza seções estruturadas */}
            {staticArtigo &&
              !dynamicPost &&
              staticArtigo.secoes.map((secao, idx) => (
                <section key={idx} className="space-y-5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {secao.tituloH2}
                  </h2>

                  {secao.conteudo.map((paragrafo, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragrafo}
                    </p>
                  ))}

                  {/* Subseções H3 se houver */}
                  {secao.subsecoes && secao.subsecoes.length > 0 && (
                    <div className="space-y-6 pt-4 pl-4 sm:pl-6 border-l-2 border-solar-300">
                      {secao.subsecoes.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                            {sub.tituloH3}
                          </h3>
                          {sub.conteudo.map((subPar, spIdx) => (
                            <p key={spIdx} className="text-slate-600 text-base leading-relaxed">
                              {subPar}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}

            {/* Caixa de Conclusão e Destaque */}
            {staticArtigo && (
              <div className="p-6 sm:p-8 rounded-3xl bg-solar-50 border-2 border-solar-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-800 block">
                  Conclusão da Engenharia Delfos
                </span>
                <p className="text-base text-slate-800 leading-relaxed">
                  {staticArtigo.conclusao.texto}
                </p>
                <div className="p-3.5 rounded-xl bg-white border border-solar-200 text-sm font-semibold text-solar-900">
                  {staticArtigo.conclusao.destaque}
                </div>
              </div>
            )}

            {/* Perguntas Frequentes do Artigo (FAQ Schema Ready se estático) */}
            {staticArtigo?.faqs && staticArtigo.faqs.length > 0 && (
              <section className="pt-6 space-y-6">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Dúvidas Frequentes sobre {palavraChave}
                </h3>
                <div className="space-y-4">
                  {staticArtigo.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-5 rounded-2xl bg-frost border border-slate-200/90 space-y-2"
                    >
                      <h4 className="text-base font-bold text-slate-900 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-solar-600 shrink-0 mt-1" />
                        <span>{faq.pergunta}</span>
                      </h4>
                      <p className="text-sm text-slate-600 pl-6 leading-relaxed">{faq.resposta}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CTA CONTEXTUAL EXCLUSIVO DO ARTIGO */}
            <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-[#081B30] text-white space-y-6 shadow-xl relative overflow-hidden">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-300">
                  Próximo Passo Prático
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  Interessado em aplicar essa solução na sua empresa ou propriedade?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  A engenharia da Delfos Solar realiza o levantamento técnico preliminar,
                  dimensionamento e estudo de payback sem nenhum custo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Button
                  onClick={scrollToContato}
                  className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-6 rounded-xl text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Solicitar estudo de viabilidade técnica</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Link
                  to="/solucoes/energia-solar"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-white/20 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <span>Conhecer soluções de engenharia</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Tags e Palavras-chave do Artigo */}
            <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-solar-500" />
                Palavra-chave:
              </span>
              <span className="px-3 py-1 rounded-lg bg-solar-50 text-xs font-semibold text-solar-900 border border-solar-200">
                {palavraChave}
              </span>
            </div>
          </div>
        </article>

        {/* ARTIGOS RELACIONADOS */}
        {artigosRelacionados.length > 0 && (
          <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                    Continue Aprendendo
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Outros Artigos Técnicos
                  </h3>
                </div>
                <Link
                  to="/conteudos"
                  className="text-xs font-bold text-solar-700 hover:text-solar-900 flex items-center gap-1"
                >
                  <span>Ver todos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {artigosRelacionados.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/conteudos/${rel.slug}`}
                    className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-solar-400/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-frost text-slate-700 inline-block">
                        {rel.categoria}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-solar-600 transition-colors line-clamp-2">
                        {rel.titulo}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {rel.resumo}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>{rel.tempoLeitura}</span>
                      <span className="text-solar-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Ler <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Formulário Contextual com a Origem Específica do Lead deste Artigo */}
        <ContatoForm
          initialNecessidade={formNecessidade}
          initialOrigem={formOrigem}
          tituloSecao={`Solicite uma avaliação técnica de ${categoria}`}
          subtituloSecao={`Estudo preliminar e dimensionamento customizado conduzido pela equipe técnica de Erechim/RS referente ao tema: "${palavraChave}".`}
          textoBotaoFinal="Finalizar e Solicitar Avaliação"
        />
      </main>

      {/* Rodapé com Nota de Diferenciação */}
      <Footer />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
