import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackWhatsappClick } from '@/lib/analytics'
import { whatsappUrl, WHATSAPP_ORIGENS } from '@/lib/whatsapp'

interface MobileCtaBarProps {
  onSolicitarAvaliacao: () => void
}

export default function MobileCtaBar({ onSolicitarAvaliacao }: MobileCtaBarProps) {
  // Real phone: (54) 99129-2121
  const linkWhatsapp = whatsappUrl(WHATSAPP_ORIGENS.barraMobile)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-midnight-950/95 backdrop-blur-md border-t border-white/10 px-3.5 py-2 sm:px-4 sm:py-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center gap-2.5 shadow-2xl">
      <a
        href={linkWhatsapp}
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
