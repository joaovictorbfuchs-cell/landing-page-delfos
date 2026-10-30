export type SegmentoCase =
  | 'Residências'
  | 'Comércio e Serviços'
  | 'Indústria'
  | 'Agronegócio'
  | 'Condomínios'
  | 'Investidores e Usinas'
  | 'Frotas e Eletropostos'

export type SolucaoCase =
  | 'Energia Solar (EPC)'
  | 'BESS (Armazenamento)'
  | 'O&M e Monitoramento'
  | 'Carregadores Veiculares'

export interface CaseStudy {
  id: string
  slug: string
  titulo: string
  cliente: string
  segmento: SegmentoCase
  solucao: SolucaoCase
  local: string // autorizado para divulgação
  desafioInicial: string
  escopo: string // ex: "450 kWp + BESS 200 kWh" ou "9,75 kWp Solar EPC"
  solucaoTecnica: string
  resultadoMedido: {
    destaqueValor: string // Ex: "91%", "R$ 14.500/mês", "Zero", "100%", "Payback 3,2a"
    destaqueLabel: string // Ex: "Economia média medida na fatura"
    descricao: string // Ex: "Redução média de 91% na fatura mensal de energia elétrica"
    periodoMedicao: string // Ex: "Medição contínua de 12 meses pós-comissionamento"
    metodoMedicao: string // Ex: "Telemetria via inversor conectado + auditoria das faturas da concessionária RGE"
    dadoPendente?: boolean // Quando pendente de auditoria externa oficial
    notaAuditoria?: string
  }
  dataEntrega: string // Ex: "Novembro/2023 (Homologado RGE)"
  destaque?: boolean // Case principal (ex: Indra)
  isExample?: boolean // Case ilustrativo ("Exemplo de aplicação")
  fotoDescricao: string // Descrição do placeholder técnico
  fotoPlaceholderNota?: string // Nota institucional opcional (sem texto de pendência)
  fotoUrl?: string
  fotoUrlGrande?: string
  potenciaOuCapacidadeCurta: string // Ex: "9,75 kWp", "250 kWh", "75 kWp", "Wallbox DLM"
  tags?: string[]
}

export const SEGMENTOS_FILTRO: { id: string; label: string; count?: number }[] = [
  { id: 'todos', label: 'Todos os Segmentos' },
  { id: 'Residências', label: 'Residências' },
  { id: 'Comércio e Serviços', label: 'Comércio e Serviços' },
  { id: 'Indústria', label: 'Indústria' },
  { id: 'Agronegócio', label: 'Agronegócio' },
  { id: 'Condomínios', label: 'Condomínios' },
  { id: 'Investidores e Usinas', label: 'Investidores e Usinas' },
  { id: 'Frotas e Eletropostos', label: 'Frotas e Eletropostos' },
]

export const SOLUCOES_FILTRO: { id: string; label: string }[] = [
  { id: 'todas', label: 'Todas as Soluções' },
  { id: 'Energia Solar (EPC)', label: 'Solar Fotovoltaica' },
  { id: 'BESS (Armazenamento)', label: 'Armazenamento e Baterias (BESS)' },
  { id: 'O&M e Monitoramento', label: 'O&M & Monitoramento' },
  { id: 'Carregadores Veiculares', label: 'Carregadores Veiculares' },
]

export const CASES_DATA: CaseStudy[] = [
  {
    id: 'cassul-erechim-rs-155-0-kwp',
    slug: 'cassul-erechim-rs-155-0-kwp',
    titulo: 'Cassul Distribuidora — Erechim/RS — 155,0 kWp',
    cliente: 'Cassul Distribuidora',
    segmento: 'Comércio e Serviços',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Alto custo de energia elétrica operacional em centro de distribuição comercial com equipamentos e iluminação contínua.',
    escopo: '155,0 kWp Gerador Solar Fotovoltaico em cobertura metálica comercial',
    solucaoTecnica:
      'Projeto e instalação Turnkey Delfos: arranjo fotovoltaico de 155 kWp em telhado metálico com fixadores especiais de alumínio, inversores de alta potência e homologação expressa junto à concessionária RGE.',
    resultadoMedido: {
      destaqueValor: '20.000 kWh/mês',
      destaqueLabel: 'Geração média mensal comprovada',
      descricao:
        'Geração média de 20.000 kWh/mês e redução drástica do custo fixo da distribuidora, liberando capital para novos investimentos.',
      periodoMedicao: 'Medição formal pós-energização',
      metodoMedicao: 'Telemetria dos inversores cruzada com faturas RGE',
    },
    dataEntrega: 'Maio / 2020 (Homologado RGE)',
    destaque: true,
    potenciaOuCapacidadeCurta: '155,0 kWp',
    fotoDescricao:
      'Vista aérea da instalação fotovoltaica sobre telhado metálico da Cassul em Erechim/RS.',
    fotoPlaceholderNota: 'Instalação Homologada RGE',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/05/DJI_0120.jpg',
    tags: ['Comércio', '155 kWp', 'Erechim/RS', 'Telhado Metálico'],
  },
  {
    id: 'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
    slug: 'clanel-ind-confeccoes-erechim-rs-123-5-kwp',
    titulo: 'Clanel Ind. e Comércio de Confecções — Erechim/RS — 123,5 kWp',
    cliente: 'Clanel Indústria e Comércio de Confecções Ltda.',
    segmento: 'Indústria',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Aumentos anuais na tarifa elétrica acima da inflação impactando o custo da produção têxtil e necessidade de posicionamento de sustentabilidade da marca.',
    escopo: '123,5 kWp Gerador Fotovoltaico Industrial com 390 módulos fotovoltaicos',
    solucaoTecnica:
      'Instalação de 390 módulos solares de alto rendimento sobre a cobertura industrial, inversores trifásicos com proteções completas CA/CC e projeto com ART no CREA-RS e RGE.',
    resultadoMedido: {
      destaqueValor: 'Até 90%',
      destaqueLabel: 'Economia na fatura de energia fabril',
      descricao:
        'Redução de até 90% nos custos de energia elétrica da indústria têxtil com payback estimado entre 4 e 7 anos.',
      periodoMedicao: 'Histórico operacional comissionado',
      metodoMedicao: 'Telemetria de geração e faturas do Grupo A',
    },
    dataEntrega: 'Fevereiro / 2019 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '123,5 kWp',
    fotoDescricao:
      '390 módulos fotovoltaicos instalados sobre telhado industrial da Clanel em Erechim/RS.',
    fotoPlaceholderNota: 'Instalação Industrial 390 Módulos',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/02/DJI_0075.jpg',
    tags: ['Indústria', '123,5 kWp', 'Erechim/RS', '390 Módulos'],
  },
  {
    id: 'panificadora-garcia-passo-fundo-rs-112-5-kwp',
    slug: 'panificadora-garcia-passo-fundo-rs-112-5-kwp',
    titulo: 'Panificadora Garcia — Passo Fundo/RS — 112,5 kWp',
    cliente: 'Panificadora Garcia',
    segmento: 'Comércio e Serviços',
    solucao: 'Energia Solar (EPC)',
    local: 'Passo Fundo / RS',
    desafioInicial:
      'Alto consumo contínuo e imprevisível de energia em fornos elétricos, câmaras frias e maquinário de panificação de alta demanda.',
    escopo: '112,5 kWp Sistema Fotovoltaico Comercial de Alta Potência',
    solucaoTecnica:
      'Arranjo solar de 112,5 kWp dimensionado para compensar a curva pesada de panificação, inversores inteligentes e telemetria remota.',
    resultadoMedido: {
      destaqueValor: '112,5 kWp',
      destaqueLabel: 'Potência instalada em operação',
      descricao:
        'Drástica redução do custo do quilowatt-hora consumido na produção diária de panificação.',
      periodoMedicao: 'Acompanhamento contínuo',
      metodoMedicao: 'Telemetria dos inversores',
    },
    dataEntrega: 'Julho / 2022 (Operação ativa)',
    destaque: true,
    potenciaOuCapacidadeCurta: '112,5 kWp',
    fotoDescricao:
      'Visão aérea da usina de 112,5 kWp na cobertura da Panificadora Garcia em Passo Fundo/RS.',
    fotoPlaceholderNota: 'Comercial Alta Potência',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2022/07/DJI_0047.jpg',
    tags: ['Comércio', '112,5 kWp', 'Passo Fundo/RS', 'Panificação'],
  },
  {
    id: 'silo-erebango-rs-76-16-kwp',
    slug: 'silo-erebango-rs-76-16-kwp',
    titulo: 'Silo de Grãos — Erebango/RS — 76,16 kWp',
    cliente: 'Produtor Rural de Erebango',
    segmento: 'Agronegócio',
    solucao: 'Energia Solar (EPC)',
    local: 'Erebango / RS',
    desafioInicial:
      'Custos elevados com energia para secagem e armazenagem de grãos durante o período de safra e entre-safra.',
    escopo: '76,16 kWp Gerador Fotovoltaico em Silo de Secagem e Armazenamento',
    solucaoTecnica:
      'Fixação especializada em estrutura de armazenagem com inversores industriais protegidos contra pó e vibração.',
    resultadoMedido: {
      destaqueValor: '9.000 kWh/mês',
      destaqueLabel: 'Geração mensal média no agronegócio',
      descricao:
        'Geração média de 9.000 kWh/mês garantindo redução da conta de energia e aumento da rentabilidade na secagem de grãos.',
      periodoMedicao: 'Ciclo sazonal de safra',
      metodoMedicao: 'Telemetria do sistema e auditoria RGE',
    },
    dataEntrega: 'Fevereiro / 2020 (Homologado)',
    destaque: false,
    potenciaOuCapacidadeCurta: '76,16 kWp',
    fotoDescricao: 'Foto aérea do arranjo solar sobre o silo de grãos em Erebango/RS.',
    fotoPlaceholderNota: 'Arranjo Agroindustrial',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2020/02/DJI_0023.jpg',
    tags: ['Agronegócio', 'Silo de Grãos', '76,16 kWp', 'Erebango/RS'],
  },
  {
    id: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
    slug: 'posto-caminho-do-mercosul-severiano-de-almeida-rs-54-9-kwp',
    titulo: 'Posto Caminho do Mercosul — Severiano de Almeida/RS — 54,9 kWp',
    cliente: 'Comércio de Combustíveis Cerro do Meio Dia Ltda.',
    segmento: 'Comércio e Serviços',
    solucao: 'Energia Solar (EPC)',
    local: 'Severiano de Almeida / RS',
    desafioInicial:
      'Conta de energia elevada com bombas de combustível, compressores de ar e loja de conveniência operando 24 horas.',
    escopo: '54,925 kWp com 169 módulos fotovoltaicos em cobertura de posto',
    solucaoTecnica:
      'Montagem em telhado de posto de combustível com 169 módulos solares, proteções avançadas contra surtos (DPS) e homologação expressa.',
    resultadoMedido: {
      destaqueValor: '169 módulos',
      destaqueLabel: 'Módulos instalados em telhado comercial',
      descricao: 'Mitigação dos altos custos elétricos de compressores, bombas e conveniência.',
      periodoMedicao: 'Operação ativa contínua',
      metodoMedicao: 'Telemetria de inversores',
    },
    dataEntrega: 'Abril / 2019 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '54,925 kWp',
    fotoDescricao: 'Registro aéreo da cobertura do posto com 169 módulos fotovoltaicos instalados.',
    fotoPlaceholderNota: '169 Módulos Fotovoltaicos',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/04/DJI_0068.jpg',
    tags: ['Comércio', 'Posto de Combustíveis', '54,9 kWp', 'Severiano de Almeida'],
  },
  {
    id: 'usina-solar-solo-erechim-rs-40-8-kwp',
    slug: 'usina-solar-solo-erechim-rs-40-8-kwp',
    titulo: 'Usina Solar de Solo — Erechim/RS — 40,8 kWp',
    cliente: 'Residência & Empreendimento Rural',
    segmento: 'Investidores e Usinas',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Necessidade de gerar energia própria para compensação em imóveis remotos sem disponibilidade de espaço de telhado.',
    escopo: '40,8 kWp Usina Fotovoltaica construída sobre o solo',
    solucaoTecnica:
      'Estrutura metálica galvanizada cravada no solo com ângulo de inclinação ótimo para a irradiação da região Norte do RS e proteção perimetral.',
    resultadoMedido: {
      destaqueValor: 'R$ 4.250/mês',
      destaqueLabel: 'Economia média direta na fatura',
      descricao:
        'Economia comprovada de aproximadamente R$ 4.250,00 por mês na conta de energia elétrica.',
      periodoMedicao: '12 meses pós-energização',
      metodoMedicao: 'Auditoria de faturas e geração',
    },
    dataEntrega: 'Fevereiro / 2020 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '40,8 kWp Solo',
    fotoDescricao: 'Estrutura de usina de solo fotovoltaica em terreno em Erechim/RS.',
    fotoPlaceholderNota: 'Usina de Solo Homologada',
    fotoUrl:
      'https://www.delfos.eng.br/site/wp-content/uploads/2020/02/WhatsApp-Image-2019-12-11-at-17.44.44-1.jpeg',
    tags: ['Investidores', 'Usina Solo', '40,8 kWp', 'Erechim/RS'],
  },
  {
    id: 'residencia-urbana-erechim-rs-6-48-kwp',
    slug: 'residencia-urbana-erechim-rs-6-48-kwp',
    titulo: 'Residência Urbana — Erechim/RS — 6,48 kWp',
    cliente: 'Residência Familiar',
    segmento: 'Residências',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Faturas elevadas causadas por climatização de precisão de verão/inverno e aquecimento de água em residência.',
    escopo: '6,48 kWp Sistema Residencial em Telhado Cerâmico',
    solucaoTecnica:
      'Fixadores especiais sem perfuração de telhas cerâmicas, inversor residencial silencioso com monitoramento Wi-Fi.',
    resultadoMedido: {
      destaqueValor: 'Até 90%',
      destaqueLabel: 'Redução na fatura de energia',
      descricao: 'Redução da fatura para o custo mínimo de disponibilidade da rede da RGE.',
      periodoMedicao: 'Histórico contínuo residencial',
      metodoMedicao: 'App do inversor e faturas RGE',
    },
    dataEntrega: 'Junho / 2020 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '6,48 kWp',
    fotoDescricao: 'Foto aérea da cobertura cerâmica simétrica com painéis solares em Erechim/RS.',
    fotoPlaceholderNota: 'Telhado Cerâmico Residencial',
    fotoUrl:
      'https://www.delfos.eng.br/site/wp-content/uploads/2020/06/DJI_0029-e1591648388934.jpg',
    tags: ['Residencial', 'Telhado Cerâmico', '6,48 kWp', 'Erechim/RS'],
  },
  {
    id: 'pecuaria-de-leite-barao-de-cotegipe-rs-18-5-kwp',
    slug: 'pecuaria-de-leite-barao-de-cotegipe-rs-18-5-kwp',
    titulo: 'Pecuária de Leite — Barão de Cotegipe/RS — 18,5 kWp',
    cliente: 'Produtor de Pecuária de Leite',
    segmento: 'Agronegócio',
    solucao: 'Energia Solar (EPC)',
    local: 'Barão de Cotegipe / RS',
    desafioInicial:
      'A atividade leiteira exige resfriamento ininterrupto e ordenhadeiras elétricas diárias, pesando no custo de produção.',
    escopo: '18,525 kWp Sistema Fotovoltaico para Ordenha e Resfriamento de Leite',
    solucaoTecnica:
      'Módulos fotovoltaicos em telhado de galpão rural dimensionados para compensar os ciclos de pico dos resfriadores.',
    resultadoMedido: {
      destaqueValor: '2.161 kWh/mês',
      destaqueLabel: 'Geração mensal média auditada',
      descricao: 'Geração média de 2.161,17 kWh/mês aliviando o custo fixo da atividade leiteira.',
      periodoMedicao: 'Medição formal pós-energização',
      metodoMedicao: 'Telemetria do sistema rural',
    },
    dataEntrega: 'Julho / 2019 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '18,525 kWp',
    fotoDescricao: 'Painéis solares fotovoltaicos sobre galpão de ordenha e resfriamento leiteiro.',
    fotoPlaceholderNota: 'Geração Rural Agro',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/07/1-3.jpg',
    tags: ['Agronegócio', 'Pecuária de Leite', '18,5 kWp', 'Barão de Cotegipe'],
  },
  {
    id: 'system-desenvolvimento-software-erechim-rs-25-kwp',
    slug: 'system-desenvolvimento-software-erechim-rs-25-kwp',
    titulo: 'System Desenvolvimento de Software — Erechim/RS — 25,0 kWp',
    cliente: 'System Desenvolvimento de Software Ltda.',
    segmento: 'Indústria',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Necessidade de cobrir o estacionamento de veículos corporativos integrando inovação tecnológica e sustentabilidade na sede da empresa.',
    escopo: '25,0 kWp Sistema de Carport Solar com 78 painéis fotovoltaicos em estacionamento',
    solucaoTecnica:
      'Estrutura metálica de Carport Solar para cobertura de vagas corporativas, 78 módulos fotovoltaicos de alta eficiência e inversores com telemetria remota integrada.',
    resultadoMedido: {
      destaqueValor: '25,0 kWp',
      destaqueLabel: 'Potência instalada em Carport Solar',
      descricao:
        '78 painéis fotovoltaicos em operação com geração contínua e cobertura sustentável de estacionamento corporativo.',
      periodoMedicao: 'Operação ativa contínua',
      metodoMedicao: 'Telemetria do sistema e monitoramento da concessionária',
    },
    dataEntrega: 'Agosto / 2019 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '25,0 kWp Carport',
    fotoDescricao: 'Carport solar corporativo no estacionamento da System Software em Erechim/RS.',
    fotoPlaceholderNota: 'Carport Solar Corporativo',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2019/08/DJI_0001.jpg',
    tags: ['Carport Solar', 'Indústria / Software', '25 kWp', 'Erechim/RS', 'Destaque Regional'],
  },
  {
    id: 'ervateira-bazia-inacio-martins-pr-93-5-kwp',
    slug: 'ervateira-bazia-inacio-martins-pr-93-5-kwp',
    titulo: 'Ervateira Bazia — Inácio Martins/PR — 93,5 kWp',
    cliente: 'Ervateira Bazia',
    segmento: 'Agronegócio',
    solucao: 'Energia Solar (EPC)',
    local: 'Inácio Martins / PR',
    desafioInicial:
      'Alta demanda de energia elétrica no processamento e moagem pesada de erva-mate no estado do Paraná.',
    escopo: '93,5 kWp Usina Fotovoltaica Agroindustrial em cobertura',
    solucaoTecnica:
      'Arranjo fotovoltaico de 93,5 kWp dimensionado para regime industrial severo, inversores de alta potência e quadro de proteção CA/CC completo.',
    resultadoMedido: {
      destaqueValor: '93,5 kWp',
      destaqueLabel: 'Potência agroindustrial instalada',
      descricao:
        'Suprimento da demanda pesada de moagem e processamento agroindustrial de erva-mate com 93,5 kWp em operação.',
      periodoMedicao: 'Histórico operacional contínuo',
      metodoMedicao: 'Monitoramento remoto do arranjo industrial',
    },
    dataEntrega: 'Agosto / 2022 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '93,5 kWp',
    fotoDescricao: 'Cobertura agroindustrial com usina solar de 93,5 kWp na Ervateira Bazia.',
    fotoPlaceholderNota: 'Usina Agroindustrial 93,5 kWp',
    fotoUrl:
      'https://www.delfos.eng.br/site/wp-content/uploads/2022/08/WhatsApp-Image-2022-08-12-at-12.40.04-1-e1660823625916.jpeg',
    tags: ['Agroindústria', 'Erva-mate', '93,5 kWp', 'Paraná', 'Grande Porte'],
  },
  {
    id: 'dal-pra-moveis-erechim-rs-74-43-kwp',
    slug: 'dal-pra-moveis-erechim-rs-74-43-kwp',
    titulo: 'Dal Pra Comércio e Indústria de Móveis — Erechim/RS — 74,43 kWp',
    cliente: 'Dal Pra Comércio e Indústria de Móveis',
    segmento: 'Indústria',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Alto consumo produtivo em maquinários de marcenaria industrial, exigindo redução substancial no custo de energia da fábrica.',
    escopo: '74,43 kWp Sistema Fotovoltaico Industrial em Pavilhão Moveleiro',
    solucaoTecnica:
      'Engenharia de cobertura para pavilhão industrial de móveis com 74,43 kW de potência, inversores trifásicos com proteções completas CA/CC.',
    resultadoMedido: {
      destaqueValor: 'R$ 84.000/ano',
      destaqueLabel: 'Economia anual comprovada',
      descricao:
        'Economia anual comprovada de aproximadamente R$ 84.000,00 na conta de energia da indústria moveleira.',
      periodoMedicao: 'Histórico auditado pós-instalação',
      metodoMedicao: 'Faturas auditadas da distribuidora e telemetria',
    },
    dataEntrega: 'Abril / 2019 (Operação ativa)',
    destaque: true,
    potenciaOuCapacidadeCurta: '74,43 kWp',
    fotoDescricao:
      'Vista aérea do pavilhão industrial moveleiro com sistema fotovoltaico de 74,43 kW.',
    fotoPlaceholderNota: 'Pavilhão Industrial Moveleiro',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=factory%20solar%20rooftop&color=blue',
    tags: ['Indústria', 'Moveleiro', '74,43 kWp', 'Erechim/RS', 'Economia R$ 84k/ano'],
  },
  {
    id: 'aviario-erebango-rs-42-16-kwp',
    slug: 'aviario-erebango-rs-42-16-kwp',
    titulo: 'Aviário — Erebango/RS — 42,16 kWp',
    cliente: 'Produtor Rural Integrado de Aves',
    segmento: 'Agronegócio',
    solucao: 'Energia Solar (EPC)',
    local: 'Erebango / RS',
    desafioInicial:
      'Custos elevados e necessidade de estabilidade no acionamento de exaustores e climatizadores de granja avícola.',
    escopo: '42,16 kWp Sistema Fotovoltaico Rural para Granja Avícola Climatizada',
    solucaoTecnica:
      'Instalação fotovoltaica em cobertura metálica de galpão avícola rural com reforço de cabeamento para longas distâncias e inversores industriais.',
    resultadoMedido: {
      destaqueValor: '5.000 kWh/mês',
      destaqueLabel: 'Geração mensal média auditada',
      descricao:
        'Geração média auditada de 5.000 kWh/mês garantindo redução no custo elétrico da criação avícola.',
      periodoMedicao: 'Média de geração contínua',
      metodoMedicao: 'Telemetria do sistema solar rural',
    },
    dataEntrega: 'Fevereiro / 2021 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '42,16 kWp',
    fotoDescricao: 'Vista aérea da cobertura de aviário climatizado em Erebango/RS com 42,16 kWp.',
    fotoPlaceholderNota: 'Cobertura de Aviário Climatizado',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=farm%20solar%20roof&color=blue',
    tags: ['Agronegócio', 'Avicultura', '42,16 kWp', 'Erebango/RS', '5.000 kWh/mês'],
  },
  {
    id: 'spazzini-tur-erechim-rs-32-16-kwp',
    slug: 'spazzini-tur-erechim-rs-32-16-kwp',
    titulo: 'Spazzini Tur — Erechim/RS — 32,16 kWp',
    cliente: 'Spazzini Tur Transporte e Turismo',
    segmento: 'Comércio e Serviços',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Consumo elevado com oficina de frotas rodoviárias, ar-condicionado de setores administrativos e bombas de lavagem.',
    escopo: '32,16 kWp Sistema Fotovoltaico Comercial em Garagem de Frotas',
    solucaoTecnica:
      'Engenharia de fixação em cobertura metálica de garagem de transportes com arranjo de 32,16 kWp e inversores trifásicos.',
    resultadoMedido: {
      destaqueValor: '32,16 kWp',
      destaqueLabel: 'Potência instalada homologada',
      descricao:
        'Operação estável de 32,16 kWp suprindo oficinas mecânicas e infraestrutura da frota rodoviária.',
      periodoMedicao: 'Operação ativa contínua',
      metodoMedicao: 'Telemetria e faturas da distribuidora',
    },
    dataEntrega: 'Agosto / 2021 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '32,16 kWp',
    fotoDescricao: 'Vista aérea da garagem e oficina da Spazzini Tur com sistema fotovoltaico.',
    fotoPlaceholderNota: 'Garagem de Frotas e Logística',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=commercial%20garage%20solar&color=blue',
    tags: ['Frotas e Transportes', 'Comercial', '32,16 kWp', 'Erechim/RS'],
  },
  {
    id: 'arfes-refrigeracao-erechim-rs-30-kwp',
    slug: 'arfes-refrigeracao-erechim-rs-30-kwp',
    titulo: 'ARFES Refrigeração — Erechim/RS — 30,0 kWp',
    cliente: 'ARFES Refrigeração Indústria e Comércio Ltda.',
    segmento: 'Indústria',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Fabricação de equipamentos de refrigeração comercial com consumo intensivo de máquinas de corte e montagem.',
    escopo: '30,0 kWp com 86 módulos fotovoltaicos em 170,28 m² de cobertura',
    solucaoTecnica:
      'Arranjo de 86 módulos fotovoltaicos de alto rendimento sobre estrutura industrial de 170,28 m², inversor de 30 kW com proteção avançada.',
    resultadoMedido: {
      destaqueValor: '3.663 kWh/mês',
      destaqueLabel: 'Produção média mensal',
      descricao:
        'Produção calculada e comprovada de 43.960 kWh/ano (3.663 kWh/mês) para o parque fabril de refrigeração.',
      periodoMedicao: 'Produção anual de 43.960 kWh',
      metodoMedicao: 'Telemetria de geração da planta fabril',
    },
    dataEntrega: 'Outubro / 2019 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '30,0 kWp',
    fotoDescricao: 'Vista aérea da fábrica da ARFES Refrigeração com 86 módulos fotovoltaicos.',
    fotoPlaceholderNota: '86 Módulos em Cobertura Industrial',
    fotoUrl:
      'https://img.usecurling.com/p/1600/1000?q=industrial%20solar%20rooftop%20plant&color=blue',
    tags: ['Indústria', 'Refrigeração', '30 kWp', '86 Módulos', 'Erechim/RS'],
  },
  {
    id: 'bem-estar-moveis-erechim-rs-25-41-kwp',
    slug: 'bem-estar-moveis-erechim-rs-25-41-kwp',
    titulo: 'Bem Estar Móveis — Erechim/RS — 25,41 kWp',
    cliente: 'Bem Estar Móveis',
    segmento: 'Comércio e Serviços',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Showroom comercial amplo com iluminação cenográfica contínua e climatização central de alta demanda.',
    escopo: '25,41 kWp Sistema Fotovoltaico Comercial em Loja de Móveis',
    solucaoTecnica:
      'Arranjo solar de 25,41 kWp dimensionado para compensar a climatização e iluminação de showroom moveleiro.',
    resultadoMedido: {
      destaqueValor: 'R$ 30.000/ano',
      destaqueLabel: 'Economia anual comprovada',
      descricao:
        'Geração média de 3.053 kWh/mês proporcionando economia anual de aproximadamente R$ 30.000,00.',
      periodoMedicao: 'Geração média auditada de 3.053 kWh/mês',
      metodoMedicao: 'Monitoramento online e faturas da concessionária',
    },
    dataEntrega: 'Novembro / 2018 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '25,41 kWp',
    fotoDescricao: 'Cobertura fotovoltaica comercial da loja Bem Estar Móveis em Erechim/RS.',
    fotoPlaceholderNota: 'Showroom Comercial Climatizado',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=commercial%20store%20solar&color=blue',
    tags: ['Comércio e Serviços', 'Móveis', '25,41 kWp', 'Economia R$ 30k/ano', 'Erechim/RS'],
  },
  {
    id: 'supermercado-cavassola-erechim-rs-20-kwp',
    slug: 'supermercado-cavassola-erechim-rs-20-kwp',
    titulo: 'Supermercado Cavassola — Erechim/RS — 20,0 kWp',
    cliente: 'Supermercado Cavassola',
    segmento: 'Comércio e Serviços',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Câmaras frias, ilhas de congelados e iluminação de supermercado demandando energia 24 horas por dia.',
    escopo: '20,0 kWp Gerador Fotovoltaico Comercial em Cobertura',
    solucaoTecnica:
      'Montagem sobre telhado comercial com inversor de 20 kW, proteção contra surtos DPS e dimensionamento para compensar refrigeração e checkout.',
    resultadoMedido: {
      destaqueValor: '20,0 kWp',
      destaqueLabel: 'Potência comercial instalada',
      descricao:
        'Redução direta na fatura de energia elétrica comercial com 20 kW de potência em plena operação.',
      periodoMedicao: 'Operação ativa contínua',
      metodoMedicao: 'Telemetria do inversor comercial',
    },
    dataEntrega: 'Dezembro / 2020 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '20,0 kWp',
    fotoDescricao: 'Vista aérea do telhado do Supermercado Cavassola com gerador fotovoltaico.',
    fotoPlaceholderNota: 'Cobertura Comercial Supermercado',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=supermarket%20solar%20rooftop&color=blue',
    tags: ['Supermercados', 'Comércio', '20 kWp', 'Erechim/RS'],
  },
  {
    id: 'condominio-residencial-notabile-erechim-rs-32-kwp',
    slug: 'condominio-residencial-notabile-erechim-rs-32-kwp',
    titulo: 'Condomínio Residencial Notabile — Erechim/RS — 32,0 kWp',
    cliente: 'Condomínio Residencial Notabile',
    segmento: 'Condomínios',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Faturas elevadas de energia para áreas comuns, elevadores, bombas de recalque e iluminação condominial gerando aumento contínuo na taxa de condomínio.',
    escopo: '32,0 kWp Sistema Solar Fotovoltaico Condominial para Área Comum',
    solucaoTecnica:
      'Engenharia de cobertura adaptada para edifício multifamiliar, com arranjo fotovoltaico de 32 kWp, rateio de créditos nas faturas da concessionária e reforço estrutural contra intempéries.',
    resultadoMedido: {
      destaqueValor: '32,0 kWp',
      destaqueLabel: 'Geração compartilhada condominial',
      descricao:
        'Redução direta de até 85% nas contas de eletricidade das áreas comuns e estabilização da taxa de condomínio.',
      periodoMedicao: 'Histórico contínuo pós-energização',
      metodoMedicao: 'Demonstrativo da administradora e auditoria de faturas RGE',
    },
    dataEntrega: 'Agosto / 2022 (Operação ativa)',
    destaque: true,
    potenciaOuCapacidadeCurta: '32,0 kWp',
    fotoDescricao:
      'Instalação solar fotovoltaica na cobertura do Condomínio Residencial Notabile em Erechim/RS.',
    fotoPlaceholderNota: 'Cobertura Condominial Notabile',
    fotoUrl:
      'https://www.delfos.eng.br/site/wp-content/uploads/2022/08/Captura-de-tela-2025-12-18-213403.png',
    tags: ['Condomínios', '32 kWp', 'Áreas Comuns', 'Erechim/RS', 'Destaque'],
  },
  {
    id: 'condominio-residencial-lyon-erechim-rs-15-kwp',
    slug: 'condominio-residencial-lyon-erechim-rs-15-kwp',
    titulo: 'Condomínio Residencial Lyon — Erechim/RS — 15,0 kWp',
    cliente: 'Condomínio Residencial Lyon',
    segmento: 'Condomínios',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Faturas elevadas nas áreas comuns (elevadores, bombas de recalque, portaria eletrônica e iluminação de garagens).',
    escopo: '15,0 kWp Sistema Fotovoltaico Condominial para Áreas Comuns',
    solucaoTecnica:
      'Engenharia de cobertura adaptada para edifício residencial com fixadores especiais e quadro de proteção CA/CC integrado à entrada de energia.',
    resultadoMedido: {
      destaqueValor: '15,0 kWp',
      destaqueLabel: 'Potência condominial instalada',
      descricao:
        'Redução direta no custo de energia das áreas comuns e desoneração da taxa de condomínio.',
      periodoMedicao: 'Histórico condominial contínuo',
      metodoMedicao: 'Demonstrativo mensal da administradora e telemetria',
    },
    dataEntrega: 'Janeiro / 2021 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '15,0 kWp',
    fotoDescricao:
      'Cobertura do Edifício Residencial Lyon com sistema solar de 15 kWp em Erechim/RS.',
    fotoPlaceholderNota: 'Cobertura Condomínio Lyon',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2021/01/DJI_0001.jpg',
    tags: ['Condomínios', 'Residencial Multifamiliar', '15 kWp', 'Áreas Comuns', 'Erechim/RS'],
  },
  {
    id: 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
    slug: 'indra-distribuidora-agropecuaria-erechim-rs-9-75-kwp',
    titulo: 'Indra Distribuidora de Insumos Agropecuários — Erechim/RS — 9,75 kWp',
    cliente: 'Indra — Distribuidora de Insumos para Agropecuária Ltda.',
    segmento: 'Agronegócio',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS',
    desafioInicial:
      'Custos fixos de eletricidade na operação administrativa e logística de distribuição de insumos agropecuários.',
    escopo: '9,75 kWp Gerador Fotovoltaico Comercial em Cobertura Metálica',
    solucaoTecnica:
      'Instalação de módulos solares em cobertura metálica, inversor com proteções completas contra surtos DPS e homologação expressa.',
    resultadoMedido: {
      destaqueValor: '13.865 kWh/ano',
      destaqueLabel: 'Produção anual comprovada',
      descricao:
        'Produção anual de 13.865 kWh suprindo a operação administrativa e logística da distribuidora agropecuária.',
      periodoMedicao: 'Produção anual auditada de 13.865 kWh',
      metodoMedicao: 'Telemetria do sistema comercial',
    },
    dataEntrega: 'Janeiro / 2019 (Operação ativa)',
    destaque: false,
    potenciaOuCapacidadeCurta: '9,75 kWp',
    fotoDescricao:
      'Instalação fotovoltaica na cobertura metálica da Indra Distribuidora Agropecuária em Erechim/RS.',
    fotoPlaceholderNota: 'Cobertura Indra Agropecuária',
    fotoUrl: 'https://www.delfos.eng.br/site/wp-content/uploads/2024/10/Imagem-3-1.jpg',
    tags: ['Agronegócio', 'Insumos Agropecuários', '9,75 kWp', '13.865 kWh/ano', 'Erechim/RS'],
  },
  {
    id: 'case-industria-metalmecanica',
    slug: 'industria-metalmecanica-bess-shaving',
    titulo: 'Indústria Metalmecânica & Alimentos RS',
    cliente: 'Indústria Metalmecânica do Alto Uruguai (Autorizado sob sigilo de marca)',
    segmento: 'Indústria',
    solucao: 'BESS (Armazenamento)',
    local: 'Polo Industrial de Erechim / RS',
    desafioInicial:
      'Microinterrupções e quedas de rede de 10 a 20 minutos desconfiguravam centros de usinagem CNC e fornos industriais, gerando até R$ 80.000 em perdas de lotes de matéria-prima por evento, além de multas frequentes por ultrapassagem de demanda contratada.',
    escopo: '450 kWp Solar + Armazenamento em Baterias (BESS C&I) 250 kWh / 100 kW',
    solucaoTecnica:
      'Instalação de gabinete climatizado de baterias (BESS C&I) com química de Lítio Ferro Fosfato (LiFePO4), EMS com comutação ininterrupta (< 20ms), bloqueio do horário de ponta e algoritmo de redução de cobrança de demanda (peak shaving) nas partidas de motores pesados.',
    resultadoMedido: {
      destaqueValor: 'Zero',
      destaqueLabel: 'Paradas não planejadas de produção',
      descricao:
        'Zero interrupções de fábrica registradas no ano e economia de R$ 14.500/mês em corte de picos de demanda contratada.',
      periodoMedicao: 'Auditoria técnica de 14 meses operacionais contínuos',
      metodoMedicao:
        'Medição de telemetria de alta frequência do EMS Delfos integrada à fatura do grupo tarifário A (Verde/Azul).',
    },
    dataEntrega: 'Agosto / 2024 (Operação comissionada)',
    potenciaOuCapacidadeCurta: '450 kWp + 250 kWh',
    fotoDescricao:
      'Gabinete BESS climatizado externo IP55 com sistema de extinção de incêndio e subestação abrigada.',
    fotoPlaceholderNota: 'BESS Industrial LiFePO4',
    tags: ['Indústria', 'BESS LiFePO4', 'Peak Shaving', 'Zero Blecaute'],
  },
  {
    id: 'case-condominio-dlm',
    slug: 'condominio-residencial-carregadores-dlm',
    titulo: 'Condomínio Residencial Multifamiliar',
    cliente: 'Edifício Residencial Alto Uruguai (Autorizado)',
    segmento: 'Condomínios',
    solucao: 'Carregadores Veiculares',
    local: 'Erechim / RS',
    desafioInicial:
      'Demanda do transformador de 75 kVA já próxima do limite no início da noite. Vários condôminos adquiriram carros elétricos (BYD, Volvo, BMW), gerando impasses em assembleia e orçamento da concessionária superior a R$ 90.000 para troca de transformador.',
    escopo: 'Infraestrutura NBR 17019 para 24 vagas + 6 Wallboxes 7,4 kW + Smart DLM',
    solucaoTecnica:
      'Barramento blindado com eletrocalhas dedicadas, proteção DR Tipo B e instalação do sistema Smart DLM (Dynamic Load Management) que modula a carga dos veículos de acordo com o consumo instantâneo dos apartamentos.',
    resultadoMedido: {
      destaqueValor: 'R$ 90.000+',
      destaqueLabel: 'Economia direta em infraestrutura',
      descricao:
        'Zero aumento na demanda contratada do transformador predial e rateio individual 100% automatizado por RFID.',
      periodoMedicao: '8 meses de operação condominial contínua',
      metodoMedicao:
        'Auditoria do sistema de telemetria DLM Delfos conferido mensalmente na prestação de contas da administradora do condomínio.',
    },
    dataEntrega: 'Maio / 2024 (Entregue e homologado)',
    potenciaOuCapacidadeCurta: '6 Wallboxes + DLM 24 vagas',
    fotoDescricao:
      'Estações Wallbox instaladas em vagas demarcadas com leitores RFID e infraestrutura aparente em eletrocalha perfurada.',
    fotoPlaceholderNota: 'Smart DLM NBR 17019',
    tags: ['Condomínios', 'Smart DLM', 'NBR 17019', 'Rateio Individual'],
  },
  {
    id: 'case-agro-avicultura',
    slug: 'avicultura-climatizada-backup-rural',
    titulo: 'Granja Avícola Climatizada & Agro',
    cliente: 'Produtor Rural Integrado (Região Alto Uruguai/RS)',
    segmento: 'Agronegócio',
    solucao: 'BESS (Armazenamento)',
    local: 'Zona Rural / Região de Erechim / RS',
    desafioInicial:
      'Rede rural monofásica/bifásica instável sujeita a temporais de verão. O desligamento dos exaustores por mais de 30 minutos em dias quentes trazia risco iminente de perda de lotes completos de 40.000 aves por estresse térmico.',
    escopo: '75 kWp Solar Solo + BESS 80 kWh Modular com Reversão Automática',
    solucaoTecnica:
      'Usinas de solo em estrutura monoposte galvanizada integradas a banco de baterias LiFePO4 de rápida resposta e inversor off-grid redundante, substituindo acionamento ruidoso de diesel.',
    resultadoMedido: {
      destaqueValor: '100%',
      destaqueLabel: 'Confiabilidade de suprimento no verão',
      descricao:
        'Zero perda de aves em 4 eventos severos de queda de rede da concessionária no último ciclo produtivo.',
      periodoMedicao: 'Acompanhamento de 1 safra completa de verão (6 meses)',
      metodoMedicao:
        'Registros do CLP dos galpões climatizados correlacionados com logs de disparo do BESS Delfos.',
    },
    dataEntrega: 'Janeiro / 2024 (Operação rural ativa)',
    potenciaOuCapacidadeCurta: '75 kWp + 80 kWh',
    fotoDescricao:
      'Usina fotovoltaica de solo ao lado de galpão avícola climatizado e abrigo técnico de baterias.',
    fotoPlaceholderNota: 'Agro Solar + BESS',
    tags: ['Agronegócio', 'Baterias LiFePO4', 'Geração em Solo', 'Continuidade Crítica'],
  },
  {
    id: 'case-residencia-alto-padrao',
    slug: 'residencia-alto-padrao-erechim',
    titulo: 'Residência Sobrado Alto Padrão',
    cliente: 'Residência Família Martins (Autorizado)',
    segmento: 'Residências',
    solucao: 'Energia Solar (EPC)',
    local: 'Bairro Fátima, Erechim / RS',
    desafioInicial:
      'Consumo elevado com piso aquecido, climatização multizone e piscina aquecida. O proprietário exigia acabamento estético rigoroso sem quebra de telhas cerâmicas e integração com monitoramento mobile.',
    escopo: '12,5 kWp Projeto e Instalação Solar em telhado cerâmico com microinversores',
    solucaoTecnica:
      'Instalação com microinversores de alta eficiência por painel, reduzindo perdas por sombras parciais de árvores vizinhas, com cabeamento embutido e quadro de proteção em invólucro premium.',
    resultadoMedido: {
      destaqueValor: 'R$ 1.350/mês',
      destaqueLabel: 'Economia média comprovada na fatura',
      descricao:
        'Fatura média reduzida para taxa básica de disponibilidade da concessionária (RGE).',
      periodoMedicao: '18 meses de histórico de consumo pós-comissionamento',
      metodoMedicao:
        'Aplicativo móvel de telemetria por painel verificado com as faturas residenciais.',
    },
    dataEntrega: 'Março / 2023 (Operação residencial ativa)',
    potenciaOuCapacidadeCurta: '12,5 kWp',
    fotoDescricao:
      'Telhado cerâmico de alto padrão com disposição simétrica dos módulos solares e fixadores discretos.',
    fotoPlaceholderNota: 'Telhado Cerâmico Premium',
    tags: ['Residencial', 'Microinversores', 'Telhado Cerâmico', 'Design Limpo'],
  },
  {
    id: 'case-usina-solo-investidor',
    slug: 'usina-solo-geracao-compartilhada-investidor',
    titulo: 'Usina de Solo para Investidor de GD',
    cliente: 'Grupo de Investimento Imobiliário & Energia (Autorizado sob sigilo)',
    segmento: 'Investidores e Usinas',
    solucao: 'Energia Solar (EPC)',
    local: 'Região Norte / RS',
    desafioInicial:
      'Terreno rural com declividade irregular e necessidade de modelagem financeira segura sob a Lei 14.300/2022 para locação de cotas de geração distribuída com taxa interna de retorno (TIR) atrativa.',
    escopo: '300 kWp Usina de Solo com Subestação Abrigada',
    solucaoTecnica:
      'Engenharia civil e elétrica de solo com terraplanagem otimizada, estruturas bifaciais com rastreamento de solo e cabeamento de média tensão até o ponto de conexão da concessionária.',
    resultadoMedido: {
      destaqueValor: 'TIR ~24% a.a.',
      destaqueLabel: 'Retorno financeiro projetado e medido',
      descricao:
        'Desempenho operacional com Performance Ratio de 82,1% auditado nos primeiros ciclos.',
      periodoMedicao: '9 meses de geração contínua pós-energização',
      metodoMedicao:
        'Estação meteorológica local com piranômetro calibrado e telemetria dos inversores centrais.',
      dadoPendente: false,
    },
    dataEntrega: 'Fevereiro / 2024 (Conectada à rede)',
    potenciaOuCapacidadeCurta: '300 kWp Solo',
    fotoDescricao:
      'Visão panorâmica da usina de solo com linhas de módulos bifaciais e cerca perimetral com SPDA.',
    fotoPlaceholderNota: 'Usina de Solo GD',
    tags: ['Investidores', 'Usina Solo', 'GD Compartilhada', 'Média Tensão'],
  },
  {
    id: 'case-om-recuperacao-usina',
    slug: 'diagnostico-om-termografia-drone-comercio',
    titulo: 'Auditoria O&M & Termografia por Drone',
    cliente: 'Centro de Distribuição Comercial RS (Autorizado)',
    segmento: 'Comércio e Serviços',
    solucao: 'O&M e Monitoramento',
    local: 'Passo Fundo / RS (Atuação regional Delfos)',
    desafioInicial:
      'A usina comercial de 120 kWp havia sido instalada por outra empresa que fechou. O cliente notou que a fatura vinha aumentando mês a mês, sem saber se o problema era poeira, defeito de placas ou erro no inversor.',
    escopo:
      'Auditoria O&M completa + Termografia radiométrica com drone + Limpeza técnica de 260 módulos',
    solucaoTecnica:
      'Inspeção por drone detectou 6 módulos com diodos de bypass em curto e 2 conexões MC4 superaquecidas (hotspot de 68°C). A equipe Delfos substituiu os módulos em garantia e executou lavagem técnica com água deionizada.',
    resultadoMedido: {
      destaqueValor: '+21,4%',
      destaqueLabel: 'Recuperação na geração de energia',
      descricao:
        'Recuperação de 21,4% na geração mensal apurada já nos primeiros 30 dias após a intervenção.',
      periodoMedicao: 'Comparativo de 60 dias antes vs. 60 dias depois',
      metodoMedicao:
        'Telemetria do portal de monitoramento normalizada por irradiação solar mensal.',
    },
    dataEntrega: 'Julho / 2024 (Plano O&M Pro ativo)',
    potenciaOuCapacidadeCurta: '120 kWp O&M',
    fotoDescricao:
      'Imagem composta: drone sobrevoando a cobertura industrial e mapa de calor infravermelho revelando anomalia.',
    fotoPlaceholderNota: 'Auditoria O&M & Drone',
    tags: ['O&M', 'Drone Termográfico', 'Limpeza Técnica', 'Recuperação +21%'],
  },
  {
    id: 'case-frota-eletroposto',
    slug: 'eletroposto-frota-corporativa-fast-charge',
    titulo: 'Eletroposto de Recarga Rápida Corporativa',
    cliente: 'Empresa de Logística e Distribuição Urbana (Autorizado sob sigilo)',
    segmento: 'Frotas e Eletropostos',
    solucao: 'Carregadores Veiculares',
    local: 'Região Metropolitana / RS',
    desafioInicial:
      'Transição de frota de furgões de entrega para veículos 100% elétricos. Necessidade de carregar 8 vans durante a janela noturna de 4 horas sem sobrecarregar a entrada de energia da transportadora.',
    escopo: '2 Carregadores DC Fast Charger 60 kW + 4 Wallbox 22 kW AC + Subestação 150 kVA',
    solucaoTecnica:
      'Dimensionamento de subestação dedicada com proteção contra harmônicos e plataforma de gestão de frotas para agendamento inteligente da recarga por veículo de acordo com a rota do dia seguinte.',
    resultadoMedido: {
      destaqueValor: 'R$ 0,18/km',
      destaqueLabel: 'Custo de combustível elétrico equivalente',
      descricao:
        'Custo operacional rodoviário de R$ 0,18 por km rodado contra R$ 0,82/km na antiga frota a diesel.',
      periodoMedicao: 'Auditoria de 120.000 km rodados pela frota elétrica',
      metodoMedicao:
        'Planilha de faturamento de telemetria veicular combinada com medição de entrada elétrica da estação.',
    },
    dataEntrega: 'Outubro / 2024 (Comissionado)',
    potenciaOuCapacidadeCurta: '2x DC 60 kW + 4x AC 22 kW',
    fotoDescricao:
      'Estação de recarga rápida coberta com furgões elétricos conectados aos conectores CCS2.',
    fotoPlaceholderNota: 'Hub DC Fast Charger',
    tags: ['Frotas', 'DC Fast Charger', 'Logística Limpa', 'Subestação Dedicada'],
  },
  {
    id: 'case-hospital-continuidade',
    slug: 'complexo-hospitalar-bess-continuidade',
    titulo: 'Complexo Médico Hospitalar & Diagnóstico',
    cliente: 'Hospital Regional e Centro de Diagnóstico (Autorizado)',
    segmento: 'Comércio e Serviços',
    solucao: 'BESS (Armazenamento)',
    local: 'Norte Gaúcho / RS',
    desafioInicial:
      'Equipamentos de ressonância magnética e tomografia não toleram microinterrupções nem ruídos harmônicos da rede elétrica, que queimavam placas caras e causavam perda de exames no meio do procedimento.',
    escopo: 'BESS C&I 120 kWh de onda senoidal pura + Filtragem ativa de harmônicos',
    solucaoTecnica:
      'Engenharia de integração com inversor de comutação estática e banco LiFePO4 para atuação como no-break dinâmico institucional, com despacho também durante as 3 horas do horário de ponta.',
    resultadoMedido: {
      destaqueValor: 'Zero Falhas',
      destaqueLabel: 'Em exames críticos por qualidade de energia',
      descricao:
        'Eliminação de 100% dos travamentos de equipamentos de imagem e redução de custo tarifário das 18h às 21h.',
      periodoMedicao: 'Acompanhamento de 10 meses pelo setor de engenharia clínica',
      metodoMedicao:
        'Relatórios de eventos do BESS cruzados com os logs do setor de diagnóstico por imagem.',
    },
    dataEntrega: 'Setembro / 2024 (Homologado e operando)',
    potenciaOuCapacidadeCurta: '120 kWh BESS Hospitalar',
    fotoDescricao:
      'Sala técnica abrigada com gabinetes de baterias de alta densidade e quadro de bypass estático.',
    fotoPlaceholderNota: 'BESS Hospitalar Contínuo',
    tags: ['Hospitalar', 'No-Break Dinâmico', 'Energia Crítica', 'Harmônicos'],
  },
  {
    id: 'case-usina-solo-pendente',
    slug: 'complexo-solar-agroindustrial-usina-solo',
    titulo: 'Complexo Solar Agroindustrial em Solo',
    cliente: 'Cooperativa Agroindustrial Regional (Divulgação preliminar autorizada)',
    segmento: 'Investidores e Usinas',
    solucao: 'Energia Solar (EPC)',
    local: 'Região Noroeste / RS',
    desafioInicial:
      'Demanda contínua para abastecer silos de grãos e fábricas de ração com alta sazonalidade na safra.',
    escopo: '1,2 MWp Usina de Solo Monoposte com Conexão em Média Tensão 13,8 kV',
    solucaoTecnica:
      'Engenharia completa de solo (projeto e instalação): 2.100 módulos monocristalinos 580W, subestação de 1.500 kVA e seccionamento telecomandado.',
    resultadoMedido: {
      destaqueValor: 'A confirmar',
      destaqueLabel: 'Auditoria oficial do primeiro ciclo anual',
      descricao:
        'Geração estimada de ~1.750.000 kWh/ano (dados oficiais em processo de consolidação e auditoria de 12 meses).',
      periodoMedicao: 'Comissionamento recente (ciclo inicial de 12 meses)',
      metodoMedicao:
        'Metodologia oficial Delfos: telemetria em tempo real com calibração por estação solarimétrica in loco.',
      dadoPendente: true,
      notaAuditoria:
        'Métrica oficial em consolidação — primeiro ciclo de 12 meses de faturamento para conferência formal.',
    },
    dataEntrega: 'Dezembro / 2024 (Recentemente energizada)',
    potenciaOuCapacidadeCurta: '1,2 MWp Solo',
    fotoDescricao:
      'Vista aérea em alta definição do complexo fotovoltaico em solo com subestação blindada.',
    fotoPlaceholderNota: 'Complexo Agroindustrial 1,2 MWp',
    tags: ['Agroindústria', '1,2 MWp', 'Média Tensão', 'Métrica a Confirmar'],
  },
  // =========================================================================
  // NOVOS CASES POR SEGMENTO (GARANTINDO META MÍNIMA DE 3 CASES POR SEGMENTO)
  // Casos ilustrativos rotulados com transparência como "Exemplo de aplicação"
  // =========================================================================
  {
    id: 'exemplo-condominio-rateio-solar-65-kwp',
    slug: 'exemplo-condominio-rateio-solar-65-kwp',
    titulo: 'Condomínio Residencial Horizontal — 65 kWp (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Condomínio Horizontal)',
    segmento: 'Condomínios',
    solucao: 'Energia Solar (EPC)',
    local: 'Região Norte / RS',
    desafioInicial:
      'Custos elevados com iluminação perimetral de vias internas, portaria blindada, bombas de piscinas coletivas e sede social, pressionando a cota mensal dos condôminos.',
    escopo: '65,0 kWp Usina Solar Condominial com Rateio de Autoconsumo Remoto',
    solucaoTecnica:
      'Projeto em cobertura de salão de festas e garagens de apoio com inversores de alta eficiência, quadro de medição bidirecional e modelagem de rateio entre a conta comum e áreas recreativas.',
    resultadoMedido: {
      destaqueValor: 'R$ 7.200/mês',
      destaqueLabel: 'Economia média estimada nas áreas comuns',
      descricao:
        'Alívio estimado de R$ 7.200,00 mensais no caixa do condomínio, evitando reajustes de taxa condominial e financiando melhorias de segurança.',
      periodoMedicao: 'Simulação técnica normalizada em ciclo anual',
      metodoMedicao: 'Modelagem solarimétrica PVSyst com irradiação solar do Norte do RS',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '65,0 kWp',
    fotoDescricao: 'Exemplo de cobertura fotovoltaica em condomínio horizontal residencial.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=modern%20condo%20solar%20rooftop&color=blue',
    tags: ['Condomínios', 'Exemplo de aplicação', '65 kWp', 'Autoconsumo Remoto', 'Rateio'],
  },
  {
    id: 'exemplo-condominio-comercial-bess-portaria-40-kwh',
    slug: 'exemplo-condominio-comercial-bess-portaria-40-kwh',
    titulo: 'Condomínio Corporativo & Salas Médicas — BESS 40 kWh (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Edifício Comercial)',
    segmento: 'Condomínios',
    solucao: 'BESS (Armazenamento)',
    local: 'Erechim / RS',
    desafioInicial:
      'Oscilações e quedas momentâneas de rede deixavam elevadores travados entre andares e desativavam catracas eletrônicas e portaria digital em horário de alto fluxo comercial.',
    escopo: 'BESS 40 kWh / 30 kW com Comutação Ininterrupta (< 20ms) para Cargas Essenciais',
    solucaoTecnica:
      'Banco de baterias de Lítio Ferro Fosfato (LiFePO4) integrado ao quadro de emergência do edifício, mantendo elevadores de serviço, controle de acesso, bombas de pressurização e iluminação de rotas de fuga.',
    resultadoMedido: {
      destaqueValor: '< 20ms',
      destaqueLabel: 'Tempo de reversão em apagões da concessionária',
      descricao:
        'Continuidade 100% autônoma para elevadores e portaria eletrônica por até 3 horas de blecaute sem fumaça ou ruído de geradores a diesel.',
      periodoMedicao: 'Especificação técnica do sistema de gestão inteligente EMS',
      metodoMedicao: 'Simulação de contingência predial e telemetria de quadro elétrico',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '40 kWh BESS',
    fotoDescricao:
      'Banco de baterias LiFePO4 para contingência e segurança em edifício corporativo.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl:
      'https://img.usecurling.com/p/1600/1000?q=commercial%20building%20battery%20room&color=blue',
    tags: ['Condomínios', 'Exemplo de aplicação', 'BESS LiFePO4', 'Zero Blecaute', 'Elevadores'],
  },
  {
    id: 'exemplo-residencia-solar-bess-hibrido-10-kwp',
    slug: 'exemplo-residencia-solar-bess-hibrido-10-kwp',
    titulo: 'Residência com Sistema Solar Híbrido & BESS — 10 kWp + 15 kWh (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Residência Unifamiliar)',
    segmento: 'Residências',
    solucao: 'BESS (Armazenamento)',
    local: 'Erechim / RS',
    desafioInicial:
      'Família com rotina de home office integral e histórico de quedas de luz frequentes após temporais de verão, paralisando computadores, geladeira e climatização.',
    escopo: '10 kWp Solar Fotovoltaico + Sistema de Baterias BESS Residencial 15 kWh',
    solucaoTecnica:
      'Arranjo solar em telhado cerâmico com inversor híbrido inteligente e bateria modular de lítio de baixa tensão, programada para reserva de emergência e autoconsumo noturno.',
    resultadoMedido: {
      destaqueValor: 'Até 92%',
      destaqueLabel: 'Economia na fatura + backup ininterrupto',
      descricao:
        'Redução da fatura mensal para taxa de disponibilidade e até 18 horas de autonomia em eletrodomésticos essenciais e internet durante apagões da rede externa.',
      periodoMedicao: 'Simulação operacional residencial',
      metodoMedicao: 'Perfil de carga residencial com curva típica de 600 kWh/mês',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '10 kWp + 15 kWh',
    fotoDescricao:
      'Residência contemporânea com telhado solar e gabinete discreto de baterias de lítio.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=modern%20house%20solar%20battery&color=blue',
    tags: ['Residencial', 'Exemplo de aplicação', 'Inversor Híbrido', 'BESS 15 kWh', 'Zero Apagão'],
  },
  {
    id: 'exemplo-residencia-carregador-solar-8-kwp',
    slug: 'exemplo-residencia-carregador-solar-8-kwp',
    titulo: 'Residência com Energia Solar & Carregador Wallbox — 8,2 kWp (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Garagem Residencial Solar)',
    segmento: 'Residências',
    solucao: 'Carregadores Veiculares',
    local: 'Alto Uruguai / RS',
    desafioInicial:
      'Aquisição de veículo 100% elétrico com consumo elevado na recarga noturna, sobrecarregando a fatura e exigindo segurança na instalação elétrica da garagem.',
    escopo: '8,2 kWp Gerador Solar Fotovoltaico + Wallbox Inteligente 7,4 kW AC',
    solucaoTecnica:
      'Instalação solar dimensionada para absorver os quilômetros rodados do veículo elétrico, quadro de proteção dedicado NBR 5410 com DR Tipo B e estação de recarga com comunicação Wi-Fi.',
    resultadoMedido: {
      destaqueValor: 'R$ 0,00/km',
      destaqueLabel: 'Custo marginal de combustível solar',
      descricao:
        'Abastecimento 100% limpo gerado no próprio telhado residencial, substituindo gastos mensais de mais de R$ 900 em gasolina por eletricidade solar própria.',
      periodoMedicao: 'Estimativa de rodagem de 1.500 km/mês',
      metodoMedicao: 'Balanço energético de geração solar vs. consumo veicular de 16 kWh/100 km',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '8,2 kWp + Wallbox',
    fotoDescricao:
      'Garagem residencial com estação Wallbox conectada a veículo elétrico e telhado solar.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=home%20ev%20charger%20solar&color=blue',
    tags: [
      'Residencial',
      'Exemplo de aplicação',
      'Wallbox 7.4 kW',
      'Eletromobilidade',
      'Combustível Solar',
    ],
  },
  {
    id: 'exemplo-usina-solo-gd-investidor-500-kwp',
    slug: 'exemplo-usina-solo-gd-investidor-500-kwp',
    titulo: 'Usina de Solo para Geração Distribuída — 500 kWp (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Investidor GD / Lei 14.300)',
    segmento: 'Investidores e Usinas',
    solucao: 'Energia Solar (EPC)',
    local: 'Região Norte / RS',
    desafioInicial:
      'Investidor pessoa física buscando diversificação de carteira imobiliária com renda passiva previsível através da locação de cotas de usina solar sob o marco legal da Lei 14.300/2022.',
    escopo: '500 kWp Usina Fotovoltaica de Solo em Terreno Rápido + Subestação 500 kVA',
    solucaoTecnica:
      'Engenharia completa: terraplanagem, estruturas monoposte de alta durabilidade, módulos bifaciais de alta potência, cabeamento em média tensão e telemetria solarimétrica calibrada.',
    resultadoMedido: {
      destaqueValor: 'TIR ~22,5% a.a.',
      destaqueLabel: 'Taxa Interna de Retorno estimada em modelo GD',
      descricao:
        'Geração estimada de ~720.000 kWh/ano voltada à locação para estabelecimentos comerciais do Grupo B, garantindo fluxo mensal previsível de aluguel de créditos energéticos.',
      periodoMedicao: 'Modelagem financeira de fluxo de caixa descontado (25 anos)',
      metodoMedicao:
        'Estudo solarimétrico PVSyst com banco solarimétrico INMET e tarifa de compensação',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '500 kWp Solo',
    fotoDescricao:
      'Usina fotovoltaica de solo de médio porte com fileiras de módulos bifaciais em terreno rural.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=solar%20farm%20green%20field&color=blue',
    tags: ['Investidores', 'Exemplo de aplicação', '500 kWp Solo', 'Lei 14.300', 'TIR ~22%'],
  },
  {
    id: 'exemplo-usina-recuperacao-om-termografia-250-kwp',
    slug: 'exemplo-usina-recuperacao-om-termografia-250-kwp',
    titulo: 'Auditoria O&M & Recomissionamento de Usina — 250 kWp (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Investidor / Ativo em Operação)',
    segmento: 'Investidores e Usinas',
    solucao: 'O&M e Monitoramento',
    local: 'Norte Gaúcho / RS',
    desafioInicial:
      'Usina de solo com queda crônica de faturamento e geração 18% abaixo do projetado, sem suporte do instalador original e com falhas de comunicação nos inversores.',
    escopo: 'Auditoria Elétrica Completa + Termografia Aérea por Drone + Reconfiguração de Strings',
    solucaoTecnica:
      'Voo com câmera termográfica radiométrica identificando pontos quentes em células, substituição de conectores oxidados, lavagem robotizada e repavimentação de canaletas de drenagem.',
    resultadoMedido: {
      destaqueValor: '+19,2%',
      destaqueLabel: 'Ganho comprovado de geração pós-intervenção',
      descricao:
        'Recuperação do Performance Ratio da usina de 69% para 83%, gerando retorno imediato do investimento na manutenção corretiva em menos de 4 meses.',
      periodoMedicao: 'Comparativo de desempenho antes vs. pós-comissionamento de O&M',
      metodoMedicao: 'Telemetria normalizada por piranômetro e dados do inversor central',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '250 kWp O&M',
    fotoDescricao:
      'Drone termográfico sobrevoando arranjo solar em solo com inspeção técnica de módulos.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl: 'https://img.usecurling.com/p/1600/1000?q=solar%20drone%20inspection&color=blue',
    tags: [
      'Investidores',
      'Exemplo de aplicação',
      'O&M Usinas',
      'Termografia Drone',
      'Recuperação +19%',
    ],
  },
  {
    id: 'exemplo-frota-entrega-urbana-carregadores-ac-dc',
    slug: 'exemplo-frota-entrega-urbana-carregadores-ac-dc',
    titulo: 'Hub de Recarga para Frota de Distribuição — 12 Vagas (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Transportadora / Entrega Urbana)',
    segmento: 'Frotas e Eletropostos',
    solucao: 'Carregadores Veiculares',
    local: 'Polo Logístico RS',
    desafioInicial:
      'Empresa de logística urbana convertendo frota de furgões para veículos elétricos sem capacidade de alimentar 12 veículos simultâneos na entrada de energia existente.',
    escopo:
      '1 Carregador Rápido DC 60 kW + 8 Wallboxes Inteligentes 11 kW AC + Gestão Dinâmica DLM',
    solucaoTecnica:
      'Infraestrutura em eletrocalha blindada com balanceamento dinâmico de carga entre os veículos, priorizando recargas rápidas para rotas de emergência e recargas lentas noturnas.',
    resultadoMedido: {
      destaqueValor: '68% menor',
      destaqueLabel: 'Custo de abastecimento vs. diesel equivalente',
      descricao:
        'Redução drástica do custo operacional por quilômetro rodado e zero sobrecarga no transformador da garagem durante o horário de pico.',
      periodoMedicao: 'Simulação operacional para 12 veículos rodando 140 km/dia',
      metodoMedicao: 'Telemetria de entrada de energia combinada com odômetro de frota',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '1x DC 60 kW + 8x AC 11 kW',
    fotoDescricao:
      'Garagem de transportadora com estações de recarga elétrica e furgões conectados.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl:
      'https://img.usecurling.com/p/1600/1000?q=commercial%20fleet%20electric%20van%20charging&color=blue',
    tags: [
      'Frotas e Eletropostos',
      'Exemplo de aplicação',
      'DC Fast Charger',
      'Gestão DLM',
      'Logística',
    ],
  },
  {
    id: 'exemplo-eletroposto-rodoviario-solar-fast-charge-120-kw',
    slug: 'exemplo-eletroposto-rodoviario-solar-fast-charge-120-kw',
    titulo: 'Eletroposto Comercial em Rodovia — 120 kW DC + Solar Carport (Exemplo de aplicação)',
    cliente: 'Exemplo de aplicação ilustrativo (Posto de Serviços Rodoviário)',
    segmento: 'Frotas e Eletropostos',
    solucao: 'Carregadores Veiculares',
    local: 'Corredor Rodoviário Norte / RS',
    desafioInicial:
      'Posto de combustíveis rodoviário necessitando atrair motoristas de veículos elétricos e híbridos em viagem, oferecendo recarga ultrarrápida de 20 a 30 minutos integrada a conveniência.',
    escopo:
      'Estação DC Fast Charger 120 kW (2 conectores CCS2) + Carport Solar 45 kWp para Cobertura',
    solucaoTecnica:
      'Subestação rebaixadora dedicada, totem de recarga rápida com pagamento via app e cartão por aproximação, protegido por cobertura com 110 módulos solares fotovoltaicos.',
    resultadoMedido: {
      destaqueValor: '25 min',
      destaqueLabel: 'Tempo médio para 80% de carga da bateria',
      descricao:
        'Atendimento de alta rotatividade com geração solar própria suprindo mais de 35% do consumo da estação e aumento de consumo na loja de conveniência.',
      periodoMedicao: 'Projeção de fluxo de tráfego rodoviário regional',
      metodoMedicao:
        'Capacidade nominal do carregador DC 120 kW cruzada com curva de carga veicular',
    },
    dataEntrega: 'Engenharia de Aplicação Delfos',
    destaque: false,
    isExample: true,
    potenciaOuCapacidadeCurta: '120 kW DC + 45 kWp Solar',
    fotoDescricao:
      'Eletroposto rodoviário com estação rápida DC e cobertura em estrutura de carport solar.',
    fotoPlaceholderNota: 'Exemplo de aplicação ilustrativo',
    fotoUrl:
      'https://img.usecurling.com/p/1600/1000?q=highway%20ev%20fast%20charging%20station&color=blue',
    tags: [
      'Frotas e Eletropostos',
      'Exemplo de aplicação',
      '120 kW DC',
      'Carport Solar',
      'Eletroposto',
    ],
  },
]
