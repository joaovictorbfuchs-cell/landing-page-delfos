/* 404 Page - exibida quando o usuário acessa uma rota inexistente */
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SeoMeta from '@/components/SeoMeta'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Evita que o soft 404 seja indexado como conteúdo */}
      <SeoMeta
        title="Página não encontrada"
        description="A página que você procura não existe ou foi movida. Conheça as soluções de energia solar da Delfos Engenharia."
        robots="noindex, nofollow"
      />
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-xl text-gray-600 mb-4">
          O endereço que você acessou não existe ou foi movido.
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  )
}

export default NotFound
