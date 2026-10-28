/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook para servir o sitemap.xml dinâmico.
 * Inclui:
 * - Rotas fixas institucionais e de soluções
 * - As 7 rotas de segmento de clientes
 * - Rotas de conteúdos (blog estático + posts dinâmicos publicados no PocketBase)
 */
routerAdd('GET', '/sitemap.xml', (e) => {
  const baseUrl = 'https://landing-page-delfos-engenharia-672ab.goskip.app'
  const today = new Date().toISOString().split('T')[0]

  // Rotas fixas da aplicação
  const fixedRoutes = [
    { loc: '/', changefreq: 'weekly', priority: '1.0', lastmod: today },
    { loc: '/solucoes/energia-solar', changefreq: 'monthly', priority: '0.9', lastmod: today },
    { loc: '/solucoes/bess', changefreq: 'monthly', priority: '0.9', lastmod: today },
    { loc: '/solucoes/om', changefreq: 'monthly', priority: '0.9', lastmod: today },
    { loc: '/solucoes/carregadores', changefreq: 'monthly', priority: '0.9', lastmod: today },
    { loc: '/projetos', changefreq: 'weekly', priority: '0.9', lastmod: today },
    { loc: '/sobre', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: '/segmentos/residencias', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: '/segmentos/comercio-servicos', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: '/segmentos/industria', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: '/segmentos/agronegocio', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: '/segmentos/condominios', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: '/segmentos/investidores', changefreq: 'monthly', priority: '0.8', lastmod: today },
    {
      loc: '/segmentos/frotas-eletropostos',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: today,
    },
    { loc: '/conteudos', changefreq: 'weekly', priority: '0.8', lastmod: today },
    // Posts do acervo técnico estático
    {
      loc: '/conteudos/manutencao-de-placa-solar-perda-geracao',
      changefreq: 'monthly',
      priority: '0.9',
      lastmod: '2025-03-14',
    },
    {
      loc: '/conteudos/autor/joao-victor-bagetti-fuchs',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: '2025-03-14',
    },
    {
      loc: '/conteudos/energia-solar-erechim-guia-completo',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: '2026-10-15',
    },
    {
      loc: '/conteudos/bess-industrial-armazenamento-baterias-guia-viabilidade',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: '2026-10-18',
    },
    {
      loc: '/conteudos/manutencao-usina-solar-om-monitoramento-dicas',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: '2026-10-20',
    },
    {
      loc: '/conteudos/carregador-veicular-condominio-dlm-instalacao-guia',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: '2026-10-22',
    },
  ]

  const knownSlugs = new Set([
    'manutencao-de-placa-solar-perda-geracao',
    'energia-solar-erechim-guia-completo',
    'bess-industrial-armazenamento-baterias-guia-viabilidade',
    'manutencao-usina-solar-om-monitoramento-dicas',
    'carregador-veicular-condominio-dlm-instalacao-guia',
  ])

  // Buscar posts dinâmicos da coleção posts com status 'publicado'
  const dynamicRoutes = []
  try {
    const publishedPosts = $app.findRecordsByFilter(
      'posts',
      "status = 'publicado'",
      '-updated',
      500,
      0,
    )
    for (let i = 0; i < publishedPosts.length; i++) {
      const post = publishedPosts[i]
      const slug = post.getString('slug')
      if (!slug || knownSlugs.has(slug)) continue

      let lastmod = today
      try {
        const updatedDate = post.getDateTime('updated')
        if (updatedDate) {
          lastmod = updatedDate.string().split(' ')[0]
        }
      } catch (_) {}

      dynamicRoutes.push({
        loc: `/conteudos/${slug}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: lastmod,
      })
    }
  } catch (err) {
    console.warn('Erro ao carregar posts publicados para sitemap:', err)
  }

  const allRoutes = fixedRoutes.concat(dynamicRoutes)

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  for (let j = 0; j < allRoutes.length; j++) {
    const route = allRoutes[j]
    xml += '  <url>\n'
    xml += '    <loc>' + baseUrl + route.loc + '</loc>\n'
    if (route.lastmod) {
      xml += '    <lastmod>' + route.lastmod + '</lastmod>\n'
    }
    xml += '    <changefreq>' + route.changefreq + '</changefreq>\n'
    xml += '    <priority>' + route.priority + '</priority>\n'
    xml += '  </url>\n'
  }
  xml += '</urlset>'

  e.response.header().set('Content-Type', 'application/xml; charset=utf-8')
  return e.string(200, xml)
})
