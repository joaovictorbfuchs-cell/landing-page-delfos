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

    // Definição dos 9 cases cadastrados e seus critérios de casamento
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
        // Casar preferencialmente o projeto de 112,5 kWp da Panificadora Garcia
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
    ]

    // Helper para fazer GET HTTP simples com User-Agent de navegador
    const httpGet = (url) => {
      try {
        return $http.send({
          url: url,
          method: 'GET',
          timeout: 25,
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

    // 1. Descobrir links de projetos a partir da listagem
    const urlBaseListagem = 'https://www.delfos.eng.br/site/projetos/'
    const projectLinksMap = {} // url -> true
    const urlsToScan = [urlBaseListagem]

    // Varre a listagem inicial e busca paginação (ex.: /page/2/, etc.)
    const visitadas = {}
    while (urlsToScan.length > 0) {
      const currentListUrl = urlsToScan.shift()
      if (visitadas[currentListUrl]) continue
      visitadas[currentListUrl] = true

      console.log('Raspando listagem de projetos:', currentListUrl)
      const resList = httpGet(currentListUrl)
      if (!resList || resList.statusCode !== 200) {
        console.log(
          'Status diferente de 200 na listagem:',
          currentListUrl,
          resList ? resList.statusCode : 'sem resposta',
        )
        continue
      }

      const html = resList.raw.toString()

      // Encontrar links de projetos: href="https://www.delfos.eng.br/site/projetos/[^"]+"
      const regexLink =
        /href=["'](https?:\/\/(?:www\.)?delfos\.eng\.br\/site\/projetos\/([a-zA-Z0-9_-]+)\/?)["']/gi
      let match
      while ((match = regexLink.exec(html)) !== null) {
        const fullLink = match[1]
        const slug = match[2]

        // Ignorar páginas de sistema, categorias ou a própria página principal
        if (
          !slug ||
          slug === 'projetos' ||
          slug.startsWith('page') ||
          slug === 'category' ||
          slug === 'tag'
        ) {
          continue
        }

        // Normalizar URL terminando com /
        const normalizedUrl = fullLink.endsWith('/') ? fullLink : fullLink + '/'
        projectLinksMap[normalizedUrl] = true
      }

      // Verificar se há links de paginação WordPress (ex: /site/projetos/page/2/)
      const regexPagina =
        /href=["'](https?:\/\/(?:www\.)?delfos\.eng\.br\/site\/projetos\/page\/([0-9]+)\/?)["']/gi
      let matchPagina
      while ((matchPagina = regexPagina.exec(html)) !== null) {
        const paginaUrl = matchPagina[1].endsWith('/') ? matchPagina[1] : matchPagina[1] + '/'
        if (!visitadas[paginaUrl] && !urlsToScan.includes(paginaUrl)) {
          urlsToScan.push(paginaUrl)
        }
      }
    }

    const discoveredUrls = Object.keys(projectLinksMap)
    console.log(`Total de páginas de projetos descobertas no site antigo: ${discoveredUrls.length}`)

    // 2. Extrair fotos reais de cada página de projeto
    // Estrutura: { url, titulo, descricao, caseSlug, nomeArquivo, categoria, destino_sugerido }
    const fotosParaProcessar = []
    const fotosJaAdicionadas = {}

    for (let i = 0; i < discoveredUrls.length; i++) {
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

      // Se a URL não casou diretamente, ainda faremos o fetch da página para verificar o título h1 / h2 ou conteúdo
      let resProj = null
      try {
        resProj = httpGet(projUrl)
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

      // Se não casou com nenhum dos 9 cases, ignorar resiliente sem quebrar (requisito 4)
      if (!caseCorrespondente) {
        continue
      }

      // Extrair URLs de imagens da página do projeto
      // Prioridade 1: links de imagem em tags <a> (como FooBox / lightbox: <a href="...wp-content/uploads/...")
      // Prioridade 2: tags <img src="...wp-content/uploads/...">
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

      // b) Se não achou em <a> ou se foram poucas, buscar nas próprias tags <img> (removendo tamanhos intermediários se possível)
      const regexImgTag = /<img[^>]+src=["']([^"']+\.(?:jpe?g|png|webp))["'][^>]*>/gi
      let matchTag
      while ((matchTag = regexImgTag.exec(projHtml)) !== null) {
        let imgUrl = matchTag[1]
        // Ignorar ícones, mapas, logos
        if (
          imgUrl.includes('logo') ||
          imgUrl.includes('camadaTransparente') ||
          imgUrl.includes('contato.png') ||
          imgUrl.includes('m.png') ||
          imgUrl.includes('231221.png')
        ) {
          continue
        }

        // Se for imagem de upload
        if (imgUrl.includes('/wp-content/uploads/')) {
          // Se for versão de cache ou com sufixo de dimensão (ex: -300x225.jpg), tentar pegar a versão limpa
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

        // Gerar nome de arquivo limpo e sem caracteres especiais
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
          caseSlug: isPrincipal ? caseCorrespondente.slug : null, // primeira foto vai como capa principal do case
          fallbackCaseSlug: caseCorrespondente.slug,
          nomeArquivo: nomeArquivoFinal,
          ordem: imgIdx,
        })
      }
    }

    console.log(
      `Total de fotos reais prontas para importação/sincronização: ${fotosParaProcessar.length}`,
    )

    // 3. Processar download, gravação no banco e thumbs
    const resultados = []
    const casesAtualizados = {}

    for (let i = 0; i < fotosParaProcessar.length; i++) {
      const item = fotosParaProcessar[i]

      try {
        // Verificar se já existe registro em 'media' com mesmo título ou destino
        let mediaRecord = null
        try {
          mediaRecord = $app.findFirstRecordByData('media', 'titulo', item.titulo)
        } catch (_) {}

        // Download da imagem real com timeout
        const res = $http.send({
          url: item.url,
          method: 'GET',
          timeout: 25,
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

        // Vincular ao Case correspondente se for foto principal OU se o case ainda não tiver foto
        const targetCaseSlug =
          item.caseSlug || (!casesAtualizados[item.fallbackCaseSlug] ? item.fallbackCaseSlug : null)

        if (targetCaseSlug) {
          try {
            const caseRec = $app.findFirstRecordByData('cases', 'slug', targetCaseSlug)
            const currentFoto = caseRec.getString('foto')

            // Atualiza se for a foto principal (item.ordem === 0) OU se o case não possuir foto ainda
            if (item.ordem === 0 || !currentFoto) {
              const caseFileObj = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)
              caseRec.set('foto', caseFileObj)
              $app.save(caseRec)

              // Pré-gerar thumbs da foto do case
              gerarThumbsOtimizados(caseRec, 'foto')
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

    // Varredura final de thumbs em cases existentes para garantir todos otimizados
    try {
      const allCasesWithPhoto = $app.findRecordsByFilter('cases', "foto != ''", '-created', 100, 0)
      for (let j = 0; j < allCasesWithPhoto.length; j++) {
        gerarThumbsOtimizados(allCasesWithPhoto[j], 'foto')
      }
    } catch (cScanErr) {
      console.log('Varredura adicional de cases:', cScanErr)
    }

    return e.json(200, {
      sucesso: true,
      paginasProjetosDescobertas: discoveredUrls.length,
      totalFotosProcessadas: fotosParaProcessar.length,
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
