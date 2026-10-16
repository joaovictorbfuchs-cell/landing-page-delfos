import { MessageCircle } from 'lucide-react'

interface WhatsAppFloatingProps {
  contextMessage?: string
  origemSecao?: string
}

export default function WhatsAppFloating({
  contextMessage = 'Olá! Gostaria de uma avaliação energética com a equipe da Delfos Engenharia.',
  origemSecao = 'whatsapp-flutuante',
}: WhatsAppFloatingProps) {
  // Real verified phone: (54) 99129-2121
  const phoneNumber = '5554991292121'
  const encodedText = encodeURIComponent(`${contextMessage} (Origem: ${origemSecao})`)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`

  return (
    <aside aria-label="Atendimento rápido" className="fixed bottom-20 md:bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp com a Delfos Engenharia"
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border-2 border-white/20"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-solar-300 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-solar-300 rounded-full" />
        </div>
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide pr-1">
          Falar com Engenheiro
        </span>
      </a>
    </aside>
  )
}
