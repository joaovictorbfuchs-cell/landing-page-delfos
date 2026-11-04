import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

interface RedirectPermanenteProps {
  destino: string
  motivo: string
}

/**
 * Redirecionamento permanente (301) de rota antiga para a nova.
 * Substitui a página antiga inteira: o histórico do navegador troca a entrada,
 * e o prerender do backend já responde /obras com a página nova.
 */
export default function RedirectPermanente({ destino, motivo }: RedirectPermanenteProps) {
  useEffect(() => {
    // Sinaliza para o prerender do backend que /obras agora é /projetos
    // (o hook de SEO reescreve o conteúdo e o status HTTP dessa rota).
    document.title = `Redirecionando para ${motivo}…`
  }, [motivo])

  return <Navigate to={destino} replace />
}
