import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  Phone,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
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

const FIRST_MESSAGE =
  'Olá! Sou a Assistente Virtual do Plantão de Emergência da Delfos Engenharia em Erechim/RS. Estou aqui para agilizar seu atendimento técnico. Para começarmos a triagem imediata: Você já é cliente da Delfos Engenharia ou seu sistema solar foi instalado por outra empresa?'

export default function PlantaoEmergenciaIa() {
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
  const [leadSaved, setLeadSaved] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  // Gerar texto pré-preenchido de WhatsApp baseado na conversa
  const buildWhatsAppLink = () => {
    const defaultText =
      'Olá equipe de Plantão da Delfos Engenharia! Estou na página de O&M e preciso de atendimento técnico de emergência para meu sistema solar.'

    const conversationSummary = messages
      .filter((m) => m.role === 'user')
      .map((m) => `• ${m.content}`)
      .join('\n')

    let textToSend = defaultText
    if (conversationSummary.length > 0) {
      textToSend = `Olá equipe Delfos! Realizei a triagem no Plantão de Emergência da página O&M.\n\n*Resumo das minhas respostas:*\n${conversationSummary}\n\nSolicito retorno prioritário da equipe técnica.`
    }

    if (customWaMessage.trim()) {
      textToSend = customWaMessage.trim()
    }

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`
  }

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim()
    if (!text || isLoading) return

    setInputValue('')

    const userMessageId = `user-${Date.now()}`
    const userMsg: MessageItem = {
      id: userMessageId,
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Tentar extrair telefone ou nome e salvar lead preventivamente se fornecido
    extractAndSaveLeadIfPresent(text)

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
          message: text,
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

        // Atualizar mensagem de WhatsApp com base no desfecho
        if (streamResult.content) {
          generateWhatsAppSummary(text, streamResult.content)
        }
      } else {
        // Fallback sync se SSE não retornar stream
        const data = await response.json()
        if (data.conversation_id) {
          setConversationId(data.conversation_id)
        }
        const finalContent =
          data.content ||
          'Recebemos sua mensagem! Nossa equipe técnica do plantão está de prontidão. Clique no botão de WhatsApp para conexão direta.'

        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: finalContent } : msg)),
        )

        generateWhatsAppSummary(text, finalContent)
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }

      console.warn('Fallback local para agente:', err)
      // Fallback gracioso com a lógica do prompt de triagem se o endpoint demorar ou offline
      const fallbackResponse = getLocalFallbackResponse(text, messages.length)

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, content: fallbackResponse } : msg,
        ),
      )

      generateWhatsAppSummary(text, fallbackResponse)
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  // Fallback conversacional determinístico que segue 100% o fluxo solicitado pelo cliente
  const getLocalFallbackResponse = (userText: string, turnCount: number): string => {
    const lower = userText.toLowerCase()

    if (turnCount <= 2) {
      if (
        lower.includes('sim') ||
        lower.includes('sou cliente') ||
        lower.includes('delfos') ||
        lower.includes('já sou') ||
        lower.includes('ja sou')
      ) {
        return 'Perfeito, cliente Delfos! Seu atendimento possui prioridade imediata em nossa base. Por favor, me informe: qual é o seu equipamento (inversor/usina solar, baterias ou recarga), o que aconteceu (parou de gerar, deu alarme vermelho, disjuntor desarmou) e em qual município está localizada?'
      }

      if (
        lower.includes('não') ||
        lower.includes('nao') ||
        lower.includes('outro') ||
        lower.includes('outra empresa') ||
        lower.includes('terceiro')
      ) {
        return 'Excelente, seja muito bem-vindo! Na Delfos Engenharia atendemos usinas de qualquer instalador. Para casos com falhas ou perda de geração em sistemas de terceiros, realizamos a Vistoria Diagnóstica (medição elétrica, termografia de placas e laudo de engenharia), que também é a porta de entrada para nosso plano de manutenção contínua. Qual é a falha apresentada e em qual município fica sua usina?'
      }
    }

    if (
      lower.includes('plano') ||
      lower.includes('preventiv') ||
      lower.includes('contrat') ||
      lower.includes('limpeza')
    ) {
      return 'Ótimo! Nosso plano de O&M inclui monitoramento contínuo, limpeza técnica especializada e termografia aérea por drone com SLA de resposta. Para montarmos a proposta ideal, me informe: qual é a potência aproximada (residencial, comercial ou usina de solo) e seu WhatsApp de contato.'
    }

    return (
      'Entendido! Todas as informações foram anotadas com prioridade alta pelo Plantão de Emergência da Delfos. ' +
      'Por gentileza, informe seu Nome e WhatsApp com DDD caso ainda não tenha enviado, e clique no botão verde "Acionar WhatsApp" ao lado para abrir a conversa com todo o histórico já preenchido para nosso engenheiro de plantão!'
    )
  }

  // Tenta extrair telefone/dados se o usuário digitar no chat
  const extractAndSaveLeadIfPresent = async (text: string) => {
    const phoneRegex = /(?:\+?55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[-\s]?\d{4}/g
    const match = text.match(phoneRegex)

    if (match && !leadSaved) {
      const cleanPhone = match[0].replace(/\D/g, '')
      if (cleanPhone.length >= 8) {
        try {
          await createLead({
            nome: 'Lead Plantão IA (Página O&M)',
            telefone: match[0],
            email: 'plantao@delfosengenharia.com.br',
            necessidade: 'Manutenção',
            origem: 'plantao-ia',
            mensagem: `[URGENTE - PRIORIDADE ALTA] Triagem iniciada no widget de O&M. Mensagem do cliente: "${text}"`,
          })
          setLeadSaved(true)
        } catch (e) {
          console.warn('Erro ao salvar lead preventivo:', e)
        }
      }
    }
  }

  const generateWhatsAppSummary = (userQuery: string, assistantReply: string) => {
    const summary = `Olá equipe Delfos! Estive conversando com a Assistente Virtual de Plantão na página O&M.\n\n*Minha situação:* ${userQuery}\n*Triagem da IA:* ${assistantReply.slice(0, 160)}...\n\nSolicito atendimento técnico com prioridade alta!`
    setCustomWaMessage(summary)
  }

  const handleQuickOption = (optionText: string) => {
    handleSend(optionText)
  }

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
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
  }

  return (
    <div
      id="plantao-emergencia-ia"
      className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-[#0B2544] to-[#07192F] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border-2 border-solar-400/40 overflow-hidden"
    >
      {/* Luzes decorativas */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-solar-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header do Bloco do Plantão */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-black uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Plantão de Emergência & Suporte Ágil
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-solar-300 bg-solar-400/10 border border-solar-400/20 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-solar-400" />
              Triagem com IA Nativa
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              Erechim/RS e Região Norte
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Usina solar parada ou com alarme?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-300 via-amber-200 to-white">
              Triagem Imediata
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Assistente virtual para diagnóstico rápido e registro prioritário no plantão da Delfos.
            Atendemos usinas de qualquer instalador.
          </p>
        </div>

        {/* WhatsApp sempre visível desde a primeira mensagem no topo também */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-slate-400 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5 rounded-xl border border-white/10"
            title="Reiniciar triagem"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </Button>
        </div>
      </div>

      {/* Grid Principal: Chat Interativo + Coluna Lateral WhatsApp Permanente */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
        {/* Chat do Agente (8 colunas) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col bg-slate-950/80 rounded-2xl border border-white/15 overflow-hidden backdrop-blur-md shadow-inner">
          {/* Barra de Status do Agente */}
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-solar-400 text-midnight-950 flex items-center justify-center font-bold shadow">
                <Bot className="w-4 h-4 text-midnight-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">Assistente Virtual Delfos</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Plantão O&M • Resposta técnica imediata
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-solar-400" />
              <span>Prioridade Alta em /admin</span>
            </div>
          </div>

          {/* Área de Mensagens com scroll */}
          <div className="p-4 sm:p-5 overflow-y-auto max-h-[380px] min-h-[280px] space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-solar-400 text-midnight-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4 text-midnight-950" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-solar-400 text-midnight-950 font-medium rounded-tr-xs shadow-md'
                      : 'bg-white/10 text-slate-100 border border-white/10 rounded-tl-xs backdrop-blur-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      msg.role === 'user' ? 'text-midnight-950/70 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-solar-400 text-midnight-950 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-midnight-950" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white/10 text-slate-200 border border-white/10 rounded-tl-xs flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-solar-400 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-solar-400 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-solar-400 animate-bounce"></span>
                  </div>
                  <span className="text-xs text-slate-300">Analisando chamado técnico...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Botões de Resposta Rápida (Triagem) */}
          {messages.length <= 2 && (
            <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 flex flex-wrap gap-2 items-center">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">
                Resposta rápida:
              </span>
              <button
                type="button"
                onClick={() => handleQuickOption('Sim, já sou cliente da Delfos Engenharia')}
                className="px-3 py-1.5 rounded-lg bg-solar-400/20 hover:bg-solar-400 text-solar-300 hover:text-midnight-950 font-semibold text-xs border border-solar-400/30 transition-all cursor-pointer"
              >
                ✓ Já sou cliente Delfos
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickOption(
                    'Não sou cliente, meu sistema foi instalado por outra empresa e preciso de manutenção/vistoria',
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs border border-white/20 transition-all cursor-pointer"
              >
                Instalado por outro (Vistoria Diagnóstica)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickOption('Quero contratar plano de manutenção preventiva e O&M')
                }
                className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 font-semibold text-xs border border-blue-400/30 transition-all cursor-pointer"
              >
                Conhecer Planos O&M
              </button>
            </div>
          )}

          {/* Campo de Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-midnight-950/90 border-t border-white/10 flex items-center gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua resposta ou descreva a falha (marca, alarme, cidade)..."
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm h-11 rounded-xl focus-visible:ring-solar-400"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold h-11 px-4 rounded-xl shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Coluna Lateral: Botão "Acionar WhatsApp" VISÍVEL PERMANENTEMENTE DESDE A PRIMEIRA MENSAGEM */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between space-y-4">
          {/* Card de Ação Imediata WhatsApp */}
          <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-midnight-950 border-2 border-emerald-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Canal Direto Prioritário
                </span>
                <span className="text-[11px] font-mono text-slate-400">{WHATSAPP_DISPLAY}</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Prefere falar direto com o engenheiro de plantão?
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                O botão abaixo fica{' '}
                <strong className="text-emerald-300">
                  sempre visível desde o primeiro instante
                </strong>
                . Conforme você conversa com o assistente, sua mensagem para o WhatsApp é
                automaticamente pré-preenchida com o diagnóstico.
              </p>

              {/* Botão Verde de WhatsApp Permanente */}
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-5 rounded-xl shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm cursor-pointer border border-emerald-400/40"
              >
                <Phone className="w-5 h-5 shrink-0 animate-bounce" />
                <span>Acionar WhatsApp Agora</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </a>

              <p className="text-[10px] text-center text-slate-400">
                Leva o resumo da conversa direto para a equipe de plantão
              </p>
            </div>

            {/* Destaques Técnicos do Plantão */}
            <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atendemos usinas de qualquer instalador</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-solar-400 shrink-0" />
                <span>Vistoria diagnóstica com termografia por drone</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Equipe com registro no CREA-RS e NR-10/NR-35</span>
              </div>
            </div>
          </div>

          {/* Aviso de Segurança de Usina Solar */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block text-amber-300 font-bold">Orientação de Segurança:</strong>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Em caso de faíscas, cheiro de queimado ou água perto dos inversores, desligue a
                chave geral CA do quadro se tiver acesso seguro e não toque nos cabos elétricos.
                Chame nosso plantão imediatamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
