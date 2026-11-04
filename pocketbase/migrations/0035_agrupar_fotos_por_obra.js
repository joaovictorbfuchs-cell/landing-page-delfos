/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0035: Agrupar as fotos por OBRA, para a galeria mostrar 1 card por obra.
 *
 * Problema que resolve: cada foto é um registro independente em `media`. Sem um
 * identificador comum, o site só consegue listar fotos soltas — e publicar as 13
 * fotos da Cassul gerava 13 cards da mesma usina.
 *
 * Solução: campo `obra_slug` igual para todas as fotos da mesma obra. O site agrupa
 * por ele, mostra a foto de capa no card e as demais dentro do card.
 *
 * Campos novos:
 * - obra_slug:        identificador da obra (mesmo valor em todas as suas fotos)
 * - obra_titulo:      nome público da obra ("Cassul Distribuidora")
 * - obra_descricao:   texto curto da obra (o que foi feito)
 * - obra_cidade / obra_uf / obra_potencia / obra_tipo: repetidos para permitir
 *                     consultar a obra a partir de qualquer uma das suas fotos
 */
migrate(
  (app) => {
    const media = app.findCollectionByNameOrId('media')

    const novosCampos = [
      ['obra_slug', 'text'],
      ['obra_titulo', 'text'],
      ['obra_descricao', 'text'],
      ['obra_cidade', 'text'],
      ['obra_uf', 'text'],
      ['obra_potencia', 'text'],
      ['obra_tipo', 'text'],
    ]

    novosCampos.forEach(([name]) => {
      if (!media.fields.getByName(name)) {
        media.fields.add(new TextField({ name, required: false }))
      }
    })

    const idx = 'CREATE INDEX idx_media_obra ON media (obra_slug)'
    if (!media.indexes.includes(idx)) media.indexes.push(idx)

    app.save(media)

    // ---------------------------------------------------------------
    // Preenchimento a partir dos dados já existentes
    // ---------------------------------------------------------------
    const normalizar = (texto) =>
      String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

    const slugify = (texto) =>
      normalizar(texto)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    // Agrupa as fotos que já têm cidade + potência
    let fotos = []
    try {
      fotos = app.findRecordsByFilter('media', "cidade != '' && potencia != ''", 'cidade', 500, 0)
    } catch (err) {
      console.log('Galeria: falha ao buscar fotos para agrupar:', err)
      return
    }

    const grupos = {}

    fotos.forEach((foto) => {
      const cidade = foto.getString('cidade')
      const potencia = foto.getString('potencia')
      const tipo = foto.getString('tipo_obra')
      const chave = `${slugify(cidade)}-${slugify(potencia)}-${slugify(tipo)}`

      if (!grupos[chave]) {
        // Título da obra: usa o cliente gravado no alt_texto ("... — Cassul Distribuidora (Delfos")
        const alt = foto.getString('alt_texto') || ''
        const m = alt.match(/—\s*(.+?)\s*\(Delfos/)
        const titulo = m && m[1] ? m[1].trim() : `${tipo || 'Instalação solar'} ${potencia}`

        grupos[chave] = {
          slug: chave,
          titulo,
          cidade,
          uf: foto.getString('uf'),
          potencia,
          tipo,
          fotos: [],
        }
      }
      grupos[chave].fotos.push(foto)
    })

    let atualizadas = 0
    Object.keys(grupos).forEach((chave) => {
      const g = grupos[chave]

      // Foto de capa: a que já está marcada como destaque/ordem ou, na falta, a de drone
      g.fotos.sort((a, b) => {
        const pa =
          (a.getBool('destaque_galeria') ? 0 : 1) * 10 + (a.get('ordem') ? a.getFloat('ordem') : 99)
        const pb2 =
          (b.getBool('destaque_galeria') ? 0 : 1) * 10 + (b.get('ordem') ? b.getFloat('ordem') : 99)
        if (pa !== pb2) return pa - pb2
        const droneA = normalizar(a.getString('arquivo')).includes('dji') ? 0 : 1
        const droneB = normalizar(b.getString('arquivo')).includes('dji') ? 0 : 1
        return droneA - droneB
      })

      g.fotos.forEach((foto, indice) => {
        foto.set('obra_slug', g.slug)
        foto.set('obra_titulo', g.titulo)
        foto.set('obra_cidade', g.cidade)
        foto.set('obra_uf', g.uf)
        foto.set('obra_potencia', g.potencia)
        foto.set('obra_tipo', g.tipo)
        // Ordem da foto dentro da obra (0 = capa do card)
        foto.set('ordem', indice + 1)
        try {
          app.save(foto)
          atualizadas++
        } catch (err) {
          console.log(`Galeria: falha ao agrupar ${foto.id}:`, err)
        }
      })
    })

    console.log(
      `Galeria: ${atualizadas} fotos agrupadas em ${Object.keys(grupos).length} obras (campo obra_slug).`,
    )
  },
  (app) => {
    try {
      const media = app.findCollectionByNameOrId('media')
      ;[
        'obra_slug',
        'obra_titulo',
        'obra_descricao',
        'obra_cidade',
        'obra_uf',
        'obra_potencia',
        'obra_tipo',
      ].forEach((name) => {
        try {
          media.fields.removeByName(name)
        } catch (_) {}
      })
      media.indexes = media.indexes.filter((i) => !i.includes('idx_media_obra'))
      app.save(media)
    } catch (_) {}
  },
)
