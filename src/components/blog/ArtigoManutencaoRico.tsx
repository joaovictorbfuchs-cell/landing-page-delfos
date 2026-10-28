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
  Activity,
  Award,
  ChevronDown,
  Copy,
  RotateCcw,
  Sparkles,
  Phone,
  Layers,
  FileCheck,
  Zap,
  UserCheck,
  ExternalLink,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import FormCapturaArtigo from '@/components/blog/FormCapturaArtigo'
import { trackCtaClick, trackCalculatorUsed, trackWhatsappClick } from '@/lib/analytics'

interface ArtigoManutencaoRicoProps {
  onSolicitarDiagnostico: () => void
}

export default function ArtigoManutencaoRico({
  onSolicitarDiagnostico,
}: ArtigoManutencaoRicoProps) {
  const { toast } = useToast()

  // Calculadora state
  const [kwp, setKwp] = useState<number>(8)
  const [tarifa, setTarifa] = useState<number>(0.9)
  const [hsp, setHsp] = useState<number>(4.5)
  const [meses, setMeses] = useState<number>(12)

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

  // Bars hover state
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  // Faixas técnicas de perda
  const percentFor = (m: number) => {
    if (m <= 6)
      return {
        p: 0.03,
        faixa: 'Faixa 0–6 meses',
        d: 'ok',
        msg: 'Perda moderada (aprox. 3%). Mantenha o monitoramento ativo.',
      }
    if (m <= 12)
      return {
        p: 0.06,
        faixa: 'Faixa 7–12 meses',
        d: 'ok',
        msg: 'Perda moderada (aprox. 6%). Recomendamos agendar limpeza técnica e inspeção visual.',
      }
    if (m <= 18)
      return {
        p: 0.1,
        faixa: 'Faixa 13–18 meses',
        d: 'warn',
        msg: 'Perda relevante (aprox. 10%). Sua usina necessita de inspeção termográfica.',
      }
    if (m <= 24)
      return {
        p: 0.15,
        faixa: 'Faixa 19–24 meses',
        d: 'warn',
        msg: 'Perda relevante e crescente (aprox. 15%). Priorize inspeção termográfica e elétrica.',
      }
    if (m <= 30)
      return {
        p: 0.2,
        faixa: 'Faixa 25–30 meses',
        d: 'bad',
        msg: 'Perda alta (aprox. 20%). Solicite diagnóstico técnico de engenharia com urgência.',
      }
    return {
      p: 0.25,
      faixa: 'Faixa 31–36 meses',
      d: 'bad',
      msg: 'Perda severa (aprox. 25%). Sua usina está destruindo retorno financeiro.',
    }
  }

  const calcResults = useMemo(() => {
    const validKwp = Math.max(2, kwp || 0)
    const validTar = Math.max(0.4, tarifa || 0)
    const validHsp = Math.max(3.5, hsp || 0)
    const validMeses = Math.max(0, Math.min(36, meses || 0))

    const geracaoMensal = validKwp * validHsp * 30
    const geracaoAnual = validKwp * validHsp * 365
    const info = percentFor(validMeses)
    const perdaAnual = geracaoAnual * validTar * info.p
    const perdaMensal = perdaAnual / 12
    const contas = geracaoMensal * validTar > 0 ? perdaAnual / (geracaoMensal * validTar) : 0
    const anos = Math.max(1, Math.round(validMeses / 12))
    const acumulado = perdaAnual * anos

    return {
      validKwp,
      validTar,
      validHsp,
      validMeses,
      geracaoAnual,
      geracaoMensal,
      perdaAnual,
      perdaMensal,
      contas,
      acumulado,
      anos,
      info,
    }
  }, [kwp, tarifa, hsp, meses])

  const fmtBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(Math.round(val))
  }

  const handleResetCalc = () => {
    setKwp(8)
    setTarifa(0.9)
    setHsp(4.5)
    setMeses(12)
    toast({
      title: 'Padrões restaurados',
      description: 'Valores da calculadora retornados para 8 kWp e 12 meses.',
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
    const msg =
      'Olá! Li o artigo sobre manutenção de placas solares e quero saber mais sobre o diagnóstico da minha usina.'
    trackWhatsappClick(origemCta, msg)
    const cleanPhone = '5554991292121'
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
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
                Publicado: 14 de Março de 2025
              </span>
              <span>•</span>
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Atualizado: Março/2025
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
              1. Calculadora interativa de perda
            </a>
            <a
              href="#escala"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              2. Quanto custa cada nível de perda
            </a>
            <a
              href="#mito"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              3. O mito da manutenção zero
            </a>
            <a
              href="#pilares"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              4. Os cinco pilares de perda
            </a>
            <a
              href="#multiplicador"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              5. O multiplicador escondido (string)
            </a>
            <a
              href="#seguradora"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              6. O argumento da seguradora
            </a>
            <a
              href="#monitoramento"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              7. Monitoramento vs. Manutenção
            </a>
            <a
              href="#caso"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              8. Estudo de caso de campo (75 kWp)
            </a>
            <a
              href="#planos"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              9. Os três planos Delfos de O&amp;M
            </a>
            <a
              href="#checklist"
              className="hover:text-solar-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-solar-500" />
              10. Checklist de 8 sinais de alerta
            </a>
          </div>
        </div>

        <div className="space-y-5 text-slate-700 text-lg leading-relaxed">
          <p>
            Uma usina solar de 8 kWp típica gera cerca de <strong>1.095 kWh por mês</strong> no Sul
            do Brasil. Com tarifa média da concessionária de R$ 0,90/kWh, são aproximadamente{' '}
            <strong>R$ 985 em energia compensada todo mês — R$ 11.826 ao ano</strong>. É um retorno
            financeiro substancial que parece automático e por isso quase nunca é questionado no dia
            a dia.
          </p>
          <p>
            O problema é que um sistema sem limpeza técnica e sem inspeção periódica pode acumular{' '}
            <strong>até 25% de perda contínua na geração</strong>. Em uma usina de apenas 8 kWp,
            isso significa <strong>R$ 2.957 por ano evaporando</strong>: o equivalente exato a três
            faturas inteiras de energia pagas sem que você consuma um único kWh a mais.
          </p>

          <blockquote className="my-6 p-6 rounded-2xl bg-amber-50 border-l-4 border-solar-500 text-slate-900 font-bold text-xl italic">
            "Você não economiza essa energia — você simplesmente paga por ela de novo à
            distribuidora, enquanto o aplicativo continua exibindo status 'online'."
          </blockquote>

          <p>
            Abaixo, apresentamos as ferramentas práticas e a engenharia envolvida para diagnosticar
            o estado da sua usina e proteger seu patrimônio fotovoltaico.
          </p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controles da esquerda */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold mb-2">
                    <label htmlFor="input-kwp" className="text-slate-200">
                      Potência da usina (kWp)
                    </label>
                    <span className="text-solar-400 font-bold font-mono text-base">{kwp} kWp</span>
                  </div>
                  <input
                    id="input-kwp"
                    type="range"
                    min={2}
                    max={500}
                    step={1}
                    value={kwp}
                    onChange={(e) => handleKwpChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-solar-400"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Potência nominal instalada dos módulos (2 a 500 kWp).
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-semibold mb-2">
                    <label htmlFor="input-tarifa" className="text-slate-200">
                      Tarifa de energia (R$/kWh)
                    </label>
                    <span className="text-solar-400 font-bold font-mono text-base">
                      R$ {tarifa.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <input
                    id="input-tarifa"
                    type="range"
                    min={0.4}
                    max={1.4}
                    step={0.05}
                    value={tarifa}
                    onChange={(e) => setTarifa(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-solar-400"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Valor médio da tarifa cheia com tributos (RGE/concessionária local).
                  </span>
                </div>
              </div>

              {/* Controles da direita */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm font-semibold mb-2">
                    <label htmlFor="input-hsp" className="text-slate-200">
                      HSP — Horas de Sol Pleno diárias
                    </label>
                    <span className="text-solar-400 font-bold font-mono text-base">
                      {hsp.toFixed(1)} h/dia
                    </span>
                  </div>
                  <input
                    id="input-hsp"
                    type="range"
                    min={3.5}
                    max={6.0}
                    step={0.1}
                    value={hsp}
                    onChange={(e) => setHsp(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-solar-400"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Média no RS: 4,2 a 4,7 kWh/m² por dia.
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm font-semibold mb-2">
                    <label htmlFor="input-meses" className="text-slate-200">
                      Tempo sem limpeza ou manutenção
                    </label>
                    <span className="text-solar-400 font-bold font-mono text-base">
                      {meses} meses
                    </span>
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
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Meses desde a última limpeza técnica especializada ou inspeção.
                  </span>
                </div>
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
          </div>
        </div>
      </section>

      {/* 4. ESCALA REAL DE PERDA - BARRAS INTERATIVAS */}
      <section id="escala" className="py-16 max-w-4xl mx-auto px-6 space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
            Escala Real de Perda
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Quanto custa cada nível de degradação
          </h2>
          <p className="text-slate-600 text-base">
            Cinco cenários simulados para a usina de referência de 8 kWp com tarifa de R$ 0,90/kWh:
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              cenario: 'Cenário 1 — Sujeira leve',
              desc: 'Chuva regular, poeira urbana leve sem acúmulo',
              pct: '2% a 5%',
              reais: 'R$ 237 a R$ 591/ano',
              width: '18%',
              color: 'from-emerald-400 to-emerald-600',
            },
            {
              cenario: 'Cenário 2 — Sujeira moderada',
              desc: '12+ meses sem limpeza, fuligem ou pó agrícola',
              pct: '6% a 12%',
              reais: 'R$ 710 a R$ 1.419/ano',
              width: '38%',
              color: 'from-amber-400 to-amber-600',
            },
            {
              cenario: 'Cenário 3 — Sujeira severa',
              desc: '24+ meses, poeira pesada, estiagem ou dejetos',
              pct: '15% a 25%',
              reais: 'R$ 1.774 a R$ 2.957/ano',
              width: '62%',
              color: 'from-orange-500 to-rose-500',
            },
            {
              cenario: 'Cenário 4 — Severa + Ponto Quente',
              desc: 'String prejudicada somada à sujeira acumulada',
              pct: '25% a 35%',
              reais: 'R$ 2.957 a R$ 4.139/ano',
              width: '82%',
              color: 'from-rose-500 to-red-600',
            },
            {
              cenario: 'Cenário 5 — Sem manutenção 3+ anos',
              desc: 'Múltiplos pontos quentes e conector em falha elétrica',
              pct: 'Acima de 35%',
              reais: 'Mais de R$ 4.139/ano',
              width: '100%',
              color: 'from-red-600 to-red-800',
            },
          ].map((bar, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                <div>
                  <strong className="text-slate-900 block">{bar.cenario}</strong>
                  <span className="text-xs text-slate-500">{bar.desc}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 block">{bar.pct}</span>
                  <span className="text-xs text-rose-600 font-semibold">{bar.reais}</span>
                </div>
              </div>

              <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${bar.color} transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-xs`}
                  style={{ width: bar.width }}
                >
                  {hoveredBar === idx && <span className="drop-shadow-xs">{bar.pct}</span>}
                </div>
              </div>
            </div>
          ))}
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

          <p className="text-xs text-slate-500 pt-2">
            Base técnica de conformidade: <strong>ABNT NBR 16274</strong> (Documentação, ensaios de
            comissionamento e inspeção de sistemas fotovoltaicos conectados à rede).
          </p>
        </div>
      </section>

      {/* 6. OS CINCO PILARES DE PERDA */}
      <section id="pilares" className="py-16 max-w-4xl mx-auto px-6 space-y-12">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
            Engenharia de Campo
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Os cinco pilares de perda silenciosa
          </h2>
          <p className="text-slate-600 text-sm">
            Cada pilar possui mecanismo físico próprio, sintomas imperceptíveis no aplicativo e
            prejuízo financeiro direto na conta de luz.
          </p>
        </div>

        <div className="space-y-8">
          {/* Pilar 1 (H2 semântico conforme item 3 da orientação) */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-solar-100 text-solar-800 flex items-center justify-center font-black">
                01
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pilar 1: Sujeira nas placas (Soiling) — A perda que chega a 25%
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
            <div className="p-4 rounded-xl bg-amber-50/70 border border-solar-200 text-xs sm:text-sm text-slate-800 space-y-1">
              <strong className="text-solar-900 block font-bold">
                Traduzindo em valores reais:
              </strong>
              <div>
                • 6% de perda em 8 kWp = <strong>R$ 710/ano</strong> jogados fora.
              </div>
              <div>
                • 18% de perda em 8 kWp = <strong>R$ 2.129/ano</strong> de prejuízo.
              </div>
              <div>
                • 18% de perda em usina de 75 kWp = <strong>R$ 19.970/ano</strong> evaporando.
              </div>
            </div>

            {/* Espaço preparado para futuro artigo satélite do Pilar 1 */}
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>
                Artigo satélite: <em>Guia de Limpeza de Módulos Solares no Sul</em> (em breve)
              </span>
              <Link
                to="/solucoes/om"
                className="text-solar-700 hover:text-solar-900 font-semibold flex items-center gap-1"
              >
                Conhecer protocolo de limpeza <ChevronRight className="w-3 h-3" />
              </Link>
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
                  Pilar 2: Ponto Quente (Hot Spot) — O perigo invisível ao aplicativo
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
              dissipando calor excessivo. O aplicativo não avisa porque a queda percentual na usina
              é diluída na variação diária de nuvens.
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

            {/* Espaço preparado para futuro artigo satélite do Pilar 2 */}
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>
                Artigo satélite: <em>Termografia Fotovoltaica com Drone: Guia IEC 62446-3</em> (em
                breve)
              </span>
              <Link
                to="/solucoes/om"
                className="text-solar-700 hover:text-solar-900 font-semibold flex items-center gap-1"
              >
                Laudo termográfico <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </section>

          {/* Pilar 3 */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                03
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pilar 3: Degradação Acelerada (PID, LeTID e Delaminação)
                </h2>
                <span className="text-xs text-slate-500">Mecanismo físico-químico celular</span>
              </div>
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Perdas moleculares e correntes de fuga induzidas
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              A degradação natural de um módulo fotovoltaico é de cerca de 0,5% a 0,7% ao ano. No
              entanto, correntes de fuga (PID — degradação induzida por potencial) e falhas no
              aterramento aceleram essa perda para 3% a 5% ao ano sem nenhum sinal visível a olho
              nu.
            </p>
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-slate-800">
              Sem os ensaios de curva I-V do comissionamento inicial (ABNT NBR 16274), o
              proprietário não consegue comprovar a perda para acionar a garantia junto ao
              fabricante.
            </div>

            {/* Espaço preparado para futuro artigo satélite do Pilar 3 */}
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>
                Artigo satélite: <em>Degradação PID e Como Acionar a Garantia do Fabricante</em> (em
                breve)
              </span>
              <Link
                to="/solucoes/om"
                className="text-solar-700 hover:text-solar-900 font-semibold flex items-center gap-1"
              >
                Curva I-V e comissionamento <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </section>

          {/* CTA 2: APÓS O PILAR 3 (CONFORME ORIENTAÇÃO DE CONVERSÃO DO USUÁRIO) */}
          <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#081B30] to-[#123154] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-400 block">
                Engenharia de Precisão
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Sua usina já passou por ensaio de curva I-V ou termografia?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Identifique desvios em minutos antes que o rendimento da sua instalação caia de
                forma irreversível.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Button
                onClick={() => handleCtaIntermediario('cta_pos_pilar3')}
                className="w-full sm:w-auto bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-6 py-5 rounded-xl text-xs sm:text-sm shadow-md cursor-pointer"
              >
                Solicitar vistoria técnica
              </Button>
              <Button
                variant="outline"
                onClick={() => openWhatsAppArtigo('cta_pos_pilar3_whatsapp')}
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-4 py-5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>

          {/* Pilar 4 */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                04
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pilar 4: Estrutura e Fixadores — O risco que ameaça a cobertura
                </h2>
                <span className="text-xs text-slate-500">
                  Mecanismo mecânico e dilatação térmica
                </span>
              </div>
            </div>

            <h3 className="text-base font-semibold text-slate-800">
              Vibração por vendavais e perda de torque nos grampos
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              No Sul do Brasil, as variações térmicas drásticas (dias de 35°C e noites frias),
              somadas a rajadas de vento frequentes, provocam afrouxamento gradual dos grampos
              intermediários e terminais de fixação. Um módulo solto pode voar com o vendaval ou
              provocar trincas nas telhas, gerando infiltrações milionárias.
            </p>
            <p className="text-xs text-slate-500">
              Inspeção preventiva: Reaperto anual com <strong>torquímetro aferido</strong> em todos
              os parafusos estruturais.
            </p>

            {/* Espaço preparado para futuro artigo satélite do Pilar 4 */}
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>
                Artigo satélite: <em>Inspeção Estrutural de Telhados Solares no Sul</em> (em breve)
              </span>
              <Link
                to="/solucoes/om"
                className="text-solar-700 hover:text-solar-900 font-semibold flex items-center gap-1"
              >
                Laudo estrutural <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </section>

          {/* Pilar 5 */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                05
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pilar 5: Sistema Elétrico — O pilar de maior impacto financeiro
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
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 space-y-1">
              <div>
                • Em 8 kWp: perda de <strong>R$ 3.900/ano</strong> por string aberta.
              </div>
              <div>
                • Em usina de 500 kWp: prejuízo de <strong>R$ 23.600/ano</strong>.
              </div>
            </div>

            {/* Espaço preparado para futuro artigo satélite do Pilar 5 */}
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <span>
                Artigo satélite: <em>Conectores MC4 e Riscos de Arco Elétrico</em> (em breve)
              </span>
              <Link
                to="/solucoes/om"
                className="text-solar-700 hover:text-solar-900 font-semibold flex items-center gap-1"
              >
                Inspeção elétrica O&amp;M <ChevronRight className="w-3 h-3" />
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
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">
            <svg
              viewBox="0 0 720 220"
              className="w-full min-w-[580px] h-auto block"
              aria-label="Módulo fotovoltaico com sujeira acumulada comparado a módulo limpo em fileira em série"
            >
              <defs>
                <linearGradient id="delfosModNormal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E3E62" />
                  <stop offset="100%" stopColor="#0B1E33" />
                </linearGradient>
                <linearGradient id="delfosModHot" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E4572E" />
                  <stop offset="100%" stopColor="#F5A623" />
                </linearGradient>
              </defs>

              {/* Módulos */}
              <rect
                x="24"
                y="55"
                width="96"
                height="75"
                rx="8"
                fill="url(#delfosModNormal)"
                stroke="#F5A623"
                strokeOpacity="0.5"
                strokeWidth="2"
              />
              <text
                x="72"
                y="98"
                fill="#A8B2D1"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
              >
                Módulo 1 (100%)
              </text>

              <rect
                x="150"
                y="55"
                width="96"
                height="75"
                rx="8"
                fill="url(#delfosModNormal)"
                stroke="#F5A623"
                strokeOpacity="0.5"
                strokeWidth="2"
              />
              <text
                x="198"
                y="98"
                fill="#A8B2D1"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
              >
                Módulo 2 (100%)
              </text>

              {/* Módulo Danificado / Afetado */}
              <rect
                x="276"
                y="55"
                width="96"
                height="75"
                rx="8"
                fill="url(#delfosModHot)"
                stroke="#E4572E"
                strokeWidth="2.5"
              />
              <text
                x="324"
                y="92"
                fill="#FFFFFF"
                fontSize="11"
                textAnchor="middle"
                fontWeight="black"
              >
                Módulo 3 (70%)
              </text>
              <text x="324" y="108" fill="#FFE2D8" fontSize="9" textAnchor="middle">
                Sujo / Ponto Quente
              </text>

              <rect
                x="402"
                y="55"
                width="96"
                height="75"
                rx="8"
                fill="url(#delfosModNormal)"
                stroke="#F5A623"
                strokeOpacity="0.5"
                strokeWidth="2"
              />
              <text
                x="450"
                y="98"
                fill="#A8B2D1"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
              >
                Módulo 4 (100%)
              </text>

              <rect
                x="528"
                y="55"
                width="96"
                height="75"
                rx="8"
                fill="url(#delfosModNormal)"
                stroke="#F5A623"
                strokeOpacity="0.5"
                strokeWidth="2"
              />
              <text
                x="576"
                y="98"
                fill="#A8B2D1"
                fontSize="11"
                textAnchor="middle"
                fontWeight="bold"
              >
                Módulo 5 (100%)
              </text>

              <rect
                x="654"
                y="55"
                width="50"
                height="75"
                rx="8"
                fill="url(#delfosModNormal)"
                stroke="#F5A623"
                strokeOpacity="0.5"
                strokeWidth="2"
              />
              <text x="679" y="98" fill="#A8B2D1" fontSize="10" textAnchor="middle">
                ...
              </text>

              {/* Conexões em série */}
              <g stroke="#FFB83D" strokeWidth="3" fill="none">
                <line x1="120" y1="92" x2="150" y2="92" />
                <line x1="246" y1="92" x2="276" y2="92" />
                <line x1="372" y1="92" x2="402" y2="92" />
                <line x1="498" y1="92" x2="528" y2="92" />
                <line x1="624" y1="92" x2="654" y2="92" />
              </g>

              {/* Linha indicadora */}
              <path
                d="M324 45 Q 324 20 295 20"
                stroke="#E4572E"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
              />
              <text
                x="324"
                y="16"
                textAnchor="middle"
                fill="#FFB4A0"
                fontSize="12"
                fontWeight="bold"
              >
                Módulo afetado limita a corrente da string inteira
              </text>

              {/* Barramento inferior */}
              <text
                x="360"
                y="165"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="14"
                fontWeight="bold"
              >
                Resultado real: todos os módulos geram no máximo 70% da capacidade
              </text>
              <line
                x1="40"
                y1="185"
                x2="680"
                y2="185"
                stroke="#F5A623"
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <text x="360" y="202" textAnchor="middle" fill="#A8B2D1" fontSize="11">
                Uma sujeira de 15% em um painel provoca perda composta de mais de 20% no arranjo.
              </text>
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

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
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

      {/* 9. MONITORAMENTO VS. MANUTENÇÃO */}
      <section id="monitoramento" className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
              Diferença Essencial
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Monitoramento vs. Manutenção Preventiva
            </h2>
            <p className="text-slate-600 text-sm">
              O aplicativo do inversor responde o que aconteceu, mas não previne o que está prestes
              a falhar.
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

          <div className="p-5 rounded-2xl bg-gradient-to-r from-solar-400 to-amber-500 text-midnight-950 font-black text-center text-lg shadow-md">
            O monitoramento avisa quando o sistema já parou. A manutenção evita que ele pare.
          </div>
        </div>
      </section>

      {/* 10. ESTUDO DE CASO REAL DE CAMPO (75 kWP) */}
      <section id="caso" className="py-16 max-w-4xl mx-auto px-6 space-y-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
            Caso de Campo
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Quando o aplicativo não alarmou, a termografia resolveu
          </h2>
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
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Contexto</span>
              <p className="text-xs text-slate-700 mt-1">
                Cobertura metálica industrial, 2 anos em operação, monitoramento via Wi-Fi sem
                alertas.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-rose-600 uppercase block">Sintoma</span>
              <p className="text-xs text-slate-700 mt-1">
                Queda gradual de 6% na conta nos últimos 5 meses sem mudança no padrão de consumo.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-amber-600 uppercase block">
                Diagnóstico
              </span>
              <p className="text-xs text-slate-700 mt-1">
                Termografia detectou 2 módulos com superaquecimento de 38°C acima da média por nova
                sombra de duto.
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
            * Caso técnico representativo estruturado pela engenharia de O&amp;M da Delfos com base
            em rotinas de campo no Rio Grande do Sul e Santa Catarina.
          </p>
        </div>

        {/* CTA 3: APÓS O ESTUDO DE CASO (CONFORME ORIENTAÇÃO DE CONVERSÃO) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Sua empresa possui usina comercial ou industrial no Sul?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Solicite uma análise preliminar da curva de geração com a engenharia da Delfos.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={() => handleCtaIntermediario('cta_pos_caso_campo')}
              className="w-full sm:w-auto bg-[#081B30] hover:bg-[#0E2E52] text-solar-400 font-bold px-6 py-5 rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              Pedir diagnóstico da usina
            </Button>
          </div>
        </div>
      </section>

      {/* 11. OS TRÊS PLANOS DELFOS */}
      <section id="planos" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
              Planos de Operação &amp; Manutenção
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              As três modalidades de atendimento da Delfos
            </h2>
            <p className="text-slate-600 text-sm">
              Engenharia preventiva para usinas residenciais, comerciais, industriais e de
              investimento no Rio Grande do Sul e Santa Catarina:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plano 1: Monitoramento */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#081B30] flex items-center justify-center">
                  <Activity className="w-6 h-6 text-solar-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Plano Monitoramento</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Camada preditiva e analítica contínua
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Acompanhamento da curva de geração contra dados meteorológicos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Análise mensal de desvio por string e inversor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Identificação preventiva de tendência de queda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Suporte de engenharia para dúvidas da fatura de energia</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Link
                  to="/solucoes/om"
                  className="text-xs text-solar-700 hover:text-solar-900 font-semibold block text-center"
                >
                  Ver detalhes na página O&amp;M &rarr;
                </Link>
                <Button
                  onClick={() => handleCtaIntermediario('plano_monitoramento_btn')}
                  variant="outline"
                  className="w-full border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold rounded-xl py-5"
                >
                  Solicitar proposta
                </Button>
              </div>
            </div>

            {/* Plano 2: Completo (Destaque) */}
            <div className="p-8 rounded-3xl bg-[#081B30] text-white border-2 border-solar-400 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-solar-400 text-midnight-950 text-[10px] font-black uppercase tracking-wider">
                Mais Recomendado
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-solar-400 text-midnight-950 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Plano Completo</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Monitoramento + Inspeção + Limpeza Técnica
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                    <span>Monitoramento contínuo com alerta de anomalias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                    <span>Inspeções periódicas com termografia infravermelha (IEC 62446-3)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                    <span>Limpeza técnica especializada com água tratada e escova macia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                    <span>Reaperto com torquímetro e laudo com ART para seguradoras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                    <span>Prioridade em chamados corretivos de emergência</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <Link
                  to="/solucoes/om"
                  className="text-xs text-solar-300 hover:text-white font-semibold block text-center"
                >
                  Conhecer o programa de O&amp;M &rarr;
                </Link>
                <Button
                  onClick={() => handleCtaIntermediario('plano_completo_btn')}
                  className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black text-xs rounded-xl py-5 shadow-lg"
                >
                  Quero o plano completo
                </Button>
              </div>
            </div>

            {/* Plano 3: Inspeção Pontual */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#081B30] flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-solar-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Plano de Inspeção</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Diagnóstico pontual para usinas em operação
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Vistoria minuciosa de conformidade elétrica e estrutural</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Termografia de todos os módulos e quadros elétricos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Verificação de DPS, fusíveis, disjuntores e aterramento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Laudo formal assinado por engenheiro com ART (CREA-RS 151894)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Link
                  to="/solucoes/om"
                  className="text-xs text-solar-700 hover:text-solar-900 font-semibold block text-center"
                >
                  Ver escopo de inspeção &rarr;
                </Link>
                <Button
                  onClick={() => handleCtaIntermediario('plano_inspecao_btn')}
                  variant="outline"
                  className="w-full border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold rounded-xl py-5"
                >
                  Solicitar inspeção
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. O QUE O CLIENTE RECEBE POR VISITA */}
      <section className="py-16 max-w-4xl mx-auto px-6 space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
            Entregáveis da Engenharia
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            O que você recebe ao final de cada visita técnica
          </h2>
          <p className="text-slate-600 text-sm">
            Sem relatórios vagos. Cada intervenção é documentada com critérios de engenharia de
            conformidade:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              titulo: 'Relatório Técnico Fotográfico e Termográfico',
              desc: 'Imagens no espectro visível e infravermelho de todos os pontos com aquecimento anômalo.',
            },
            {
              titulo: 'Mapa Georreferenciado de Módulos',
              desc: 'Identificação exata de qual placa ou string apresenta anomalia para troca ou limpeza.',
            },
            {
              titulo: 'Comparativo de Curva de Geração Real vs. Esperada',
              desc: 'Gráfico de desempenho comprovando o ganho de potência após a intervenção técnica.',
            },
            {
              titulo: 'Checklist Estrutural com Torque Medido',
              desc: 'Certificação de aperto mecânico de todos os grampos e trilhos da cobertura.',
            },
            {
              titulo: 'Cronograma Regional de Limpezas Recomendadas',
              desc: 'Calendário de intervenções ajustado ao regime de chuvas e poeira da sua microrregião.',
            },
            {
              titulo: 'ART / CREA-RS e Documentação para Seguradora',
              desc: 'Dossiê técnico assinado formalmente válido para acionamento de apólices e garantias.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center shrink-0 text-sm mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-sm font-bold text-slate-900 block">{item.titulo}</strong>
                <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 13. CHECKLIST INTERATIVO DE 8 SINAIS DE ALERTA COM SCORE */}
      <section id="checklist" className="py-16 bg-slate-50 border-y border-slate-200">
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

      {/* 14. PERGUNTAS FREQUENTES (FAQ COM ACCORDION) */}
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
              q: 'A garantia do fabricante é perdida se eu não fizer manutenção periódica?',
              a: 'A garantia cobre defeitos intrínsecos de fabricação. Se um módulo queimar por causa de sujeira acumulada criando ponto quente ou se a estrutura ceder por falta de reaperto de parafusos, o fabricante recusa a troca por negligência operacional do proprietário. O registro técnico de manutenção comprova o zelo.',
            },
            {
              q: 'O plano de manutenção da Delfos substitui módulos queimados?',
              a: 'A Delfos identifica os módulos defeituosos, emite o laudo pericial para troca em garantia junto ao fabricante e executa a logística e substituição técnica em campo. Caso o módulo esteja fora da garantia, fornecemos o orçamento do componente novo a preço de custo do fabricante.',
            },
            {
              q: 'Qual o custo de não fazer manutenção em 5 anos?',
              a: 'Em uma usina de 8 kWp, a perda estimada acumulada em 5 anos varia de R$ 7.000 a mais de R$ 14.700 em energia não compensada, sem contar o risco de recusa de sinistro de seguro por falta de laudo técnico com ART.',
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

      {/* 15. FORMULÁRIO DE CAPTURA DE 4 CAMPOS (ITEM 5 DA ORIENTAÇÃO) */}
      <section className="py-12 max-w-4xl mx-auto px-6">
        <FormCapturaArtigo origem="artigo-manutencao-placa-solar" potenciaInicialKwp={kwp} />
      </section>

      {/* 16. CTA FINAL COM BLOCO DE PROVA SOCIAL OFICIAL */}
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
