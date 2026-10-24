/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0021: Atualizar qualquer ocorrência de 'RGE Sul' para 'CPFL RGE'.
 *
 * Conforme solicitação do cliente:
 * "trocar o nome da concessionaria de energia RGE Sul para CPFL RGE"
 *
 * Atualiza campos de texto de leads, cases, posts e media de forma idempotente.
 */
migrate(
  (app) => {
    // 1. Leads com concessionária 'RGE Sul'
    try {
      const leads = app.findRecordsByFilter(
        'leads',
        "concessionaria ~ 'RGE Sul'",
        'created',
        500,
        0,
      )
      for (let i = 0; i < leads.length; i++) {
        const lead = leads[i]
        const conc = lead.getString('concessionaria')
        if (conc === 'RGE Sul') {
          lead.set('concessionaria', 'CPFL RGE')
          app.save(lead)
        } else if (conc.includes('RGE Sul')) {
          lead.set('concessionaria', conc.replace(/RGE Sul/g, 'CPFL RGE'))
          app.save(lead)
        }
      }
    } catch (err) {
      console.log('Aviso ao atualizar leads com RGE Sul:', err)
    }

    // 2. Posts (se houver ocorrência de RGE Sul)
    try {
      const posts = app.findRecordsByFilter(
        'posts',
        "titulo ~ 'RGE Sul' || resumo ~ 'RGE Sul' || subtitulo ~ 'RGE Sul' || conteudo ~ 'RGE Sul'",
        'created',
        200,
        0,
      )
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]
        let alterado = false

        const campos = ['titulo', 'resumo', 'subtitulo', 'conteudo']
        for (let j = 0; j < campos.length; j++) {
          const c = campos[j]
          const val = post.getString(c)
          if (val && val.includes('RGE Sul')) {
            post.set(c, val.replace(/RGE Sul/g, 'CPFL RGE'))
            alterado = true
          }
        }

        if (alterado) {
          app.save(post)
        }
      }
    } catch (err) {
      console.log('Aviso ao atualizar posts com RGE Sul:', err)
    }

    // 3. Cases (se houver ocorrência de RGE Sul)
    try {
      const cases = app.findRecordsByFilter(
        'cases',
        "titulo ~ 'RGE Sul' || escopo ~ 'RGE Sul' || descricao ~ 'RGE Sul' || solucao_tecnica ~ 'RGE Sul' || resultado ~ 'RGE Sul' || data_entrega ~ 'RGE Sul'",
        'created',
        200,
        0,
      )
      for (let i = 0; i < cases.length; i++) {
        const cRecord = cases[i]
        let alterado = false

        const campos = [
          'titulo',
          'escopo',
          'descricao',
          'solucao_tecnica',
          'resultado',
          'data_entrega',
        ]
        for (let j = 0; j < campos.length; j++) {
          const f = campos[j]
          const val = cRecord.getString(f)
          if (val && val.includes('RGE Sul')) {
            cRecord.set(f, val.replace(/RGE Sul/g, 'CPFL RGE'))
            alterado = true
          }
        }

        if (alterado) {
          app.save(cRecord)
        }
      }
    } catch (err) {
      console.log('Aviso ao atualizar cases com RGE Sul:', err)
    }

    // 4. Media (se houver ocorrência de RGE Sul)
    try {
      const medias = app.findRecordsByFilter(
        'media',
        "titulo ~ 'RGE Sul' || descricao ~ 'RGE Sul' || destino_sugerido ~ 'RGE Sul'",
        'created',
        200,
        0,
      )
      for (let i = 0; i < medias.length; i++) {
        const mRecord = medias[i]
        let alterado = false

        const campos = ['titulo', 'descricao', 'destino_sugerido']
        for (let j = 0; j < campos.length; j++) {
          const f = campos[j]
          const val = mRecord.getString(f)
          if (val && val.includes('RGE Sul')) {
            mRecord.set(f, val.replace(/RGE Sul/g, 'CPFL RGE'))
            alterado = true
          }
        }

        if (alterado) {
          app.save(mRecord)
        }
      }
    } catch (err) {
      console.log('Aviso ao atualizar media com RGE Sul:', err)
    }
  },
  (app) => {
    // Reversão
  },
)
