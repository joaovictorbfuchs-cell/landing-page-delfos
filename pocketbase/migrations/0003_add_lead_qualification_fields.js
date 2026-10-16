migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('leads')

    // Relax existing tipo_imovel required or email required if needed, but keeping them compatible:
    // Make tipo_imovel non-required to accept legacy and new forms smoothly
    const tipoImovelField = col.fields.getByName('tipo_imovel')
    if (tipoImovelField) {
      tipoImovelField.required = false
    }

    // New fields according to Phase 1 specification:
    // cidade, necessidade, tipo_ligacao, valor_conta, posse_area, ja_possui_solar, origem
    if (!col.fields.getByName('cidade')) {
      col.fields.add(new TextField({ name: 'cidade', required: false }))
    }

    if (!col.fields.getByName('necessidade')) {
      col.fields.add(new TextField({ name: 'necessidade', required: false }))
    }

    if (!col.fields.getByName('tipo_ligacao')) {
      col.fields.add(new TextField({ name: 'tipo_ligacao', required: false }))
    }

    if (!col.fields.getByName('valor_conta')) {
      col.fields.add(new NumberField({ name: 'valor_conta', required: false }))
    }

    if (!col.fields.getByName('posse_area')) {
      col.fields.add(new TextField({ name: 'posse_area', required: false }))
    }

    if (!col.fields.getByName('ja_possui_solar')) {
      col.fields.add(new TextField({ name: 'ja_possui_solar', required: false }))
    }

    if (!col.fields.getByName('origem')) {
      col.fields.add(new TextField({ name: 'origem', required: false }))
    }

    if (!col.fields.getByName('concessionaria')) {
      col.fields.add(new TextField({ name: 'concessionaria', required: false }))
    }

    app.save(col)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('leads')
      const fieldsToRemove = [
        'cidade',
        'necessidade',
        'tipo_ligacao',
        'valor_conta',
        'posse_area',
        'ja_possui_solar',
        'origem',
        'concessionaria',
      ]
      fieldsToRemove.forEach((f) => {
        try {
          col.fields.removeByName(f)
        } catch (_) {}
      })
      app.save(col)
    } catch (_) {}
  },
)
