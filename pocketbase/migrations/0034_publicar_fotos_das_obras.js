/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0034: Publicar TODAS as fotos das obras que já têm dados.
 *
 * Por que agora: a galeria passou a agrupar por obra (um card por obra, com as
 * fotos extras dentro). Com o agrupamento, publicar as 77 fotos das 15 obras
 * não infla a página — ela continua com 15 cards. Antes, sem agrupamento, cada
 * foto virava um card e a galeria ficava repetitiva (13x a mesma usina).
 *
 * Critério: publica apenas fotos que já têm cidade E potência preenchidas
 * (as 77 identificadas pelo nome do arquivo). As ~98 sem dados continuam no
 * acervo interno, fora da galeria.
 */
migrate(
  (app) => {
    let fotos = []
    try {
      fotos = app.findRecordsByFilter('media', "cidade != '' && potencia != ''", 'cidade', 500, 0)
    } catch (err) {
      console.log('Galeria: falha ao buscar fotos com dados de obra:', err)
      return
    }

    let publicadas = 0
    fotos.forEach((foto) => {
      if (foto.getBool('publicado_galeria')) return
      foto.set('publicado_galeria', true)
      try {
        app.save(foto)
        publicadas++
      } catch (err) {
        console.log(`Galeria: falha ao publicar ${foto.id}:`, err)
      }
    })

    console.log(
      `Galeria: ${publicadas} fotos publicadas (as obras já agrupadas continuam com 1 card cada).`,
    )
  },
  (app) => {
    // Reversão: volta ao estado da curadoria inicial (só as fotos com ordem e destaque)
    try {
      const fotos = app.findRecordsByFilter('media', 'publicado_galeria = true', 'created', 500, 0)
      fotos.forEach((foto) => {
        if (!foto.get('ordem')) {
          foto.set('publicado_galeria', false)
          app.save(foto)
        }
      })
    } catch (_) {}
  },
)
