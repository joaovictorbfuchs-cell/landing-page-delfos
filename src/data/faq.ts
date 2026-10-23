export interface FaqItemData {
  id: string
  numero: string
  tituloNav: string
  pergunta: string
  respostaRapida: string
  detalheTecnico: string
  ctaTexto?: string
  ctaHref?: string
  ctaLabelExterno?: string
}

export const FAQ_ITEMS: FaqItemData[] = [
  {
    id: 'pergunta-1',
    numero: '01',
    tituloNav: 'Quanto custa instalar?',
    pergunta: 'Quanto custa instalar energia solar?',
    respostaRapida:
      'Não existe um preço único: o investimento depende do porte do sistema, dos equipamentos escolhidos e das condições do imóvel. Cada projeto parte do seu consumo e da avaliação técnica do local. Por isso, o caminho confiável é um estudo de viabilidade personalizado — é ele que entrega o valor exato do seu sistema.',
    detalheTecnico:
      'Uma proposta séria separa três blocos de custo: equipamentos (módulos, inversor, estrutura e cabeamento), instalação (mão de obra, projetos e homologação junto à distribuidora) e custos recorrentes (manutenção e taxa mínima). Variáveis que movem o preço: potência a instalar, tipo de telhado ou solo, distância até o quadro elétrico, padrão de entrada e nível de tensão. Desconfie de orçamentos genéricos por quilowatt: comparar propostas com premissas diferentes leva a decisões erradas. O dimensionamento correto evita os dois erros clássicos — sistema subdimensionado (economia abaixo do potencial) e superdimensionado (capital parado).',
    ctaTexto: 'Solicitar estudo de viabilidade',
    ctaHref: '/#contato',
    ctaLabelExterno: 'Formulário de Contato',
  },
  {
    id: 'pergunta-2',
    numero: '02',
    tituloNav: 'Vale a pena e payback',
    pergunta: 'Energia solar vale a pena? Em quanto tempo o investimento se paga?',
    respostaRapida:
      'Na grande maioria dos casos, sim. Um sistema bem dimensionado reduz de 85% a 95% da despesa com energia e se paga, tipicamente, em 2 a 5 anos — com vida útil superior a 25 anos. O payback exato depende do seu consumo, tarifa, irradiação da região e das regras de compensação vigentes.',
    detalheTecnico:
      'O cálculo é simples na lógica e rigoroso na execução: payback = investimento ÷ economia mensal líquida. As premissas devem considerar o histórico de 12 meses de consumo, a tarifa vigente com projeção de reajuste, a irradiação local e o custo de operação. Dois fatores aceleram o retorno: o reajuste anual da tarifa de energia, que historicamente supera a inflação em boa parte do Brasil, e o financiamento com parcela inferior à economia gerada. Exija sempre as premissas da simulação por escrito — é o que separa uma proposta séria de uma estimativa genérica.',
    ctaTexto: 'Quero uma simulação personalizada',
    ctaHref: '/energia-solar#simulador',
    ctaLabelExterno: 'Página de Energia Solar',
  },
  {
    id: 'pergunta-3',
    numero: '03',
    tituloNav: 'Quantidade de placas',
    pergunta: 'Quantas placas solares preciso para minha casa ou empresa?',
    respostaRapida:
      'Depende do seu consumo mensal em kWh, da potência dos módulos e da irradiação do local. Como referência, uma residência que consome 500 kWh/mês normalmente precisa de 8 a 12 módulos. O número exato só fecha com o histórico de consumo da fatura em mãos.',
    detalheTecnico:
      'A fórmula de base: consumo médio mensal dividido pela geração esperada por módulo. Na prática, um módulo de 550 Wp em região com boa irradiância gera em torno de 2,5 a 3 kWh por dia. Também entram na conta: área útil disponível, sombreamento, orientação e inclinação do telhado, nível de tensão da rede e consumo futuro projetado (ar-condicionado, carro elétrico). O Sistema de Compensação da ANEEL permite ajuste fino — pequenos excedentes viram créditos que abatem consumos futuros.',
    ctaTexto: 'Calcular quantidade no simulador',
    ctaHref: '/energia-solar#simulador',
  },
  {
    id: 'pergunta-4',
    numero: '04',
    tituloNav: 'Zera a conta de luz?',
    pergunta: 'Energia solar zera a conta de luz? Como funcionam os créditos?',
    respostaRapida:
      'Quase. O sistema injeta o excedente na rede e recebe créditos de energia (em kWh) que abatem o consumo dos meses seguintes. Mas algumas cobranças permanecem: o custo de disponibilidade residencial (equivalente a 30, 50 ou 100 kWh conforme o padrão de entrada) ou a demanda contratada, no caso de empresas. Os créditos têm validade de 60 meses.',
    detalheTecnico:
      'O mecanismo é o Sistema de Compensação de Energia Elétrica (SCEE), regulado pela ANEEL. Três pontos que todo decisor precisa conhecer: (1) a Lei 14.300/2022 instituiu cobrança progressiva sobre o uso da rede (Fio B) para novos sistemas — começa em 15% e chega a 90% a partir de 2029, o que reforça a vantagem de quem instala antes; (2) o crédito é contábil, não físico: a energia gerada de dia abate o consumo à noite por meio da distribuidora; (3) a economia real média fica em 90% ou mais da conta — nunca 100%, pois permanecem as cobranças mínimas regulatórias.',
    ctaTexto: 'Simular minha economia real',
    ctaHref: '/#contato',
  },
  {
    id: 'pergunta-5',
    numero: '05',
    tituloNav: 'Noite e dias nublados',
    pergunta: 'Energia solar funciona à noite ou em dias nublados?',
    respostaRapida:
      'Em dias nublados, sim — a geração cai, mas não para (em geral entre 10% e 25% da capacidade). À noite não há geração: o imóvel é abastecido pela rede, abatendo os créditos acumulados — ou por baterias de energia, se o projeto incluir armazenamento.',
    detalheTecnico:
      'Os módulos respondem à luz (irradiância), não ao calor — por isso geram até em dias frios e nublados. O sistema é dimensionado pela média anual de irradiação da região, o que já contempla dias ruins e variações sazonais. À noite existem três caminhos: (1) compensação de créditos via rede, o mais comum e sem custo adicional; (2) baterias de energia (armazenamento), que guardam o excedente do dia para uso noturno; (3) a combinação dos dois, indicada para imóveis com cargas críticas ou regiões com apagões frequentes.',
    ctaTexto: 'Conhecer baterias de energia',
    ctaHref: '/baterias',
  },
  {
    id: 'pergunta-6',
    numero: '06',
    tituloNav: 'Sistema no apagão',
    pergunta: 'O que acontece com meu sistema solar durante um apagão?',
    respostaRapida:
      'Sem baterias, o sistema desliga automaticamente durante a falta de energia. Isso é uma proteção de segurança chamada anti-ilhamento, que impede o sistema de energizar a rede onde equipes de manutenção podem estar trabalhando. Para ter energia contínua durante apagões, o caminho é um sistema de backup com baterias de energia.',
    detalheTecnico:
      'Todo inversor conectado à rede cumpre a norma de anti-ilhamento: ao detectar a perda da rede elétrica, desliga em segundos. A solução é o conjunto inversor híbrido + baterias de energia (armazenamento elétrico), que em modo backup isola os circuitos prioritários e retoma o fornecimento em poucos segundos — luzes, refrigeradores, bombas d’água, internet e portões. O dimensionamento do backup parte de duas perguntas: o que precisa continuar funcionando (cargas críticas em kW) e por quanto tempo (autonomia em kWh). É a lógica de uma segurança energética contínua com autonomia prolongada integrada ao gerador solar.',
    ctaTexto: 'Dimensionar backup para meu imóvel',
    ctaHref: '/baterias',
  },
  {
    id: 'pergunta-7',
    numero: '07',
    tituloNav: 'Baterias de energia',
    pergunta: 'Como funciona o armazenamento em baterias de energia?',
    respostaRapida:
      'O sistema de armazenamento guarda energia em baterias recarregáveis para uso posterior. Suas principais aplicações: proteção e backup contra apagões da rede, aproveitamento noturno da própria geração solar, deslocamento de consumo para horários de tarifa mais cara e redução de picos de demanda.',
    detalheTecnico:
      'O conjunto reúne módulos de bateria (predominantemente química LFP — fosfato de ferro-lítio, pela elevada estabilidade e longa durabilidade), sistema eletrônico de gerenciamento (BMS), inversor híbrido inteligente e monitoramento em tempo real. Dois números definem o projeto: potência (kW — volume de cargas que atende simultaneamente) e capacidade (kWh — horas de autonomia). A química LFP suporta milhares de ciclos de carga e descarga com taxa de degradação controlada. Onde essa tecnologia entrega máximo retorno: operações que não podem parar, locais sujeitos a interrupções de fornecimento e tarifas com horário de ponta elevado.',
    ctaTexto: 'Avaliar baterias para meu perfil',
    ctaHref: '/baterias',
  },
  {
    id: 'pergunta-8',
    numero: '08',
    tituloNav: 'Recarga de carro elétrico',
    pergunta: 'Quanto tempo demora para carregar um carro elétrico e quanto custa?',
    respostaRapida:
      'Em um carregador residencial dedicado (wallbox de 7,4 kW), a recarga completa habitual leva de 4 a 8 horas — a rotina mais prática é conectar à noite. Em estações rápidas em corrente contínua, o mesmo veículo recarrega em 15 a 45 minutos. Rodar no modo elétrico custa, em regra, de 4 a 6 vezes menos por quilômetro do que com combustível fóssil.',
    detalheTecnico:
      'O tempo decorre da razão entre a energia a repor e a potência entregue pelo carregador: uma bateria de 60 kWh variando de 20% a 100% demanda 48 kWh, o que leva cerca de 6,5 horas em estação de 7,4 kW. Em termos econômicos, um veículo elétrico de passeio consome cerca de 0,15 kWh por quilômetro; na tarifa média, isso representa aproximadamente R$ 0,12 por km — contra cerca de R$ 0,60 por km em motor a combustão. Com geração solar própria, esse custo pode se aproximar de zero. A infraestrutura exige verificação de entrada de energia, circuito exclusivo, dispositivos de proteção (DR e DPS) e aterramento rigoroso.',
    ctaTexto: 'Avaliar infraestrutura para recarga',
    ctaHref: '/recarga',
  },
  {
    id: 'pergunta-9',
    numero: '09',
    tituloNav: 'Solar + Carro elétrico',
    pergunta: 'Posso carregar meu carro elétrico com energia solar?',
    respostaRapida:
      'Sim — e é uma das combinações mais inteligentes do ecossistema elétrico. A geração solar do imóvel abastece o veículo diretamente no período diurno, ou via compensação de créditos à noite. Com baterias de energia, o carro roda com o próprio sol acumulado, de madrugada, a custo operacional mínimo.',
    detalheTecnico:
      'Existem três arranjos práticos: (1) recarga diurna direta, aproveitando a curva solar instantânea; (2) compensação da distribuidora — o carro recarrega à noite na tomada dedicada e os créditos fotovoltaicos gerados de dia abatem essa energia na fatura; (3) armazenamento em baterias — acumula o excedente solar para transferir ao veículo sem depender da rede. Controladores inteligentes modulam a potência do carregador conforme a produção solar e o limite do quadro elétrico. No dimensionamento, o veículo é adicionado como nova carga de consumo: cerca de 150 kWh/mês para quem roda 1.000 km/mês, o que equivale a incluir de 2 a 3 módulos solares adicionais.',
    ctaTexto: 'Projetar solar e recarga integrados',
    ctaHref: '/recarga',
  },
  {
    id: 'pergunta-10',
    numero: '10',
    tituloNav: 'Limpeza e manutenção',
    pergunta: 'Com que frequência devo limpar os painéis e fazer manutenção da usina?',
    respostaRapida:
      'Limpeza: em geral 1 a 2 vezes por ano, a depender do ambiente (poeira, folhas, resíduos orgânicos, poluição). Manutenção preventiva completa: inspeção anual de conexões elétricas, inversor e estrutura mecânica. A regra de ouro é orientar as intervenções pela performance: geração em queda sem justificativa climática é sinal imediato de ação técnica.',
    detalheTecnico:
      'O acúmulo de sujidade pode reduzir o rendimento entre 5% e 15% em cenários mais severos — contudo, limpezas sem critério geram despesas desnecessárias. Um plano de operação e manutenção profissional abrange termografia infravermelha para identificar pontos quentes (hotspots) e microfissuras, reaperto com torquímetro calibrado, testes de isolamento e curvas de geração, verificação de dispositivos de manobra e proteções, além de atualização de firmware. O indicador-chave é a Taxa de Desempenho (Performance Ratio): instalações saudáveis operam acima de 75% a 80%. Acompanhar o inversor de perto é essencial para preservar a garantia e a segurança patrimonial.',
    ctaTexto: 'Solicitar diagnóstico da minha usina',
    ctaHref: '/manutencao',
  },
]
