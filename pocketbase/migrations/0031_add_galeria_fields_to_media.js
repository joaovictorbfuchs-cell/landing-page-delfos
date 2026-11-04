/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0031: Campos de publicação na coleção 'media' para a galeria pública /obras.
 *
 * Contexto: a biblioteca de mídia já existia como acervo interno (175 fotos, todas
 * 'Solar'), mas nada dela era publicado — só ilustrava artigos do blog por um catálogo
 * fixo no código (src/services/portfolioImages.ts).
 *
 * Para virar galeria de obras com valor de SEO local, cada foto precisa de dados
 * próprios (cidade, UF, potência, tipo de obra, texto alternativo, slug) e de um
 * controle de publicação independente do acervo inteiro.
 *
 * Regra de negócio: uma foto só aparece em /obras quando publicado_galeria = true.
 * Assim o dono publica obra por obra, sem expor as fotos que ainda não descreveu.
 */
migrate(
  (app) => {
    const media = app.findCollectionByNameOrId('media')

    // Cidade da obra (ex.: "Erechim") — base do SEO local da galeria
    if (!media.fields.getByName('cidade')) {
      media.fields.add(new TextField({ name: 'cidade', required: false }))
    }

    // Bairro/distrito (ex.: "Fátima"). Opcional: em obra residencial é o dado mais
    // detalhado que se pode publicar sem expor o cliente (LGPD).
    if (!media.fields.getByName('bairro')) {
      media.fields.add(new TextField({ name: 'bairro', required: false }))
    }

    // UF (RS, SC, PR)
    if (!media.fields.getByName('uf')) {
      media.fields.add(new TextField({ name: 'uf', required: false }))
    }

    // Potência/capacidade em texto livre: aceita "155,0 kWp" e "450 kWp + 250 kWh"
    if (!media.fields.getByName('potencia')) {
      media.fields.add(new TextField({ name: 'potencia', required: false }))
    }

    // Tipo de obra, usado nos filtros da galeria
    if (!media.fields.getByName('tipo_obra')) {
      media.fields.add(
        new SelectField({
          name: 'tipo_obra',
          required: false,
          maxSelect: 1,
          values: [
            'Telhado industrial',
            'Telhado comercial',
            'Telhado residencial',
            'Usina de solo',
            'Solo rural',
            'Carport',
            'BESS',
            'Carregadores',
            'O&M',
          ],
        }),
      )
    }

    // Texto alternativo da imagem (SEO + acessibilidade). Sem ele a foto não publica.
    if (!media.fields.getByName('alt_texto')) {
      media.fields.add(new TextField({ name: 'alt_texto', required: false }))
    }

    // Slug da obra, para URL própria no futuro (/obras/:slug)
    if (!media.fields.getByName('slug')) {
      media.fields.add(new TextField({ name: 'slug', required: false }))
    }

    // Controle de publicação da galeria — independente de estar no acervo
    if (!media.fields.getByName('publicado_galeria')) {
      media.fields.add(new BoolField({ name: 'publicado_galeria' }))
    }

    // Destaque: aparece primeiro na galeria
    if (!media.fields.getByName('destaque_galeria')) {
      media.fields.add(new BoolField({ name: 'destaque_galeria' }))
    }

    // Ordem manual dentro da galeria (menor = primeiro)
    if (!media.fields.getByName('ordem')) {
      media.fields.add(new NumberField({ name: 'ordem', required: false }))
    }

    // Índices para a consulta pública (filtro por publicado + agrupamento por cidade)
    const novosIndices = [
      'CREATE INDEX idx_media_galeria ON media (publicado_galeria, tipo_obra)',
      'CREATE INDEX idx_media_cidade ON media (cidade)',
      'CREATE UNIQUE INDEX idx_media_slug ON media (slug) WHERE slug != ""',
    ]
    novosIndices.forEach((idx) => {
      if (!media.indexes.includes(idx)) media.indexes.push(idx)
    })

    app.save(media)
    console.log('Coleção media preparada para a galeria pública /obras.')
  },
  (app) => {
    try {
      const media = app.findCollectionByNameOrId('media')
      ;[
        'cidade',
        'bairro',
        'uf',
        'potencia',
        'tipo_obra',
        'alt_texto',
        'slug',
        'publicado_galeria',
        'destaque_galeria',
        'ordem',
      ].forEach((name) => {
        try {
          media.fields.removeByName(name)
        } catch (_) {}
      })
      media.indexes = media.indexes.filter(
        (idx) =>
          !idx.includes('idx_media_galeria') &&
          !idx.includes('idx_media_cidade') &&
          !idx.includes('idx_media_slug'),
      )
      app.save(media)
    } catch (_) {}
  },
)
