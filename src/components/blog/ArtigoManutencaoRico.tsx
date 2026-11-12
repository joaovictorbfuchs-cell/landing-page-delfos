import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Wrench,
  Calculator,
  AlertTriangle,
  Flame,
  ChevronDown,
  Copy,
  RotateCcw,
  Sparkles,
  Phone,
  Layers,
  Zap,
  UserCheck,
  ExternalLink,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import FormCapturaArtigo from '@/components/blog/FormCapturaArtigo'
import { trackCtaClick, trackCalculatorUsed, trackWhatsappClick } from '@/lib/analytics'
import { whatsappUrl, whatsappMensagem, WHATSAPP_ORIGENS } from '@/lib/whatsapp'

interface ArtigoManutencaoRicoProps {
  onSolicitarDiagnostico: () => void
}

export default function ArtigoManutencaoRico({
  onSolicitarDiagnostico,
}: ArtigoManutencaoRicoProps) {
  const { toast } = useToast()

  // Calculadora state (HSP fixo padrão RS = 4,2 kWh/m²/dia conforme simulador)
  const HSP_FIXO_RS = 4.2
  const TARIFA_MAX_RGE = 1.2
  const [kwp, setKwp] = useState<number>(12)
  const [tarifa, setTarifa] = useState<number>(1.2)
  const [meses, setMeses] = useState<number>(12)

  // Mapeamento não-linear do slider de potência (0 a 100 no slider -> 2 a 200 kWp reais)
  // Faixa 2–60 kWp ocupa 70% do curso do slider (ajuste fino no mobile)
  // Faixa 60–200 kWp ocupa os 30% restantes
  const kwpToSliderPos = (val: number): number => {
    const clamped = Math.max(2, Math.min(200, val))
    if (clamped <= 60) {
      // 2..60 mapeado em 0..70
      return ((clamped - 2) / (60 - 2)) * 70
    }
    // 60..200 mapeado em 70..100
    return 70 + ((clamped - 60) / (200 - 60)) * 30
  }

  const sliderPosToKwp = (pos: number): number => {
    const clamped = Math.max(0, Math.min(100, pos))
    if (clamped <= 70) {
      const raw = 2 + (clamped / 70) * (60 - 2)
      // Ajuste fino: de 2 a 10 kWp passo de 0,5 kWp; de 10 a 60 kWp passo de 1 kWp
      if (raw <= 10) {
        return Math.round(raw * 2) / 2
      }
      return Math.round(raw)
    }
    const raw = 60 + ((clamped - 70) / 30) * (200 - 60)
    // De 60 a 200 kWp passo de 5 kWp
    return Math.round(raw / 5) * 5
  }

  // Checklist state
  const checklistItems = [
    'Conta de luz parou de cair ou subiu sem mudança de consumo',
    'Geração abaixo do mesmo mês do ano anterior',
    'Inversor ou string zerado, intermitente ou alarmando',
    'Manchas ou pontos queimados nos módulos fotovoltaicos',
    'Sombra nova sobre os módulos (construção vizinha, árvore, antenas)',
    'Sujeira aderida que a chuva não remove do vidro',
    'Vibração ou ruído na estrutura de fixação em vento forte',
    'Oxidação visível em parafusos e conectores elétricos',
  ]
  const [checkedAlerts, setCheckedAlerts] = useState<boolean[]>(
    new Array(checklistItems.length).fill(false),
  )

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Faixas técnicas de perda recalibradas conforme histórico de campo no Sul/RS:
  // Em 12 meses (7–12 meses), perda média de 15% a 25% (padrão de cálculo ~20%)
  const percentFor = (m: number, pKwp: number, pPerdaAnual: number) => {
    const perdaFmt = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(Math.round(pPerdaAnual))

    if (m <= 6)
      return {
        p: 0.08,
        faixa: 'Faixa 0–6 meses (5–10%)',
        d: 'ok',
        msg: `Sua usina de ${pKwp} kWp está em perda inicial leve (~8%, cerca de ${perdaFmt}/ano). Mantenha o monitoramento contínuo e acompanhe a curva de geração.`,
      }
    if (m <= 12)
      return {
        p: 0.2,
        faixa: 'Faixa 7–12 meses (15–25%)',
        d: 'warn',
        msg: `Atenção: sua usina de ${pKwp} kWp pode estar perdendo cerca de ${perdaFmt}/ano (~20%). Recomendamos agendar limpeza técnica e inspeção preventiva.`,
      }
    if (m <= 18)
      return {
        p: 0.25,
        faixa: 'Faixa 13–18 meses (~25%)',
        d: 'warn',
        msg: `Perda elevada na usina de ${pKwp} kWp: estimativa de ${perdaFmt}/ano evaporando (~25%). Risco iminente de descompasso de strings e surgimento de pontos quentes.`,
      }
    if (m <= 24)
      return {
        p: 0.3,
        faixa: 'Faixa 19–24 meses (25–35%)',
        d: 'bad',
        msg: `Perda crítica na sua usina de ${pKwp} kWp: aproximadamente ${perdaFmt}/ano jogados fora (~30%). Sujeira severa associada a provável ponto quente. Solicite inspeção termográfica.`,
      }
    if (m <= 30)
      return {
        p: 0.35,
        faixa: 'Faixa 25–30 meses (30–35%+)',
        d: 'bad',
        msg: `Perda alarmante na usina de ${pKwp} kWp: cerca de ${perdaFmt}/ano em prejuízo direto (~35%). Operação degradada com risco de arco elétrico e perda de garantias.`,
      }
    return {
      p: 0.4,
      faixa: 'Faixa 31–36 meses (acima de 35%)',
      d: 'bad',
      msg: `Perda extrema em ${pKwp} kWp: mais de ${perdaFmt}/ano não compensados (>35%). Cenário de falha elétrica ou módulo danificado. Diagnóstico técnico urgente recomendado.`,
    }
  }

  const calcResults = useMemo(() => {
    const validKwp = Math.max(2, Math.min(200, kwp || 0))
    const validTar = Math.max(0.4, Math.min(TARIFA_MAX_RGE, tarifa || 0))
    const validHsp = HSP_FIXO_RS
    const validMeses = Math.max(0, Math.min(36, meses || 0))

    const geracaoMensal = validKwp * validHsp * 30
    const geracaoAnual = validKwp * validHsp * 365
    const valorMensalCompensado = geracaoMensal * validTar
    const valorAnualCompensado = geracaoAnual * validTar

    // Obter percentual e calcular perda anual
    // 0-6m: 8%; 7-12m: 20%; 13-18m: 25%; 19-24m: 30%; 25-30m: 35%; 31-36m: 40%
    const baseP =
      validMeses <= 6
        ? 0.08
        : validMeses <= 12
          ? 0.2
          : validMeses <= 18
            ? 0.25
            : validMeses <= 24
              ? 0.3
              : validMeses <= 30
                ? 0.35
                : 0.4

    const perdaAnual = geracaoAnual * validTar * baseP
    const perdaMensal = perdaAnual / 12
    const contas = valorMensalCompensado > 0 ? perdaAnual / valorMensalCompensado : 0
    const anos = Math.max(1, Math.round(validMeses / 12))
    const acumulado = perdaAnual * anos
    const info = percentFor(validMeses, validKwp, perdaAnual)

    return {
      validKwp,
      validTar,
      validHsp,
      validMeses,
      geracaoAnual,
      geracaoMensal,
      valorMensalCompensado,
      valorAnualCompensado,
      perdaAnual,
      perdaMensal,
      contas,
      acumulado,
      anos,
      info,
    }
  }, [kwp, tarifa, meses])

  const fmtBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(Math.round(val))
  }

  const handleResetCalc = () => {
    setKwp(12)
    setTarifa(1.2)
    setMeses(12)
    toast({
      title: 'Padrões restaurados',
      description:
        'Valores da calculadora retornados para 12 kWp e tarifa padrão CPFL RGE (R$ 1,20).',
    })
  }

  const handleCopyResumo = () => {
    const txt = `Perda estimada em usina de ${calcResults.validKwp} kWp: ${fmtBRL(calcResults.perdaAnual)}/ano (${Math.round(
      calcResults.info.p * 100,
    )}%), equivalente a ${calcResults.contas.toFixed(1).replace('.', ',')} contas de luz por ano. Diagnóstico: Delfos Engenharia (CREA-RS 151894).`

    navigator.clipboard.writeText(txt).then(() => {
      toast({
        title: 'Resumo copiado!',
        description: 'Os dados foram copiados para sua área de transferência.',
      })
    })
  }

  const handleKwpChange = (newKwp: number) => {
    setKwp(newKwp)
    trackCalculatorUsed({
      kwp: newKwp,
      meses,
      tarifa,
      perdaEstimadaAnual: calcResults.perdaAnual,
    })
  }

  const handleTarifaChange = (newTarifa: number) => {
    const clamped = Math.max(0.4, Math.min(TARIFA_MAX_RGE, Number(newTarifa.toFixed(2))))
    setTarifa(clamped)
    trackCalculatorUsed({
      kwp,
      meses,
      tarifa: clamped,
      perdaEstimadaAnual: calcResults.perdaAnual,
    })
  }

  const handleMesesChange = (newMeses: number) => {
    setMeses(newMeses)
    trackCalculatorUsed({
      kwp,
      meses: newMeses,
      tarifa,
      perdaEstimadaAnual: calcResults.perdaAnual,
    })
  }

  const handleToggleCheck = (index: number) => {
    const updated = [...checkedAlerts]
    updated[index] = !updated[index]
    setCheckedAlerts(updated)
  }

  const totalChecks = checkedAlerts.filter(Boolean).length

  const checklistFeedback = useMemo(() => {
    if (totalChecks <= 2) {
      return {
        text: 'Sua usina parece saudável — mantenha o monitoramento contínuo.',
        color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
        badge: 'Status Estável',
      }
    }
    if (totalChecks <= 5) {
      return {
        text: 'Atenção: múltiplos sinais de perda. Agende uma inspeção termográfica preventiva.',
        color: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
        badge: 'Alerta Moderado',
      }
    }
    return {
      text: 'Prioridade alta: sinais críticos de falha elétrica ou módulo danificado. Solicite diagnóstico técnico imediatamente.',
      color: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
      badge: 'Ação Urgente',
    }
  }, [totalChecks])

  const openWhatsAppArtigo = (origemCta: string) => {
    const msg = whatsappMensagem(WHATSAPP_ORIGENS.artigo)
    trackWhatsappClick(origemCta, msg)
    window.open(whatsappUrl(WHATSAPP_ORIGENS.artigo), '_blank', 'noopener,noreferrer')
  }

  const handleCtaIntermediario = (origemCta: string) => {
    trackCtaClick('cta_intermediario_diagnostico', origemCta, 'contato')
    onSolicitarDiagnostico()
  }

  return (
    <article className="w-full text-slate-800 antialiased">
      {/* 1. HERO EDITORIAL LEVE (GRADIENTE CSS PURO, SEM IMAGEM PESADA, LCP OTIMIZADO) */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#081B30] via-[#0F2A47] to-[#15395F] text-white pt-10 pb-14 lg:pb-20 rounded-3xl border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-solar-500/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 space-y-6">
          {/* Breadcrumb Semântico do Post */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-slate-300"
          >
            <Link to="/conteudos" className="hover:text-solar-400 transition-colors">
              Conteúdos &amp; Blog
            </Link>
            <span>/</span>
            <Link to="/solucoes/om" className="hover:text-solar-400 transition-colors">
              Manutenção O&amp;M
            </Link>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-xs sm:max-w-md">
              Manutenção de placa solar
            </span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/20 text-solar-300 border border-solar-400/30 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-solar-400" />
            Operação &amp; Manutenção Fotovoltaica
          </div>

          {/* ÚNICO H1 DA PÁGINA */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Manutenção de placa solar: até 25% da sua geração pode estar indo embora sem você saber
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-normal max-w-3xl">
            Sujeira, ponto quente e conector frouxo custam até três contas de luz por ano — e o
            aplicativo de monitoramento do inversor não avisa.
          </p>

          {/* FICHA TÉCNICA DO AUTOR OFICIAL COM CREA E LINK DEDICADO */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="flex items-center gap-3.5">
              <Link
                to="/conteudos/autor/joao-victor-bagetti-fuchs"
                title="Ver perfil completo do autor"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-solar-400 to-amber-500 text-midnight-950 font-black flex items-center justify-center text-base shadow-md shrink-0 hover:scale-105 transition-transform"
              >
                JV
              </Link>
              <div>
                <Link
                  to="/conteudos/autor/joao-victor-bagetti-fuchs"
                  className="text-sm font-bold text-white hover:text-solar-300 transition-colors flex items-center gap-1.5 group"
                >
                  <span>Eng. Eletricista João Victor Bagetti Fuchs</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </Link>
                <span className="text-xs text-slate-300 block leading-tight mt-0.5">
                  Responsável Técnico —{' '}
                  <Link to="/sobre" className="hover:text-solar-300 underline underline-offset-2">
                    Delfos Engenharia
                  </Link>{' '}
                  · <strong>CREA-RS 151894</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/10 font-semibold text-white">
                8 min de leitura
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-solar-400" />
                Publicado: 27 de Outubro de 2026
              </span>
            </div>
          </div>

          {/* NÚMEROS OFICIAIS DE IMPACTO */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-rose-400">Até 25%</div>
              <p className="text-xs text-slate-300 mt-1">de perda silenciosa na produção</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-solar-400">3 contas</div>
              <p className="text-xs text-slate-300 mt-1">de luz pagas a mais por ano</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">0 alarmes</div>
              <p className="text-xs text-slate-300 mt-1">emitidos no app do inversor</p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SUMÁRIO EDITORIAL E INTRODUÇÃO */}
      <section className="py-12 max-w-4xl mx-auto px-6 space-y-8">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
            Neste artigo técnico
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
            <a
              href="#calculadora"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              1. Calculadora de perda &amp; escala
            </a>
            <a
              href="#mito"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              2. O mito da manutenção zero
            </a>
            <a
              href="#pilares"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              3. Os três pilares de perda
            </a>
            <a
              href="#multiplicador"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              4. O multiplicador escondido (string)
            </a>
            <a
              href="#seguradora"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              5. Tabela 5 anos &amp; seguradora
            </a>
            <a
              href="#monitoramento-caso"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              6. Monitoramento vs. Manutenção &amp; Caso real
            </a>
            <a
              href="#checklist"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              7. Checklist de 8 sinais de alerta
            </a>
            <a
              href="#faq"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              8. Perguntas frequentes (FAQ)
            </a>
          </div>
        </div>

        <div className="space-y-5 text-slate-700 text-lg leading-relaxed">
          <p>
            Uma usina solar de 8 kWp típica gera cerca de <strong>1.095 kWh por mês</strong> no Sul
            do Brasil. Com tarifa média da concessionária de R$ 0,90/kWh, são aproximadamente{' '}
            <strong>R$ 985 em energia compensada todo mês — R$ 11.826 ao ano</strong>. Sem limpeza
            técnica e sem inspeção periódica, no entanto, a perda de eficiência pode custar{' '}
            <strong>R$ 2.957 por ano</strong> em energia não aproveitada — valor pago diretamente à
            distribuidora sem qualquer consumo adicional.
          </p>

          <blockquote className="my-4 p-5 rounded-2xl bg-amber-50 border-l-4 border-solar-500 text-slate-900 font-bold text-lg italic">
            "Você não economiza essa energia — você simplesmente paga por ela de novo à
            distribuidora, enquanto o sistema continua parecendo normal no dia a dia."
          </blockquote>
        </div>

        {/* CTA 1: APÓS A INTRODUÇÃO */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-solar-300/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-solar-800 block">
              Diagnóstico de Engenharia
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Quer saber a eficiência real da sua usina fotovoltaica?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Nossa equipe de engenheiros em Erechim/RS conduz levantamento técnico com laudo
              assinado pelo Eng. João Victor (CREA-RS 151894).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              onClick={() => handleCtaIntermediario('cta_intro_artigo')}
              className="w-full sm:w-auto bg-solar-500 hover:bg-solar-600 text-midnight-950 font-extrabold px-6 py-5 rounded-xl text-xs sm:text-sm shadow-sm cursor-pointer"
            >
              Solicitar diagnóstico técnico
            </Button>
            <Button
              variant="outline"
              onClick={() => openWhatsAppArtigo('cta_intro_whatsapp')}
              className="w-full sm:w-auto border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-4 py-5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp direto</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. CALCULADORA INTERATIVA DE PERDA DE GERAÇÃO */}
      <section id="calculadora" className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solar-100 text-solar-900 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5 text-solar-600" />
              Ferramenta Interativa
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Quanto a sua usina está perdendo agora?
            </h2>
            <p className="text-slate-600 text-sm">
              Mova os controles deslizantes para os parâmetros da sua usina. Os cálculos consideram
              irradiação, tempo sem intervenção e faixas de referência de O&amp;M fotovoltaico.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#081B30] text-white shadow-2xl border border-white/10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Campo 1: Potência (kWp) com slider não-linear (sensível para sistemas menores), número e equivalente em placas de 550 Wp */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold mb-1">
                  <label htmlFor="input-kwp-range" className="text-slate-200">
                    Potência da usina (kWp)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="input-kwp-num"
                      type="number"
                      min={2}
                      max={200}
                      step={kwp <= 10 ? 0.5 : 1}
                      value={kwp}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (!isNaN(val)) {
                          handleKwpChange(Math.max(2, Math.min(200, val)))
                        }
                      }}
                      className="w-20 px-2 py-1 text-right font-mono font-bold text-sm bg-slate-800 border border-slate-700 rounded-md text-solar-400 focus:outline-hidden focus:border-solar-400"
                      aria-label="Digitar potência da usina em kWp"
                    />
                    <span className="text-slate-400 text-xs font-mono">kWp</span>
                  </div>
                </div>
                <input
                  id="input-kwp-range"
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={kwpToSliderPos(kwp)}
                  onChange={(e) => handleKwpChange(sliderPosToKwp(Number(e.target.value)))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-solar-400"
                  aria-label="Deslizante de potência da usina com escala expandida para pequenos sistemas"
                />
                {/* Equivalente dinâmico em placas de 550 Wp e marcadores da escala */}
                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-solar-500/15 border border-solar-400/30 text-solar-300 font-semibold text-xs">
                    ≈ {Math.round((kwp * 1000) / 550)} placas de 550 Wp
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    2 a 60 kWp (fino) · até 200
                  </span>
                </div>
              </div>

              {/* Campo 2: Tarifa (R$/kWh) — teto R$ 1,20 (CPFL RGE), ajustável para menos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold mb-1">
                  <label htmlFor="input-tarifa-range" className="text-slate-200">
                    Tarifa de energia (R$/kWh)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-xs font-mono">R$</span>
                    <input
                      id="input-tarifa-num"
                      type="number"
                      min={0.4}
                      max={TARIFA_MAX_RGE}
                      step={0.01}
                      value={tarifa}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        if (!isNaN(val)) {
                          handleTarifaChange(Math.max(0.4, Math.min(TARIFA_MAX_RGE, val)))
                        }
                      }}
                      className="w-20 px-2 py-1 text-right font-mono font-bold text-sm bg-slate-800 border border-slate-700 rounded-md text-solar-400 focus:outline-hidden focus:border-solar-400"
                      aria-label="Digitar tarifa em reais por kWh"
                    />
                  </div>
                </div>
                <input
                  id="input-tarifa-range"
                  type="range"
                  min={0.4}
                  max={TARIFA_MAX_RGE}
                  step={0.01}
                  value={tarifa}
                  onChange={(e) => handleTarifaChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-solar-400"
                  aria-label="Deslizante de tarifa em reais por kWh até o limite de R$ 1,20"
                />
                <span className="text-[11px] text-slate-400 block pt-1">
                  Limite em R$ 1,20/kWh (tarifa média CPFL RGE com tributos), ajustável para tarifas
                  menores (ex.: R$ 0,70–0,95 sem bandeira ou rural).
                </span>
              </div>

              {/* Campo 3: Tempo sem limpeza ou manutenção (meses) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold mb-1">
                  <label htmlFor="input-meses" className="text-slate-200">
                    Tempo sem limpeza/manutenção
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="input-meses-num"
                      type="number"
                      min={0}
                      max={36}
                      step={1}
                      value={meses}
                      onChange={(e) => {
                        const val = Number(e.target.value)
                        handleMesesChange(Math.max(0, Math.min(36, val || 0)))
                      }}
                      className="w-16 px-2 py-1 text-right font-mono font-bold text-sm bg-slate-800 border border-slate-700 rounded-md text-solar-400 focus:outline-hidden focus:border-solar-400"
                      aria-label="Digitar tempo em meses sem limpeza"
                    />
                    <span className="text-slate-400 text-xs font-mono">meses</span>
                  </div>
                </div>
                <input
                  id="input-meses"
                  type="range"
                  min={0}
                  max={36}
                  step={1}
                  value={meses}
                  onChange={(e) => handleMesesChange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-solar-400"
                  aria-label="Deslizante de meses sem manutenção"
                />
                <span className="text-[11px] text-slate-400 block pt-1">
                  Meses desde a última limpeza técnica especializada ou vistoria.
                </span>
              </div>
            </div>

            {/* Grid de Resultados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-solar-500/20 to-amber-500/10 border border-solar-400/40 sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-300 block">
                  Perda Anual Estimada
                </span>
                <div className="text-3xl sm:text-4xl font-black text-solar-400 mt-1 font-mono">
                  {fmtBRL(calcResults.perdaAnual)}
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Energia que você gera, mas que não chega a ser injetada e compensada.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Perda Mensal
                </span>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  {fmtBRL(calcResults.perdaMensal)}
                </div>
                <p className="text-xs text-slate-400 mt-1">Média distribuída no ano</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Equivale a
                </span>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  {calcResults.contas.toFixed(1).replace('.', ',')}
                </div>
                <p className="text-xs text-slate-400 mt-1">contas de luz por ano</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Perda Acumulada
                </span>
                <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
                  {fmtBRL(calcResults.acumulado)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Em {calcResults.anos} {calcResults.anos === 1 ? 'ano' : 'anos'} sem intervenção
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Percentual Estimado
                </span>
                <div className="text-2xl font-black text-solar-300 mt-1 font-mono">
                  {Math.round(calcResults.info.p * 100)}%
                </div>
                <p className="text-xs text-slate-400 mt-1">{calcResults.info.faixa}</p>
              </div>
            </div>

            {/* Diagnóstico Contextual */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
                calcResults.info.d === 'ok'
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : calcResults.info.d === 'warn'
                    ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
            >
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{calcResults.info.msg}</span>
            </div>

            {/* Ações da Calculadora */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={() => handleCtaIntermediario('calculadora_diagnostico_btn')}
                className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-5 rounded-xl text-sm shadow-lg cursor-pointer"
              >
                Quero o diagnóstico técnico da Delfos
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyResumo}
                className="border-white/20 text-white hover:bg-white/10 font-medium px-4 py-5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Copiar resumo do cálculo
              </Button>
              <Button
                variant="ghost"
                onClick={handleResetCalc}
                className="text-slate-300 hover:text-white hover:bg-white/5 text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar padrões
              </Button>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
              * Nota de transparência técnica: Os valores calculados são estimativas fundamentadas
              em modelos de O&amp;M e dados de irradiação solar do Sul do Brasil. Não substituem
              vistoria presencial e laudo assinado com ART.
            </p>

            {/* Bloco integrado: Sistemas maiores (50, 120 e 200 kWp) */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-400 block">
                  Escala Comercial, Agro e Industrial
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Impacto em sistemas maiores (50, 120 e 200 kWp)
                </h3>
                <p className="text-xs text-slate-300">
                  Com a mesma tarifa de{' '}
                  <strong className="text-solar-300 font-mono">
                    R$ {calcResults.validTar.toFixed(2).replace('.', ',')}/kWh
                  </strong>{' '}
                  e perda de referência em 12 meses (~20%), veja o montante anual:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    porte: 'Comercial / Supermercado',
                    kwp: 50,
                    placas: Math.round((50 * 1000) / 550),
                    geracaoAnual: 50 * HSP_FIXO_RS * 365,
                    perdaPct: 0.2,
                    destaque: 'Perda anual típica de 1 ano',
                  },
                  {
                    porte: 'Agroindústria / Armazém',
                    kwp: 120,
                    placas: Math.round((120 * 1000) / 550),
                    geracaoAnual: 120 * HSP_FIXO_RS * 365,
                    perdaPct: 0.2,
                    destaque: 'Porte médio corporativo',
                    popular: true,
                  },
                  {
                    porte: 'Indústria / Geração Distribuída',
                    kwp: 200,
                    placas: Math.round((200 * 1000) / 550),
                    geracaoAnual: 200 * HSP_FIXO_RS * 365,
                    perdaPct: 0.2,
                    destaque: 'Teto da calculadora',
                  },
                ].map((cenario, i) => {
                  const valorAnualTotal = cenario.geracaoAnual * calcResults.validTar
                  const perdaEstimada = valorAnualTotal * cenario.perdaPct
                  const perdaMensalCenario = perdaEstimada / 12

                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl flex flex-col justify-between transition-all ${
                        cenario.popular
                          ? 'bg-gradient-to-b from-solar-500/20 to-white/5 border border-solar-400/50 shadow-lg'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-solar-400 px-2 py-0.5 rounded-full bg-solar-500/20 border border-solar-400/30">
                            {cenario.kwp} kWp
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ≈ {cenario.placas} placas
                          </span>
                        </div>

                        <div>
                          <strong className="text-white text-sm block font-bold">
                            {cenario.porte}
                          </strong>
                          <span className="text-[11px] text-slate-300">{cenario.destaque}</span>
                        </div>

                        <div className="pt-2 border-t border-white/10 space-y-0.5">
                          <span className="text-[10px] uppercase tracking-wider text-rose-300 block font-semibold">
                            Perda estimada em 1 ano (~20%)
                          </span>
                          <div className="text-xl font-black text-rose-400 font-mono">
                            {fmtBRL(perdaEstimada)}
                          </div>
                          <span className="text-[11px] text-slate-300 block font-mono">
                            ou ~{fmtBRL(perdaMensalCenario)}/mês
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-white/10 text-[11px] text-slate-400">
                        Produção anual: ~{Math.round(cenario.geracaoAnual).toLocaleString('pt-BR')}{' '}
                        kWh/ano ({fmtBRL(valorAnualTotal)})
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                💡 <strong>Regra de ouro O&amp;M da Delfos:</strong> Em sistemas acima de 50 kWp, o
                custo de um plano semestral de limpeza técnica e termografia se paga já no primeiro
                mês de eficiência recuperada.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. O MITO DA MANUTENÇÃO ZERO */}
      <section id="mito" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
              Mito do Mercado
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              "Placa solar não precisa de manutenção" — a confusão que custa caro
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Esse é provavelmente o argumento comercial mais repetido de forma equivocada. Ele
              nasce da confusão entre <strong>garantia de fabricação</strong> e{' '}
              <strong>manutenção operacional de campo</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border-t-4 border-emerald-500 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                O que a garantia do fabricante cobre
              </h3>
              <p className="text-xs text-slate-500">
                Defeitos originários de fábrica do equipamento
              </p>
              <ul className="space-y-2 text-sm text-slate-700 pt-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  Potência mínima assegurada na curva linear contratual.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  Defeito interno de célula, solda de barramento ou vidro temperado na entrega.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  Falha prematura de componentes dentro do prazo contratado.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border-t-4 border-rose-500 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                O que a garantia NÃO cobre (sua responsabilidade)
              </h3>
              <p className="text-xs text-slate-500">Fatores decorrentes da operação em campo</p>
              <ul className="space-y-2 text-sm text-slate-700 pt-2">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  Sujeira, fuligem, dejetos de aves, polens e maresia aderida.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  Sombreamento novo (árvores que cresceram, caixas d'água construídas depois).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  Conector MC4 frouxo, oxidação ou fixadores com torque insuficiente.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  Estrutura abalada por vendavais sem inspeção preventiva anual.
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p>
              <strong>Degradação precoce (PID/LeTID):</strong> perdas aceleradas por correntes de
              fuga ou falhas de aterramento só podem ser reclamadas ao fabricante se houver ensaios
              de curva I-V documentados conforme a <strong>ABNT NBR 16274</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 3. OS TRÊS PILARES DE PERDA */}
      <section id="pilares" className="py-16 max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
            Engenharia de Campo
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Os três pilares de perda silenciosa
          </h2>
          <p className="text-slate-600 text-sm">
            Cada pilar possui mecanismo físico próprio, sintomas imperceptíveis no aplicativo e
            prejuízo financeiro direto na conta de luz.
          </p>
        </div>

        <div className="space-y-8">
          {/* Pilar 1 */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-solar-100 text-solar-800 flex items-center justify-center font-black">
                01
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pilar 1: Sujeira nas placas (Soiling)
                </h2>
                <span className="text-xs text-slate-500">
                  Mecanismo óptico de atenuação de irradiação
                </span>
              </div>
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Película de poeira e fuligem sobre o vidro temperado
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              A poeira cria uma barreira opaca sobre o vidro temperado. Em regiões com lavouras
              (colheita e dessecação), estradas de terra, polo industrial ou áreas litorâneas, o
              particulado forma uma película pegajosa que a chuva não lava.
            </p>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-solar-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <strong className="text-solar-900 font-bold">
                  Traduzindo em valores reais para a sua usina ({calcResults.validKwp} kWp a R${' '}
                  {calcResults.validTar.toFixed(2).replace('.', ',')}/kWh):
                </strong>
                <span className="text-[11px] text-solar-700 font-mono font-semibold">
                  Geração total: {fmtBRL(calcResults.valorAnualCompensado)}/ano
                </span>
              </div>
              <div>
                • <strong>6% de perda</strong> na sua usina ={' '}
                <strong className="text-amber-800">
                  {fmtBRL(calcResults.valorAnualCompensado * 0.06)}/ano
                </strong>{' '}
                jogados fora (~{fmtBRL((calcResults.valorAnualCompensado * 0.06) / 12)}/mês).
              </div>
              <div>
                • <strong>18% de perda</strong> na sua usina ={' '}
                <strong className="text-amber-900">
                  {fmtBRL(calcResults.valorAnualCompensado * 0.18)}/ano
                </strong>{' '}
                de prejuízo acumulado.
              </div>
              <div className="pt-1 border-t border-amber-200/60 text-slate-600 text-xs">
                • <em>Em escala comparativa comercial/industrial:</em> 18% de perda em 75 kWp ={' '}
                <strong>{fmtBRL(75 * HSP_FIXO_RS * 365 * calcResults.validTar * 0.18)}/ano</strong>;
                em 120 kWp ={' '}
                <strong>{fmtBRL(120 * HSP_FIXO_RS * 365 * calcResults.validTar * 0.18)}/ano</strong>{' '}
                evaporando.
              </div>
            </div>
          </section>

          {/* Pilar 2 */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                02
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pilar 2: Ponto Quente (Hot Spot)
                </h2>
                <span className="text-xs text-slate-500">
                  Mecanismo elétrico de polarização reversa
                </span>
              </div>
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Superaquecimento localizado e risco de arco elétrico
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              Quando uma célula sofre microfissura interna, sombreamento de folhas ou dejetos secos,
              ela para de gerar energia e começa a se comportar como uma resistência pura,
              dissipando calor excessivo. O monitoramento comum não acusa porque a queda na usina é
              diluída na variação diária de irradiação solar.
            </p>
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs sm:text-sm text-slate-800 space-y-1">
              <strong className="text-rose-900 block font-bold">Risco real ao investidor:</strong>
              <div>• Perda contínua de geração: R$ 525 a R$ 1.200/ano.</div>
              <div>• Degradação do encapsulante EVA e risco de quebra de vidro temperado.</div>
              <div>• Risco iminente de arco elétrico e incêndio na cobertura.</div>
            </div>
            <p className="text-xs text-slate-500">
              Detecção oficial: Apenas a{' '}
              <strong>
                inspeção termográfica calibrada conforme a norma internacional IEC 62446-3
              </strong>{' '}
              revela a anomalia em minutos.
            </p>
          </section>

          {/* Pilar 3: Elétrico e Conectores */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                03
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pilar 3: Sistema Elétrico e Conectores
                </h2>
                <span className="text-xs text-slate-500">
                  Conectores MC4, string boxes, DPS e aterramento
                </span>
              </div>
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Degradação de conectores e abertura de strings completas
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              Conectores mal crimpados ou de marcas incompatíveis sofrem resistência de contato
              elevada. A resistência gera aquecimento; o aquecimento deforma o plástico; a
              deformação eleva ainda mais a resistência até a fusão completa. Se uma string com 15
              módulos desconectar, um terço de toda a sua geração para imediatamente.
            </p>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
              <div>
                • Na sua usina ({calcResults.validKwp} kWp): perda de cerca de{' '}
                <strong className="text-amber-900">
                  {fmtBRL(calcResults.valorAnualCompensado * 0.33)}/ano
                </strong>{' '}
                se uma string de 1/3 da potência for desconectada.
              </div>
              <div className="text-xs text-slate-600">
                • Em usinas maiores de referência: 1/3 de perda em 75 kWp ={' '}
                <strong>{fmtBRL(75 * HSP_FIXO_RS * 365 * calcResults.validTar * 0.33)}/ano</strong>;
                em 200 kWp ={' '}
                <strong>{fmtBRL(200 * HSP_FIXO_RS * 365 * calcResults.validTar * 0.33)}/ano</strong>
                .
              </div>
            </div>

            {/* Link consolidado para O&M */}
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>Conheça os protocolos de engenharia e inspeção de campo da Delfos</span>
              <Link
                to="/solucoes/om"
                className="text-solar-700 hover:text-solar-900 font-semibold flex items-center gap-1"
              >
                Conhecer soluções O&amp;M <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </section>
        </div>
      </section>

      {/* 7. O MULTIPLICADOR ESCONDIDO (DIAGRAMA SVG DA STRING) */}
      <section
        id="multiplicador"
        className="py-16 bg-[#081B30] text-white rounded-3xl border border-white/10 shadow-xl my-8"
      >
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-400 block">
              Efeito Composto
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              O multiplicador escondido: a regra da string em série
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Módulos fotovoltaicos em uma mesma fileira elétrica (string) são ligados em série. Na
              física dos circuitos,{' '}
              <strong>
                a corrente elétrica de toda a fileira é limitada pela capacidade do módulo mais
                fraco
              </strong>
              . Um único painel sujo puxa a produção de todos os outros para baixo.
            </p>
          </div>

          {/* Diagrama SVG Semântico */}
          <div className="p-3 sm:p-6 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto w-full">
            <svg
              viewBox="0 0 940 380"
              className="w-full min-w-[700px] h-auto block overflow-visible"
              aria-label="Diagrama de string solar fotovoltaica ligada em série com módulo sombreado limitando a corrente de toda a fileira"
            >
              <defs>
                <linearGradient id="modNormalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E3E62" />
                  <stop offset="100%" stopColor="#0B1E33" />
                </linearGradient>
                <linearGradient id="modSombreadoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C2818" />
                  <stop offset="100%" stopColor="#3A1009" />
                </linearGradient>
                <marker
                  id="setaCorrente"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#F5A623" />
                </marker>
              </defs>

              {/* Título de topo / Banner explicativo da Lei Física */}
              <rect
                x="20"
                y="12"
                width="900"
                height="36"
                rx="8"
                fill="#11253E"
                stroke="#254A74"
                strokeWidth="1"
              />
              <text
                x="470"
                y="35"
                textAnchor="middle"
                fill="#FBD38D"
                fontSize="13"
                fontWeight="bold"
              >
                CIRCUITO EM SÉRIE: TENSÕES SE SOMAM (V_total = Σ V_módulo) • CORRENTE É A MESMA EM
                TODOS (I_string = I_gargalo)
              </text>

              {/* Barramento Superior: Cabos de Ligação em Série (+ no -) */}
              {/* String: Polo Positivo Principal sai do Inversor (à esquerda) */}
              {/* Módulo 1 (x=30): + na esq, - na dir */}
              {/* Módulo 2 (x=180): + na esq, - na dir */}
              {/* Módulo 3 (x=330 - Sombreado): + na esq, - na dir */}
              {/* Módulo 4 (x=480): + na esq, - na dir */}
              {/* Módulo 5 (x=630): + na esq, - na dir */}
              {/* Módulo 6 (x=780): + na esq, - na dir */}

              {/* Fios inter-módulos ligando (-) do anterior ao (+) do próximo */}
              <g stroke="#F5A623" strokeWidth="3" fill="none">
                {/* Mod 1 (-) x=148 para Mod 2 (+) x=180 */}
                <line x1="148" y1="125" x2="180" y2="125" markerEnd="url(#setaCorrente)" />
                {/* Mod 2 (-) x=298 para Mod 3 (+) x=330 */}
                <line x1="298" y1="125" x2="330" y2="125" markerEnd="url(#setaCorrente)" />
                {/* Mod 3 (-) x=448 para Mod 4 (+) x=480 */}
                <line x1="448" y1="125" x2="480" y2="125" markerEnd="url(#setaCorrente)" />
                {/* Mod 4 (-) x=598 para Mod 5 (+) x=630 */}
                <line x1="598" y1="125" x2="630" y2="125" markerEnd="url(#setaCorrente)" />
                {/* Mod 5 (-) x=748 para Mod 6 (+) x=780 */}
                <line x1="748" y1="125" x2="780" y2="125" markerEnd="url(#setaCorrente)" />
              </g>

              {/* Retorno do circuito ao Inversor (cabo negativo de volta pela base) */}
              <path
                d="M 898 125 L 920 125 L 920 230 L 20 230 L 20 125 L 30 125"
                stroke="#64748B"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                fill="none"
              />
              <text
                x="470"
                y="246"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontWeight="bold"
              >
                Retorno do circuito fechado em série ao inversor central / MPPT (CC)
              </text>

              {/* ================= MÓDULO 1 ================= */}
              <g id="mod1">
                <rect
                  x="30"
                  y="65"
                  width="118"
                  height="120"
                  rx="8"
                  fill="url(#modNormalGrad)"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                {/* Grade de células solares */}
                <line x1="30" y1="105" x2="148" y2="105" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="145" x2="148" y2="145" stroke="#334155" strokeWidth="1" />
                <line x1="89" y1="65" x2="89" y2="185" stroke="#334155" strokeWidth="1" />
                {/* Bornes */}
                <circle cx="34" cy="125" r="5" fill="#38BDF8" />
                <text
                  x="34"
                  y="129"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  +
                </text>
                <circle cx="144" cy="125" r="5" fill="#F5A623" />
                <text
                  x="144"
                  y="128"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  -
                </text>
                {/* Textos */}
                <text
                  x="89"
                  y="86"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Módulo 1
                </text>
                <text
                  x="89"
                  y="128"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="12"
                  fontWeight="extrabold"
                >
                  V = 41 V
                </text>
                <text x="89" y="168" textAnchor="middle" fill="#A8B2D1" fontSize="10">
                  Sol pleno
                </text>
              </g>

              {/* ================= MÓDULO 2 ================= */}
              <g id="mod2">
                <rect
                  x="180"
                  y="65"
                  width="118"
                  height="120"
                  rx="8"
                  fill="url(#modNormalGrad)"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <line x1="180" y1="105" x2="298" y2="105" stroke="#334155" strokeWidth="1" />
                <line x1="180" y1="145" x2="298" y2="145" stroke="#334155" strokeWidth="1" />
                <line x1="239" y1="65" x2="239" y2="185" stroke="#334155" strokeWidth="1" />
                <circle cx="184" cy="125" r="5" fill="#38BDF8" />
                <text
                  x="184"
                  y="129"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  +
                </text>
                <circle cx="294" cy="125" r="5" fill="#F5A623" />
                <text
                  x="294"
                  y="128"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  -
                </text>
                <text
                  x="239"
                  y="86"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Módulo 2
                </text>
                <text
                  x="239"
                  y="128"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="12"
                  fontWeight="extrabold"
                >
                  V = 41 V
                </text>
                <text x="239" y="168" textAnchor="middle" fill="#A8B2D1" fontSize="10">
                  Sol pleno
                </text>
              </g>

              {/* ================= MÓDULO 3 (SOMBREADO / GARGALO) ================= */}
              <g id="mod3">
                {/* Destaque com brilho avermelhado de alerta */}
                <rect
                  x="328"
                  y="63"
                  width="122"
                  height="124"
                  rx="10"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                />
                <rect
                  x="330"
                  y="65"
                  width="118"
                  height="120"
                  rx="8"
                  fill="url(#modSombreadoGrad)"
                  stroke="#F87171"
                  strokeWidth="2"
                />
                <line x1="330" y1="105" x2="448" y2="105" stroke="#7F1D1D" strokeWidth="1" />
                <line x1="330" y1="145" x2="448" y2="145" stroke="#7F1D1D" strokeWidth="1" />
                <line x1="389" y1="65" x2="389" y2="185" stroke="#7F1D1D" strokeWidth="1" />
                {/* Ícone de folha/sombra visual */}
                <rect
                  x="350"
                  y="95"
                  width="78"
                  height="30"
                  rx="6"
                  fill="#000000"
                  fillOpacity="0.65"
                />
                <circle cx="334" cy="125" r="5" fill="#38BDF8" />
                <text
                  x="334"
                  y="129"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  +
                </text>
                <circle cx="444" cy="125" r="5" fill="#F5A623" />
                <text
                  x="444"
                  y="128"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  -
                </text>
                <text
                  x="389"
                  y="86"
                  textAnchor="middle"
                  fill="#FECACA"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Módulo 3
                </text>
                <text
                  x="389"
                  y="115"
                  textAnchor="middle"
                  fill="#FCA5A5"
                  fontSize="11"
                  fontWeight="black"
                >
                  SOMBREADO
                </text>
                <text
                  x="389"
                  y="142"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="extrabold"
                >
                  V ≈ 41 V
                </text>
                <text
                  x="389"
                  y="172"
                  textAnchor="middle"
                  fill="#FCA5A5"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Corrente cai a 7A!
                </text>
              </g>

              {/* ================= MÓDULO 4 ================= */}
              <g id="mod4">
                <rect
                  x="480"
                  y="65"
                  width="118"
                  height="120"
                  rx="8"
                  fill="url(#modNormalGrad)"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <line x1="480" y1="105" x2="598" y2="105" stroke="#334155" strokeWidth="1" />
                <line x1="480" y1="145" x2="598" y2="145" stroke="#334155" strokeWidth="1" />
                <line x1="539" y1="65" x2="539" y2="185" stroke="#334155" strokeWidth="1" />
                <circle cx="484" cy="125" r="5" fill="#38BDF8" />
                <text
                  x="484"
                  y="129"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  +
                </text>
                <circle cx="594" cy="125" r="5" fill="#F5A623" />
                <text
                  x="594"
                  y="128"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  -
                </text>
                <text
                  x="539"
                  y="86"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Módulo 4
                </text>
                <text
                  x="539"
                  y="128"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="12"
                  fontWeight="extrabold"
                >
                  V = 41 V
                </text>
                <text x="539" y="168" textAnchor="middle" fill="#A8B2D1" fontSize="10">
                  Sol pleno
                </text>
              </g>

              {/* ================= MÓDULO 5 ================= */}
              <g id="mod5">
                <rect
                  x="630"
                  y="65"
                  width="118"
                  height="120"
                  rx="8"
                  fill="url(#modNormalGrad)"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <line x1="630" y1="105" x2="748" y2="105" stroke="#334155" strokeWidth="1" />
                <line x1="630" y1="145" x2="748" y2="145" stroke="#334155" strokeWidth="1" />
                <line x1="689" y1="65" x2="689" y2="185" stroke="#334155" strokeWidth="1" />
                <circle cx="634" cy="125" r="5" fill="#38BDF8" />
                <text
                  x="634"
                  y="129"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  +
                </text>
                <circle cx="744" cy="125" r="5" fill="#F5A623" />
                <text
                  x="744"
                  y="128"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  -
                </text>
                <text
                  x="689"
                  y="86"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Módulo 5
                </text>
                <text
                  x="689"
                  y="128"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="12"
                  fontWeight="extrabold"
                >
                  V = 41 V
                </text>
                <text x="689" y="168" textAnchor="middle" fill="#A8B2D1" fontSize="10">
                  Sol pleno
                </text>
              </g>

              {/* ================= MÓDULO 6 ================= */}
              <g id="mod6">
                <rect
                  x="780"
                  y="65"
                  width="118"
                  height="120"
                  rx="8"
                  fill="url(#modNormalGrad)"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <line x1="780" y1="105" x2="898" y2="105" stroke="#334155" strokeWidth="1" />
                <line x1="780" y1="145" x2="898" y2="145" stroke="#334155" strokeWidth="1" />
                <line x1="839" y1="65" x2="839" y2="185" stroke="#334155" strokeWidth="1" />
                <circle cx="784" cy="125" r="5" fill="#38BDF8" />
                <text
                  x="784"
                  y="129"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  +
                </text>
                <circle cx="894" cy="125" r="5" fill="#F5A623" />
                <text
                  x="894"
                  y="128"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="9"
                  fontWeight="black"
                >
                  -
                </text>
                <text
                  x="839"
                  y="86"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Módulo 6
                </text>
                <text
                  x="839"
                  y="128"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontSize="12"
                  fontWeight="extrabold"
                >
                  V = 41 V
                </text>
                <text x="839" y="168" textAnchor="middle" fill="#A8B2D1" fontSize="10">
                  Sol pleno
                </text>
              </g>

              {/* Balão de Alerta do Módulo Sombreado */}
              <g>
                <path d="M 389 60 L 389 50" stroke="#EF4444" strokeWidth="2" />
                <rect
                  x="230"
                  y="4"
                  width="318"
                  height="28"
                  rx="6"
                  fill="#7F1D1D"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                />
                <text
                  x="389"
                  y="22"
                  textAnchor="middle"
                  fill="#FEF2F2"
                  fontSize="11"
                  fontWeight="bold"
                >
                  ⚠️ Ponto quente / sujeira: corrente cai de ~13A para ~7A
                </text>
              </g>

              {/* ================= PAINEL DE RESULTADOS (CÁLCULOS TÉCNICOS REAIS) ================= */}
              <rect
                x="20"
                y="265"
                width="900"
                height="100"
                rx="12"
                fill="#0B1E33"
                stroke="#1E3E62"
                strokeWidth="1.5"
              />

              {/* Coluna 1: Tensões se somam */}
              <g transform="translate(40, 275)">
                <text x="0" y="18" fill="#38BDF8" fontSize="12" fontWeight="bold">
                  1. TENSÕES SE SOMAM (V):
                </text>
                <text x="0" y="38" fill="#FFFFFF" fontSize="14" fontWeight="extrabold">
                  V_total = 6 módulos × 41 V ≈ 246 V
                </text>
                <text x="0" y="58" fill="#94A3B8" fontSize="11">
                  A tensão permanece próxima da nominal
                </text>
              </g>

              {/* Coluna 2: Corrente é a mesma (gargalo) */}
              <g transform="translate(360, 275)">
                <text x="0" y="18" fill="#F87171" fontSize="12" fontWeight="bold">
                  2. CORRENTE LIMITADA (I):
                </text>
                <text x="0" y="38" fill="#FCA5A5" fontSize="14" fontWeight="extrabold">
                  I_string = 7 A (era 13 A no sol pleno)
                </text>
                <text x="0" y="58" fill="#FCA5A5" fontSize="11">
                  O módulo sombreado estrangula os outros 5!
                </text>
              </g>

              {/* Coluna 3: Potência Total Despenca */}
              <g transform="translate(680, 275)">
                <text x="0" y="18" fill="#FBBF24" fontSize="12" fontWeight="bold">
                  3. IMPACTO NA POTÊNCIA (P = V × I):
                </text>
                <text x="0" y="38" fill="#FDE68A" fontSize="14" fontWeight="extrabold">
                  Potência cai ~46% na string inteira
                </text>
                <text x="0" y="58" fill="#94A3B8" fontSize="11">
                  De ~3.200 W nominais para ~1.722 W
                </text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* 8. TABELA PROJEÇÃO 5 ANOS E O ARGUMENTO DA SEGURADORA */}
      <section id="seguradora" className="py-16 max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
            Impacto no Retorno Financeiro
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Perda acumulada em 5 anos de operação
          </h2>
          <p className="text-slate-600 text-sm">
            Simulação para a usina de 8 kWp, considerando um custo médio de R$ 1.050 por módulo
            substituído fora da garantia:
          </p>

          {/* Tabela no Desktop / Tablet */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Cenário de Perda</th>
                  <th className="py-3.5 px-4 text-right">Perda Anual</th>
                  <th className="py-3.5 px-4 text-right">Perda em 5 Anos</th>
                  <th className="py-3.5 px-4 text-right">Equivalente em Módulos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium">5% — Sujeira Leve</td>
                  <td className="py-3 px-4 text-right font-mono">R$ 591</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">R$ 2.955</td>
                  <td className="py-3 px-4 text-right text-slate-500">~ 3 módulos novos</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium">12% — Sujeira Moderada</td>
                  <td className="py-3 px-4 text-right font-mono">R$ 1.419</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">R$ 7.095</td>
                  <td className="py-3 px-4 text-right text-slate-500">~ 7 módulos novos</td>
                </tr>
                <tr className="bg-rose-50/60 font-semibold text-rose-900">
                  <td className="py-3 px-4 font-bold">25% — Sujeira Severa + Falhas</td>
                  <td className="py-3 px-4 text-right font-mono">R$ 2.957</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-700">
                    R$ 14.785
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-800">
                    ~ 14 módulos perdidos
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cards responsivos no mobile (perfeitos para 360px sem rolagem horizontal forçada) */}
          <div className="sm:hidden space-y-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-xs">5% — Sujeira Leve</span>
                <span className="text-[11px] font-mono font-bold text-slate-700">R$ 591/ano</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Perda em 5 anos:</span>
                <span className="font-mono font-bold text-slate-900">R$ 2.955</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>Impacto:</span>
                <span>~ 3 módulos novos</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 text-xs">12% — Sujeira Moderada</span>
                <span className="text-[11px] font-mono font-bold text-slate-700">R$ 1.419/ano</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Perda em 5 anos:</span>
                <span className="font-mono font-bold text-slate-900">R$ 7.095</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>Impacto:</span>
                <span>~ 7 módulos novos</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-rose-200/60 pb-2">
                <span className="font-extrabold text-rose-950 text-xs">25% — Severa + Falhas</span>
                <span className="text-[11px] font-mono font-bold text-rose-700">R$ 2.957/ano</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-800 font-medium">Perda em 5 anos:</span>
                <span className="font-mono font-extrabold text-rose-700">R$ 14.785</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-rose-800 font-bold pt-0.5">
                <span>Impacto:</span>
                <span>~ 14 módulos perdidos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box da Seguradora */}
        <div className="p-8 rounded-3xl bg-amber-50/80 border-2 border-solar-400/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-solar-400 text-midnight-950 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-800 block">
              Proteção do Patrimônio
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              O argumento decisivo da seguradora
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              As principais companhias seguradoras de usinas solares comerciais e industriais exigem
              a comprovação de{' '}
              <strong>manutenção preventiva periódica e laudo técnico com ART do CREA-RS</strong>.
              Em caso de sinistro por incêndio ou destelhamento em vendaval, a ausência do histórico
              de manutenção é o motivo mais frequente de recusa de indenização.
            </p>
            <div className="pt-2 text-sm font-bold text-solar-900 italic">
              "O plano de manutenção da Delfos Engenharia é a documentação formal que garante o
              funcionamento da sua apólice de seguro."
            </div>
          </div>
        </div>
      </section>

      {/* 6. MONITORAMENTO VS. MANUTENÇÃO & ESTUDO DE CASO REAL */}
      <section id="monitoramento-caso" className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Abertura: Monitoramento vs Manutenção */}
          <div className="space-y-6">
            <div className="space-y-3 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                Diferença Essencial
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Monitoramento vs. Manutenção Preventiva
              </h2>
              <p className="text-slate-600 text-sm">
                O aplicativo do inversor responde o que aconteceu, mas não previne o que está
                prestes a falhar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h3 className="text-base font-bold text-slate-900">O que o aplicativo responde:</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>O sistema está produzindo neste momento?</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Qual a tensão e corrente totais do inversor?</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>O inversor está conectado ao Wi-Fi?</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-[#081B30] text-white border border-white/10 space-y-3">
                <h3 className="text-base font-bold text-solar-400">
                  O que apenas a inspeção em campo revela:
                </h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0" />
                    <span>Há pontos quentes (hotspots) invisíveis nas células?</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0" />
                    <span>Os conectores MC4 estão sofrendo aquecimento?</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0" />
                    <span>Os parafusos da estrutura perderam torque de aperto?</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-solar-400 to-amber-500 text-midnight-950 font-black text-center text-base sm:text-lg shadow-md">
              O monitoramento avisa quando o sistema já parou. A manutenção evita que ele pare.
            </div>
          </div>

          {/* Estudo de caso de campo */}
          <div className="space-y-6 pt-4 border-t border-slate-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
                Caso Real de Campo
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Quando o aplicativo não alarmou, a termografia resolveu
              </h3>
              <p className="text-slate-600 text-sm">
                Exemplo representativo da atuação de O&amp;M da Delfos em usina comercial:
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <span className="px-3 py-1 rounded-full bg-[#081B30] text-solar-300 text-xs font-bold">
                  Usina Comercial · 75 kWp (Norte do RS)
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Recuperação de 5,5% da Geração
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    Contexto
                  </span>
                  <p className="text-xs text-slate-700 mt-1">
                    Cobertura metálica industrial, 2 anos em operação, monitoramento via Wi-Fi sem
                    alertas.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-rose-600 uppercase block">
                    Sintoma
                  </span>
                  <p className="text-xs text-slate-700 mt-1">
                    Queda gradual de 6% na conta nos últimos 5 meses sem mudança no padrão de
                    consumo.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-amber-600 uppercase block">
                    Diagnóstico
                  </span>
                  <p className="text-xs text-slate-700 mt-1">
                    Termografia detectou 2 módulos com superaquecimento de 38°C acima da média por
                    nova sombra de duto.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase block">
                    Resultado
                  </span>
                  <div className="text-xl font-black text-emerald-700 mt-0.5">R$ 6.100/ano</div>
                  <p className="text-[11px] text-emerald-800">
                    recuperados após rebalanceamento de string
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                * Caso técnico representativo estruturado pela engenharia de O&amp;M da Delfos com
                base em rotinas de campo no Rio Grande do Sul e Santa Catarina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CHECKLIST INTERATIVO DE 8 SINAIS DE ALERTA COM SCORE */}
      <section id="checklist" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
              Autoavaliação da Usina
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Checklist: 8 sinais de alerta na sua instalação
            </h2>
            <p className="text-slate-600 text-sm">
              Marque os itens que você já observou na sua propriedade para calcular o nível de
              atenção requerido:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lista de itens */}
            <div className="lg:col-span-7 space-y-3">
              {checklistItems.map((item, idx) => {
                const isChecked = checkedAlerts[idx]
                return (
                  <label
                    key={idx}
                    onClick={() => handleToggleCheck(idx)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-rose-50/70 border-rose-400 text-rose-950 font-medium shadow-xs'
                        : 'bg-white border-slate-200 hover:border-solar-400 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer shrink-0"
                    />
                    <span className="text-sm leading-snug">{item}</span>
                  </label>
                )
              })}
            </div>

            {/* Placar / Score fixo */}
            <div className="lg:col-span-5 sticky top-28 p-6 rounded-3xl bg-[#081B30] text-white shadow-xl border border-white/10 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Sinais Detectados
                </span>
                <div className="text-4xl font-black text-solar-400 font-mono mt-1">
                  {totalChecks} <span className="text-xl text-slate-400 font-normal">de 8</span>
                </div>
              </div>

              {/* Barra de progresso do score */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-solar-400 via-amber-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${(totalChecks / 8) * 100}%` }}
                />
              </div>

              {/* Mensagem e recomendação */}
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed font-semibold ${checklistFeedback.color}`}
              >
                <div className="font-bold uppercase tracking-wider text-[10px] mb-1">
                  {checklistFeedback.badge}
                </div>
                {checklistFeedback.text}
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => handleCtaIntermediario('checklist_score_btn')}
                  className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs py-5 rounded-xl shadow-md cursor-pointer"
                >
                  Agendar vistoria da usina
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setCheckedAlerts(new Array(checklistItems.length).fill(false))}
                  className="w-full text-slate-400 hover:text-white text-xs"
                >
                  Limpar seleções
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. PERGUNTAS FREQUENTES (FAQ COM ACCORDION) */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-6 space-y-8">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
            Tira-Dúvidas Técnico
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Perguntas frequentes sobre manutenção solar
          </h2>
          <p className="text-slate-600 text-sm">
            Respostas práticas da equipe de engenharia elétrica da Delfos Engenharia:
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'De quanto em quanto tempo devo limpar os painéis solares no Sul?',
              a: 'Recomenda-se a limpeza técnica entre 2 e 4 vezes por ano. A frequência ideal varia com a proximidade de lavouras em época de plantio/colheita, estradas de chão batido, presença de aves e áreas com maresia no litoral gaúcho e catarinense.',
            },
            {
              q: 'Lavar as placas com mangueira ou lavadora de alta pressão resolve?',
              a: 'Não é recomendado. Água comum da rede ou de poço artesiano contém calcário e sais que mancham o vidro. Lavadoras de alta pressão danificam o revestimento antirreflexo (ARC) e podem descolar a vedação de silicone dos módulos. O protocolo exige água tratada ou desmineralizada e escovas rotativas especiais com cerdas macias.',
            },
            {
              q: 'O aplicativo do inversor diz que está tudo normal. Posso confiar 100%?',
              a: 'Não. O monitoramento mede a geração acumulada do inversor, mas não tem como identificar pontos quentes pontuais, diodos de bypass avariados ou parafusos soltos pela vibração do vento. Apenas a inspeção física e a câmera termográfica revelam esses defeitos antes que virem prejuízo irreversível.',
            },
            {
              q: 'O plano de manutenção da Delfos substitui módulos queimados?',
              a: 'A Delfos identifica os módulos defeituosos, emite o laudo pericial para troca em garantia junto ao fabricante e executa a logística e substituição técnica em campo. Caso o módulo esteja fora da garantia, fornecemos o orçamento do componente novo a preço de custo do fabricante.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-solar-600 transition-colors cursor-pointer"
                >
                  <span className="text-base leading-snug">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-solar-600 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 13. FORMULÁRIO DE CAPTURA DE 4 CAMPOS (ITEM 5 DA ORIENTAÇÃO) */}
      <section className="py-12 max-w-4xl mx-auto px-6">
        <FormCapturaArtigo origem="artigo-manutencao-placa-solar" potenciaInicialKwp={kwp} />
      </section>

      {/* 14. CTA FINAL COM BLOCO DE PROVA SOCIAL OFICIAL */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#081B30] via-[#0F2A47] to-[#1a446c] text-white shadow-2xl border border-white/15 relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-solar-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-300 block">
              Próximo Passo com a Engenharia
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Sua usina está gerando exatamente o que foi projetada para gerar?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              O diagnóstico técnico de O&amp;M da <strong>Delfos Engenharia</strong> tem escopo
              formal: inspeção presencial, termografia calibrada, medição de resistência e laudo com
              ART assinado pelo responsável técnico{' '}
              <Link
                to="/conteudos/autor/joao-victor-bagetti-fuchs"
                className="text-solar-300 font-bold underline underline-offset-2 hover:text-white"
              >
                Eng. João Victor Bagetti Fuchs (CREA-RS 151894)
              </Link>
              .
            </p>
          </div>

          {/* BLOCO DE PROVA SOCIAL COM NÚMEROS OFICIAIS DO SITE */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
              <span className="text-2xl sm:text-3xl font-black text-solar-400 block font-mono">
                12,05 MWp
              </span>
              <span className="text-[11px] text-slate-300 font-medium">Potência instalada</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block font-mono">
                468 usinas
              </span>
              <span className="text-[11px] text-slate-300 font-medium">Sob monitoramento</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
              <span className="text-2xl sm:text-3xl font-black text-white block font-mono">
                12 anos
              </span>
              <span className="text-[11px] text-slate-300 font-medium">De engenharia de campo</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-300 block font-mono">
                4.9 / 5
              </span>
              <span className="text-[11px] text-slate-300 font-medium">Nota Google Reviews</span>
            </div>
          </div>

          {/* AÇÕES FINAIS (SEM 'sem compromisso' OU 'avaliação gratuita') */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 relative z-10">
            <Button
              onClick={() => handleCtaIntermediario('cta_final_artigo')}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black px-8 py-6 rounded-xl text-sm sm:text-base shadow-xl cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Solicitar diagnóstico técnico</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => openWhatsAppArtigo('cta_final_whatsapp')}
              className="border-white/30 text-white hover:bg-white/10 px-6 py-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Falar com o engenheiro no WhatsApp</span>
            </Button>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <span>• Atendimento em todo o Rio Grande do Sul e Santa Catarina</span>
            <span>• Equipe técnica própria credenciada no CREA-RS</span>
            <Link
              to="/sobre"
              className="text-solar-300 hover:text-white underline underline-offset-2"
            >
              Conhecer a Delfos Engenharia &rarr;
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
