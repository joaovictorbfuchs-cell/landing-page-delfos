/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0030: Remover o termo "EPC" de todo o conteúdo do banco.
 *
 * Decisão do usuário: o site não usa mais o termo EPC — apenas "Solar"/"Energia Solar".
 *
 *   1. cases: a opção "Energia Solar (EPC)" do campo select 'solucao' passa a ser
 *      "Energia Solar" e os registros existentes são regravados com o novo valor.
 *   2. media: a opção "Solar EPC" do campo select 'categoria' passa a ser "Solar",
 *      registros regravados e títulos/descrições/destinos que citam "Solar EPC"
 *      são corrigidos.
 *   3. cases e posts: varredura nos campos de texto livres removendo qualquer
 *      "EPC" restante (" (EPC)" some; "Solar EPC"/"EPC" vira "Solar").
 *
 * NÃO toca no campo 'status' dos cases (protegido pela migration 0029 e pelo hook
 * cases_status_guard.js): a gravação aqui é via $app.save dentro da migration,
 * apenas nos campos de solução/categoria/texto. Os 8 cases de exemplo permanecem
 * em 'rascunho' e os reais em 'publicado'.
 *
 * Idempotente: em reexecução nenhuma condição casa e nada é gravado.
 */
const removerEpc = (texto) => {
  if (!texto) return texto
  let t = String(texto)
  t = t.replace(/\s*\(EPC\)/g, '')
  t = t.replace(/Solar EPC/g, 'Solar')
  t = t.replace(/EPC/g, 'Solar')
  return t
}

migrate(
  (app) => {
    // 1. Schema: opção do select 'solucao' em cases
    try {
      const col = app.findCollectionByNameOrId('cases')
      const f = col.fields.getByName('solucao')
      if (f && f.values && f.values.indexOf('Energia Solar (EPC)') !== -1) {
        f.values = [
          'Energia Solar',
          'BESS (Armazenamento)',
          'O&M e Monitoramento',
          'Carregadores Veiculares',
        ]
        app.save(col)
        console.log('[0030] campo cases.solucao atualizado')
      }
    } catch (err) {
      console.log('Aviso ao atualizar campo cases.solucao:', err)
    }

    // 2. Registros de cases: novo valor de solucao + varredura de textos
    try {
      const registros = app.findRecordsByFilter(
        'cases',
        "solucao = 'Energia Solar (EPC)' || titulo ~ 'EPC' || escopo ~ 'EPC' || descricao ~ 'EPC' || solucao_tecnica ~ 'EPC' || resultado ~ 'EPC' || resultado_label ~ 'EPC' || data_entrega ~ 'EPC' || cliente ~ 'EPC' || local ~ 'EPC' || potencia_capacidade ~ 'EPC'",
        'created',
        500,
        0,
      )
      let alterados = 0
      for (let i = 0; i < registros.length; i++) {
        const r = registros[i]
        let alterado = false
        if (r.getString('solucao') === 'Energia Solar (EPC)') {
          r.set('solucao', 'Energia Solar')
          alterado = true
        }
        const campos = [
          'titulo',
          'cliente',
          'local',
          'escopo',
          'descricao',
          'solucao_tecnica',
          'resultado',
          'resultado_label',
          'data_entrega',
          'potencia_capacidade',
        ]
        for (let j = 0; j < campos.length; j++) {
          const val = r.getString(campos[j])
          if (val && val.indexOf('EPC') !== -1) {
            r.set(campos[j], removerEpc(val))
            alterado = true
          }
        }
        if (alterado) {
          app.save(r)
          alterados++
        }
      }
      console.log('[0030] cases atualizados: ' + alterados)
    } catch (err) {
      console.log('Aviso ao atualizar cases:', err)
    }

    // 3. Schema: opção do select 'categoria' em media
    try {
      const col = app.findCollectionByNameOrId('media')
      const f = col.fields.getByName('categoria')
      if (f && f.values && f.values.indexOf('Solar EPC') !== -1) {
        f.values = [
          'Geral',
          'Solar',
          'BESS Baterias',
          'O&M Manutenção',
          'Carregadores',
          'Segmentos',
          'Equipe e Empresa',
        ]
        app.save(col)
        console.log('[0030] campo media.categoria atualizado')
      }
    } catch (err) {
      console.log('Aviso ao atualizar campo media.categoria:', err)
    }

    // 4. Registros de media: novo valor de categoria + varredura de textos
    try {
      const registros = app.findRecordsByFilter(
        'media',
        "categoria = 'Solar EPC' || titulo ~ 'EPC' || descricao ~ 'EPC' || destino_sugerido ~ 'EPC'",
        'created',
        500,
        0,
      )
      let alterados = 0
      for (let i = 0; i < registros.length; i++) {
        const r = registros[i]
        let alterado = false
        if (r.getString('categoria') === 'Solar EPC') {
          r.set('categoria', 'Solar')
          alterado = true
        }
        const campos = ['titulo', 'descricao', 'destino_sugerido']
        for (let j = 0; j < campos.length; j++) {
          const val = r.getString(campos[j])
          if (val && val.indexOf('EPC') !== -1) {
            r.set(campos[j], removerEpc(val))
            alterado = true
          }
        }
        if (alterado) {
          app.save(r)
          alterados++
        }
      }
      console.log('[0030] registros de media atualizados: ' + alterados)
    } catch (err) {
      console.log('Aviso ao atualizar media:', err)
    }

    // 5. Posts: varredura de textos (caso um artigo cite o termo)
    try {
      const registros = app.findRecordsByFilter(
        'posts',
        "titulo ~ 'EPC' || resumo ~ 'EPC' || subtitulo ~ 'EPC' || conteudo ~ 'EPC' || palavra_chave ~ 'EPC'",
        'created',
        200,
        0,
      )
      let alterados = 0
      for (let i = 0; i < registros.length; i++) {
        const r = registros[i]
        let alterado = false
        const campos = ['titulo', 'resumo', 'subtitulo', 'conteudo', 'palavra_chave']
        for (let j = 0; j < campos.length; j++) {
          const val = r.getString(campos[j])
          if (val && val.indexOf('EPC') !== -1) {
            r.set(campos[j], removerEpc(val))
            alterado = true
          }
        }
        if (alterado) {
          app.save(r)
          alterados++
        }
      }
      console.log('[0030] posts atualizados: ' + alterados)
    } catch (err) {
      console.log('Aviso ao atualizar posts:', err)
    }
  },
  (app) => {
    // Down: restaura as opções antigas dos selects e os valores dos registros
    // (o texto livre não é revertido — reversão de texto livre seria destrutiva).
    try {
      const col = app.findCollectionByNameOrId('cases')
      const f = col.fields.getByName('solucao')
      if (
        f &&
        f.values &&
        f.values.indexOf('Energia Solar') !== -1 &&
        f.values.indexOf('Energia Solar (EPC)') === -1
      ) {
        f.values = [
          'Energia Solar (EPC)',
          'BESS (Armazenamento)',
          'O&M e Monitoramento',
          'Carregadores Veiculares',
        ]
        app.save(col)
      }
      const registros = app.findRecordsByFilter('cases', "solucao = 'Energia Solar'", '', 500, 0)
      for (let i = 0; i < registros.length; i++) {
        registros[i].set('solucao', 'Energia Solar (EPC)')
        app.save(registros[i])
      }
    } catch (_) {}
    try {
      const col = app.findCollectionByNameOrId('media')
      const f = col.fields.getByName('categoria')
      if (
        f &&
        f.values &&
        f.values.indexOf('Solar') !== -1 &&
        f.values.indexOf('Solar EPC') === -1
      ) {
        f.values = [
          'Geral',
          'Solar EPC',
          'BESS Baterias',
          'O&M Manutenção',
          'Carregadores',
          'Segmentos',
          'Equipe e Empresa',
        ]
        app.save(col)
      }
      const registros = app.findRecordsByFilter('media', "categoria = 'Solar'", '', 500, 0)
      for (let i = 0; i < registros.length; i++) {
        registros[i].set('categoria', 'Solar EPC')
        app.save(registros[i])
      }
    } catch (_) {}
  },
)
