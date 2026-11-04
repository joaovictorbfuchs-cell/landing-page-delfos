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
    { loc: '/obras', changefreq: 'monthly', priority: '0.3', lastmod: today }, // redireciona 301 para /projetos
    { loc: '/sobre', changefreq: 'monthly', priority: '0.8', lastmod: today },
    { loc: '/faq', changefreq: 'weekly', priority: '0.8', lastmod: today },
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

  // ----------------------------------------------------
  // Sitemap de imagens: fotos das obras publicadas na galeria (/projetos),
  // com local, data de instalação e vínculo com a empresa (Google Image Sitemap).
  // ----------------------------------------------------
  const xmlEscape = (texto) =>
    String(texto || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const potenciaNumerica = (texto) => {
    const m = String(texto || '')
      .replace(/\./g, '')
      .replace(',', '.')
      .match(/([\d.]+)/)
    return m ? parseFloat(m[1]) : 0
  }

  const altPadrao = (tipo, potencia, local) => {
    const sujeito = tipo ? tipo + ' solar fotovoltaico' : 'Instalação solar fotovoltaica'
    const pot = potencia ? ' de ' + potencia : ''
    const loc = local ? ' em ' + local : ''
    return sujeito + pot + loc + ' — obra executada pela Delfos Engenharia'
  }

  let imagensXml = ''
  try {
    const casesPublicados = $app.findRecordsByFilter(
      'cases',
      "status = 'publicado'",
      '-created',
      500,
      0,
    )
    const fotosGaleria = $app.findRecordsByFilter(
      'media',
      'publicado_galeria = true && arquivo != ""',
      'ordem,-created',
      500,
      0,
    )

    // Agrupa fotos por obra_slug e casas cada obra com seu case (cidade + potência)
    const casePorObra = new Map()
    for (let c = 0; c < casesPublicados.length; c++) {
      const caseRec = casesPublicados[c]
      const local = caseRec.getString('local') || ''
      const cidade = local.split('/')[0].trim().toLowerCase()
      const pot = potenciaNumerica(caseRec.getString('potencia_capacidade'))
      if (!cidade || !pot) continue
      casePorObra.set(cidade + '|' + pot, caseRec)
    }

    const obras = new Map() // slug -> { fotos: [], titulo, cidade, uf, potencia, tipo, caseRec }
    for (let f = 0; f < fotosGaleria.length; f++) {
      const foto = fotosGaleria[f]
      const slug = foto.getString('obra_slug')
      if (!slug) continue
      if (!obras.has(slug)) {
        const cidade = foto.getString('obra_cidade') || foto.getString('cidade')
        const uf = foto.getString('obra_uf') || foto.getString('uf')
        const potencia = foto.getString('obra_potencia') || foto.getString('potencia')
        const tipo = foto.getString('obra_tipo') || foto.getString('tipo_obra')
        const caseRec =
          casePorObra.get(String(cidade).trim().toLowerCase() + '|' + potenciaNumerica(potencia)) ||
          null
        obras.set(slug, {
          fotos: [],
          titulo: foto.getString('obra_titulo') || foto.getString('titulo'),
          cidade,
          uf,
          potencia,
          tipo,
          caseRec,
        })
      }
      obras.get(slug).fotos.push(foto)
    }

    let totalImagens = 0
    for (const obra of obras.values()) {
      const localCompleto = obra.cidade ? obra.cidade + (obra.uf ? '/' + obra.uf : '') : ''
      for (const foto of obra.fotos) {
        if (totalImagens >= 1000) break // limite do Google por URL no sitemap
        const alt =
          foto.getString('alt_texto').trim() || altPadrao(obra.tipo, obra.potencia, localCompleto)
        const legenda =
          obra.caseRec && obra.caseRec.getString('data_entrega')
            ? alt + '. Instalação concluída em ' + obra.caseRec.getString('data_entrega') + '.'
            : alt
        imagensXml +=
          '    <image:image>\n' +
          '      <image:loc>' +
          xmlEscape(
            baseUrl + '/api/files/media/' + foto.getId() + '/' + foto.getString('arquivo'),
          ) +
          '</image:loc>\n' +
          '      <image:title>' +
          xmlEscape(alt) +
          '</image:title>\n' +
          '      <image:caption>' +
          xmlEscape(legenda) +
          '</image:caption>\n' +
          (localCompleto
            ? '      <image:geo_location>' + xmlEscape(localCompleto) + '</image:geo_location>\n'
            : '') +
          '      <image:license>https://www.delfos.eng.br</image:license>\n' +
          '    </image:image>\n'
        totalImagens++
      }
    }
    console.log('Sitemap de imagens: ' + totalImagens + ' fotos de ' + obras.size + ' obras')
  } catch (err) {
    console.warn('Erro ao gerar sitemap de imagens:', err)
  }

  const allRoutes = fixedRoutes.concat(dynamicRoutes)

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
  for (let j = 0; j < allRoutes.length; j++) {
    const route = allRoutes[j]
    xml += '  <url>\n'
    xml += '    <loc>' + baseUrl + route.loc + '</loc>\n'
    if (route.lastmod) {
      xml += '    <lastmod>' + route.lastmod + '</lastmod>\n'
    }
    xml += '    <changefreq>' + route.changefreq + '</changefreq>\n'
    xml += '    <priority>' + route.priority + '</priority>\n'
    // As fotos das obras ficam vinculadas à página unificada de projetos
    if (route.loc === '/projetos' && imagensXml) {
      xml += imagensXml
    }
    xml += '  </url>\n'
  }
  xml += '</urlset>'

  e.response.header().set('Content-Type', 'application/xml; charset=utf-8')
  return e.string(200, xml)
})
