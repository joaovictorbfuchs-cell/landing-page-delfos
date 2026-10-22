migrate(
  (app) => {
    // 1. Coleção posts (Blog / Conteúdos)
    const postsCollection = new Collection({
      name: 'posts',
      type: 'base',
      listRule: "@request.auth.id != '' || status = 'publicado'",
      viewRule: "@request.auth.id != '' || status = 'publicado'",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'subtitulo', type: 'text' },
        { name: 'resumo', type: 'text' },
        {
          name: 'categoria',
          type: 'select',
          values: [
            'Energia Solar',
            'Armazenamento BESS',
            'Operação & Manutenção',
            'Mobilidade Elétrica',
            'Institucional e Outros',
          ],
          maxSelect: 1,
        },
        { name: 'conteudo', type: 'text' },
        {
          name: 'foto_capa',
          type: 'file',
          maxSelect: 1,
          maxSize: 10485760, // 10MB
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        },
        { name: 'data_publicacao', type: 'text' },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['rascunho', 'publicado'],
          maxSelect: 1,
        },
        { name: 'tempo_leitura', type: 'text' },
        { name: 'autor_nome', type: 'text' },
        { name: 'autor_cargo', type: 'text' },
        { name: 'palavra_chave', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)',
        'CREATE INDEX idx_posts_status ON posts (status)',
        'CREATE INDEX idx_posts_created ON posts (created DESC)',
      ],
    })
    app.save(postsCollection)

    // 2. Coleção cases (Projetos / Cases de Sucesso)
    const casesCollection = new Collection({
      name: 'cases',
      type: 'base',
      listRule: "@request.auth.id != '' || status = 'publicado'",
      viewRule: "@request.auth.id != '' || status = 'publicado'",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'cliente', type: 'text' },
        {
          name: 'setor',
          type: 'select',
          required: true,
          values: [
            'Residências',
            'Comércio e Serviços',
            'Indústria',
            'Agronegócio',
            'Condomínios',
            'Investidores e Usinas',
            'Frotas e Eletropostos',
          ],
          maxSelect: 1,
        },
        {
          name: 'solucao',
          type: 'select',
          values: [
            'Energia Solar (EPC)',
            'BESS (Armazenamento)',
            'O&M e Monitoramento',
            'Carregadores Veiculares',
          ],
          maxSelect: 1,
        },
        { name: 'local', type: 'text' },
        { name: 'escopo', type: 'text' },
        { name: 'descricao', type: 'text' }, // desafio inicial e detalhes
        { name: 'solucao_tecnica', type: 'text' },
        { name: 'resultado', type: 'text' }, // ex: "Redução de 91% na fatura"
        { name: 'resultado_valor', type: 'text' }, // ex: "91%", "R$ 14.500/mês", "Zero"
        { name: 'resultado_label', type: 'text' }, // ex: "Economia na fatura de energia"
        { name: 'potencia_capacidade', type: 'text' }, // ex: "9,75 kWp"
        { name: 'data_entrega', type: 'text' },
        {
          name: 'foto',
          type: 'file',
          maxSelect: 1,
          maxSize: 10485760, // 10MB
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['rascunho', 'publicado'],
          maxSelect: 1,
        },
        { name: 'destaque', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_cases_slug ON cases (slug)',
        'CREATE INDEX idx_cases_status ON cases (status)',
        'CREATE INDEX idx_cases_setor ON cases (setor)',
        'CREATE INDEX idx_cases_created ON cases (created DESC)',
      ],
    })
    app.save(casesCollection)

    // 3. Coleção media (Biblioteca de Mídia Geral)
    const mediaCollection = new Collection({
      name: 'media',
      type: 'base',
      listRule: "@request.auth.id != '' || @request.auth.id = ''", // leitura pública para usar fotos nos sites
      viewRule: "@request.auth.id != '' || @request.auth.id = ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'titulo', type: 'text', required: true },
        {
          name: 'arquivo',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 15728640, // 15MB
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'],
        },
        {
          name: 'categoria',
          type: 'select',
          values: [
            'Geral',
            'Solar EPC',
            'BESS Baterias',
            'O&M Manutenção',
            'Carregadores',
            'Segmentos',
            'Equipe e Empresa',
          ],
          maxSelect: 1,
        },
        { name: 'descricao', type: 'text' },
        { name: 'destino_sugerido', type: 'text' }, // ex: "Página BESS", "Segmento Agro"
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_media_categoria ON media (categoria)',
        'CREATE INDEX idx_media_created ON media (created DESC)',
      ],
    })
    app.save(mediaCollection)
  },
  (app) => {
    try {
      const media = app.findCollectionByNameOrId('media')
      app.delete(media)
    } catch (_) {}
    try {
      const cases = app.findCollectionByNameOrId('cases')
      app.delete(cases)
    } catch (_) {}
    try {
      const posts = app.findCollectionByNameOrId('posts')
      app.delete(posts)
    } catch (_) {}
  },
)
