import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, Sparkles } from 'lucide-react'

export default function Faq() {
  const faqs = [
    {
      id: 'kwh',
      pergunta: 'O que é kWh e como ele define o tamanho do meu sistema solar?',
      resposta:
        'O quilowatt-hora (kWh) é a unidade de medida da energia consumida ao longo do tempo. Na sua conta de luz, você é cobrado pela quantidade de kWh consumida no mês. Nossos engenheiros calculam a média anual do seu consumo em kWh e cruzam com os índices de radiação solar de Erechim e região para determinar exatamente quantos painéis e qual a potência (kWp) necessária para zerar até 90% do seu custo.',
    },
    {
      id: 'inversor',
      pergunta: 'O que faz o inversor solar fotovoltaico em uma usina?',
      resposta:
        'O inversor é o "cérebro" da usina solar. Os módulos fotovoltaicos geram energia em corrente contínua (CC). O inversor transforma essa energia em corrente alternada (CA) no padrão da sua rede elétrica (127V / 220V / 380V), sincroniza perfeitamente com a concessionária local (RGE/CEEE) e gerencia os dados de produção em tempo real que você acompanha pelo aplicativo.',
    },
    {
      id: 'retorno',
      pergunta: 'Qual o tempo médio de retorno do investimento (payback) no Sul do Brasil?',
      resposta:
        'Para sistemas residenciais e comerciais no Rio Grande do Sul, o retorno financeiro típico fica entre 3 a 5 anos. Como os equipamentos possuem vida útil superior a 25 anos (com garantias lineares de fábrica), você aproveita pelo menos 20 anos de energia praticamente gratuita após o pagamento do sistema.',
    },
    {
      id: 'bess',
      pergunta: 'O que é BESS e por que ele é diferente de um gerador a diesel?',
      resposta:
        'BESS (Battery Energy Storage System) é um sistema inteligente de armazenamento de energia em baterias industriais de lítio (LiFePO4). Ao contrário de geradores barulhentos e poluentes a diesel, o BESS atua silenciosamente em milissegundos, não exige combustível fóssil, recarrega com a própria energia solar e realiza "peak shaving" (corte de picos de demanda cara no horário de ponta).',
    },
    {
      id: 'recarga-condominio',
      pergunta:
        'Como funciona a instalação de carregador veicular em condomínio sem briga de vizinho?',
      resposta:
        'A Delfos Engenharia aplica tecnologia de Gestão Dinâmica de Carga (DLM) integrada a medição individualizada. Cada vaga tem seu ponto ou wallbox, ativado por cartão RFID ou app do morador. O condomínio não precisa aumentar o disjuntor geral nem pagar obras civis bilionárias de transformador, e o consumo de cada veículo vai exclusivamente para o morador responsável.',
    },
    {
      id: 'diferenca-marca',
      pergunta: 'Qual a diferença entre a Delfos Engenharia Solar e a Delfos Energy?',
      resposta:
        'A Delfos Engenharia Solar (com sede em Erechim/RS) é uma integradora gaúcha de engenharia de campo com 12 anos de mercado, responsável técnica pela instalação, comissionamento e manutenção de usinas solares, BESS e carregadores veiculares no Sul do Brasil. Não temos relação com a "Delfos Energy", que é uma energytech de software com sede na Espanha para gestão preditiva de parques eólicos remotos.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Tire suas Dúvidas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Perguntas Frequentes & Didática Técnica
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Entenda os conceitos fundamentais sobre geração solar, inversores, baterias BESS e
            eletromobilidade de forma clara e orientada a resultados.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="bg-frost border border-slate-200/80 rounded-2xl px-6 py-1 data-[state=open]:border-solar-400 transition-colors"
            >
              <AccordionTrigger className="text-left font-bold text-slate-900 text-base sm:text-lg hover:text-solar-600 hover:no-underline py-5">
                {faq.pergunta}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-slate-600 leading-relaxed pb-5 pt-1 border-t border-slate-100">
                {faq.resposta}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Didactic tip */}
        <div className="mt-10 p-5 rounded-2xl bg-solar-50 border border-solar-200 text-xs text-solar-900 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-solar-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm font-bold mb-1">
              Ainda tem dúvidas técnicas específicas do seu imóvel?
            </strong>
            <span>
              Nossos engenheiros com registro no CREA-RS analisam gratuitamente a sua fatura e o
              perfil do seu disjuntor.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
