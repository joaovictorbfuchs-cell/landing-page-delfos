import {
  Home,
  Store,
  Factory,
  Tractor,
  Building2,
  TrendingUp,
  Truck,
  Sun,
  BatteryCharging,
  Wrench,
  Car,
  type LucideIcon,
} from 'lucide-react'
import type { SegmentoCase } from './cases'

export interface SolucaoCrossLink {
  titulo: string
  subtitulo: string
  href: string
  badge: string
  icone: LucideIcon
}

export interface SegmentoInfo {
  id: string
  slug: string // ex: "residencias", "comercio-servicos", "industria", ...
  path: string // ex: "/segmentos/residencias"
  nome: string // Nome de exibição
  caseSegmentoKey: SegmentoCase // Para filtrar em CASES_DATA
  perguntaPrincipal: string // Pergunta exata da tabela da seção 6
  headlineComplemento: string // Resposta e posicionamento técnico da Delfos
  descricaoHero: string
  ctaRecomendado: string // CTA exato da seção 6
  dadoQualificacao: string // Dado exato da tabela da seção 6
  qualificacaoCampoLabel: string
  qualificacaoCampoPlaceholder?: string
  necessidadePadrao: string
  icone: LucideIcon
  corTema: {
    bgBadge: string
    textBadge: string
    borderBadge: string
    destaque: string
  }
  isDarkMode?: boolean // Seções escuras quando BESS / Carregadores dominam
  solucoesRelevantes: SolucaoCrossLink[]
  doresERespostas: {
    dor: string
    resposta: string
    comoResolvemos: string
  }[]
  faq: {
    pergunta: string
    resposta: string
  }[]
  seo: {
    title: string
    description: string
  }
}

export const SEGMENTOS_CONFIG: Record<string, SegmentoInfo> = {
  residencias: {
    id: 'residencias',
    slug: 'residencias',
    path: '/segmentos/residencias',
    nome: 'Residências',
    caseSegmentoKey: 'Residências',
    perguntaPrincipal: 'Quanto posso economizar e há opção de backup?',
    headlineComplemento:
      'Economia de até 90% na conta de energia e proteção com baterias contra apagões na rede gaúcha.',
    descricaoHero:
      'A Delfos já executou dezenas de projetos residenciais com engenharia completa, inversores homologados e monitoramento pelo celular. Projetos com estética limpa, fixadores especiais e opção de baterias de energia para proteção contra quedas de luz.',
    ctaRecomendado: 'Simular projeto',
    dadoQualificacao: 'Cidade, concessionária e valor da conta',
    qualificacaoCampoLabel: 'Concessionária e detalhe da residência',
    qualificacaoCampoPlaceholder: '',
    necessidadePadrao: 'Energia Solar Fotovoltaica',
    icone: Home,
    corTema: {
      bgBadge: 'bg-solar-500/15',
      textBadge: 'text-solar-400',
      borderBadge: 'border-solar-400/30',
      destaque: 'text-solar-500',
    },
    isDarkMode: false,
    solucoesRelevantes: [
      {
        titulo: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
        subtitulo:
          'Redução de até 90% na conta com módulos de fabricantes de primeira linha e 25 anos de garantia.',
        href: '/solucoes/energia-solar',
        badge: 'Solução Principal',
        icone: Sun,
      },
      {
        titulo: 'Sistema de armazenamento de energia (BESS)',
        subtitulo:
          'Backup ininterrupto (< 20ms) para manter geladeira, internet e luz em temporais.',
        href: '/solucoes/bess',
        badge: 'Backup Residencial',
        icone: BatteryCharging,
      },
      {
        titulo: 'Carregadores Veiculares (Wallbox)',
        subtitulo: 'Recarga segura e inteligente para carros elétricos e híbridos na garagem.',
        href: '/solucoes/carregadores',
        badge: 'Eletromobilidade',
        icone: Car,
      },
    ],
    doresERespostas: [
      {
        dor: 'Contas de luz cada vez mais caras com bandeiras tarifárias frequentes.',
        resposta: 'Gere sua própria energia limpa na cobertura da sua casa.',
        comoResolvemos:
          'Dimensionamento preciso baseado no histórico de 12 meses de consumo. Você passa a pagar apenas a taxa básica de disponibilidade da concessionária (RGE / CEEE).',
      },
      {
        dor: 'Quedas constantes de energia durante temporais no verão gaúcho.',
        resposta: 'Baterias residenciais de lítio com reversão automática.',
        comoResolvemos:
          'Sistemas híbridos fotovoltaicos com BESS: quando a concessionária cai, a casa continua funcionando sem piscar a luz e sem o barulho nem fumaça de geradores a diesel.',
      },
      {
        dor: 'Medo de danificar o telhado cerâmico ou estética feia na fachada.',
        resposta: 'Engenharia com ART, microinversores e fixadores certificados.',
        comoResolvemos:
          'Laudo estrutural do telhado, ganchos em inox sem quebra de telhas e fiação 100% embutida em eletrodutos protegidos.',
      },
    ],
    faq: [
      {
        pergunta: 'Como as baterias (BESS) protegem a linha fabril contra microinterrupções?',
        resposta:
          'O sistema comuta para modo de sustentação autônoma em menos de 20 milissegundos, tempo imperceptível para CLPs, inversores de frequência e computadores industriais. Enquanto geradores a diesel levam de 10 a 30 segundos para partir, o sistema de baterias atua instantaneamente, evitando paradas de máquina e perda de lotes.',
      },
      {
        pergunta: 'O que é o bloqueio do horário de ponta e a redução de demanda (peak shaving)?',
        resposta:
          'O bloqueio do horário de ponta descarrega as baterias quando a energia fica cara (onde o kWh custa até 5 vezes mais). A empresa carrega de madrugada, quando a tarifa é barata, e se já tem energia solar, carrega de graça durante o dia. Já a redução da cobrança de demanda (peak shaving) é o corte instantâneo dos picos de potência nas partidas pesadas, evitando multas e enxugando o contrato da fatura.',
      },
      {
        pergunta: 'A Delfos cuida de toda a papelada e aprovação com a RGE ou CEEE?',
        resposta:
          'Sim, cuidamos de 100% do processo completo de projeto e instalação: estudo solarimétrico, projeto elétrico, emissão de ART no CREA-RS, aprovação junto à concessionária e acompanhamento da troca do inversor que carrega e descarrega as baterias e medidor.',
      },
    ],
    seo: {
      title: 'Energia Solar e BESS Residencial no RS | Delfos Engenharia',
      description:
        'Descubra quanto sua residência pode economizar em energia solar em Erechim e no Sul. Projetos com até 90% de redução, opção de backup contra blecautes e aprovação junto à concessionária.',
    },
  },

  'comercio-servicos': {
    id: 'comercio-servicos',
    slug: 'comercio-servicos',
    path: '/segmentos/comercio-servicos',
    nome: 'Comércio e Serviços',
    caseSegmentoKey: 'Comércio e Serviços',
    perguntaPrincipal: 'Como reduzir custo sem interromper a operação?',
    headlineComplemento:
      'Engenharia sem paradas operacionais: corte custos fixos de eletricidade e blinde seu atendimento comercial.',
    descricaoHero:
      'Com cases reais comprovados como Cassul Distribuidora (155 kWp) e Panificadora Garcia (112,5 kWp), a Delfos já entregou usinas comerciais de alta performance para supermercados, padarias, postos de combustíveis e varejo no RS, SC e PR sem paradas operacionais.',
    ctaRecomendado: 'Pedir estudo de viabilidade',
    dadoQualificacao: 'Conta, horário de consumo, necessidade de continuidade',
    qualificacaoCampoLabel: 'Horário de consumo e necessidade de continuidade',
    qualificacaoCampoPlaceholder: '',
    necessidadePadrao: 'Energia Solar Fotovoltaica',
    icone: Store,
    corTema: {
      bgBadge: 'bg-blue-500/15',
      textBadge: 'text-blue-400',
      borderBadge: 'border-blue-400/30',
      destaque: 'text-blue-600',
    },
    isDarkMode: false,
    solucoesRelevantes: [
      {
        titulo: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
        subtitulo: 'Redução expressiva no custo operacional em telhados metálicos ou lajes.',
        href: '/solucoes/energia-solar',
        badge: 'Geração no Horário Comercial',
        icone: Sun,
      },
      {
        titulo: 'Manutenção O&M e Monitoramento',
        subtitulo: 'Termografia por drone e limpeza técnica sem deixar a geração cair.',
        href: '/solucoes/om',
        badge: 'Proteção do Lucro',
        icone: Wrench,
      },
      {
        titulo: 'Sistema de armazenamento de energia (BESS)',
        subtitulo: 'Continuidade para câmaras frias, servidores e caixas sem perda de estoque.',
        href: '/solucoes/bess',
        badge: 'Zero Parada Operacional',
        icone: BatteryCharging,
      },
    ],
    doresERespostas: [
      {
        dor: 'Risco de perda de clientes ou mercadorias refrigeradas por queda de energia.',
        resposta: 'Armazenamento BESS ou sistemas fotovoltaicos híbridos com no-break integrado.',
        comoResolvemos:
          'Protegemos sistemas essenciais (PDVs, servidores, iluminação e compressores) para que o cliente nem perceba oscilações da rede elétrica externa.',
      },
      {
        dor: 'Obras que atrapalham o atendimento diário e fluxo na loja.',
        resposta: 'Cronograma executivo com montagem fora do horário comercial.',
        comoResolvemos:
          'Nossa equipe planeja o içamento de módulos e interligações elétricas nos períodos de menor movimento ou fins de semana, garantindo faturamento normal do estabelecimento.',
      },
      {
        dor: 'Usina já instalada por outra empresa que está gerando menos a cada mês.',
        resposta: 'Auditoria técnica de O&M com drone e lavagem especializada.',
        comoResolvemos:
          'Diagnosticamos hotspots e falhas em inversores, recuperando até +25% de geração sem necessidade de trocar placas.',
      },
    ],
    faq: [
      {
        pergunta: 'A instalação solar atrapalha o atendimento aos clientes na loja?',
        resposta:
          'Não. O cronograma executivo da Delfos prevê etapas ruidosas e içamento de materiais fora dos horários de pico comercial, com isolamento total de segurança e sem interrupção de vendas.',
      },
      {
        pergunta: 'Comércios que consomem muito ar-condicionado e refrigeração têm bom retorno?',
        resposta:
          'Excelente retorno, pois o pico de demanda de climatização coincide perfeitamente com a curva máxima de irradiação solar (meio-dia e tardes quentes), permitindo autoconsumo instantâneo e alívio tarifário imediato.',
      },
      {
        pergunta: 'Vocês realizam manutenção em usinas instaladas por outras integradoras?',
        resposta:
          'Sim! A solução de O&M da Delfos atende usinas comerciais e industriais de qualquer fabricante, com contratos preventivos com tempo de resposta combinado e laudos periódicos com ART no CREA-RS.',
      },
    ],
    seo: {
      title: 'Energia Solar e BESS para Comércio e Serviços | Delfos Solar RS',
      description:
        'Reduza despesas operacionais no comércio sem parar a operação. Projetos fotovoltaicos, O&M com drone e backup de energia para empresas em Erechim e no Sul.',
    },
  },

  industria: {
    id: 'industria',
    slug: 'industria',
    path: '/segmentos/industria',
    nome: 'Indústria',
    caseSegmentoKey: 'Indústria',
    perguntaPrincipal: 'Como dimensionar geração, baterias (BESS) e demanda contratada?',
    headlineComplemento:
      'Engenharia de alta tensão: solar de grande porte, baterias (BESS) para redução de demanda e otimização de faturas no Grupo A.',
    descricaoHero:
      'Com projetos reais homologados como Dal Pra Móveis (74,43 kWp), Clanel Confecções (123,5 kWp) e System Desenvolvimento de Software (25 kWp carport), a Delfos já executou usinas industriais de solo, cobertura e carport com análise de curva de carga, subestações abrigadas e otimização no Grupo A.',
    ctaRecomendado: 'Falar com engenharia',
    dadoQualificacao: 'Perfil de carga e demanda contratada',
    qualificacaoCampoLabel: 'Perfil de carga, demanda contratada (kW) e tensão',
    qualificacaoCampoPlaceholder: '',
    necessidadePadrao: 'BESS (Armazenamento)',
    icone: Factory,
    corTema: {
      bgBadge: 'bg-emerald-500/15',
      textBadge: 'text-emerald-400',
      borderBadge: 'border-emerald-500/30',
      destaque: 'text-emerald-400',
    },
    isDarkMode: true,
    solucoesRelevantes: [
      {
        titulo: 'Sistema de armazenamento de energia (BESS)',
        subtitulo:
          'Bloqueio do horário de ponta, backup e redução da cobrança de demanda (peak shaving).',
        href: '/solucoes/bess',
        badge: 'Empresas e Indústrias de Alta Potência',
        icone: BatteryCharging,
      },
      {
        titulo: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
        subtitulo: 'Usinas em telhado trapezoidal metálico e solo com conexão em média tensão.',
        href: '/solucoes/energia-solar',
        badge: 'Redução Estrutural',
        icone: Sun,
      },
      {
        titulo: 'Manutenção O&M e Monitoramento',
        subtitulo:
          'Planos com tempo de resposta rápido de até 4h, termografia radiométrica e revisão de subestação.',
        href: '/solucoes/om',
        badge: 'Resposta Rápida Industrial',
        icone: Wrench,
      },
    ],
    doresERespostas: [
      {
        dor: 'Microinterrupções de rede que desconfiguram fornos, robôs e centros de usinagem.',
        resposta:
          'BESS industrial com baterias de lítio de última geração com comutação ininterrupta em menos de 20ms.',
        comoResolvemos:
          'Eliminamos perdas de lotes inteiros de matéria-prima e paradas de fábrica com bancos de lítio de alta resposta e sistema inteligente de gestão dedicado.',
      },
      {
        dor: 'Multas frequentes por ultrapassagem de demanda contratada em horários de pico.',
        resposta: 'Redução automática da cobrança de demanda na fatura (peak shaving).',
        comoResolvemos:
          'O sistema de baterias descarrega instantaneamente nos minutos em que a carga atinge o teto contratado, mantendo a curva de faturamento sempre dentro do limite do contrato com a concessionária (peak shaving).',
      },
      {
        dor: 'Tarifa abusiva durante o horário de ponta (18h às 21h) no Grupo A.',
        resposta: 'Bloqueio do horário de ponta: carrega de madrugada e usa de noite.',
        comoResolvemos:
          'Carregamos de madrugada, quando a energia é barata, e usamos de noite, quando fica caro. E se a empresa já tem energia solar, carrega as baterias de graça durante o dia.',
      },
    ],
    faq: [
      {
        pergunta: 'Como o BESS se integra à usina solar já existente na fábrica?',
        resposta:
          'O BESS é acoplado em corrente alternada (AC Coupling) ou contínua (DC Coupling) através de inversores que carregam e descarregam as baterias, coordenados por um sistema inteligente de gestão (EMS) que lê o fluxo da subestação em tempo real.',
      },
      {
        pergunta: 'Qual a durabilidade e segurança das baterias industriais em galpões?',
        resposta:
          'Trabalhamos exclusivamente com baterias de lítio de última geração (LiFePO4) em gabinetes IP55 climatizados, com controle térmico ativo e sistema automático de supressão de incêndio, certificados para mais de 6.000 ciclos.',
      },
      {
        pergunta:
          'A Delfos faz o estudo da fatura de energia e renegociação de demanda contratada?',
        resposta:
          'Sim. Nossa equipe de engenharia analisa 12 a 24 meses de faturas de alta tensão (Grupo A Verde/Azul) e histórico de medição de monitoramento remoto para sugerir o re-enquadramento tarifário ideal em conjunto com o BESS.',
      },
    ],
    seo: {
      title: 'Energia Solar, Baterias (BESS) e Demanda Contratada para Indústrias | Delfos RS',
      description:
        'Engenharia industrial de ciclo completo no RS: baterias (BESS) para continuidade, bloqueio de ponta, redução de demanda (peak shaving), solar e O&M com tempo de resposta combinado para indústrias em Erechim e no Sul.',
    },
  },

  agronegocio: {
    id: 'agronegocio',
    slug: 'agronegocio',
    path: '/segmentos/agronegocio',
    nome: 'Agronegócio',
    caseSegmentoKey: 'Agronegócio',
    perguntaPrincipal: 'Como garantir energia para a operação rural?',
    headlineComplemento:
      'Segurança energética para o campo: usinas de solo e telhado com baterias contra oscilações da rede rural.',
    descricaoHero:
      'Com projetos reais homologados no campo como a Ervateira Bazia (93,5 kWp), aviários automatizados, pecuária de leite e silos de grãos, a Delfos já entregou usinas rurais com máxima robustez contra oscilações de rede e suporte às linhas de financiamento rurais (Pronaf e Inovagro).',
    ctaRecomendado: 'Avaliar unidade',
    dadoQualificacao: 'Local, atividade e qualidade da rede rural',
    qualificacaoCampoLabel: 'Local da propriedade, atividade e qualidade da rede rural',
    qualificacaoCampoPlaceholder: '',
    necessidadePadrao: 'Energia Solar Fotovoltaica',
    icone: Tractor,
    corTema: {
      bgBadge: 'bg-emerald-500/15',
      textBadge: 'text-emerald-400',
      borderBadge: 'border-emerald-500/30',
      destaque: 'text-emerald-600',
    },
    isDarkMode: false,
    solucoesRelevantes: [
      {
        titulo: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
        subtitulo: 'Usinas de solo em estrutura galvanizada ou sobre galpões rurais.',
        href: '/solucoes/energia-solar',
        badge: 'Geração Rural',
        icone: Sun,
      },
      {
        titulo: 'Sistema de armazenamento de energia (BESS)',
        subtitulo: 'Backup rural automático sem os custos e falhas de gerador a diesel.',
        href: '/solucoes/bess',
        badge: 'Zero Perda de Lote',
        icone: BatteryCharging,
      },
      {
        titulo: 'Manutenção O&M e Monitoramento',
        subtitulo: 'Lavagem técnica anti-fuligem agrícola e termografia por drone.',
        href: '/solucoes/om',
        badge: 'Safra Protegida',
        icone: Wrench,
      },
    ],
    doresERespostas: [
      {
        dor: 'Queda de energia no verão com risco de morte em massa de aves e suínos.',
        resposta: 'BESS de lítio com reversão automática em milissegundos.',
        comoResolvemos:
          'Os exaustores e climatizadores continuam operando sem interrupção mesmo em caso de temporal com rompimento de cabos da concessionária na zona rural.',
      },
      {
        dor: 'Rede rural monofásica com oscilação extrema de tensão que queima motores.',
        resposta: 'Inversores híbridos com estabilização ativa de tensão e filtros DPS.',
        comoResolvemos:
          'O sistema condiciona a onda de eletricidade rural, protegendo motores de ordenha, bombas de poço artesiano e resfriadores de leite.',
      },
      {
        dor: 'Acúmulo intenso de poeira e fuligem de secadores de grãos sobre os painéis.',
        resposta: 'Plano de O&M rural com lavagem programada na entressafra.',
        comoResolvemos:
          'Equipe de campo com equipamentos de água deionizada restaura 100% da capacidade de geração antes do período crítico de consumo.',
      },
    ],
    faq: [
      {
        pergunta: 'É possível financiar o sistema solar e BESS pelo Pronaf ou Pronamp?',
        resposta:
          'Sim. A Delfos apoia o produtor em toda a documentação de engenharia exigida pelos agentes financeiros (Banco do Brasil, Sicredi, Cresol, Banrisul) para linhas de crédito rural com taxas subsidiadas.',
      },
      {
        pergunta: 'Usina de solo ocupa espaço que poderia ser produtivo?',
        resposta:
          'Dimensionamos as usinas de solo em áreas de declive, bordas de propriedade ou áreas não cultiváveis, com estruturas elevadas que permitem roçada fácil e proteção contra animais.',
      },
      {
        pergunta: 'O sistema com baterias substitui o gerador a diesel?',
        resposta:
          'Sim, ou pode atuar de forma híbrida: a bateria assume instantaneamente eliminando a transição com perda de ar nos galpões, e o gerador só entra em caso de eventos climáticos de múltiplos dias seguidos.',
      },
    ],
    seo: {
      title: 'Energia Solar e BESS para o Agronegócio no RS | Delfos Solar',
      description:
        'Segurança energética rural para avicultura, suinocultura, leite e grãos no Sul do Brasil. Usinas de solo, backup com baterias e financiamento Pronaf/Pronamp.',
    },
  },

  condominios: {
    id: 'condominios',
    slug: 'condominios',
    path: '/segmentos/condominios',
    nome: 'Condomínios',
    caseSegmentoKey: 'Condomínios',
    perguntaPrincipal: 'Como instalar recarga e dividir o consumo?',
    headlineComplemento:
      'Infraestrutura inteligente de recarga veicular com Gestão de Carga Inteligente e rateio por vaga.',
    descricaoHero:
      'Com experiência em condomínios residenciais e comerciais como Lyon e Notabile, a Delfos desenvolve laudos de viabilidade, usinas solares para redução da taxa condominial das áreas comuns e projetos coletivos de recarga veicular com rateio individualizado por vaga.',
    ctaRecomendado: 'Solicitar vistoria',
    dadoQualificacao: 'Número de vagas e infraestrutura existente',
    qualificacaoCampoLabel: 'Número de vagas, transformador e infraestrutura existente',
    qualificacaoCampoPlaceholder: '',
    necessidadePadrao: 'Carregadores Veiculares',
    icone: Building2,
    corTema: {
      bgBadge: 'bg-indigo-500/15',
      textBadge: 'text-indigo-300',
      borderBadge: 'border-indigo-500/30',
      destaque: 'text-indigo-400',
    },
    isDarkMode: true,
    solucoesRelevantes: [
      {
        titulo: 'Carregadores Veiculares & Gestão de Carga Inteligente',
        subtitulo:
          'Wallbox com modulação dinâmica de carga para não sobrecarregar o transformador.',
        href: '/solucoes/carregadores',
        badge: 'Solução Central',
        icone: Car,
      },
      {
        titulo: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
        subtitulo: 'Zere a conta do condomínio (elevadores, bombas e áreas comuns).',
        href: '/solucoes/energia-solar',
        badge: 'Áreas Comuns',
        icone: Sun,
      },
      {
        titulo: 'Manutenção O&M e Monitoramento',
        subtitulo: 'Inspeção preventiva semestral em quadros elétricos e estações de recarga.',
        href: '/solucoes/om',
        badge: 'Segurança Predial',
        icone: Wrench,
      },
    ],
    doresERespostas: [
      {
        dor: 'O condomínio não tem capacidade no transformador para vários carros elétricos.',
        resposta:
          'Gestão de Carga Inteligente (DLM: mede o consumo por vaga e rateia individualmente).',
        comoResolvemos:
          'O sistema monitora o consumo dos apartamentos em tempo real e entrega a sobra para as vagas. De madrugada, todos carregam na potência máxima sem aumentar 1 kVA de demanda na concessionária.',
      },
      {
        dor: 'Moradores sem carro elétrico não aceitam ratear o custo da energia da garagem.',
        resposta: 'Medição individualizada por morador com cartão RFID ou aplicativo.',
        comoResolvemos:
          'A recarga só é liberada com autenticação. O consumo de cada morador é medido e faturado diretamente para ele, com relatório transparente para a administradora.',
      },
      {
        dor: 'Risco de incêndio ou choque com tomadas improvisadas na garagem.',
        resposta: 'Engenharia completa sob a norma NBR 17019 com disjuntores DR Tipo B.',
        comoResolvemos:
          'Barramento blindado em eletrocalha suspensa, com proteção dedicada contra fuga de corrente contínua e laudo de conformidade com ART no CREA-RS.',
      },
    ],
    faq: [
      {
        pergunta: 'É preciso aprovar em assembleia de condomínio?',
        resposta:
          'Sim. A equipe de engenharia da Delfos elabora um laudo técnico preliminar e pode participar da assembleia para apresentar aos condôminos como a infraestrutura valoriza o patrimônio e não onera quem não tem carro elétrico.',
      },
      {
        pergunta: 'Quanto custa a adequação e quem paga a energia?',
        resposta:
          'A infraestrutura base de barramento é rateada ou financiada pelo condomínio, enquanto a estação Wallbox e 100% da eletricidade consumida são pagas exclusivamente pelo proprietário do veículo.',
      },
      {
        pergunta: 'O condomínio precisará fazer obras civis pesadas?',
        resposta:
          'Geralmente não. Utilizamos eletrocalhas metálicas aparentes e barramentos blindados pelo teto da garagem, sem quebra de piso ou demolições.',
      },
    ],
    seo: {
      title: 'Carregadores para Condomínios e Gestão de Carga Inteligente | Delfos Engenharia RS',
      description:
        'Infraestrutura de recarga veicular para condomínios no RS com gestão de carga inteligente sem sobrecarregar o transformador e com rateio individual.',
    },
  },

  investidores: {
    id: 'investidores',
    slug: 'investidores',
    path: '/segmentos/investidores',
    nome: 'Investidores e Usinas',
    caseSegmentoKey: 'Investidores e Usinas',
    perguntaPrincipal: 'Como implantar ou recuperar desempenho?',
    headlineComplemento:
      'Geração Distribuída e Usinas de Solo: engenharia completa de projeto e instalação com conexão em média tensão e O&M para recuperar usinas com perdas.',
    descricaoHero:
      'Modelagem regulatória da Lei 14.300/2022, usinas de solo compartilhadas, locação de créditos de energia e auditoria de usinas em operação com termografia por drone e recuperação de geração.',
    ctaRecomendado: 'Solicitar diagnóstico',
    dadoQualificacao: 'Potência, local e etapa do projeto',
    qualificacaoCampoLabel: 'Potência prevista/instalada (kWp/MWp), local e etapa',
    qualificacaoCampoPlaceholder: '',
    necessidadePadrao: 'Energia Solar Fotovoltaica',
    icone: TrendingUp,
    corTema: {
      bgBadge: 'bg-purple-500/15',
      textBadge: 'text-purple-400',
      borderBadge: 'border-purple-500/30',
      destaque: 'text-purple-600',
    },
    isDarkMode: false,
    solucoesRelevantes: [
      {
        titulo: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
        subtitulo: 'Engenharia de usinas de solo com subestação, SPDA e conexão em média tensão.',
        href: '/solucoes/energia-solar',
        badge: 'Usinas de Solo',
        icone: Sun,
      },
      {
        titulo: 'Manutenção O&M e Monitoramento',
        subtitulo:
          'Recuperação de usinas com baixo índice de geração (PR), drone termográfico e atendimento prioritário para investidores.',
        href: '/solucoes/om',
        badge: 'Proteção da TIR',
        icone: Wrench,
      },
      {
        titulo: 'Sistema de armazenamento de energia (BESS)',
        subtitulo:
          'Hibridização de usinas para bloqueio do horário caro e estabilidade de injeção.',
        href: '/solucoes/bess',
        badge: 'Armazenamento em Escala',
        icone: BatteryCharging,
      },
    ],
    doresERespostas: [
      {
        dor: 'Insegurança regulatória sobre regras da Lei 14.300/2022 e regras atuais de compensação.',
        resposta: 'Modelagem técnico-financeira detalhada com TIR, VPL e LCOE auditados.',
        comoResolvemos:
          'Apresentamos simulação fiscal e tarifária transparente com fluxo de caixa projetado, assegurando retorno de investimento sólido para fundos e investidores privados nas regras atuais de compensação.',
      },
      {
        dor: 'Usina existente gerando abaixo do previsto sem explicação clara do instalador.',
        resposta: 'Auditoria pericial O&M com drone e análise radiométrica de células.',
        comoResolvemos:
          'Identificamos strings inoperantes, diodos em curto, hotspots e erros de parametrização de inversores, emitindo laudo formal com ART e executando as correções.',
      },
      {
        dor: 'Complexidade de aprovação junto à concessionária de subestações de média tensão.',
        resposta:
          'Engenharia completa com aprovação junto à concessionária direta na RGE, CEEE ou cooperativas.',
        comoResolvemos:
          'Cuidamos desde o parecer de acesso e estudo de fluxo de carga até o comissionamento de proteção e energização oficial.',
      },
    ],
    faq: [
      {
        pergunta:
          'Ainda vale a pena investir em usinas solares com o sistema de compensação atual?',
        resposta:
          'Sim! Com os custos de equipamentos fotovoltaicos nos menores patamares históricos e a alta contínua das tarifas de energia, a Taxa Interna de Retorno (TIR) de usinas de solo bem dimensionadas segue bastante atrativa (frequentemente superando 18% a 24% a.a.).',
      },
      {
        pergunta: 'A Delfos constrói usinas no modelo Turnkey (chave na mão)?',
        resposta:
          'Sim. Cobrimos o ciclo completo: estudo de solo, terraplanagem, engenharia civil e elétrica, fornecimento de módulos e inversores de fabricantes de primeira linha, subestação abrigada, cabeamento MT, homologação e O&M com tempo de resposta garantido.',
      },
      {
        pergunta: 'Como funciona o diagnóstico para usinas de solo que estão com baixa geração?',
        resposta:
          'Enviamos equipe especializada com drone termográfico e analisador de curvas I-V. Em 48 a 72 horas entregamos um laudo detalhado apontando exatamente onde o ativo está perdendo dinheiro e a estimativa de ganho após o reparo.',
      },
    ],
    seo: {
      title: 'Usinas de Solo e O&M para Investidores no RS | Delfos Engenharia',
      description:
        'Projeto e instalação completos para investidores em geração distribuída e usinas solares de solo no RS. Implantação completa, conexão em média tensão e auditoria O&M com drone.',
    },
  },

  'frotas-eletropostos': {
    id: 'frotas-eletropostos',
    slug: 'frotas-eletropostos',
    path: '/segmentos/frotas-eletropostos',
    nome: 'Frotas e Eletropostos',
    caseSegmentoKey: 'Frotas e Eletropostos',
    perguntaPrincipal: 'Qual infraestrutura de recarga atende à frota?',
    headlineComplemento:
      'Eletromobilidade corporativa: eletropostos rápidos DC, recarga programada para frotas e integração com energia solar.',
    descricaoHero:
      'Projetos elétricos para furgões de entrega, ônibus elétricos, frotas corporativas e eletropostos comerciais abertos ao público. Carregadores DC Fast Charger de até 150+ kW com monitoramento remoto e subestação dedicada.',
    ctaRecomendado: 'Pedir estudo elétrico',
    dadoQualificacao: 'Número de veículos, local e padrão de uso',
    qualificacaoCampoLabel: 'Número de veículos elétricos, local e janela de recarga',
    qualificacaoCampoPlaceholder: '',
    necessidadePadrao: 'Carregadores Veiculares',
    icone: Truck,
    corTema: {
      bgBadge: 'bg-cyan-500/15',
      textBadge: 'text-cyan-300',
      borderBadge: 'border-cyan-500/30',
      destaque: 'text-cyan-400',
    },
    isDarkMode: true,
    solucoesRelevantes: [
      {
        titulo: 'Carregadores Veiculares & Eletropostos',
        subtitulo: 'DC Fast Chargers de alta potência e Wallboxes AC com gestão OCPP.',
        href: '/solucoes/carregadores',
        badge: 'Alta Potência DC',
        icone: Car,
      },
      {
        titulo: 'Sistema de armazenamento de energia (BESS)',
        subtitulo: 'Mitigação de picos de recarga rápida sem estourar a demanda da transportadora.',
        href: '/solucoes/bess',
        badge: 'Armazenamento de Apoio',
        icone: BatteryCharging,
      },
      {
        titulo: 'Energia Solar Fotovoltaica (Projeto e Instalação)',
        subtitulo: 'Gere o próprio combustível elétrico da frota a custo próximo de zero por km.',
        href: '/solucoes/energia-solar',
        badge: 'Combustível Solar',
        icone: Sun,
      },
    ],
    doresERespostas: [
      {
        dor: 'Carregar múltiplos frotistas ao mesmo tempo pode derrubar o disjuntor da empresa.',
        resposta: 'Dimensionamento de subestação dedicada e agendamento inteligente por rota.',
        comoResolvemos:
          'Projetamos o equilíbrio de carga com priorização por veículo, garantindo que os veículos com saída mais cedo recebam recarga prioritária durante a janela noturna.',
      },
      {
        dor: 'Custo abusivo de diesel na frota logística pesada e urbana.',
        resposta:
          'Transição para eletromobilidade com custo de energia solar equivalente a R$ 0,18/km.',
        comoResolvemos:
          'A combinação de usina solar própria com eletroposto corporativo reduz em até 75% o custo de abastecimento por km rodado da transportadora.',
      },
      {
        dor: 'Necessidade de monetizar carregadores comerciais em postos ou shopping centers.',
        resposta: 'Plataforma OCPP em nuvem com split de pagamento via cartão e PIX.',
        comoResolvemos:
          'Implantamos eletropostos comerciais com aplicativo próprio ou totem de autoatendimento onde o motorista paga por kWh ou tempo de uso.',
      },
    ],
    faq: [
      {
        pergunta: 'Qual a diferença entre recarga AC (Wallbox) e recarga rápida DC?',
        resposta:
          'Wallboxes AC (7 kW a 22 kW) utilizam o conversor interno do veículo e levam de 4 a 8 horas para carregar (ideais para pernoite na garagem). Carregadores rápidos DC (30 kW a 150+ kW) alimentam a bateria diretamente em corrente contínua, recuperando 80% da carga em 20 a 40 minutos.',
      },
      {
        pergunta: 'É viável instalar um eletroposto comercial aberto em rodovias ou postos?',
        resposta:
          'Muito viável. O fluxo de veículos elétricos e híbridos plug-in no RS e em Santa Catarina cresce a taxas de 3 dígitos ao ano. A Delfos cuida do estudo de viabilidade, da subestação e da integração do sistema de pagamento.',
      },
      {
        pergunta: 'Como o BESS ajuda um eletroposto de alta potência?',
        resposta:
          'Carregadores rápidos de 150 kW exigem picos instantâneos elevados. Um BESS local funciona como um reservatório: carrega devagar da rede ou dos painéis solares e entrega a potência máxima no momento em que os carros conectam, evitando aumentos onerosos de demanda contratada.',
      },
    ],
    seo: {
      title: 'Infraestrutura de Recarga para Frotas e Eletropostos | Delfos RS',
      description:
        'Projetos elétricos para frotas corporativas e eletropostos rápidos DC no RS. Estações de recarga de até 150 kW, gestão de carga e integração com energia solar.',
    },
  },
}

export const LISTA_SEGMENTOS_ORDEM = [
  SEGMENTOS_CONFIG['residencias'],
  SEGMENTOS_CONFIG['comercio-servicos'],
  SEGMENTOS_CONFIG['industria'],
  SEGMENTOS_CONFIG['agronegocio'],
  SEGMENTOS_CONFIG['condominios'],
  SEGMENTOS_CONFIG['investidores'],
  SEGMENTOS_CONFIG['frotas-eletropostos'],
]
