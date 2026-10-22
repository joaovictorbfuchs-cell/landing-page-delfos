migrate(
  (app) => {
    const casesCollection = app.findCollectionByNameOrId('cases')
    const mediaCollection = app.findCollectionByNameOrId('media')

    // Cases reais extraídos do acervo histórico da Delfos Engenharia (WordPress/Obras reais)
    const casesData = [
      {
        titulo: 'Cassul Distribuidora — Erechim/RS — 155,0 kWp',
        slug: 'cassul-erechim-rs-155-0-kwp',
        cliente: 'Cassul Distribuidora',
        setor: 'Comércio e Serviços',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '155,0 kWp Gerador Solar Fotovoltaico em cobertura metálica comercial',
        descricao:
          'Ao implementar o sistema de geração solar fotovoltaica com a Delfos Engenharia, a Cassul Distribuidora passou a gerar 20.000 kWh/mês em média com potência instalada de 155 kWp. O valor antes destinado para pagar a conta de luz agora é revertido em novos investimentos na operação.',
        solucao_tecnica:
          'Projeto e instalação Turnkey Delfos: arranjo fotovoltaico de 155 kWp em telhado metálico com fixadores especiais de alumínio, inversores de alta potência e homologação expressa junto à concessionária RGE.',
        resultado:
          'Geração média de 20.000 kWh/mês e redução drástica do custo fixo operacional da distribuidora.',
        resultado_valor: '20.000 kWh/mês',
        resultado_label: 'Geração média mensal comprovada',
        potencia_capacidade: '155,0 kWp',
        data_entrega: 'Maio / 2020 (Homologado RGE)',
        status: 'publicado',
        destaque: true,
      },
      {
        titulo: 'Clanel Ind. e Comércio de Confecções — Erechim/RS — 123,5 kWp',
        slug: 'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
        cliente: 'Clanel Indústria e Comércio de Confecções Ltda.',
        setor: 'Indústria',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '123,5 kWp Gerador Fotovoltaico Industrial com 390 módulos fotovoltaicos',
        descricao:
          'A Indústria Têxtil Clanel, de Erechim/RS, investiu na geração solar para obter até 90% de economia na conta de energia e posicionamento sustentável da marca. O sistema conta com 123,5 kWp de potência e 390 módulos distribuídos na cobertura fabril.',
        solucao_tecnica:
          'Instalação de 390 módulos solares de alto rendimento sobre a cobertura industrial, inversores trifásicos com proteções completas CA/CC e projeto elétrico aprovado no CREA-RS e na RGE.',
        resultado:
          'Redução de até 90% nos custos com energia elétrica fabril com retorno estimado do investimento entre 4 e 7 anos.',
        resultado_valor: 'Até 90%',
        resultado_label: 'Economia na fatura de energia',
        potencia_capacidade: '123,5 kWp',
        data_entrega: 'Fevereiro / 2019 (Operação ativa)',
        status: 'publicado',
        destaque: true,
      },
      {
        titulo: 'Panificadora Garcia — Passo Fundo/RS — 112,5 kWp',
        slug: 'panificadora-garcia-passo-fundo-rs-112-5-kwp',
        cliente: 'Panificadora Garcia',
        setor: 'Comércio e Serviços',
        solucao: 'Energia Solar (EPC)',
        local: 'Passo Fundo / RS',
        escopo: '112,5 kWp Sistema Fotovoltaico Comercial de Alta Potência',
        descricao:
          'A panificação exige alto consumo térmico e elétrico diário contínuo em fornos, câmaras frias e maquinários. A Panificadora Garcia em Passo Fundo/RS instalou usina solar de 112,5 kWp com a Delfos para blindar os custos de produção contra bandeiras tarifárias.',
        solucao_tecnica:
          'Arranjo solar de 112,5 kWp dimensionado para compensar a curva de consumo pesado de panificação diurna e noturna, com inversores inteligentes e telemetria remota.',
        resultado:
          'Drástica redução do custo do quilowatt-hora consumido na produção diária de panificação.',
        resultado_valor: '112,5 kWp',
        resultado_label: 'Potência instalada em operação',
        potencia_capacidade: '112,5 kWp',
        data_entrega: 'Julho / 2022 (Operação ativa)',
        status: 'publicado',
        destaque: true,
      },
      {
        titulo: 'Silo de Grãos — Erebango/RS — 76,16 kWp',
        slug: 'silo-erebango-rs-76-16-kwp',
        cliente: 'Produtor Rural de Erebango',
        setor: 'Agronegócio',
        solucao: 'Energia Solar (EPC)',
        local: 'Erebango / RS',
        escopo: '76,16 kWp Gerador Fotovoltaico em Silo de Secagem e Armazenamento',
        descricao:
          'A conta de energia é um dos maiores desafios para os agricultores no beneficiamento e armazenagem de grãos. O sistema fotovoltaico de 76,16 kWp instalado no silo em Erebango/RS foi projetado para gerar cerca de 9.000 kWh/mês, garantindo rentabilidade da safra.',
        solucao_tecnica:
          'Engenharia de fixação adaptada para estruturas de armazenagem de grãos com alta vibração, cabeamento reforçado e inversores com proteção contra poeira e intempéries.',
        resultado:
          'Geração média de 9.000 kWh/mês proporcionando economia direta e maior margem na secagem de grãos.',
        resultado_valor: '9.000 kWh/mês',
        resultado_label: 'Geração mensal média no agronegócio',
        potencia_capacidade: '76,16 kWp',
        data_entrega: 'Fevereiro / 2020 (Homologado)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Posto Caminho do Mercosul — Severiano de Almeida/RS — 54,9 kWp',
        slug: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
        cliente: 'Comércio de Combustíveis Cerro do Meio Dia Ltda.',
        setor: 'Comércio e Serviços',
        solucao: 'Energia Solar (EPC)',
        local: 'Severiano de Almeida / RS',
        escopo: '54,925 kWp com 169 módulos fotovoltaicos em cobertura de posto',
        descricao:
          'Gerador fotovoltaico com potência de 54,925 kWp contendo 169 módulos fotovoltaicos distribuídos ao longo do telhado do Posto Caminho do Mercosul. Reduziu os custos contínuos de refrigeração e bombeamento de combustíveis.',
        solucao_tecnica:
          'Montagem em telhado de posto de combustível com 169 módulos de alta eficiência, proteção contra surtos elétricos e certificação completa de segurança.',
        resultado:
          'Mitigação dos altos custos elétricos de compressores, bombas e conveniência 24 horas.',
        resultado_valor: '169 módulos',
        resultado_label: 'Módulos instalados em telhado comercial',
        potencia_capacidade: '54,925 kWp',
        data_entrega: 'Abril / 2019 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Usina Solar de Solo — Erechim/RS — 40,8 kWp',
        slug: 'usina-solar-solo-erechim-rs-40-8-kwp',
        cliente: 'Residência & Empreendimento Rural',
        setor: 'Investidores e Usinas',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '40,8 kWp Usina Fotovoltaica construída sobre o solo',
        descricao:
          'Usina fotovoltaica de solo com potência instalada de 40,8 kWp, gerando uma economia de aproximadamente R$ 4.250,00 por mês para o cliente. Obra realizada pela engenharia da Delfos em Erechim/RS.',
        solucao_tecnica:
          'Estrutura metálica galvanizada cravada no solo com ângulo de inclinação ótimo para a irradiação da região Norte do RS, inversor central e proteção perimetral.',
        resultado:
          'Economia comprovada de aproximadamente R$ 4.250,00 por mês na fatura de energia.',
        resultado_valor: 'R$ 4.250/mês',
        resultado_label: 'Economia média direta na fatura',
        potencia_capacidade: '40,8 kWp',
        data_entrega: 'Fevereiro / 2020 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Condomínio Residencial Notabile — Erechim/RS — 32,0 kWp',
        slug: 'condominio-residencial-notabile-erechim-rs-32-kwp',
        cliente: 'Condomínio Residencial Notabile',
        setor: 'Condomínios',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '32,0 kWp Sistema Solar Fotovoltaico Condominial para Área Comum',
        descricao:
          'Instalação fotovoltaica para suprir o consumo de elevadores, bombas de recalque, iluminação de áreas comuns e climatização do condomínio, reduzindo a taxa condominial de todos os moradores.',
        solucao_tecnica:
          'Engenharia de cobertura adaptada para edifício multifamiliar, com rateio na fatura da concessionária e proteção estrutural avançada contra vendavais.',
        resultado: 'Redução sensível na cota condominial mensal dos proprietários.',
        resultado_valor: '32,0 kWp',
        resultado_label: 'Geração compartilhada condominial',
        potencia_capacidade: '32,0 kWp',
        data_entrega: 'Agosto / 2022 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Pecuária de Leite — Barão de Cotegipe/RS — 18,5 kWp',
        slug: 'pecuaria-de-leite-barao-de-cotegipe-rs-18-5-kwp',
        cliente: 'Produtor de Pecuária de Leite',
        setor: 'Agronegócio',
        solucao: 'Energia Solar (EPC)',
        local: 'Barão de Cotegipe / RS',
        escopo: '18,525 kWp Sistema Fotovoltaico para Ordenha e Resfriamento de Leite',
        descricao:
          'A atividade leiteira demanda resfriamento ininterrupto e ordenhadeiras mecânicas duas a três vezes ao dia. O sistema foi dimensionado pela Delfos para gerar em média 2.161 kWh/mês.',
        solucao_tecnica:
          'Módulos fotovoltaicos em telhado de galpão rural com dimensionamento elétrico para compensar os ciclos diários dos resfriadores de leite.',
        resultado:
          'Geração média de 2.161,17 kWh/mês com alívio do custo fixo da atividade leiteira.',
        resultado_valor: '2.161 kWh/mês',
        resultado_label: 'Geração mensal média auditada',
        potencia_capacidade: '18,525 kWp',
        data_entrega: 'Julho / 2019 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
      {
        titulo: 'Residência Urbana — Erechim/RS — 6,48 kWp',
        slug: 'residencia-urbana-erechim-rs-6-48-kwp',
        cliente: 'Residência Familiar',
        setor: 'Residências',
        solucao: 'Energia Solar (EPC)',
        local: 'Erechim / RS',
        escopo: '6,48 kWp Sistema Residencial em Telhado Cerâmico',
        descricao:
          'Instalação solar residencial entregue pela Delfos Engenharia para zerar a fatura de energia de uma família em Erechim/RS, cobrindo climatização de verão e inverno, aquecimento de água e consumo diário.',
        solucao_tecnica:
          'Fixadores especiais sem perfuração de telhas cerâmicas, inversor residencial silencioso com monitoramento Wi-Fi no smartphone do cliente.',
        resultado: 'Redução da fatura para o custo mínimo de disponibilidade da rede.',
        resultado_valor: 'Até 90%',
        resultado_label: 'Redução mensal na conta de luz',
        potencia_capacidade: '6,48 kWp',
        data_entrega: 'Junho / 2020 (Operação ativa)',
        status: 'publicado',
        destaque: false,
      },
    ]

    for (let i = 0; i < casesData.length; i++) {
      const c = casesData[i]
      try {
        app.findFirstRecordByData('cases', 'slug', c.slug)
        // Já existe, não recriar
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
      'cassul-erechim-rs-155-0-kwp',
      'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
      'panificadora-garcia-passo-fundo-rs-112-5-kwp',
      'silo-erebango-rs-76-16-kwp',
      'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
      'usina-solar-solo-erechim-rs-40-8-kwp',
      'condominio-residencial-notabile-erechim-rs-32-kwp',
      'pecuaria-de-leite-barao-de-cotegipe-rs-18-5-kwp',
      'residencia-urbana-erechim-rs-6-48-kwp',
    ]

    for (let i = 0; i < slugs.length; i++) {
      try {
        const record = app.findFirstRecordByData('cases', 'slug', slugs[i])
        app.delete(record)
      } catch (_) {}
    }
  },
)
