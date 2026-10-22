export interface ArtigoBlog {
  slug: string
  titulo: string
  subtitulo: string
  resumo: string
  categoria:
    | 'Energia Solar'
    | 'Armazenamento BESS'
    | 'Operação & Manutenção'
    | 'Mobilidade Elétrica'
  tempoLeitura: string
  dataPublicacao: string
  autor: {
    nome: string
    cargo: string
  }
  palavraChavePrincipal: string
  palavrasChaveSecundarias: string[]
  metaDescription: string
  origemLead: string
  solucaoRelacionada: {
    nome: string
    url: string
    ctaTexto: string
    necessidadeForm: string
  }
  secoes: {
    tituloH2: string
    conteudo: string[]
    subsecoes?: {
      tituloH3: string
      conteudo: string[]
    }[]
  }[]
  conclusao: {
    texto: string
    destaque: string
  }
  faqs?: {
    pergunta: string
    resposta: string
  }[]
}

export const ARTIGOS_BLOG: ArtigoBlog[] = [
  {
    slug: 'energia-solar-erechim-guia-completo',
    titulo:
      'Energia Solar em Erechim e Alto Uruguai: Como Funciona, Viabilidade e Economia de até 90%',
    subtitulo:
      'Entenda os parâmetros de irradiação solar no norte do RS, regras da RGE e o retorno real do investimento fotovoltaico.',
    resumo:
      'Um panorama técnico e econômico detalhado sobre a instalação de usinas solares fotovoltaicas em Erechim/RS e região do Alto Uruguai. Análise tarifária da RGE, irradiação local e cálculo do payback real.',
    categoria: 'Energia Solar',
    tempoLeitura: '7 min de leitura',
    dataPublicacao: '15 de Outubro de 2026',
    autor: {
      nome: 'Eng. João Silveira',
      cargo: 'Engenheiro Eletricista • CREA-RS 214890',
    },
    palavraChavePrincipal: 'energia solar Erechim',
    palavrasChaveSecundarias: [
      'energia solar Alto Uruguai',
      'instalação fotovoltaica Erechim RS',
      'aprovação junto à concessionária RGE solar',
      'economia energia solar RS',
    ],
    metaDescription:
      'Guia completo de energia solar em Erechim/RS e Alto Uruguai. Entenda irradiação regional, aprovação junto à concessionária RGE, economia de até 90% e como dimensionar com a Delfos.',
    origemLead: 'blog-energia-solar-erechim',
    solucaoRelacionada: {
      nome: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
      url: '/solucoes/energia-solar',
      ctaTexto: 'Simular projeto fotovoltaico para Erechim e região',
      necessidadeForm: 'Energia Solar Fotovoltaica',
    },
    secoes: [
      {
        tituloH2: 'O Potencial Solar da Região de Erechim e Alto Uruguai Gaúcho',
        conteudo: [
          'A região norte do Rio Grande do Sul, com destaque para Erechim e os municípios vizinhos do Alto Uruguai, apresenta excelentes índices médios de irradiação solar global horizontal, variando entre 4,3 e 4,9 kWh/m² por dia ao longo do ano.',
          'Embora o inverno gaúcho registre maior frequência de frentes frias e nebulosidade temporária, a eficiência dos módulos fotovoltaicos de silício monocristalino de fabricantes de primeira linha compensa com folga esse período: temperaturas amenas aumentam o rendimento térmico das células solares, gerando picos de produção surpreendentes nos dias de sol pleno.',
          'Com mais de 12 anos de atuação em solo gaúcho e mais de 3.000 projetos entregues no Sul do Brasil, a Delfos Engenharia comprova em campo que a curva anual de geração distribui os excedentes de verão para cobrir a demanda de outono e inverno via sistema de compensação da concessionária.',
        ],
      },
      {
        tituloH2: 'Como a Tarifa da RGE Impacta a Decisão de Gerar a Própria Energia',
        conteudo: [
          'Em Erechim e na maior parte da região norte do estado, a distribuição de energia é atendida pela RGE (Grupo CPFL). As revisões tarifárias periódicas, somadas às bandeiras tarifárias e aos encargos setoriais, tornam o custo da energia comprada da rede uma das despesas mais pesadas para comércios, indústrias e residências.',
          'Ao instalar um sistema fotovoltaico conectado à rede (on-grid) ou com baterias (híbrido), a unidade consumidora passa a gerar sua própria eletricidade durante as horas de sol, reduzindo a conta de luz em até 90%. O valor remanescente corresponde apenas à taxa mínima de disponibilidade da rede e à contribuição de iluminação pública (CIP).',
        ],
        subsecoes: [
          {
            tituloH3: 'O Marco Legal da Geração Distribuída (Lei 14.300/2022)',
            conteudo: [
              'Projetos dimensionados por equipes com registro formal no CREA-RS aproveitam ao máximo a modulação de autoconsumo instantâneo, minimizando a incidência gradual da transição do Fio B e assegurando que o retorno financeiro (payback) se mantenha atrativo, em geral entre 3 e 5 anos conforme o perfil de consumo da unidade.',
            ],
          },
        ],
      },
      {
        tituloH2: 'O Que Diferencia uma Engenharia de Campo Especializada',
        conteudo: [
          'Muitas empresas comercializam kits solares pré-fabricados sem estudo estrutural minucioso. No Sul do Brasil, vendavais, granizo e variações severas de temperatura exigem estruturas reforçadas e projetos customizados.',
          'A Delfos Engenharia Solar realiza vistoria técnica presencial com engenheiros capacitados, avalia a integridade do telhado ou solo, elabora projeto unifilar com cálculo de perdas térmicas e caboado e submete toda a documentação de acesso à RGE com emissão formal de Anotação de Responsabilidade Técnica (ART/CREA-RS).',
        ],
      },
    ],
    conclusao: {
      texto:
        'Investir em energia solar em Erechim e no Alto Uruguai é uma decisão comprovada por mais de 3.000 famílias e empresas atendidas pela Delfos Solar ao longo de 12 anos.',
      destaque:
        'Economia imediata de até 90% na conta, blindagem contra reajustes da distribuidora e valorização patrimonial imediata.',
    },
    faqs: [
      {
        pergunta: 'A energia solar funciona em dias nublados ou chuvosos em Erechim?',
        resposta:
          'Sim. Os módulos fotovoltaicos geram energia através da radiação difusa da luz natural, mesmo com céu encoberto, mantendo a geração em níveis menores e compensando nos dias de alta insolação.',
      },
      {
        pergunta: 'Quanto tempo dura o processo de homologação junto à RGE?',
        resposta:
          'Desde a elaboração do projeto executivo até a troca do medidor pela concessionária (com inversor que carrega e descarrega as baterias quando há armazenamento), o prazo médio regulamentado pela Aneel varia de 30 a 60 dias, todo conduzido diretamente pela engenharia da Delfos.',
      },
    ],
  },
  {
    slug: 'bess-industrial-armazenamento-baterias-guia-viabilidade',
    titulo:
      'Sistema de Armazenamento com Baterias (BESS): Economia no Horário de Ponta, Backup e Redução da Cobrança de Demanda',
    subtitulo:
      'Como indústrias e grandes comércios do Sul utilizam baterias de lítio para bloqueio do horário de ponta, segurança energética contínua e redução da cobrança de demanda (peak shaving).',
    resumo:
      'Entenda como o armazenamento de energia em baterias (BESS para empresas e indústrias) protege linhas fabris contra paradas bruscas, elimina o custo exorbitante da energia no horário de ponta (carregando de madrugada ou de graça com solar durante o dia) e viabiliza a independência da rede elétrica.',
    categoria: 'Armazenamento BESS',
    tempoLeitura: '8 min de leitura',
    dataPublicacao: '18 de Outubro de 2026',
    autor: {
      nome: 'Eng. Mateus Becker',
      cargo: 'Engenheiro de Sistemas de Potência • Delfos Solar',
    },
    palavraChavePrincipal: 'BESS industrial',
    palavrasChaveSecundarias: [
      'armazenamento de energia industrial',
      'peak shaving baterias',
      'baterias de lítio para indústria',
      'backup ininterrupto fábrica RS',
    ],
    metaDescription:
      'Descubra como o sistema de armazenamento em baterias (BESS industrial) opera com economia no horário de ponta, backup imediato e redução da cobrança de demanda (peak shaving) em indústrias do RS.',
    origemLead: 'blog-bess',
    solucaoRelacionada: {
      nome: 'Sistema de armazenamento de energia (BESS)',
      url: '/solucoes/bess',
      ctaTexto: 'Pedir estudo de viabilidade para baterias e armazenamento (BESS)',
      necessidadeForm: 'BESS (Armazenamento)',
    },
    secoes: [
      {
        tituloH2: 'O Custo Real de uma Interrupção Elétrica na Indústria Gaúcha',
        conteudo: [
          'No polo metalmecânico, alimentício, frigorífico e plástico do Rio Grande do Sul e de Santa Catarina, um piscar de energia de apenas 200 milissegundos é suficiente para desarmar inversores de frequência, travar robôs de montagem, perder lotes de matéria-prima e paralisar compressores de câmaras frias.',
          'Os prejuízos decorrentes de paradas não planejadas ultrapassam rapidamente centenas de milhares de reais em horas ociosas e retrabalho de manutenção. Tradicionalmente, grupos geradores a diesel eram a única alternativa, mas apresentam tempo de acionamento (10 a 30 segundos com corte no fornecimento), alto custo de combustível fóssil e emissões de poluentes.',
          'É nesse cenário que os sistemas de armazenamento em baterias (BESS — Battery Energy Storage Systems) revolucionam a estabilidade elétrica do segmento de empresas e indústrias.',
        ],
      },
      {
        tituloH2: 'As Três Aplicações Centrais do Sistema de Baterias (BESS)',
        conteudo: [
          'Um sistema de armazenamento de energia em baterias (BESS) não é um simples "no-break de grande porte". Trata-se de uma central eletroquímica modular com inversor que carrega e descarrega as baterias inteligente e sistema inteligente de gestão (EMS).',
        ],
        subsecoes: [
          {
            tituloH3: '1. Economia e Bloqueio do Horário de Ponta (18h às 21h)',
            conteudo: [
              'Na estrutura tarifária horossazonal (tarifa verde ou azul), o kWh consumido no horário de ponta (geralmente entre 18h e 21h nos dias úteis) custa de 4 a 6 vezes mais do que fora de ponta. O sistema carrega de madrugada, quando a energia é barata, e usa de noite, quando fica caro. E se a empresa já tem energia solar, carrega as baterias de graça durante o dia, gerando economia expressiva sem pagar tarifas abusivas à concessionária.',
            ],
          },
          {
            tituloH3: '2. Backup Instantâneo de Resposta em Milissegundos',
            conteudo: [
              'Em caso de queda total da rede de distribuição, o sistema comuta em menos de 15 a 20 milissegundos para o modo ilha (off-grid grid-forming), garantindo que os quadros essenciais da indústria continuem energizados sem oscilação percebida pelas máquinas.',
            ],
          },
          {
            tituloH3: '3. Redução da Cobrança de Demanda na Fatura (Peak Shaving)',
            conteudo: [
              'Em fábricas com picos transitórios de partida de máquinas pesadas, as baterias descarregam potência de forma ultrarrápida, impedindo que a demanda medida ultrapasse a demanda contratada com a concessionária e eliminando multas severas de ultrapassagem na fatura (peak shaving).',
            ],
          },
        ],
      },
      {
        tituloH2: 'Arquitetura e Segurança de Células de Lítio LFP',
        conteudo: [
          'A Delfos Engenharia projeta soluções de baterias (BESS) empregando baterias de lítio de última geração (LiFePO4: fosfato de ferro e lítio), reconhecidas globalmente por sua estabilidade térmica extrema, resistência ao thermal runaway e ciclo de vida superior a 6.000 a 8.000 ciclos com garantia estendida.',
          'Os contêineres e gabinetes industriais contam com climatização de precisão (HVAC ou arrefecimento líquido), sistema automatizado de supressão de incêndio por gás limpo e monitoramento remoto contínuo célula a célula.',
        ],
      },
    ],
    conclusao: {
      texto:
        'O sistema de armazenamento de energia em baterias (BESS) transforma energia de custo variável e rede instável em um ativo confiável, programável e estratégico para o fluxo produtivo.',
      destaque:
        'Economia expressiva no horário de ponta, blindagem total contra blecautes, fim das multas de ultrapassagem de demanda (peak shaving) e substituição inteligente de diesel por energia limpa.',
    },
    faqs: [
      {
        pergunta:
          'É possível integrar o BESS a uma usina solar fotovoltaica já existente na fábrica?',
        resposta:
          'Sim. A Delfos realiza a integração tanto no lado CA (AC-coupled) quanto no barramento CC (DC-coupled), permitindo armazenar o excedente solar que antes seria injetado na rede com desconto regulatório.',
      },
      {
        pergunta: 'Qual o tempo de vida útil típico de um BESS com células LFP?',
        resposta:
          'Com dimensionamento adequado de profundidade de descarga (DoD de 80% a 90%) e gestão térmica controlada, a vida útil esperada varia entre 12 e 15 anos com retenção superior a 70% da capacidade original.',
      },
    ],
  },
  {
    slug: 'manutencao-usina-solar-om-monitoramento-dicas',
    titulo:
      'Manutenção de Usina Solar (O&M): Como Evitar a Perda Silenciosa de até 25% da Geração de Energia',
    subtitulo:
      'Limpeza técnica especializada, termografia com drone e inspeção elétrica preventiva com tempo de resposta rápido combinado no Sul.',
    resumo:
      'Poeira, dejetos de aves, conexões superaquecidas e microfissuras drenam o rendimento financeiro de usinas solares de solo e telhado. Descubra a metodologia de operação e manutenção (O&M) com tempo de resposta garantido da Delfos Engenharia.',
    categoria: 'Operação & Manutenção',
    tempoLeitura: '6 min de leitura',
    dataPublicacao: '20 de Outubro de 2026',
    autor: {
      nome: 'Eng. Rafael Fontana',
      cargo: 'Coordenador de O&M e Diagnóstico • Delfos Solar',
    },
    palavraChavePrincipal: 'manutenção de usina solar',
    palavrasChaveSecundarias: [
      'limpeza de placas solares RS',
      'termografia com drone usina solar',
      'O&M energia solar',
      'plano de manutenção usina fotovoltaica',
    ],
    metaDescription:
      'Descubra como a manutenção preventiva (O&M), limpeza técnica e termografia por drone evitam perdas de até 25% na geração de usinas solares no RS. Fale com a Delfos.',
    origemLead: 'blog-om',
    solucaoRelacionada: {
      nome: 'Manutenção O&M e Monitoramento',
      url: '/solucoes/om',
      ctaTexto: 'Solicitar diagnóstico técnico da usina solar',
      necessidadeForm: 'O&M e Monitoramento',
    },
    secoes: [
      {
        tituloH2:
          'A Perda Silenciosa: Por Que Usinas Solares Sem Manutenção Geram Menos do Que Deveriam',
        conteudo: [
          'Muitos proprietários e investidores acreditam erroneamente que um sistema fotovoltaico "não requer manutenção". Na prática de campo, o acúmulo de poeira agrícola, fuligem de estradas, folhas e fezes de pássaros cria uma película opaca sobre o vidro temperado dos módulos.',
          'Além disso, o estresse térmico diário causa afrouxamento gradual de bornes elétricos, oxidação de conectores MC4 e surgimento de pontos quentes (hotspots) que podem inutilizar substrings inteiras de módulos sem que o proprietário perceba na fatura mensal durante meses.',
          'Estudos técnicos de campo no Sul do Brasil apontam que uma usina sem manutenção periódica pode sofrer degradação silenciosa entre 10% e 25% da sua capacidade produtiva original.',
        ],
      },
      {
        tituloH2: 'A Estrutura de um Programa Profissional de O&M (Operação e Manutenção)',
        conteudo: [
          'Diferente de prestadores genéricos que apenas lavam placas com água de mangueira, a engenharia de O&M da Delfos opera com protocolos rigorosos de engenharia de campo.',
        ],
        subsecoes: [
          {
            tituloH3: 'Termografia Aérea por Drone de Alta Resolução',
            conteudo: [
              'Câmeras termográficas calibradas sobrevoam a usina e identificam em minutos diodos de bypass defeituosos, células trincadas e células em curto que dissipam calor prejudicial ao módulo, tudo georreferenciado em relatório técnico formal.',
            ],
          },
          {
            tituloH3: 'Limpeza Técnica com Água Desmineralizada e Equipamentos Adequados',
            conteudo: [
              'Uso de água tratada para evitar depósito de calcário e sabões alcalinos abrasivos, escovas rotativas de cerdas macias com pressão controlada para preservar o revestimento antirreflexo (ARC) dos vidros solares.',
            ],
          },
          {
            tituloH3: 'Inspeção Elétrica e Reaperto com Torquímetro Aferido',
            conteudo: [
              'Medição de resistência de isolamento (megômetro), curvas I-V de strings e reaperto com torquímetro de todas as conexões dos quadros de proteção (string boxes e inversores) para prevenção absoluta de riscos de arco elétrico e incêndio.',
            ],
          },
        ],
      },
      {
        tituloH2: 'Monitoramento Remoto em Tempo Real com Tempo de Resposta Combinado (SLA)',
        conteudo: [
          'A central de monitoramento remoto da Delfos rastreia inversores de clientes diariamente via algoritmos que comparam a geração horária contra a curva solarimétrica meteorológica da região de Erechim e do Sul.',
          'Quando um inversor desarma ou apresenta queda anômala de rendimento, o protocolo de resposta rápida é acionado imediatamente, deslocando equipes volantes de técnicos próprios credenciados no CREA para restabelecimento com rapidez, evitando semanas de geração desperdiçada.',
        ],
      },
    ],
    conclusao: {
      texto:
        'Manutenção de usina fotovoltaica não é despesa: é o investimento direto que protege o ROI contratado e garante 25 anos de performance máxima dos módulos.',
      destaque:
        'Recuperação média imediata de 8% a 20% no rendimento de geração após a primeira intervenção de O&M e limpeza técnica especializada.',
    },
    faqs: [
      {
        pergunta: 'Com que frequência uma usina solar deve ser limpa no Sul do Brasil?',
        resposta:
          'Recomenda-se de 2 a 4 intervenções anuais, a depender do nível de poeira (próximo a lavouras ou estradas de terra) e da estação de chuvas da região.',
      },
      {
        pergunta: 'A chuva normal não é suficiente para limpar os módulos fotovoltaicos?',
        resposta:
          'A chuva remove apenas partículas superficiais soltas. Resíduos aderentes, polens e fezes de aves criam uma camada gordurosa e ácida que só é removida com limpeza mecânica controlada.',
      },
    ],
  },
  {
    slug: 'carregador-veicular-condominio-dlm-instalacao-guia',
    titulo:
      'Carregador Veicular em Condomínios: Como Instalar com Gestão de Carga Inteligente e Rateio Individual Justo',
    subtitulo:
      'O guia prático para síndicos, conselhos e moradores sobre infraestrutura de recarga segura sem sobrecarregar o transformador.',
    resumo:
      'Passo a passo técnico e jurídico para viabilizar pontos de recarga para carros elétricos e híbridos em prédios residenciais e comerciais no RS, com medição individualizada e sem necessidade de aumentar a demanda do condomínio.',
    categoria: 'Mobilidade Elétrica',
    tempoLeitura: '7 min de leitura',
    dataPublicacao: '22 de Outubro de 2026',
    autor: {
      nome: 'Eng. Lucas Sartori',
      cargo: 'Especialista em Eletromobilidade • Delfos Solar',
    },
    palavraChavePrincipal: 'carregador veicular condomínio',
    palavrasChaveSecundarias: [
      'instalação wallbox condomínio RS',
      'gestão de carga inteligente condomínio',
      'ponto de recarga carro elétrico prédio',
      'medição individual recarga veicular',
    ],
    metaDescription:
      'Guia definitivo de carregador veicular em condomínios no RS: gestão de carga inteligente, medição individualizada e segurança sem aumentar demanda. Saiba mais.',
    origemLead: 'blog-carregadores-condominio',
    solucaoRelacionada: {
      nome: 'Carregadores Veiculares & Gestão de Carga Inteligente',
      url: '/solucoes/carregadores',
      ctaTexto: 'Solicitar vistoria técnica para condomínio',
      necessidadeForm: 'Carregadores Veiculares',
    },
    secoes: [
      {
        tituloH2:
          'O Grande Dilema dos Síndicos: Como Atender aos Carros Elétricos Sem Riscos Elétricos',
        conteudo: [
          'A frota de veículos elétricos (BEV) e híbridos plug-in (PHEV) cresce em ritmo acelerado em cidades como Porto Alegre, Caxias do Sul, Passo Fundo e Erechim. Naturalmente, moradores demandam pontos de recarga em suas vagas de garagem privativas.',
          'O problema surge quando múltiplos condôminos ligam carregadores wallbox potentes (de 7,4 kW a 22 kW cada) no mesmo horário — tipicamente entre 19h e 22h, quando o consumo do próprio prédio já atinge o pico com chuveiros, iluminação e elevadores.',
          'Ligar carregadores na tomada comum da garagem sem projeto elétrico dedicado provoca superaquecimento de condutores, desarme de disjuntores gerais, riscos reais de incêndio e conflitos intensos entre moradores pelo rateio injusto da conta de luz da área comum.',
        ],
      },
      {
        tituloH2: 'A Solução de Engenharia: Gestão de Carga Inteligente',
        conteudo: [
          'A engenharia da Delfos Solar implementa a tecnologia de gestão de carga inteligente (DLM: mede o consumo por vaga e rateia individualmente), que monitora a demanda em tempo real no quadro geral de entrada do condomínio.',
        ],
        subsecoes: [
          {
            tituloH3: 'Como o Sistema Funciona na Prática',
            conteudo: [
              'O controlador central mede a folga de potência disponível do transformador do prédio. Se o consumo residencial do condomínio estiver alto, o sistema modula e reduz suavemente a potência entregue a cada carro carregando.',
              'Quando os condôminos vão dormir e o consumo geral cai na madrugada, o sistema eleva automaticamente a taxa de carregamento para 100%, entregando todos os veículos com bateria cheia pela manhã sem nunca desarmar o disjuntor geral do condomínio e sem exigir que o prédio contrate aumento de demanda milionário com a concessionária (RGE).',
            ],
          },
          {
            tituloH3: 'Medição Individualizada e Rateio Automatizado por Vaga',
            conteudo: [
              'Cada carregador wallbox inteligente conta com leitor de cartão RFID ou aplicativo móvel. Apenas o condômino cadastrado inicia a sessão. O consumo exato em kWh é medido de acordo com padrões de faturamento e exportado em relatório mensal para a administradora do condomínio lançar na taxa condominial exclusiva do proprietário do veículo elétrico.',
            ],
          },
        ],
      },
      {
        tituloH2: 'Conformidade com a Norma ABNT NBR 17019 e ART Técnica',
        conteudo: [
          'Projetos de infraestrutura de recarga veicular em garagens coletivas exigem cumprimento estrito da norma ABNT NBR 17019, contemplando eletrocalhas metálicas fechadas, condutores livres de halogênio com baixa emissão de fumaça, disjuntores com proteção contra correntes residuais CC de 6mA (DR tipo B ou tipo A com RDC-DD) e chave de emergência acessível para brigada de incêndio.',
          'A Delfos Solar emite ART formal no CREA-RS para toda a instalação, fornecendo ao síndico o laudo de conformidade exigido pelo Corpo de Bombeiros (PPCI) e seguradoras prediais.',
        ],
      },
    ],
    conclusao: {
      texto:
        'Implantar recarga veicular com tecnologia de gestão de carga inteligente e medição individualizada valoriza o metro quadrado do condomínio em até 10% a 15% e encerra qualquer conflito entre moradores.',
      destaque:
        'Infraestrutura coletiva segura, homologada no CREA-RS e preparada para a expansão contínua da frota elétrica nos próximos 10 anos.',
    },
    faqs: [
      {
        pergunta:
          'É preciso fazer assembleia condominial para aprovar a infraestrutura coletiva de recarga?',
        resposta:
          'Sim. A melhor prática jurídica é aprovar em assembleia o projeto executivo e as regras de rateio. A equipe técnica da Delfos disponibiliza material explicativo e pode participar da assembleia para esclarecer dúvidas aos condôminos.',
      },
      {
        pergunta: 'O morador que não possui carro elétrico terá custos com o consumo dos outros?',
        resposta:
          'Não. Com a medição inteligente individual, cada kWh consumido pelo veículo é debitado diretamente no boleto do respectivo proprietário, mantendo o condomínio com custo zero de energia para recargas.',
      },
    ],
  },
]
