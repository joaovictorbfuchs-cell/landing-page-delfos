/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook administrativo para importar e sincronizar fotos reais da Delfos Engenharia.
 *
 * Otimização e arquitetura:
 * 1. Conhece o acervo completo de URLs de projetos do site antigo delfos.eng.br raspado.
 * 2. Faz matching rigoroso e pontual (sem falsos positivos da Cassul).
 * 3. Se uma página não casar com nenhum case cadastrado, adiciona a foto à biblioteca 'media'
 *    com título descritivo e autêntico ou neutro (Regra do projeto: sem placeholders ou nomes falsos de cliente).
 * 4. Pré-gera as versões otimizadas 1600x0 e 900x0 via fsys.createThumb no PocketBase.
 * 5. Suporta paginação limpa por lotes (?offset=X&limit=Y) para evitar 504 Gateway Timeout.
 */
const executarSincronizacaoFotos = (e) => {
  let fsys = null
  try {
    const mediaCollection = $app.findCollectionByNameOrId('media')
    const casesCollection = $app.findCollectionByNameOrId('cases')

    try {
      fsys = $app.newFilesystem()
    } catch (fsErr) {
      console.log('Aviso ao inicializar filesystem para thumbs:', fsErr)
    }

    // Helper para pré-gerar os thumbs (1600x0 e 900x0) imediatamente no storage
    const gerarThumbsOtimizados = (record, fileFieldName) => {
      if (!fsys || !record) return
      const fileName = record.getString(fileFieldName)
      if (!fileName) return

      try {
        const basePath = record.baseFilesPath()
        const originalKey = basePath + '/' + fileName

        // Versão grande para capas (máx ~1600px de largura)
        try {
          const thumb1600Key = basePath + '/thumbs_' + fileName + '/1600x0'
          fsys.createThumb(originalKey, thumb1600Key, '1600x0')
        } catch (t1600Err) {
          console.log('Info thumb 1600x0:', fileName, t1600Err)
        }

        // Versão leve para cards/galerias (máx ~900px de largura)
        try {
          const thumb900Key = basePath + '/thumbs_' + fileName + '/900x0'
          fsys.createThumb(originalKey, thumb900Key, '900x0')
        } catch (t900Err) {
          console.log('Info thumb 900x0:', fileName, t900Err)
        }
      } catch (err) {
        console.log('Erro ao pré-processar thumbs:', fileName, err)
      }
    }

    // Definição dos cases com padrões ESTRITOS (sem falsos positivos)
    const DEFINICAO_CASES = [
      {
        slug: 'cassul-erechim-rs-155-0-kwp',
        nomeAmigavel: 'Cassul Distribuidora 155 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Cassul / Solução Solar / Comércio',
        patterns: [/cassul-erechim-rs-1550-kwp/i, /\/cassul-distribuidora\//i],
        tituloPrefixo: 'Obra Cassul Distribuidora 155 kWp',
      },
      {
        slug: 'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
        nomeAmigavel: 'Clanel Ind. e Comércio de Confecções 123,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Clanel / Indústria / Solução Solar',
        patterns: [/clanel/i],
        tituloPrefixo: 'Obra Clanel Confecções 123,5 kWp',
      },
      {
        slug: 'panificadora-garcia-passo-fundo-rs-112-5-kwp',
        nomeAmigavel: 'Panificadora Garcia 112,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Panificadora Garcia / Comércio / Solução Solar',
        patterns: [
          /panificadora-garcia-passo-fundo-rs-1125-kwp/i,
          /panificadora[-_\s]+garcia.*112/i,
        ],
        tituloPrefixo: 'Panificadora Garcia 112,5 kWp',
      },
      {
        slug: 'silo-erebango-rs-76-16-kwp',
        nomeAmigavel: 'Silo de Grãos Erebango 76,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Silo Erebango / Agronegócio / Solução Solar',
        patterns: [/silo-erebango/i, /silo.*76/i],
        tituloPrefixo: 'Silo de Grãos Erebango 76,16 kWp',
      },
      {
        slug: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
        nomeAmigavel: 'Posto Caminho do Mercosul 54,9 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Posto Mercosul / Comércio e Serviços',
        patterns: [/posto-caminho-do-mercosul/i, /cerro-do-meio-dia/i, /mercosul/i],
        tituloPrefixo: 'Posto Caminho do Mercosul 54,9 kWp',
      },
      {
        slug: 'usina-solar-solo-erechim-rs-40-8-kwp',
        nomeAmigavel: 'Usina Fotovoltaica de Solo Erechim 40,8 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Usina Solo / Investidores / Solução Solar',
        patterns: [/usina-fotovoltaica-erechim-rs-408-kwp/i, /usina.*solo.*40/i],
        tituloPrefixo: 'Usina Solar de Solo Erechim 40,8 kWp',
      },
      {
        slug: 'condominio-residencial-notabile-erechim-rs-32-kwp',
        nomeAmigavel: 'Condomínio Residencial Notabile 32 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Notabile / Condomínios / Solução Solar',
        patterns: [/notabile/i],
        tituloPrefixo: 'Condomínio Residencial Notabile 32 kWp',
      },
      {
        slug: 'pecuaria-de-leite-barao-de-cotegipe-rs-18-5-kwp',
        nomeAmigavel: 'Pecuária de Leite Barão de Cotegipe 18,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Pecuária Leite / Agronegócio',
        patterns: [/pecuaria-de-leite-barao-de-cotegipe/i, /pecuaria.*18525/i, /leite.*cotegipe/i],
        tituloPrefixo: 'Pecuária de Leite Barão de Cotegipe 18,5 kWp',
      },
      {
        slug: 'residencia-urbana-erechim-rs-6-48-kwp',
        nomeAmigavel: 'Residência Urbana Erechim 6,48 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Residência / Residências / Solução Solar',
        patterns: [/residencia-erechim-rs-648-kwp/i, /residencia.*648/i],
        tituloPrefixo: 'Residência Urbana Erechim 6,48 kWp',
      },
      {
        slug: 'system-desenvolvimento-software-erechim-rs-25-kwp',
        nomeAmigavel: 'System Desenvolvimento de Software 25 kWp',
        categoria: 'Solar EPC',
        destino: 'Case System Software / Indústria / Tecnologia',
        patterns: [/system-desenvolvimento/i, /system/i],
        tituloPrefixo: 'System Desenvolvimento de Software 25 kWp',
      },
      {
        slug: 'ervateira-bazia-inacio-martins-pr-93-5-kwp',
        nomeAmigavel: 'Ervateira Bazia 93,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Ervateira Bazia / Agronegócio',
        patterns: [/ervateira-bazia/i, /bazia/i],
        tituloPrefixo: 'Ervateira Bazia 93,5 kWp',
      },
      {
        slug: 'aviario-erebango-rs-42-16-kwp',
        nomeAmigavel: 'Aviário Erebango 42,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Aviário / Agronegócio',
        patterns: [/aviario-erebango/i, /aviario/i],
        tituloPrefixo: 'Aviário Erebango 42,16 kWp',
      },
      {
        slug: 'dal-pra-moveis-erechim-rs-74-43-kwp',
        nomeAmigavel: 'Dal Pra Comércio e Indústria de Móveis 74,43 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Dal Pra / Indústria',
        patterns: [/dal-pra/i],
        tituloPrefixo: 'Dal Pra Móveis 74,43 kWp',
      },
      {
        slug: 'arfes-refrigeracao-erechim-rs-30-kwp',
        nomeAmigavel: 'ARFES Refrigeração 30 kWp',
        categoria: 'Solar EPC',
        destino: 'Case ARFES Refrigeração / Indústria',
        patterns: [/arfes/i],
        tituloPrefixo: 'ARFES Refrigeração 30 kWp',
      },
      {
        slug: 'spazzini-tur-erechim-rs-32-16-kwp',
        nomeAmigavel: 'Spazzini Tur 32,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Spazzini Tur / Comércio e Serviços',
        patterns: [/spazzini/i],
        tituloPrefixo: 'Spazzini Tur 32,16 kWp',
      },
      {
        slug: 'supermercado-cavassola-erechim-rs-20-kwp',
        nomeAmigavel: 'Supermercado Cavassola 20 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Supermercado Cavassola / Comércio e Serviços',
        patterns: [/cavassola/i],
        tituloPrefixo: 'Supermercado Cavassola 20 kWp',
      },
      {
        slug: 'bem-estar-moveis-erechim-rs-25-41-kwp',
        nomeAmigavel: 'Bem Estar Móveis 25,41 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Bem Estar Móveis / Comércio e Serviços',
        patterns: [/bem-estar/i, /2541-kwp/i],
        tituloPrefixo: 'Bem Estar Móveis 25,41 kWp',
      },
      {
        slug: 'condominio-residencial-lyon-erechim-rs-15-kwp',
        nomeAmigavel: 'Condomínio Residencial Lyon 15 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Condomínio Lyon / Condomínios',
        patterns: [/res-lyon/i, /lyon/i],
        tituloPrefixo: 'Condomínio Residencial Lyon 15 kWp',
      },
      {
        slug: 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
        nomeAmigavel: 'Indra Distribuidora Agropecuária 9,75 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Indra / Agronegócio',
        patterns: [/indra.*975/i, /empresa-indra/i, /indra/i],
        tituloPrefixo: 'Indra Agropecuária 9,75 kWp',
      },
    ]

    // Helper para fazer GET HTTP com headers de browser
    const httpGet = (url, timeoutSecs = 10) => {
      try {
        return $http.send({
          url: url,
          method: 'GET',
          timeout: timeoutSecs,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          },
        })
      } catch (err) {
        console.log('Falha na requisição HTTP para:', url, err)
        return null
      }
    }

    // Lista abrangente de URLs de páginas de projetos reais do site delfos.eng.br
    const ALL_PROJECT_URLS = [
      // Cases principais cadastrados
      'https://www.delfos.eng.br/site/projetos/cassul-erechim-rs-1550-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-clanel-ind-e-comercio-de-confeccoes-ltda-erechim-rs-de-1235-kwp/',
      'https://www.delfos.eng.br/site/projetos/panificadora-garcia-passo-fundo-rs-1125-kwp/',
      'https://www.delfos.eng.br/site/projetos/silo-erebango-rs-7616-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-com-de-combustiveis-cerro-do-meio-dia-ltda-severiano-de-almeida-rs-de-54925-kwp/',
      'https://www.delfos.eng.br/site/projetos/usina-fotovoltaica-erechim-rs-408-kwp/',
      'https://www.delfos.eng.br/site/projetos/condominio-residencial-notabile-erechim-rs-32-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-pecuaria-de-leite-barao-de-cotegipe-rs-18525-kwp/',
      'https://www.delfos.eng.br/site/projetos/residencia-erechim-rs-648-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-25-kwp-system-desenvolvimento-de-software-ltda-erechim-rs/',
      'https://www.delfos.eng.br/site/projetos/ervateira-bazia-inacio-martins-pr-935-kwp/',
      'https://www.delfos.eng.br/site/projetos/aviario-erebango-rs-4216-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-dal-pra-comercio-e-industria-de-moveis-erechim-rs-7443-kw/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-30-kwp-arfes-refrigeracao-industria-e-comercio-ltda-erechim-rs/',
      'https://www.delfos.eng.br/site/projetos/spazzini-tur-erechim-rs-3216-kwp/',
      'https://www.delfos.eng.br/site/projetos/supermercado-cavassola-erechim-rs-20-kw/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-de-2541-kwp-erechim-rs/',
      'https://www.delfos.eng.br/site/projetos/condominio-res-lyon-erechim-rs-15-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-empresa-indra-erechim-rs-com-975-kwp/',
      // Projetos adicionais do acervo para enriquecer a biblioteca de mídia
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-de-1072-kwp-planalto-rs/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-scana-empreendimentos-imobiliarios-ltda-erechim-rs-de-4582-kwp/',
      'https://www.delfos.eng.br/site/projetos/sistema-de-4104-kwp/',
      'https://www.delfos.eng.br/site/projetos/real-papelaria-erechim-rs-300-kw/',
      'https://www.delfos.eng.br/site/projetos/egipol-erechim-rs-2345-kwp/',
      'https://www.delfos.eng.br/site/projetos/auto-eletrica-erechim-1404-kwp/',
      'https://www.delfos.eng.br/site/projetos/kids-cia-festas-e-eventos-erechim-rs-200-kw/',
      'https://www.delfos.eng.br/site/projetos/simao-imoveis-erechim-rs-2992-kwp/',
      'https://www.delfos.eng.br/site/projetos/cassul-agroshop-erechim-rs-201kwp/',
      'https://www.delfos.eng.br/site/projetos/fabiani-auto-pecas-erechim-rs-1407-kwp/',
      'https://www.delfos.eng.br/site/projetos/mercado-parque-livia-erechim-rs-1463-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-125-kwp-j-g-oldra-comercio-de-moveis-ltda-erechim-rs/',
      'https://www.delfos.eng.br/site/projetos/rosset-erechim-rs-1640-kwp/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-panificadora-pagliari-de-1023-kwp-barra-do-rio-azul-rs/',
      'https://www.delfos.eng.br/site/projetos/mecanica-agricola-strieski-erechim-rs-100-kwp/',
      'https://www.delfos.eng.br/site/projetos/mecanica-turbocenter-erechim-rs-82-kw/',
      'https://www.delfos.eng.br/site/projetos/gerador-fotovoltaico-9-kw-erechim-rs/',
      'https://www.delfos.eng.br/site/projetos/mecancia-telefor-erechim-rs-60-kw/',
      'https://www.delfos.eng.br/site/projetos/panificadora-garcia-passo-fundo-rs-693-kwp/',
    ]

    const projectLinksMap = {}
    for (let u = 0; u < ALL_PROJECT_URLS.length; u++) {
      projectLinksMap[ALL_PROJECT_URLS[u]] = true
    }

    const discoveredUrls = Object.keys(projectLinksMap)
    console.log(`Total de páginas de projetos no catálogo: ${discoveredUrls.length}`)

    // 2. Extrair fotos de cada página de projeto
    const fotosParaProcessar = []
    const fotosJaAdicionadas = {}

    // Limite de segurança no loop de raspagem HTML: 45 segundos
    const startTimeScrape = Date.now()
    for (let i = 0; i < discoveredUrls.length; i++) {
      if (Date.now() - startTimeScrape > 45000) {
        console.log('Limite de tempo atingido para leitura HTML. Prosseguindo com itens coletados.')
        break
      }

      const projUrl = discoveredUrls[i]

      // Identificar se casa com algum case cadastrado
      let caseCorrespondente = null
      for (let c = 0; c < DEFINICAO_CASES.length; c++) {
        const def = DEFINICAO_CASES[c]
        for (let p = 0; p < def.patterns.length; p++) {
          if (def.patterns[p].test(projUrl)) {
            caseCorrespondente = def
            break
          }
        }
        if (caseCorrespondente) break
      }

      let resProj = null
      try {
        resProj = httpGet(projUrl, 8)
      } catch (fErr) {
        continue
      }

      if (!resProj || resProj.statusCode !== 200) {
        continue
      }

      const projHtml = resProj.raw.toString()

      // Extrair título da página <h1 ...> para páginas adicionais
      let pageTitle = ''
      const matchH1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(projHtml)
      if (matchH1) {
        pageTitle = matchH1[1].replace(/<[^>]+>/g, '').trim()
      }

      // Extrair imagens FooBox ou tags <img>
      const imageUrlsFound = []

      // a) Links para fotos em alta resolução (FooBox / Lightbox)
      const regexAImg = /<a[^>]+href=["']([^"']+\.(?:jpe?g|png|webp))["'][^>]*>/gi
      let matchImg
      while ((matchImg = regexAImg.exec(projHtml)) !== null) {
        const imgUrl = matchImg[1]
        if (
          imgUrl.includes('/wp-content/uploads/') &&
          !imgUrl.includes('/cache/') &&
          !imgUrl.includes('logo') &&
          !imgUrl.includes('contato') &&
          !imgUrl.includes('camadaTransparente')
        ) {
          if (!imageUrlsFound.includes(imgUrl)) {
            imageUrlsFound.push(imgUrl)
          }
        }
      }

      // b) Tags <img>
      const regexImgTag = /<img[^>]+src=["']([^"']+\.(?:jpe?g|png|webp))["'][^>]*>/gi
      let matchTag
      while ((matchTag = regexImgTag.exec(projHtml)) !== null) {
        let imgUrl = matchTag[1]
        if (
          imgUrl.includes('logo') ||
          imgUrl.includes('camadaTransparente') ||
          imgUrl.includes('contato.png') ||
          imgUrl.includes('m.png') ||
          imgUrl.includes('231221.png')
        ) {
          continue
        }

        if (imgUrl.includes('/wp-content/uploads/')) {
          const limpaUrl = imgUrl.replace(/-[0-9]{3,4}x[0-9]{3,4}(\.[a-zA-Z]{3,4})$/, '$1')
          if (!imageUrlsFound.includes(limpaUrl) && !imageUrlsFound.includes(imgUrl)) {
            imageUrlsFound.push(limpaUrl)
          }
        }
      }

      // Adicionar fotos da página
      for (let imgIdx = 0; imgIdx < imageUrlsFound.length; imgIdx++) {
        const rawImgUrl = imageUrlsFound[imgIdx]
        if (fotosJaAdicionadas[rawImgUrl]) continue
        fotosJaAdicionadas[rawImgUrl] = true

        const urlParts = rawImgUrl.split('/')
        const originalFileName = urlParts[urlParts.length - 1].split('?')[0]
        const cleanBase = originalFileName
          .toLowerCase()
          .replace(/[^a-z0-9_.-]/g, '-')
          .replace(/-+/g, '-')

        let finalTitle = ''
        let finalDescricao = ''
        let finalDestino = ''
        let finalCategoria = 'Solar EPC'
        let targetCaseSlug = null
        let nomeArquivoFinal = ''

        if (caseCorrespondente) {
          targetCaseSlug = caseCorrespondente.slug
          nomeArquivoFinal = `${caseCorrespondente.slug}-${cleanBase}`
          finalTitle = `${caseCorrespondente.tituloPrefixo} — Foto ${imgIdx + 1} (${originalFileName})`
          finalDescricao = `Foto real da instalação do case ${caseCorrespondente.nomeAmigavel} (${originalFileName}).`
          finalDestino = caseCorrespondente.destino
          finalCategoria = caseCorrespondente.categoria
        } else {
          // Projeto sem case direto cadastrado: usar nome real da página ou nome neutro seguro
          const cleanPageName = pageTitle
            ? pageTitle.replace(/\s+/g, ' ').trim()
            : 'Instalação Solar Delfos'
          finalTitle = `${cleanPageName} — Foto ${imgIdx + 1} (${originalFileName})`
          finalDescricao = `Foto do acervo histórico de instalações fotovoltaicas Delfos Engenharia (${originalFileName}).`
          finalDestino = 'Biblioteca Geral / Solução Solar EPC'
          nomeArquivoFinal = `delfos-acervo-${cleanBase}`
        }

        fotosParaProcessar.push({
          url: rawImgUrl,
          titulo: finalTitle,
          categoria: finalCategoria,
          descricao: finalDescricao,
          destino_sugerido: finalDestino,
          caseSlug: imgIdx === 0 && targetCaseSlug ? targetCaseSlug : null,
          fallbackCaseSlug: targetCaseSlug,
          nomeArquivo: nomeArquivoFinal,
          ordem: imgIdx,
        })
      }
    }

    console.log(
      `Total de fotos encontradas no acervo para sincronizar: ${fotosParaProcessar.length}`,
    )

    // 3. Suporte a lotes para chamada rápida do front-end
    let reqOffset = 0
    let reqLimit = 6
    try {
      const qOffset = e.request.url.query().get('offset')
      const qLimit = e.request.url.query().get('limit')
      if (qOffset) reqOffset = parseInt(qOffset, 10) || 0
      if (qLimit) reqLimit = parseInt(qLimit, 10) || 6
    } catch (_) {}

    if (reqLimit < 1) reqLimit = 1
    if (reqLimit > 12) reqLimit = 12

    const totalFotosTotal = fotosParaProcessar.length
    const fotosLote = fotosParaProcessar.slice(reqOffset, reqOffset + reqLimit)
    const proximoOffset = reqOffset + reqLimit < totalFotosTotal ? reqOffset + reqLimit : null

    // 4. Salvar fotos no banco
    const resultados = []
    const casesAtualizados = {}
    let fotosSalvas = 0
    let fotosPuladas = 0

    for (let i = 0; i < fotosLote.length; i++) {
      const item = fotosLote[i]

      try {
        // Verificar se já existe registro em 'media' com mesmo título OU mesmo arquivo
        let mediaRecord = null
        try {
          mediaRecord = $app.findFirstRecordByData('media', 'titulo', item.titulo)
        } catch (_) {
          // Tentar buscar por parte do nome do arquivo
          try {
            mediaRecord = $app.findFirstRecordByFilter(
              'media',
              `arquivo ~ '${item.nomeArquivo.replace(/\.[^/.]+$/, '')}'`,
            )
          } catch (_) {}
        }

        const jaExisteArquivo = mediaRecord && mediaRecord.getString('arquivo')

        const targetCaseSlug =
          item.caseSlug || (!casesAtualizados[item.fallbackCaseSlug] ? item.fallbackCaseSlug : null)

        let targetCaseRecord = null
        if (targetCaseSlug) {
          try {
            targetCaseRecord = $app.findFirstRecordByData('cases', 'slug', targetCaseSlug)
          } catch (_) {}
        }

        const caseJaTemFoto = targetCaseRecord && targetCaseRecord.getString('foto')

        if (jaExisteArquivo && (caseJaTemFoto || !targetCaseSlug)) {
          gerarThumbsOtimizados(mediaRecord, 'arquivo')
          if (targetCaseRecord && caseJaTemFoto) {
            gerarThumbsOtimizados(targetCaseRecord, 'foto')
          }
          fotosPuladas++
          resultados.push({
            item: item.titulo,
            status: 'existente',
            mediaId: mediaRecord.id,
            caseVinculado: targetCaseSlug,
          })
          continue
        }

        // Download HTTP da foto
        const res = $http.send({
          url: item.url,
          method: 'GET',
          timeout: 15,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'image/webp,image/apng,image/*,*/*',
          },
        })

        if (!res || res.statusCode !== 200) {
          resultados.push({
            item: item.titulo,
            url: item.url,
            status: 'erro_http',
            code: res ? res.statusCode : 0,
          })
          continue
        }

        const fileObj = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)

        if (!mediaRecord) {
          mediaRecord = new Record(mediaCollection)
          mediaRecord.set('titulo', item.titulo)
          mediaRecord.set('categoria', item.categoria)
          mediaRecord.set('descricao', item.descricao)
          mediaRecord.set('destino_sugerido', item.destino_sugerido)
          mediaRecord.set('arquivo', fileObj)
          $app.save(mediaRecord)
        } else {
          mediaRecord.set('arquivo', fileObj)
          mediaRecord.set('categoria', item.categoria)
          mediaRecord.set('descricao', item.descricao)
          mediaRecord.set('destino_sugerido', item.destino_sugerido)
          $app.save(mediaRecord)
        }

        gerarThumbsOtimizados(mediaRecord, 'arquivo')
        fotosSalvas++

        // Vincular ao Case
        if (targetCaseRecord && (!targetCaseRecord.getString('foto') || item.ordem === 0)) {
          try {
            const caseFileObj = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)
            targetCaseRecord.set('foto', caseFileObj)
            $app.save(targetCaseRecord)
            gerarThumbsOtimizados(targetCaseRecord, 'foto')
            casesAtualizados[targetCaseSlug] = true
          } catch (caseErr) {
            console.log('Erro ao associar foto ao case:', targetCaseSlug, caseErr)
          }
        }

        resultados.push({
          item: item.titulo,
          status: 'sucesso',
          mediaId: mediaRecord.id,
          caseVinculado: targetCaseSlug,
        })
      } catch (itemErr) {
        console.log('Erro ao processar imagem:', item.titulo, itemErr)
        resultados.push({ item: item.titulo, status: 'erro', error: itemErr.message })
      }
    }

    return e.json(200, {
      sucesso: true,
      paginasProjetosDescobertas: discoveredUrls.length,
      totalGeralFotos: totalFotosTotal,
      offset: reqOffset,
      limit: reqLimit,
      loteProcessado: fotosLote.length,
      proximoOffset: proximoOffset,
      temMais: proximoOffset !== null,
      fotosSalvas: fotosSalvas,
      fotosPuladas: fotosPuladas,
      casesAtualizados: Object.keys(casesAtualizados),
      resultados: resultados,
    })
  } catch (err) {
    console.log('Erro fatal no hook de fotos:', err)
    return e.json(500, { error: err.message || 'Erro durante raspagem e sincronização de fotos' })
  } finally {
    if (fsys) {
      try {
        fsys.close()
      } catch (_) {}
    }
  }
}

routerAdd('GET', '/backend/v1/importar-fotos-delfos', executarSincronizacaoFotos)
routerAdd('POST', '/backend/v1/importar-fotos-delfos', executarSincronizacaoFotos)
