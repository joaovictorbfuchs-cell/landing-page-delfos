export interface FaqSegmentoItem {
  id: string
  numero: string // "Q1", "Q2", etc.
  pergunta: string
  respostaRapida: string
  detalheTecnico: string[] // Parágrafos do detalhe técnico
  ctaNota?: string
  ctaTexto?: string
  ctaHref?: string
}

export interface FaqSegmentoData {
  segmentoId: string
  segmentoNome: string
  descricao: string
  itens: FaqSegmentoItem[]
}

export const FAQ_POR_SEGMENTO: Record<string, FaqSegmentoData> = {
  residencias: {
    segmentoId: 'residencias',
    segmentoNome: 'Residências',
    descricao:
      'Geração distribuída residencial, homologação na distribuidora e sistemas de backup domiciliar.',
    itens: [
      {
        id: 'res-q1',
        numero: 'Q1',
        pergunta: 'Quanto custa instalar energia solar na minha casa?',
        respostaRapida:
          'O investimento depende do consumo, do padrão de entrada e das condições do telhado. Para referência, sistemas residenciais típicos de 5 a 10 kWp exigem um aporte que se paga em 2 a 5 anos. O valor exato só sai de um estudo com sua fatura em mãos.',
        detalheTecnico: [
          'A proposta séria separa equipamentos, instalação e homologação, considerando consumo de 12 meses, tarifa e irradiação local. Para viabilizar orçamentos apertados, existem o financiamento (parcela menor que a economia) e a energia solar por assinatura, que entrega economia sem investimento inicial.',
          'Evite comparar propostas por R$/kWp sem olhar qualidade de inversor, garantias e escopo — é onde moram as surpresas.',
        ],
        ctaNota: 'Estudo de viabilidade técnica sem compromisso',
        ctaTexto: 'Simular meu sistema residencial',
        ctaHref: '/energia-solar#simulador',
      },
      {
        id: 'res-q2',
        numero: 'Q2',
        pergunta: 'Energia solar zera a conta de luz?',
        respostaRapida:
          'Quase. Os excedentes viram créditos que abatem o consumo, mas permanecem o custo de disponibilidade (30, 50 ou 100 kWh conforme o padrão) e a iluminação pública. A economia real média fica entre 85% e 95% da conta.',
        detalheTecnico: [
          'O Sistema de Compensação (SCEE/ANEEL) é contábil: a energia gerada de dia abate o consumo noturno via créditos válidos por 60 meses. A Lei 14.300/2022 instituiu cobrança progressiva do Fio B para novos sistemas (15% em 2023 até 90% em 2029) — mais um motivo para instalar antes.',
          'Confira sempre se a simulação já desconta essas cobranças regulatórias para não gerar falsa expectativa de custo zero absoluto.',
        ],
        ctaNota: 'Auditoria da sua fatura e projeção de Fio B',
        ctaTexto: 'Quero minha economia real',
        ctaHref: '/#contato',
      },
      {
        id: 'res-q3',
        numero: 'Q3',
        pergunta: 'Preciso de bateria (BESS) na minha casa?',
        respostaRapida:
          'Só se você quer energia durante apagões ou usar à noite a própria geração do dia. Sem bateria, o sistema desliga na falta de rede (proteção anti-ilhamento) e você continua abastecido pelos créditos. Bateria é conforto e segurança, não obrigação.',
        detalheTecnico: [
          'Um BESS residencial (LFP, 10 a 15 kWh úteis) com inversor híbrido alimenta cargas críticas por horas: geladeira, luzes, bomba, internet, portão. Regiões com rede instável ou residências com bombeamento e automação são as que mais se beneficiam.',
          'Dimensionar exige definir o que deve continuar ligado (kW) e por quanto tempo (kWh) — bateria é projeto, não acessório.',
        ],
        ctaNota: 'Projetos híbridos e backup anti-apagão',
        ctaTexto: 'Avaliar backup residencial',
        ctaHref: '/baterias',
      },
      {
        id: 'res-q4',
        numero: 'Q4',
        pergunta: 'Quantas placas preciso e o telhado serve?',
        respostaRapida:
          'Como referência, 500 kWh/mês pedem cerca de 8 a 12 módulos de 550 Wp — cerca de 20 a 30 m² de área. O telhado precisa estar em bom estado, sem sombreamento relevante, com orientação preferencial norte. A conta exata sai do histórico da fatura.',
        detalheTecnico: [
          "O dimensionamento parte do consumo médio, aplica perdas do sistema (10-20%) e divide pela geração por módulo conforme a irradiância local. Sombras de árvores, caixa d'água e prédios vizinhos reduzem produção — e em string series derrubam módulos inteiros, motivo para análise técnica antes de comprar.",
          'Telhados antigos podem precisar de reforço estrutural; inclua isso no orçamento desde a visita preliminar.',
        ],
      },
      {
        id: 'res-q5',
        numero: 'Q5',
        pergunta: 'Que manutenção meu sistema residencial exige?',
        respostaRapida:
          "Pouca, mas não nenhuma: limpeza 1-2 vezes ao ano e inspeção anual de conexões, inversor e estrutura. O inversor é o componente que mais falha ao longo da vida útil — monitorar a geração pelo app é o melhor 'detector de problemas' gratuito que existe.",
        detalheTecnico: [
          'Queda de geração sem causa climática pede diagnóstico: sujeira, sombreamento novo, string aberta ou inversor. Um plano de O&M leve com termografia anual e análise de Performance Ratio (PR acima de 75-80%) mantém o sistema no padrão por 25+ anos.',
          'Essa rotina preventiva preserva as garantias dos fabricantes, que exigem instalação e manutenção rigorosamente conforme manual técnico.',
        ],
      },
    ],
  },

  'comercio-servicos': {
    segmentoId: 'comercio-servicos',
    segmentoNome: 'Comércio e Serviços',
    descricao:
      'Otimização tarifária, pico de carga no horário comercial, energia por assinatura e eletropostos para clientes.',
    itens: [
      {
        id: 'com-q1',
        numero: 'Q1',
        pergunta: 'Vale a pena para meu comércio? Como fica a demanda contratada?',
        respostaRapida:
          'Comércios são dos melhores perfis para solar: consomem exatamente no horário de geração (o sol e o faturamento trabalham juntos). No Grupo A, a demanda contratada continua sendo faturada — o projeto deve considerar isso, e em muitos casos permite redimensionar a demanda e economizar ainda mais.',
        detalheTecnico: [
          'A análise parte do histórico da fatura, horário de ponta e fora de ponta, e do perfil de carga. Fatores que aceleram o payback em comércio (tipicamente 2 a 4 anos): tarifa mais alta que residencial, consumo diurno alinhado à geração e ar-condicionado como carga principal.',
          'O projeto também avalia se compensa reduzir a demanda contratada após a solar — otimização que poucos fornecedores fazem.',
        ],
        ctaNota: 'Análise de curva de carga e enquadramento tarifário',
        ctaTexto: 'Estudar viabilidade do meu comércio',
        ctaHref: '/#contato',
      },
      {
        id: 'com-q2',
        numero: 'Q2',
        pergunta: 'Posso instalar bateria para cortar a tarifa de horário de ponta?',
        respostaRapida:
          'Sim, e é uma das aplicações mais rentáveis de BESS: carregar as baterias fora de ponta (ou com o excedente solar) e consumir no horário de ponta, quando a tarifa chega a valer 3 a 5 vezes mais. Para comércios com pico noturno — restaurantes, mercados, postos — o BESS ataca a maior fatia da fatura.',
        detalheTecnico: [
          'O dimensionamento exige a curva de carga real e as tarifas vigentes (com horário de ponta definido pela distribuidora). O BESS desloca consumo, reduz demanda pontual e ainda serve de backup para câmaras frias e PDV.',
          'A viabilidade vem da diferença ponta/fora de ponta multiplicada pelos kWh deslocados — simulação obrigatória antes de investir.',
        ],
        ctaNota: 'Arbitragem tarifária para estabelecimentos comerciais',
        ctaTexto: 'Simular deslocamento de consumo',
        ctaHref: '/baterias',
      },
      {
        id: 'com-q3',
        numero: 'Q3',
        pergunta: 'Loja alugada ou ponto que posso trocar: como fazer solar?',
        respostaRapida:
          'Sem instalar nada no local: a energia solar por assinatura. Você recebe créditos de uma usina da Delfos que abatem sua conta, com desconto garantido sobre a tarifa — economia imediata, sem investimento, sem obra e sem vínculo com o imóvel. Ao trocar de endereço, o benefício acompanha o CNPJ.',
        detalheTecnico: [
          'O modelo é a autoconsumo remoto/consórcio da geração distribuída: a usina injeta na rede e os créditos são alocados à sua unidade consumidora. Pontos de atenção no contrato: percentual de desconto sobre a tarifa, prazo, reajuste, taxa de adesão e prazo de carência.',
          'É a solução padrão para franquias, clínicas, academias e varejo em shopping que buscam liquidez imediata.',
        ],
        ctaNota: 'Zero CAPEX e sem intervenção estrutural',
        ctaTexto: 'Quero economia sem obra',
        ctaHref: '/#contato',
      },
      {
        id: 'com-q4',
        numero: 'Q4',
        pergunta: 'O que acontece com meu negócio num apagão?',
        respostaRapida:
          'Sem backup, para tudo — e cada hora parada tem custo em venda perdida e mercadoria. Um BESS dimensionado mantém caixa, PDV, iluminação, refrigeração e internet por horas. Para cargas maiores, avaliamos BESS ampliado ou híbrido com gerador.',
        detalheTecnico: [
          'O projeto parte do levantamento de cargas críticas: o que precisa continuar funcionando e por quanto tempo. Sistemas com inversor híbrido assumem em segundos (disruption mínima), essenciais para câmaras frias, servidores e checkout.',
          'A integração solar+BESS ainda reduz a fatura no dia a dia — o backup paga o próprio custo duas vezes: evita prejuízo e economiza na tarifa.',
        ],
        ctaNota: 'Continuidade de negócios e segurança de PDV',
        ctaTexto: 'Dimensionar backup para minha operação',
        ctaHref: '/baterias',
      },
      {
        id: 'com-q5',
        numero: 'Q5',
        pergunta: 'Instalar carregador para clientes vale a pena?',
        respostaRapida:
          'Sim: atrai tráfego qualificado e aumenta o tempo de permanência — 30 a 60 minutos de recarga são 30 a 60 minutos de consumo na loja. Restaurantes, shoppings, hotéis e postos já tratam eletroposto como estratégia de visitação, não como lucro direto.',
        detalheTecnico: [
          'Dois modelos: recarga como diferencial (custo de energia embutido no ticket) ou cobrança por kWh/minuto com operação própria ou rede de recarga. A instalação exige estudo do padrão elétrico, circuito dedicado, proteções e, em fachada, projeto urbanístico.',
          'A escolha da potência (7,4 a 22 kW AC na maioria dos casos) depende do tempo médio de permanência do cliente.',
        ],
      },
    ],
  },

  industria: {
    segmentoId: 'industria',
    segmentoNome: 'Indústria',
    descricao:
      'Grandes consumidores em média/alta tensão, gestão de demanda, modo Q e engenharia de O&M.',
    itens: [
      {
        id: 'ind-q1',
        numero: 'Q1',
        pergunta: 'Qual o tamanho ideal de sistema para uma indústria?',
        respostaRapida:
          'Na indústria, o limite nem sempre é o telhado — é o consumo. Sistemas de 100 kWp a 5 MWp são comuns, geralmente híbridos entre telhado, solo e área de estacionamento. O dimensionamento parte da curva de carga 24h e da demanda contratada, não de uma regra por m².',
        detalheTecnico: [
          'Indústrias do Grupo A têm tariffação por demanda e reativo — o projeto solar precisa ser integrado à gestão elétrica: ajuste de demanda contratada, correção de fator de potência e análise de horário de ponta. O payback industrial (2 a 4 anos) é turbinado por tarifa alta e escala.',
          'Sombreamento entre fileiras, lajes industriais com capacidade portante e o ponto de conexão (prioridade: o mais próximo do transformador) definem o projeto executivo.',
        ],
        ctaNota: 'Estudo elétrico detalhado de conexão industrial',
        ctaTexto: 'Estudo de viabilidade industrial',
        ctaHref: '/#contato',
      },
      {
        id: 'ind-q2',
        numero: 'Q2',
        pergunta: 'Baterias BESS fazem sentido para indústria?',
        respostaRapida:
          'Sim, em três frentes: deslocar consumo do horário de ponta (maior tarifa do dia), cortar picos de demanda (demand charges) e garantir continuidade para processos que não podem parar. Com a curva de carga em mãos, o BESS industrial quase sempre tem payback de 4 a 7 anos — e em processos críticos, o valor do uptime justifica sozinho.',
        detalheTecnico: [
          'A modelagem usa a curva de carga em intervalos de 15 min, tarifas de demanda e de energia ponta/fora de ponta. Aplicações típicas: peak shaving (corte de picos), arbitragem tarifária, back-up de linhas críticas e suporte a geração própria.',
          'Requisitos: BESS certificado, gestão térmica, proteção de incêndio conforme exigências locais e integração ao sistema de automação. O BESS industrial é ativo de gestão energética, não só backup.',
        ],
        ctaNota: 'Simulação com dados de telemedição de 15 minutos',
        ctaTexto: 'Modelar BESS com minha curva de carga',
        ctaHref: '/baterias',
      },
      {
        id: 'ind-q3',
        numero: 'Q3',
        pergunta: 'Como garantir performance de uma usina solar industrial ao longo dos 25 anos?',
        respostaRapida:
          'Com O&M profissional: monitoramento contínuo, termografia, limpeza orientada por dado e manutenção preventiva. Uma usina de 1 MWp pode perder R$ 50-150 mil em geração ao longo da vida por causa de falhas silenciosas — degradação acelerada, hot spots, strings abertas. O&M não é custo, é garantia de ROE.',
        detalheTecnico: [
          'O pacote O&M industrial inclui: SCADA e monitoramento com análise de desvios, inspeções termográficas semestrais, limpeza por análise de perda por sujidade (não calendário), gestão de garantias de inversor e módulos, e relatórios com PR e disponibilidade mensais.',
          'SLA de resposta a falhas e sobressalentes em estoque evitam dias de produção perdida. Contrato deve discriminar preventivas, corretivas cobertas, exclusões e prazos.',
        ],
        ctaNota: 'Auditoria termográfica e inspeção de performance',
        ctaTexto: 'Diagnóstico da minha usina industrial',
        ctaHref: '/manutencao',
      },
      {
        id: 'ind-q4',
        numero: 'Q4',
        pergunta: 'A geração solar reduz demand charges e fator de potência?',
        respostaRapida:
          'Reduz o consumo de energia com certeza; a demanda depende do perfil. Como a solar gera no horário de maior carga industrial (dia), ela frequentemente corta os picos e permite reduzir a demanda contratada na renovação — economia adicional que vai direto ao EBITDA.',
        detalheTecnico: [
          'A análise exige sobrepor geração prevista e curva de carga: se os picos ocorrem entre 10h-16h, a solar ataca diretamente; picos noturnos pedem BESS.',
          'Fator de potência: inversores podem operar com injeção/absorção de reativo (modo Q), ajudando a manter FP acima de 0,92 e evitar multas na fatura. Tudo isso deve entrar no projeto elétrico desde o estudo de viabilidade.',
        ],
      },
      {
        id: 'ind-q5',
        numero: 'Q5',
        pergunta: 'Minha indústria pode vender energia ou virar investidora em solar?',
        respostaRapida:
          'Pode. Excedentes geram créditos compensáveis (validade 60 meses) em outras unidades do mesmo CNPJ ou titularidade — rede de filiais abatendo fatura com a geração da matriz. E áreas ociosas (telhado, terreno) podem sediar usinas próprias para rentabilidade, com venda de excedente no mercado livre conforme o enquadramento.',
        detalheTecnico: [
          'No autoconsumo remoto, a mesma titularidade (CNPJ ou grupo societário em situações permitidas) aloca créditos entre unidades — ferramenta de tesouraria para redes industriais.',
          'Para usinas de maior porte, o mercado livre (ACL) abre caminho para comercialização, com exigências de contratação e medição. A estruturação depende do porte, do perfil das unidades e do enquadramento regulatório — estudo dedicado antes de investir.',
        ],
      },
    ],
  },

  agronegocio: {
    segmentoId: 'agronegocio',
    segmentoNome: 'Agronegócio',
    descricao:
      'Irrigação, confinamentos de alta criticidade, linhas de crédito do Plano Safra e estruturas de solo reforçadas.',
    itens: [
      {
        id: 'agro-q1',
        numero: 'Q1',
        pergunta: 'Energia solar vale para irrigação e bombeamento?',
        respostaRapida:
          'É uma das aplicações com melhor retorno no campo: bombas de irrigação consomem justamente quando o sol está a pino. Sistemas dimensionados para o turno de bombeamento cortam de 80% a 100% do custo de energia da irrigação — e dispensam a extensão de rede em áreas distantes.',
        detalheTecnico: [
          'O projeto parte da vazão, mancal e horas de bombeamento: dimensiona-se o conjunto motobomba com inversor solar ou sistema híbrido (solar + rede/gerador para dias críticos). Em áreas sem rede, sistemas isolados com BESS ou acionamento direto CC eliminam o custo de extensão da distribuidora — que frequentemente supera o da própria usina.',
          'Bombas com inversor de frequência permitem regular vazão conforme a irradiação ao longo do dia.',
        ],
        ctaNota: 'Projetos de bombeamento solar off-grid e híbrido',
        ctaTexto: 'Dimensionar solar para minha irrigação',
        ctaHref: '/#contato',
      },
      {
        id: 'agro-q2',
        numero: 'Q2',
        pergunta: 'Que tamanho de sistema uma fazenda precisa?',
        respostaRapida:
          'Depende do consumo agregado: sede, bombeamento, resfriamento do leite, secadores, cercas elétricas, freezer. Sistemas rurais vão de 10 kWp (sede + bombas pequenas) a centenas de kWp (grãos, suinocultura, avicultura). A fatura rural e o mapa de consumo dos equipamentos definem o projeto.',
        detalheTecnico: [
          'Particularidades do rural: padrão de entrada geralmente mais robusto (trifásico), grandes extensões de cabo até os pontos de consumo (perda por queda de tensão a considerar), distância até a subestação da distribuidora e estruturas em solo — que dispensam obra no telhado e facilitam limpeza.',
          'O enquadramento rural (subclasse da ANEEL) impacta tarifa e compensação; a análise regulatória faz parte do projeto.',
        ],
      },
      {
        id: 'agro-q3',
        numero: 'Q3',
        pergunta: 'Sistema solar no campo aguenta o ambiente rural?',
        respostaRapida:
          'Sim, com projeto adequado: módulos com vidro temperado resistem a granizo e vento, estruturas em solo com fundação profunda, cabeamento protegido contra roedores e aterramento rigoroso contra descargas. O campo tem alta incidência de raios — o SPDA (proteção contra descargas) é parte obrigatória do projeto, não opcional.',
        detalheTecnico: [
          'Especificações rurais: módulos de alta resistência mecânica, estruturas galvanizadas com fundação, conduítes e canaletas selados, DPS (protetores de surto) em todos os níveis e malha de aterramento dimensionada.',
          'Poeira e resíduo de pulverização exigem plano de limpeza mais frequente. Em usinas em solo, o controle de vegetação faz parte do O&M — mato alto gera sombreamento e risco de incêndio.',
        ],
      },
      {
        id: 'agro-q4',
        numero: 'Q4',
        pergunta: 'Bateria faz sentido na fazenda?',
        respostaRapida:
          'Sim, principalmente onde a rede é fraca ou instável: bombeamento noturno, câmaras frias, ordenha e benfeitorias críticas. Com BESS, a fazenda ganha autonomia em quedas de energia — frequentes no rural — e evita perdas em laticínios, aves e suínos, onde uma parada de refrigeração custa caro.',
        detalheTecnico: [
          'No rural, o BESS resolve dois problemas ao mesmo tempo: backup de cargas críticas (resfriamento, ordenha, câmaras) e aproveitamento noturno da geração diurna. Sistemas híbridos solar+BESS+gerador criam micro-redes para sedes e confinamentos.',
          'O dimensionamento segue o mesmo princípio: mapear cargas críticas em kW, autonomia em kWh e integração com a geração. A queda de rede rural é regra, não exceção — o BESS deixa de ser luxo.',
        ],
        ctaNota: 'Micro-redes com proteção de cargas críticas agro',
        ctaTexto: 'Avaliar backup para minha fazenda',
        ctaHref: '/baterias',
      },
      {
        id: 'agro-q5',
        numero: 'Q5',
        pergunta: 'Existe financiamento e incentivo específico para o rural?',
        respostaRapida:
          'Sim: linhas de crédito rural (como as do Plano Safra com taxas diferenciadas para energia renovável) e o enquadramento rural na tarifa, que já é mais barata. Muitos projetos rurais se viabilizam com financiamento cuja parcela é menor que a economia mensal — caixa positivo desde o primeiro mês.',
        detalheTecnico: [
          'As linhas de crédito para energias renováveis no crédito rural oferecem taxas subsidiadas e prazos longos; a documentação agro (CAR, ITR, comprovantes) é pré-requisito.',
          'No enquadramento regulatório, a subclasse rural tem tarifa TUSD reduzida, o que muda o cálculo de economia — a simulação precisa usar a tarifa rural real. A Delfos estrutura a proposta com as premissas corretas do agro.',
        ],
      },
    ],
  },

  condominios: {
    segmentoId: 'condominios',
    segmentoNome: 'Condomínios',
    descricao:
      'Áreas comuns, infraestrutura de recarga veicular (Secovi), backup de bombas e suporte jurídico a assembleias.',
    itens: [
      {
        id: 'cond-q1',
        numero: 'Q1',
        pergunta: 'Como funciona energia solar num condomínio?',
        respostaRapida:
          'A usina no telhado do condomínio gera e os créditos abatem a conta das áreas comuns (bombas, elevadores, iluminação) — o uso mais direto, que reduz a cota do condômino. Para abater também as unidades individuais, o condomínio ou grupo de moradores pode instalar usina remota e alocar créditos às unidades.',
        detalheTecnico: [
          'Dois modelos: (1) autoconsumo no local — geração abate as áreas comuns, decisão da assembleia, payback geralmente de 3 a 5 anos; (2) autoconsumo remoto — usina em área própria ou usina de assinatura com créditos alocados às unidades individuais ou ao condomínio, sem obra no prédio. A análise parte da conta de áreas comuns e do rateio atual.',
          'O condomínio que gera valoriza o m² e reduz despesa recorrente — argumento forte na venda e locação de unidades.',
        ],
        ctaNota: 'Estudo para redução da cota condominial mensal',
        ctaTexto: 'Estudar solar para meu condomínio',
        ctaHref: '/#contato',
      },
      {
        id: 'cond-q2',
        numero: 'Q2',
        pergunta: 'Como instalar carregadores para veículos elétricos no condomínio?',
        respostaRapida:
          'Com um plano de infraestrutura: avaliação da capacidade elétrica, circuitos dedicados, medição individualizada e regras de uso aprovadas em assembleia. O guia do setor (Secovi) recomenda não usar tomadas comuns — carregador dedicado com proteções é obrigatório para segurança.',
        detalheTecnico: [
          'O projeto define: quantos pontos agora e quantos vão esperar (infraestrutura para futuro), gestão de carga dinâmica (balanceamento para não estourar o padrão), medição e cobrança (medidor individual ou rateio) e regras de assembleia.',
          'Modelos de operação: condomínio instala e cobra custo, operadora parceira instala e cobra por uso, ou modelo misto. Quem faz o plano hoje evita o cabo de guerra de vagas amanhã.',
        ],
        ctaNota: 'Plano diretor elétrico e balanceamento de carga',
        ctaTexto: 'Avaliar meu condomínio para recarga',
        ctaHref: '/recarga',
      },
      {
        id: 'cond-q3',
        numero: 'Q3',
        pergunta: 'Bateria (BESS) no condomínio: faz sentido?',
        respostaRapida:
          "Sim, para dois usos: backup de áreas comuns críticas (bombas d'água, elevadores, iluminação de emergência, portaria) e consumo noturno da geração solar do telhado. Em condomínios com bombas sem gerador, um BESS evita o drama de prédio sem água na queda de energia.",
        detalheTecnico: [
          'O BESS condominial dimensiona-se pelas cargas comuns essenciais: bombas (maior carga), elevadores, iluminação, CFTV e portaria. Integrado à usina do telhado, ainda maximiza o autoconsumo — a geração do dia abastece as áreas comuns à noite.',
          'Alternativa mais limpa: substituir o gerador antigo, sem ruído, emissão ou manutenção de motor diesel. A decisão passa pela assembleia, com análise de custo x benefício comparando gerador.',
        ],
        ctaNota: 'Substituição de gerador fóssil por BESS silencioso',
        ctaTexto: 'Simular BESS para áreas comuns',
        ctaHref: '/baterias',
      },
      {
        id: 'cond-q4',
        numero: 'Q4',
        pergunta: 'O condomínio precisa de manutenção na usina?',
        respostaRapida:
          'Sim: limpeza, inspeção e monitoramento — o mesmo plano de O&M de qualquer usina. Muitos condomínios terceirizam: um contrato de O&M com relatórios mensais mantém o sistema performando pelos 25+ anos e dá transparência ao síndico na prestação de contas.',
        detalheTecnico: [
          'O O&M condominial inclui: monitoramento remoto com alertas, limpeza periódica, inspeção de conexões e termografia anual, gestão da garantia do inversor (componente crítico) e relatório mensal de geração x economia para aprovação em assembleia.',
          'Como a economia do O&M é rateada entre condôminos, a transparência dos relatórios é parte do serviço — síndico que demonstra economia tem assembleia tranquila.',
        ],
      },
      {
        id: 'cond-q5',
        numero: 'Q5',
        pergunta: 'Quem decide e como aprovar o investimento na assembleia?',
        respostaRapida:
          'A instalação de usina, BESS ou infraestrutura de recarga é obra em área comum: exige aprovação em assembleia conforme o quórum da convenção. O caminho eficiente: apresentar estudo técnico com economia projetada, payback e comparação de modelos (investimento próprio x assinatura) — números convencem mais que discurso.',
        detalheTecnico: [
          'Kit para a assembleia: estudo de viabilidade com a fatura atual, projeto preliminar, comparativo de modelos (CAPEX x assinatura de energia x PPP com operadora de recarga), análise jurídica do regulamento e cronograma.',
          'Modelos sem investimento (assinatura ou operadora que instala e cobra por uso) reduzem a barreira da aprovação — o condomínio aprova a operação, não a despesa. A Delfos prepara o material completo para a assembleia.',
        ],
        ctaNota: 'Material explicativo para conselho e condôminos',
        ctaTexto: 'Quero o kit de assembleia',
        ctaHref: '/#contato',
      },
    ],
  },

  investidores: {
    segmentoId: 'investidores',
    segmentoNome: 'Investidores e Usinas',
    descricao:
      'Geração Centralizada, GD remota, Mercado Livre (ACL), modelagem de TIR, Fio B e contratos de O&M.',
    itens: [
      {
        id: 'inv-q1',
        numero: 'Q1',
        pergunta: 'Investir em usina solar: quanto rende?',
        respostaRapida:
          'Usinas de venda de energia ou leasing de área operam com retornos tipicamente de 12% a 18% ao ano, com contratos de 10 a 25 anos e previsibilidade alta — o sol não flutua como a bolsa. O retorno exato depende do enquadramento (ACL ou SCEE), do custo de implantação e do modelo de comercialização.',
        detalheTecnico: [
          'Modelos de investimento: usina própria vendendo energia no mercado livre (ACL), usina de geração distribuída alocando créditos a consumidores (modelo de assinatura), leasing de telhado/área para terceiros instalarem, ou participação em carteira de usinas. As variáveis do retorno: capex por kWp, tarifa/contrato de venda, degradação (0,4-0,5%/ano), O&M e custo de capital.',
          'O risco regulatório (Fio B progressivo) recai sobre modelos de assinatura — a análise regulatória antecede a análise financeira.',
        ],
        ctaNota: 'Valuation, TIR e modelagem financeira completa',
        ctaTexto: 'Análise de investimento em usina',
        ctaHref: '/#contato',
      },
      {
        id: 'inv-q2',
        numero: 'Q2',
        pergunta: 'Compro o equipamento ou contrato com O&M incluso?',
        respostaRapida:
          'Para investidor, a resposta é quase sempre: usina com O&M contratado desde o dia 1. O O&M preserva o Performance Ratio, gerencia garantias e protege o fluxo de caixa. Uma usina sem O&M degradando 5% invisíveis numa carteira de 500 kWp representa perda de receita que paga várias mensalidades do contrato.',
        detalheTecnico: [
          'O O&M de investidor inclui: monitoramento 24/7 com KPIs (PR, disponibilidade, faturamento), termografia semestral, limpeza por análise de perda, gestão de garantias e de sinistros com seguradoras, e relatórios para o investidor/instituição financiadora.',
          'Bancos e funds exigem contrato de O&M como condição de crédito — é padrão de mercado. SLA de atendimento e sobressalentes locais são diferenciais que protegem a receita.',
        ],
        ctaNota: 'Gestão de ativos fotovoltaicos com SLA rigoroso',
        ctaTexto: 'Proposta de O&M para minha usina',
        ctaHref: '/manutencao',
      },
      {
        id: 'inv-q3',
        numero: 'Q3',
        pergunta: 'Onde posso instalar a usina: telhado, solo ou leasing?',
        respostaRapida:
          'As três opções valem — o que muda é o capex e o risco. Solo próprio: máximo controle, custo de infraestrutura maior. Telhado de terceiros (leasing): capex menor e aluguel como custo. A escolha considera área disponível, distância ao ponto de conexão, capacidade da rede da distribuidora e o modelo de negócio.',
        detalheTecnico: [
          'Critérios técnicos de sítio: irradiância local, disponibilidade de área (1 MWp ≈ 2 a 3 hectares em solo ou 5.000-6.000 m² de telhado), distância e capacidade do ponto de conexão (o gargalo nº 1 de projetos), estudo de impacto ambiental e licenças.',
          'Para leasing de telhados industriais e galpões, o contrato define aluguel, prazo e condições de acesso. A viabilidade de conexão com a distribuidora deve ser verificada antes de qualquer aporte — é onde muitos projetos morrem.',
        ],
      },
      {
        id: 'inv-q4',
        numero: 'Q4',
        pergunta: 'Como funciona a venda de energia e a regulação hoje?',
        respostaRapida:
          'Dois caminhos: mercado cativo (SCEE — créditos compensados com consumidores) ou mercado livre (ACL — contratos de compra e venda de energia com preços negociados). A Lei 14.300/2022 reformulou a geração distribuída com a cobrança progressiva do Fio B — quem já opera ou entra agora precisa de modelo financeiro atualizado.',
        detalheTecnico: [
          'No SCEE, usinas alocam créditos a unidades consumidoras (modelo de assinatura) — o Fio B progressivo (15% a 90% até 2029) comprime a margem e exige captação de consumidores com boa tarifa.',
          'No ACL, a usina vende energia via CCEAR ou no spot, com requisitos de agente (CCEE), medição para faturamento e gestão de risco de preço. A escolha do modelo define margem, risco e necessidade de estrutura societária própria.',
        ],
        ctaNota: 'Adequação às diretrizes de transição da Lei 14.300',
        ctaTexto: 'Modelar meu projeto com a regulação atual',
        ctaHref: '/#contato',
      },
      {
        id: 'inv-q5',
        numero: 'Q5',
        pergunta: 'Que garantias e seguros uma usina de investimento precisa?',
        respostaRapida:
          'O pacote padrão: garantia de módulos (25-30 anos de performance), garantia de inversor (5-15 anos, extensível), seguro all-risk da usina (roubo, clima, falha elétrica) e contrato de O&M com SLA. Para projetos financiados, adicionam-se as garantias do financiamento e a estrutura de propósito específico (SPE).',
        detalheTecnico: [
          'Seguro all-risk operacional cobre perda de receita (business interruption), evento climático e falha de equipamentos — a apólice deve cobrir o valor de reposição, não o valor contábil. O contrato de O&M deve prever gestão de sinistros e de garantias como serviço incluído.',
          'Degradation warranty dos módulos (ex.: 87% em 30 anos) é o piso de receita do modelo financeiro — exija os certificados e confira a saúde financeira do fabricante.',
        ],
      },
    ],
  },

  'frotas-eletropostos': {
    segmentoId: 'frotas-eletropostos',
    segmentoNome: 'Frotas e Eletropostos',
    descricao:
      'Eletrificação corporativa, recarga inteligente AC/DC, hubs rápidos e acoplamento com solar + baterias.',
    itens: [
      {
        id: 'frota-q1',
        numero: 'Q1',
        pergunta: 'Como eletrificar a frota da minha empresa?',
        respostaRapida:
          'Em etapas: (1) mapear rotas e ciclos de recarga, (2) dimensionar carregadores no pátio (AC para overnight, DC para turnaround), (3) adequar a infraestrutura elétrica e (4) integrar solar+BESS para cortar o custo por km. Empresas que eletrificam com planejamento reduzem 60-80% do custo de energia da frota.',
        detalheTecnico: [
          'A eletrificação começa pelo TCO (custo total de propriedade): elétricos têm capex maior e custo operacional menor — energia, manutenção (sem troca de óleo, menos desgaste de freios). O pátio precisa de: estudo do padrão de entrada (frota grande pode exigir transformador dedicado), gerenciamento de carga inteligente (evitar picos simultâneos), e integração com a geração solar do telhado do galpão.',
          'É o casamento perfeito da transição energética: gera de dia com painéis e carrega à noite sem estresse.',
        ],
        ctaNota: 'Planejamento de TCO e infraestrutura de carregamento',
        ctaTexto: 'Planejar a eletrificação da minha frota',
        ctaHref: '/recarga',
      },
      {
        id: 'frota-q2',
        numero: 'Q2',
        pergunta: 'Carregador AC ou DC para o meu caso?',
        respostaRapida:
          'AC (7,4 a 22 kW) para overnight e períodos longos parado: mais barato, simples, ideal para pátio e condomínio. DC (50 a 350 kW) para recarga rápida em rota ou turnaround: carrega em minutos, mas custa 10-20 vezes mais e exige infraestrutura robusta. A maioria das frotas resolve 90% com AC.',
        detalheTecnico: [
          'A regra: potência do carregador deve casar com o tempo parado. Veículo que fica 8h no pátio: AC 7,4-11 kW resolve. Operação com janelas curtas (logística, aplicativo, rodoviário): DC.',
          'O eletroposto público de DC exige projeto de conexão com a distribuidora, transformador em muitos casos e contrato com redes de recarga para gerar demanda. O conector (CCS2 padrão no Brasil) e a compatibilidade com a frota alvo devem ser verificados no projeto.',
        ],
        ctaNota: 'Dimensionamento de potência conforme janelas logísticas',
        ctaTexto: 'Escolher o carregador certo',
        ctaHref: '/recarga',
      },
      {
        id: 'frota-q3',
        numero: 'Q3',
        pergunta: 'Quanto custa montar um eletroposto?',
        respostaRapida:
          'Um posto AC simples (1-2 carregadores) sai a partir de dezenas de milhares de reais incluindo equipamento, obra elétrica e projeto. Um posto DC de alta potência pode passar de centenas de milhares, pela infraestrutura de conexão. O retorno depende do modelo: uso próprio da frota, venda de recarga, ou aluguel de ponto para operadoras.',
        detalheTecnico: [
          'Composição de custo: carregador (maior item em DC), obra elétrica (transformador, cabos, proteções), projeto e licenças, e tecnologia de gestão (software de pagamento e monitoramento). Modelos de negócio: frota própria (economia x diesel/gasolina), venda de recarga (R$/kWh com margem), publicidade/serviços no ponto de espera, ou leasing para operadora de rede.',
          'O estudo de tráfego e a localização definem a viabilidade — eletroposto é negócio imobiliário antes de ser elétrico.',
        ],
        ctaNota: 'Estudo de payback e retorno por ponto de recarga',
        ctaTexto: 'Viabilizar meu eletroposto',
        ctaHref: '/recarga',
      },
      {
        id: 'frota-q4',
        numero: 'Q4',
        pergunta: 'Como alimentar eletropostos e frota com energia solar?',
        respostaRapida:
          'Com a geração do telhado do galpão + BESS: a solar gera de dia, o BESS armazena o excedente, e a frota carrega à noite com energia própria — custo por km próximo de zero e imunidade a reajuste de tarifa. Sem bateria, a integração funciona via compensação de créditos.',
        detalheTecnico: [
          'O dimensionamento cruza: consumo da frota (kWh/100 km x km/dia), geração disponível (área de telhado), e horário de recarga. Exemplo: um carro que roda 100 km/dia consome ~15 kWh — cerca de 3 módulos solares para neutralizar.',
          'Para frotas, o gerenciador de carga dinâmico distribui a potência disponível entre os veículos conforme prioridade, evitando demanda excessiva. A integração solar+frota é o modelo com payback mais rápido do setor.',
        ],
      },
      {
        id: 'frota-q5',
        numero: 'Q5',
        pergunta: 'Que manutenção os carregadores exigem?',
        respostaRapida:
          'Pouca, mas crítica: inspeção periódica de conectores e cabos (desgaste por manuseio), teste das proteções DR/DPS, atualização de firmware e limpeza. Em eletropostos públicos, o O&M inclui gestão da disponibilidade — posto fora do ar não vende. Contrato de manutenção com SLA é padrão para quem opera recarga.',
        detalheTecnico: [
          'O plano de manutenção de infraestrutura de recarga cobre: inspeção visual e elétrica dos pontos, teste das proteções residuais, aperto de conexões (frouxidão é a falha mais comum), verificação do firmware e do sistema de pagamento.',
          'Em frota, a disponibilidade é prioridade operacional: um carregador parado pode parar a operação — por isso redundância e SLA curto. Monitores com telemetria detectam degradação antes da falha.',
        ],
      },
    ],
  },
}
