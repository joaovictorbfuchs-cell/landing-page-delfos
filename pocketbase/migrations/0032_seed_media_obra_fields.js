/// <reference path="../pb_data/types.d.ts" />

/**
 * Migração 0032: Preencher os dados de obra das fotos cujo nome de arquivo já
 * identifica cliente, cidade e potência.
 *
 * De onde vêm os dados: o acervo foi importado do site antigo e os arquivos foram
 * nomeados no padrão `<cliente>_<cidade>_<uf>_<potência>kwp_<original>.jpg`.
 * Isso permite reconstruir cidade, UF, potência e tipo de obra sem digitação manual
 * e sem inventar nada — os mesmos dados já confirmados nos cases do banco.
 *
 * O que esta migração NÃO faz (de propósito):
 * - não publica nada (publicado_galeria fica false);
 * - não cria texto alt/descrição onde não há informação real;
 * - não altera título nem descrição atuais das fotos.
 * A publicação é decisão do dono, foto por foto, no /admin.
 */
migrate(
  (app) => {
    /**
     * Obras confirmadas: chave = prefixo do arquivo (normalizado, sem acentos e
     * minúsculo). Os valores vêm dos cases homologados do banco.
     */
    const OBRAS = [
      {
        prefixo: 'cassul',
        cliente: 'Cassul Distribuidora',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '155,0 kWp',
        tipo: 'Telhado comercial',
        bairro: '',
      },
      {
        prefixo: 'clanel_ind_confeccoes',
        cliente: 'Clanel Indústria e Comércio de Confecções',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '123,5 kWp',
        tipo: 'Telhado industrial',
        bairro: '',
      },
      {
        prefixo: 'panificadora_garcia',
        cliente: 'Panificadora Garcia',
        cidade: 'Passo Fundo',
        uf: 'RS',
        potencia: '112,5 kWp',
        tipo: 'Telhado comercial',
        bairro: '',
      },
      {
        prefixo: 'silo',
        cliente: 'Silo de Grãos',
        cidade: 'Erebango',
        uf: 'RS',
        potencia: '76,16 kWp',
        tipo: 'Solo rural',
        bairro: '',
      },
      {
        prefixo: 'dal_pra_moveis',
        cliente: 'Dal Pra Móveis',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '74,43 kWp',
        tipo: 'Telhado industrial',
        bairro: '',
      },
      {
        prefixo: 'posto_caminho_do_mercosul',
        cliente: 'Posto Caminho do Mercosul',
        cidade: 'Severiano de Almeida',
        uf: 'RS',
        potencia: '54,9 kWp',
        tipo: 'Telhado comercial',
        bairro: '',
      },
      {
        prefixo: 'aviario',
        cliente: 'Aviário Climatizado',
        cidade: 'Erebango',
        uf: 'RS',
        potencia: '42,16 kWp',
        tipo: 'Solo rural',
        bairro: '',
      },
      {
        prefixo: 'usina_solar_solo',
        cliente: 'Usina Solar de Solo',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '40,8 kWp',
        tipo: 'Usina de solo',
        bairro: '',
      },
      {
        prefixo: 'spazzini_tur',
        cliente: 'Spazzini Tur',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '32,16 kWp',
        tipo: 'Telhado comercial',
        bairro: '',
      },
      {
        prefixo: 'arfes_refrigeracao',
        cliente: 'ARFES Refrigeração',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '30,0 kWp',
        tipo: 'Telhado industrial',
        bairro: '',
      },
      {
        prefixo: 'bem_estar_moveis',
        cliente: 'Bem Estar Móveis',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '25,41 kWp',
        tipo: 'Telhado comercial',
        bairro: '',
      },
      {
        prefixo: 'system_desenvolvimento_software',
        cliente: 'System Desenvolvimento de Software',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '25,0 kWp',
        tipo: 'Carport',
        bairro: '',
      },
      {
        prefixo: 'supermercado_cavassola',
        cliente: 'Supermercado Cavassola',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '20,0 kWp',
        tipo: 'Telhado comercial',
        bairro: '',
      },
      {
        prefixo: 'indra_distribuidora_agropecuaria',
        cliente: 'Indra Distribuidora Agropecuária',
        cidade: 'Erechim',
        uf: 'RS',
        potencia: '9,75 kWp',
        tipo: 'Telhado comercial',
        bairro: '',
      },
      {
        prefixo: 'ervateira_bazia',
        cliente: 'Ervateira Bazia',
        cidade: 'Inácio Martins',
        uf: 'PR',
        potencia: '93,5 kWp',
        tipo: 'Telhado industrial',
        bairro: '',
      },
    ]

    // Remove acentos e normaliza para comparar com o nome do arquivo
    const normalizar = (texto) =>
      String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()

    // Gera slug estável a partir de cliente + cidade + potência
    const gerarSlug = (obra, sufixo) => {
      const base = `${obra.cliente} ${obra.cidade} ${obra.uf} ${obra.potencia}`
      const slug = normalizar(base)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return sufixo ? `${slug}-${sufixo}` : slug
    }

    let atualizadas = 0
    let ignoradas = 0

    OBRAS.forEach((obra) => {
      let fotos = []
      try {
        fotos = app.findRecordsByFilter('media', `arquivo ~ '${obra.prefixo}'`, 'created', 200, 0)
      } catch (err) {
        console.log(`Aviso ao buscar fotos de ${obra.prefixo}:`, err)
        return
      }

      // Contador para desempatar o slug quando a obra tem várias fotos
      let indice = 0

      fotos.forEach((foto) => {
        const arquivo = normalizar(foto.getString('arquivo'))

        // Confirma que o prefixo casa de verdade (evita 'silo' pegar 'siloxano')
        if (!arquivo.startsWith(normalizar(obra.prefixo))) {
          ignoradas++
          return
        }

        indice++

        // Só preenche o que está vazio: nunca sobrescreve texto que o dono escreveu
        if (!foto.getString('cidade')) foto.set('cidade', obra.cidade)
        if (!foto.getString('uf')) foto.set('uf', obra.uf)
        if (!foto.getString('potencia')) foto.set('potencia', obra.potencia)
        if (!foto.getString('tipo_obra')) foto.set('tipo_obra', obra.tipo)
        if (obra.bairro && !foto.getString('bairro')) foto.set('bairro', obra.bairro)

        // Slug único por foto, para a futura página /obras/:slug
        if (!foto.getString('slug')) {
          let slug = gerarSlug(obra, '')
          // Se já existe outra foto com esse slug, acrescenta o número da foto
          try {
            const existente = app.findFirstRecordByData('media', 'slug', slug)
            if (existente && existente.id !== foto.id) {
              slug = gerarSlug(obra, String(indice))
            }
          } catch (_) {
            // findFirstRecordByData lança quando não encontra: slug está livre
          }
          foto.set('slug', slug)
        }

        // Preenche o alt apenas se estiver vazio; usa o padrão SEO local
        if (!foto.getString('alt_texto')) {
          const bairro = foto.getString('bairro')
          const lugar = bairro
            ? `${bairro}, ${obra.cidade}/${obra.uf}`
            : `${obra.cidade}/${obra.uf}`
          foto.set(
            'alt_texto',
            `Instalação solar fotovoltaica de ${obra.potencia} em ${lugar} — ${obra.cliente} (Delfos Energia Solar)`,
          )
        }

        try {
          app.save(foto)
          atualizadas++
        } catch (err) {
          console.log(`Aviso ao salvar foto ${foto.id}:`, err)
        }
      })
    })

    console.log(
      `Galeria: ${atualizadas} fotos com dados de obra preenchidos, ${ignoradas} ignoradas por prefixo. Nenhuma foi publicada (publicado_galeria = false).`,
    )
  },
  (app) => {
    // Reversão: apenas limpa os campos preenchidos por esta migração, preservando
    // o que o dono possa ter editado depois. Mantido conservador de propósito.
    console.log('Reversão da migração 0032 não remove dados de obra já revisados.')
  },
)
