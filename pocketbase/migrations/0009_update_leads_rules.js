migrate(
  (app) => {
    const leads = app.findCollectionByNameOrId('leads')

    // Permitir listagem, visualização, atualização e exclusão para usuários autenticados (admin comum)
    // Mantém criação pública ("") para formulários de contato e widgets da landing page
    leads.listRule = "@request.auth.id != ''"
    leads.viewRule = "@request.auth.id != ''"
    leads.createRule = ''
    leads.updateRule = "@request.auth.id != ''"
    leads.deleteRule = "@request.auth.id != ''"

    app.save(leads)
  },
  (app) => {
    try {
      const leads = app.findCollectionByNameOrId('leads')
      leads.listRule = null
      leads.viewRule = null
      leads.createRule = ''
      leads.updateRule = null
      leads.deleteRule = null
      app.save(leads)
    } catch (_) {}
  },
)
