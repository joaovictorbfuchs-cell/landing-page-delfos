import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  Sun,
  SlidersHorizontal,
  Images,
  Camera,
  CheckCircle2,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoMeta from '@/components/SeoMeta'
import MobileCtaBar from '@/components/MobileCtaBar'
import { listObrasGaleria, getMediaFileUrl, type ObraGaleria } from '@/services/content'
import type { MediaRecord } from '@/types/content'
import { cn } from '@/lib/utils'

const BASE_URL = 'https://www.delfos.eng.br'

/**
 * Quantas obras aparecem antes do botão "Ver mais".
 * Existe para a página não montar dezenas de cards de uma vez quando o acervo
 * crescer. Com 15 obras o botão nem aparece; a partir de 19, passa a aparecer.
 */
const OBRAS_POR_LOTE = 18

/** Frase SEO da obra: tipo + potência + bairro, cidade — executada pela Delfos. */
function fraseObra(foto: MediaRecord, obra: ObraGaleria): string {
  if (foto.alt_texto && foto.alt_texto.trim()) return foto.alt_texto.trim()

  const servico = obra.tipo ? `${obra.tipo} solar fotovoltaico` : 'Instalação solar fotovoltaica'
  const potencia = obra.potencia ? ` de ${obra.potencia}` : ''
  const local = obra.cidade ? ` em ${obra.cidade}${obra.uf ? `/${obra.uf}` : ''}` : ''
  return `${servico}${potencia}${local} — obra executada pela Delfos Energia Solar`
}

function localCurto(obra: ObraGaleria): string {
  return obra.cidade ? `${obra.cidade}${obra.uf ? ` / ${obra.uf}` : ''}` : 'Sul do Brasil'
}

export default function GaleriaObras() {
  const [carregando, setCarregando] = useState(true)
  const [obras, setObras] = useState<ObraGaleria[]>([])
  const [filtroTipo, setFiltroTipo] = useState<string>('todas')
  const [filtroCidade, setFiltroCidade] = useState<string>('todas')
  const [limite, setLimite] = useState(OBRAS_POR_LOTE)

  // Obra aberta no modal (null = nenhuma)
  const [obraAberta, setObraAberta] = useState<ObraGaleria | null>(null)
  const [fotoAtual, setFotoAtual] = useState(0)

  useEffect(() => {
    let ativo = true
    async function carregar() {
      const lista = await listObrasGaleria()
      if (!ativo) return
      setObras(lista)
      setCarregando(false)
    }
    carregar()
    return () => {
      ativo = false
    }
  }, [])

  const tiposDisponiveis = useMemo(() => {
    const set = new Set<string>()
    obras.forEach((o) => {
      if (o.tipo) set.add(o.tipo)
    })
    return Array.from(set).sort()
  }, [obras])

  const cidadesDisponiveis = useMemo(() => {
    const mapa = new Map<string, number>()
    obras.forEach((o) => {
      if (o.cidade) mapa.set(o.cidade, (mapa.get(o.cidade) || 0) + 1)
    })
    return Array.from(mapa.entries()).sort((a, b) => b[1] - a[1])
  }, [obras])

  const obrasFiltradas = useMemo(() => {
    return obras.filter((o) => {
      const okTipo = filtroTipo === 'todas' || o.tipo === filtroTipo
      const okCidade = filtroCidade === 'todas' || o.cidade === filtroCidade
      return okTipo && okCidade
    })
  }, [obras, filtroTipo, filtroCidade])

  const obrasVisiveis = useMemo(() => obrasFiltradas.slice(0, limite), [obrasFiltradas, limite])

  const totalFotos = useMemo(() => obras.reduce((soma, o) => soma + o.fotos.length, 0), [obras])

  // Reseta o lote ao trocar filtro
  useEffect(() => {
    setLimite(OBRAS_POR_LOTE)
  }, [filtroTipo, filtroCidade])

  const abrirObra = (obra: ObraGaleria) => {
    setObraAberta(obra)
    setFotoAtual(0)
  }

  const fecharObra = () => setObraAberta(null)

  // Teclado dentro do modal da obra
  useEffect(() => {
    if (!obraAberta) return
    const total = obraAberta.fotos.length
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') fecharObra()
      if (e.key === 'ArrowRight') setFotoAtual((i) => (i + 1) % total)
      if (e.key === 'ArrowLeft') setFotoAtual((i) => (i - 1 + total) % total)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [obraAberta])

  // Bloqueia rolagem do fundo enquanto o modal estiver aberto
  useEffect(() => {
    if (obraAberta) {
      const anterior = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = anterior
      }
    }
  }, [obraAberta])

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // JSON-LD: ImageGallery com as obras (capa + detalhes), ligado à empresa
  const galeriaSchema = useMemo(() => {
    if (obras.length === 0) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      '@id': `${BASE_URL}/obras#galeria`,
      name: 'Obras e instalações da Delfos Energia Solar',
      description:
        'Galeria de usinas solares fotovoltaicas, sistemas BESS, carregadores veiculares e serviços de O&M executados pela Delfos Energia Solar no Sul do Brasil.',
      url: `${BASE_URL}/obras`,
      about: { '@id': `${BASE_URL}/#empresa` },
      image: obras.slice(0, 60).map((obra) => ({
        '@type': 'ImageObject',
        contentUrl: getMediaFileUrl(obra.capa, 'grande'),
        name: `${obra.titulo} — ${obra.potencia}`,
        description: obra.descricao || fraseObra(obra.capa, obra),
        ...(obra.cidade
          ? {
              contentLocation: {
                '@type': 'Place',
                name: `${obra.cidade}${obra.uf ? `/${obra.uf}` : ''}`,
              },
            }
          : {}),
      })),
    }
  }, [obras])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SeoMeta
        title="Obras e Instalações Realizadas | Galeria Delfos Energia Solar"
        description="Galeria com fotos reais das usinas solares, baterias BESS, carregadores veiculares e serviços de manutenção executados pela Delfos Energia Solar em Erechim, Erebango, Passo Fundo e região."
        canonicalPath="/obras"
        ogType="website"
        schemaJsonLd={galeriaSchema}
      />

      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-amber-50/20 border-b border-slate-200/80 pt-8 sm:pt-12 pb-10 sm:pb-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-950 border border-amber-200 mb-4 shadow-sm">
              <Images className="w-3.5 h-3.5" />
              <span>Fotos reais de obras entregues</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-midnight-950 tracking-tight leading-tight mb-4">
              Obras e instalações realizadas
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Cada card é uma obra entregue pela nossa equipe. Clique para ver todas as fotos e os
              detalhes técnicos da instalação.
            </p>

            {!carregando && obras.length > 0 && (
              <p className="text-sm text-slate-500 mt-4">
                <strong className="text-slate-800">{obras.length}</strong>{' '}
                {obras.length === 1 ? 'obra publicada' : 'obras publicadas'} ·{' '}
                <strong className="text-slate-800">{totalFotos}</strong> fotos
                {cidadesDisponiveis.length > 0 && (
                  <>
                    {' '}
                    em <strong className="text-slate-800">{cidadesDisponiveis.length}</strong>{' '}
                    {cidadesDisponiveis.length === 1 ? 'cidade' : 'cidades'}
                  </>
                )}
              </p>
            )}
          </div>
        </section>

        {/* Filtros */}
        {obras.length > 0 && (
          <section className="px-4 sm:px-6 pt-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtrar</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() => setFiltroTipo('todas')}
                      className={cn(
                        'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors cursor-pointer',
                        filtroTipo === 'todas'
                          ? 'bg-midnight-950 text-white border-midnight-950'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
                      )}
                    >
                      Todas as obras
                    </button>
                    {tiposDisponiveis.map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setFiltroTipo(tipo)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors cursor-pointer',
                          filtroTipo === tipo
                            ? 'bg-midnight-950 text-white border-midnight-950'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
                        )}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>

                  {cidadesDisponiveis.length > 1 && (
                    <select
                      value={filtroCidade}
                      onChange={(e) => setFiltroCidade(e.target.value)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-200 bg-white text-slate-700 cursor-pointer"
                      aria-label="Filtrar por cidade"
                    >
                      <option value="todas">Todas as cidades</option>
                      {cidadesDisponiveis.map(([cidade, total]) => (
                        <option key={cidade} value={cidade}>
                          {cidade} ({total})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Grade de obras */}
        <section className="px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-6xl mx-auto">
            {carregando ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
                  >
                    <div className="aspect-[4/3] bg-slate-200/70 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-2/3 bg-slate-200/70 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-slate-200/70 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : obras.length === 0 ? (
              <div className="max-w-xl mx-auto text-center py-14 px-6 rounded-3xl bg-slate-50 border border-slate-200">
                <Sun className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-slate-800 mb-2">Galeria em preparação</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Estamos organizando as fotos das obras com cidade, potência e tipo de instalação.
                  Enquanto publicamos, veja os cases completos com os resultados medidos de cada
                  projeto.
                </p>
                <Link
                  to="/projetos"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-midnight-950 text-white text-sm font-bold hover:bg-midnight-900 transition-colors"
                >
                  Ver projetos e resultados
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : obrasFiltradas.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Nenhuma obra com esse filtro.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFiltroTipo('todas')
                    setFiltroCidade('todas')
                  }}
                  className="font-bold text-midnight-900 underline cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {obrasVisiveis.map((obra, indice) => (
                    <article
                      key={obra.slug}
                      className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col"
                    >
                      <button
                        type="button"
                        onClick={() => abrirObra(obra)}
                        className="block w-full text-left cursor-pointer"
                        aria-label={`Ver fotos e detalhes: ${obra.titulo}`}
                      >
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          <img
                            src={getMediaFileUrl(obra.capa, 'leve')}
                            alt={fraseObra(obra.capa, obra)}
                            loading={indice < 6 ? 'eager' : 'lazy'}
                            decoding="async"
                            width={900}
                            height={675}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />

                          {obra.potencia && (
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-midnight-950/85 backdrop-blur-sm text-white text-[11px] font-bold">
                              <Zap className="w-3 h-3 text-amber-400" />
                              {obra.potencia}
                            </span>
                          )}

                          {obra.fotos.length > 1 && (
                            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold shadow-sm">
                              <Camera className="w-3 h-3" />
                              {obra.fotos.length} fotos
                            </span>
                          )}
                        </div>
                      </button>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{localCurto(obra)}</span>
                        </div>

                        <h2 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                          {obra.titulo}
                        </h2>

                        {obra.tipo && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <Building2 className="w-3 h-3 shrink-0" />
                            {obra.tipo}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() => abrirObra(obra)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-solar-700 hover:text-solar-800 transition-colors cursor-pointer"
                        >
                          Ver fotos e detalhes
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Botão "Ver mais" — só aparece quando há mais obras que o lote */}
                {obrasFiltradas.length > limite && (
                  <div className="text-center mt-8">
                    <button
                      type="button"
                      onClick={() => setLimite((l) => l + OBRAS_POR_LOTE)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-sm font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Ver mais obras ({obrasFiltradas.length - limite} restantes)
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA final */}
        <section className="px-4 sm:px-6 pb-12">
          <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-br from-[#06182C] via-[#0B2C4F] to-[#0A223B] text-white p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Quer uma obra sua nesta galeria?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
              Fazemos o estudo de viabilidade, o projeto, a instalação e a manutenção. Você recebe a
              economia medida, não uma promessa.
            </p>
            <button
              type="button"
              onClick={scrollToContato}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-midnight-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Solicitar estudo de viabilidade
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Modal da obra: todas as fotos + detalhes */}
      {obraAberta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Obra: ${obraAberta.titulo}`}
          className="fixed inset-0 z-50 bg-midnight-950/94 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-6 overflow-y-auto"
          onClick={fecharObra}
        >
          <div
            className="bg-white w-full max-w-5xl sm:rounded-3xl overflow-hidden shadow-2xl my-0 sm:my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={fecharObra}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-md transition-all cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Foto principal */}
            <div className="relative bg-slate-900">
              <img
                src={getMediaFileUrl(obraAberta.fotos[fotoAtual] ?? obraAberta.capa, 'grande')}
                alt={fraseObra(obraAberta.fotos[fotoAtual] ?? obraAberta.capa, obraAberta)}
                width={1600}
                height={1067}
                className="w-full h-auto max-h-[65vh] object-contain mx-auto"
              />

              {obraAberta.fotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setFotoAtual(
                        (i) => (i - 1 + obraAberta.fotos.length) % obraAberta.fotos.length,
                      )
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg cursor-pointer"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFotoAtual((i) => (i + 1) % obraAberta.fotos.length)}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg cursor-pointer"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-midnight-950/80 text-white text-xs font-bold">
                    {fotoAtual + 1} / {obraAberta.fotos.length}
                  </span>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {obraAberta.fotos.length > 1 && (
              <div className="px-3 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto">
                {obraAberta.fotos.map((foto, i) => (
                  <button
                    key={foto.id}
                    type="button"
                    onClick={() => setFotoAtual(i)}
                    className={cn(
                      'shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                      i === fotoAtual
                        ? 'border-solar-500 ring-2 ring-solar-400/40'
                        : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                    aria-label={`Foto ${i + 1} de ${obraAberta.fotos.length}`}
                  >
                    <img
                      src={getMediaFileUrl(foto, 'leve')}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Detalhes da obra */}
            <div className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {obraAberta.tipo && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-midnight-950 text-white">
                    {obraAberta.tipo}
                  </span>
                )}
                {obraAberta.potencia && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {obraAberta.potencia}
                  </span>
                )}
                {obraAberta.fotos.length > 1 && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 inline-flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    {obraAberta.fotos.length} fotos
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight-950 mb-1.5">
                {obraAberta.titulo}
              </h2>

              <p className="flex items-center gap-1.5 text-sm text-slate-600 mb-4">
                <MapPin className="w-4 h-4 text-amber-500" />
                {localCurto(obraAberta)}
              </p>

              {obraAberta.descricao && (
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  {obraAberta.descricao}
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 border-y border-slate-100 text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Tipo de obra
                  </span>
                  <strong className="text-slate-800">{obraAberta.tipo || '—'}</strong>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Potência instalada
                  </span>
                  <strong className="text-slate-800">{obraAberta.potencia || '—'}</strong>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Localização
                  </span>
                  <strong className="text-slate-800">{localCurto(obraAberta)}</strong>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Obra executada e comissionada pela equipe técnica da Delfos.</span>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    fecharObra()
                    scrollToContato()
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-sm transition-colors cursor-pointer"
                >
                  Quero uma obra assim
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/projetos"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  Ver projetos e resultados
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
