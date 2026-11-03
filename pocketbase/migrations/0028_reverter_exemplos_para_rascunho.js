// Devolve os 8 cases de exemplo (is_exemplo = true) ao status 'rascunho'.
//
// Contexto: durante a entrega v0.0.123 a sincronização do backend regravou esses
// cases de exemplo com status 'publicado', sobrescrevendo o 'rascunho' que o
// usuário tinha definido no /admin. Esta migration corrige o estado e é
// idempotente: se já estiverem em rascunho, não faz nada.
//
// Seleção APENAS pelo campo is_exemplo (marcado pela migration 0022 nos 8
// ilustrativos) — nunca toca nos cases reais importados do site antigo
// (Cassul, Garcia, Clanel, Dal Pra, Silo Erebango, Posto Caminho do Mercosul…).
migrate(
  (app) => {
    const registros = app.findRecordsByFilter('cases', 'is_exemplo = true', '', 500, 0)
    let alterados = 0
    for (let i = 0; i < registros.length; i++) {
      const r = registros[i]
      if (r.getString('status') !== 'rascunho') {
        r.set('status', 'rascunho')
        app.save(r)
        alterados++
      }
    }
    console.log(
      '[0028] Cases de exemplo revertidos para rascunho: ' + alterados + ' de ' + registros.length,
    )
  },
  (app) => {
    // down: apenas o reverso documentado — não deve ser usado em produção
    // (não há como saber quais exemplos o usuário publicou antes do erro).
    const registros = app.findRecordsByFilter('cases', 'is_exemplo = true', '', 500, 0)
    for (let i = 0; i < registros.length; i++) {
      const r = registros[i]
      if (r.getString('status') !== 'publicado') {
        r.set('status', 'publicado')
        app.save(r)
      }
    }
  },
)
