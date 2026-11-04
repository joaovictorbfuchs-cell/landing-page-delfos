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
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SeoMeta from '@/components/SeoMeta'
import MobileCtaBar from '@/components/MobileCtaBar'
import { listGaleriaObras, getMediaFileUrl } from '@/services/content'
import type { MediaRecord, TipoObraGaleria } from '@/types/content'
import { cn } from '@/lib/utils'

const BASE_URL = 'https://www.delfos.eng.br'

/**
 * Frase-padrão da obra — mesma convenção dos cases: serviço + potência + bairro,
 * cidade + cliente. Serve de alt da imagem, legenda e descrição estrutural.
 * Obra residencial nunca expõe nome de cliente (LGPD): usa só bairro + perfil.
 */
export function fraseObra(foto: MediaRecord): string {
  const partes: string[] = []

  const servico = foto.tipo_obra
    ? `${foto.tipo_obra} solar fotovoltaico`
    : 'Instalação solar fotovoltaica'
  const potencia = foto.potencia ? ` de ${foto.potencia}` : ''

  let local = ''
  if (foto.cidade) {
    const uf = foto.uf ? `/${foto.uf}` : ''
    local = foto.bairro ? ` em ${foto.bairro}, ${foto.cidade}${uf}` : ` em ${foto.cidade}${uf}`
  }

  partes.push(`${servico}${potencia}${local}`)

  const residencial = foto.tipo_obra === 'Telhado residencial'
  if (foto.titulo && !residencial) {
    partes.push(foto.titulo.split('—')[0].trim())
  }

  partes.push('obra executada pela Delfos Energia Solar')

  return partes.filter(Boolean).join(' — ')
}

/**
 * Nome curto da obra para o card.
 *
 * Muitas fotos herdaram o título genérico do acervo ("Instalação Solar Delfos —
 * Acervo (arquivo.jpg)"), que não diz nada a quem visita. Quando isso acontece,
 * usamos o nome do cliente gravado no alt_texto (que a migração preencheu a
 * partir da obra real) e, na falta dele, o tipo de obra com a potência.
 */
function tituloObra(foto: MediaRecord): string {
  const titulo = (foto.titulo || '').trim()
  const generico = !titulo || /acervo/i.test(titulo) || /^Instalação Solar Delfos/i.test(titulo)

  if (!generico) {
    const limpo = titulo.split('—')[0].trim()
    if (limpo && !/^Instalação Solar Delfos$/i.test(limpo)) return limpo
  }

  // Cliente fica no fim do alt_texto: "... em Erechim/RS — Cassul Distribuidora (Delfos..."
  const alt = foto.alt_texto || ''
  const match = alt.match(/—\s*(.+?)\s*\(Delfos/)
  if (match && match[1]) return match[1].trim()

  if (foto.tipo_obra && foto.potencia) return `${foto.tipo_obra} de ${foto.potencia}`
  return foto.tipo_obra || foto.potencia || 'Obra Delfos Energia Solar'
}

interface FotoGaleria {
  registro: MediaRecord
  urlLeve: string
  urlGrande: string
  frase: string
  titulo: string
}

function converterParaGaleria(registros: MediaRecord[]): FotoGaleria[] {
  return registros
    .filter((r) => Boolean(r.arquivo))
    .map((registro) => ({
      registro,
      urlLeve: getMediaFileUrl(registro, 'leve'),
      urlGrande: getMediaFileUrl(registro, 'grande'),
      frase: registro.alt_texto?.trim() || fraseObra(registro),
      titulo: tituloObra(registro),
    }))
}

export default function GaleriaObras() {
  const [carregando, setCarregando] = useState(true)
  const [fotos, setFotos] = useState<FotoGaleria[]>([])
  const [filtroTipo, setFiltroTipo] = useState<string>('todas')
  const [filtroCidade, setFiltroCidade] = useState<string>('todas')
  const [fotoAberta, setFotoAberta] = useState<number | null>(null)

  useEffect(() => {
    let ativo = true
    async function carregar() {
      const registros = await listGaleriaObras()
      if (!ativo) return
      setFotos(converterParaGaleria(registros))
      setCarregando(false)
    }
    carregar()
    return () => {
      ativo = false
    }
  }, [])

  const tiposDisponiveis = useMemo(() => {
    const set = new Set<string>()
    fotos.forEach((f) => {
      if (f.registro.tipo_obra) set.add(f.registro.tipo_obra)
    })
    return Array.from(set).sort()
  }, [fotos])

  const cidadesDisponiveis = useMemo(() => {
    const mapa = new Map<string, number>()
    fotos.forEach((f) => {
      const cidade = f.registro.cidade
      if (cidade) mapa.set(cidade, (mapa.get(cidade) || 0) + 1)
    })
    return Array.from(mapa.entries()).sort((a, b) => b[1] - a[1])
  }, [fotos])

  const fotosFiltradas = useMemo(() => {
    return fotos.filter((f) => {
      const okTipo = filtroTipo === 'todas' || f.registro.tipo_obra === filtroTipo
      const okCidade = filtroCidade === 'todas' || f.registro.cidade === filtroCidade
      return okTipo && okCidade
    })
  }, [fotos, filtroTipo, filtroCidade])

  // Navegação do lightbox com teclado
  useEffect(() => {
    if (fotoAberta === null) return
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') setFotoAberta(null)
      if (e.key === 'ArrowRight')
        setFotoAberta((i) => (i === null ? null : (i + 1) % fotosFiltradas.length))
      if (e.key === 'ArrowLeft')
        setFotoAberta((i) =>
          i === null ? null : (i - 1 + fotosFiltradas.length) % fotosFiltradas.length,
        )
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fotoAberta, fotosFiltradas.length])

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const fotoAtual = fotoAberta !== null ? fotosFiltradas[fotoAberta] : null

  // JSON-LD: ImageGallery com as fotos publicadas (entidade própria, ligada à empresa)
  const galeriaSchema = useMemo(() => {
    if (fotos.length === 0) return undefined
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      '@id': `${BASE_URL}/obras#galeria`,
      name: 'Obras e instalações da Delfos Energia Solar',
      description:
        'Galeria de usinas solares fotovoltaicas, BESS, carregadores veiculares e serviços de O&M executados pela Delfos Energia Solar no Sul do Brasil.',
      url: `${BASE_URL}/obras`,
      about: { '@id': `${BASE_URL}/#empresa` },
      image: fotos.slice(0, 60).map((f) => ({
        '@type': 'ImageObject',
        contentUrl: f.urlGrande,
        name: f.frase,
        description: f.frase,
        ...(f.registro.cidade
          ? {
              contentLocation: {
                '@type': 'Place',
                name: f.registro.bairro
                  ? `${f.registro.bairro}, ${f.registro.cidade}${f.registro.uf ? `/${f.registro.uf}` : ''}`
                  : `${f.registro.cidade}${f.registro.uf ? `/${f.registro.uf}` : ''}`,
              },
            }
          : {}),
      })),
    }
  }, [fotos])

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
              Cada foto abaixo é uma instalação entregue pela nossa equipe — com cidade, tipo de
              telhado e potência. Sem banco de imagens: é o nosso trabalho, como ele ficou.
            </p>

            {!carregando && fotos.length > 0 && (
              <p className="text-sm text-slate-500 mt-4">
                <strong className="text-slate-800">{fotos.length}</strong>{' '}
                {fotos.length === 1 ? 'foto publicada' : 'fotos publicadas'}
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
        {fotos.length > 0 && (
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

        {/* Grade de fotos */}
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
            ) : fotos.length === 0 ? (
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
            ) : fotosFiltradas.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Nenhuma foto com esse filtro.{' '}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {fotosFiltradas.map((foto, indice) => (
                  <figure
                    key={foto.registro.id}
                    className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setFotoAberta(indice)}
                      className="block w-full text-left cursor-pointer"
                      aria-label={`Ampliar: ${foto.frase}`}
                    >
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={foto.urlLeve}
                          alt={foto.frase}
                          loading={indice < 6 ? 'eager' : 'lazy'}
                          decoding="async"
                          width={900}
                          height={675}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                        {foto.registro.potencia && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-midnight-950/85 backdrop-blur-sm text-white text-[11px] font-bold">
                            <Zap className="w-3 h-3 text-amber-400" />
                            {foto.registro.potencia}
                          </span>
                        )}
                      </div>
                    </button>

                    <figcaption className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">
                          {foto.registro.bairro
                            ? `${foto.registro.bairro}, ${foto.registro.cidade}`
                            : foto.registro.cidade || 'Sul do Brasil'}
                          {foto.registro.uf ? ` / ${foto.registro.uf}` : ''}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">
                        {foto.titulo}
                      </p>
                      {foto.registro.tipo_obra && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3 shrink-0" />
                          {foto.registro.tipo_obra}
                        </p>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
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

      {/* Lightbox */}
      {fotoAtual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fotoAtual.frase}
          className="fixed inset-0 z-50 bg-midnight-950/92 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setFotoAberta(null)}
        >
          <button
            type="button"
            onClick={() => setFotoAberta(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {fotosFiltradas.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setFotoAberta((i) =>
                    i === null ? null : (i - 1 + fotosFiltradas.length) % fotosFiltradas.length,
                  )
                }}
                className="absolute left-2 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setFotoAberta((i) => (i === null ? null : (i + 1) % fotosFiltradas.length))
                }}
                className="absolute right-2 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <figure
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fotoAtual.urlGrande}
              alt={fotoAtual.frase}
              width={1600}
              height={1067}
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
            <figcaption className="text-center mt-4 max-w-2xl">
              <p className="text-white font-semibold text-sm sm:text-base">{fotoAtual.frase}</p>
              <p className="text-slate-400 text-xs mt-1">
                {fotoAtual.registro.tipo_obra}
                {fotoAtual.registro.potencia ? ` • ${fotoAtual.registro.potencia}` : ''}
                {fotoAtual.registro.cidade
                  ? ` • ${fotoAtual.registro.bairro ? `${fotoAtual.registro.bairro}, ` : ''}${fotoAtual.registro.cidade}${fotoAtual.registro.uf ? `/${fotoAtual.registro.uf}` : ''}`
                  : ''}
              </p>
            </figcaption>
          </figure>
        </div>
      )}

      <Footer />
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}

export type { TipoObraGaleria }
