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
      titulo: 'Monitoramento Remoto de Performance em Tempo Real',
      desc: 'Monitoramento remoto conectado a inversores e sensores de irradiação solar. Algoritmos detectam queda de rendimento diário, strings inoperantes e desvios de geração antes que afetem a fatura do mês.',
      badge: 'Monitoramento Remoto Contínuo',
      icone: Activity,
    },
    {
      titulo: 'Limpeza Técnica de Módulos Especializada',
      desc: 'Lavagem com água deionizada/filtrada e escovas rotativas de cerdas suaves antiarranhão, respeitando as garantias de fábrica do vidro temperado. Remoção de fuligem, pólen, terra e dejetos de pássaros.',
      badge: 'Recuperação até +25%',
      icone: Droplets,
    },
    {
      titulo: 'Termografia por Drone e Inspeção Elétrica Avançada',
      desc: 'Câmeras termográficas calibradas acopladas a drone sobrevoam centenas de módulos em minutos, detectando hotspots invisíveis a olho nu, bypass com falha, diodos queimados e conexões aquecidas.',
      badge: 'Diferencial Técnico',
      icone: Plane,
    },
    {
      titulo: 'Planos de Manutenção Preventiva e Corretiva com Prazo Definido',
      desc: 'Contratos estruturados com prazos de resposta garantidos (atendimento ágil de 4h a 24h), reaperto de conexões elétricas, medição de curva I-V, teste de aterramento e substituição de peças.',
      badge: 'Prazo Garantido em Contrato',
      icone: ShieldCheck,
    },
    {
      titulo: 'Relatórios Periódicos de Desempenho e Engenharia',
      desc: 'Laudos técnicos mensais ou trimestrais com PR (Performance Ratio), comparativo de geração esperada vs. real, análise climática e recomendações assinadas por engenheiro do CREA-RS.',
      badge: 'Governança & ROI',
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
        title="Manutenção O&M e Monitoramento de Usinas Solares | Termografia & Drone"
        description="Proteja o retorno do seu ativo solar: monitoramento remoto, limpeza técnica especializada, termografia por drone e planos preventivos personalizados com prazo garantido. Delfos O&M."
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
            <span className="text-slate-900 font-semibold">Manutenção O&M e Monitoramento</span>
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
                  Solução 03 • Operação, Manutenção & Monitoramento
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  O&M Solar:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-solar-300">
                    recupere até 25% da geração
                  </span>{' '}
                  e proteja o retorno financeiro do seu ativo.
                </h1>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Diferente de instaladoras que somem após a entrega da obra, a Delfos posiciona o
                  O&M como uma <strong>solução estratégica de ciclo completo</strong>. Monitoramento
                  em tempo real, limpeza técnica e termografia por drone para garantir que cada kWh
                  planejado vire economia no bolso.
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

                    {/* CTA Secundário: Conhecer Planos O&M */}
                    <div className="flex-1 flex flex-col">
                      <Button
                        onClick={() => handleConhecerPlanos('om-hero-conhecer-planos')}
                        variant="outline"
                        className="w-full bg-white/10 hover:bg-white/15 border border-white/25 text-white font-bold px-6 py-6 text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-5 h-5 text-blue-300 shrink-0" />
                        <span>Conhecer Planos O&M</span>
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

              {/* Right Hero: Foto real reservada + Diagnóstico Visual */}
              <div className="lg:col-span-5 space-y-4">
                {/* Espaço reservado de foto real de O&M */}
                <div className="rounded-3xl border-2 border-dashed border-blue-400/40 bg-blue-950/30 p-6 backdrop-blur-md relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Foto real de equipe / Drone — aguardando
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Inspeção no RS</span>
                  </div>

                  <div className="aspect-video rounded-2xl bg-slate-900/70 border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-300 mb-3 group-hover:scale-105 transition-transform">
                      <Plane className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Equipe em Campo & Inspeção Aérea por Drone
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Técnicos com EPIs regulamentares (NR-10 e NR-35), lavagem especializada e
                      sensor infravermelho para auditoria de usinas em operação.
                    </p>
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
                        Com O&M Delfos programado
                      </span>
                      <strong className="text-emerald-700 font-bold">
                        100% de disponibilidade contratada
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleSolicitarManutencao('om-card-diagnostico-manutencao')}
                      className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black py-3 text-xs sm:text-sm rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Solicitar Manutenção Imediata</span>
                    </Button>
                    <p className="text-[10px] text-center text-slate-500">
                      Atendemos usinas de qualquer instalador
                    </p>
                    <Button
                      onClick={() => {
                        // Rola até o formulário ou abre o atendimento de plantão
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
                      Conhecer Planos O&M
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

                  {/* Placeholder de Imagem Termográfica */}
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-900 p-6 text-white text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="w-3 h-3 rounded-full bg-yellow-400" />
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-[11px] font-mono text-slate-300 ml-1">
                        Paleta Radiométrica Ironbow
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-1">
                      [Espaço reservado: Captura real de tela do sensor termográfico do drone da
                      Delfos]
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-[11px] font-mono text-solar-300">
                      <span>Módulo #42 • String 03 • Anomalia térmica: +28,4°C</span>
                    </div>
                  </div>

                  {/* Resumo do Relatório */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Performance Ratio (PR) Apurado:</span>
                      <strong className="text-emerald-700 font-bold">81,4% (Excelente)</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Módulos com anomalia crítica:</span>
                      <strong className="text-amber-600 font-bold">
                        2 módulos (cobertos por garantia)
                      </strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Geração recuperada pós-limpeza:</span>
                      <strong className="text-slate-900 font-bold">+18,7% no mês seguinte</strong>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleSolicitarManutencao('om-secao-termografia-manutencao')}
                      className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black py-3 text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Solicitar Manutenção & Laudo Termográfico</span>
                    </Button>
                    <p className="text-[10px] text-center text-slate-500">
                      Atendemos usinas de qualquer instalador
                    </p>
                    <Button
                      onClick={() => handleConhecerPlanos('om-secao-termografia-planos')}
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-2.5 text-xs rounded-xl cursor-pointer"
                    >
                      Conhecer Planos O&M com Termografia
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
                        onClick={scrollToContato}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Pedir diagnóstico</span>
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
                  <span>Conhecer Planos O&M</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO 2 ETAPAS COM ORIGEM RASTREADA E CLASSIFICAÇÃO MANUTENÇÃO vs PLANOS */}
        <ContatoForm
          initialNecessidade={formNecessidade}
          initialOrigem={formOrigem}
          tituloSecao="Solicite manutenção ou proposta de plano O&M"
          subtituloSecao="Atendemos usinas de qualquer instalador. Descubra se o seu sistema está operando na capacidade máxima ou restabeleça a geração com equipe técnica registrada no CREA-RS."
          textoBotaoFinal="Solicitar atendimento técnico"
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
