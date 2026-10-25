import GoogleReviewsMarquee from '@/components/GoogleReviewsMarquee'

export default function Depoimentos() {
  return (
    <section id="depoimentos" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-700 text-xs font-bold uppercase tracking-wider mb-3">
            Histórias de Sucesso
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Mais de 3.000 projetos entregues em Erechim e região — projetos executados por
            engenheiros, com responsabilidade técnica e ART.
          </p>
        </div>
      </div>

      {/* Faixa animada de avaliações do Google Meu Negócio */}
      <GoogleReviewsMarquee />
    </section>
  )
}
