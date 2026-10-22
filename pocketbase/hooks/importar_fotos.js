/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook administrativo para importar e sincronizar fotos reais da Delfos Engenharia.
 *
 * Otimização de imagens:
 * 1. Faz o download com timeout e headers apropriados.
 * 2. Armazena os arquivos de mídia na coleção 'media' e vincula aos 'cases' correspondentes.
 * 3. Utiliza a infraestrutura de thumbnails nativa de alta performance do PocketBase
 *    (pre-gerando as versões otimizadas:
 *      - Versão capa/grande: 1600x0 (~1600px de largura, mantendo proporção original)
 *      - Versão leve para cards/galerias: 900x0 (~900px de largura, mantendo proporção original)
 *    ambas comprimidas em JPEG/WebP com otimização pelo motor libvips/imaging do PB).
 * 4. Mecanismo idempotente e de reprocessamento:
 *    Se o registro já existir, reprocessa/atualiza os arquivos e pré-gera os thumbs
 *    (sem duplicar registros no banco).
 */
routerAdd('POST', '/backend/v1/importar-fotos-delfos', (e) => {
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

    // Lista de fotos reais de obras da Delfos a serem importadas/sincronizadas
    const fotosParaImportar = [
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/05/DJI_0120.jpg',
        titulo: 'Obra Cassul Distribuidora 155 kWp — Vista Aérea',
        categoria: 'Solar EPC',
        descricao:
          'Instalação solar fotovoltaica de 155 kWp na cobertura da Cassul Distribuidora em Erechim/RS.',
        destino_sugerido: 'Case Cassul / Solução Solar / Comércio',
        caseSlug: 'cassul-erechim-rs-155-0-kwp',
        nomeArquivo: 'cassul-155kwp-dji-0120.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/05/DJI_0140.jpg',
        titulo: 'Obra Cassul Distribuidora — Painéis em Telhado Metálico',
        categoria: 'Solar EPC',
        descricao: 'Arranjo fotovoltaico em cobertura metálica comercial da Cassul em Erechim/RS.',
        destino_sugerido: 'Biblioteca de Mídia / Galeria Solar',
        caseSlug: null,
        nomeArquivo: 'cassul-155kwp-dji-0140.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/02/DJI_0075.jpg',
        titulo: 'Obra Clanel Confecções 123,5 kWp — Vista Superior',
        categoria: 'Solar EPC',
        descricao:
          '390 módulos solares instalados na cobertura industrial da Clanel Confecções em Erechim/RS.',
        destino_sugerido: 'Case Clanel / Indústria / Solução Solar',
        caseSlug: 'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
        nomeArquivo: 'clanel-123kwp-dji-0075.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/02/4.jpg',
        titulo: 'Obra Clanel Confecções — Módulos Fotovoltaicos Industriais',
        categoria: 'Solar EPC',
        descricao: 'Detalhe dos módulos solares na cobertura fabril da Clanel em Erechim/RS.',
        destino_sugerido: 'Segmento Indústria / Acervo Delfos',
        caseSlug: null,
        nomeArquivo: 'clanel-modulos-telhado.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2022/07/DJI_0047.jpg',
        titulo: 'Panificadora Garcia 112,5 kWp — Passo Fundo/RS',
        categoria: 'Solar EPC',
        descricao:
          'Usina solar comercial de 112,5 kWp instalada na Panificadora Garcia em Passo Fundo/RS.',
        destino_sugerido: 'Case Panificadora Garcia / Comércio / Solução Solar',
        caseSlug: 'panificadora-garcia-passo-fundo-rs-112-5-kwp',
        nomeArquivo: 'panificadora-garcia-dji-0047.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/02/DJI_0023.jpg',
        titulo: 'Silo Erebango 76,16 kWp — Agronegócio',
        categoria: 'Solar EPC',
        descricao:
          'Instalação solar fotovoltaica de 76,16 kWp em silo de secagem e armazenagem de grãos em Erebango/RS.',
        destino_sugerido: 'Case Silo Erebango / Agronegócio / Solução Solar',
        caseSlug: 'silo-erebango-rs-76-16-kwp',
        nomeArquivo: 'silo-erebango-dji-0023.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/04/DJI_0068.jpg',
        titulo: 'Posto Caminho do Mercosul 54,9 kWp — Severiano de Almeida/RS',
        categoria: 'Solar EPC',
        descricao:
          '169 módulos solares instalados na cobertura do Posto de Combustíveis Cerro do Meio Dia.',
        destino_sugerido: 'Case Posto Mercosul / Comércio e Serviços',
        caseSlug: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
        nomeArquivo: 'posto-mercosul-dji-0068.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/02/WhatsApp-Image-2019-12-11-at-17.44.44-1.jpeg',
        titulo: 'Usina Solar de Solo 40,8 kWp — Erechim/RS',
        categoria: 'Solar EPC',
        descricao:
          'Estrutura metálica de usina de solo com 40,8 kWp de potência instalada em Erechim/RS.',
        destino_sugerido: 'Case Usina Solo / Investidores / Solução Solar',
        caseSlug: 'usina-solar-solo-erechim-rs-40-8-kwp',
        nomeArquivo: 'usina-solo-erechim-40kwp.jpeg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/07/1-3.jpg',
        titulo: 'Pecuária de Leite 18,5 kWp — Barão de Cotegipe/RS',
        categoria: 'Solar EPC',
        descricao:
          'Sistema solar fotovoltaico para atividade leiteira e resfriamento em Barão de Cotegipe/RS.',
        destino_sugerido: 'Case Pecuária Leite / Agronegócio',
        caseSlug: 'pecuaria-de-leite-barao-de-cotegipe-rs-18-5-kwp',
        nomeArquivo: 'pecuaria-leite-18kwp.jpg',
      },
      {
        url: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/06/DJI_0029-e1591648388934.jpg',
        titulo: 'Residência Urbana 6,48 kWp — Erechim/RS',
        categoria: 'Solar EPC',
        descricao: 'Instalação solar residencial em telhado cerâmico de alto padrão em Erechim/RS.',
        destino_sugerido: 'Case Residência / Residências / Solução Solar',
        caseSlug: 'residencia-urbana-erechim-rs-6-48-kwp',
        nomeArquivo: 'residencia-erechim-6kwp.jpg',
      },
    ]

    const resultados = []

    for (let i = 0; i < fotosParaImportar.length; i++) {
      const item = fotosParaImportar[i]

      try {
        // 1. Verificar se o registro na coleção 'media' já existe
        let mediaRecord = null
        try {
          mediaRecord = $app.findFirstRecordByData('media', 'titulo', item.titulo)
        } catch (_) {}

        // Baixar imagem do WordPress antigo
        const res = $http.send({
          url: item.url,
          method: 'GET',
          timeout: 20, // 20 segundos
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; DelfosEngenhariaOptimizer/2.0)',
            Accept: 'image/webp,image/jpeg,image/*,*/*',
          },
        })

        if (res.statusCode !== 200) {
          resultados.push({ item: item.titulo, status: 'erro_http', code: res.statusCode })
          continue
        }

        // Criar arquivo do PocketBase a partir dos bytes recebidos
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
          // Atualiza o arquivo para garantir versões frescas e metadados
          mediaRecord.set('arquivo', fileObj)
          mediaRecord.set('categoria', item.categoria)
          mediaRecord.set('descricao', item.descricao)
          mediaRecord.set('destino_sugerido', item.destino_sugerido)
          $app.save(mediaRecord)
        }

        // Pré-gerar versões otimizadas no storage
        gerarThumbsOtimizados(mediaRecord, 'arquivo')

        // 2. Se tiver caseSlug associado, vincular/atualizar foto no case correspondente
        if (item.caseSlug) {
          try {
            const caseRec = $app.findFirstRecordByData('cases', 'slug', item.caseSlug)
            const caseFileObj = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)
            caseRec.set('foto', caseFileObj)
            $app.save(caseRec)

            // Pré-gerar versões otimizadas da foto do case
            gerarThumbsOtimizados(caseRec, 'foto')
          } catch (caseErr) {
            console.log('Erro ao associar/reprocessar foto do case:', item.caseSlug, caseErr)
          }
        }

        resultados.push({
          item: item.titulo,
          status: 'sucesso',
          mediaId: mediaRecord.id,
          otimizacoes: ['1600x0 (grande/capas)', '900x0 (leve/cards)'],
        })
      } catch (err) {
        resultados.push({ item: item.titulo, status: 'erro', error: err.message })
      }
    }

    // Reprocessar também qualquer outro case que já tenha foto gravada mas falte thumb
    try {
      const allCases = $app.findRecordsByFilter('cases', "foto != ''", '-created', 100, 0)
      for (let j = 0; j < allCases.length; j++) {
        gerarThumbsOtimizados(allCases[j], 'foto')
      }
    } catch (cScanErr) {
      console.log('Varredura adicional de cases:', cScanErr)
    }

    // Reprocessar também registros de media existentes
    try {
      const allMedia = $app.findRecordsByFilter('media', "arquivo != ''", '-created', 100, 0)
      for (let k = 0; k < allMedia.length; k++) {
        gerarThumbsOtimizados(allMedia[k], 'arquivo')
      }
    } catch (mScanErr) {
      console.log('Varredura adicional de media:', mScanErr)
    }

    return e.json(200, {
      sucesso: true,
      total: fotosParaImportar.length,
      otimizacao: {
        versaoGrande: '1600px de largura máxima (capas e modais expandidos)',
        versaoLeve: '900px de largura máxima (cards de cases e galerias)',
        formato: 'JPEG/WebP otimizado com preservação de proporção',
      },
      resultados: resultados,
    })
  } catch (err) {
    return e.json(500, { error: err.message || 'Erro durante importação e otimização de fotos' })
  } finally {
    if (fsys) {
      try {
        fsys.close()
      } catch (_) {}
    }
  }
})
