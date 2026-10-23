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

  // Sub-ofertas especializadas em baterias de energia
  const subOfertas = [
    {
      titulo: 'Economia no horário mais caro e integração com solar',
      desc: 'Carregamento nos horários em que a energia é barata (ou direto dos painéis solares de graça durante o dia) e uso automático no horário mais caro, entre 18h e 21h.',
      badge: 'Economia no Horário Caro',
      icone: Cpu,
    },
    {
      titulo: 'Energia de reserva e proteção contra quedas',
      desc: 'Acionamento instantâneo em milissegundos para proteger ordenhadeiras, aviários climatizados, câmaras frias, servidores e máquinas industriais contra quedas de luz.',
      badge: 'Continuidade Operacional',
      icone: Tractor,
    },
    {
      titulo: 'Corte dos picos de consumo que encarecem a fatura',
      desc: 'Acionamento automático das baterias na partida de máquinas pesadas ou picos de produção, evitando que a empresa ultrapasse o limite contratado e pague multas na fatura.',
      badge: 'Eficiência Tarifária',
      icone: TrendingDown,
    },
    {
      titulo: 'Baterias de grande porte para empresas e indústrias',
      desc: 'Sistemas completos em gabinete climatizado para indústrias, cooperativas, supermercados e hospitais, com baterias de lítio de última geração e máxima segurança.',
      badge: 'Grande Porte Industrial',
      icone: Factory,
    },
  ]

  // Exemplos ilustrativos de aplicação prática
  const exemplosAplicacao = [
    {
      segmento: 'Indústria Metalmecânica e Alimentos',
      desafio:
        'Quedas pontuais de energia desconfiguravam máquinas e linhas de produção, causando perda de matéria-prima e paradas de turno não programadas.',
      solucao:
        'Gabinete de baterias de energia com sistema de gestão inteligente integrado à geração solar.',
      resultado:
        'Eliminação de paradas produtivas por falta de luz e corte dos picos de consumo que aumentavam a fatura mensal.',
    },
    {
      segmento: 'Avicultura e Suinocultura Rural',
      desafio:
        'Rede rural sujeita a temporais e oscilações constantes, colocando em risco a ventilação e a climatização de galpões com lotes de animais.',
      solucao:
        'Sistema de baterias de energia modular com acionamento automático instantâneo e silencioso.',
      resultado:
        'Operação contínua e protegida sem depender exclusivamente de geradores a diesel e do custo constante de combustível.',
    },
    {
      segmento: 'Clínicas e Centros Diagnósticos',
      desafio:
        'Equipamentos sensíveis de imagem e diagnóstico não podem sofrer microquedas nem ruídos elétricos durante os procedimentos.',
      solucao:
        'Baterias de energia de alta estabilidade atuando como reserva contínua de eletricidade limpa.',
      resultado:
        'Continuidade total nos atendimentos e redução no consumo durante a tarifa mais cara do início da noite.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#050A10] text-slate-100 antialiased selection:bg-emerald-500 selection:text-midnight-950 pb-16 md:pb-0">
      <SeoMeta
        title="Baterias de energia | Armazenamento e Backup | Delfos Engenharia"
        description="Baterias de energia para empresas e indústrias: economia no horário mais caro, energia de reserva ininterrupta e corte dos picos de consumo no Sul do Brasil. Delfos Engenharia."
        canonicalPath="/solucoes/bess"
        ogImage="/og-image.png"
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
            <span className="text-white font-semibold">Baterias de energia</span>
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
                  Solução 02 • Baterias de energia
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
                  Baterias de energia:{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    segurança e economia
                  </span>{' '}
                  para fugir da tarifa cara e zerar riscos de falta de luz.
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  As baterias de energia{' '}
                  <strong>não são um simples acessório do painel solar</strong>: são a central
                  inteligente que garante economia no horário mais caro, autonomia ininterrupta para
                  a sua operação e corte dos picos de consumo que encarecem a fatura.
                </p>

                {/* Bloco do problema resolvido */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Problema que as baterias de energia resolvem:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Tarifa mais cara entre 18h e 21h, vulnerabilidade a quedas e oscilações na rede
                    da distribuidora (gerando paradas de produção e prejuízo) e multas por picos de
                    consumo.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Button
                    onClick={scrollToContato}
                    className="bg-emerald-500 hover:bg-emerald-400 text-midnight-950 font-black px-8 py-6 text-base rounded-xl shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Solicitar orçamento</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>

                  <a
                    href="https://wa.me/5554991292121?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20baterias%20de%20energia%20com%20a%20engenharia%20da%20Delfos%20(Origem:%20solucao-bess)"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-white transition-all text-center"
                  >
                    <span>Falar com especialista no WhatsApp</span>
                  </a>
                </div>

                {/* Badges Técnicos */}
                <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Baterias de lítio de última geração</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>A luz não pisca nem desliga equipamentos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Monitoramento inteligente em tempo real</span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Destaque de Tecnologia e Especificações */}
              <div className="lg:col-span-5 space-y-5">
                {/* Card Institucional de Baterias de Energia */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Alta Tecnologia
                    </span>
                    <span className="text-xs text-slate-400">Padrão Empresarial e Rural</span>
                  </div>

                  <div className="flex items-start gap-4 pt-1">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <BatteryCharging className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        Sistemas seguros e com acionamento instantâneo
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Módulos de baterias de lítio com gerenciamento térmico inteligente, proteção
                        automática contra incêndio e resposta em milissegundos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Especificações em linguagem leiga */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                    <span className="text-xs uppercase text-emerald-400 font-bold">
                      Especificações do Sistema
                    </span>
                    <span className="text-xs text-slate-400">Engenharia Delfos</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block">Tecnologia das Baterias</span>
                      <strong className="text-sm font-bold text-white">
                        Lítio de última geração
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Vida Útil Longa</span>
                      <strong className="text-sm font-bold text-emerald-400">
                        Mais de 6.000 recargas com uso seguro
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Tempo de Acionamento</span>
                      <strong className="text-sm font-bold text-white">
                        Instantâneo (a luz não pisca)
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Capacidade do Sistema</span>
                      <strong className="text-sm font-bold text-cyan-300">
                        Sob medida para o seu consumo
                      </strong>
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
                Como as baterias de energia geram economia na sua fatura
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Entenda visualmente as funções fundamentais que transformam baterias em economia
                financeira direta e estabilidade para o seu negócio.
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                      Corte dos Picos de Consumo
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Corte dos picos de consumo que encarecem a fatura
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Em indústrias e grandes comércios, a ligação de máquinas pesadas gera picos de
                      consumo que duram poucos minutos, mas obrigam a empresa a contratar limites
                      altos com a distribuidora ou pagar pesadas multas tarifárias.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      O sistema de baterias monitora o consumo a cada instante. Ao detectar que a
                      operação está se aproximando do limite contratado,{' '}
                      <strong className="text-emerald-400">
                        a bateria injeta energia instantaneamente na empresa
                      </strong>
                      , aplainando a curva e eliminando a cobrança de multas na fatura.
                    </p>

                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300">
                      ✓ Resultado: Redução direta na cobrança mensal, permitindo ajustar o contrato
                      com a distribuidora sem risco de pagar multas.
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#091322] border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <span className="text-xs text-slate-400 uppercase block">
                      Curva de Consumo Fabril (Exemplo)
                    </span>
                    <div className="h-44 flex items-end justify-center gap-2 pt-4 px-2 border-b border-slate-700">
                      <div className="w-8 bg-slate-700 rounded-t h-[40%]" title="Consumo base" />
                      <div className="w-8 bg-slate-700 rounded-t h-[55%]" title="Consumo base" />
                      <div className="w-8 bg-slate-700 rounded-t h-[65%]" title="Consumo base" />
                      {/* Pico cortado pelas baterias */}
                      <div className="w-12 relative flex flex-col justify-end items-center h-[95%]">
                        <div className="w-full bg-emerald-400/90 rounded-t h-[40%] flex items-center justify-center text-[10px] font-bold text-midnight-950">
                          Baterias
                        </div>
                        <div className="w-full bg-slate-600 h-[60%]" />
                      </div>
                      <div className="w-8 bg-slate-700 rounded-t h-[70%]" title="Consumo base" />
                      <div className="w-8 bg-slate-700 rounded-t h-[50%]" title="Consumo base" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>08:00 (Início)</span>
                      <span className="text-emerald-400 font-bold">
                        Pico de consumo (Corte pelas baterias)
                      </span>
                      <span>18:00 (Fim)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTabDidatica === 'arbitragem' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                      Tarifa mais barata
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Economia no horário mais caro: carrega quando a energia é barata e usa à noite
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Para empresas com tarifas diferenciadas, o consumo durante a tarifa mais cara
                      entre 18h e 21h chega a custar de 4 a 5 vezes mais do que no restante do dia.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Com o sistema de baterias de energia, a empresa carrega nos momentos em que a
                      tarifa é mais barata e usa a energia armazenada à noite.{' '}
                      <strong className="text-cyan-300">
                        E se a empresa já tem energia solar, recarrega as baterias de graça com o
                        sol
                      </strong>{' '}
                      para consumir no início da noite sem comprar energia cara da distribuidora.
                    </p>

                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-900/60 text-xs text-cyan-300">
                      ✓ Resultado: Fuga total da tarifa cara do início da noite e máxima economia na
                      fatura mensal.
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#091322] border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <span className="text-xs text-slate-400 uppercase block">
                      Comparativo de Custo da Energia
                    </span>
                    <div className="space-y-3 text-left">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Horário Comum (Geração Solar / Fora de Ponta)</span>
                          <span className="font-bold text-emerald-400">Tarifa Econômica</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-[30%] h-full bg-emerald-400" />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>Horário Mais Caro (18h às 21h na rede)</span>
                          <span className="font-bold text-red-400">Até 4x a 5x mais caro</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="w-[90%] h-full bg-red-400" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      As baterias abastecem sua empresa automaticamente na faixa mais cara.
                    </p>
                  </div>
                </div>
              )}

              {activeTabDidatica === 'backup' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-in">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                      A luz não pisca nem desliga equipamentos
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Energia de reserva: sua empresa continua operando mesmo se a rede cair
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Geradores a diesel levam tempo para dar a partida, dependem de combustível
                      armazenado, emitem fumaça, fazem barulho alto e exigem manutenção mecânica
                      frequente.
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      As baterias de energia atuam de forma instantânea: a transição é tão rápida
                      que computadores, servidores, painéis de controle e equipamentos sensíveis
                      continuam ligados normalmente sem reiniciar.
                    </p>

                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-900/60 text-xs text-amber-300">
                      ✓ Resultado: Zero perda de produção ou dados, sem queima de placas eletrônicas
                      e silêncio absoluto.
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#091322] border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <span className="text-xs text-slate-400 uppercase block">
                      Comparativo com Gerador a Diesel
                    </span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-left">
                        <strong className="text-red-400 block mb-1">Gerador Diesel</strong>
                        <ul className="space-y-1 text-slate-400 text-[11px]">
                          <li>• Demora para ligar</li>
                          <li>• Combustível fóssil caro</li>
                          <li>• Ruído alto e fumaça</li>
                          <li>• Manutenção mecânica pesada</li>
                        </ul>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-left">
                        <strong className="text-emerald-400 block mb-1">Baterias Delfos</strong>
                        <ul className="space-y-1 text-slate-300 text-[11px]">
                          <li>• Acionamento instantâneo</li>
                          <li>• Recarga com geração solar própria</li>
                          <li>• Silêncio total</li>
                          <li>• Sem peças móveis ou queima</li>
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
                        <span>Solicitar orçamento</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* EXEMPLOS DE APLICAÇÃO PRÁTICA */}
        <section className="py-20 bg-[#080E18] border-t border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Exemplos de Aplicação Prática
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Como as baterias de energia resolvem desafios reais de operação
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2">
                Cenários onde o custo da falta de energia ou da tarifa cara supera amplamente o
                investimento no sistema de baterias.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exemplosAplicacao.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-400 uppercase font-bold">
                        {c.segmento}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase">
                        Exemplo de Aplicação
                      </span>
                    </div>

                    <div>
                      <strong className="text-xs text-red-400 uppercase block tracking-wider">
                        Desafio:
                      </strong>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">{c.desafio}</p>
                    </div>

                    <div>
                      <strong className="text-xs text-cyan-400 uppercase block tracking-wider">
                        Solução com Baterias:
                      </strong>
                      <p className="text-xs text-slate-200 leading-relaxed mt-1">{c.solucao}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <strong className="text-xs text-emerald-400 uppercase block tracking-wider">
                      Benefício Esperado:
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

        {/* FORMULÁRIO 2 ETAPAS COM ORIGEM "solucao-bess" E CTA PADRONIZADO */}
        <ContatoForm
          initialNecessidade="BESS (Armazenamento)"
          initialOrigem="solucao-bess"
          destaqueDark={true}
          tituloSecao="Solicite seu orçamento de baterias de energia"
          subtituloSecao="Nossos engenheiros analisam sua fatura de energia, histórico de consumo e necessidades de operação para dimensionar a capacidade ideal."
          textoBotaoFinal="Solicitar orçamento"
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
