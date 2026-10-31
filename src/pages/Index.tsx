import { useState } from 'react'
import SeoMeta from '@/components/SeoMeta'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Metricas from '@/components/Metricas'
import Pilares from '@/components/Pilares'
import Depoimentos from '@/components/Depoimentos'
import Faq from '@/components/Faq'
import ContatoForm from '@/components/ContatoForm'
import Footer from '@/components/Footer'

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
    tipoLigacao?: string
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-solar-400 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Delfos Energia Solar — Da geração à operação da sua energia"
        description="Integradora de engenharia gaúcha com 12 anos de atuação e nota 4.9 no Google. Simule sua economia e solicite avaliação técnica."
        canonicalPath="/"
        ogImage="/og-image.png"
      />
      {/* 1. Header Fixo Global com Novo Menu e CTA Desktop */}
      <Header
        onSolicitarAvaliacao={() => handleSolicitarAvaliacaoGeral({ origem: 'header-menu-cta' })}
      />

      <main className="flex-1">
        {/* Seção 1: Hero com Novo Posicionamento + Calculadora de Economia */}
        <Hero onSolicitarAvaliacao={handleSolicitarAvaliacaoGeral} />

        {/* Seção 2: Nossos números */}
        <Metricas />

        {/* Seção 3: 4 Soluções simplificadas */}
        <Pilares />

        {/* Seção 4: Depoimentos Reais de Clientes */}
        <Depoimentos />

        {/* Seção 5: FAQ Didático Acordeão (kWh, inversor, ROI, BESS, etc.) */}
        <Faq />

        {/* Seção 6: Formulário de contato */}
        <ContatoForm
          initialNecessidade={formContext.necessidade}
          initialOrigem={formContext.origem}
          initialValorConta={formContext.valorConta}
          initialConcessionaria={formContext.concessionaria}
        />
      </main>

      {/* Rodapé Institucional com Diferenciação de Marca */}
      <Footer />

      {/* Barra Fixa Mobile com Botão CTA "Solicitar avaliação" */}
      <MobileCtaBar
        onSolicitarAvaliacao={() => handleSolicitarAvaliacaoGeral({ origem: 'mobile-bar-cta' })}
      />
    </div>
  )
}
