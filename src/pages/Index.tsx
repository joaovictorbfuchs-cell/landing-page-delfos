import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Vantagens from '@/components/Vantagens'
import ComoFunciona from '@/components/ComoFunciona'
import Projetos from '@/components/Projetos'
import Depoimentos from '@/components/Depoimentos'
import ContatoForm from '@/components/ContatoForm'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'

export default function Index() {
  const handleOpenLead = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Sticky Header with logo and CTAs */}
      <Header onOpenLeadModal={handleOpenLead} />

      {/* Main Continuous Single Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Vantagens / Benefícios */}
        <Vantagens />

        {/* 3. Como Funciona (4 passos) */}
        <ComoFunciona />

        {/* 4. Projetos Recentes / Portfólio com Modal */}
        <Projetos />

        {/* 5. Depoimentos */}
        <Depoimentos />

        {/* 6. Contato / Formulário de Orçamento Gratuito */}
        <ContatoForm />

        {/* 7. CTA Final WhatsApp */}
        <FinalCta />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
