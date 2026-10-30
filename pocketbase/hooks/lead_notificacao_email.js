/// <reference path="../pb_data/types.d.ts" />

/**
 * Notificação automática por E-MAIL para novos leads no site da Delfos Engenharia.
 * Disparado apenas na criação de registro na coleção 'leads' (idempotente — não dispara em update).
 * Destinatário fixo: joao@delfosengenharia.com.br
 * Se o envio falhar, não impede a gravação do lead (registrado em log).
 */
onRecordAfterCreateSuccess((e) => {
  try {
    const record = e.record
    if (!record) {
      return e.next()
    }

    const leadId = record.id || ''
    const nome = record.getString('nome') || 'Nome não informado'
    const telefone = record.getString('telefone') || 'Não informado'
    const email = record.getString('email') || 'Não informado'
    const cidade = record.getString('cidade') || 'Não informada'
    const tipoImovel = record.getString('tipo_imovel') || ''
    const necessidade = record.getString('necessidade') || ''
    const tipoLigacao = record.getString('tipo_ligacao') || 'Não informado'
    const concessionaria = record.getString('concessionaria') || 'Não informada'
    const jaPossuiSolar = record.getString('ja_possui_solar') || 'Não informado'
    const posseArea = record.getString('posse_area') || 'Não informado'
    const origem = record.getString('origem') || 'site-direto'
    const mensagem = record.getString('mensagem') || ''
    const arquivoConta = record.getString('arquivo_conta') || ''

    // Valor da conta ou consumo mensal
    let valorContaFormatado = 'Não informado'
    const valorConta = record.getFloat('valor_conta')
    const consumoMensal = record.getFloat('consumo_mensal')
    if (valorConta && valorConta > 0) {
      valorContaFormatado = `R$ ${valorConta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mês`
    } else if (consumoMensal && consumoMensal > 0) {
      valorContaFormatado = `R$ ${consumoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mês (consumo)`
    }

    // Data/hora da criação
    let dataHoraFormatada = ''
    try {
      const createdStr = record.getString('created')
      if (createdStr) {
        dataHoraFormatada = new Date(createdStr).toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
        })
      }
    } catch (_) {
      dataHoraFormatada = record.getString('created') || 'Agora'
    }

    // URL do painel admin e arquivo
    const siteUrl = ($os.getenv('SITE_URL') || 'https://delfos.eng.br').replace(/\/+$/, '')
    const adminUrl = `${siteUrl}/admin`

    const leadFileUrl = arquivoConta
      ? `${($os.getenv('PB_INSTANCE_URL') || '').replace(/\/+$/, '')}/api/files/leads/${leadId}/${arquivoConta}`
      : ''

    const emailDestino = 'joao@delfosengenharia.com.br'
    const assunto = `Novo lead — [${origem}] — ${nome}`

    const imovelPilarDesc = [tipoImovel, necessidade].filter(Boolean).join(' • ') || 'Geral'

    // HTML comercial, claro e responsivo
    const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${assunto}</title>
</head>
<body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#F0F4F8;color:#1E293B;">
  <div style="max-width:620px;margin:0 auto;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #E2E8F0;">
    
    <!-- Cabeçalho -->
    <div style="background-color:#081B30;padding:24px 28px;border-bottom:3px solid #F59E0B;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#F59E0B;">Delfos Engenharia • Notificação de Lead</span>
      </div>
      <h1 style="margin:8px 0 0 0;font-size:20px;font-weight:800;color:#FFFFFF;line-height:1.3;">
        Novo Lead Recebido pelo Site
      </h1>
      <p style="margin:4px 0 0 0;font-size:13px;color:#94A3B8;">
        Origem: <strong style="color:#FCD34D;">${origem}</strong> &nbsp;•&nbsp; ${dataHoraFormatada}
      </p>
    </div>

    <!-- Conteúdo Principal -->
    <div style="padding:28px;">
      
      <!-- Bloco de Destaque do Cliente -->
      <div style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-left:4px solid #F59E0B;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
        <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#0F172A;">${nome}</h2>
        <div style="font-size:14px;color:#334155;line-height:1.6;">
          <strong>WhatsApp:</strong> <a href="https://wa.me/55${telefone.replace(/\D/g, '')}" style="color:#059669;font-weight:700;text-decoration:none;">${telefone}</a><br>
          <strong>E-mail:</strong> <a href="mailto:${email}" style="color:#0284C7;text-decoration:none;">${email}</a><br>
          <strong>Cidade:</strong> ${cidade}
        </div>
      </div>

      <!-- Tabela de Qualificação Técnica -->
      <h3 style="margin:0 0 12px 0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#64748B;">
        Dados da Solicitação
      </h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.5;margin-bottom:24px;">
        <tbody>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;width:40%;">Tipo / Necessidade:</td>
            <td style="padding:8px 12px;color:#0F172A;font-weight:600;">${imovelPilarDesc}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Valor da Conta de Luz:</td>
            <td style="padding:8px 12px;color:#059669;font-weight:700;">${valorContaFormatado}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Concessionária:</td>
            <td style="padding:8px 12px;color:#0F172A;">${concessionaria}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Tipo de Ligação:</td>
            <td style="padding:8px 12px;color:#0F172A;">${tipoLigacao}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Área Própria?</td>
            <td style="padding:8px 12px;color:#0F172A;">${posseArea}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Já possui energia solar?</td>
            <td style="padding:8px 12px;color:#0F172A;">${jaPossuiSolar}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Origem no Site:</td>
            <td style="padding:8px 12px;color:#0F172A;"><span style="background-color:#E2E8F0;padding:2px 8px;border-radius:4px;font-family:monospace;font-size:12px;">${origem}</span></td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:600;color:#475569;">Fatura em Anexo:</td>
            <td style="padding:8px 12px;color:#0F172A;">
              ${
                arquivoConta
                  ? `<strong style="color:#0284C7;">Sim, arquivo enviado:</strong> ${arquivoConta} <br><a href="${leadFileUrl}" style="display:inline-block;margin-top:4px;color:#0284C7;font-weight:600;text-decoration:underline;">Visualizar fatura anexada</a>`
                  : '<span style="color:#94A3B8;">Nenhum arquivo anexado</span>'
              }
            </td>
          </tr>
        </tbody>
      </table>

      ${
        mensagem
          ? `
      <div style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px;margin-bottom:24px;">
        <strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#64748B;margin-bottom:6px;">Mensagem / Observações do Cliente:</strong>
        <p style="margin:0;font-size:13px;line-height:1.5;color:#334155;white-space:pre-wrap;">${mensagem}</p>
      </div>`
          : ''
      }

      <!-- Botão CTA para o Painel Admin -->
      <div style="text-align:center;margin:32px 0 16px 0;">
        <a href="${adminUrl}" style="display:inline-block;background-color:#F59E0B;color:#081B30;font-size:14px;font-weight:800;text-decoration:none;padding:14px 32px;border-radius:10px;box-shadow:0 2px 6px rgba(245,158,11,0.4);">
          Abrir Painel Admin de Leads →
        </a>
      </div>
      <p style="text-align:center;margin:0;font-size:12px;color:#94A3B8;">
        Ou acesse diretamente: <a href="${adminUrl}" style="color:#64748B;">${adminUrl}</a>
      </p>

    </div>

    <!-- Rodapé -->
    <div style="background-color:#F8FAFC;padding:16px 28px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center;">
      Delfos Engenharia • Erechim/RS • Notificação Automática de Lead
    </div>

  </div>
</body>
</html>
`

    // Texto plano como fallback
    const plainText = `
NOVO LEAD RECEBIDO — DELFOS ENGENHARIA
----------------------------------------
Origem: ${origem}
Data/Hora: ${dataHoraFormatada}

DADOS DO CONTATO:
Nome: ${nome}
Telefone/WhatsApp: ${telefone}
E-mail: ${email}
Cidade: ${cidade}

QUALIFICAÇÃO TÉCNICA:
Tipo / Necessidade: ${imovelPilarDesc}
Valor da Conta: ${valorContaFormatado}
Concessionária: ${concessionaria}
Tipo de Ligação: ${tipoLigacao}
Área Própria: ${posseArea}
Já possui solar: ${jaPossuiSolar}
Origem no Site: ${origem}
Arquivo da Fatura: ${arquivoConta ? `Sim (${arquivoConta})` : 'Não anexado'}
${arquivoConta && leadFileUrl ? `Link direto da fatura: ${leadFileUrl}\n` : ''}
${mensagem ? `Mensagem do Cliente:\n${mensagem}\n` : ''}
Acesse o Painel Admin da Delfos para gerenciar:
${adminUrl}
`

    // Remetente padrão do sistema PocketBase
    const senderAddress =
      $app.settings()?.meta?.senderAddress ||
      'no-reply@landing-page-delfos-engenharia-672ab.internal'
    const senderName = $app.settings()?.meta?.senderName || 'Delfos Engenharia'

    const mailMessage = new MailerMessage({
      from: {
        address: senderAddress,
        name: senderName,
      },
      to: [
        {
          address: emailDestino,
          name: 'João - Delfos Engenharia',
        },
      ],
      subject: assunto,
      html: htmlBody,
      text: plainText,
    })

    // Enviar e-mail usando o cliente transacional do PocketBase
    $app.newMailClient().send(mailMessage)
    console.log(
      `[lead_notificacao_email] E-mail de novo lead enviado com sucesso para ${emailDestino} (lead id: ${leadId})`,
    )
  } catch (err) {
    // Requisito 6: Falha no envio não deve quebrar a gravação do lead
    console.error(
      `[lead_notificacao_email] Falha ao enviar notificação de lead por e-mail: ${err?.message || err}`,
    )
  }

  return e.next()
}, 'leads')
