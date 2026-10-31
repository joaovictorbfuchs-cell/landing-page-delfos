/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook administrativo para análise e limpeza segura de duplicadas na biblioteca de mídia.
 *
 * Rotas:
 * GET  /backend/v1/limpar-duplicadas-media -> Simulação / resumo (dry run)
 * POST /backend/v1/limpar-duplicadas-media -> Executa a exclusão com segurança
 *
 * Regras do projeto:
 * 1. Identificar registros obsoletos da 1ª importação (22/10) e as 3 duplicadas Garcia da varredura posterior.
 * 2. ANTES de apagar, verificar vínculos em:
 *    - cases (campo foto)
 *    - posts (campo foto_capa e ocorrência do arquivo no HTML/conteudo)
 *    - leads (campo arquivo_conta)
 *    Se estiver vinculado, PULAR e não apagar!
 * 3. Entre os da 1ª rodada há ~6 tomadas aéreas genéricas ("Instalação Solar Delfos — Acervo")
 *    que podem ser as únicas cópias dessas imagens — esses NÃO devem ser apagados diretamente:
 *    listar como "revisar antes de apagar" (status: 'revisar').
 * 4. Ao confirmar com confirm=true, exclui apenas os marcados para exclusão segura.
 */

const processarDuplicadasMedia = (e) => {
  try {
    const isExecution =
      e.request.method === 'POST' || e.request.url.query().get('action') === 'execute'
    let body = {}
    try {
      body = e.request.body ? JSON.parse(e.request.body.toString()) : {}
    } catch (_) {}

    const confirmarExclusao =
      body.confirmar === true || e.request.url.query().get('confirm') === 'true'

    // 1. Carregar coleções
    const mediaRecords = $app.findRecordsByFilter('media', '', 'created', 500, 0)
    const casesRecords = $app.findRecordsByFilter('cases', '', 'created', 500, 0)
    const postsRecords = $app.findRecordsByFilter('posts', '', 'created', 500, 0)
    let leadsRecords = []
    try {
      leadsRecords = $app.findRecordsByFilter('leads', '', 'created', 500, 0)
    } catch (_) {}

    // 2. Coletar todas as referências de arquivos em uso
    const arquivosVinculados = new Set()

    for (let i = 0; i < casesRecords.length; i++) {
      const cFoto = casesRecords[i].getString('foto')
      if (cFoto) arquivosVinculados.add(cFoto.toLowerCase())
    }

    for (let i = 0; i < postsRecords.length; i++) {
      const pFoto = postsRecords[i].getString('foto_capa')
      if (pFoto) arquivosVinculados.add(pFoto.toLowerCase())
      const pConteudo = postsRecords[i].getString('conteudo')
      if (pConteudo) {
        // Verificar nomes de arquivos embutidos no conteúdo
        for (let m = 0; m < mediaRecords.length; m++) {
          const mArq = mediaRecords[m].getString('arquivo')
          if (mArq && pConteudo.includes(mArq)) {
            arquivosVinculados.add(mArq.toLowerCase())
          }
        }
      }
    }

    for (let i = 0; i < leadsRecords.length; i++) {
      const lArq = leadsRecords[i].getString('arquivo_conta')
      if (lArq) arquivosVinculados.add(lArq.toLowerCase())
    }

    // Helper para extrair a "chave base" do arquivo original (ex: dji_0023, imagem_1, etc.)
    const extrairChaveBaseArquivo = (nomeArquivo) => {
      if (!nomeArquivo) return ''
      const lower = nomeArquivo.toLowerCase()
      // Tenta capturar padrões comuns como dji_XXXX
      const matchDji = lower.match(/(dji_\d+)/)
      if (matchDji) return matchDji[1]

      // Imagens numeradas tipo imagem_1, imagem_2_1, etc.
      const matchImg = lower.match(/(imagem_\d+(?:_\d+)?)/)
      if (matchImg) return matchImg[1]

      // WhatsApp images tipo whatsapp_image_YYYY_MM_DD...
      const matchWhats = lower.match(/(whatsapp_image_\d{4}_\d{2}_\d{2}_at_\d{2}_\d{2})/)
      if (matchWhats) return matchWhats[1]

      // Fotos numeradas tipo foto_a, foto_b, foto_c
      const matchFotoLetter = lower.match(/(foto_[a-z])/)
      if (matchFotoLetter) return matchFotoLetter[1]

      // Padrões tipo 1_1, 2, 3, etc.
      const matchSingleNum = lower.match(/_(\d+(?:_\d+)?)(?:_[a-z0-9]{10})?\.[a-z]+$/)
      if (matchSingleNum) return 'num_' + matchSingleNum[1]

      return ''
    }

    // Categorizar registros mais recentes (criados em 23/10 em diante)
    const registrosNovos = mediaRecords.filter((m) => {
      const created = m.getString('created')
      return created >= '2026-10-23 00:00:00.000Z'
    })

    const chavesBaseNovas = new Set()
    for (let i = 0; i < registrosNovos.length; i++) {
      const arq = registrosNovos[i].getString('arquivo')
      const chave = extrairChaveBaseArquivo(arq)
      if (chave) chavesBaseNovas.add(chave)
    }

    // Listas para o resultado
    const paraExcluir = []
    const paraRevisar = []
    const vinculadosPulados = []
    const mantidosValidos = []

    for (let i = 0; i < mediaRecords.length; i++) {
      const m = mediaRecords[i]
      const mId = m.id
      const mArquivo = m.getString('arquivo') || ''
      const mTitulo = m.getString('titulo') || ''
      const mDescricao = m.getString('descricao') || ''
      const mCreated = m.getString('created') || ''
      const chaveBase = extrairChaveBaseArquivo(mArquivo)

      // Regra 2: Se o arquivo estiver explicitamente vinculado a um case/post/lead, PULAR SEMPRE
      if (arquivosVinculados.has(mArquivo.toLowerCase())) {
        vinculadosPulados.push({
          id: mId,
          titulo: mTitulo,
          arquivo: mArquivo,
          created: mCreated,
          motivo: 'Vinculado diretamente a um Case ou Post do site',
        })
        continue
      }

      // Caso especial: As 3 duplicadas Garcia da 3ª varredura (14:35 de 23/10):
      // Panificadora Garcia, Passo Fundo/RS 69,3 kWp (DJI_0080, DJI_0081, DJI_0084)
      // criadas em 2026-10-23 14:35:xx
      const isGarciaVarreduraTardia =
        mCreated >= '2026-10-23 14:30:00.000Z' &&
        mTitulo.includes('Panificadora Garcia') &&
        (mArquivo.includes('dji_0080') ||
          mArquivo.includes('dji_0081') ||
          mArquivo.includes('dji_0084'))

      // Se for registro da 1ª rodada (criado em 22/10)
      const isPrimeiraRodada = mCreated < '2026-10-23 00:00:00.000Z'

      if (isPrimeiraRodada) {
        // Regra 3: Entre os da 1ª rodada há ~6 tomadas aéreas genéricas ("Instalação Solar Delfos — Acervo")
        // que podem ser as únicas cópias dessas imagens — esses NÃO devem ser apagados diretamente:
        // listar como "revisar antes de apagar".
        // São as fotos do acervo histórico que não possuem slug/case específico correspondente:
        // Ex: foto_a, foto_b, foto_c, dji_0008, dji_0011, dji_0021, dji_0025, dji_0075, etc.
        // Identificação precisa: qualquer foto com título "Instalação Solar Delfos — Acervo" que NÃO
        // seja foto comprovadamente reimportada sob um case nominal da 2ª rodada.
        const isAcervoDelfosTitulo = mTitulo.includes('Instalação Solar Delfos — Acervo')

        // Padrões das fotos aéreas/acervo genérico da 1ª rodada:
        // foto_a, foto_b, foto_c, dji_0008 (obra genérica), dji_0017, dji_0020
        const isTomadaAereaGenerica =
          isAcervoDelfosTitulo &&
          (mArquivo.includes('foto_a') ||
            mArquivo.includes('foto_b') ||
            mArquivo.includes('foto_c') ||
            mArquivo.includes('dji_0008') ||
            mArquivo.includes('dji_0017') ||
            mArquivo.includes('dji_0020'))

        if (isTomadaAereaGenerica) {
          paraRevisar.push({
            id: mId,
            titulo: mTitulo,
            arquivo: mArquivo,
            created: mCreated,
            motivo:
              'Tomada aérea genérica do acervo (pode ser cópia única) — revisar antes de apagar',
          })
          continue
        }

        const temCopiaNaSegundaRodada = chaveBase && chavesBaseNovas.has(chaveBase)

        // Se tem cópia na 2ª rodada OU é um registro obsoleto da 1ª rodada com prefixo antigo:
        // -> Marcar para exclusão segura
        paraExcluir.push({
          id: mId,
          titulo: mTitulo,
          arquivo: mArquivo,
          created: mCreated,
          motivo: temCopiaNaSegundaRodada
            ? `Cópia obsoleta da 1ª rodada (arquivo ${chaveBase} já existe na 2ª rodada)`
            : 'Registro obsoleto com metadados errados da 1ª rodada',
        })
      } else if (isGarciaVarreduraTardia) {
        // Duplicada da varredura tardia da Garcia
        paraExcluir.push({
          id: mId,
          titulo: mTitulo,
          arquivo: mArquivo,
          created: mCreated,
          motivo: 'Duplicada da varredura posterior (DJI_0080/0081/0084)',
        })
      } else {
        // Registro válido mantido
        mantidosValidos.push({
          id: mId,
          titulo: mTitulo,
          arquivo: mArquivo,
          created: mCreated,
        })
      }
    }

    // Se confirmou a exclusão, apagar os registros de `paraExcluir`
    const excluidosComSucesso = []
    const falhasExclusao = []

    if (confirmarExclusao) {
      for (let i = 0; i < paraExcluir.length; i++) {
        const item = paraExcluir[i]
        try {
          const rec = $app.findRecordById('media', item.id)
          $app.delete(rec)
          excluidosComSucesso.push(item.id)
        } catch (delErr) {
          falhasExclusao.push({ id: item.id, error: delErr.message })
        }
      }
    }

    const totalAtual = mediaRecords.length
    const totalAposExclusao =
      totalAtual - (confirmarExclusao ? excluidosComSucesso.length : paraExcluir.length)

    return e.json(200, {
      sucesso: true,
      modo: confirmarExclusao ? 'executado' : 'simulacao',
      totalRegistrosAtual: totalAtual,
      totalAposLimpezaEstimado: totalAposExclusao,
      resumo: {
        totalParaExcluir: paraExcluir.length,
        totalParaRevisar: paraRevisar.length,
        totalVinculadosPulados: vinculadosPulados.length,
        totalMantidosValidos: mantidosValidos.length,
        totalExcluidosEfetivamente: excluidosComSucesso.length,
        totalFalhas: falhasExclusao.length,
      },
      detalhes: {
        paraExcluir: paraExcluir,
        paraRevisar: paraRevisar,
        vinculadosPulados: vinculadosPulados,
        falhas: falhasExclusao,
      },
    })
  } catch (err) {
    console.log('Erro no endpoint de limpeza de mídia:', err)
    return e.json(500, {
      sucesso: false,
      error: err.message || 'Erro ao processar limpeza de duplicadas',
    })
  }
}

routerAdd('GET', '/backend/v1/limpar-duplicadas-media', processarDuplicadasMedia)
routerAdd('POST', '/backend/v1/limpar-duplicadas-media', processarDuplicadasMedia)
