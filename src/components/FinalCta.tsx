import { MessageCircle, ArrowUpRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FinalCta() {
  const whatsappUrl =
    'https://wa.me/5554999990000?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20especialista%20da%20Delfos%20Engenharia%20sobre%20energia%20solar!'

  return (
    <section className="relative py-20 bg-gradient-to-r from-midnight-950 via-midnight-900 to-midnight-950 text-white overflow-hidden border-t border-white/10">
      {/* Radiant solar backdrops */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-solar-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-leaf/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-solar-300 mb-6 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-solar-400 fill-solar-400" />
          <span>Atendimento Imediato pelo WhatsApp</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 max-w-3xl mx-auto leading-tight">
          Pronto para reduzir sua conta de luz em <span className="text-solar-400">até 95%</span>?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Tire dúvidas diretamente com um engenheiro especialista em energia solar. Sem
          intermediários, com agilidade e projeto sob medida para Erechim e região.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Fale com um Especialista no WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </a>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const el = document.querySelector('#contato')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border-white/20 font-semibold px-6 py-6 text-base rounded-xl backdrop-blur-sm"
          >
            Preencher Formulário do Site
          </Button>
        </div>
      </div>
    </section>
  )
}
