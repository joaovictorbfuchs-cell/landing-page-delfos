/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0020: Corrigir nomes errados de fotos na coleção 'media' e no case 'Cassul Distribuidora'.
 *
 * O que aconteceu:
 * O hook anterior de raspagem associou ~57 fotos com o prefixo 'Obra Cassul Distribuidora 155 kWp',
 * incluindo fotos que pertencem a outros clientes/obras do site antigo delfos.eng.br:
 * - Posto Caminho do Mercosul (DJI_0068, DJI_0077, DJI_0082, DJI_0086, WhatsApp-Image-2019-02-27...)
 * - Residência Planalto / R.B. (DJI_0002, DJI_0004, DJI_0007, DJI_0009, DJI_0012)
 * - Usina Solar Solo Erechim (WhatsApp-Image-2019-12-11...)
 * - Silo de Grãos Erebango (DJI_0023, DJI_0029, DJI_0031, DJI_0032, DJI_0036...)
 * - Indra Agropecuária (Imagem-1, Imagem-2-1, Imagem-3-1, Imagem-4, WhatsApp-Image-2019-01-11...)
 * - Outras fotos não identificadas que devem ter nome neutro (Regra permanente: sem nome falso de cliente!).
 *
 * Além disso, o case 'Cassul' estava apontando para cassul_erechim_rs_155_0_kwp_dji_0068 (que é do Posto Mercosul).
 * A verdadeira foto da Cassul é a DJI_0120 (vista aérea do galpão Cassul).
 */
migrate(
  (app) => {
    const mediaCollection = app.findCollectionByNameOrId('media')
    const casesCollection = app.findCollectionByNameOrId('cases')

    // 1. Buscar todas as fotos da coleção media que contêm "Cassul" no título
    let mediaCassul = []
    try {
      mediaCassul = app.findRecordsByFilter('media', "titulo ~ 'Cassul'", 'created', 200, 0)
    } catch (err) {
      console.log('Aviso ao buscar media Cassul:', err)
    }

    console.log(
      `Encontrados ${mediaCassul.length} registros com "Cassul" no título para verificação.`,
    )

    // Mapeamento das fotos reais que pertencem comprovadamente à Cassul Distribuidora:
    // Pela página oficial: https://www.delfos.eng.br/site/projetos/cassul-erechim-rs-1550-kwp/
    // Fotos autênticas: DJI_0120, DJI_0140, DJI_0131, DJI_0133, DJI_0130, DJI_0127, DJI_0122.
    const ARQUIVOS_REAIS_CASSUL = [
      'dji_0120',
      'dji_0140',
      'dji_0131',
      'dji_0133',
      'dji_0130',
      'dji_0127',
      'dji_0122',
    ]

    let corrigidos = 0
    let mantidosCassul = 0

    for (let i = 0; i < mediaCassul.length; i++) {
      const rec = mediaCassul[i]
      const tituloAtual = rec.getString('titulo')
      const arquivoNome = rec.getString('arquivo').toLowerCase()

      // Verificar se é uma das fotos autênticas da Cassul
      const isRealCassul = ARQUIVOS_REAIS_CASSUL.some((k) => arquivoNome.includes(k))

      if (isRealCassul) {
        // Manter como Cassul Distribuidora com título padronizado e correto
        rec.set('destino_sugerido', 'Case Cassul / Solução Solar / Comércio')
        app.save(rec)
        mantidosCassul++
        continue
      }

      // Se NÃO é foto da Cassul, identificar a obra real ou aplicar nome neutro verdadeiro
      let novoTitulo = ''
      let novaDescricao = ''
      let novoDestino = ''
      let novaCategoria = 'Solar EPC'

      // Caso A: Posto Mercosul / Cerro do Meio Dia
      if (
        arquivoNome.includes('dji_0068') ||
        arquivoNome.includes('dji_0077') ||
        arquivoNome.includes('dji_0082') ||
        arquivoNome.includes('dji_0086') ||
        arquivoNome.includes('2019_02_27_at_19_17')
      ) {
        novoTitulo = `Posto Caminho do Mercosul 54,9 kWp — Foto (${rec.getString('arquivo')})`
        novaDescricao =
          'Foto real da instalação fotovoltaica no Posto Caminho do Mercosul (Severiano de Almeida/RS).'
        novoDestino = 'Case Posto Mercosul / Comércio e Serviços'
      }
      // Caso B: Residência Planalto / R.B.
      else if (
        arquivoNome.includes('dji_0002') ||
        arquivoNome.includes('dji_0004') ||
        arquivoNome.includes('dji_0007') ||
        arquivoNome.includes('dji_0009') ||
        arquivoNome.includes('dji_0012')
      ) {
        novoTitulo = `Residência Planalto 10,72 kWp — Foto (${rec.getString('arquivo')})`
        novaDescricao = 'Foto real de gerador fotovoltaico em telhado residencial em Planalto/RS.'
        novoDestino = 'Página Residências / Solução Solar'
      }
      // Caso C: Usina Solar Solo Erechim (40,8 kWp)
      else if (arquivoNome.includes('2019_12_11_at_17_44')) {
        novoTitulo = `Usina Solar de Solo Erechim 40,8 kWp — Foto (${rec.getString('arquivo')})`
        novaDescricao = 'Foto real da estrutura metálica da usina de solo 40,8 kWp em Erechim/RS.'
        novoDestino = 'Case Usina Solo / Investidores / Solução Solar'
      }
      // Caso D: Silo de Grãos Erebango (76,16 kWp)
      else if (
        arquivoNome.includes('dji_0023') ||
        arquivoNome.includes('dji_0029') ||
        arquivoNome.includes('dji_0031') ||
        arquivoNome.includes('dji_0032') ||
        arquivoNome.includes('dji_0036')
      ) {
        novoTitulo = `Silo de Grãos Erebango 76,16 kWp — Foto (${rec.getString('arquivo')})`
        novaDescricao = 'Foto real da instalação fotovoltaica no Silo de Grãos em Erebango/RS.'
        novoDestino = 'Case Silo Erebango / Agronegócio / Solução Solar'
      }
      // Caso E: Indra Distribuidora Agropecuária
      else if (
        arquivoNome.includes('imagem_1') ||
        arquivoNome.includes('imagem_2') ||
        arquivoNome.includes('imagem_3') ||
        arquivoNome.includes('imagem_4') ||
        arquivoNome.includes('2019_01_11_at_16_19')
      ) {
        novoTitulo = `Indra Agropecuária 9,75 kWp — Foto (${rec.getString('arquivo')})`
        novaDescricao = 'Foto real da instalação comercial na Indra Distribuidora em Erechim/RS.'
        novoDestino = 'Case Indra / Agronegócio / Solução Solar'
      }
      // Demais fotos sem identificação exata: aplicar nome neutro e verdadeiro (REGRA DO PROJETO)
      else {
        novoTitulo = `Instalação Solar Delfos — Acervo (${rec.getString('arquivo')})`
        novaDescricao =
          'Foto de obra e instalação fotovoltaica realizada pela equipe de engenharia da Delfos.'
        novoDestino = 'Biblioteca Geral / Solução Solar EPC'
      }

      rec.set('titulo', novoTitulo)
      rec.set('descricao', novaDescricao)
      rec.set('destino_sugerido', novoDestino)
      rec.set('categoria', novaCategoria)
      app.save(rec)
      corrigidos++
    }

    console.log(
      `Correção de mídias concluída: ${corrigidos} corrigidos, ${mantidosCassul} mantidos como Cassul.`,
    )

    // 2. Corrigir a foto de capa do Case Cassul se ela estiver errada (apontando para foto do Posto Mercosul dji_0068)
    try {
      const caseCassul = app.findFirstRecordByData('cases', 'slug', 'cassul-erechim-rs-155-0-kwp')
      const fotoAtual = caseCassul.getString('foto')
      if (fotoAtual && fotoAtual.toLowerCase().includes('0068')) {
        // Encontrar o registro de mídia autêntico da Cassul DJI_0120
        const mediaCassulReal = app.findFirstRecordByFilter(
          'media',
          "arquivo ~ 'dji_0120'",
          'created',
        )
        if (mediaCassulReal) {
          const arquivoNome = mediaCassulReal.getString('arquivo')
          const fsys = app.newFilesystem()
          try {
            const bytes = fsys.fileReader(mediaCassulReal.baseFilesPath() + '/' + arquivoNome)
            // Copiar arquivo para o case
            const novoFile = $filesystem.fileFromBytes(bytes, 'cassul-155kwp-dji-0120.jpg')
            caseCassul.set('foto', novoFile)
            app.save(caseCassul)
            console.log('Foto de capa do case Cassul atualizada para a foto aérea real DJI_0120!')
          } finally {
            fsys.close()
          }
        }
      }
    } catch (cErr) {
      console.log('Aviso ao ajustar capa do case Cassul:', cErr)
    }

    // 3. Também verificar se o case Posto Mercosul precisa da sua foto real (DJI_0068)
    try {
      const caseMercosul = app.findFirstRecordByData(
        'cases',
        'slug',
        'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
      )
      if (!caseMercosul.getString('foto')) {
        const mediaMercosulReal = app.findFirstRecordByFilter(
          'media',
          "arquivo ~ 'dji_0068'",
          'created',
        )
        if (mediaMercosulReal) {
          const arquivoNome = mediaMercosulReal.getString('arquivo')
          const fsys = app.newFilesystem()
          try {
            const bytes = fsys.fileReader(mediaMercosulReal.baseFilesPath() + '/' + arquivoNome)
            const novoFile = $filesystem.fileFromBytes(bytes, 'posto-mercosul-dji-0068.jpg')
            caseMercosul.set('foto', novoFile)
            app.save(caseMercosul)
            console.log('Foto de capa do case Posto Mercosul vinculada com sucesso (DJI_0068)!')
          } finally {
            fsys.close()
          }
        }
      }
    } catch (mErr) {
      console.log('Aviso ao ajustar capa do case Mercosul:', mErr)
    }
  },
  (app) => {
    // Reversão
  },
)
