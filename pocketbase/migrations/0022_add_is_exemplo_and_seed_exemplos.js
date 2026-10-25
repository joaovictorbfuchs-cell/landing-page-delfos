migrate(
  (app) => {
    const casesCollection = app.findCollectionByNameOrId('cases')

    // 1. Adicionar campo booleano is_exemplo (opcional, false por padrão)
    if (!casesCollection.fields.getByName('is_exemplo')) {
      casesCollection.fields.add(
        new BoolField({
          name: 'is_exemplo',
          required: false,
        }),
      )
      app.save(casesCollection)
    }

    // 2. Os 8 cases ilustrativos com is_exemplo = true
    const casesExemplos = [
      {
        titulo: 'Condomínio Residencial Horizontal — 65 kWp (Exemplo de aplicação)',
        slug: 'exemplo-condominio-rateio-solar-65-kwp',
        cliente: 'Exemplo de aplicação ilustrativo (Condomínio Horizontal)',
        setor: 'Condomínios',
        solucao: 'Energia Solar (EPC)',
        local: 'Região Norte / RS',
        escopo: '65,0 kWp Usina Solar Condominial com Rateio de Autoconsumo Remoto',
        descricao:
          'Custos elevados com iluminação perimetral de vias internas, portaria blindada, bombas de piscinas coletivas e sede social, pressionando a cota mensal dos condôminos.',
        solucao_tecnica:
          'Projeto em cobertura de salão de festas e garagens de apoio com inversores de alta eficiência, quadro de medição bidirecional e modelagem de rateio entre a conta comum e áreas recreativas.',
        resultado:
          'Alívio estimado de R$ 7.200,00 mensais no caixa do condomínio, evitando reajustes de taxa condominial e financiando melhorias de segurança.',
        resultado_valor: 'R$ 7.200/mês',
        resultado_label: 'Economia média estimada nas áreas comuns',
        potencia_capacidade: '65,0 kWp',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
      {
        titulo: 'Condomínio Corporativo & Salas Médicas — BESS 40 kWh (Exemplo de aplicação)',
        slug: 'exemplo-condominio-comercial-bess-portaria-40-kwh',
        cliente: 'Exemplo de aplicação ilustrativo (Edifício Comercial)',
        setor: 'Condomínios',
        solucao: 'BESS (Armazenamento)',
        local: 'Erechim / RS',
        escopo: 'BESS 40 kWh / 30 kW com Comutação Ininterrupta (< 20ms) para Cargas Essenciais',
        descricao:
          'Oscilações e quedas momentâneas de rede deixavam elevadores travados entre andares e desativavam catracas eletrônicas e portaria digital em horário de alto fluxo comercial.',
        solucao_tecnica:
          'Banco de baterias de Lítio Ferro Fosfato (LiFePO4) integrado ao quadro de emergência do edifício, mantendo elevadores de serviço, controle de acesso, bombas de pressurização e iluminação de rotas de fuga.',
        resultado:
          'Continuidade 100% autônoma para elevadores e portaria eletrônica por até 3 horas de blecaute sem fumaça ou ruído de geradores a diesel.',
        resultado_valor: '< 20ms',
        resultado_label: 'Tempo de reversão em apagões da concessionária',
        potencia_capacidade: '40 kWh BESS',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
      {
        titulo:
          'Residência com Sistema Solar Híbrido & BESS — 10 kWp + 15 kWh (Exemplo de aplicação)',
        slug: 'exemplo-residencia-solar-bess-hibrido-10-kwp',
        cliente: 'Exemplo de aplicação ilustrativo (Residência Unifamiliar)',
        setor: 'Residências',
        solucao: 'BESS (Armazenamento)',
        local: 'Erechim / RS',
        escopo: '10 kWp Solar Fotovoltaico + Sistema de Baterias BESS Residencial 15 kWh',
        descricao:
          'Família com rotina de home office integral e histórico de quedas de luz frequentes após temporais de verão, paralisando computadores, geladeira e climatização.',
        solucao_tecnica:
          'Arranjo solar em telhado cerâmico com inversor híbrido inteligente e bateria modular de lítio de baixa tensão, programada para reserva de emergência e autoconsumo noturno.',
        resultado:
          'Redução da fatura mensal para taxa de disponibilidade e até 18 horas de autonomia em eletrodomésticos essenciais e internet durante apagões da rede externa.',
        resultado_valor: 'Até 92%',
        resultado_label: 'Economia na fatura + backup ininterrupto',
        potencia_capacidade: '10 kWp + 15 kWh',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
      {
        titulo:
          'Residência com Energia Solar & Carregador Wallbox — 8,2 kWp (Exemplo de aplicação)',
        slug: 'exemplo-residencia-carregador-solar-8-kwp',
        cliente: 'Exemplo de aplicação ilustrativo (Garagem Residencial Solar)',
        setor: 'Residências',
        solucao: 'Carregadores Veiculares',
        local: 'Alto Uruguai / RS',
        escopo: '8,2 kWp Gerador Solar Fotovoltaico + Wallbox Inteligente 7,4 kW AC',
        descricao:
          'Aquisição de veículo 100% elétrico com consumo elevado na recarga noturna, sobrecarregando a fatura e exigindo segurança na instalação elétrica da garagem.',
        solucao_tecnica:
          'Instalação solar dimensionada para absorver os quilômetros rodados do veículo elétrico, quadro de proteção dedicado NBR 5410 com DR Tipo B e estação de recarga com comunicação Wi-Fi.',
        resultado:
          'Abastecimento 100% limpo gerado no próprio telhado residencial, substituindo gastos mensais de mais de R$ 900 em gasolina por eletricidade solar própria.',
        resultado_valor: 'R$ 0,00/km',
        resultado_label: 'Custo marginal de combustível solar',
        potencia_capacidade: '8,2 kWp + Wallbox',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
      {
        titulo: 'Usina de Solo para Geração Distribuída — 500 kWp (Exemplo de aplicação)',
        slug: 'exemplo-usina-solo-gd-investidor-500-kwp',
        cliente: 'Exemplo de aplicação ilustrativo (Investidor GD / Lei 14.300)',
        setor: 'Investidores e Usinas',
        solucao: 'Energia Solar (EPC)',
        local: 'Região Norte / RS',
        escopo: '500 kWp Usina Fotovoltaica de Solo em Terreno Rápido + Subestação 500 kVA',
        descricao:
          'Investidor pessoa física buscando diversificação de carteira imobiliária com renda passiva previsível através da locação de cotas de usina solar sob o marco legal da Lei 14.300/2022.',
        solucao_tecnica:
          'Engenharia completa: terraplanagem, estruturas monoposte de alta durabilidade, módulos bifaciais de alta potência, cabeamento em média tensão e telemetria solarimétrica calibrada.',
        resultado:
          'Geração estimada de ~720.000 kWh/ano voltada à locação para estabelecimentos comerciais do Grupo B, garantindo fluxo mensal previsível de aluguel de créditos energéticos.',
        resultado_valor: 'TIR ~22,5% a.a.',
        resultado_label: 'Taxa Interna de Retorno estimada em modelo GD',
        potencia_capacidade: '500 kWp Solo',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
      {
        titulo: 'Auditoria O&M & Recomissionamento de Usina — 250 kWp (Exemplo de aplicação)',
        slug: 'exemplo-usina-recuperacao-om-termografia-250-kwp',
        cliente: 'Exemplo de aplicação ilustrativo (Investidor / Ativo em Operação)',
        setor: 'Investidores e Usinas',
        solucao: 'O&M e Monitoramento',
        local: 'Norte Gaúcho / RS',
        escopo:
          'Auditoria Elétrica Completa + Termografia Aérea por Drone + Reconfiguração de Strings',
        descricao:
          'Usina de solo com queda crônica de faturamento e geração 18% abaixo do projetado, sem suporte do instalador original e com falhas de comunicação nos inversores.',
        solucao_tecnica:
          'Voo com câmera termográfica radiométrica identificando pontos quentes em células, substituição de conectores oxidados, lavagem robotizada e repavimentação de canaletas de drenagem.',
        resultado:
          'Recuperação do Performance Ratio da usina de 69% para 83%, gerando retorno imediato do investimento na manutenção corretiva em menos de 4 meses.',
        resultado_valor: '+19,2%',
        resultado_label: 'Ganho comprovado de geração pós-intervenção',
        potencia_capacidade: '250 kWp O&M',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
      {
        titulo: 'Hub de Recarga para Frota de Distribuição — 12 Vagas (Exemplo de aplicação)',
        slug: 'exemplo-frota-entrega-urbana-carregadores-ac-dc',
        cliente: 'Exemplo de aplicação ilustrativo (Transportadora / Entrega Urbana)',
        setor: 'Frotas e Eletropostos',
        solucao: 'Carregadores Veiculares',
        local: 'Polo Logístico RS',
        escopo:
          '1 Carregador Rápido DC 60 kW + 8 Wallboxes Inteligentes 11 kW AC + Gestão Dinâmica DLM',
        descricao:
          'Empresa de logística urbana convertendo frota de furgões para veículos elétricos sem capacidade de alimentar 12 veículos simultâneos na entrada de energia existente.',
        solucao_tecnica:
          'Infraestrutura em eletrocalha blindada com balanceamento dinâmico de carga entre os veículos, priorizando recargas rápidas para rotas de emergência e recargas lentas noturnas.',
        resultado:
          'Redução drástica do custo operacional por quilômetro rodado e zero sobrecarga no transformador da garagem durante o horário de pico.',
        resultado_valor: '68% menor',
        resultado_label: 'Custo de abastecimento vs. diesel equivalente',
        potencia_capacidade: '1x DC 60 kW + 8x AC 11 kW',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
      {
        titulo:
          'Eletroposto Comercial em Rodovia — 120 kW DC + Solar Carport (Exemplo de aplicação)',
        slug: 'exemplo-eletroposto-rodoviario-solar-fast-charge-120-kw',
        cliente: 'Exemplo de aplicação ilustrativo (Posto de Serviços Rodoviário)',
        setor: 'Frotas e Eletropostos',
        solucao: 'Carregadores Veiculares',
        local: 'Corredor Rodoviário Norte / RS',
        escopo:
          'Estação DC Fast Charger 120 kW (2 conectores CCS2) + Carport Solar 45 kWp para Cobertura',
        descricao:
          'Posto de combustíveis rodoviário necessitando atrair motoristas de veículos elétricos e híbridos em viagem, oferecendo recarga ultrarrápida de 20 a 30 minutos integrada a conveniência.',
        solucao_tecnica:
          'Subestação rebaixadora dedicada, totem de recarga rápida com pagamento via app e cartão por aproximação, protegido por cobertura com 110 módulos solares fotovoltaicos.',
        resultado:
          'Atendimento de alta rotatividade com geração solar própria suprindo mais de 35% do consumo da estação e aumento de consumo na loja de conveniência.',
        resultado_valor: '25 min',
        resultado_label: 'Tempo médio para 80% de carga da bateria',
        potencia_capacidade: '120 kW DC + 45 kWp Solar',
        data_entrega: 'Engenharia de Aplicação Delfos',
        status: 'publicado',
        destaque: false,
        is_exemplo: true,
      },
    ]

    for (let i = 0; i < casesExemplos.length; i++) {
      const c = casesExemplos[i]
      try {
        const existing = app.findFirstRecordByData('cases', 'slug', c.slug)
        // Se já existe, garante que is_exemplo está marcado como true
        existing.set('is_exemplo', true)
        app.save(existing)
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
        record.set('destaque', c.destaque)
        record.set('is_exemplo', c.is_exemplo)
        app.save(record)
      }
    }
  },
  (app) => {
    const slugs = [
      'exemplo-condominio-rateio-solar-65-kwp',
      'exemplo-condominio-comercial-bess-portaria-40-kwh',
      'exemplo-residencia-solar-bess-hibrido-10-kwp',
      'exemplo-residencia-carregador-solar-8-kwp',
      'exemplo-usina-solo-gd-investidor-500-kwp',
      'exemplo-usina-recuperacao-om-termografia-250-kwp',
      'exemplo-frota-entrega-urbana-carregadores-ac-dc',
      'exemplo-eletroposto-rodoviario-solar-fast-charge-120-kw',
    ]

    for (let i = 0; i < slugs.length; i++) {
      try {
        const record = app.findFirstRecordByData('cases', 'slug', slugs[i])
        app.delete(record)
      } catch (_) {}
    }
  },
)
