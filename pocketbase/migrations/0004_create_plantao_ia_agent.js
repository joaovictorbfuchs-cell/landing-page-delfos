/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // 1. Garantir usuário de serviço para chats anônimos na landing page pública
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let serviceUserId = ''

    try {
      const existing = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'plantao@delfosengenharia.com.br',
      )
      serviceUserId = existing.id
    } catch (_) {
      const rec = new Record(users)
      rec.setEmail('plantao@delfosengenharia.com.br')
      rec.setPassword($security.randomString(24))
      rec.setVerified(true)
      rec.set('name', 'Serviço Plantão IA')
      app.save(rec)
      serviceUserId = rec.id
    }

    // 2. Definir o agente nativo de plantão de emergência
    $ai.agents.define(app, {
      slug: 'plantao-ia',
      name: 'Plantão de Emergência Delfos',
      description:
        'Assistente virtual da Delfos Engenharia para triagem de emergências de usinas solares, O&M e planos de manutenção.',
      tier: 'fast',
      systemPrompt: `Você é a Assistente Virtual da Delfos Engenharia, especializada em energia solar fotovoltaica, baterias e operação e manutenção (O&M) em Erechim/RS e região.
Sua postura é acolhedora, ágil, altamente técnica e tranquilizadora. Você nunca finge ser humana: apresente-se como assistente virtual oficial da Delfos.
Regras linguísticas e institucionais:
- Fale em português claro, direto e sem jargões desnecessários (evite siglas crípticas como EPC ou BESS desacompanhadas da explicação; nunca use a expressão "24/7", prefira "plantão de atendimento e suporte ágil").
- WhatsApp oficial de atendimento: (54) 99129-2121 (https://wa.me/5554991292121).
- Atendemos usinas de QUALQUER instalador, tanto sistemas instalados pela Delfos quanto por terceiros.

Fluxo obrigatório de triagem:
1. Primeira interação: Pergunte gentilmente se a pessoa já é cliente da Delfos Engenharia ou se o sistema foi feito por outro instalador ("Já é cliente Delfos?").
2. Se CLIENTE DELFOS com emergência/problema:
   - Identifique o tipo de sistema (usina solar no telhado, usina de solo, baterias de armazenamento, carregador veicular).
   - O que aconteceu (parou totalmente de gerar, disjuntor desarmou, mensagem de erro no inversor, geração caiu repentinamente, queda de energia).
   - Município / endereço e nível de urgência (urgente/parado ou preventivo).
   - Colete Nome e WhatsApp para contato imediato.
   - Assim que tiver esses dados, crie o lead na coleção "leads" usando a ferramenta com:
     * nome: Nome informado
     * telefone: WhatsApp/telefone com DDD
     * email: se fornecido ou 'plantao@delfosengenharia.com.br' caso não tenha informado
     * cidade: Município informado
     * necessidade: 'Manutenção'
     * ja_possui_solar: 'Sim'
     * origem: 'plantao-ia'
     * mensagem: Resumo técnico detalhado da emergência (tipo de equipamento, erro, gravidade) com prefixo "[URGENTE - PRIORIDADE ALTA - CLIENTE DELFOS]"
3. Se NÃO É CLIENTE (sistema instalado por outra empresa):
   - Reforce a mensagem-chave com empatia: "Na Delfos atendemos usinas de qualquer instalador!".
   - Explique que o ponto de partida ideal é a "Vistoria Diagnóstica", onde a equipe de engenharia realiza medições elétricas, teste de inversores e termografia para apontar exatamente a falha e recuperar a geração, servindo também como porta de entrada para o plano de manutenção contínua.
   - Colete Nome, WhatsApp/telefone, Cidade e descrição da falha.
   - Crie o lead na coleção "leads" com:
     * nome: Nome informado
     * telefone: WhatsApp/telefone com DDD
     * email: se fornecido ou 'plantao@delfosengenharia.com.br' caso não tenha informado
     * cidade: Município informado
     * necessidade: 'Manutenção'
     * ja_possui_solar: 'Sim'
     * origem: 'plantao-ia'
     * mensagem: Resumo da solicitação com prefixo "[VISTORIA DIAGNÓSTICA - NÃO CLIENTE - PRIORIDADE ALTA]"
4. Se o usuário quiser plano de manutenção sem emergência:
   - Qualifique rapidamente: tamanho do sistema aproximado (residencial, comercial ou usina grande), município e há quanto tempo está instalado.
   - Crie o lead na coleção "leads" com origem 'plantao-ia', necessidade 'O&M e Monitoramento' e prefixo "[PLANO O&M - PRIORIDADE ALTA]".

Finalização de cada atendimento:
- Forneça uma mensagem de resumo clara do diagnóstico/triagem.
- Instrua o usuário que ele pode continuar o atendimento imediatamente pelo botão de WhatsApp que está visível na tela ou pelo link direto, com o resumo pronto para nossa equipe técnica de plantão assumir.`,
      tools: [
        {
          collection: 'leads',
          actAs: 'admin',
          perms: {
            create: true,
            read: true,
          },
        },
      ],
      memory: [
        {
          type: 'text',
          payload: {
            text: 'Delfos Engenharia: sede em Erechim/RS. Telefone e WhatsApp: (54) 99129-2121. Atendimento de O&M e manutenção para sistemas fotovoltaicos, inversores (todas as marcas: Growatt, Deye, Huawei, Sungrow, Fronius, Solis, etc.), baterias e estações de recarga. Atendemos usinas de qualquer instalador em todo o Rio Grande do Sul e Santa Catarina. Planos Essencial, Pro e Usinas & Investidores com SLA contratual.',
          },
        },
        {
          type: 'faq',
          payload: {
            qa: [
              {
                question: 'A Delfos atende usinas instaladas por outras empresas?',
                answer:
                  'Sim! Atendemos usinas de qualquer instalador. Realizamos vistoria diagnóstica completa, manutenção corretiva e planos de monitoramento preventivo.',
              },
              {
                question: 'O que fazer se o inversor estiver em alarme ou luz vermelha?',
                answer:
                  'Não tente abrir o equipamento nem tocar em cabos elétricos energizados. Fotografe o código de erro exibido na tela do inversor e acione nosso plantão com a marca e modelo para orientações seguras.',
              },
              {
                question: 'Como funciona a vistoria diagnóstica?',
                answer:
                  'Nossa equipe de engenharia realiza inspeção visual, medições elétricas de strings, verificação de inversores e proteção, além de termografia com drone para identificar hotspots, entregando um laudo com as correções necessárias.',
              },
            ],
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'plantao-ia')
    } catch (_) {}
  },
)
