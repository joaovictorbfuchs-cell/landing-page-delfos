migrate(
  (app) => {
    const posts = app.findCollectionByNameOrId('posts')

    // Verifica se já existe para manter idempotente
    try {
      const existing = app.findFirstRecordByData(
        'posts',
        'slug',
        'manutencao-de-placa-solar-perda-geracao',
      )
      if (existing) {
        existing.set(
          'titulo',
          'Manutenção de placa solar: até 25% da sua geração pode estar indo embora sem você saber',
        )
        existing.set(
          'subtitulo',
          'Sujeira, ponto quente e conector frouxo custam até três contas de luz por ano — e o aplicativo não avisa.',
        )
        existing.set(
          'resumo',
          'Uma análise técnica completa com calculadora interativa de perda financeira, os cinco pilares de degradação, impacto nas garantias e seguradoras, e checklist prático de 8 sinais de alerta.',
        )
        existing.set('categoria', 'Operação & Manutenção')
        existing.set('status', 'publicado')
        existing.set('tempo_leitura', '8 min de leitura')
        existing.set('data_publicacao', '14 de Março de 2025')
        existing.set('autor_nome', 'Eng. Eletricista João Victor Bagetti Fuchs')
        existing.set(
          'autor_cargo',
          'Engenheiro Eletricista · Responsável Técnico — Delfos Engenharia · CREA-RS 151894',
        )
        existing.set('palavra_chave', 'manutenção de placa solar')
        app.save(existing)
        return
      }
    } catch (_) {}

    const record = new Record(posts)
    record.set(
      'titulo',
      'Manutenção de placa solar: até 25% da sua geração pode estar indo embora sem você saber',
    )
    record.set('slug', 'manutencao-de-placa-solar-perda-geracao')
    record.set(
      'subtitulo',
      'Sujeira, ponto quente e conector frouxo custam até três contas de luz por ano — e o aplicativo não avisa.',
    )
    record.set(
      'resumo',
      'Uma análise técnica completa com calculadora interativa de perda financeira, os cinco pilares de degradação, impacto nas garantias e seguradoras, e checklist prático de 8 sinais de alerta.',
    )
    record.set('categoria', 'Operação & Manutenção')
    record.set(
      'conteudo',
      'Artigo interativo multimídia com calculadora técnica de perda financeira de usinas, análise dos 5 pilares de perda, inspeção termográfica segundo ABNT NBR 16274 e IEC 62446-3, e checklist interativo.',
    )
    record.set('status', 'publicado')
    record.set('tempo_leitura', '8 min de leitura')
    record.set('data_publicacao', '14 de Março de 2025')
    record.set('autor_nome', 'Eng. Eletricista João Victor Bagetti Fuchs')
    record.set(
      'autor_cargo',
      'Engenheiro Eletricista · Responsável Técnico — Delfos Engenharia · CREA-RS 151894',
    )
    record.set('palavra_chave', 'manutenção de placa solar')

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'posts',
        'slug',
        'manutencao-de-placa-solar-perda-geracao',
      )
      app.delete(record)
    } catch (_) {}
  },
)
