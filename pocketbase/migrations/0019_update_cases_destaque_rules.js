migrate(
  (app) => {
    // 1. Garantir que Indra nunca seja destaque
    app
      .db()
      .newQuery(
        `UPDATE cases SET destaque = false WHERE slug = 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp' OR cliente LIKE '%Indra%' OR titulo LIKE '%Indra%'`,
      )
      .execute()

    // 2. Os cases sem foto vinculada não devem aparecer como destaque
    app.db().newQuery(`UPDATE cases SET destaque = false WHERE foto IS NULL OR foto = ''`).execute()

    // 3. Garantir os destaques fortes com fotos reais
    // - Cassul Distribuidora (155 kWp)
    // - Panificadora Garcia (112,5 kWp)
    // - Dal Pra Móveis (74,43 kWp)
    app
      .db()
      .newQuery(
        `UPDATE cases SET destaque = true WHERE slug IN ('cassul-erechim-rs-155-0-kwp', 'panificadora-garcia-passo-fundo-rs-112-5-kwp', 'dal-pra-moveis-erechim-rs-74-43-kwp') AND foto IS NOT NULL AND foto != ''`,
      )
      .execute()
  },
  (app) => {
    // Reversão
  },
)
