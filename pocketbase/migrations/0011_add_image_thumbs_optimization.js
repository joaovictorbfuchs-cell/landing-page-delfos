migrate(
  (app) => {
    // 1. Coleção cases: adicionar thumbs no campo 'foto'
    try {
      const casesCol = app.findCollectionByNameOrId('cases')
      const fotoField = casesCol.fields.getByName('foto')
      if (fotoField) {
        fotoField.thumbs = ['1600x0', '900x0']
        app.save(casesCol)
      }
    } catch (err) {
      console.log('Erro ao atualizar campo foto da coleção cases:', err)
    }

    // 2. Coleção media: adicionar thumbs no campo 'arquivo'
    try {
      const mediaCol = app.findCollectionByNameOrId('media')
      const arquivoField = mediaCol.fields.getByName('arquivo')
      if (arquivoField) {
        arquivoField.thumbs = ['1600x0', '900x0']
        app.save(mediaCol)
      }
    } catch (err) {
      console.log('Erro ao atualizar campo arquivo da coleção media:', err)
    }

    // 3. Coleção posts: adicionar thumbs no campo 'foto_capa'
    try {
      const postsCol = app.findCollectionByNameOrId('posts')
      const capaField = postsCol.fields.getByName('foto_capa')
      if (capaField) {
        capaField.thumbs = ['1600x0', '900x0']
        app.save(postsCol)
      }
    } catch (err) {
      console.log('Erro ao atualizar campo foto_capa da coleção posts:', err)
    }
  },
  (app) => {
    try {
      const casesCol = app.findCollectionByNameOrId('cases')
      const fotoField = casesCol.fields.getByName('foto')
      if (fotoField) {
        fotoField.thumbs = []
        app.save(casesCol)
      }
    } catch (_) {}

    try {
      const mediaCol = app.findCollectionByNameOrId('media')
      const arquivoField = mediaCol.fields.getByName('arquivo')
      if (arquivoField) {
        arquivoField.thumbs = []
        app.save(mediaCol)
      }
    } catch (_) {}

    try {
      const postsCol = app.findCollectionByNameOrId('posts')
      const capaField = postsCol.fields.getByName('foto_capa')
      if (capaField) {
        capaField.thumbs = []
        app.save(postsCol)
      }
    } catch (_) {}
  },
)
