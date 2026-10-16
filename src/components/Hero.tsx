import { ChevronDown, ArrowRight, ShieldCheck, Star, Award, Zap, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  const scrollToForm = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToVantagens = () => {
    const el = document.querySelector('#vantagens')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-950 text-white"
    >
      {/* Engineering subtle grid background overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F5B301 1px, transparent 1px),
            linear-gradient(to bottom, #F5B301 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radiant solar ambient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-solar-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-leaf/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-solar-300">
              <Zap className="w-3.5 h-3.5 fill-solar-400 text-solar-400" />
              <span>Especialistas em Energia Solar • Erechim e Região</span>
            </div>

            {/* H1 headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight leading-[1.15]">
              Economize até{' '}
              <span className="bg-gradient-to-r from-solar-300 via-solar-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
                95% na sua conta de luz
              </span>{' '}
              com energia solar
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Projetos personalizados de engenharia fotovoltaica para residências e empresas em
              Erechim/RS. Orçamento gratuito, homologação completa na concessionária e instalação
              com garantia total.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                onClick={scrollToForm}
                size="lg"
                className="w-full sm:w-auto bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-7 py-6 text-base rounded-xl shadow-lg shadow-solar-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Solicitar Orçamento Gratuito
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                onClick={scrollToVantagens}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border-white/20 font-semibold px-6 py-6 text-base rounded-xl backdrop-blur-sm hover:scale-[1.02] transition-all"
              >
                Ver Vantagens
              </Button>
            </div>

            {/* Social Proof & Trust Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-3">
                {/* Mini Avatars */}
                <div className="flex -space-x-2">
                  <img
                    src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1"
                    alt="Cliente Delfos"
                    className="w-9 h-9 rounded-full border-2 border-midnight-900 object-cover"
                  />
                  <img
                    src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2"
                    alt="Cliente Delfos"
                    className="w-9 h-9 rounded-full border-2 border-midnight-900 object-cover"
                  />
                  <img
                    src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3"
                    alt="Cliente Delfos"
                    className="w-9 h-9 rounded-full border-2 border-midnight-900 object-cover"
                  />
                  <img
                    src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=4"
                    alt="Cliente Delfos"
                    className="w-9 h-9 rounded-full border-2 border-midnight-900 object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-solar-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-solar-400" />
                    ))}
                    <span className="font-bold text-white text-xs ml-1">4.9/5</span>
                  </div>
                  <span className="text-xs text-slate-300">Avaliação média dos clientes</span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-leaf/20 border border-leaf/30 text-leaf-light text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-leaf" />
                <span>Engenheiros Registrados no CREA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card with Solar House stock photo */}
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-midnight-800/80 backdrop-blur-md group">
                <img
                  src="https://img.usecurling.com/p/800/600?q=solar+panels+roof+home&color=amber"
                  alt="Casa moderna com painéis solares no telhado em Erechim"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlaid stat cards */}
                <div className="absolute top-4 left-4 bg-midnight-950/85 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2.5 shadow-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-solar-400/20 text-solar-400 flex items-center justify-center">
                    <Sun className="w-4 h-4 fill-solar-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Economia Média
                    </p>
                    <p className="text-base font-bold text-white leading-tight">Até 95% na conta</p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-midnight-950/85 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-leaf/20 text-leaf flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Garantia Linear
                    </p>
                    <p className="text-sm font-bold text-white leading-tight">
                      25 anos de eficiência
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing scroll indicator */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={scrollToVantagens}
      >
        <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
          Rolar
        </span>
        <ChevronDown className="w-5 h-5 text-solar-400 animate-bounce" />
      </div>
    </section>
  )
}
