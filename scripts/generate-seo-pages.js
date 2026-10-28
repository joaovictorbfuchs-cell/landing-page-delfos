/**
 * Gera páginas estáticas por rota com as meta tags corretas (title, description,
 * canonical, Open Graph, Twitter) a partir do dist/index.html do Vite.
 *
 * Por quê: o SPA entrega o <head> da home em qualquer URL antes da hidratação
 * React. Crawlers e apps de mensagem que não executam JS viam todas as rotas
 * como cópias da home. Com este passo (roda após `vite build`), cada rota
 * pública passa a ser servida com seu próprio head.
 *
 * MANUTENÇÃO: os valores abaixo devem acompanhar os <SeoMeta> de cada página
 * (src/pages/* e src/data/segmentos.ts). Ao mudar um title/description lá,
 * atualize aqui também.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')

if (!existsSync(DIST)) {
  console.error('[seo-pages] dist/ não encontrado — rode após o vite build.')
  process.exit(1)
}

const BASE_URL =
  process.env.VITE_SITE_URL || 'https://landing-page-delfos-engenharia-672ab.goskip.app'

// Rota → metadados (espelham os componentes; ver nota de manutenção acima)
const ROTAS = [
  {
    path: '/solucoes/energia-solar',
    title: 'Energia solar em Erechim e Sul do Brasil | Delfos Engenharia',
    description:
      'Reduza até 90% da conta de energia com engenharia de ciclo completo da Delfos Solar. Mais de 3.000 projetos conectados à rede ou com baterias, telhado e solo no RS.',
  },
  {
    path: '/solucoes/bess',
    title: 'Baterias de Energia: BESS e Backup | Delfos',
    description:
      'Baterias (BESS) para empresas e indústrias: backup ininterrupto, corte de picos de consumo e economia no horário de ponta. Projeto e instalação no Sul do Brasil.',
  },
  {
    path: '/solucoes/om',
    title: 'O&M e Manutenção de Usinas Solares | Delfos',
    description:
      'Planos de O&M, monitoramento e termografia por drone para recuperar até 25% da geração da sua usina solar. Atendemos usinas de terceiros no Sul do Brasil.',
  },
  {
    path: '/solucoes/carregadores',
    title: 'Recarga Veicular para Condomínios e Empresas | Delfos',
    description:
      'Infraestrutura de recarga veicular com gestão inteligente de carga, sem trocar o transformador do prédio. Condomínios, empresas, frotas e eletropostos.',
  },
  {
    path: '/projetos',
    title: 'Projetos e Resultados Reais | Cases Auditados Delfos Solar',
    description:
      'Conheça os cases reais de engenharia da Delfos: solar fotovoltaico, BESS, O&M e recarga veicular com métricas auditadas, período de medição e comprovação.',
  },
  {
    path: '/sobre',
    title: 'Sobre a Delfos | 12 Anos e 3.000+ Projetos no RS',
    description:
      'Engenharia de campo em energia solar desde 2014. Sede em Erechim/RS, equipes próprias, 100% ART no CREA-RS, nota 4.9 no Google e +3.000 projetos entregues.',
  },
  {
    path: '/conteudos',
    title: 'Conteúdos & Blog Técnico de Engenharia Solar e BESS | Delfos Solar',
    description:
      'Artigos práticos e técnicos sobre energia solar fotovoltaica em Erechim, BESS industrial, manutenção O&M de usinas e infraestrutura para recarga veicular no Sul.',
  },
  {
    path: '/faq',
    title: 'Perguntas Frequentes sobre Energia Solar | Delfos',
    description:
      'Respostas diretas e detalhes técnicos sobre instalação solar, payback, créditos com a Lei 14.300, baterias de energia para backup no apagão e recarga veicular.',
  },
  {
    path: '/conteudos/autor/joao-victor-bagetti-fuchs',
    title: 'Eng. João Victor Bagetti Fuchs — CREA-RS 151894 | Delfos',
    description:
      'Responsável técnico da Delfos Engenharia. Engenheiro eletricista (CREA-RS 151894), 12 anos de campo em energia solar, BESS, O&M e mobilidade elétrica.',
  },
  {
    path: '/segmentos/residencias',
    title: 'Energia Solar e BESS Residencial no RS | Delfos Engenharia',
    description:
      'Energia solar e baterias (BESS) para residências no RS: economia de até 95% na conta, backup contra apagões e projeto com equipes próprias. Orçamento grátis.',
  },
  {
    path: '/segmentos/comercio-servicos',
    title: 'Energia Solar e BESS para Comércio | Delfos RS',
    description:
      'Economize em energia solar em Erechim e no Sul: geração, baterias e O&M com drone para comércios e serviços, sem interromper a operação.',
  },
  {
    path: '/segmentos/industria',
    title: 'Energia Solar, BESS e Demanda para Indústria | Delfos',
    description:
      'Geração solar, baterias BESS e gestão de demanda contratada para indústrias no RS: redução de custo sem interromper a operação. Engenharia Delfos.',
  },
  {
    path: '/segmentos/agronegocio',
    title: 'Energia Solar e BESS para o Agronegócio no RS | Delfos Solar',
    description:
      'Energia solar e baterias (BESS) para o agronegócio no RS: irrigação, armazenamento e geração distribuída para propriedades rurais.',
  },
  {
    path: '/segmentos/condominios',
    title: 'Carregadores para Condomínios | Delfos Engenharia RS',
    description:
      'Carregadores veiculares para condomínios com gestão de carga inteligente, rateio automático e sem troca do transformador. Instalação e homologação.',
  },
  {
    path: '/segmentos/investidores',
    title: 'Usinas de Solo e O&M para Investidores no RS | Delfos Engenharia',
    description:
      'Usinas de solo, O&M e monitoramento para investidores no RS: ativo protegido, performance auditada e receita recorrente. Portfólio Delfos.',
  },
  {
    path: '/segmentos/frotas-eletropostos',
    title: 'Infraestrutura de Recarga para Frotas e Eletropostos | Delfos RS',
    description:
      'Infraestrutura de recarga para frotas e eletropostos no RS: dimensionamento, gestão de carga, cobrança e operação. Engenharia Delfos.',
  },
]

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function setMetaContent(html, attr, attrValue, newContent) {
  const re = new RegExp(`<meta[^>]*${attr}="${attrValue}"[^>]*>`, 'm')
  return html.replace(re, (tag) =>
    tag.replace(/content="[^"]*"/, `content="${escapeHtml(newContent)}"`),
  )
}

function applyMeta(html, { title, description, canonicalUrl }) {
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
  out = setMetaContent(out, 'name', 'description', description)
  out = setMetaContent(out, 'property', 'og:title', title)
  out = setMetaContent(out, 'property', 'og:description', description)
  out = setMetaContent(out, 'property', 'og:url', canonicalUrl)
  out = setMetaContent(out, 'name', 'twitter:title', title)
  out = setMetaContent(out, 'name', 'twitter:description', description)
  out = out.replace(
    /<link[^>]*rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  )
  return out
}

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf8')

for (const rota of ROTAS) {
  const canonicalUrl = `${BASE_URL}${rota.path}`
  const html = applyMeta(baseHtml, {
    title: rota.title,
    description: rota.description,
    canonicalUrl,
  })
  const dir = join(DIST, rota.path.replace(/^\//, ''))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  console.log(`[seo-pages] gerado ${rota.path}/index.html`)
}

console.log(`[seo-pages] ${ROTAS.length} páginas com meta estática geradas em dist/.`)
