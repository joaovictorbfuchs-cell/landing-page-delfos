migrate(
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'cases',
        'slug',
        'dal-pra-moveis-erechim-rs-74-43-kwp',
      )
      const descricao = record.getString('descricao')
      if (descricao && descricao.includes('95%')) {
        record.set('descricao', descricao.replace('até 95%', 'até 90%'))
        app.save(record)
      }
    } catch (_) {
      // Record pode não existir em cópia vazia
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'cases',
        'slug',
        'dal-pra-moveis-erechim-rs-74-43-kwp',
      )
      const descricao = record.getString('descricao')
      if (descricao && descricao.includes('90%')) {
        record.set('descricao', descricao.replace('até 90%', 'até 95%'))
        app.save(record)
      }
    } catch (_) {}
  },
)
