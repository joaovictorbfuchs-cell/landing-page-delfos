import {
  X,
  MapPin,
  Calendar,
  Zap,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CaseStudy } from '@/data/cases'

interface CaseModalProps {
  caseStudy: CaseStudy | null
  onClose: () => void
  onSolicitarEstudo: (caseStudy: CaseStudy) => void
}

export default function CaseModal({ caseStudy, onClose, onSolicitarEstudo }: CaseModalProps) {
  if (!caseStudy) return null

  const { resultadoMedido } = caseStudy

  const getSolucaoColor = (solucao: string) => {
    switch (solucao) {
      case 'Energia Solar (EPC)':
        return 'bg-solar-500 text-midnight-950'
      case 'BESS (Armazenamento)':
        return 'bg-emerald-500 text-midnight-950'
      case 'O&M e Monitoramento':
        return 'bg-blue-600 text-white'
      case 'Carregadores Veiculares':
        return 'bg-indigo-600 text-white'
      default:
        return 'bg-solar-400 text-midnight-950'
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full my-6 overflow-hidden shadow-2xl border border-slate-200 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-slate-100 text-slate-700 flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer"
            aria-label="Fechar detalhes do case"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header / Visual */}
        <div className="relative bg-gradient-to-br from-[#06182C] via-[#0B2C4F] to-[#0A223B] text-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getSolucaoColor(
                caseStudy.solucao,
              )}`}
            >
              {caseStudy.solucao}
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15">
              {caseStudy.segmento}
            </span>
            {caseStudy.isExample && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Exemplo de aplicação
              </span>
            )}
            {caseStudy.destaque && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ★ Destaque
              </span>
            )}
          </div>

          <h2
            id="case-modal-title"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight"
          >
            {caseStudy.titulo}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-solar-400" />
              <span>{caseStudy.local}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-solar-400" />
              <span>{caseStudy.dataEntrega}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-solar-300 font-bold">
              <Zap className="w-4 h-4" />
              <span>{caseStudy.potenciaOuCapacidadeCurta}</span>
            </div>
          </div>
        </div>

        {/* Modal Body: Estrutura obrigatória dos 7 campos */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Foto no modal (Versão grande/capa ~1600px se disponível para visualização nítida expandida) */}
          {caseStudy.fotoUrlGrande || caseStudy.fotoUrl ? (
            <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-md bg-slate-900">
              <img
                src={caseStudy.fotoUrlGrande || caseStudy.fotoUrl}
                alt={caseStudy.titulo}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-solar-400/50 bg-solar-50/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-solar-100 text-solar-700 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-solar-500/20 text-solar-800 border border-solar-400/40 font-mono">
                    {caseStudy.fotoPlaceholderNota}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Acervo Técnico Delfos
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{caseStudy.fotoDescricao}</p>
              </div>
            </div>
          )}

          {/* Quick Summary Grid: Segmento, Local, Escopo, Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-frost border border-slate-200/80 text-xs">
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

          {/* 1. Desafio Inicial */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              1. Desafio Inicial
            </h4>
            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-slate-700 text-xs sm:text-sm leading-relaxed">
              {caseStudy.desafioInicial}
            </div>
          </div>

          {/* 2. Solução Técnica de Engenharia Delfos */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-solar-500" />
              2. Solução Técnica Implementada
            </h4>
            <div className="p-4 rounded-2xl bg-solar-50/60 border border-solar-200/80 text-slate-700 text-xs sm:text-sm leading-relaxed">
              {caseStudy.solucaoTecnica}
            </div>
          </div>

          {/* 3. Resultado Medido (com período e método de medição) */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              3. Resultado Medido & Auditoria de Performance
            </h4>
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/60">
                <div>
                  <span className="text-[11px] font-mono text-emerald-800 uppercase font-bold block">
                    {resultadoMedido.destaqueLabel}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-950">
                    {resultadoMedido.destaqueValor}
                  </div>
                </div>

                {resultadoMedido.dadoPendente ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Dado a confirmar (aguardando ciclo)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-bold border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resultado Auditado
                  </span>
                )}
              </div>

              <div>
                <strong className="text-xs font-bold text-emerald-950 block mb-0.5">
                  Descrição do Resultado:
                </strong>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  {resultadoMedido.descricao}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-emerald-900">
                <div className="p-3 rounded-xl bg-white/70 border border-emerald-200">
                  <span className="font-bold text-[10px] uppercase text-emerald-700 block mb-0.5">
                    Período de Medição
                  </span>
                  <span>{resultadoMedido.periodoMedicao}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/70 border border-emerald-200">
                  <span className="font-bold text-[10px] uppercase text-emerald-700 block mb-0.5">
                    Método de Medição
                  </span>
                  <span>{resultadoMedido.metodoMedicao}</span>
                </div>
              </div>

              {resultadoMedido.notaAuditoria && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Nota Metodológica Oficial:</strong> {resultadoMedido.notaAuditoria}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Compliance & CREA Note */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Projetos com Anotação de Responsabilidade Técnica (ART) registrada no CREA-RS.
            </span>
          </div>
        </div>

        {/* Modal Footer / Contextual CTA */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-slate-800 block">
              Precisa de um estudo técnico com parâmetros semelhantes?
            </span>
            <span className="text-[11px] text-slate-500">
              Dimensionamento preliminar por engenheiro especialista.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none border-slate-300 text-slate-700 hover:bg-white text-xs"
            >
              Fechar
            </Button>

            <Button
              onClick={() => onSolicitarEstudo(caseStudy)}
              className="flex-1 sm:flex-none bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-2.5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Solicitar estudo similar</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
