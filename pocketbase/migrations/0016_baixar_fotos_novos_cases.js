migrate(
  (app) => {
    // Sincronização direta e download via $http das fotos reais dos novos cases da Delfos Engenharia
    const mediaCollection = app.findCollectionByNameOrId('media')
    const casesCollection = app.findCollectionByNameOrId('cases')

    let fsys = null
    try {
      fsys = app.newFilesystem()
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

    const novosCasesFotos = [
      {
        slug: 'system-desenvolvimento-software-erechim-rs-25-kwp',
        nomeAmigavel: 'System Desenvolvimento de Software 25 kWp',
        categoria: 'Solar EPC',
        destino: 'Case System Software / Indústria / Tecnologia',
        tituloMedia: 'System Desenvolvimento de Software 25 kWp — Carport Solar DJI 0001',
        nomeArquivo: 'system-software-25kwp-dji-0001.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/08/DJI_0001.jpg',
        descricao:
          'Carport Solar de 25 kWp com 78 painéis fotovoltaicos em estacionamento corporativo da System Software em Erechim/RS.',
      },
      {
        slug: 'ervateira-bazia-inacio-martins-pr-93-5-kwp',
        nomeAmigavel: 'Ervateira Bazia 93,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Ervateira Bazia / Agronegócio',
        tituloMedia: 'Ervateira Bazia 93,5 kWp — Instalação Agroindustrial',
        nomeArquivo: 'ervateira-bazia-93kwp.jpeg',
        urlFoto:
          'https://www.delfos.eng.br/site/wp-content/uploads/2022/08/WhatsApp-Image-2022-08-12-at-12.40.04-1-e1660823625916.jpeg',
        descricao:
          'Usina fotovoltaica de 93,5 kWp na Ervateira Bazia em Inácio Martins/PR para abastecer o processamento de erva-mate.',
      },
      {
        slug: 'aviario-erebango-rs-42-16-kwp',
        nomeAmigavel: 'Aviário Erebango 42,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Aviário / Agronegócio',
        tituloMedia: 'Aviário Erebango 42,16 kWp — Vista Aérea DJI 0005',
        nomeArquivo: 'aviario-erebango-42kwp-dji-0005.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2021/02/DJI_0005.jpg',
        descricao:
          'Sistema fotovoltaico rural de 42,16 kWp para granja avícola climatizada em Erebango/RS.',
      },
      {
        slug: 'dal-pra-moveis-erechim-rs-74-43-kwp',
        nomeAmigavel: 'Dal Pra Comércio e Indústria de Móveis 74,43 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Dal Pra / Indústria',
        tituloMedia: 'Dal Pra Móveis 74,43 kWp — Vista Aérea DJI 0003',
        nomeArquivo: 'dal-pra-moveis-74kwp-dji-0003.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/04/DJI_0003.jpg',
        descricao:
          'Arranjo fotovoltaico industrial de 74,43 kWp na fábrica da Dal Pra Móveis em Erechim/RS, gerando economia anual de R$ 84.000.',
      },
      {
        slug: 'arfes-refrigeracao-erechim-rs-30-kwp',
        nomeAmigavel: 'ARFES Refrigeração 30 kWp',
        categoria: 'Solar EPC',
        destino: 'Case ARFES Refrigeração / Indústria',
        tituloMedia: 'ARFES Refrigeração 30 kWp — Vista Aérea DJI 0038',
        nomeArquivo: 'arfes-refrigeracao-30kwp-dji-0038.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/10/DJI_0038.jpg',
        descricao:
          'Instalação solar industrial de 30 kWp com 86 módulos na fábrica da ARFES Refrigeração em Erechim/RS.',
      },
      {
        slug: 'spazzini-tur-erechim-rs-32-16-kwp',
        nomeAmigavel: 'Spazzini Tur 32,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Spazzini Tur / Comércio e Serviços',
        tituloMedia: 'Spazzini Tur 32,16 kWp — Vista Aérea DJI 0105',
        nomeArquivo: 'spazzini-tur-32kwp-dji-0105.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2021/08/DJI_0105.jpg',
        descricao:
          'Instalação fotovoltaica comercial de 32,16 kWp na garagem e sede da Spazzini Tur em Erechim/RS.',
      },
      {
        slug: 'supermercado-cavassola-erechim-rs-20-kwp',
        nomeAmigavel: 'Supermercado Cavassola 20 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Supermercado Cavassola / Comércio e Serviços',
        tituloMedia: 'Supermercado Cavassola 20 kWp — Vista Aérea DJI 0106',
        nomeArquivo: 'supermercado-cavassola-20kwp-dji-0106.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/12/DJI_0106.jpg',
        descricao:
          'Gerador fotovoltaico comercial de 20 kWp no Supermercado Cavassola em Erechim/RS.',
      },
      {
        slug: 'bem-estar-moveis-erechim-rs-25-41-kwp',
        nomeAmigavel: 'Bem Estar Móveis 25,41 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Bem Estar Móveis / Comércio e Serviços',
        tituloMedia: 'Bem Estar Móveis 25,41 kWp — Cobertura Comercial',
        nomeArquivo: 'bem-estar-moveis-25kwp.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2018/11/1-1.jpg',
        descricao:
          'Instalação fotovoltaica comercial de 25,41 kWp na loja Bem Estar Móveis em Erechim/RS, gerando economia anual de R$ 30.000.',
      },
      {
        slug: 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
        nomeAmigavel: 'Indra Distribuidora Agropecuária 9,75 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Indra / Agronegócio',
        tituloMedia: 'Indra Distribuidora Agropecuária 9,75 kWp — Vista Aérea DJI 0010',
        nomeArquivo: 'indra-distribuidora-9kwp-dji-0010.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2024/10/Imagem-3-1.jpg',
        descricao:
          'Gerador solar comercial de 9,75 kWp na Indra Distribuidora de Insumos Agropecuários em Erechim/RS, com produção de 13.865 kWh/ano.',
      },
    ]

    for (let i = 0; i < novosCasesFotos.length; i++) {
      const item = novosCasesFotos[i]
      try {
        console.log('Baixando foto real via HTTP:', item.slug, item.urlFoto)
        const res = $http.send({
          url: item.urlFoto,
          method: 'GET',
          timeout: 30,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'image/webp,image/apng,image/*,*/*',
          },
        })

        if (res && res.statusCode === 200) {
          const fileMedia = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)
          const fileCase = $filesystem.fileFromBytes(res.raw, item.nomeArquivo)

          // 1. Salvar ou atualizar na biblioteca de mídia
          let mediaRecord = null
          try {
            mediaRecord = app.findFirstRecordByData('media', 'titulo', item.tituloMedia)
          } catch (_) {}

          if (!mediaRecord) {
            mediaRecord = new Record(mediaCollection)
            mediaRecord.set('titulo', item.tituloMedia)
            mediaRecord.set('categoria', item.categoria)
            mediaRecord.set('descricao', item.descricao)
            mediaRecord.set('destino_sugerido', item.destino)
            mediaRecord.set('arquivo', fileMedia)
            app.save(mediaRecord)
          } else {
            mediaRecord.set('arquivo', fileMedia)
            mediaRecord.set('categoria', item.categoria)
            mediaRecord.set('descricao', item.descricao)
            mediaRecord.set('destino_sugerido', item.destino)
            app.save(mediaRecord)
          }

          gerarThumbsOtimizados(mediaRecord, 'arquivo')

          // 2. Vincular ao case correspondente
          try {
            const caseRec = app.findFirstRecordByData('cases', 'slug', item.slug)
            caseRec.set('foto', fileCase)
            app.save(caseRec)
            gerarThumbsOtimizados(caseRec, 'foto')
            console.log('Case foto vinculada com sucesso:', item.slug)
          } catch (cErr) {
            console.log('Erro ao associar foto ao case:', item.slug, cErr)
          }
        } else {
          console.log(
            'Status HTTP diferente de 200 para foto:',
            item.urlFoto,
            res ? res.statusCode : 'sem resposta',
          )
        }
      } catch (err) {
        console.log('Erro ao baixar/salvar imagem:', item.slug, err)
      }
    }

    if (fsys) {
      try {
        fsys.close()
      } catch (_) {}
    }
  },
  (app) => {},
)
