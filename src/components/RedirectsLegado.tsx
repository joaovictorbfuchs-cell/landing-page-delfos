import { Navigate, useLocation } from 'react-router-dom'

/**
 * Redirecionamentos do site antigo (WordPress em /site/) para o site novo.
 *
 * Mapa completo (92 URLs levantadas do WP real) em:
 * artifacts/mapa-redirecionamentos.md — auditoria/migração SEO de 28/10/2026.
 *
 * Regras:
 * 1. URLs exatas institucionais mapeadas em MAPA_EXATO (sem barra final).
 * 2. Qualquer /site/projetos* → /projetos (a galeria de cases).
 * 3. Qualquer outro /site* → / (home).
 */
const MAPA_EXATO: Record<string, string> = {
  '/site': '/',
  '/site/servicos-energia-solar': '/solucoes/energia-solar',
  '/site/quem-somos': '/sobre',
  '/site/contato': '/',
  '/site/politica-de-privacidade': '/',
  '/site/teste': '/',
  '/site/projetos': '/projetos',
  '/site/projetos/page/2': '/projetos',
  '/site/projetos/feed': '/projetos',
}

export default function RedirectsLegado() {
  const location = useLocation()
  // Normaliza: remove barra final (exceto raiz) para casar com o mapa
  const path = location.pathname.replace(/\/+$/, '') || '/'

  let destino = MAPA_EXATO[path]
  if (!destino) {
    destino = path.startsWith('/site/projetos') ? '/projetos' : '/'
  }

  return <Navigate to={destino} replace />
}
