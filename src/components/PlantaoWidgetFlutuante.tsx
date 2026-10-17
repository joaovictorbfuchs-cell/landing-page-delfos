import { useState, useRef, useEffect, type ChangeEvent } from 'react'
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
  Paperclip,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft,
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
  attachmentName?: string
}

const WHATSAPP_NUMBER = '5554991292121'
const WHATSAPP_DISPLAY = '(54) 99129-2121'

// Mensagem inicial curta (apresentação como assistente virtual da Delfos + Pergunta 1)
const FIRST_MESSAGE =
  'Olá! Sou a assistente virtual da Delfos Engenharia. Já é cliente Delfos ou seu sistema foi feito por outra empresa?'

// Opções rápidas das etapas
const STEP_1_OPTIONS = [
  'Sou cliente Delfos',
  'Instalei com outra empresa',
  'Quero conhecer os planos',
]

// Quando é cliente validado
const CLIENT_SUB_OPTIONS = [
  'Suporte técnico na usina',
  'Dúvida sobre a conta',
  'Agendar manutenção preventiva',
]

const STEP_PROBLEM_OPTIONS = [
  'Usina parou de gerar',
  'Geração baixa',
  'Aviso no inversor',
  'Outro problema',
]

const STEP_URGENCY_OPTIONS = ['Urgente agora', 'Posso esperar']

interface PlantaoWidgetFlutuanteProps {
  isOpen?: boolean
  onClose?: () => void
  onBackToMenu?: () => void
  origemLead?: string
  hideFloatingButton?: boolean
}

export default function PlantaoWidgetFlutuante({
  isOpen: controlledIsOpen,
  onClose,
  onBackToMenu,
  origemLead = 'plantao-ia',
  hideFloatingButton = false,
}: PlantaoWidgetFlutuanteProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = (open: boolean) => {
    if (controlledIsOpen !== undefined) {
      if (!open && onClose) onClose()
    } else {
      setInternalIsOpen(open)
    }
  }

  const [isExpanded, setIsExpanded] = useState(false)

  // Sub-estados da conversa:
  // 1: identificação inicial ("Já é cliente?")
  // 'validar_cliente': pedir e-mail ou telefone para conferir cadastro
  // 'cliente_menu': opções do cliente ("Suporte técnico", "Dúvida sobre a conta", "Manutenção")
  // 'duvida_conta_anexo': tela/estado para upload do PDF da conta
  // 2: problema técnico ("O que aconteceu com a usina?")
  // 3: urgência ("Urgente agora" ou "Posso esperar")
  // 4: dados de contato finais (nome, cidade, telefone)
  // 5: finalizado
  const [step, setStep] = useState<number | string>(1)

  const [clientType, setClientType] = useState<string>('')
  const [isClientValidated, setIsClientValidated] = useState<boolean | null>(null)
  const [clientData, setClientData] = useState<{
    nome?: string
    telefone?: string
    email?: string
  } | null>(null)
  const [problemType, setProblemType] = useState<string>('')
  const [urgency, setUrgency] = useState<string>('')

  // Anexo de fatura/conta de luz
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [fileAttachedLeadRegistered, setFileAttachedLeadRegistered] = useState(false)

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
  const [, setHasInteracted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      if (window.innerWidth > 640 && (step === 4 || step === 'validar_cliente')) {
        inputRef.current?.focus()
      }
    }
  }, [messages, isLoading, isOpen, step])

  // Gerador dinâmico do link WhatsApp com resumo completo
  const buildWhatsAppLink = () => {
    const defaultText =
      'Olá equipe Delfos! Estou na página de O&M e gostaria de atendimento técnico prioritário para usina solar.'

    if (customWaMessage.trim()) {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customWaMessage.trim())}`
    }

    const answersList: string[] = []
    if (clientType) answersList.push(`• Relação: ${clientType}`)
    if (isClientValidated !== null) {
      answersList.push(
        `• Cadastro validado: ${isClientValidated ? 'Sim' : 'Não localizado (vistoria)'}`,
      )
    }
    if (clientData?.nome) answersList.push(`• Cliente: ${clientData.nome}`)
    if (problemType) answersList.push(`• Situação: ${problemType}`)
    if (urgency) answersList.push(`• Urgência: ${urgency}`)
    if (selectedFile) answersList.push(`• Anexo de conta de luz: ${selectedFile.name}`)

    const userTextMessages = messages.filter((m) => m.role === 'user').map((m) => m.content)
    const extraInfo = userTextMessages.filter(
      (t) =>
        !STEP_1_OPTIONS.includes(t) &&
        !STEP_PROBLEM_OPTIONS.includes(t) &&
        !STEP_URGENCY_OPTIONS.includes(t) &&
        !CLIENT_SUB_OPTIONS.includes(t),
    )

    if (extraInfo.length > 0) {
      answersList.push(`• Contato/Local informado: ${extraInfo.slice(-2).join(' | ')}`)
    }

    let textToSend = defaultText
    if (answersList.length > 0) {
      textToSend = `Olá equipe Delfos! Realizei a triagem no Plantão de O&M.\n\n*Resumo da solicitação:*\n${answersList.join('\n')}\n\nSolicito atendimento técnico com prioridade.`
    }

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`
  }

  // Validação no backend de cliente Delfos por telefone ou e-mail
  const callValidarClienteBackend = async (
    termo: string,
  ): Promise<{
    valido: boolean
    cliente?: { nome: string; telefone?: string; email?: string }
  }> => {
    try {
      const backendUrl = import.meta.env.VITE_POCKETBASE_URL
      const resp = await fetch(`${backendUrl}/backend/v1/validar-cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ termo }),
      })
      if (resp.ok) {
        const data = await resp.json()
        return data
      }
    } catch (e) {
      console.warn('Erro ao chamar validar-cliente:', e)
    }
    return { valido: false }
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

    const currentStep = step

    // ==========================================
    // ETAPA 1: Identificação inicial
    // ==========================================
    if (currentStep === 1) {
      if (raw === 'Sou cliente Delfos') {
        setClientType('Sou cliente Delfos')
        setStep('validar_cliente')
        const reply =
          'Entendi, você já é cliente Delfos! Para ativarmos seu atendimento prioritário, por favor informe seu telefone (com DDD) ou e-mail cadastrado.'
        appendAssistantMessage(reply)
        setIsLoading(false)
        return
      }

      if (raw === 'Instalei com outra empresa') {
        setClientType('Instalei com outra empresa')
        setIsClientValidated(false)
        setStep(2)
        const reply =
          'Entendi, sua usina foi feita por outra empresa. Atendemos usinas de qualquer instalador com nossa Vistoria Diagnóstica! O que está acontecendo com a usina?'
        appendAssistantMessage(reply)
        setIsLoading(false)
        return
      }

      if (raw === 'Quero conhecer os planos') {
        setClientType('Quero conhecer os planos')
        setIsClientValidated(false)
        setStep(2)
        const reply =
          'Perfeito! Temos planos de O&M (Essencial, Pro e Usinas) com SLA rápido e termografia. O que motivou seu contato ou qual a situação da sua usina?'
        appendAssistantMessage(reply)
        setIsLoading(false)
        return
      }

      // Usuário digitou texto livre na etapa 1
      setClientType(raw)
      setStep(2)
      const reply = `Entendi: "${raw}". Atendemos usinas de qualquer instalador. O que está acontecendo com o seu sistema solar?`
      appendAssistantMessage(reply)
      setIsLoading(false)
      return
    }

    // ==========================================
    // ETAPA: Validação de cliente (telefone/e-mail)
    // ==========================================
    if (currentStep === 'validar_cliente') {
      const result = await callValidarClienteBackend(raw)
      if (result.valido && result.cliente) {
        setIsClientValidated(true)
        setClientData(result.cliente)
        setStep('cliente_menu')
        const reply = `Cadastro localizado com sucesso, ${result.cliente.nome}! Atendimento prioritário Delfos ativo. Como podemos te ajudar hoje?`
        appendAssistantMessage(reply)
      } else {
        setIsClientValidated(false)
        setStep(2)
        const reply =
          'Não localizamos esse contato em nossa base de usinas instaladas. Mas não se preocupe: a Delfos atende usinas de qualquer instalador com nossa Vistoria Diagnóstica! O que está acontecendo com seu sistema?'
        appendAssistantMessage(reply)
      }
      setIsLoading(false)
      return
    }

    // ==========================================
    // ETAPA: Menu do Cliente Delfos
    // ==========================================
    if (currentStep === 'cliente_menu') {
      if (raw === 'Dúvida sobre a conta') {
        setProblemType('Dúvida sobre a conta de luz')
        setStep('duvida_conta_anexo')
        const reply =
          'Entendi, você tem dúvida sobre a fatura de energia! Você pode anexar o PDF da sua conta de luz logo abaixo para que nossa equipe técnica de engenharia faça a análise detalhada.'
        appendAssistantMessage(reply)
        setIsLoading(false)
        return
      }

      if (raw === 'Suporte técnico na usina') {
        setProblemType('Suporte técnico')
        setStep(2)
        const reply =
          'Entendido, vamos abrir o suporte técnico da sua usina. O que você notou no sistema?'
        appendAssistantMessage(reply)
        setIsLoading(false)
        return
      }

      if (raw === 'Agendar manutenção preventiva') {
        setProblemType('Manutenção preventiva')
        setStep(3)
        const reply =
          'Ótimo! A manutenção preventiva mantém a garantia e a geração máxima. Qual a urgência para a visita da nossa equipe técnica?'
        appendAssistantMessage(reply)
        setIsLoading(false)
        return
      }

      // Outro texto livre
      setProblemType(raw)
      setStep(3)
      const reply = `Entendido: "${raw}". Qual é a urgência da sua solicitação?`
      appendAssistantMessage(reply)
      setIsLoading(false)
      return
    }

    // ==========================================
    // ETAPA: Dúvida sobre a conta (se digitou texto sem anexo)
    // ==========================================
    if (currentStep === 'duvida_conta_anexo') {
      setStep(4)
      const reply = `Entendi sua dúvida sobre a fatura: "${raw}". Por favor, confirme seu nome e telefone para que nossa equipe técnica analise a conta e retorne o parecer.`
      appendAssistantMessage(reply)
      setIsLoading(false)
      return
    }

    // ==========================================
    // ETAPA 2: Problema técnico
    // ==========================================
    if (currentStep === 2) {
      setProblemType(raw)
      setStep(3)
      const reply = getConfirmProblemReply(raw)
      appendAssistantMessage(reply)
      setIsLoading(false)
      return
    }

    // ==========================================
    // ETAPA 3: Urgência
    // ==========================================
    if (currentStep === 3) {
      setUrgency(raw)
      setStep(4)
      const reply =
        raw === 'Urgente agora'
          ? 'Compreendido, urgência imediata anotada! Para o plantão registrar o chamado com prioridade alta, digite seu nome e telefone/WhatsApp.'
          : 'Perfeito, anotei que pode aguardar a programação técnica. Por favor, digite seu nome e telefone/WhatsApp para contato.'
      appendAssistantMessage(reply)
      setIsLoading(false)
      return
    }

    // ==========================================
    // ETAPA 4+: Dados de contato / finalização
    // ==========================================
    if (currentStep === 4 || (typeof currentStep === 'number' && currentStep >= 4)) {
      setStep(5)
      attemptLeadRegistration(raw, clientType, problemType, urgency, selectedFile)

      // Chamar o agente ou fornecer confirmação final assertiva
      await handleFinalStepAgent(raw)
      return
    }

    setIsLoading(false)
  }

  // Utilitário para adicionar resposta determinística do assistente
  const appendAssistantMessage = (content: string, attachmentName?: string) => {
    const assistantMsg: MessageItem = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      attachmentName,
    }
    setMessages((prev) => [...prev, assistantMsg])
    updateWhatsAppSummary()
  }

  // Frase de confirmação sem repetir pergunta para o problema
  const getConfirmProblemReply = (problem: string): string => {
    if (problem === 'Usina parou de gerar') {
      return 'Entendi, sua usina parou de gerar totalmente. Qual é o nível de urgência no momento?'
    }
    if (problem === 'Geração baixa') {
      return 'Entendi, a usina está produzindo abaixo do esperado. Qual é a urgência para a vistoria técnica?'
    }
    if (problem === 'Aviso no inversor') {
      return 'Entendi, o inversor está apresentando código de aviso ou falha. Qual é o nível de urgência?'
    }
    return `Entendi o relato: "${problem}". Qual é a urgência da sua situação?`
  }

  // Chamada de IA na etapa final ou fallback
  const handleFinalStepAgent = async (userText: string) => {
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
      const promptContext = `[Contexto da triagem: Cliente=${clientType || 'Não informado'} | Validado=${isClientValidated ? 'Sim' : 'Não'} | Situação=${problemType || 'O&M'} | Urgência=${urgency || 'Alta'} | Anexo=${selectedFile ? selectedFile.name : 'Nenhum'}] Contato informado pelo usuário: ${userText}`

      const response = await fetch(`${backendUrl}/backend/v1/plantao-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptContext,
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
      } else {
        const data = await response.json()
        if (data.conversation_id) {
          setConversationId(data.conversation_id)
        }
        const finalContent =
          data.content ||
          'Recebi seus dados com sucesso! Seu chamado está registrado no plantão Delfos. Se preferir atendimento imediato, clique no botão "Acionar WhatsApp" acima.'
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: finalContent } : msg)),
        )
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      const fallbackReply =
        'Recebi seus dados com sucesso! Seu chamado está registrado no plantão Delfos com prioridade alta. Você pode clicar em "Acionar WhatsApp" acima para falar agora com nosso engenheiro.'
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? { ...msg, content: fallbackReply } : msg)),
      )
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
      updateWhatsAppSummary()
    }
  }

  // Upload do PDF da conta de luz
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo (PDF ou imagens)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Por favor, selecione um arquivo no formato PDF ou imagem da fatura.')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('O arquivo selecionado deve ter no máximo 15MB.')
      return
    }

    setSelectedFile(file)
    setIsUploadingFile(true)

    // Mensagem do usuário com o arquivo anexado
    const userMsg: MessageItem = {
      id: `user-file-${Date.now()}`,
      role: 'user',
      content: `Enviei a fatura: ${file.name}`,
      attachmentName: file.name,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])

    // Registrar lead imediatamente com o arquivo da conta
    try {
      const contactName = clientData?.nome || 'Cliente com Dúvida de Fatura'
      const contactPhone = clientData?.telefone || '54991292121'
      const contactEmail = clientData?.email || 'plantao@delfosengenharia.com.br'

      await createLead({
        nome: contactName,
        telefone: contactPhone,
        email: contactEmail,
        necessidade: 'Manutenção',
        ja_possui_solar: 'Sim',
        origem: origemLead,
        mensagem: `[CONTA DE LUZ - ${origemLead === 'plantao-ia' ? 'PLANTÃO IA' : 'ATENDIMENTO IA'}] Cliente com dúvida na fatura anexou o arquivo "${file.name}". Cadastro cliente: ${isClientValidated ? 'Validado' : 'Não validado'}. Solicita parecer técnico de engenharia.`,
        arquivo_conta: file,
      })
      setFileAttachedLeadRegistered(true)
      setHasLeadRegistered(true)
    } catch (err) {
      console.warn('Falha no upload do lead com arquivo_conta:', err)
    } finally {
      setIsUploadingFile(false)
    }

    // Resposta de confirmação
    setStep(4)
    const reply = `Recebi sua fatura com sucesso (${file.name})! Registramos o anexo para que nossa equipe técnica de engenharia faça a análise detalhada da conta. Por favor, informe seu nome e telefone/WhatsApp para retornarmos o parecer.`
    appendAssistantMessage(reply, file.name)
  }

  // Gravar lead no PocketBase
  const attemptLeadRegistration = async (
    text: string,
    client: string,
    problem: string,
    urgencyVal: string,
    fileAttached?: File | null,
  ) => {
    if (hasLeadRegistered && !fileAttached) return

    const phoneRegex = /(?:\+?55\s?)?(?:\(?\d{2}\)?[\s-]?)?\d{4,5}[-\s]?\d{4}/g
    const match = text.match(phoneRegex)

    const phoneFound = match ? match[0] : clientData?.telefone || '54991292121'
    const nameFound =
      clientData?.nome ||
      text
        .split(/[,\n-]/)[0]
        ?.replace(/[^\p{L}\s]/gu, '')
        .trim()
        .slice(0, 40) ||
      'Lead Plantão IA'

    const emailFound = clientData?.email || 'plantao@delfosengenharia.com.br'

    const tagOrigem = origemLead === 'plantao-ia' ? 'PLANTÃO IA' : 'ATENDIMENTO IA'
    const summaryMsg = `[${tagOrigem}] Triagem assistente. Relação: ${client || 'Não informado'} | Validado: ${isClientValidated ? 'Sim' : 'Não'} | Situação: ${problem || 'Não informado'} | Urgência: ${urgencyVal || 'Alta'} | Anexo: ${fileAttached ? fileAttached.name : 'Nenhum'} | Dados digitados: "${text}"`

    try {
      await createLead({
        nome: nameFound,
        telefone: phoneFound,
        email: emailFound,
        cidade: text.length < 35 && !match ? text : undefined,
        necessidade: 'Manutenção',
        origem: origemLead,
        ja_possui_solar: 'Sim',
        mensagem: summaryMsg,
        arquivo_conta: fileAttached || undefined,
      })
      setHasLeadRegistered(true)
    } catch (e) {
      console.warn('Registro de lead secundário:', e)
    }
  }

  const updateWhatsAppSummary = () => {
    const summary = `Olá equipe Delfos! Realizei a triagem no Plantão de O&M.\n\n*Relação:* ${clientType || 'Não informado'}\n*Situação:* ${problemType || 'Atendimento O&M'}\n*Urgência:* ${urgency || 'Alta'}${selectedFile ? `\n*Fatura anexada:* ${selectedFile.name}` : ''}\n\nSolicito atendimento técnico prioritário.`
    setCustomWaMessage(summary)
  }

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setStep(1)
    setClientType('')
    setIsClientValidated(null)
    setClientData(null)
    setProblemType('')
    setUrgency('')
    setSelectedFile(null)
    setIsUploadingFile(false)
    setFileAttachedLeadRegistered(false)
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
      {/* 1. BALÃO CIRCULAR FIXO NO CANTO INFERIOR DIREITO (quando não estiver embutido no menu) */}
      {!hideFloatingButton && (
        <div className="fixed bottom-20 md:bottom-6 right-5 sm:right-6 z-50">
          {!isOpen ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Abrir atendimento do Plantão de IA"
              className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-midnight-950 via-slate-900 to-[#0A2744] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-solar-400 cursor-pointer focus:outline-none focus:ring-4 focus:ring-solar-400/30"
            >
              <span className="absolute -inset-1 rounded-full bg-solar-400/30 animate-ping opacity-60 pointer-events-none" />

              <div className="relative flex items-center justify-center">
                <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-solar-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>

              <span className="hidden sm:block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-white/10 pointer-events-none">
                Plantão de Atendimento IA • O&M
              </span>
            </button>
          ) : null}
        </div>
      )}

      {/* 2. JANELA DE CHAT FLUTUANTE */}
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
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {onBackToMenu && (
                  <button
                    type="button"
                    onClick={onBackToMenu}
                    title="Voltar ao menu de atendimento"
                    className="p-1.5 -ml-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-[11px] font-bold hidden sm:inline">Voltar</span>
                  </button>
                )}
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-solar-400 text-midnight-950 flex items-center justify-center font-bold shadow-sm">
                    <Bot className="w-4 h-4 text-midnight-950" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs sm:text-sm font-extrabold text-white leading-tight truncate">
                      Assistente Delfos
                    </h2>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium shrink-0">
                      {origemLead === 'plantao-ia' ? 'O&M' : 'Triagem'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight truncate">
                    Atendimento virtual ágil
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300 shrink-0">
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

                    {msg.attachmentName && (
                      <div className="mt-2 p-2 rounded-lg bg-slate-100 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-700">
                        <FileText className="w-4 h-4 text-solar-600 shrink-0" />
                        <span className="truncate font-medium">{msg.attachmentName}</span>
                      </div>
                    )}

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

            {/* Indicador de digitando / processando */}
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

                {/* Validação de cliente: aviso explicativo */}
                {step === 'validar_cliente' && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Validação de Cadastro Delfos:</span>
                    </div>
                    <p>
                      Digite abaixo seu <strong>telefone com DDD</strong> ou <strong>e-mail</strong>{' '}
                      para localizarmos sua usina.
                    </p>
                  </div>
                )}

                {/* Menu exclusivo para cliente Delfos */}
                {step === 'cliente_menu' && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      Qual é o seu objetivo hoje?
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {CLIENT_SUB_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSend(opt)}
                          className={`w-full text-left px-3 py-2 rounded-xl font-semibold text-xs border shadow-xs transition-all flex items-center justify-between group cursor-pointer ${
                            opt === 'Dúvida sobre a conta'
                              ? 'bg-solar-50 hover:bg-solar-100 text-midnight-950 border-solar-300'
                              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-solar-400'
                          }`}
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

                {/* Dúvida sobre a conta: Área de Upload de PDF */}
                {step === 'duvida_conta_anexo' && (
                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-blue-950 font-bold text-xs">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Anexar fatura de energia (PDF)</span>
                    </div>
                    <p className="text-[11px] text-blue-900 leading-relaxed">
                      Nossa equipe técnica de engenharia fará a conferência da compensação de
                      créditos e tarifas.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="input-fatura-conta"
                    />

                    <label
                      htmlFor="input-fatura-conta"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border-2 border-dashed border-blue-300 hover:border-solar-500 cursor-pointer transition-colors shadow-xs"
                    >
                      {isUploadingFile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-solar-500" />
                          <span>Enviando fatura...</span>
                        </>
                      ) : (
                        <>
                          <Paperclip className="w-4 h-4 text-solar-600" />
                          <span>Selecionar arquivo da conta (PDF/Foto)</span>
                        </>
                      )}
                    </label>

                    <p className="text-[10px] text-slate-500 text-center">
                      Ou se preferir, digite sua dúvida no campo abaixo.
                    </p>
                  </div>
                )}

                {/* 2) Problema técnico na usina */}
                {step === 2 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                      O que aconteceu com a usina?
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {STEP_PROBLEM_OPTIONS.map((opt) => (
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
                      {STEP_URGENCY_OPTIONS.map((opt) => (
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
                    para o registro do plantão.
                  </div>
                )}

                {/* 5) Finalizado: confirmação com botão de WhatsApp */}
                {(step === 5 || (typeof step === 'number' && step >= 5)) && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Chamado gravado no plantão Delfos</span>
                    </div>
                    <p className="text-[11px] text-emerald-900">
                      Nossa equipe técnica já recebeu sua triagem
                      {fileAttachedLeadRegistered ? ' e o anexo da fatura para análise' : ''}.
                      Clique no botão abaixo para abrir o WhatsApp com tudo preenchido:
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

          {/* RODAPÉ COM CAMPO DE TEXTO E BOTÃO DE ANEXO RÁPIDO */}
          <footer className="p-2.5 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-1.5"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="footer-file-input"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Anexar PDF da conta de luz"
                className={`h-10 w-10 shrink-0 rounded-xl cursor-pointer ${
                  selectedFile
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  step === 'validar_cliente'
                    ? 'Informe seu telefone ou e-mail...'
                    : step === 4
                      ? 'Ex: João Silva, Erechim, (54) 99999-0000...'
                      : step === 'duvida_conta_anexo'
                        ? 'Anexe o PDF ou descreva sua dúvida...'
                        : 'Escreva sua mensagem ou escolha acima...'
                }
                disabled={isLoading}
                className="h-10 text-xs bg-slate-50 border-slate-200 focus-visible:ring-solar-400 rounded-xl flex-1"
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
