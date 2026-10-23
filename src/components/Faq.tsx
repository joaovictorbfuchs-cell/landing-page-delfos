import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, ArrowRight, Zap, ShieldCheck } from 'lucide-react'
import { FAQ_ITEMS } from '@/data/faq'

// Seleção de 4 perguntas principais da nova base oficial para exibir na home
const HOME_FAQ_IDS = ['pergunta-1', 'pergunta-2', 'pergunta-4', 'pergunta-6']

export default function Faq() {
  const faqsHome = FAQ_ITEMS.filter((item) => HOME_FAQ_IDS.includes(item.id))

  return (
    <section id="faq" className="py-24 bg-white relative border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-950 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            Tire suas Dúvidas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Respostas diretas e detalhes técnicos com fundamentação regulatória da ANEEL (SCEE e Lei
            nº 14.300/2022).
          </p>
        </div>

        {/* Accordion com Resposta Rápida e Detalhe Técnico */}
        <Accordion type="single" collapsible defaultValue="pergunta-1" className="w-full space-y-4">
          {faqsHome.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl px-6 py-1 data-[state=open]:border-emerald-500 data-[state=open]:bg-white transition-all shadow-sm"
            >
              <AccordionTrigger className="text-left font-bold text-slate-900 text-base sm:text-lg hover:text-emerald-800 hover:no-underline py-5">
                <div className="flex items-center gap-3 pr-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-extrabold flex items-center justify-center shrink-0">
                    {faq.numero}
                  </span>
                  <span>{faq.pergunta}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-slate-700 leading-relaxed pb-6 pt-2 border-t border-slate-100 space-y-3">
                <div className="bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-900 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Resposta Rápida
                  </div>
                  <p className="text-emerald-950 text-sm font-semibold leading-relaxed">
                    {faq.respostaRapida}
                  </p>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed pt-1">{faq.detalheTecnico}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Rodapé com link para FAQ completo */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-950 text-white shadow-md">
          <div className="flex items-center gap-3 text-left">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Guia completo com 10 temas técnicos</p>
              <p className="text-xs text-emerald-200">
                Baterias de energia, recarga de carro elétrico, Lei 14.300 e manutenção preventiva.
              </p>
            </div>
          </div>

          <Link
            to="/faq"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition shadow shrink-0"
          >
            <span>Ver todas as 10 perguntas</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>
      </div>
    </section>
  )
}
export { Faq }
