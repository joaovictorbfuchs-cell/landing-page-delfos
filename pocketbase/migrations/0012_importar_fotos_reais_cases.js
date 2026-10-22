migrate(
  (app) => {
    // Sincronização e download automático das fotos reais dos 9 cases da Delfos Engenharia
    const mediaCollection = app.findCollectionByNameOrId('media')
    const casesCollection = app.findCollectionByNameOrId('cases')

    // Mapeamento dos 9 cases cadastrados com as URLs reais das fotos extraídas do acervo do WordPress antigo
    const casesParaSincronizar = [
      {
        slug: 'cassul-erechim-rs-155-0-kwp',
        nomeAmigavel: 'Cassul Distribuidora 155 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Cassul / Solução Solar / Comércio',
        tituloMedia: 'Obra Cassul Distribuidora 155 kWp — Vista Aérea DJI 0120',
        nomeArquivo: 'cassul-155kwp-dji-0120.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/05/DJI_0120.jpg',
        descricao:
          'Instalação fotovoltaica de 155 kWp na cobertura metálica comercial da Cassul em Erechim/RS.',
      },
      {
        slug: 'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
        nomeAmigavel: 'Clanel Indústria e Comércio de Confecções 123,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Clanel / Indústria / Solução Solar',
        tituloMedia: 'Obra Clanel Confecções 123,5 kWp — Vista Aérea DJI 0075',
        nomeArquivo: 'clanel-123kwp-dji-0075.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/02/DJI_0075.jpg',
        descricao:
          '390 módulos solares instalados na cobertura industrial da Clanel Confecções em Erechim/RS.',
      },
      {
        slug: 'panificadora-garcia-passo-fundo-rs-112-5-kwp',
        nomeAmigavel: 'Panificadora Garcia 112,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Panificadora Garcia / Comércio / Solução Solar',
        tituloMedia: 'Panificadora Garcia 112,5 kWp — Vista Aérea DJI 0047',
        nomeArquivo: 'panificadora-garcia-dji-0047.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2022/07/DJI_0047.jpg',
        descricao:
          'Usina solar comercial de 112,5 kWp instalada na Panificadora Garcia em Passo Fundo/RS.',
      },
      {
        slug: 'silo-erebango-rs-76-16-kwp',
        nomeAmigavel: 'Silo de Grãos Erebango 76,16 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Silo Erebango / Agronegócio / Solução Solar',
        tituloMedia: 'Silo de Grãos Erebango 76,16 kWp — Vista Aérea DJI 0023',
        nomeArquivo: 'silo-erebango-dji-0023.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/02/DJI_0023.jpg',
        descricao:
          'Gerador fotovoltaico de 76,16 kWp em silo de secagem e armazenagem de grãos em Erebango/RS.',
      },
      {
        slug: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
        nomeAmigavel: 'Posto Caminho do Mercosul 54,9 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Posto Mercosul / Comércio e Serviços',
        tituloMedia: 'Posto Caminho do Mercosul 54,9 kWp — Vista Aérea DJI 0068',
        nomeArquivo: 'posto-mercosul-dji-0068.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/04/DJI_0068.jpg',
        descricao:
          '169 módulos solares instalados na cobertura do Posto Cerro do Meio Dia em Severiano de Almeida/RS.',
      },
      {
        slug: 'usina-solar-solo-erechim-rs-40-8-kwp',
        nomeAmigavel: 'Usina Fotovoltaica de Solo Erechim 40,8 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Usina Solo / Investidores / Solução Solar',
        tituloMedia: 'Usina Solar de Solo Erechim 40,8 kWp — Estrutura em Solo',
        nomeArquivo: 'usina-solo-erechim-40kwp.jpeg',
        urlFoto:
          'https://www.delfos.eng.br/site/wp-content/uploads/2020/02/WhatsApp-Image-2019-12-11-at-17.44.44-1.jpeg',
        descricao:
          'Estrutura metálica de usina de solo com 40,8 kWp gerando economia de R$ 4.250/mês em Erechim/RS.',
      },
      {
        slug: 'condominio-residencial-notabile-erechim-rs-32-kwp',
        nomeAmigavel: 'Condomínio Residencial Notabile 32 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Notabile / Condomínios / Solução Solar',
        tituloMedia: 'Condomínio Notabile 32 kWp — Instalação Edifício Multifamiliar',
        nomeArquivo: 'condominio-notabile-32kwp.png',
        urlFoto:
          'https://www.delfos.eng.br/site/wp-content/uploads/2022/08/Captura-de-tela-2025-12-18-213403.png',
        descricao:
          'Instalação solar fotovoltaica condominial de 32 kWp para área comum em Erechim/RS.',
      },
      {
        slug: 'pecuaria-de-leite-barao-de-cotegipe-rs-18-5-kwp',
        nomeAmigavel: 'Pecuária de Leite Barão de Cotegipe 18,5 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Pecuária Leite / Agronegócio',
        tituloMedia: 'Pecuária de Leite Barão de Cotegipe 18,5 kWp — Galpão Rural',
        nomeArquivo: 'pecuaria-leite-18kwp.jpg',
        urlFoto: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/07/1-3.jpg',
        descricao:
          'Sistema solar de 18,5 kWp para ordenha e resfriamento de leite em Barão de Cotegipe/RS.',
      },
      {
        slug: 'residencia-urbana-erechim-rs-6-48-kwp',
        nomeAmigavel: 'Residência Urbana Erechim 6,48 kWp',
        categoria: 'Solar EPC',
        destino: 'Case Residência / Residências / Solução Solar',
        tituloMedia: 'Residência Urbana Erechim 6,48 kWp — Telhado Cerâmico DJI 0029',
        nomeArquivo: 'residencia-erechim-6kwp.jpg',
        urlFoto:
          'https://www.delfos.eng.br/site/wp-content/uploads/2020/06/DJI_0029-e1591648388934.jpg',
        descricao:
          'Instalação solar residencial de 6,48 kWp em telhado cerâmico de alto padrão em Erechim/RS.',
      },
    ]

    // Baixa cada imagem via Go / filesystem e salva no banco
    for (let i = 0; i < casesParaSincronizar.length; i++) {
      const item = casesParaSincronizar[i]
      try {
        console.log('Baixando foto para case:', item.slug, item.urlFoto)
        const fileObj = $filesystem.fileFromURL(item.urlFoto)

        // 1. Salvar ou atualizar na coleção 'media'
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
          mediaRecord.set('arquivo', fileObj)
          app.save(mediaRecord)
        } else {
          mediaRecord.set('arquivo', fileObj)
          mediaRecord.set('categoria', item.categoria)
          mediaRecord.set('descricao', item.descricao)
          mediaRecord.set('destino_sugerido', item.destino)
          app.save(mediaRecord)
        }

        // 2. Vincular ao case correspondente
        try {
          const caseRec = app.findFirstRecordByData('cases', 'slug', item.slug)
          // fileFromURL cria um stream único, para o case criamos nova referência
          const caseFileObj = $filesystem.fileFromURL(item.urlFoto)
          caseRec.set('foto', caseFileObj)
          app.save(caseRec)
          console.log('Case atualizado com foto com sucesso:', item.slug)
        } catch (cErr) {
          console.log('Erro ao atualizar foto do case:', item.slug, cErr)
        }
      } catch (err) {
        console.log('Aviso/Erro ao sincronizar foto de:', item.slug, err)
      }
    }
  },
  (app) => {
    // Reversão limpa os campos se necessário
  },
)
