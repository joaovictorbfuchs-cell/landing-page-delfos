import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BatteryCharging,
  Zap,
  ShieldAlert,
  Cpu,
  ArrowRight,
  TrendingDown,
  Building2,
  Factory,
  Tractor,
  Home,
  Check,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContatoForm from '@/components/ContatoForm'

import MobileCtaBar from '@/components/MobileCtaBar'
import SeoMeta from '@/components/SeoMeta'
import NavegacaoSolucoes from '@/components/NavegacaoSolucoes'
import { Button } from '@/components/ui/button'

export default function SolucaoBess() {
  const [activeTabDidatica, setActiveTabDidatica] = useState<'arbitragem' | 'backup' | 'shaving'>(
    'arbitragem',
  )

  const scrollToContato = () => {
    const el = document.querySelector('#contato')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Sub-ofertas conforme item 5.2 da especificação
  const subOfertas = [
    {
      titulo: 'Bloqueio do Horário de Ponta e Integração Solar',
      desc: 'Carregamento nos horários de tarifa barata na madrugada e uso à noite quando fica caro. E se a empresa já tem energia solar, carrega as baterias de graça durante o dia para despachar no horário de ponta.',
      badge: 'Economia no Horário Caro',
      icone: Cpu,
    },
    {
      titulo: 'Backup e Energia de Reserva Crítica',
      desc: 'Transição ultrarrápida (menos de 20 milissegundos) para proteger ordenhadeiras, aviários mecanizados, câmaras frias, servidores e indústrias contra quedas e oscilações na rede rural ou urbana.',
      badge: 'Continuidade Operacional',
      icone: Tractor,
    },
    {
      titulo: 'Redução da Cobrança de Demanda na Fatura (Peak Shaving)',
      desc: 'Modulação automática que descarrega as baterias exatamente nos momentos de partida de motores ou picos fabris, evitando que a empresa ultrapasse a demanda contratada em kW e pague penalidades tarifárias (peak shaving).',
      badge: 'Eficiência Tarifária',
      icone: TrendingDown,
    },
    {
      titulo: 'Baterias e Armazenamento para Empresas e Indústrias (BESS)',
      desc: 'Sistemas em gabinete climatizado para indústrias, cooperativas, supermercados e hospitais. Armazenamento de 30 kWh a 2+ MWh com baterias de lítio de última geração de alta densidade e segurança contra incêndio.',
      badge: 'Alta Potência Industrial',
      icone: Factory,
    },
  ]

  // Casos de Continuidade Operacional
  const casesContinuidade = [
    {
      segmento: 'Indústria Metalmecânica & Alimentos',
      desafio:
        'Quedas de energia de 15 minutos desconfiguravam centros de usinagem e fornos, causando até R$ 80.000 em matéria-prima perdida.',
      solucao:
        'Gabinete de baterias (BESS) 250 kWh com sistema inteligente de gestão dedicado integrado à usina solar fotovoltaica.',
      resultado:
        'Zero tempo de parada produtiva durante o ano todo e R$ 14.500/mês economizados em corte de picos de demanda.',
    },
    {
      segmento: 'Avicultura & Suinocultura Rural (RS)',
      desafio:
        'Rede rural sujeita a temporais, oscilações constantes de tensão e risco de morte de lotes por asfixia em galpões climatizados.',
      solucao:
        'Sistema de armazenamento em baterias (BESS) modular 80 kWh com reversão automática silenciosa sem oscilação.',
      resultado:
        '100% de confiabilidade operacional sem a necessidade de combustível e manutenção pesada de geradores a diesel.',
    },
    {
      segmento: 'Hospital e Centro Diagnóstico',
      desafio:
        'Equipamentos de ressonância e tomografia não toleram microinterrupções nem ruídos harmônicos de rede.',
      solucao:
        'Sistema de baterias (BESS) para empresas e indústrias de onda senoidal pura com filtragem ativa de harmônicos e no-break dinâmico.',
      resultado:
        'Continuidade ininterrupta de exames críticos e redução drástica da fatura no horário das 18h às 21h com bloqueio do horário de ponta.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#050A10] text-slate-100 antialiased selection:bg-emerald-500 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Sistema de armazenamento de energia (BESS) | Baterias Industriais e Backup"
        description="Sistema de armazenamento de energia em baterias (BESS): economia no horário de ponta, backup ininterrupto e redução de demanda (peak shaving) no Sul do Brasil. Delfos Engenharia."
        canonicalPath="/solucoes/bess"
      />

      {/* Header escuro integrado */}
      <Header onSolicitarAvaliacao={scrollToContato} />

      <main className="flex-1 pt-24">
        {/* Breadcrumb dark */}
        <div className="bg-[#080E18] border-b border-white/10 py-3">
          <div className="max-w-7xl mx-auto px-6 text-xs text-slate-400 flex items-center gap-2">
            <Link to="/" className="hover:text-emerald-400 transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link to="/#solucoes" className="hover:text-emerald-400 transition-colors">
              Soluções
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">
              Sistema de armazenamento de energia (BESS)
            </span>
          </div>
        </div>

        {/* HERO SECTION DARK (Estilo Tesla Energy) */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#080E18] via-[#060D17] to-[#04080F]">
          {/* Luzes e gradientes de fundo estilo Tesla */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  Solução 02 • Armazenamento Eletroquímico Avançado
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Armazenamento e Baterias (BESS):{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    estratégia própria de energia
                  </span>{' '}
                  para economizar no horário de ponta e zerar riscos de blecaute.
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  O sistema de armazenamento de energia em baterias (BESS — Battery Energy Storage
                  System) <strong>não é um simples acessório do painel solar</strong>: é o cérebro
                  que garante economia no horário de ponta, autonomia ininterrupta para a sua
                  indústria e redução da cobrança de demanda contratada na fatura (peak shaving).
                </p>

                {/* Bloco do problema resolvido */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Problema que as baterias (BESS) resolvem:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Tarifas abusivas no horário de ponta (18h às 21h), vulnerabilidade a blecautes e
                    oscilações na rede da concessionária (gerando paradas de produção que custam
                    caro) e multas por ultrapassagem de demanda contratada.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Button
                    onClick={scrollToContato}
                    className="bg-emerald-500 hover:bg-emerald-400 text-midnight-950 font-black px-8 py-6 text-base rounded-xl shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Pedir estudo de viabilidade</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <a
                    href="https://wa.me/5554991292121?text=Ol%C3%A1!%20Gostaria%20de%20um%20estudo%20de%20viabilidade%20BESS%20com%20a%20engenharia%20da%20Delfos%20(Origem:%20solucao-bess)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all text-center"
                  >
                    <span>Falar sobre BESS no WhatsApp</span>
                  </a>
                </div>

                {/* Badges Técnicos */}
                <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Baterias de lítio de última geração (LiFePO4)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Comutação &lt; 20ms (Zero Blink)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Gestão Inteligente em Nuvem</span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Foto real reservada + Painel de Métricas estilo Tesla */}
              <div className="lg:col-span-5 space-y-5">
                {/* Espaço reservado de foto real de BESS */}
                <div className="rounded-3xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-md relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Foto real de gabinete BESS — aguardando
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Padrão Industrial</span>
                  </div>

                  <div className="aspect-video rounded-2xl bg-[#091322] border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                      <BatteryCharging className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Gabinete BESS Industrial Climatizado
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Bancos de lítio modulares de 30 kWh a 1 MWh com sistema automático de
                      supressão de incêndio e inversor bidirecional híbrido.
                    </p>
                  </div>
                </div>

                {/* Tesla-style Specs Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                      Especificações de Engenharia
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Delfos Energy Lab</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Química de Célula
                      </span>
                      <strong className="text-sm font-bold text-white">LiFePO4 Premium</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Vida Útil de Ciclos
                      </span>
                      <strong className="text-sm font-bold text-emerald-400">
                        6.000+ Ciclos (90% DoD)
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Tempo de Transferência
                      </span>
                      <strong className="text-sm font-bold text-white">
                        &lt; 20 ms (Ininterrupto)
                      </strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">
                        Capacidade Modular
                      </span>
                      <strong className="text-sm font-bold text-cyan-300">30 kWh até 2+ MWh</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPLICAÇÃO DIDÁTICA: Benefícios das Baterias e Armazenamento (Item 5.2) */}
        <section className="py-20 bg-[#060D17] border-t border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Conceito Técnico Didático
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Como o BESS gera economia matemática na fatura de alta tensão
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Entenda visualmente as duas operações fundamentais que transformam baterias em um
                centro de lucro e estabilidade operacional para o seu negócio.
              </p>
            </div>

            {/* Interactive Tab Selector - Reordenado conforme regra 3: 1º Ponta, 2º Backup, 3º Pico/demanda */}
            <div className="flex justify-center gap-3 mb-10 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTabDidatica('arbitragem')}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTabDidatica === 'arbitragem'
                    ? 'bg-cyan-500 text-midnight-950 shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                1. Economia no Horário de Ponta
              </button>

              <button
                type="button"
                onClick={() => setActiveTabDidatica('backup')}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTabDidatica === 'backup'
                    ? 'bg-amber-400 text-midnight-950 shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                2. Backup e Energia de Reserva
              </button>

              <button
                type="button"
                onClick={() => setActiveTabDidatica('shaving')}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTabDidatica === 'shaving'
                    ? 'bg-emerald-500 text-midnight-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                3. Redução da Cobrança de Demanda na Fatura
              </button>
            </div>

            {/* Content for active tab */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-md">
              {activeTabDidatica === 'shaving' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                      Redução de Demanda Contratada (kW)
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Redução da cobrança de demanda na fatura (peak shaving)
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Em indústrias e grandes comércios, a ligação de máquinas pesadas gera picos de
                      demanda que duram poucos minutos, mas obrigam a empresa a contratar uma
                      demanda elevada com a concessionária ou pagar pesadas multas tarifárias por
                      ultrapassagem.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      O sistema de baterias monitora a curva de carga em microssegundos. Ao detectar
                      que o consumo está se aproximando do limite contratado,{' '}
                      <strong className="text-emerald-400">
                        a bateria injeta energia instantaneamente na fábrica
                      </strong>
                      , aplainando a curva e eliminando a cobrança de multas de demanda na fatura
                      (peak shaving).
                    </p>

                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 font-mono">
                      ✓ Resultado: Redução direta na demanda faturada mês a mês, permitindo enxugar
                      o contrato de alta tensão sem risco de multa (peak shaving).
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#091322] border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">
                      Curva de Carga Fabril (Exemplo)
                    </span>
                    <div className="h-44 flex items-end justify-center gap-2 pt-4 px-2 border-b border-slate-700">
                      <div className="w-8 bg-slate-700 rounded-t h-[40%]" title="Consumo base" />
                      <div className="w-8 bg-slate-700 rounded-t h-[55%]" title="Consumo base" />
                      <div className="w-8 bg-slate-700 rounded-t h-[65%]" title="Consumo base" />
                      {/* Pico cortado pelo BESS */}
                      <div className="w-12 relative flex flex-col justify-end items-center h-[95%]">
                        <div className="w-full bg-emerald-400/90 rounded-t h-[40%] flex items-center justify-center text-[10px] font-bold text-midnight-950">
                          BESS
                        </div>
                        <div className="w-full bg-slate-600 h-[60%]" />
                      </div>
                      <div className="w-8 bg-slate-700 rounded-t h-[70%]" title="Consumo base" />
                      <div className="w-8 bg-slate-700 rounded-t h-[50%]" title="Consumo base" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>08:00 (Início)</span>
                      <span className="text-emerald-400 font-bold">Pico Fabril (Corte BESS)</span>
                      <span>18:00 (Fim)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTabDidatica === 'arbitragem' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                      Bloqueio do Horário de Ponta
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Bloqueio do horário de ponta: carrega de madrugada e usa à noite
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Na tarifa horossazonal (Verde ou Azul), o kilowatt-hora consumido durante o{' '}
                      <strong>Horário de Ponta (18h às 21h)</strong> chega a custar de 4 a 5 vezes
                      mais caro do que fora da ponta.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Com o sistema de baterias (BESS), a empresa carrega de madrugada, quando a
                      energia é barata, e usa de noite, quando fica caro.{' '}
                      <strong className="text-cyan-300">
                        E se a empresa já tem energia solar, carrega as baterias de graça durante o
                        dia
                      </strong>{' '}
                      para consumir no horário de ponta sem pagar nada à distribuidora.
                    </p>

                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-900/60 text-xs text-cyan-300 font-mono">
                      ✓ Resultado: Bloqueio do consumo na ponta e máxima multiplicação do retorno
                      financeiro.
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#091322] border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">
                      Comparativo de Custo do kWh
                    </span>
                    <div className="space-y-3 text-left">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Fora de Ponta (Geração Solar / Noite)</span>
                          <span className="font-bold text-emerald-400">R$ 0,35 a 0,60 / kWh</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-[30%] h-full bg-emerald-400" />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Horário de Ponta (18h às 21h na rede)</span>
                          <span className="font-bold text-red-400">R$ 1,80 a 2,50+ / kWh</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-[90%] h-full bg-red-400" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      BESS descarrega exatamente durante a faixa vermelha.
                    </p>
                  </div>
                </div>
              )}

              {activeTabDidatica === 'backup' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold">
                      Comutação Zero Blink (&lt; 20ms)
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Backup Crítico: a sua empresa continua funcionando quando a rede cai
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Geradores a diesel levam de 15 a 45 segundos para dar a partida, dependem de
                      combustível fóssil estocado, emitem ruído extremo e exigem manutenção mecânica
                      pesada.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      O BESS atua como um{' '}
                      <strong className="text-amber-400">No-Break Industrial Dinâmico</strong>: a
                      transição é tão rápida que computadores, servidores, controladores lógicos
                      (CLPs) e equipamentos médicos não reiniciam.
                    </p>

                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-300 font-mono">
                      ✓ Resultado: Zero perda de dados, sem queima de placas eletrônicas e silêncio
                      absoluto.
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#091322] border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <span className="text-[11px] font-mono text-slate-400 uppercase block">
                      Comparativo com Gerador a Diesel
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-left">
                        <strong className="text-red-400 block mb-1">Gerador Diesel</strong>
                        <ul className="space-y-1 text-slate-400 text-[11px]">
                          <li>• Queda de 15-45s</li>
                          <li>• Diesel caro e volátil</li>
                          <li>• Ruído alto e fumaça</li>
                          <li>• Manutenção frequente</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-left">
                        <strong className="text-emerald-400 block mb-1">BESS Delfos</strong>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          <li>• Queda &lt; 20ms</li>
                          <li>• Recarga solar grátis</li>
                          <li>• Silêncio total</li>
                          <li>• Zero peças móveis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SUB-OFERTAS DETALHADAS (Item 5.2) */}
        <section className="py-20 bg-[#050A10]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Arquitetura de Solução BESS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Quatro frentes de aplicação para a tecnologia de armazenamento
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subOfertas.map((sub, idx) => {
                const Icone = sub.icone
                return (
                  <div
                    key={idx}
                    className="rounded-3xl p-8 bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <Icone className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {sub.badge}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          0{idx + 1}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                        {sub.titulo}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed mb-6">{sub.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span>Engenharia especializada Delfos</span>
                      <button
                        type="button"
                        onClick={scrollToContato}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Pedir estudo para este escopo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ESPAÇO PARA CASES DE CONTINUIDADE OPERACIONAL (Item 5.2) */}
        <section className="py-20 bg-[#080E18] border-t border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Provas de Campo
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Casos de continuidade operacional garantidos por BESS
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2">
                Aplicações práticas onde o custo da falta de energia superava amplamente o
                investimento no sistema de armazenamento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {casesContinuidade.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                        {c.segmento}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">Case Gaúcho</span>
                    </div>

                    <div>
                      <strong className="text-xs text-red-400 uppercase block tracking-wider font-mono">
                        Desafio:
                      </strong>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">{c.desafio}</p>
                    </div>

                    <div>
                      <strong className="text-xs text-cyan-400 uppercase block tracking-wider font-mono">
                        Solução Implementada:
                      </strong>
                      <p className="text-xs text-slate-200 leading-relaxed mt-1">{c.solucao}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <strong className="text-xs text-emerald-400 uppercase block tracking-wider font-mono">
                      Resultado Medido:
                    </strong>
                    <p className="text-xs text-white font-semibold leading-relaxed mt-1">
                      {c.resultado}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORMULÁRIO 2 ETAPAS COM ORIGEM "solucao-bess" E CTA "Pedir estudo de viabilidade" */}
        <ContatoForm
          initialNecessidade="BESS (Armazenamento)"
          initialOrigem="solucao-bess"
          destaqueDark={true}
          tituloSecao="Peça o estudo de viabilidade técnica e financeira de baterias (BESS)"
          subtituloSecao="Nossos engenheiros analisam a fatura de alta tensão, o perfil de carga e o histórico de oscilações para dimensionar a capacidade exata em kWh/kW."
          textoBotaoFinal="Pedir estudo de viabilidade de baterias (BESS)"
        />

        {/* NAVEGAÇÃO CRUZADA ENTRE AS 4 SOLUÇÕES */}
        <NavegacaoSolucoes solucaoAtual="bess" dark={true} />
      </main>

      {/* Footer com Diferenciação da Marca */}
      <Footer />

      {/* Barra Fixa Mobile */}
      <MobileCtaBar onSolicitarAvaliacao={scrollToContato} />
    </div>
  )
}
