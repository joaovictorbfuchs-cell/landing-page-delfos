/// <reference name="../pb_data/types.d.ts" />

/**
 * Registro de hook mantido por consistência com o deploy (o pipeline valida a
 * existência do arquivo). Não expõe nenhuma rota: testes confirmaram que, neste
 * host, hooks routerAdd não têm precedência sobre o fallback do SPA — o prerender
 * de meta tags por rota não é viável por aqui (ver relatório de auditoria SEO).
 */
export {}
