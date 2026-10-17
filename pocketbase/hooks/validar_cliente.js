/// <reference path="../pb_data/types.d.ts" />

/**
 * Validação de cadastro de cliente Delfos por telefone ou e-mail.
 * Busca em leads e users de forma segura.
 */
routerAdd('POST', '/backend/v1/validar-cliente', (e) => {
  try {
    const body = e.requestInfo().body || {}
    const termo = (body.termo || body.identificador || '').trim()

    if (!termo) {
      return e.badRequestError('Telefone ou e-mail é obrigatório para validação')
    }

    // Normalizar dígitos de telefone e e-mail
    const digitsOnly = termo.replace(/\D/g, '')
    const isEmail = termo.includes('@') && termo.includes('.')
    const cleanEmail = termo.toLowerCase()

    let clienteEncontrado = null

    // 1. Verificar na coleção de users se há cliente cadastrado
    if (isEmail) {
      try {
        const user = $app.findAuthRecordByEmail('users', cleanEmail)
        clienteEncontrado = {
          nome: user.getString('name') || 'Cliente Delfos',
          email: user.getString('email'),
          origem: 'users',
        }
      } catch (_) {}
    }

    // 2. Verificar na coleção de leads se já existe histórico com esse contato
    if (!clienteEncontrado) {
      try {
        let filter = ''
        if (isEmail) {
          filter = `email = '${cleanEmail.replace(/'/g, "\\'")}'`
        } else if (digitsOnly.length >= 8) {
          // Busca pelos últimos 8 dígitos para cobrir variações de DDD/9º dígito
          const last8 = digitsOnly.slice(-8)
          filter = `telefone ~ '${last8}'`
        }

        if (filter) {
          const records = $app.findRecordsByFilter('leads', filter, '-created', 1, 0)
          if (records && records.length > 0) {
            const r = records[0]
            clienteEncontrado = {
              nome: r.getString('nome') || 'Cliente Delfos',
              telefone: r.getString('telefone'),
              email: r.getString('email'),
              cidade: r.getString('cidade'),
              origem: 'leads',
            }
          }
        }
      } catch (_) {}
    }

    if (clienteEncontrado) {
      return e.json(200, {
        valido: true,
        cliente: clienteEncontrado,
        mensagem: `Cadastro localizado: ${clienteEncontrado.nome}. Prioridade total ativada.`,
      })
    }

    return e.json(200, {
      valido: false,
      mensagem: 'Não localizamos este contato na nossa base de clientes com usina instalada.',
    })
  } catch (err) {
    return e.json(500, { error: err.message || 'Erro ao validar cliente' })
  }
})
