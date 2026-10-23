/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook administrativo para importar e sincronizar fotos reais da Delfos Engenharia.
 *
 * Otimização de imagens:
 * 1. Raspa a listagem de projetos em https://www.delfos.eng.br/site/projetos/ (e páginas seguintes se houver paginação).
 * 2. Identifica os links individuais de cada projeto do site antigo.
 * 3. Acessa as páginas dos projetos e extrai URLs reais das imagens das obras (FooBox / href ou src do wp-content/uploads).
 * 4. Casa de forma resiliente cada projeto com os 9 cases cadastrados no banco (Cassul, Clanel, Panificadora Garcia,
 *    Silo de Grãos Erebango, Posto Mercosul, Usina de Solo Erechim, Condomínio Notabile, Pecuária de Leite Barão de Cotegipe,
 *    Residência Urbana Erechim). Se não casar, ignora sem quebrar.
 * 5. Faz o download com timeout e headers apropriados.
 * 6. Armazena os arquivos de mídia na coleção 'media' e vincula aos 'cases' correspondentes no campo 'foto'.
 * 7. Utiliza a infraestrutura de thumbnails nativa de alta performance do PocketBase
 *    (pré-gerando as versões otimizadas 1600x0 e 900x0 via fsys.createThumb).
 * 8. Mantém fluxo idempotente: se já existir na 'media' ou no 'case', reprocessa/atualiza sem duplicar registros.
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
          console.log('Info/Aviso thumb 1600x0:', fileName, t1600Err)
        }

        // Versão leve para cards/galerias (máx ~900px de largura)
        try {
          const thumb900Key = basePath + '/thumbs_' + fileName + '/900x0'
          fsys.createThumb(originalKey, thumb900Key, '900x0')
        } catch (t900Err) {
          console.log('Info/Aviso thumb 900x0:', fileName, t900Err)
        }
      } catch (err) {
        console.log('Erro ao pré-processar thumbs:', fileName, err)
      }
    }

    // Definição dos cases cadastrados e seus critérios de casamento
    const DEFINICAO_CASES = [
      {
        slug: 'cassul-erechim-rs-155-0-kwp',
        nomeAmigavel: 'Cassul Distribuidora 155 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Cassul / Solução Solar / Comércio',
        patterns: [/cassul/i],
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
        patterns: [/panificadora[-_\s]+garcia.*112/i, /garcia.*112/i, /panificadora[-_\s]+garcia/i],
        tituloPrefixo: 'Panificadora Garcia 112,5 kWp',
      },
      {
        slug: 'silo-erebango-rs-76-16-kwp',
        nomeAmigavel: 'Silo de Grãos Erebango 76,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Silo Erebango / Agronegócio / Solução Solar',
        patterns: [/silo.*erebango/i, /silo.*76/i],
        tituloPrefixo: 'Silo de Grãos Erebango 76,16 kWp',
      },
      {
        slug: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
        nomeAmigavel: 'Posto Caminho do Mercosul 54,9 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Posto Mercosul / Comércio e Serviços',
        patterns: [/mercosul/i, /cerro[-_\s]+do[-_\s]+meio[-_\s]+dia/i],
        tituloPrefixo: 'Posto Caminho do Mercosul 54,9 kWp',
      },
      {
        slug: 'usina-solar-solo-erechim-rs-40-8-kwp',
        nomeAmigavel: 'Usina Fotovoltaica de Solo Erechim 40,8 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Usina Solo / Investidores / Solução Solar',
        patterns: [/usina[-_\s]+fotovoltaica.*40/i, /usina.*408/i, /usina.*solo.*40/i],
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
        patterns: [/pecuaria.*cotegipe/i, /leite.*cotegipe/i, /pecuaria.*185/i, /pecuaria.*18/i],
        tituloPrefixo: 'Pecuária de Leite Barão de Cotegipe 18,5 kWp',
      },
      {
        slug: 'residencia-urbana-erechim-rs-6-48-kwp',
        nomeAmigavel: 'Residência Urbana Erechim 6,48 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Residência / Residências / Solução Solar',
        patterns: [/residencia.*648/i, /residencia.*6,48/i, /residencia.*6-48/i],
        tituloPrefixo: 'Residência Urbana Erechim 6,48 kWp',
      },
      // 10 Novos Cases Reais
      {
        slug: 'system-desenvolvimento-software-erechim-rs-25-kwp',
        nomeAmigavel: 'System Desenvolvimento de Software 25 kWp',
        categoria: 'Solar EPC',
        destino: 'Case System Software / Indústria / Tecnologia',
        patterns: [/system/i, /system[-_\s]+desenvolvimento/i],
        tituloPrefixo: 'System Desenvolvimento de Software 25 kWp',
      },
      {
        slug: 'ervateira-bazia-inacio-martins-pr-93-5-kwp',
        nomeAmigavel: 'Ervateira Bazia 93,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Ervateira Bazia / Agronegócio',
        patterns: [/ervateira[-_\s]+bazia/i, /bazia/i],
        tituloPrefixo: 'Ervateira Bazia 93,5 kWp',
      },
      {
        slug: 'aviario-erebango-rs-42-16-kwp',
        nomeAmigavel: 'Aviário Erebango 42,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Aviário / Agronegócio',
        patterns: [/aviario.*erebango/i, /aviario.*42/i],
        tituloPrefixo: 'Aviário Erebango 42,16 kWp',
      },
      {
        slug: 'dal-pra-moveis-erechim-rs-74-43-kwp',
        nomeAmigavel: 'Dal Pra Comércio e Indústria de Móveis 74,43 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Dal Pra / Indústria',
        patterns: [/dal[-_\s]+pra/i],
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
        patterns: [/bem[-_\s]+estar/i, /2541[-_\s]+kwp/i],
        tituloPrefixo: 'Bem Estar Móveis 25,41 kWp',
      },
      {
        slug: 'condominio-residencial-lyon-erechim-rs-15-kwp',
        nomeAmigavel: 'Condomínio Residencial Lyon 15 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Condomínio Lyon / Condomínios',
        patterns: [/lyon/i, /res[-_\s]+lyon/i],
        tituloPrefixo: 'Condomínio Residencial Lyon 15 kWp',
      },
      {
        slug: 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
        nomeAmigavel: 'Indra Distribuidora Agropecuária 9,75 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Indra / Agronegócio',
        patterns: [/indra.*975/i, /indra.*9,75/i, /indra/i],
        tituloPrefixo: 'Indra Agropecuária 9,75 kWp',
      },
    ]

    // Helper para fazer GET HTTP simples com timeout curto e User-Agent de navegador
    const httpGet = (url, timeoutSecs = 8) => {
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

    // 1. Descobrir links de projetos a partir da listagem ou usar URLs conhecidas
    // URLs diretas conhecidas das páginas de projetos do delfos.eng.br (para evitar múltiplos hops na listagem)
    const KNOWN_PROJECT_URLS = [
      'https://www.delfos.eng.br/site/projetos/cassul-distribuidora/',
      'https://www.delfos.eng.br/site/projetos/clanel/',
      'https://www.delfos.eng.br/site/projetos/panificadora-garcia/',
      'https://www.delfos.eng.br/site/projetos/silo-erebango/',
      'https://www.delfos.eng.br/site/projetos/posto-caminho-do-mercosul/',
      'https://www.delfos.eng.br/site/projetos/usina-de-solo-erechim/',
      'https://www.delfos.eng.br/site/projetos/condominio-notabile/',
      'https://www.delfos.eng.br/site/projetos/pecuaria-de-leite-barao-de-cotegipe/',
      'https://www.delfos.eng.br/site/projetos/residencia-urbana-erechim/',
    ]

    const projectLinksMap = {}
    for (let u = 0; u < KNOWN_PROJECT_URLS.length; u++) {
      projectLinksMap[KNOWN_PROJECT_URLS[u]] = true
    }

    // Tentar raspar apenas a primeira página de projetos do site delfos (com timeout curto) para descobrir novos links
    const urlBaseListagem = 'https://www.delfos.eng.br/site/projetos/'
    const resList = httpGet(urlBaseListagem, 8)
    if (resList && resList.statusCode === 200) {
      const html = resList.raw.toString()
      const regexLink =
        /href=["'](https?:\/\/(?:www\.)?delfos\.eng\.br\/site\/projetos\/([a-zA-Z0-9_-]+)\/?)["']/gi
      let match
      while ((match = regexLink.exec(html)) !== null) {
        const fullLink = match[1]
        const slug = match[2]
        if (
          !slug ||
          slug === 'projetos' ||
          slug.startsWith('page') ||
          slug === 'category' ||
          slug === 'tag'
        ) {
          continue
        }
        const normalizedUrl = fullLink.endsWith('/') ? fullLink : fullLink + '/'
        projectLinksMap[normalizedUrl] = true
      }
    }

    const discoveredUrls = Object.keys(projectLinksMap)
    console.log(`Total de páginas de projetos para varredura: ${discoveredUrls.length}`)

    // 2. Extrair fotos reais de cada página de projeto
    // Estrutura: { url, titulo, descricao, caseSlug, nomeArquivo, categoria, destino_sugerido }
    const fotosParaProcessar = []
    const fotosJaAdicionadas = {}

    // Limite de segurança: não gastar mais de 40 segundos raspando as páginas HTML
    const startTimeScrape = Date.now()
    for (let i = 0; i < discoveredUrls.length; i++) {
      // Se já passou 40 segundos raspando, encerra a busca de novas páginas para garantir tempo pro lote
      if (Date.now() - startTimeScrape > 40000) {
        console.log('Limite de tempo de varredura atingido. Prosseguindo com fotos coletadas.')
        break
      }

      const projUrl = discoveredUrls[i]

      // Identificar qual case casa com este link do projeto
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
        console.log('Erro ao buscar página de projeto:', projUrl, fErr)
        continue
      }

      if (!resProj || resProj.statusCode !== 200) {
        continue
      }

      const projHtml = resProj.raw.toString()

      // Se ainda não casou com nenhum case, verificar o título da página ou texto
      if (!caseCorrespondente) {
        for (let c = 0; c < DEFINICAO_CASES.length; c++) {
          const def = DEFINICAO_CASES[c]
          for (let p = 0; p < def.patterns.length; p++) {
            if (def.patterns[p].test(projHtml)) {
              caseCorrespondente = def
              break
            }
          }
          if (caseCorrespondente) break
        }
      }

      if (!caseCorrespondente) {
        continue
      }

      // Extrair URLs de imagens da página do projeto
      const imageUrlsFound = []

      // a) Links de lightbox para imagens em tamanho original (alta resolução)
      const regexAImg = /<a[^>]+href=["']([^"']+\.(?:jpe?g|png|webp))["'][^>]*>/gi
      let matchImg
      while ((matchImg = regexAImg.exec(projHtml)) !== null) {
        const imgUrl = matchImg[1]
        if (
          imgUrl.includes('/wp-content/uploads/') &&
          !imgUrl.includes('/cache/') &&
          !imgUrl.includes('logo') &&
          !imgUrl.includes('contato')
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

      console.log(
        `Projeto ${caseCorrespondente.nomeAmigavel}: ${imageUrlsFound.length} fotos encontradas.`,
      )

      // Adicionar as fotos encontradas para este case
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

        const nomeArquivoFinal = `${caseCorrespondente.slug}-${cleanBase}`
        const isPrincipal = imgIdx === 0

        fotosParaProcessar.push({
          url: rawImgUrl,
          titulo: `${caseCorrespondente.tituloPrefixo} — Foto ${imgIdx + 1} (${originalFileName})`,
          categoria: caseCorrespondente.categoria,
          descricao: `Foto real da instalação do case ${caseCorrespondente.nomeAmigavel} (${originalFileName}).`,
          destino_sugerido: caseCorrespondente.destino,
          caseSlug: isPrincipal ? caseCorrespondente.slug : null,
          fallbackCaseSlug: caseCorrespondente.slug,
          nomeArquivo: nomeArquivoFinal,
          ordem: imgIdx,
        })
      }
    }

    console.log(
      `Total de fotos reais prontas para importação/sincronização: ${fotosParaProcessar.length}`,
    )

    // 3. Suporte a paginação/lotes via query param ou request body (ex: ?offset=0&limit=8)
    let reqOffset = 0
    let reqLimit = 8
    try {
      const qOffset = e.request.url.query().get('offset')
      const qLimit = e.request.url.query().get('limit')
      if (qOffset) reqOffset = parseInt(qOffset, 10) || 0
      if (qLimit) reqLimit = parseInt(qLimit, 10) || 8
    } catch (_) {}

    // Limites seguros para evitar ultrapassar o timeout de 120s da cloud
    if (reqLimit < 1) reqLimit = 1
    if (reqLimit > 15) reqLimit = 15 // no máximo 15 fotos por requisição

    const totalFotosTotal = fotosParaProcessar.length
    const fotosLote = fotosParaProcessar.slice(reqOffset, reqOffset + reqLimit)
    const proximoOffset = reqOffset + reqLimit < totalFotosTotal ? reqOffset + reqLimit : null

    console.log(
      `Processando lote de fotos: offset=${reqOffset}, limit=${reqLimit}, lote=${fotosLote.length}, total=${totalFotosTotal}`,
    )

    // 4. Processar download, gravação no banco e thumbs
    const resultados = []
    const casesAtualizados = {}
    let fotosSalvas = 0
    let fotosPuladas = 0

    for (let i = 0; i < fotosLote.length; i++) {
      const item = fotosLote[i]

      try {
        // Verificar se já existe registro em 'media' com mesmo título
        let mediaRecord = null
        try {
          mediaRecord = $app.findFirstRecordByData('media', 'titulo', item.titulo)
        } catch (_) {}

        // Se já existe e já tem arquivo e não pedimos force, podemos reaproveitar sem re-baixar
        const jaExisteArquivo = mediaRecord && mediaRecord.getString('arquivo')

        // Também verificar se o case alvo já possui foto
        const targetCaseSlug =
          item.caseSlug || (!casesAtualizados[item.fallbackCaseSlug] ? item.fallbackCaseSlug : null)

        let targetCaseRecord = null
        if (targetCaseSlug) {
          try {
            targetCaseRecord = $app.findFirstRecordByData('cases', 'slug', targetCaseSlug)
          } catch (_) {}
        }

        const caseJaTemFoto = targetCaseRecord && targetCaseRecord.getString('foto')

        // Otimização de performance: se já temos a mídia e o case já tem foto, apenas garantimos thumbs e pulamos o re-download HTTP pesado
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
            mensagem: 'Foto já sincronizada anteriormente (reaproveitada).',
          })
          continue
        }

        // Download da imagem real com timeout curto de 15s
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
          console.log(
            `Falha HTTP ${res ? res.statusCode : 'sem resposta'} para imagem: ${item.url}`,
          )
          resultados.push({
            item: item.titulo,
            url: item.url,
            status: 'erro_http',
            code: res ? res.statusCode : 0,
          })
          continue
        }

        // Criar objeto de arquivo PocketBase
        const fileObj = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)

        // Salvar ou atualizar na coleção 'media' (idempotente)
        if (!mediaRecord) {
          mediaRecord = new Record(mediaCollection)
          mediaRecord.set('titulo', item.titulo)
          mediaRecord.set('categoria', item.categoria)
          mediaRecord.set('descricao', item.descricao)
          mediaRecord.set('destino_sugerido', item.destino_sugerido)
          mediaRecord.set('arquivo', fileObj)
          $app.save(mediaRecord)
        } else {
          // Atualiza o arquivo e metadados se já existir
          mediaRecord.set('arquivo', fileObj)
          mediaRecord.set('categoria', item.categoria)
          mediaRecord.set('descricao', item.descricao)
          mediaRecord.set('destino_sugerido', item.destino_sugerido)
          $app.save(mediaRecord)
        }

        // Pré-gerar thumbs otimizados (1600x0 e 900x0)
        gerarThumbsOtimizados(mediaRecord, 'arquivo')
        fotosSalvas++

        // Vincular ao Case correspondente se for foto principal OU se o case ainda não tiver foto
        if (targetCaseRecord) {
          try {
            const currentFoto = targetCaseRecord.getString('foto')
            // Atualiza se for a foto principal (item.ordem === 0) OU se o case não possuir foto ainda
            if (item.ordem === 0 || !currentFoto) {
              const caseFileObj = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)
              targetCaseRecord.set('foto', caseFileObj)
              $app.save(targetCaseRecord)

              // Pré-gerar thumbs da foto do case
              gerarThumbsOtimizados(targetCaseRecord, 'foto')
              casesAtualizados[targetCaseSlug] = true
              console.log(
                `Foto vinculada com sucesso ao case ${targetCaseSlug}: ${item.nomeArquivo}`,
              )
            }
          } catch (caseErr) {
            console.log('Erro ao associar foto ao case:', targetCaseSlug, caseErr)
          }
        }

        resultados.push({
          item: item.titulo,
          status: 'sucesso',
          mediaId: mediaRecord.id,
          caseVinculado: targetCaseSlug,
          otimizacoes: ['1600x0 (grande/capas)', '900x0 (leve/cards)'],
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
      otimizacao: {
        versaoGrande: '1600px de largura máxima (capas e modais expandidos)',
        versaoLeve: '900px de largura máxima (cards de cases e galerias)',
        formato: 'JPEG/WebP otimizado nativamente pelo PocketBase',
      },
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

onRecordAfterCreateSuccess((e) => {
  try {
    if (e.record.getString('origem') === 'trigger-sync-fotos') {
      const mediaCollection = $app.findCollectionByNameOrId('media')
      const casesCollection = $app.findCollectionByNameOrId('cases')
      let fsys = null
      try {
        fsys = $app.newFilesystem()
      } catch (_) {}

      const gerarThumbsOtimizados = (record, fileFieldName) => {
        if (!fsys || !record) return
        const fileName = record.getString(fileFieldName)
        if (!fileName) return
        try {
          const basePath = record.baseFilesPath()
          const originalKey = basePath + '/' + fileName
          try {
            fsys.createThumb(originalKey, basePath + '/thumbs_' + fileName + '/1600x0', '1600x0')
          } catch (_) {}
          try {
            fsys.createThumb(originalKey, basePath + '/thumbs_' + fileName + '/900x0', '900x0')
          } catch (_) {}
        } catch (_) {}
      }

      const DEFINICAO_CASES = [
        {
          slug: 'cassul-erechim-rs-155-0-kwp',
          nomeAmigavel: 'Cassul Distribuidora 155 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Cassul / Solução Solar / Comércio',
          patterns: [/cassul/i],
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
            /panificadora[-_\s]+garcia.*112/i,
            /garcia.*112/i,
            /panificadora[-_\s]+garcia/i,
          ],
          tituloPrefixo: 'Panificadora Garcia 112,5 kWp',
        },
        {
          slug: 'silo-erebango-rs-76-16-kwp',
          nomeAmigavel: 'Silo de Grãos Erebango 76,16 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Silo Erebango / Agronegócio / Solução Solar',
          patterns: [/silo.*erebango/i, /silo.*76/i],
          tituloPrefixo: 'Silo de Grãos Erebango 76,16 kWp',
        },
        {
          slug: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
          nomeAmigavel: 'Posto Caminho do Mercosul 54,9 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Posto Mercosul / Comércio e Serviços',
          patterns: [/mercosul/i, /cerro[-_\s]+do[-_\s]+meio[-_\s]+dia/i],
          tituloPrefixo: 'Posto Caminho do Mercosul 54,9 kWp',
        },
        {
          slug: 'usina-solar-solo-erechim-rs-40-8-kwp',
          nomeAmigavel: 'Usina Fotovoltaica de Solo Erechim 40,8 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Usina Solo / Investidores / Solução Solar',
          patterns: [/usina[-_\s]+fotovoltaica.*40/i, /usina.*408/i, /usina.*solo.*40/i],
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
          patterns: [/pecuaria.*cotegipe/i, /leite.*cotegipe/i, /pecuaria.*185/i, /pecuaria.*18/i],
          tituloPrefixo: 'Pecuária de Leite Barão de Cotegipe 18,5 kWp',
        },
        {
          slug: 'residencia-urbana-erechim-rs-6-48-kwp',
          nomeAmigavel: 'Residência Urbana Erechim 6,48 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Residência / Residências / Solução Solar',
          patterns: [/residencia.*648/i, /residencia.*6,48/i, /residencia.*6-48/i],
          tituloPrefixo: 'Residência Urbana Erechim 6,48 kWp',
        },
        {
          slug: 'system-desenvolvimento-software-erechim-rs-25-kwp',
          nomeAmigavel: 'System Desenvolvimento de Software 25 kWp',
          categoria: 'Solar EPC',
          destino: 'Case System Software / Indústria / Tecnologia',
          patterns: [/system/i, /system[-_\s]+desenvolvimento/i],
          tituloPrefixo: 'System Desenvolvimento de Software 25 kWp',
        },
        {
          slug: 'ervateira-bazia-inacio-martins-pr-93-5-kwp',
          nomeAmigavel: 'Ervateira Bazia 93,5 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Ervateira Bazia / Agronegócio',
          patterns: [/ervateira[-_\s]+bazia/i, /bazia/i],
          tituloPrefixo: 'Ervateira Bazia 93,5 kWp',
        },
        {
          slug: 'aviario-erebango-rs-42-16-kwp',
          nomeAmigavel: 'Aviário Erebango 42,16 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Aviário / Agronegócio',
          patterns: [/aviario.*erebango/i, /aviario.*42/i],
          tituloPrefixo: 'Aviário Erebango 42,16 kWp',
        },
        {
          slug: 'dal-pra-moveis-erechim-rs-74-43-kwp',
          nomeAmigavel: 'Dal Pra Comércio e Indústria de Móveis 74,43 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Dal Pra / Indústria',
          patterns: [/dal[-_\s]+pra/i],
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
          patterns: [/bem[-_\s]+estar/i, /2541[-_\s]+kwp/i],
          tituloPrefixo: 'Bem Estar Móveis 25,41 kWp',
        },
        {
          slug: 'condominio-residencial-lyon-erechim-rs-15-kwp',
          nomeAmigavel: 'Condomínio Residencial Lyon 15 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Condomínio Lyon / Condomínios',
          patterns: [/lyon/i, /res[-_\s]+lyon/i],
          tituloPrefixo: 'Condomínio Residencial Lyon 15 kWp',
        },
        {
          slug: 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
          nomeAmigavel: 'Indra Distribuidora Agropecuária 9,75 kWp',
          categoria: 'Solar EPC',
          destino: 'Case Indra / Agronegócio',
          patterns: [/indra.*975/i, /indra.*9,75/i, /indra/i],
          tituloPrefixo: 'Indra Agropecuária 9,75 kWp',
        },
      ]

      const httpGet = (url) => {
        try {
          return $http.send({
            url: url,
            method: 'GET',
            timeout: 25,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            },
          })
        } catch (_) {
          return null
        }
      }

      // Varredura da listagem de projetos
      const urlBase = 'https://www.delfos.eng.br/site/projetos/'
      const projLinksMap = {}
      const urlsQueue = [urlBase]
      const seen = {}

      while (urlsQueue.length > 0) {
        const cur = urlsQueue.shift()
        if (seen[cur]) continue
        seen[cur] = true
        const resp = httpGet(cur)
        if (!resp || resp.statusCode !== 200) continue
        const html = resp.raw.toString()
        const rL =
          /href=["'](https?:\/\/(?:www\.)?delfos\.eng\.br\/site\/projetos\/([a-zA-Z0-9_-]+)\/?)["']/gi
        let m
        while ((m = rL.exec(html)) !== null) {
          const u = m[1].endsWith('/') ? m[1] : m[1] + '/'
          const slug = m[2]
          if (!slug || slug === 'projetos' || slug.startsWith('page') || slug === 'category')
            continue
          projLinksMap[u] = true
        }
        const rP =
          /href=["'](https?:\/\/(?:www\.)?delfos\.eng\.br\/site\/projetos\/page\/([0-9]+)\/?)["']/gi
        let mP
        while ((mP = rP.exec(html)) !== null) {
          const pU = mP[1].endsWith('/') ? mP[1] : mP[1] + '/'
          if (!seen[pU] && !urlsQueue.includes(pU)) urlsQueue.push(pU)
        }
      }

      const allUrls = Object.keys(projLinksMap)
      console.log('[TRIGGER] Paginas de projetos encontradas:', allUrls.length)

      const fotos = []
      const added = {}

      for (let i = 0; i < allUrls.length; i++) {
        const pUrl = allUrls[i]
        let matchedCase = null
        for (let c = 0; c < DEFINICAO_CASES.length; c++) {
          const d = DEFINICAO_CASES[c]
          for (let p = 0; p < d.patterns.length; p++) {
            if (d.patterns[p].test(pUrl)) {
              matchedCase = d
              break
            }
          }
          if (matchedCase) break
        }

        const rProj = httpGet(pUrl)
        if (!rProj || rProj.statusCode !== 200) continue
        const pHtml = rProj.raw.toString()

        if (!matchedCase) {
          for (let c = 0; c < DEFINICAO_CASES.length; c++) {
            const d = DEFINICAO_CASES[c]
            for (let p = 0; p < d.patterns.length; p++) {
              if (d.patterns[p].test(pHtml)) {
                matchedCase = d
                break
              }
            }
            if (matchedCase) break
          }
        }

        if (!matchedCase) continue

        const imgs = []
        const rA = /<a[^>]+href=["']([^"']+\.(?:jpe?g|png|webp))["'][^>]*>/gi
        let mA
        while ((mA = rA.exec(pHtml)) !== null) {
          const iu = mA[1]
          if (
            iu.includes('/wp-content/uploads/') &&
            !iu.includes('/cache/') &&
            !iu.includes('logo') &&
            !imgs.includes(iu)
          ) {
            imgs.push(iu)
          }
        }

        const rI = /<img[^>]+src=["']([^"']+\.(?:jpe?g|png|webp))["'][^>]*>/gi
        let mI
        while ((mI = rI.exec(pHtml)) !== null) {
          let iu = mI[1]
          if (
            iu.includes('/wp-content/uploads/') &&
            !iu.includes('logo') &&
            !iu.includes('contato')
          ) {
            const clean = iu.replace(/-[0-9]{3,4}x[0-9]{3,4}(\.[a-zA-Z]{3,4})$/, '$1')
            if (!imgs.includes(clean) && !imgs.includes(iu)) imgs.push(clean)
          }
        }

        console.log(
          `[TRIGGER] Projeto ${matchedCase.nomeAmigavel}: ${imgs.length} fotos encontradas`,
        )

        for (let idx = 0; idx < imgs.length; idx++) {
          const imgUrl = imgs[idx]
          if (added[imgUrl]) continue
          added[imgUrl] = true
          const parts = imgUrl.split('/')
          const origName = parts[parts.length - 1].split('?')[0]
          const cleanName = origName
            .toLowerCase()
            .replace(/[^a-z0-9_.-]/g, '-')
            .replace(/-+/g, '-')
          const finalName = `${matchedCase.slug}-${cleanName}`

          fotos.push({
            url: imgUrl,
            titulo: `${matchedCase.tituloPrefixo} — Foto ${idx + 1} (${origName})`,
            categoria: matchedCase.categoria,
            descricao: `Foto real da instalação do case ${matchedCase.nomeAmigavel} (${origName}).`,
            destino_sugerido: matchedCase.destino,
            caseSlug: idx === 0 ? matchedCase.slug : null,
            fallbackCaseSlug: matchedCase.slug,
            nomeArquivo: finalName,
            ordem: idx,
          })
        }
      }

      console.log(`[TRIGGER] Total fotos para salvar: ${fotos.length}`)
      const casesDone = {}

      for (let i = 0; i < fotos.length; i++) {
        const it = fotos[i]
        try {
          let mRec = null
          try {
            mRec = $app.findFirstRecordByData('media', 'titulo', it.titulo)
          } catch (_) {}

          const dRes = $http.send({
            url: it.url,
            method: 'GET',
            timeout: 25,
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'image/webp,image/apng,image/*,*/*',
            },
          })

          if (!dRes || dRes.statusCode !== 200) {
            console.log(`[TRIGGER] Erro download ${it.url}: status ${dRes ? dRes.statusCode : 0}`)
            continue
          }

          const fObj = $filesystem.fileFromBytes(dRes.raw, it.nomeArquivo)
          if (!mRec) {
            mRec = new Record(mediaCollection)
            mRec.set('titulo', it.titulo)
            mRec.set('categoria', it.categoria)
            mRec.set('descricao', it.descricao)
            mRec.set('destino_sugerido', it.destino_sugerido)
            mRec.set('arquivo', fObj)
            $app.save(mRec)
          } else {
            mRec.set('arquivo', fObj)
            mRec.set('categoria', it.categoria)
            mRec.set('descricao', it.descricao)
            mRec.set('destino_sugerido', it.destino_sugerido)
            $app.save(mRec)
          }

          gerarThumbsOtimizados(mRec, 'arquivo')

          const targetSlug =
            it.caseSlug || (!casesDone[it.fallbackCaseSlug] ? it.fallbackCaseSlug : null)
          if (targetSlug) {
            try {
              const cRec = $app.findFirstRecordByData('cases', 'slug', targetSlug)
              const curF = cRec.getString('foto')
              if (it.ordem === 0 || !curF) {
                const cFile = $filesystem.fileFromBytes(dRes.raw, it.nomeArquivo)
                cRec.set('foto', cFile)
                $app.save(cRec)
                gerarThumbsOtimizados(cRec, 'foto')
                casesDone[targetSlug] = true
                console.log(`[TRIGGER] Case atualizado: ${targetSlug}`)
              }
            } catch (cErr) {
              console.log(`[TRIGGER] Erro ao associar case ${targetSlug}:`, cErr)
            }
          }
        } catch (itemErr) {
          console.log(`[TRIGGER] Erro processando item ${it.titulo}:`, itemErr)
        }
      }

      if (fsys) {
        try {
          fsys.close()
        } catch (_) {}
      }
      console.log('[TRIGGER] Concluido com sucesso! Cases atualizados:', Object.keys(casesDone))
    }
  } catch (outerErr) {
    console.log('[TRIGGER] Erro no hook de lead:', outerErr)
  } finally {
    e.next()
  }
}, 'leads')
