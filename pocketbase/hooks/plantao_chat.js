/// <reference path="../pb_data/types.d.ts" />

routerAdd('POST', '/backend/v1/plantao-chat', (e) => {
  try {
    const body = e.requestInfo().body || {}
    const message = (body.message || '').trim()

    if (!message) {
      return e.badRequestError('Mensagem é obrigatória')
    }

    // Identificar usuário: autenticado ou o usuário de serviço público do plantão
    let userId = e.auth?.id
    if (!userId) {
      try {
        const serviceUser = $app.findAuthRecordByEmail('users', 'plantao@delfosengenharia.com.br')
        userId = serviceUser.id
      } catch (err) {
        // Fallback para o primeiro usuário existente se necessário
        try {
          const anyUser = $app.findFirstRecordByFilter('users', "id != ''")
          userId = anyUser.id
        } catch (_) {}
      }
    }

    if (!userId) {
      return e.json(500, { error: 'Usuário de plantão não configurado' })
    }

    const conversationId = body.conversation_id || null
    const stream = body.stream === true

    if (stream) {
      const conv = $ai.agent('plantao-ia').getOrCreateConversation({
        user_id: userId,
        id: conversationId,
      })

      const iter = $ai.agent('plantao-ia').chat({
        user_id: userId,
        conversation_id: conv.id,
        message: message,
        stream: true,
      })

      e.response.header().set('Content-Type', 'text/event-stream')
      e.response.header().set('Cache-Control', 'no-cache')
      e.response.header().set('Connection', 'keep-alive')
      e.response.header().set('X-Conversation-Id', conv.id)
      return $response.stream(e, iter)
    }

    const result = $ai.agent('plantao-ia').chat({
      user_id: userId,
      conversation_id: conversationId,
      message: message,
    })

    return e.json(200, {
      conversation_id: result.conversation_id,
      content: result.content,
      citations: result.citations,
      message_id: result.message_id,
    })
  } catch (err) {
    if (typeof SkipAiConfigError !== 'undefined' && err instanceof SkipAiConfigError) {
      return e.json(503, { error: 'Serviço de IA temporariamente indisponível' })
    }
    if (typeof SkipAiAgentsError !== 'undefined' && err instanceof SkipAiAgentsError) {
      const status = err.status || 500
      return e.json(status, {
        error: status >= 500 ? 'Falha na solicitação do assistente' : err.message,
      })
    }
    if (typeof SkipAiError !== 'undefined' && err instanceof SkipAiError) {
      const status = err.status || 502
      return e.json(status, {
        error: status >= 500 ? 'Serviço de IA temporariamente indisponível' : err.message,
      })
    }
    return e.json(500, { error: err.message || 'Erro interno ao processar chat' })
  }
})
