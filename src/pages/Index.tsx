import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Metricas from '@/components/Metricas'
import Pilares from '@/components/Pilares'
import Segmentos from '@/components/Segmentos'
import SecaoBess from '@/components/SecaoBess'
import SecaoCarregadores from '@/components/SecaoCarregadores'
import CaseDestaque from '@/components/CaseDestaque'
import TrustSignals from '@/components/TrustSignals'
import Depoimentos from '@/components/Depoimentos'
import Faq from '@/components/Faq'
import ContatoForm from '@/components/ContatoForm'
import Footer from '@/components/Footer'
import WhatsAppFloating from '@/components/WhatsAppFloating'
import MobileCtaBar from '@/components/MobileCtaBar'

export default function Index() {
  // Contextual lead configuration when triggering CTAs across sections
  const [formContext, setFormContext] = useState<{
    necessidade?: string
    origem?: string
    valorConta?: number
    concessionaria?: string
  }>({
    necessidade: 'Energia Solar Fotovoltaica',
    origem: 'home-geral',
  })

  // Dynamic WhatsApp message & section origin
  const [whatsappContext, setWhatsappContext] = useState<{
    message: string
    origem: string
  }>({
    message: 'Olá! Gostaria de uma avaliação com a engenharia da Delfos.',
    origem: 'whatsapp-flutuante',
  })

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Handlers for specific CTAs
  const handleSolicitarAvaliacaoGeral = (context?: {
    origem?: string
    valorConta?: number
    concessionaria?: string
  }) => {
    setFormContext((prev) => ({
      ...prev,
      origem: context?.origem || 'home-hero',
      valorConta: context?.valorConta,
      concessionaria: context?.concessionaria || prev.concessionaria,
    }))
    setWhatsappContext({
      message: 'Olá! Simulei minha conta no site da Delfos e gostaria de uma proposta detalhada.',
      origem: context?.origem || 'hero-simulador',
    })
    scrollToContato()
  }

  const handleSelectPilar = (pilar: string, origem: string) => {
    setFormContext((prev) => ({
      ...prev,
      necessidade: pilar,
      origem,
    }))
    setWhatsappContext({
      message: `Olá! Tenho interesse na solução: ${pilar}. Gostaria de entender a viabilidade.`,
      origem,
    })
    scrollToContato()
  }

  const handleSelectSegmento = (segmento: string, origem: string) => {
    setFormContext((prev) => ({
      ...prev,
      origem,
      necessidade:
        segmento === 'Condomínios'
          ? 'Carregadores Veiculares'
          : segmento === 'Indústria'
            ? 'BESS (Armazenamento)'
            : 'Energia Solar Fotovoltaica',
    }))
    setWhatsappContext({
      message: `Olá! Sou do segmento ${segmento} e gostaria de falar com o engenheiro responsável.`,
      origem,
    })
    scrollToContato()
  }

  const handleSolicitarViabilidadeBess = () => {
    setFormContext((prev) => ({
      ...prev,
      necessidade: 'BESS (Armazenamento)',
      origem: 'secao-dark-bess',
    }))
    setWhatsappContext({
      message: 'Olá! Gostaria de um estudo de viabilidade para sistemas de armazenamento BESS.',
      origem: 'secao-dark-bess',
    })
    scrollToContato()
  }

  const handleSolicitarVistoriaCarregadores = () => {
    setFormContext((prev) => ({
      ...prev,
      necessidade: 'Carregadores Veiculares',
      origem: 'secao-dark-carregadores',
    }))
    setWhatsappContext({
      message: 'Olá! Gostaria de solicitar uma vistoria técnica para recarga veicular / DLM.',
      origem: 'secao-dark-carregadores',
    })
    scrollToContato()
  }

  const handleCaseSolicitar = () => {
    setFormContext((prev) => ({
      ...prev,
      necessidade: 'Energia Solar Fotovoltaica',
      origem: 'case-destaque-indra',
    }))
    setWhatsappContext({
      message:
        'Olá! Vi o case da Indra de 9,75 kWp no site da Delfos e gostaria de um projeto semelhante.',
      origem: 'case-destaque-indra',
    })
    scrollToContato()
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      {/* 1. Header Fixo Global com Novo Menu e CTA Desktop */}
      <Header
        onSolicitarAvaliacao={() => handleSolicitarAvaliacaoGeral({ origem: 'header-menu-cta' })}
      />

      <main className="flex-1">
        {/* Seção 1: Hero com Novo Posicionamento + Calculadora de Economia */}
        <Hero onSolicitarAvaliacao={handleSolicitarAvaliacaoGeral} />

        {/* Seção 2: Métricas Animadas Verificáveis */}
        <Metricas />

        {/* Seção 3: Os 4 Pilares em Cards Dedicados */}
        <Pilares onSelectPilar={handleSelectPilar} />

        {/* Seção 4: Atalhos de Segmentos (Portas de Entrada) */}
        <Segmentos onSelectSegmento={handleSelectSegmento} />

        {/* Seção 8A: Seção DARK estilo Tesla para BESS */}
        <SecaoBess onSolicitarViabilidade={handleSolicitarViabilidadeBess} />

        {/* Seção 8B: Seção DARK estilo Tesla para Carregadores Veiculares */}
        <SecaoCarregadores onSolicitarVistoria={handleSolicitarVistoriaCarregadores} />

        {/* Seção 5: Projeto em Destaque (Case Completo Indra 9,75 kWp) */}
        <CaseDestaque onSolicitarProjeto={handleCaseSolicitar} />

        {/* Barra de Trust Signals (CREA, Homologação, Tier 1, Avaliação Google) */}
        <TrustSignals />

        {/* Seção 6: Depoimentos Reais de Clientes */}
        <Depoimentos />

        {/* Seção 7: FAQ Didático Acordeão (kWh, inversor, ROI, BESS, etc.) */}
        <Faq />

        {/* Formulário em 2 Etapas com Barra de Progresso e Origem do Lead */}
        <ContatoForm
          initialNecessidade={formContext.necessidade}
          initialOrigem={formContext.origem}
          initialValorConta={formContext.valorConta}
          initialConcessionaria={formContext.concessionaria}
        />
      </main>

      {/* Rodapé Institucional com Diferenciação de Marca */}
      <Footer />

      {/* Botão WhatsApp Flutuante com Mensagem Pré-preenchida Contextual */}
      <WhatsAppFloating
        contextMessage={whatsappContext.message}
        origemSecao={whatsappContext.origem}
      />

      {/* Barra Fixa Mobile com Botão CTA "Solicitar avaliação" */}
      <MobileCtaBar
        onSolicitarAvaliacao={() => handleSolicitarAvaliacaoGeral({ origem: 'mobile-bar-cta' })}
      />
    </div>
  )
}
