import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Phone,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Minimize2,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { streamAgentChat } from '@/lib/skipAi'
import { createLead } from '@/services/leads'

interface MessageItem {
  id: string
  role: 'assistant' | 'user'
  content: string
  time: string
}

const WHATSAPP_NUMBER = '5554991292121'
const WHATSAPP_DISPLAY = '(54) 99129-2121'

// Mensagem inicial curta (apresentação como assistente virtual da Delfos + Pergunta 1)
const FIRST_MESSAGE =
  'Olá! Sou a assistente virtual da Delfos Engenharia. Já é cliente Delfos ou seu sistema foi feito por outra empresa?'

// Opções rápidas das 3 etapas iniciais
const STEP_1_OPTIONS = [
  'Sou cliente Delfos',
  'Instalei com outra empresa',
  'Quero conhecer os planos',
]

const STEP_2_OPTIONS = [
  'Usina parou de gerar',
  'Geração baixa',
  'Aviso no inversor',
  'Outro problema',
]

const STEP_3_OPTIONS = ['Urgente agora', 'Posso esperar']

export default function PlantaoWidgetFlutuante() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [step, setStep] = useState<number>(1) // 1 = cliente?, 2 = o que houve?, 3 = urgência?, 4 = nome/telefone, 5 = finalizado
  const [clientType, setClientType] = useState<string>('')
  const [problemType, setProblemType] = useState<string>('')
  const [urgency, setUrgency] = useState<string>('')

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: FIRST_MESSAGE,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [customWaMessage, setCustomWaMessage] = useState<string>('')
  const [hasLeadRegistered, setHasLeadRegistered] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      // Foco suave se não for mobile
      if (window.innerWidth > 640 && step >= 4) {
        inputRef.current?.focus()
      }
    }
  }, [messages, isLoading, isOpen, step])

  // Gerador dinâmico do link WhatsApp com resumo completo
  const buildWhatsAppLink = () => {
    const defaultText =
      'Olá equipe Delfos! Estou na página de O&M e gostaria de atendimento técnico prioritário para usina solar.'

    const answersList: string[] = []
    if (clientType) answersList.push(`• Relação: ${clientType}`)
    if (problemType) answersList.push(`• Situação: ${problemType}`)
    if (urgency) answersList.push(`• Urgência: ${urgency}`)

    const userTextMessages = messages.filter((m) => m.role === 'user').map((m) => m.content)

    // Pegar as últimas mensagens de texto do usuário (nome / cidade / tel)
    const extraInfo = userTextMessages.filter(
      (t) =>
        !STEP_1_OPTIONS.includes(t) && !STEP_2_OPTIONS.includes(t) && !STEP_3_OPTIONS.includes(t),
    )

    if (extraInfo.length > 0) {
      answersList.push(`• Contato/Local: ${extraInfo.join(' | ')}`)
    }

    let textToSend = defaultText
    if (answersList.length > 0) {
      textToSend = `Olá equipe Delfos! Realizei a triagem no Plantão de O&M.\n\n*Resumo da solicitação:*\n${answersList.join('\n')}\n\nSolicito atendimento técnico com prioridade.`
    }

    if (customWaMessage.trim()) {
      textToSend = customWaMessage.trim()
    }

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`
  }

  // Envio de mensagem
  const handleSend = async (overrideText?: string) => {
    const raw = (overrideText ?? inputValue).trim()
    if (!raw || isLoading) return

    setInputValue('')
    setHasInteracted(true)

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: raw,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Lógica determinística dos passos para garantir perguntas curtas (uma por vez)
    let currentStep = step
    let nextStep = step
    let selectedClient = clientType
    let selectedProblem = problemType
    let selectedUrgency = urgency

    if (currentStep === 1) {
      selectedClient = raw
      setClientType(raw)
      nextStep = 2
      setStep(2)
    } else if (currentStep === 2) {
      selectedProblem = raw
      setProblemType(raw)
      nextStep = 3
      setStep(3)
    } else if (currentStep === 3) {
      selectedUrgency = raw
      setUrgency(raw)
      nextStep = 4
      setStep(4)
    } else if (currentStep >= 4) {
      nextStep = 5
      setStep(5)
    }

    // Tentar extrair dados de contato e cadastrar lead
    if (currentStep >= 3) {
      attemptLeadRegistration(raw, selectedClient, selectedProblem, selectedUrgency)
    }

    const assistantMsgId = `assistant-${Date.now()}`
    const placeholderAssistant: MessageItem = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, placeholderAssistant])

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const backendUrl = import.meta.env.VITE_POCKETBASE_URL
      const response = await fetch(`${backendUrl}/backend/v1/plantao-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: raw,
          conversation_id: conversationId,
          stream: true,
        }),
        signal: controller.signal,
      })

      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        const streamResult = await streamAgentChat(response, {
          onChunk: (_delta, accumulated) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId ? { ...msg, content: accumulated } : msg,
              ),
            )
          },
          signal: controller.signal,
        })

        if (streamResult.conversation_id) {
          setConversationId(streamResult.conversation_id)
        }

        if (streamResult.content) {
          updateWhatsAppSummary(
            raw,
            streamResult.content,
            selectedClient,
            selectedProblem,
            selectedUrgency,
          )
        }
      } else {
        const data = await response.json()
        if (data.conversation_id) {
          setConversationId(data.conversation_id)
        }
        const finalContent = data.content || getDeterministicStepReply(currentStep, raw)
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: finalContent } : msg)),
        )
        updateWhatsAppSummary(raw, finalContent, selectedClient, selectedProblem, selectedUrgency)
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return

      // Fallback determinístico elegante (máximo 2 frases, uma pergunta por vez)
      const fallbackReply = getDeterministicStepReply(currentStep, raw)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: fallbackReply } : msg)),
      )
      updateWhatsAppSummary(raw, fallbackReply, selectedClient, selectedProblem, selectedUrgency)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  // Resposta determinística curta alinhada com as etapas
  const getDeterministicStepReply = (currentStep: number, userText: string): string => {
    if (currentStep === 1) {
      if (userText.includes('outra') || userText.includes('não') || userText.includes('nao')) {
        return 'Perfeito, atendemos usinas de qualquer empresa com Vistoria Diagnóstica. O que aconteceu com o seu sistema?'
      }
      if (userText.includes('planos')) {
        return 'Ótimo, temos planos com SLA de resposta rápida e termografia. O que motivou seu interesse hoje?'
      }
      return 'Perfeito, cliente Delfos tem prioridade total em nossa base. O que aconteceu com a sua usina?'
    }

    if (currentStep === 2) {
      return 'Entendido. Qual é o nível de urgência da sua situação?'
    }

    if (currentStep === 3) {
      return 'Perfeito, anotei a urgência. Por favor, informe seu nome e município ou WhatsApp para finalizarmos.'
    }

    return 'Excelente! Seu chamado foi registrado no nosso plantão com prioridade alta. Você pode clicar em "Acionar WhatsApp" acima para falar agora com nosso engenheiro.'
  }

  // Tentativa de gravar lead no backend se encontrar telefone ou após dados de contato
  const attemptLeadRegistration = async (
    text: string,
    client: string,
    problem: string,
    urgencyVal: string,
  ) => {
    if (hasLeadRegistered) return

    const phoneRegex = /(?:\+?55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[-\s]?\d{4}/g
    const match = text.match(phoneRegex)

    // Se estiver na etapa de contato ou encontrou telefone
    const isContactStep = step >= 4
    if (match || isContactStep) {
      const phoneFound = match ? match[0] : ''
      const summaryMsg = `[URGENTE - PLANTÃO IA] Triagem widget O&M. Cliente: ${client || 'Não informado'} | Situação: ${problem || 'Não informado'} | Urgência: ${urgencyVal || 'Não informado'} | Dados digitados: "${text}"`

      try {
        await createLead({
          nome: text.split(/[,\n-]/)[0]?.slice(0, 40) || 'Lead Widget Plantão IA',
          telefone: phoneFound || '54991292121',
          email: 'plantao@delfosengenharia.com.br',
          cidade: text.length < 30 && !phoneFound ? text : undefined,
          necessidade: 'Manutenção',
          origem: 'plantao-ia',
          ja_possui_solar: 'Sim',
          mensagem: summaryMsg,
        })
        setHasLeadRegistered(true)
      } catch (e) {
        console.warn('Registro de lead secundário:', e)
      }
    }
  }

  const updateWhatsAppSummary = (
    userQuery: string,
    assistantReply: string,
    client: string,
    problem: string,
    urgencyVal: string,
  ) => {
    const summary = `Olá equipe Delfos! Realizei a triagem com a Assistente Virtual no plantão O&M.\n\n*Relação:* ${client || 'Cliente/Outro'}\n*Situação:* ${problem || userQuery}\n*Urgência:* ${urgencyVal || 'Alta'}\n\nSolicito atendimento técnico prioritário.`
    setCustomWaMessage(summary)
  }

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setStep(1)
    setClientType('')
    setProblemType('')
    setUrgency('')
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: FIRST_MESSAGE,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setConversationId(null)
    setInputValue('')
    setCustomWaMessage('')
    setHasLeadRegistered(false)
  }

  return (
    <>
      {/* 1. BALÃO CIRCULAR FIXO NO CANTO INFERIOR DIREITO (Estilo Conta Azul / SolarView) */}
      <div className="fixed bottom-20 md:bottom-6 right-5 sm:right-6 z-50">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir atendimento do Plantão de IA"
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-midnight-950 via-slate-900 to-[#0A2744] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-solar-400 cursor-pointer focus:outline-none focus:ring-4 focus:ring-solar-400/30"
          >
            {/* Anel pulsante de atenção */}
            <span className="absolute -inset-1 rounded-full bg-solar-400/30 animate-ping opacity-60 pointer-events-none" />

            <div className="relative flex items-center justify-center">
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-solar-400 group-hover:scale-110 transition-transform" />
              {/* Badge indicando online */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>

            {/* Tooltip convidativo no hover em telas médias/grandes */}
            <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-white/10 pointer-events-none">
              Plantão de Atendimento IA • O&M
            </span>
          </button>
        ) : null}
      </div>

      {/* 2. JANELA DE CHAT FLUTUANTE LIMPA (Estilo Conta Azul / SolarView) */}
      {isOpen && (
        <aside
          aria-label="Janela de atendimento do Plantão de IA"
          className={`fixed z-50 shadow-2xl transition-all duration-200 flex flex-col bg-white overflow-hidden border border-slate-200 ${
            isExpanded
              ? 'inset-2 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[480px] sm:h-[640px] rounded-2xl'
              : 'bottom-20 sm:bottom-6 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[380px] md:w-[400px] h-[520px] sm:h-[560px] rounded-2xl'
          }`}
        >
          {/* CABEÇALHO LIMPO E PROFISSIONAL */}
          <header className="bg-gradient-to-r from-[#071F38] via-[#0C2B4E] to-[#0A2644] text-white px-4 py-3 shrink-0 flex flex-col gap-2.5 border-b border-blue-900/40">
            {/* Linha superior: Status do Assistente + Ações da Janela */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-solar-400 text-midnight-950 flex items-center justify-center font-bold shadow-sm">
                    <Bot className="w-4 h-4 text-midnight-950" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                      Assistente Delfos
                    </h2>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                      O&M
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Plantão de suporte ágil
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reiniciar conversa"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Reduzir janela' : 'Expandir janela'}
                  className="hidden sm:inline-flex p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Fechar chat"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BOTÃO "ACIONAR WHATSAPP" SEMPRE VISÍVEL NO CABEÇALHO DESDE A PRIMEIRA MENSAGEM */}
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acionar WhatsApp com a equipe de engenharia"
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-emerald-400/40"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 animate-pulse" />
                <span>Acionar WhatsApp</span>
              </div>
              <span className="text-[10px] font-mono opacity-90">{WHATSAPP_DISPLAY}</span>
            </a>
          </header>

          {/* CORPO DE MENSAGENS COM ROLAGEM */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant'
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-full bg-solar-400 text-midnight-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5 text-midnight-950" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] leading-relaxed shadow-xs ${
                      isAssistant
                        ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                        : 'bg-solar-400 text-midnight-950 font-medium rounded-tr-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span
                      className={`block text-[9px] mt-1 ${
                        isAssistant ? 'text-slate-400' : 'text-midnight-950/70 text-right'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {!isAssistant && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Indicador de digitando */}
            {isLoading && (
              <div className="flex gap-2 justify-start items-center text-slate-500">
                <div className="w-6 h-6 rounded-full bg-solar-400 text-midnight-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-3.5 h-3.5 text-midnight-950" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-solar-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-solar-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-solar-400 animate-bounce" />
                  <span className="text-[11px] text-slate-500 ml-1">Assistente digitando...</span>
                </div>
              </div>
            )}

            {/* BOTÕES DE RESPOSTA RÁPIDA: UMA PERGUNTA POR VEZ */}
            {!isLoading && (
              <div className="pt-1">
                {/* 1) "Já é cliente Delfos?" */}
                {step === 1 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      Selecione uma resposta:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {STEP_1_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSend(opt)}
                          className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200 hover:border-solar-400 shadow-xs transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span>{opt}</span>
                          <span className="text-solar-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2) "O que aconteceu?" */}
                {step === 2 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      O que aconteceu com a usina?
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {STEP_2_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSend(opt)}
                          className="text-left px-2.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs border border-slate-200 hover:border-solar-400 shadow-xs transition-all cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3) Urgência */}
                {step === 3 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      Qual é a urgência?
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {STEP_3_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSend(opt)}
                          className={`text-center py-2 px-3 rounded-xl font-bold text-xs border shadow-xs transition-all cursor-pointer ${
                            opt === 'Urgente agora'
                              ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4) Etapa de Nome + Município/Telefone */}
                {step === 4 && (
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900">
                    <span className="font-bold block mb-0.5">Etapa final de contato:</span>
                    Digite abaixo seu <strong>nome</strong> e <strong>cidade ou telefone</strong>{' '}
                    para o registro.
                  </div>
                )}

                {/* 5) Finalizado: confirmação com botão de WhatsApp */}
                {step >= 5 && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Chamado gravado no plantão Delfos</span>
                    </div>
                    <p className="text-[11px] text-emerald-900">
                      Nossa equipe técnica já recebeu sua triagem. Clique no botão abaixo para abrir
                      o WhatsApp com tudo preenchido:
                    </p>
                    <a
                      href={buildWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Conversar agora no WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* RODAPÉ COM CAMPO DE TEXTO LIMPO */}
          <footer className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-1.5"
            >
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  step === 4
                    ? 'Ex: João Silva, Erechim, (54) 99999-0000...'
                    : 'Escreva sua mensagem ou escolha acima...'
                }
                disabled={isLoading}
                className="h-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-solar-400 rounded-xl"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="h-10 px-3 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-solar-500" />
                Triagem com IA Delfos
              </span>
              <span>Erechim/RS</span>
            </div>
          </footer>
        </aside>
      )}
    </>
  )
}
