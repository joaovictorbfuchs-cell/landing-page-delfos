import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackWhatsappClick } from '@/lib/analytics'

interface MobileCtaBarProps {
  onSolicitarAvaliacao: () => void
}

export default function MobileCtaBar({ onSolicitarAvaliacao }: MobileCtaBarProps) {
  // Real phone: (54) 99129-2121
  const whatsappUrl =
    'https://wa.me/5554991292121?text=Ol%C3%A1%2C%20gostaria%20de%20uma%20avalia%C3%A7%C3%A3o%20energ%C3%A9tica%20com%20a%20Delfos%20Engenharia%20(Barra%20Mobile)'

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-midnight-950/95 backdrop-blur-md border-t border-white/10 px-4 py-2.5 flex items-center gap-2.5 shadow-2xl">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappClick('mobile_bar', 'Avaliação energética (barra mobile)')}
        className="w-11 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md"
        aria-label="Chamar no WhatsApp"
      >
        <Phone className="w-5 h-5" />
      </a>

      <Button
        onClick={onSolicitarAvaliacao}
        className="flex-1 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold h-11 rounded-xl text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5"
      >
        <span>Solicitar avaliação</span>
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
