/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0036: Adiciona o campo `case_id` na coleção `media` com relação para `cases`
 * e faz o backfill relacionando as fotos existentes aos 11 cases publicados.
 *
 * O case passa a ser a única fonte da verdade para projetos.
 * Fotos da galeria passam a ter vínculo direto via `case_id`.
 */
migrate(
  (app) => {
    const media = app.findCollectionByNameOrId('media')
    const casesCollection = app.findCollectionByNameOrId('cases')

    // 1. Adicionar campo case_id como RelationField se ainda não existir
    if (!media.fields.getByName('case_id')) {
      media.fields.add(
        new RelationField({
          name: 'case_id',
          required: false,
          collectionId: casesCollection.id,
          cascadeDelete: false,
          maxSelect: 1,
        }),
      )
    }

    const idx = 'CREATE INDEX idx_media_case_id ON media (case_id)'
    if (!media.indexes.includes(idx)) {
      media.indexes.push(idx)
    }

    app.save(media)

    // 2. Backfill: vincular as fotos aos cases publicados
    // Normalização de string
    const normalizar = (texto) =>
      String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

    const potenciaNumerica = (texto) => {
      const m = String(texto || '')
        .replace(/\./g, '')
        .replace(',', '.')
        .match(/([\d.]+)/)
      return m ? parseFloat(m[1]) : 0
    }

    // Carregar cases publicados
    let casesPublicados = []
    try {
      casesPublicados = app.findRecordsByFilter('cases', "status = 'publicado'", 'id', 500, 0)
    } catch (err) {
      console.log('Migração 0036: falha ao buscar cases:', err)
      return
    }

    // Carregar todas as mídias da coleção
    let todasMedias = []
    try {
      todasMedias = app.findRecordsByFilter('media', '', 'id', 1000, 0)
    } catch (err) {
      console.log('Migração 0036: falha ao buscar medias:', err)
      return
    }

    let vinculadas = 0

    // Para cada mídia, encontrar o case correspondente
    todasMedias.forEach((m) => {
      // Se já tem case_id, preserva
      const caseIdAtual = m.getString('case_id')
      if (caseIdAtual) return

      const arquivo = normalizar(m.getString('arquivo'))
      const titulo = normalizar(m.getString('titulo'))
      const destino = normalizar(m.getString('destino_sugerido'))
      const alt = normalizar(m.getString('alt_texto'))
      const desc = normalizar(m.getString('descricao'))
      const cidadeObra = normalizar(m.getString('obra_cidade') || m.getString('cidade'))
      const potObra = potenciaNumerica(m.getString('obra_potencia') || m.getString('potencia'))

      let matchCase = null

      // Tentativa 1: casamento exato por cidade + potência (a mesma regra do sitemap/obra_slug)
      if (cidadeObra && potObra > 0) {
        matchCase = casesPublicados.find((c) => {
          const cLocal = normalizar(c.getString('local'))
          const cCidade = cLocal.split('/')[0].trim()
          const cPot = potenciaNumerica(c.getString('potencia_capacidade'))
          return cCidade === cidadeObra && Math.abs(cPot - potObra) < 0.05
        })
      }

      // Tentativa 2: casamento por cliente / nome no arquivo ou destino sugerido
      if (!matchCase) {
        matchCase = casesPublicados.find((c) => {
          const cliente = normalizar(c.getString('cliente'))
          const cSlug = normalizar(c.getString('slug'))
          if (cliente && cliente.length >= 4) {
            if (
              arquivo.includes(cliente) ||
              titulo.includes(cliente) ||
              destino.includes(cliente) ||
              alt.includes(cliente) ||
              desc.includes(cliente)
            ) {
              return true
            }
          }
          if (cSlug && cSlug.length >= 5) {
            if (arquivo.includes(cSlug) || destino.includes(cSlug)) return true
          }
          return false
        })
      }

      // Tentativa 3: casamento pela foto de capa gravada no próprio case
      if (!matchCase) {
        const arqOriginal = m.getString('arquivo')
        if (arqOriginal) {
          matchCase = casesPublicados.find((c) => {
            const fotoCase = c.getString('foto')
            return fotoCase && fotoCase === arqOriginal
          })
        }
      }

      if (matchCase) {
        m.set('case_id', matchCase.id)
        try {
          app.save(m)
          vinculadas++
        } catch (err) {
          console.log(`Migração 0036: erro ao vincular media ${m.id} ao case ${matchCase.id}:`, err)
        }
      }
    })

    console.log(`Migração 0036 concluída: ${vinculadas} mídias vinculadas diretamente a cases.`)
  },
  (app) => {
    try {
      const media = app.findCollectionByNameOrId('media')
      try {
        media.fields.removeByName('case_id')
      } catch (_) {}
      media.indexes = media.indexes.filter((i) => !i.includes('idx_media_case_id'))
      app.save(media)
    } catch (_) {}
  },
)
