import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  name: string
  role: string
  cidade: string
  tipo: 'Residencial' | 'Empresarial'
  avatar: string
  rating: number
  texto: string
  economia: string
}

export default function Depoimentos() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      name: 'Carlos Alberto Siqueira',
      role: 'Proprietário Residencial',
      cidade: 'Erechim/RS',
      tipo: 'Residencial',
      avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=11',
      rating: 5,
      texto:
        'Minha conta vinha na faixa de R$ 900 a R$ 1.100 todo mês. Depois da instalação feita pela equipe da Delfos Engenharia, o valor caiu para a taxa mínima de R$ 75. A equipe foi extremamente profissional e cuidou de toda a burocracia.',
      economia: 'Economia de R$ 1.000/mês',
    },
    {
      name: 'Mariana Duarte',
      role: 'Diretora Comercial - Gráfica Express',
      cidade: 'Erechim/RS',
      tipo: 'Empresarial',
      avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=14',
      rating: 5,
      texto:
        'O custo de energia elétrica era nosso segundo maior gargalo financeiro. O projeto da Delfos foi impecável: dimensionamento sob medida, prazo cumprido rigorosamente e já no primeiro mês vimos a redução prevista em contrato.',
      economia: 'Redução de 92% na conta',
    },
    {
      name: 'Fernando Zanchett',
      role: 'Produtor Rural e Residência',
      cidade: 'Região de Erechim/RS',
      tipo: 'Residencial',
      avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=22',
      rating: 5,
      texto:
        'O suporte técnico e a transparência do engenheiro responsável foram diferenciais. Explicaram tudo detalhadamente, desde os módulos até a homologação na concessionária. Recomendo de olhos fechados.',
      economia: 'Retorno em menos de 3 anos',
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="depoimentos" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-700 text-xs font-bold uppercase tracking-wider mb-3">
            Histórias de Sucesso
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Mais de 150 sistemas solares instalados com índice de 99% de satisfação em Erechim e
            toda a região norte gaúcha.
          </p>
        </div>

        {/* Desktop Grid (3 cards) */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-frost rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative group"
            >
              <div>
                {/* Quote decoration */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-solar-400 text-solar-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-solar-300/60 group-hover:text-solar-400 transition-colors" />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">"{item.texto}"</p>
              </div>

              <div className="pt-5 border-t border-slate-200/60 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-solar-400 shadow-sm"
                />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{item.role}</p>
                  <span className="inline-block text-[10px] font-bold text-leaf-dark uppercase tracking-wide mt-0.5">
                    {item.economia}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel (one card at a time with buttons) */}
        <div className="md:hidden">
          <div className="bg-frost rounded-2xl p-6 border border-slate-100 shadow-md flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-solar-400 text-solar-400" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${
                    testimonials[activeIndex].tipo === 'Residencial' ? 'bg-solar-500' : 'bg-leaf'
                  }`}
                >
                  {testimonials[activeIndex].tipo}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                "{testimonials[activeIndex].texto}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-solar-400 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-xs text-slate-500">{testimonials[activeIndex].cidade}</p>
                  <span className="text-[10px] font-bold text-leaf-dark uppercase">
                    {testimonials[activeIndex].economia}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full border-slate-300 hover:bg-solar-50 hover:border-solar-400"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ver depoimento ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === i ? 'w-6 bg-solar-500' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full border-slate-300 hover:bg-solar-50 hover:border-solar-400"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
