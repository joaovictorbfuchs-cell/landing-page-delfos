import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Search,
  ArrowRight,
  Clock,
  Calendar,
  Tag,
  Sun,
  BatteryCharging,
  Wrench,
  Car,
  CheckCircle2,
  HelpCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'
import WhatsAppFloating from '@/components/WhatsAppFloating'
import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import { ARTIGOS_BLOG, type ArtigoBlog } from '@/data/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Conteudos() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas')
  const [busca, setBusca] = useState<string>('')

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const categorias = [
    { label: 'Todos os Conteúdos', value: 'todas', icon: BookOpen },
    { label: 'Energia Solar (EPC)', value: 'Energia Solar', icon: Sun },
    { label: 'Armazenamento BESS', value: 'Armazenamento BESS', icon: BatteryCharging },
    { label: 'Operação & Manutenção', value: 'Operação & Manutenção', icon: Wrench },
    { label: 'Mobilidade Elétrica', value: 'Mobilidade Elétrica', icon: Car },
  ]

  const artigosFiltrados = useMemo(() => {
    return ARTIGOS_BLOG.filter((artigo) => {
      const matchCategoria = categoriaFiltro === 'todas' || artigo.categoria === categoriaFiltro
      const term = busca.toLowerCase().trim()
      const matchBusca =
        !term ||
        artigo.titulo.toLowerCase().includes(term) ||
        artigo.subtitulo.toLowerCase().includes(term) ||
        artigo.resumo.toLowerCase().includes(term) ||
        artigo.palavraChavePrincipal.toLowerCase().includes(term) ||
        artigo.palavrasChaveSecundarias.some((kw) => kw.toLowerCase().includes(term))

      return matchCategoria && matchBusca
    })
  }, [categoriaFiltro, busca])

  // Artigo de destaque (primeiro da lista)
  const artigoDestaque = ARTIGOS_BLOG[0]

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Conteúdos & Blog Técnico de Engenharia Solar e BESS | Delfos Solar"
        description="Artigos práticos e técnicos sobre energia solar fotovoltaica em Erechim, BESS industrial, manutenção O&M de usinas e infraestrutura para recarga veicular no Sul."
        canonicalPath="/conteudos"
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
            <span className="text-slate-900 font-semibold">Conteúdos & Blog Técnico</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#081B30] via-[#0B2C4F] to-[#0D3661] text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-solar-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-400/15 border border-solar-400/30 text-solar-300 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-solar-400" />
                Seção 12 • Conhecimento Técnico & Engenharia Aplicada
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Conteúdos e inteligência de engenharia para sua{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-300 via-amber-300 to-solar-400">
                  decisão energética.
                </span>
              </h1>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Artigos didáticos e aprofundados sobre geração fotovoltaica em Erechim e no RS,
                dimensionamento de BESS industrial, rotinas de O&M com SLA e infraestrutura de
                recarga para condomínios. Sem promessas vazias — apenas engenharia prática.
              </p>

              {/* Trust signal badge */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Conteúdos elaborados por engenheiros com ART/CREA-RS</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-solar-400" />
                  <span>12 anos de experiência de campo no Sul</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Artigo em Destaque no Topo */}
        {artigoDestaque && (
          <section className="py-12 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                  Artigo em Destaque
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 transition-all hover:border-solar-400/50">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-3 py-1 rounded-full bg-solar-100 text-solar-900 font-bold uppercase tracking-wider">
                        {artigoDestaque.categoria}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {artigoDestaque.tempoLeitura}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {artigoDestaque.dataPublicacao}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                      <Link
                        to={`/conteudos/${artigoDestaque.slug}`}
                        className="hover:text-solar-600 transition-colors"
                      >
                        {artigoDestaque.titulo}
                      </Link>
                    </h2>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {artigoDestaque.resumo}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-500">
                        Por <strong className="text-slate-800">{artigoDestaque.autor.nome}</strong>{' '}
                        — {artigoDestaque.autor.cargo}
                      </div>

                      <Link
                        to={`/conteudos/${artigoDestaque.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-solar-700 hover:text-solar-900 transition-colors"
                      >
                        <span>Ler artigo completo</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {/* Placeholder de foto real conforme regra da especificação */}
                    <div className="relative aspect-video lg:aspect-4/3 rounded-2xl bg-gradient-to-br from-[#081B30] to-[#0D3661] border border-white/10 flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden shadow-inner">
                      <div className="w-12 h-12 rounded-2xl bg-solar-400/20 text-solar-300 flex items-center justify-center mb-3 border border-solar-400/30">
                        <Sun className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-solar-300">
                        Foto Real — Aguardando
                      </span>
                      <p className="text-[11px] text-slate-300 mt-1 max-w-xs">
                        Instalação fotovoltaica residencial e comercial em telhado no Alto Uruguai
                        gaúcho (acervo técnico Delfos).
                      </p>
                      <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-mono">
                        Erechim/RS • 12 anos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FILTROS E BUSCA */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block mb-1">
                  Biblioteca Técnica
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Explore nossos artigos por tema
                </h2>
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar artigos e palavras-chave..."
                  className="pl-9 h-11 rounded-xl bg-frost border-slate-200 text-sm focus:border-solar-400"
                />
              </div>
            </div>

            {/* Categorias Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
              {categorias.map((cat) => {
                const Icon = cat.icon
                const isSelected = categoriaFiltro === cat.value
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategoriaFiltro(cat.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#081B30] text-white shadow-sm'
                        : 'bg-frost hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${isSelected ? 'text-solar-400' : 'text-slate-400'}`}
                    />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>

            {/* GRID DE ARTIGOS */}
            {artigosFiltrados.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-frost">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">
                  Nenhum artigo encontrado para a busca "{busca}"
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Tente buscar por termos mais genéricos como "solar", "BESS", "baterias", "O&M" ou
                  "carregador".
                </p>
                <Button
                  onClick={() => {
                    setBusca('')
                    setCategoriaFiltro('todas')
                  }}
                  className="mt-4 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl"
                >
                  Restaurar todos os artigos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {artigosFiltrados.map((artigo) => {
                  return (
                    <article
                      key={artigo.slug}
                      className="bg-white rounded-3xl border border-slate-200/90 hover:border-solar-400/60 transition-all p-6 sm:p-7 shadow-xs hover:shadow-md flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        {/* Placeholder Foto Real de Cada Artigo */}
                        <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-[#081B30] to-[#103A66] border border-white/10 flex flex-col items-center justify-center p-4 text-center text-white relative overflow-hidden">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-solar-300">
                            Foto Real — Aguardando
                          </span>
                          <span className="text-[11px] text-slate-300 mt-0.5 line-clamp-1 max-w-xs">
                            {artigo.palavraChavePrincipal} • Delfos Engenharia de Campo
                          </span>
                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-semibold text-solar-300 backdrop-blur-xs border border-white/10">
                            {artigo.categoria}
                          </div>
                        </div>

                        {/* Metadados */}
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {artigo.tempoLeitura}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {artigo.dataPublicacao}
                          </span>
                        </div>

                        {/* Título H2 com Link */}
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-solar-600 transition-colors leading-snug">
                          <Link to={`/conteudos/${artigo.slug}`}>{artigo.titulo}</Link>
                        </h2>

                        {/* Resumo */}
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                          {artigo.resumo}
                        </p>

                        {/* Palavras-chave em tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-solar-500" />
                            Foco:
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-frost text-[11px] font-medium text-slate-700 border border-slate-200">
                            {artigo.palavraChavePrincipal}
                          </span>
                          {artigo.palavrasChaveSecundarias.slice(0, 2).map((kw) => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded-md bg-frost text-[11px] text-slate-500 border border-slate-200/80 hidden sm:inline"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer do Card com CTA */}
                      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          {artigo.autor.nome}
                        </span>

                        <Link
                          to={`/conteudos/${artigo.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-solar-700 group-hover:text-solar-900 group-hover:translate-x-0.5 transition-all"
                        >
                          <span>Acessar conteúdo</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner Informativo */}
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="p-8 sm:p-12 rounded-3xl bg-[#081B30] text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="space-y-3 max-w-2xl relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-400">
                  Engenharia Direta Sem Intermediários
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                  Tem um projeto em andamento ou quer avaliar a viabilidade da sua fatura de
                  energia?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Envie seus dados no formulário abaixo ou fale diretamente no WhatsApp com a equipe
                  de engenharia de Erechim/RS. Estudo preliminar sem custo ou compromisso.
                </p>
              </div>

              <div className="shrink-0 relative z-10 w-full sm:w-auto">
                <Button
                  onClick={scrollToContato}
                  className="w-full sm:w-auto bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-8 py-6 rounded-xl text-base shadow-lg cursor-pointer"
                >
                  Solicitar avaliação técnica
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário Geral de Contato */}
        <ContatoForm
          initialNecessidade="Energia Solar Fotovoltaica"
          initialOrigem="conteudos-listagem"
          tituloSecao="Fale com a Engenharia da Delfos Solar"
          subtituloSecao="Tire dúvidas sobre os temas abordados nos artigos ou solicite um estudo personalizado para sua empresa ou residência."
          textoBotaoFinal="Enviar solicitação ao engenheiro"
        />
      </main>

      {/* Rodapé com Nota de Diferenciação de Marca */}
      <Footer />

      {/* WhatsApp Flutuante */}
      <WhatsAppFloating
        contextMessage="Olá! Estou lendo os conteúdos do blog da Delfos e gostaria de tirar uma dúvida técnica."
        origemSecao="conteudos-geral"
      />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
