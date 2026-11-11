import { useEffect, useMemo, useState } from 'react'
import {
  MapPin,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  Sun,
  Images,
  Camera,
  CheckCircle2,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoMeta from '@/components/SeoMeta'
import MobileCtaBar from '@/components/MobileCtaBar'
import ContatoForm from '@/components/ContatoForm'
import {
  listPublishedCases,
  listObrasGaleria,
  listMedia,
  getCaseImageUrl,
  getMediaFileUrl,
  type ObraGaleria,
} from '@/services/content'
import type { CaseRecord, MediaRecord } from '@/types/content'
import { cn } from '@/lib/utils'

const BASE_URL = 'https://www.delfos.eng.br'

/** Card de projeto: case publicado + as fotos do projeto na biblioteca de mídia. */
interface ProjetoCard {
  caseRecord: CaseRecord
  obra: ObraGaleria | null
  fotos: Array<{ url: string; alt: string; contentUrlOriginal: string }>
}

function potenciaNumerica(texto: string): number {
  const m = String(texto)
    .replace(/\./g, '')
    .replace(',', '.')
    .match(/([\d.]+)/)
  return m ? parseFloat(m[1]) : 0
}

function cidadeDoCase(local: string | undefined): string {
  return (local || '').split('/')[0].trim()
}

function ufDoCase(local: string | undefined): string {
  const partes = (local || '').split('/')
  return (partes[1] || '').trim()
}

/** Mesma potência (25,0 kWp == 25 kWp) e mesma cidade identificam o projeto do case. */
function mesmaObra(caseItem: CaseRecord, obra: ObraGaleria): boolean {
  const potCase = potenciaNumerica(caseItem.potencia_capacidade || '')
  const potObra = potenciaNumerica(obra.potencia || '')
  if (!potCase || !potObra || Math.abs(potCase - potObra) > 0.01) return false
  return cidadeDoCase(caseItem.local).toLowerCase() === (obra.cidade || '').toLowerCase()
}

/** Alt padronizado: tipo + potência + cidade — projeto executado pela Delfos Engenharia. */
function altObra(tipo: string, potencia: string, local: string | undefined): string {
  const sujeito = tipo ? `${tipo} solar fotovoltaico` : 'Instalação solar fotovoltaica'
  const pot = potencia ? ` de ${potencia}` : ''
  const loc = local ? ` em ${local}` : ''
  return `${sujeito}${pot}${loc} — projeto executado pela Delfos Engenharia`
}

export default function ProjetosRealizados() {
  const [carregando, setCarregando] = useState(true)
  const [projetos, setProjetos] = useState<ProjetoCard[]>([])
  const [aberto, setAberto] = useState<number | null>(null)
  const [fotoAtual, setFotoAtual] = useState(0)

  useEffect(() => {
    let ativo = true
    async function carregar() {
      const [cases, obras, todasMedias] = await Promise.all([
        listPublishedCases(),
        listObrasGaleria(),
        listMedia().catch(() => [] as MediaRecord[]),
      ])
      if (!ativo) return

      // Agrupar mídias vinculadas diretamente via case_id
      const mediaPorCase = new Map<string, MediaRecord[]>()
      todasMedias.forEach((m) => {
        if (!m.case_id) return
        const lista = mediaPorCase.get(m.case_id) || []
        lista.push(m)
        mediaPorCase.set(m.case_id, lista)
      })
      // Ordena fotos por `ordem` e depois por data
      mediaPorCase.forEach((lista) => {
        lista.sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999))
      })

      const cartoes: ProjetoCard[] = cases
        .filter((c) => !c.is_exemplo)
        .map((caseItem) => {
          const obra = obras.find((o) => mesmaObra(caseItem, o)) || null
          const fotos: ProjetoCard['fotos'] = []
          const vistas = new Set<string>()

          // 1. Fotos vinculadas DIRETAMENTE pelo novo campo case_id
          const fotosVinculadas = mediaPorCase.get(caseItem.id) || []
          if (fotosVinculadas.length > 0) {
            fotosVinculadas.forEach((f) => {
              if (vistas.has(f.arquivo)) return
              vistas.add(f.arquivo)
              const url = getMediaFileUrl(f, 'grande')
              if (url) {
                fotos.push({
                  url,
                  alt:
                    f.alt_texto?.trim() ||
                    altObra(
                      obra?.tipo || f.tipo_obra || '',
                      caseItem.potencia_capacidade || '',
                      caseItem.local,
                    ),
                  contentUrlOriginal: getMediaFileUrl(f, 'original'),
                })
              }
            })
          } else {
            // Fallback gracioso: capa do próprio case + fotos da obra legada
            const urlCapa = getCaseImageUrl(caseItem, 'grande')
            if (urlCapa) {
              fotos.push({
                url: urlCapa,
                alt: altObra(obra?.tipo || '', caseItem.potencia_capacidade || '', caseItem.local),
                contentUrlOriginal: urlCapa,
              })
            }
            ;(obra?.fotos || []).forEach((f) => {
              if (vistas.has(f.arquivo)) return
              vistas.add(f.arquivo)
              const url = getMediaFileUrl(f, 'grande')
              if (url) {
                fotos.push({
                  url,
                  alt:
                    f.alt_texto?.trim() ||
                    altObra(obra?.tipo || '', obra?.potencia || '', caseItem.local),
                  contentUrlOriginal: getMediaFileUrl(f, 'original'),
                })
              }
            })
          }

          // Se a foto de capa do case não estava entre as fotos vinculadas, adiciona se válida
          const urlCapaCase = getCaseImageUrl(caseItem, 'grande')
          if (urlCapaCase && fotos.length === 0) {
            fotos.push({
              url: urlCapaCase,
              alt: altObra(obra?.tipo || '', caseItem.potencia_capacidade || '', caseItem.local),
              contentUrlOriginal: urlCapaCase,
            })
          }

          return { caseRecord: caseItem, obra, fotos }
        })
        .filter((p) => p.fotos.length > 0)
        .sort((a, b) => {
          const da = a.caseRecord.destaque ? 0 : 1
          const db = b.caseRecord.destaque ? 0 : 1
          if (da !== db) return da - db
          return (
            potenciaNumerica(b.caseRecord.potencia_capacidade || '') -
            potenciaNumerica(a.caseRecord.potencia_capacidade || '')
          )
        })

      setProjetos(cartoes)
      setCarregando(false)
    }
    carregar()
    return () => {
      ativo = false
    }
  }, [])

  // Teclado no modal: setas navegam a galeria, Escape fecha
  useEffect(() => {
    if (aberto === null) return
    const total = projetos[aberto]?.fotos.length || 0
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') setAberto(null)
      if (total > 1 && e.key === 'ArrowRight') setFotoAtual((i) => (i + 1) % total)
      if (total > 1 && e.key === 'ArrowLeft') setFotoAtual((i) => (i - 1 + total) % total)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [aberto, projetos])

  // Bloqueia rolagem do fundo com o modal aberto
  useEffect(() => {
    if (aberto !== null) {
      const anterior = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = anterior
      }
    }
  }, [aberto])

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const abrir = (indice: number) => {
    setAberto(indice)
    setFotoAtual(0)
  }

  const totalFotos = useMemo(() => projetos.reduce((s, p) => s + p.fotos.length, 0), [projetos])

  // SEO: um ImageObject por foto, com local, data de instalação e vínculo com a empresa
  const imagensSchema = useMemo(() => {
    const itens = projetos.flatMap((p) =>
      p.fotos.map((foto) => ({
        '@type': 'ImageObject',
        contentUrl: foto.contentUrlOriginal,
        name: foto.alt,
        description:
          `${altObra(p.obra?.tipo || '', p.caseRecord.potencia_capacidade || '', p.caseRecord.local)}` +
          (p.caseRecord.data_entrega
            ? `. Instalação concluída em ${p.caseRecord.data_entrega.split('(')[0].trim()}.`
            : ''),
        contentLocation: {
          '@type': 'Place',
          name: p.caseRecord.local || '',
          address: {
            '@type': 'PostalAddress',
            addressLocality: cidadeDoCase(p.caseRecord.local),
            addressRegion: ufDoCase(p.caseRecord.local),
            addressCountry: 'BR',
          },
        },
        uploadDate: p.caseRecord.updated,
        creator: { '@id': `${BASE_URL}/#empresa` },
        representativeOfPage: false,
      })),
    )
    if (itens.length === 0) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${BASE_URL}/projetos#galeria-imagens`,
      name: 'Fotos dos projetos executados pela Delfos Engenharia',
      numberOfItems: itens.length,
      itemListElement: itens.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { ...item, '@id': `${BASE_URL}/projetos#foto-${i + 1}` },
      })),
    }
  }, [projetos])

  const projetoAberto = aberto !== null ? projetos[aberto] : null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SeoMeta
        title="Projetos Realizados | Delfos Energia Solar"
        description="Projetos reais executados pela Delfos Engenharia: usinas solares fotovoltaicas, BESS, carregadores veiculares e O&M com fotos reais, potência instalada, cidade e data de entrega."
        canonicalPath="/projetos"
        ogType="website"
        schemaJsonLd={imagensSchema}
      />

      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-b from-white via-slate-50 to-amber-50/20 border-b border-slate-200/80 pt-8 sm:pt-12 pb-10 sm:pb-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-950 border border-amber-200 mb-4 shadow-sm">
              <Images className="w-3.5 h-3.5" />
              <span>Fotos reais de projetos entregues</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-midnight-950 tracking-tight leading-tight mb-4">
              Projetos Realizados
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Cada card é um projeto entregue pela nossa equipe, com potência instalada, localização
              e fotos reais. Clique para navegar pela galeria de cada projeto.
            </p>

            {!carregando && projetos.length > 0 && (
              <p className="text-sm text-slate-500 mt-4">
                <strong className="text-slate-800">{projetos.length}</strong>{' '}
                {projetos.length === 1 ? 'projeto publicado' : 'projetos publicados'} ·{' '}
                <strong className="text-slate-800">{totalFotos}</strong> fotos dos projetos
              </p>
            )}
          </div>
        </section>

        {/* Grade de projetos (estética da galeria de projetos) */}
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
            ) : projetos.length === 0 ? (
              <div className="max-w-xl mx-auto text-center py-14 px-6 rounded-3xl bg-slate-50 border border-slate-200">
                <Sun className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-slate-800 mb-2">Galeria em preparação</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Estamos organizando as fotos dos projetos com cidade, potência e tipo de
                  instalação. Fale com a nossa engenharia para conhecer projetos na sua região.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projetos.map((projeto, indice) => {
                  const c = projeto.caseRecord
                  return (
                    <article
                      key={c.id}
                      className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex flex-col"
                    >
                      <button
                        type="button"
                        onClick={() => abrir(indice)}
                        className="block w-full text-left cursor-pointer"
                        aria-label={`Ver fotos e detalhes: ${c.titulo}`}
                      >
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          <img
                            src={projeto.fotos[0].url}
                            alt={projeto.fotos[0].alt}
                            loading={indice < 6 ? 'eager' : 'lazy'}
                            decoding="async"
                            width={900}
                            height={675}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />

                          {c.potencia_capacidade && (
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-midnight-950/85 backdrop-blur-sm text-white text-[11px] font-bold">
                              <Zap className="w-3 h-3 text-amber-400" />
                              {c.potencia_capacidade}
                            </span>
                          )}

                          {projeto.fotos.length > 1 && (
                            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold shadow-sm">
                              <Camera className="w-3 h-3" />
                              {projeto.fotos.length} fotos
                            </span>
                          )}
                        </div>
                      </button>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{c.local || 'Sul do Brasil'}</span>
                        </div>

                        <h2 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                          {c.titulo}
                        </h2>

                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 shrink-0" />
                          {projeto.obra?.tipo || c.setor}
                        </p>

                        <button
                          type="button"
                          onClick={() => abrir(indice)}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-solar-700 hover:text-solar-800 transition-colors cursor-pointer"
                        >
                          Ver fotos e detalhes
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Formulário de contato (destino dos CTAs) */}
        <section id="contato" className="px-4 sm:px-6 pb-4 scroll-mt-24">
          <div className="max-w-3xl mx-auto">
            <ContatoForm />
          </div>
        </section>
      </main>

      {/* Modal do projeto: header fixo, rolagem interna, footer sempre visível */}
      {projetoAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Projeto: ${projetoAberto.caseRecord.titulo}`}
          className="fixed inset-0 z-50 bg-midnight-950/90 backdrop-blur-sm flex items-stretch sm:items-center justify-center p-0 sm:p-6"
          onClick={() => setAberto(null)}
        >
          <div
            className="bg-white w-full max-w-5xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho fixo */}
            <div className="shrink-0 px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base sm:text-xl font-extrabold text-midnight-950 leading-snug line-clamp-2">
                  {projetoAberto.caseRecord.titulo}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">
                    {projetoAberto.caseRecord.local || 'Sul do Brasil'}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAberto(null)}
                className="shrink-0 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com rolagem interna */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {/* Foto principal navegável */}
              <div className="relative bg-slate-900">
                <img
                  src={projetoAberto.fotos[fotoAtual].url}
                  alt={projetoAberto.fotos[fotoAtual].alt}
                  width={1600}
                  height={1067}
                  className="w-full h-auto max-h-[55vh] object-contain mx-auto"
                />

                {projetoAberto.fotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setFotoAtual(
                          (i) => (i - 1 + projetoAberto.fotos.length) % projetoAberto.fotos.length,
                        )
                      }
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg cursor-pointer"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFotoAtual((i) => (i + 1) % projetoAberto.fotos.length)}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg cursor-pointer"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-midnight-950/80 text-white text-xs font-bold">
                      {fotoAtual + 1} / {projetoAberto.fotos.length}
                    </span>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {projetoAberto.fotos.length > 1 && (
                <div className="px-3 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto">
                  {projetoAberto.fotos.map((foto, i) => (
                    <button
                      key={foto.url}
                      type="button"
                      onClick={() => setFotoAtual(i)}
                      className={cn(
                        'shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                        i === fotoAtual
                          ? 'border-solar-500 ring-2 ring-solar-400/40'
                          : 'border-transparent opacity-70 hover:opacity-100',
                      )}
                      aria-label={`Foto ${i + 1} de ${projetoAberto.fotos.length}`}
                    >
                      <img
                        src={foto.url}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Informações básicas do card — sem ficha técnica estendida */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {projetoAberto.caseRecord.cliente && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-midnight-950 text-white">
                      {projetoAberto.caseRecord.cliente}
                    </span>
                  )}
                  {(projetoAberto.obra?.tipo || projetoAberto.caseRecord.setor) && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 inline-flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {projetoAberto.obra?.tipo || projetoAberto.caseRecord.setor}
                    </span>
                  )}
                  {projetoAberto.caseRecord.potencia_capacidade && (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 inline-flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {projetoAberto.caseRecord.potencia_capacidade}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Cliente
                    </span>
                    <strong className="text-slate-800 break-words">
                      {projetoAberto.caseRecord.cliente || '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Tipo de projeto
                    </span>
                    <strong className="text-slate-800">
                      {projetoAberto.obra?.tipo || projetoAberto.caseRecord.setor}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Potência
                    </span>
                    <strong className="text-slate-800">
                      {projetoAberto.caseRecord.potencia_capacidade || '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                      Cidade / UF
                    </span>
                    <strong className="text-slate-800">
                      {projetoAberto.caseRecord.local || '—'}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Projeto executado e comissionado pela equipe técnica da Delfos.</span>
                </div>
              </div>
            </div>

            {/* Rodapé fixo com os botões de ação — sempre visível */}
            <div className="shrink-0 px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setAberto(null)
                  scrollToContato()
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-sm transition-colors cursor-pointer"
              >
                Quero um projeto assim
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setAberto(null)}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-white transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
