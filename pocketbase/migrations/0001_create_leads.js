migrate(
  (app) => {
    const collection = new Collection({
      name: 'leads',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'telefone', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        {
          name: 'tipo_imovel',
          type: 'select',
          required: true,
          values: ['Residencia', 'Empresa', 'Outro'],
          maxSelect: 1,
        },
        { name: 'consumo_mensal', type: 'number', required: false },
        { name: 'mensagem', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_leads_created ON leads (created DESC)',
        'CREATE INDEX idx_leads_tipo_imovel ON leads (tipo_imovel)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId('leads')
      app.delete(collection)
    } catch (_) {}
  },
)
