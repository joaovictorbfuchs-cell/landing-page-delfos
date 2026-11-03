/// <reference path="../pb_data/types.d.ts" />

/**
 * Guard do campo 'status' da coleção 'cases'.
 *
 * Bloqueia qualquer ATUALIZAÇÃO via API em que o status muda e a requisição NÃO
 * vem de um usuário autenticado (painel /admin). Assim, mesmo que um seed ou
 * sincronização futura tente regravar 'status' num case existente via API, a
 * operação falha com 403 em vez de sobrescrever a decisão do usuário.
 *
 * - Criação de cases (seeds criando registros novos): não é afetada — este hook
 *   só intercepta update.
 * - Usuário autenticado no /admin (publicar/despublicar): permitido normalmente.
 * - Gravações diretas via $app.save (hooks internos como importar_fotos,
 *   migrations): não passam por hooks de request e continuam livres — a
 *   convenção de NÃO gravar 'status' em registro existente está documentada na
 *   migration 0029 e deve ser seguida por qualquer seed novo.
 *
 * Registro com status_protegido = false (criado depois da 0029 sem marcar o
 * campo) também é blindado por padrão: só usuário autenticado muda status.
 */
onRecordUpdateRequest((e) => {
  const statusAnterior = e.record.original().getString('status')
  const statusNovo = e.record.getString('status')

  if (statusNovo !== statusAnterior) {
    const autenticado = e.auth && e.auth.id !== ''
    if (!autenticado) {
      throw new ForbiddenError(
        'Alteração de status de case é permitida apenas pelo painel admin (usuário autenticado).',
      )
    }
  }

  return e.next()
}, 'cases')
