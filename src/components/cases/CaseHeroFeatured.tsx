import {
  MapPin,
  Calendar,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CaseStudy } from '@/data/cases'

interface CaseHeroFeaturedProps {
  caseStudy: CaseStudy
  onVerDetalhes: (caseStudy: CaseStudy) => void
  onSolicitarEstudo: (caseStudy: CaseStudy) => void
}

export default function CaseHeroFeatured({
  caseStudy,
  onVerDetalhes,
  onSolicitarEstudo,
}: CaseHeroFeaturedProps) {
  const { resultadoMedido } = caseStudy

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Visual & Photo Placeholder */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-[#06182C] via-[#0B2C4F] to-[#0A223B] text-white p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-solar-400 text-midnight-950 text-xs font-black uppercase tracking-wider">
                Case de Referência • Destaque
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs text-slate-300 font-medium border border-white/10">
                {caseStudy.segmento}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white mb-2">
              {caseStudy.titulo}
            </h2>

            <div className="flex items-center gap-2 text-slate-300 text-xs mb-6">
              <MapPin className="w-4 h-4 text-solar-400" />
              <span>{caseStudy.local}</span>
            </div>
          </div>

          {/* Photo (Versão grande/capa para o card hero em destaque ou visual de marca da Delfos) */}
          {caseStudy.fotoUrlGrande || caseStudy.fotoUrl ? (
            <div className="my-6 rounded-2xl overflow-hidden aspect-video border border-white/20 shadow-xl bg-slate-900">
              <img
                src={caseStudy.fotoUrlGrande || caseStudy.fotoUrl}
                alt={caseStudy.titulo}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="my-6 rounded-2xl overflow-hidden aspect-video relative bg-[#081B30] border border-white/15 p-6 flex flex-col justify-between shadow-2xl text-left">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(0,229,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.12) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gradient-to-br from-[#00E5FF]/20 via-[#10B981]/20 to-transparent blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-[#F59E0B]/15 via-[#10B981]/15 to-transparent blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 font-bold">
                  {caseStudy.potenciaOuCapacidadeCurta}
                </span>
                <span className="text-slate-300">{caseStudy.dataEntrega.split('(')[0].trim()}</span>
              </div>

              <div className="relative z-10 my-auto py-2">
                <p className="text-base font-bold text-white mb-1">{caseStudy.titulo}</p>
                <p className="text-xs text-slate-300 max-w-md line-clamp-2">
                  {caseStudy.fotoDescricao}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                <span className="text-white font-medium">{caseStudy.cliente}</span>
                <span>{caseStudy.local}</span>
              </div>
            </div>
          )}

          {/* Key Stat Summary (Tesla style) */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Potência Instalada
              </span>
              <span className="text-xl font-black text-solar-300">
                {caseStudy.potenciaOuCapacidadeCurta}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                {resultadoMedido.destaqueLabel}
              </span>
              <span className="text-xl font-black text-emerald-400">
                {resultadoMedido.destaqueValor}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Case Data (Section 10 from specification) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-6 border-b border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-0.5">
                  Segmento
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm block">
                  {caseStudy.segmento}
                </strong>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-0.5">
                  Localização
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm block">
                  {caseStudy.local.split('(')[0].trim()}
                </strong>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-0.5">
                  Escopo Técnico
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm block">
                  {caseStudy.escopo}
                </strong>
              </div>
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px] mb-0.5">
                  Data de Entrega
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm block">
                  {caseStudy.dataEntrega}
                </strong>
              </div>
            </div>

            {/* Desafio Inicial */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Desafio Inicial do Cliente
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {caseStudy.desafioInicial}
              </p>
            </div>

            {/* Solução Técnica */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-solar-500" />
                Solução de Engenharia Delfos
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {caseStudy.solucaoTecnica}
              </p>
            </div>

            {/* Resultado Medido com método e período */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Resultado Medido com Período & Método
              </h4>
              <div className="bg-emerald-50/80 p-4 sm:p-5 rounded-xl border border-emerald-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-sm sm:text-base font-black text-emerald-950">
                    {resultadoMedido.descricao}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-200 text-emerald-900 w-fit">
                    Resultado Auditado
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-emerald-900">
                  <p>
                    <strong>Período:</strong> {resultadoMedido.periodoMedicao}
                  </p>
                  <p>
                    <strong>Método:</strong> {resultadoMedido.metodoMedicao}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onVerDetalhes(caseStudy)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver ficha técnica completa do case</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <Button
              onClick={() => onSolicitarEstudo(caseStudy)}
              className="w-full sm:w-auto bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-7 py-3 rounded-xl shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Solicitar estudo similar para sua empresa</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
