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
          <Route path="/solucoes/bess" element={<SolucaoBess />} />
          <Route path="/solucoes/om" element={<SolucaoOm />} />
          <Route path="/solucoes/carregadores" element={<SolucaoCarregadores />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
