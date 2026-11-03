// Blindagem do campo 'status' da coleção 'cases' contra sobrescrita por seeds.
//
// Contexto: na entrega v0.0.123 a reexecução do seed da migration 0022 regravou
// os cases de exemplo com status 'publicado', apagando o 'rascunho' definido
// pelo usuário no /admin (a migration 0028 corrigiu o estado). Esta migration
// adiciona a proteção estrutural em duas camadas:
//
//   1. Campo 'status_protegido' (bool) em cases — marcado como true em TODOS os
//      cases existentes no momento da migration. Todo case que já existe na base
//      passa a ter seu status blindado.
//   2. Convenção obrigatória para seeds futuros (o guard runtime está no hook
//      cases_status_guard.js): seeds só CRIAM cases que ainda não existem
//      (busca por slug). Se um seed precisar tocar num registro existente por
//      qualquer motivo, NUNCA pode incluir 'status' nos campos gravados — o
//      status de case existente pertence ao usuário, definido no /admin.
//      Ao criar um case novo via seed/hook, gravar também status_protegido=true.
//
// A mesma convenção vale para 'posts' se um dia receber seeds equivalentes.
// A migration é idempotente: em reexecução (cópia nova do projeto) o campo não
// é recriado e o backfill só grava nos registros que ainda não estão marcados.
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('cases')

    if (!col.fields.getByName('status_protegido')) {
      col.fields.add(
        new BoolField({
          name: 'status_protegido',
          required: false,
        }),
      )
      app.save(col)
    }

    // Backfill: todo case que JÁ EXISTE tem o status blindado (reais publicados
    // e exemplos em rascunho). Seeds futuros não alteram o status de nenhum deles.
    const registros = app.findRecordsByFilter('cases', '', '-created', 500, 0)
    let marcados = 0
    for (let i = 0; i < registros.length; i++) {
      const r = registros[i]
      if (!r.getBool('status_protegido')) {
        r.set('status_protegido', true)
        app.save(r)
        marcados++
      }
    }
    console.log(
      '[0029] status_protegido marcado em ' + marcados + ' de ' + registros.length + ' cases',
    )
  },
  (app) => {
    const col = app.findCollectionByNameOrId('cases')
    try {
      col.fields.removeByName('status_protegido')
      app.save(col)
    } catch (_) {}
  },
)
