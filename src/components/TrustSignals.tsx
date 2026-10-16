import { ShieldCheck, Award, Star, CheckCircle2, FileCheck, Layers } from 'lucide-react'

export default function TrustSignals() {
  const certs = [
    {
      titulo: 'CREA-RS Registrado',
      sub: 'Engenheiro técnico responsável',
      icone: ShieldCheck,
      detalhe: 'ART emitida em 100% dos projetos executados',
    },
    {
      titulo: 'Homologação Garantida',
      sub: 'RGE, CEEE e Cooperativas',
      icone: FileCheck,
      detalhe: 'Trâmite burocrático e vistoria técnica completa',
    },
    {
      titulo: 'Equipamentos Tier 1',
      sub: 'Módulos e Inversores Líderes',
      icone: Award,
      detalhe: 'Garantia linear de até 25 anos de eficiência',
    },
    {
      titulo: 'Avaliação Google 4.9/5',
      sub: 'Mais de 3.000 clientes no Sul',
      icone: Star,
      detalhe: 'Reputação máxima auditada por clientes reais',
    },
  ]

  return (
    <section className="py-12 bg-slate-900 text-white border-y border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((c, idx) => {
            const Icon = c.icone
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-solar-400/20 text-solar-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{c.titulo}</h4>
                  <p className="text-xs font-semibold text-solar-300 mt-0.5">{c.sub}</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{c.detalhe}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
