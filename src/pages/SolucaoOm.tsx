import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench,
  Activity,
  Droplets,
  Plane,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Search,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  ThermometerSun,
  Flame,
  Award,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'
import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import NavegacaoSolucoes from '@/components/NavegacaoSolucoes'
import { Button } from '@/components/ui/button'

export default function SolucaoOm() {
  const [formNecessidade, setFormNecessidade] = useState<string>('Manutenção')
  const [formOrigem, setFormOrigem] = useState<string>('solucao-om-manutencao')

  const handleSolicitarManutencao = (origemEspecifica = 'om-hero-manutencao') => {
    setFormNecessidade('Manutenção')
    setFormOrigem(origemEspecifica)
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleConhecerPlanos = (origemEspecifica = 'om-hero-planos') => {
    setFormNecessidade('O&M e Monitoramento')
    setFormOrigem(origemEspecifica)
    const el = document.querySelector('#o-que-oferecemos') || document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Sub-ofertas técnicas de operação e manutenção
  const subOfertas = [
    {
      titulo: 'Monitoramento contínuo em tempo real',
      desc: 'Acompanhamento constante dos inversores e da produção. O sistema detecta quedas inesperadas de rendimento e placas inoperantes antes que o problema afete a sua fatura.',
      badge: 'Monitoramento Contínuo',
      icone: Activity,
    },
    {
      titulo: 'Limpeza técnica especializada de painéis',
      desc: 'Lavagem com água pura filtrada e escovas especiais que não riscam o vidro nem anulam a garantia dos fabricantes. Remoção de poeira, fuligem, pólen e dejetos.',
      badge: 'Recuperação até +25%',
      icone: Droplets,
    },
    {
      titulo: 'Inspeção com drone termográfico',
      desc: 'Câmeras térmicas de alta precisão em drones inspecionam toda a usina em minutos, detectando pontos superaquecidos invisíveis a olho nu, falhas elétricas e conexões frouxas.',
      badge: 'Inspeção Aérea Especializada',
      icone: Plane,
    },
    {
      titulo: 'Planos de manutenção preventiva e corretiva com prazo definido',
      desc: 'Atendimento ágil com compromisso formal de resposta em contrato, reaperto elétrico, testes de aterramento e substituição rápida de componentes.',
      badge: 'Prazo Garantido em Contrato',
      icone: ShieldCheck,
    },
    {
      titulo: 'Relatórios periódicos de geração e desempenho',
      desc: 'Relatórios claros que mostram exatamente quanto a usina gerou versus o que deveria gerar, histórico de produção e recomendações assinadas por engenheiro do CREA-RS.',
      badge: 'Transparência & Resultados',
      icone: FileText,
    },
  ]

  // Pilares do modelo personalizado "O que oferecemos"
  const servicosPersonalizados = [
    {
      titulo: 'Planos Customizados para o Seu Sistema',
      desc: 'Cada usina tem seu porte, localização e nível de criticidade. Ajustamos a frequência de visitas e o escopo de serviços sob medida para a sua necessidade — de telhados comerciais a grandes usinas de solo.',
      icone: Layers,
      destaque: 'Sob medida',
    },
    {
      titulo: 'Eficiência Energética e Máxima Geração',
      desc: 'Monitoramento contínuo e limpezas técnicas periódicas evitam perdas invisíveis na produção e garantem que cada kilowatt-hora projetado vire economia real na conta de luz.',
      icone: TrendingUp,
      destaque: 'Mais rendimento',
    },
    {
      titulo: 'Segurança Técnica e Prevenção de Sinistros',
      desc: 'Inspeções com drone termográfico e testes elétricos identificam pontos quentes, conectores folgados e riscos de queima antes que causem falhas graves ou paralisações do sistema.',
      icone: ShieldCheck,
      destaque: 'Proteção total',
    },
    {
      titulo: 'Prazo de Resposta Garantido em Contrato',
      desc: 'Equipes técnicas próprias com compromisso formal de atendimento rápido quando houver qualquer parada ou anomalia, restabelecendo a operação sem esperas desnecessárias.',
      icone: Clock,
      destaque: 'Atendimento ágil',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      <SeoMeta
        title="Manutenção e monitoramento de usinas solares | Delfos Engenharia"
        description="Proteja o retorno do seu ativo solar: manutenção e monitoramento remoto, limpeza técnica especializada, termografia por drone e planos preventivos personalizados com prazo garantido. Delfos."
        canonicalPath="/solucoes/om"
        ogImage="/og-image.png"
      />

      {/* Header Institucional */}
      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb simples */}
        <div className="bg-slate-50 border-b border-slate-200/70 py-3">
          <div className="max-w-7xl mx-auto px-6 text-xs text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link to="/#solucoes" className="hover:text-blue-600 transition-colors">
              Soluções
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Manutenção e monitoramento</span>
          </div>
        </div>

        {/* HERO SECTION DA SOLUÇÃO */}
        <section className="relative bg-gradient-to-b from-[#061B33] via-[#0B2C4F] to-[#0A2542] text-white py-20 lg:py-28 overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-solar-400/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <Wrench className="w-3.5 h-3.5 text-blue-400" />
                  Solução 03 • Manutenção e monitoramento
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Manutenção e monitoramento:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-solar-300">
                    recupere até 25% da geração
                  </span>{' '}
                  e proteja o retorno financeiro do seu ativo.
                </h1>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Diferente de empresas que somem após a instalação, a Delfos cuida da sua usina
                  depois que a obra termina. Monitoramento contínuo, limpeza técnica e inspeção
                  térmica por drone para garantir que a usina gere o máximo de economia no seu
                  bolso.
                </p>

                {/* Bloco do problema resolvido */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-300 block mb-1">
                    Problema que esta solução resolve:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Perda silenciosa de geração causada por poeira, fuligem agrícola e dejetos;
                    pontos quentes (hotspots) não detectados que degradam módulos precocemente; e
                    ausência de suporte rápido quando um inversor desarma e a usina fica semanas
                    gerando zero.
                  </p>
                </div>

                {/* CTAs exclusivos separados: Manutenção (primário) vs Conhecer Planos (secundário) */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* CTA Primário: Solicitar Manutenção */}
                    <div className="flex-1 flex flex-col">
                      <Button
                        onClick={() => handleSolicitarManutencao('om-hero-manutencao')}
                        className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-extrabold px-6 py-6 text-base rounded-xl shadow-xl shadow-solar-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Wrench className="w-5 h-5 text-midnight-950 shrink-0" />
                        <span>Solicitar Manutenção</span>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <span className="text-[11px] text-solar-300 font-semibold mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-solar-400 shrink-0" />
                        atendemos usinas de qualquer instalador
                      </span>
                    </div>

                    {/* CTA Secundário: Conhecer planos de manutenção */}
                    <div className="flex-1 flex flex-col">
                      <Button
                        onClick={() => handleConhecerPlanos('om-hero-conhecer-planos')}
                        variant="outline"
                        className="w-full bg-white/10 hover:bg-white/15 border border-white/25 text-white font-bold px-6 py-6 text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-5 h-5 text-blue-300 shrink-0" />
                        <span>Conhecer planos de manutenção</span>
                      </Button>
                      <span className="text-[11px] text-slate-300 mt-1.5">
                        com prazo de resposta garantido em contrato
                      </span>
                    </div>
                  </div>

                  {/* Canal WhatsApp direto */}
                  <a
                    href="https://wa.me/5554991292121?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20manuten%C3%A7%C3%A3o%20ou%20conhecer%20os%20planos%20de%20O%26M%20da%20Delfos%20(Origem:%20solucao-om)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors pt-1"
                  >
                    <span>
                      Prefere falar agora com um técnico? Chamar no WhatsApp (54) 99129-2121 →
                    </span>
                  </a>
                </div>

                {/* Badges de Autoridade */}
                <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-solar-400" />
                    <span>Drone termográfico calibrado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Contratos com prazo de atendimento definido</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-300" />
                    <span>Laudos emitidos por Engenheiros CREA-RS</span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Destaque de Manutenção Técnica + Diagnóstico Visual */}
              <div className="lg:col-span-5 space-y-4">
                {/* Destaque Institucional de Manutenção Técnica */}
                <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Equipe Técnica Própria
                    </span>
                    <span className="text-xs text-slate-300">Atendimento em todo o Sul</span>
                  </div>

                  <div className="flex items-start gap-4 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        Cuidamos da sua usina mesmo que instalada por outra empresa
                      </h3>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                        Técnicos certificados para trabalho em altura e com eletricidade, limpeza
                        profissional e diagnóstico elétrico completo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estatística de Perda Silenciosa */}
                <div className="bg-white rounded-3xl p-6 text-slate-800 shadow-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      Alerta de Eficiência
                    </span>
                    <span className="text-xs font-mono text-slate-400">Auditoria Técnica</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    O custo invisível de uma usina sem manutenção
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">Sujidade acumulada (poeira/fuligem)</span>
                      <strong className="text-red-600 font-bold">-10% a -25% de geração</strong>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-600">Hotspot (célula superaquecida)</span>
                      <strong className="text-amber-700 font-bold">
                        Risco de incêndio e perda de garantia
                      </strong>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-900 font-medium">
                        Com manutenção Delfos programada
                      </span>
                      <strong className="text-emerald-700 font-bold">
                        Máxima geração o ano todo
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleSolicitarManutencao('om-card-diagnostico-manutencao')}
                      className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black py-3 text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Solicitar Manutenção</span>
                    </Button>
                    <p className="text-[10px] text-center text-slate-500">
                      Atendemos usinas de qualquer instalador
                    </p>
                    <Button
                      onClick={() => {
                        const el = document.querySelector('#contato')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Acionar Atendimento de Emergência</span>
                    </Button>
                    <Button
                      onClick={() => handleConhecerPlanos('om-card-diagnostico-planos')}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-2 text-xs rounded-xl cursor-pointer"
                    >
                      Conhecer planos de manutenção
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ELEMENTOS DE PROVA: TERMOGRAFIA POR DRONE (Item 5.3) */}
        <section className="py-20 bg-slate-50 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
                  <Plane className="w-3.5 h-3.5" />
                  Diferencial Técnico Delfos
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Termografia por drone: enxergamos o que o olho humano não vê
                </h2>

                <p className="text-slate-600 text-base leading-relaxed">
                  Em centenas ou milhares de placas solares instaladas em telhados íngremes ou
                  usinas de solo, inspecionar módulo por módulo manualmente é lento, perigoso e
                  incompleto.
                </p>

                <p className="text-slate-600 text-base leading-relaxed">
                  A Delfos utiliza <strong>drones com câmeras termográficas radiométricas</strong>.
                  O drone voa de forma autônoma sobre toda a usina, capturando o perfil térmico de
                  cada célula solar. Células danificadas operam com temperatura até 40°C superior às
                  normais, destacando-se em vermelho/amarelo imediatamente na tela do engenheiro.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <ThermometerSun className="w-5 h-5 text-amber-500 mb-1" />
                    <h3 className="text-xs font-bold text-slate-900">Detecção de Hotspots</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Identificação precisa da coordenada do módulo defeituoso para acionamento de
                      garantia com o fabricante.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <Flame className="w-5 h-5 text-red-500 mb-1" />
                    <h3 className="text-xs font-bold text-slate-900">Prevenção de Sinistros</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Eliminação de riscos de arco elétrico e incêndio causados por conectores MC4
                      mal crimpados ou superaquecidos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Box Demonstrativa da Amostra do Relatório Termográfico */}
              <div className="lg:col-span-6">
                <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                        Amostra de Relatório de Desempenho
                      </span>
                      <h3 className="text-lg font-black text-slate-900">
                        Laudo de Inspeção Termográfica & PR
                      </h3>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold">
                      CREA-RS
                    </span>
                  </div>

                  {/* Ilustração da Análise Termográfica */}
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="w-3 h-3 rounded-full bg-yellow-400" />
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs text-slate-300 ml-1">
                        Inspeção Térmica por Infravermelho
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Identificação precisa de módulos aquecidos e conexões com defeito
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-xs text-solar-300">
                      <span>
                        Módulo identificado com anomalia térmica de +28°C em relação à média
                      </span>
                    </div>
                  </div>

                  {/* Resumo do Relatório */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Rendimento apurado da usina:</span>
                      <strong className="text-emerald-700 font-bold">
                        Mais de 81% (Excelente)
                      </strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Módulos com anomalia identificada:</span>
                      <strong className="text-amber-600 font-bold">
                        2 módulos (elegíveis para garantia do fabricante)
                      </strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Geração recuperada após a limpeza:</span>
                      <strong className="text-slate-900 font-bold">+18% no mês seguinte</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleSolicitarManutencao('om-secao-termografia-manutencao')}
                      className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black py-3 text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Solicitar Manutenção</span>
                    </Button>
                    <p className="text-[10px] text-center text-slate-500">
                      Atendemos usinas de qualquer instalador
                    </p>
                    <Button
                      onClick={() => handleConhecerPlanos('om-secao-termografia-planos')}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-2.5 text-xs rounded-xl cursor-pointer"
                    >
                      Conhecer planos de manutenção
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUB-OFERTAS DETALHADAS (Item 5.3) */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                Escopo de Serviços O&M
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Engenharia de operação contínua e receita recorrente protegida
              </h2>
              <p className="text-base text-slate-600 mt-3 leading-relaxed">
                Cada serviço é executado por técnicos treinados da Delfos com instrumentos aferidos
                e certificados para proteger as garantias do seu investimento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subOfertas.map((sub, idx) => {
                const Icone = sub.icone
                return (
                  <div
                    key={idx}
                    className="rounded-3xl p-7 bg-frost border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Icone className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          {sub.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2">{sub.titulo}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        {sub.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-bold text-blue-700">
                      <span>Engenharia Delfos</span>
                      <button
                        type="button"
                        onClick={() => handleSolicitarManutencao('om-card-servico')}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Solicitar Manutenção</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* SEÇÃO O QUE OFERECEMOS: PLANOS PERSONALIZADOS */}
        <section
          id="o-que-oferecemos"
          className="py-20 bg-slate-50 border-t border-b border-slate-200/80"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-2">
                Atendimento sob medida
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                O que oferecemos em Operação e Manutenção
              </h2>
              <p className="text-base text-slate-600 mt-3 leading-relaxed">
                Não engessamos seu negócio em pacotes pré-fixados. Desenhamos planos personalizados
                conforme a necessidade, o porte e as particularidades da sua usina — com foco total
                em máxima eficiência e segurança do sistema.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {servicosPersonalizados.map((item, idx) => {
                const Icone = item.icone
                return (
                  <div
                    key={idx}
                    className="rounded-3xl p-7 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                          <Icone className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          {item.destaque}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                        {item.titulo}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Opções flexíveis e adaptáveis</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Banner explicativo de personalização com CTAs da página */}
            <div className="mt-10 rounded-3xl bg-gradient-to-r from-[#09223D] via-[#0B2C4F] to-[#0A223E] text-white p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-300">
                  Planos Personalizados • Sem Custos Ocultos
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Precisa de um plano para sua usina ou de um atendimento pontual?
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Avaliamos o estado atual dos seus inversores, módulos e instalações elétricas para
                  estruturar o cronograma ideal de manutenções preventivas, vistorias termográficas
                  e prazos de resposta garantidos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto shrink-0">
                <Button
                  onClick={() => handleSolicitarManutencao('om-secao-oferecemos-manutencao')}
                  className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-extrabold px-6 py-5 text-sm rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4 text-midnight-950" />
                  <span>Solicitar Manutenção</span>
                </Button>
                <Button
                  onClick={() => handleConhecerPlanos('om-secao-oferecemos-planos')}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/15 border-white/20 text-white font-bold px-6 py-5 text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-300" />
                  <span>Conhecer planos de manutenção</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO 2 ETAPAS COM ORIGEM RASTREADA E CLASSIFICAÇÃO MANUTENÇÃO vs PLANOS */}
        <ContatoForm
          initialNecessidade={formNecessidade}
          initialOrigem={formOrigem}
          tituloSecao="Solicite manutenção ou proposta de plano de manutenção"
          subtituloSecao="Atendemos usinas de qualquer instalador. Descubra se o seu sistema está operando na capacidade máxima ou restabeleça a geração com equipe técnica registrada no CREA-RS."
          textoBotaoFinal="Solicitar Manutenção"
        />

        {/* NAVEGAÇÃO CRUZADA ENTRE AS 4 SOLUÇÕES */}
        <NavegacaoSolucoes solucaoAtual="om" />
      </main>

      {/* Footer com Diferenciação da Marca */}
      <Footer />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
