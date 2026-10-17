/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')
    if (!leads.fields.getByName('arquivo_conta')) {
      leads.fields.add(
        new FileField({
          name: 'arquivo_conta',
          maxSelect: 1,
          maxSize: 15 * 1024 * 1024, // 15MB
          mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        }),
      )
      app.save(leads)
    }
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.fields.removeByName('arquivo_conta')
      app.save(leads)
    } catch (_) {}
  },
)
