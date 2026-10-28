/// <reference name="../pb_data/types.d.ts" />

/**
 * Probe de diagnóstico para o prerender de meta tags por rota (SEO).
 *
 * O SPA entrega o <head> da home em todas as URLs antes da hidratação React.
 * Para corrigir sem SSR, um hook pode servir o index.html do build com as meta
 * tags trocadas por rota — mas para isso precisa ler o index.html em runtime.
 *
 * Este endpoint (somente leitura, não afeta o app) responde:
 *   GET /__seo_probe → JSON dizendo quais caminhos de index.html existem.
 *
 * Depois do diagnóstico, este arquivo é substituído pelo prerender real
 * (ou removido, se o host não permitir ler o build em runtime).
 */
routerAdd('GET', '/__seo_probe', (e) => {
  const candidatos = [
    'pb_public/index.html',
    'pb_data/index.html',
    'frontend/index.html',
    'dist/index.html',
    'public/index.html',
    'index.html',
  ]
  const resultados = {}
  for (let i = 0; i < candidatos.length; i++) {
    const p = candidatos[i]
    try {
      const conteudo = $os.readFile(p)
      resultados[p] = {
        existe: true,
        bytes: conteudo ? String(conteudo).length : 0,
        temRoot: String(conteudo).indexOf('id="root"') !== -1,
      }
    } catch (err) {
      resultados[p] = { existe: false, erro: String(err && err.message ? err.message : err) }
    }
  }
  return e.json(200, { probe: 'seo-prerender', resultados })
})
