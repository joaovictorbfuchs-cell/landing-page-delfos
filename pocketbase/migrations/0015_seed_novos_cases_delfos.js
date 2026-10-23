migrate(
  (app) => {
    const casesCollection = app.findCollectionByNameOrId('cases')

    // 10 novos cases reais extraídos do site antigo da Delfos Engenharia (https://www.delfos.eng.br/site/projetos/)
    const novosCasesData = [
      {
        titulo: 'System Desenvolvimento de Software — Erechim/RS — 25,0 kWp',
        slug: 'system-desenvolvimento-software-erechim-rs-25-kwp',
        cliente: 'System Desenvolvimento de Software Ltda.',
        setor: 'Indústria', // Tecnologia e Desenvolvimento de Software
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '25,0 kWp Sistema de Carport Solar com 78 painéis fotovoltaicos em estacionamento',
        descricao:
          'Para melhor atender a necessidade do cliente, foi desenvolvido um sistema de Carport Solar de 25 kWp para cobrir a área de estacionamento da sede corporativa e gerar energia elétrica. O projeto conta com 78 painéis fotovoltaicos alinhando tecnologia, inovação e sustentabilidade.',
        solucao_tecnica:
          'Estrutura metálica de Carport Solar para cobertura de vagas de veículos corporativos, 78 módulos fotovoltaicos de alta eficiência e inversores com telemetria remota integrada.',
        resultado:
          '78 painéis fotovoltaicos em operação com geração contínua e cobertura sustentável de estacionamento corporativo.',
        resultado_valor: '25,0 kWp',
        resultado_label: 'Potência instalada em Carport Solar',
        potencia_capacidade: '25,0 kWp',
        data_entrega: 'Agosto / 2019 (Operação ativa)',
        status: 'publicado',
        destaque: true,
      },
      {
        titulo: 'Ervateira Bazia — Inácio Martins/PR — 93,5 kWp',
        slug: 'ervateira-bazia-inacio-martins-pr-93-5-kwp',
        cliente: 'Ervateira Bazia',
        setor: 'Agronegócio', // Agroindústria de grande porte
        solucao: 'Energia Solar (EPC)',
        local: 'Inácio Martins / PR',
        escopo: '93,5 kWp Usina Fotovoltaica Agroindustrial em cobertura',
        descricao:
          'Instalação fotovoltaica agroindustrial com potência instalada de 93,5 kWp na unidade da Ervateira Bazia, no Paraná. O gerador fotovoltaico supre a alta demanda de moagem e processamento contínuo de erva-mate, expandindo o alcance regional da engenharia Delfos.',
        solucao_tecnica:
          'Arranjo fotovoltaico de 93,5 kWp dimensionado para regime industrial severo de moagem e secagem, inversores de alta potência e quadro de proteção CA/CC com disjuntores e DPS.',
        resultado:
          'Suprimento da demanda pesada de moagem e processamento agroindustrial de erva-mate com 93,5 kWp em operação.',
        resultado_valor: '93,5 kWp',
        resultado_label: 'Potência agroindustrial instalada',
        potencia_capacidade: '93,5 kWp',
        data_entrega: 'Agosto / 2022 (Operação ativa)',
        status: 'publicado',
        destaque: true,
      },
      {
        titulo: 'Aviário — Erebango/RS — 42,16 kWp',
        slug: 'aviario-erebango-rs-42-16-kwp',
        cliente: 'Produtor Rural Integrado de Aves',
        setor: 'Agronegócio',
        solucao: 'Energia Solar (EPC)',
        local: 'Erebango / RS',
        escopo: '42,16 kWp Sistema Fotovoltaico Rural para Granja Avícola Climatizada',
        descricao:
          'Sistema fotovoltaico instalado na área rural do município de Erebango/RS para atendimento de aviário climatizado. O gerador fotovoltaico foi dimensionado pela Delfos para gerar em média 5.000 kWh/mês, assegurando estabilidade para exaustores e climatizadores.',
        solucao_tecnica:
          'Instalação fotovoltaica em cobertura metálica de galpão avícola rural com reforço de cabeamento para longas distâncias e inversores industriais com proteção contra poeira.',
        resultado:
          'Geração média auditada de 5.000 kWh/mês garantindo redução no custo elétrico da criação avícola.',
        resultado_valor: '5.000 kWh/mês',
        resultado_label: 'Geração mensal média auditada',
        potencia_capacidade: '42,16 kWp',
        data_entrega: 'Fevereiro / 2021 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Dal Pra Comércio e Indústria de Móveis — Erechim/RS — 74,43 kWp',
        slug: 'dal-pra-moveis-erechim-rs-74-43-kwp',
        cliente: 'Dal Pra Comércio e Indústria de Móveis',
        setor: 'Indústria',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '74,43 kWp Sistema Fotovoltaico Industrial em Pavilhão Moveleiro',
        descricao:
          'Instalação de sistema solar fotovoltaico de 74,43 kW na indústria de móveis Dal Pra em Erechim/RS. O sistema permite economia de até 95% na conta de luz, gerando uma economia anual de aproximadamente R$ 84.000,00 e amortização do investimento em tempo recorde.',
        solucao_tecnica:
          'Engenharia de cobertura para pavilhão industrial de móveis com 74,43 kW de potência, inversores trifásicos com proteções completas CA/CC e projeto elétrico aprovado no CREA-RS e RGE.',
        resultado:
          'Economia anual comprovada de aproximadamente R$ 84.000,00 na conta de energia da indústria.',
        resultado_valor: 'R$ 84.000/ano',
        resultado_label: 'Economia anual comprovada',
        potencia_capacidade: '74,43 kWp',
        data_entrega: 'Abril / 2019 (Operação ativa)',
        status: 'publicado',
        destaque: true,
      },
      {
        titulo: 'ARFES Refrigeração — Erechim/RS — 30,0 kWp',
        slug: 'arfes-refrigeracao-erechim-rs-30-kwp',
        cliente: 'ARFES Refrigeração Indústria e Comércio Ltda.',
        setor: 'Indústria',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '30,0 kWp com 86 módulos fotovoltaicos em 170,28 m² de cobertura',
        descricao:
          'Gerador fotovoltaico composto por 86 módulos solares e inversor com potência nominal total de 30 kW, distribuídos em uma área de 170,28 m². O sistema foi projetado para uma produção de 43.960,1 kWh por ano (média de 3.663,34 kWh/mês) na fábrica da ARFES.',
        solucao_tecnica:
          'Arranjo de 86 módulos fotovoltaicos de alto rendimento sobre estrutura industrial de 170,28 m², inversor de 30 kW com proteção avançada e telemetria.',
        resultado:
          'Produção calculada e comprovada de 43.960 kWh/ano (3.663 kWh/mês) para o parque fabril de refrigeração.',
        resultado_valor: '3.663 kWh/mês',
        resultado_label: 'Produção média mensal',
        potencia_capacidade: '30,0 kWp',
        data_entrega: 'Outubro / 2019 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Spazzini Tur — Erechim/RS — 32,16 kWp',
        slug: 'spazzini-tur-erechim-rs-32-16-kwp',
        cliente: 'Spazzini Tur Transporte e Turismo',
        setor: 'Comércio e Serviços',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '32,16 kWp Sistema Fotovoltaico Comercial em Garagem de Frotas',
        descricao:
          'Gerador fotovoltaico com 32,16 kWp instalado na garagem e sede da Spazzini Tur em Erechim/RS. A energia gerada cobre o consumo contínuo da oficina de manutenção da frota de ônibus, áreas administrativas e lavagem de veículos.',
        solucao_tecnica:
          'Engenharia de fixação em cobertura metálica de garagem de transportes com arranjo de 32,16 kWp, inversores trifásicos com proteção contra sobretensão e homologação na concessionária.',
        resultado:
          'Operação estável de 32,16 kWp suprindo oficinas mecânicas e infraestrutura da frota rodoviária.',
        resultado_valor: '32,16 kWp',
        resultado_label: 'Potência instalada homologada',
        potencia_capacidade: '32,16 kWp',
        data_entrega: 'Agosto / 2021 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Supermercado Cavassola — Erechim/RS — 20,0 kWp',
        slug: 'supermercado-cavassola-erechim-rs-20-kwp',
        cliente: 'Supermercado Cavassola',
        setor: 'Comércio e Serviços',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '20,0 kWp Gerador Fotovoltaico Comercial em Cobertura',
        descricao:
          'Instalação solar fotovoltaica com potência de 20 kW no Supermercado Cavassola, na cidade de Erechim/RS. O projeto atende à demanda contínua de câmaras frigoríficas, iluminação comercial e ilhas de congelados.',
        solucao_tecnica:
          'Montagem sobre telhado comercial com inversor de 20 kW, proteção contra surtos DPS e dimensionamento para compensar o consumo de refrigeração e checkout.',
        resultado:
          'Redução direta na fatura de energia elétrica comercial com 20 kW de potência em plena operação.',
        resultado_valor: '20,0 kWp',
        resultado_label: 'Potência comercial instalada',
        potencia_capacidade: '20,0 kWp',
        data_entrega: 'Dezembro / 2020 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Bem Estar Móveis — Erechim/RS — 25,41 kWp',
        slug: 'bem-estar-moveis-erechim-rs-25-41-kwp',
        cliente: 'Bem Estar Móveis',
        setor: 'Comércio e Serviços',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '25,41 kWp Sistema Fotovoltaico Comercial em Loja de Móveis',
        descricao:
          'Sistema fotovoltaico instalado na empresa Bem Estar Móveis em Erechim/RS. Dimensionado para gerar em média 3.053 kWh/mês, o sistema assegura uma economia anual de aproximadamente R$ 30.000,00 de forma limpa e sustentável.',
        solucao_tecnica:
          'Arranjo solar de 25,41 kWp dimensionado para compensar a climatização e iluminação de showroom moveleiro, com inversor conectado e monitoramento mobile.',
        resultado:
          'Geração média de 3.053 kWh/mês proporcionando economia anual de aproximadamente R$ 30.000,00.',
        resultado_valor: 'R$ 30.000/ano',
        resultado_label: 'Economia anual comprovada',
        potencia_capacidade: '25,41 kWp',
        data_entrega: 'Novembro / 2018 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Condomínio Residencial Lyon — Erechim/RS — 15,0 kWp',
        slug: 'condominio-residencial-lyon-erechim-rs-15-kwp',
        cliente: 'Condomínio Residencial Lyon',
        setor: 'Condomínios',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '15,0 kWp Sistema Fotovoltaico Condominial para Áreas Comuns',
        descricao:
          'Instalação fotovoltaica de 15 kWp para o Condomínio Residencial Lyon em Erechim/RS. Projetado para suprir os custos de energia elétrica de elevadores, portaria, bombas hidráulicas e iluminação das áreas de circulação comum, reduzindo a taxa condominial mensal.',
        solucao_tecnica:
          'Engenharia de cobertura adaptada para edifício residencial com fixadores especiais de alta resistência a ventos e quadro de proteção CA/CC integrado à entrada de energia do condomínio.',
        resultado:
          'Redução direta no custo de energia das áreas comuns e desoneração da taxa de condomínio.',
        resultado_valor: '15,0 kWp',
        resultado_label: 'Potência condominial instalada',
        potencia_capacidade: '15,0 kWp',
        data_entrega: 'Janeiro / 2021 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Indra Distribuidora de Insumos Agropecuários — Erechim/RS — 9,75 kWp',
        slug: 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
        cliente: 'Indra — Distribuidora de Insumos para Agropecuária Ltda.',
        setor: 'Agronegócio',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '9,75 kWp Gerador Fotovoltaico Comercial em Cobertura Metálica',
        descricao:
          'Com o objetivo de redução de custos na empresa Indra – Distribuidora de Insumos para Agropecuária Ltda. em Erechim/RS, foi instalado um gerador fotovoltaico com potência de 9,75 kW para uma produção auditada de 13.865 kWh por ano.',
        solucao_tecnica:
          'Instalação de módulos solares em cobertura metálica, inversor com proteções completas contra surtos DPS e homologação expressa junto à rede de distribuição.',
        resultado:
          'Produção anual de 13.865 kWh suprindo a operação administrativa e logística da distribuidora agropecuária.',
        resultado_valor: '13.865 kWh/ano',
        resultado_label: 'Produção anual comprovada',
        potencia_capacidade: '9,75 kWp',
        data_entrega: 'Janeiro / 2019 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
    ]

    for (let i = 0; i < novosCasesData.length; i++) {
      const c = novosCasesData[i]
      try {
        app.findFirstRecordByData('cases', 'slug', c.slug)
        // Se já existe, não recriar
      } catch (_) {
        const record = new Record(casesCollection)
        record.set('titulo', c.titulo)
        record.set('slug', c.slug)
        record.set('cliente', c.cliente)
        record.set('setor', c.setor)
        record.set('solucao', c.solucao)
        record.set('local', c.local)
        record.set('escopo', c.escopo)
        record.set('descricao', c.descricao)
        record.set('solucao_tecnica', c.solucao_tecnica)
        record.set('resultado', c.resultado)
        record.set('resultado_valor', c.resultado_valor)
        record.set('resultado_label', c.resultado_label)
        record.set('potencia_capacidade', c.potencia_capacidade)
        record.set('data_entrega', c.data_entrega)
        record.set('status', c.status)
        record.set('destaque', Boolean(c.destaque))
        app.save(record)
      }
    }
  },
  (app) => {
    const slugs = [
      'system-desenvolvimento-software-erechim-rs-25-kwp',
      'ervateira-bazia-inacio-martins-pr-93-5-kwp',
      'aviario-erebango-rs-42-16-kwp',
      'dal-pra-moveis-erechim-rs-74-43-kwp',
      'arfes-refrigeracao-erechim-rs-30-kwp',
      'spazzini-tur-erechim-rs-32-16-kwp',
      'supermercado-cavassola-erechim-rs-20-kwp',
      'bem-estar-moveis-erechim-rs-25-41-kwp',
      'condominio-residencial-lyon-erechim-rs-15-kwp',
      'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
    ]

    for (let i = 0; i < slugs.length; i++) {
      try {
        const record = app.findFirstRecordByData('cases', 'slug', slugs[i])
        app.delete(record)
      } catch (_) {}
    }
  },
)
