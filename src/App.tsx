/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Login from './pages/Login'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import SolucaoSolar from './pages/SolucaoSolar'
import SolucaoBess from './pages/SolucaoBess'
import SolucaoOm from './pages/SolucaoOm'
import SolucaoCarregadores from './pages/SolucaoCarregadores'
import ProjetosResultados from './pages/ProjetosResultados'
import Sobre from './pages/Sobre'
import Conteudos from './pages/Conteudos'
import ConteudoPost from './pages/ConteudoPost'
import { FaqPage } from './pages/FaqPage'
import SegmentoResidencias from './pages/segmentos/SegmentoResidencias'
import SegmentoComercio from './pages/segmentos/SegmentoComercio'
import SegmentoIndustria from './pages/segmentos/SegmentoIndustria'
import SegmentoAgronegocio from './pages/segmentos/SegmentoAgronegocio'
import SegmentoCondominios from './pages/segmentos/SegmentoCondominios'
import SegmentoInvestidores from './pages/segmentos/SegmentoInvestidores'
import SegmentoFrotasEletropostos from './pages/segmentos/SegmentoFrotasEletropostos'

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="/conteudos/:slug" element={<ConteudoPost />} />
          <Route path="/faq" element={<FaqPage />} />

          {/* Fase 4: As 7 Páginas de Segmento ("Portas de Entrada") */}
          <Route path="/segmentos/residencias" element={<SegmentoResidencias />} />
          <Route path="/segmentos/comercio-servicos" element={<SegmentoComercio />} />
          <Route path="/segmentos/industria" element={<SegmentoIndustria />} />
          <Route path="/segmentos/agronegocio" element={<SegmentoAgronegocio />} />
          <Route path="/segmentos/condominios" element={<SegmentoCondominios />} />
          <Route path="/segmentos/investidores" element={<SegmentoInvestidores />} />
          <Route path="/segmentos/frotas-eletropostos" element={<SegmentoFrotasEletropostos />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
