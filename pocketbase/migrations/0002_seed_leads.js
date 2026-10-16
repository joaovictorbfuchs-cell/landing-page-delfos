migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    // Idempotente: não recria se já existir
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'joao@delfosengenharia.com.br')
      return
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('joao@delfosengenharia.com.br')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'João - Delfos Engenharia')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'joao@delfosengenharia.com.br')
      app.delete(record)
    } catch (_) {}
  },
)
