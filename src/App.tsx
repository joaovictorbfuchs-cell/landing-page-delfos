/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { initGA } from './lib/analytics'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'

// Code splitting por rota: páginas internas carregam sob demanda,
// reduzindo o bundle inicial (LCP/INP da home).
const Login = lazy(() => import('./pages/Login'))
const Admin = lazy(() => import('./pages/Admin'))
const SolucaoSolar = lazy(() => import('./pages/SolucaoSolar'))
const SolucaoBess = lazy(() => import('./pages/SolucaoBess'))
const SolucaoOm = lazy(() => import('./pages/SolucaoOm'))
const SolucaoCarregadores = lazy(() => import('./pages/SolucaoCarregadores'))
const ProjetosResultados = lazy(() => import('./pages/ProjetosResultados'))
const Sobre = lazy(() => import('./pages/Sobre'))
const Conteudos = lazy(() => import('./pages/Conteudos'))
const ConteudoPost = lazy(() => import('./pages/ConteudoPost'))
const AutorJoaoVictor = lazy(() => import('./pages/AutorJoaoVictor'))
const FaqPage = lazy(() => import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })))
const SegmentoResidencias = lazy(() => import('./pages/segmentos/SegmentoResidencias'))
const SegmentoComercio = lazy(() => import('./pages/segmentos/SegmentoComercio'))
const SegmentoIndustria = lazy(() => import('./pages/segmentos/SegmentoIndustria'))
const SegmentoAgronegocio = lazy(() => import('./pages/segmentos/SegmentoAgronegocio'))
const SegmentoCondominios = lazy(() => import('./pages/segmentos/SegmentoCondominios'))
const SegmentoInvestidores = lazy(() => import('./pages/segmentos/SegmentoInvestidores'))
const SegmentoFrotasEletropostos = lazy(
  () => import('./pages/segmentos/SegmentoFrotasEletropostos'),
)

const App = () => {
  useEffect(() => {
    initGA()
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              {/* As 4 páginas de Solução da Fase 2 */}
              <Route path="/solucoes/energia-solar" element={<SolucaoSolar />} />
              <Route path="/energia-solar" element={<SolucaoSolar />} />
              <Route path="/solucoes/bess" element={<SolucaoBess />} />
              <Route path="/baterias" element={<SolucaoBess />} />
              <Route path="/solucoes/om" element={<SolucaoOm />} />
              <Route path="/manutencao" element={<SolucaoOm />} />
              <Route path="/solucoes/carregadores" element={<SolucaoCarregadores />} />
              <Route path="/recarga" element={<SolucaoCarregadores />} />

              {/* Fase 3: Projetos e Resultados */}
              <Route path="/projetos" element={<ProjetosResultados />} />

              {/* Fase 5: Sobre e Conteúdos / Blog */}
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/conteudos" element={<Conteudos />} />
              <Route
                path="/conteudos/autor/joao-victor-bagetti-fuchs"
                element={<AutorJoaoVictor />}
              />
              <Route path="/conteudos/:slug" element={<ConteudoPost />} />
              <Route path="/faq" element={<FaqPage />} />

              {/* Fase 4: As 7 Páginas de Segmento ("Portas de Entrada") */}
              <Route path="/segmentos/residencias" element={<SegmentoResidencias />} />
              <Route path="/segmentos/comercio-servicos" element={<SegmentoComercio />} />
              <Route path="/segmentos/industria" element={<SegmentoIndustria />} />
              <Route path="/segmentos/agronegocio" element={<SegmentoAgronegocio />} />
              <Route path="/segmentos/condominios" element={<SegmentoCondominios />} />
              <Route path="/segmentos/investidores" element={<SegmentoInvestidores />} />
              <Route
                path="/segmentos/frotas-eletropostos"
                element={<SegmentoFrotasEletropostos />}
              />

              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
