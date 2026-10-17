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
  fotoDescricao: string // Descrição do placeholder técnico
  fotoPlaceholderNota: string // "Foto real — aguardando" ou nota de autorização
  fotoUrl?: string
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
    id: 'case-indra',
    slug: 'indra-sistemas-engenharia-erechim',
    titulo: 'Indra Sistemas e Engenharia',
    cliente: 'Indra Sistemas e Engenharia Ltda.',
    segmento: 'Comércio e Serviços',
    solucao: 'Energia Solar (EPC)',
    local: 'Erechim / RS (Autorizado para divulgação)',
    desafioInicial:
      'Alto consumo energético contínuo com computadores, estações de trabalho de engenharia e climatização de precisão. O cliente enfrentava volatilidade tarifária de bandeiras e risco orçamentário para expansão fabril.',
    escopo: '9,75 kWp Projeto e Instalação Solar em telhado metálico',
    solucaoTecnica:
      'Modelagem 3D de sombreamento, dimensionamento de inversores de alta frequência com tecnologia MPPT dupla, fixadores estruturais certificados em alumínio anodizado e homologação expressa junto à concessionária RGE sem parada nas operações.',
    resultadoMedido: {
      destaqueValor: '91%',
      destaqueLabel: 'Economia na fatura de energia',
      descricao: 'Redução média de 91% na fatura mensal de energia elétrica',
      periodoMedicao: '12 meses consecutivos de faturamento pós-homologação',
      metodoMedicao:
        'Telemetria em tempo real com inversor conectado + conferência auditada das faturas mensais emitidas pela concessionária local (RGE). Payback medido de ~3,2 anos.',
    },
    dataEntrega: 'Novembro / 2023 (Operação ativa e homologada RGE)',
    destaque: true,
    potenciaOuCapacidadeCurta: '9,75 kWp',
    fotoDescricao:
      'Registro aéreo de drone da cobertura metálica com arranjo fotovoltaico e quadro CA/CC com proteção contra surtos DPS.',
    fotoPlaceholderNota: 'Foto real — aguardando',
    tags: ['Comercial', 'Telhado Metálico', 'Homologado RGE', 'Economia 91%'],
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
    fotoPlaceholderNota: 'Foto real — aguardando',
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
      periodoMedicao: 'Comissionamento recente (aguardando ciclo de 12 meses)',
      metodoMedicao:
        'Metodologia oficial Delfos: telemetria em tempo real com calibração por estação solarimétrica in loco.',
      dadoPendente: true,
      notaAuditoria:
        'Métrica oficial a confirmar — aguardando encerramento do primeiro ciclo de 12 meses de faturamento para auditoria e conferência formal.',
    },
    dataEntrega: 'Dezembro / 2024 (Recentemente energizada)',
    potenciaOuCapacidadeCurta: '1,2 MWp Solo',
    fotoDescricao:
      'Vista aérea em alta definição do complexo fotovoltaico em solo com subestação blindada.',
    fotoPlaceholderNota: 'Foto real — aguardando autorização e medição oficial',
    tags: ['Agroindústria', '1,2 MWp', 'Média Tensão', 'Métrica a Confirmar'],
  },
]
