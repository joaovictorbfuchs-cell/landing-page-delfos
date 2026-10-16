import { useState, useEffect } from 'react'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sun,
  ShieldCheck,
  Phone,
  FileSpreadsheet,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createLead } from '@/services/leads'
import type { TipoLigacao, PosseArea, JaPossuiSolar } from '@/types/leads'

interface ContatoFormProps {
  initialNecessidade?: string
  initialOrigem?: string
  initialValorConta?: number
  initialConcessionaria?: string
  tituloSecao?: string
  subtituloSecao?: string
  textoBotaoFinal?: string
  destaqueDark?: boolean
}

export default function ContatoForm({
  initialNecessidade = 'Energia Solar Fotovoltaica',
  initialOrigem = 'home-formulario',
  initialValorConta,
  initialConcessionaria = 'RGE (CPFL Energia)',
  tituloSecao = 'Solicite uma avaliação técnica de engenharia',
  subtituloSecao = 'Dimensionamento preciso e estudo preliminar sem custos. Em 2 etapas rápidas, roteamos seu projeto diretamente para o engenheiro especialista do seu setor.',
  textoBotaoFinal = 'Finalizar e Solicitar Avaliação',
  destaqueDark = false,
}: ContatoFormProps) {
  const { toast } = useToast()

  // Etapas: 1 (curta) e 2 (qualificação técnica)
  const [etapa, setEtapa] = useState<1 | 2>(1)

  // Etapa 1 fields
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [cidade, setCidade] = useState('Erechim/RS')
  const [necessidade, setNecessidade] = useState(initialNecessidade)

  // Etapa 2 fields
  const [tipoLigacao, setTipoLigacao] = useState<TipoLigacao>('Trifasico')
  const [valorContaInput, setValorContaInput] = useState(
    initialValorConta ? String(initialValorConta) : '',
  )
  const [posseArea, setPosseArea] = useState<PosseArea>('Proprio')
  const [jaPossuiSolar, setJaPossuiSolar] = useState<JaPossuiSolar>('Nao')
  const [concessionaria, setConcessionaria] = useState(initialConcessionaria)
  const [mensagem, setMensagem] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)

  // Atualizar quando props mudam (ex: clique em pilar ou calculadora)
  useEffect(() => {
    if (initialNecessidade) setNecessidade(initialNecessidade)
  }, [initialNecessidade])

  useEffect(() => {
    if (initialValorConta) setValorContaInput(String(initialValorConta))
  }, [initialValorConta])

  useEffect(() => {
    if (initialConcessionaria) setConcessionaria(initialConcessionaria)
  }, [initialConcessionaria])

  // Errors & States
  const [errorsEtapa1, setErrorsEtapa1] = useState<{
    nome?: string
    telefone?: string
    email?: string
    cidade?: string
  }>({})
  const [errorsEtapa2, setErrorsEtapa2] = useState<{
    valorConta?: string
    termos?: string
  }>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedLeadData, setSubmittedLeadData] = useState<{
    nome: string
    telefone: string
    necessidade: string
  } | null>(null)

  // Phone masking
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 11) val = val.slice(0, 11)

    if (val.length > 10) {
      val = val.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    } else if (val.length > 6) {
      val = val.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
    } else if (val.length > 2) {
      val = val.replace(/^(\d{2})(\d{0,5})$/, '($1) $2')
    }
    setTelefone(val)
    if (errorsEtapa1.telefone) setErrorsEtapa1((prev) => ({ ...prev, telefone: undefined }))
  }

  // Validação da Etapa 1
  const validarEtapa1 = (): boolean => {
    const errs: typeof errorsEtapa1 = {}

    if (!nome.trim() || nome.trim().length < 3) {
      errs.nome = 'Informe seu nome completo (mínimo 3 caracteres)'
    }

    const rawPhone = telefone.replace(/\D/g, '')
    if (!rawPhone || rawPhone.length < 10) {
      errs.telefone = 'Informe um WhatsApp com DDD (ex: (54) 99129-2121)'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Informe um e-mail válido'
    }

    if (!cidade.trim()) {
      errs.cidade = 'Informe sua cidade / estado'
    }

    setErrorsEtapa1(errs)
    return Object.keys(errs).length === 0
  }

  // Validação da Etapa 2
  const validarEtapa2 = (): boolean => {
    const errs: typeof errorsEtapa2 = {}

    if (valorContaInput) {
      const clean = valorContaInput.replace(/[^\d.,]/g, '').replace(',', '.')
      const num = parseFloat(clean)
      if (isNaN(num) || num <= 0) {
        errs.valorConta = 'Informe um valor numérico válido (ex: 750)'
      }
    }

    if (!aceitouTermos) {
      errs.termos = 'Você precisa autorizar o contato técnico para receber a avaliação'
    }

    setErrorsEtapa2(errs)
    return Object.keys(errs).length === 0
  }

  const handleAvancarParaEtapa2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (validarEtapa1()) {
      setEtapa(2)
    }
  }

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarEtapa2()) return

    setIsSubmitting(true)

    try {
      let valorNumero: number | undefined
      if (valorContaInput) {
        const clean = valorContaInput.replace(/[^\d.,]/g, '').replace(',', '.')
        const parsed = parseFloat(clean)
        if (!isNaN(parsed)) valorNumero = parsed
      }

      await createLead({
        nome,
        telefone,
        email,
        cidade,
        necessidade,
        tipo_ligacao: tipoLigacao,
        valor_conta: valorNumero,
        posse_area: posseArea,
        ja_possui_solar: jaPossuiSolar,
        concessionaria,
        mensagem: mensagem || undefined,
        origem: initialOrigem || 'home-formulario-2etapas',
      })

      setIsSuccess(true)
      setSubmittedLeadData({
        nome,
        telefone,
        necessidade,
      })

      toast({
        title: 'Avaliação solicitada com sucesso!',
        description: 'Um engenheiro da Delfos já recebeu seus dados para análise prévia.',
      })
    } catch (err) {
      console.error('Erro ao enviar lead:', err)
      toast({
        variant: 'destructive',
        title: 'Erro no envio',
        description:
          'Não foi possível registrar seu formulário. Tente falar pelo WhatsApp diretamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setIsSuccess(false)
    setEtapa(1)
    setNome('')
    setTelefone('')
    setEmail('')
    setMensagem('')
    setAceitouTermos(false)
    setSubmittedLeadData(null)
  }

  // Direct WhatsApp link post submission
  const directWhatsappUrl = submittedLeadData
    ? `https://wa.me/5554991292121?text=${encodeURIComponent(
        `Olá! Acabei de enviar o formulário no site da Delfos. Meu nome é ${submittedLeadData.nome} e tenho interesse em: ${submittedLeadData.necessidade}.`,
      )}`
    : 'https://wa.me/5554991292121'

  return (
    <section
      id="contato"
      className={`py-24 relative ${
        destaqueDark
          ? 'bg-[#09111D] text-white border-t border-white/10'
          : 'bg-white text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contextual reassurance */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                  destaqueDark
                    ? 'bg-solar-500/20 text-solar-300 border border-solar-500/30'
                    : 'bg-solar-100 text-solar-800'
                }`}
              >
                Engenharia de Conversão Direta
              </div>
              <h2
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                  destaqueDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {tituloSecao}
              </h2>
              <p
                className={`text-base mt-3 leading-relaxed ${
                  destaqueDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {subtituloSecao}
              </p>
            </div>

            {/* Steps overview */}
            <div className="p-6 rounded-3xl bg-frost border border-slate-200/80 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Como funciona a qualificação técnica:
              </h3>

              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    etapa >= 1
                      ? 'bg-solar-400 text-midnight-950 font-black'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Etapa 1: Contato e Solução Desejada
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nome, WhatsApp verificado, cidade e pilar de interesse.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    etapa === 2
                      ? 'bg-solar-400 text-midnight-950 font-black'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Etapa 2: Parâmetros Elétricos
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tipo de ligação (mono/bi/tri), valor da conta e titularidade do imóvel.
                  </p>
                </div>
              </div>
            </div>

            {/* Reassurance pills */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-solar-500 shrink-0" />
                <span>Estudo preliminar e visita técnica 100% gratuitos e sem compromisso.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
                <Sun className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Equipe de campo com ART / CREA-RS em Erechim e todo Sul.</span>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                    Precisa de resposta urgente?
                  </span>
                  <a
                    href="https://wa.me/5554991292121?text=Ol%C3%A1%2C%20preciso%20de%20atendimento%20urgente%20com%20um%20engenheiro%20da%20Delfos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-950 hover:underline"
                  >
                    Fale agora no (54) 99129-2121
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2-Step Form */}
          <div className="lg:col-span-7">
            <div className="bg-frost rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg relative">
              {/* Progress Bar Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                  <span>
                    {isSuccess
                      ? 'Processamento Concluído'
                      : etapa === 1
                        ? 'Etapa 1 de 2: Informações de Contato'
                        : 'Etapa 2 de 2: Qualificação Técnica'}
                  </span>
                  <span className="text-solar-600 font-extrabold">
                    {isSuccess ? '100%' : etapa === 1 ? '50%' : '85%'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-solar-400 to-amber-500 transition-all duration-500 rounded-full"
                    style={{ width: isSuccess ? '100%' : etapa === 1 ? '50%' : '85%' }}
                  />
                </div>
              </div>

              {/* SUCCESS VIEW */}
              {isSuccess ? (
                <div className="space-y-6 py-6 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Obrigado, {submittedLeadData?.nome}!
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                      Sua solicitação de <strong>{submittedLeadData?.necessidade}</strong> foi
                      registrada no nosso sistema com sucesso.
                    </p>
                  </div>

                  {/* Next Step Box */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 max-w-md mx-auto text-left shadow-xs space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Próximos Passos
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      1. Nosso engenheiro técnico responsável analisará os parâmetros fornecidos.
                      <br />
                      2. Faremos contato no seu WhatsApp (
                      <strong>{submittedLeadData?.telefone}</strong>) com uma estimativa de
                      dimensionamento.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={directWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Falar direto pelo WhatsApp agora</span>
                    </a>

                    <Button
                      variant="outline"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-white text-xs"
                    >
                      Enviar outro formulário
                    </Button>
                  </div>
                </div>
              ) : etapa === 1 ? (
                /* ETAPA 1 (CURTA): Nome, Telefone, Cidade, Necessidade */
                <form onSubmit={handleAvancarParaEtapa2} className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Identificação & Pilar Desejado
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Preencha para iniciarmos o dimensionamento prévio.
                    </p>
                  </div>

                  {/* Nome */}
                  <div>
                    <label
                      htmlFor="lead-nome-etapa1"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lead-nome-etapa1"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value)
                        if (errorsEtapa1.nome)
                          setErrorsEtapa1((prev) => ({ ...prev, nome: undefined }))
                      }}
                      placeholder="Ex: João da Silva"
                      className={`bg-white h-12 rounded-xl text-sm ${
                        errorsEtapa1.nome
                          ? 'border-red-500 focus-visible:ring-red-400'
                          : 'border-slate-200'
                      }`}
                    />
                    {errorsEtapa1.nome && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errorsEtapa1.nome}
                      </p>
                    )}
                  </div>

                  {/* Telefone e E-mail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lead-tel-etapa1"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        WhatsApp / Celular <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="lead-tel-etapa1"
                        value={telefone}
                        onChange={handleTelefoneChange}
                        placeholder="(54) 99129-2121"
                        maxLength={15}
                        className={`bg-white h-12 rounded-xl text-sm ${
                          errorsEtapa1.telefone
                            ? 'border-red-500 focus-visible:ring-red-400'
                            : 'border-slate-200'
                        }`}
                      />
                      {errorsEtapa1.telefone && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errorsEtapa1.telefone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lead-email-etapa1"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="lead-email-etapa1"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errorsEtapa1.email)
                            setErrorsEtapa1((prev) => ({ ...prev, email: undefined }))
                        }}
                        placeholder="contato@exemplo.com.br"
                        className={`bg-white h-12 rounded-xl text-sm ${
                          errorsEtapa1.email
                            ? 'border-red-500 focus-visible:ring-red-400'
                            : 'border-slate-200'
                        }`}
                      />
                      {errorsEtapa1.email && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errorsEtapa1.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cidade e Necessidade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lead-cidade-etapa1"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        Cidade / UF <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="lead-cidade-etapa1"
                        value={cidade}
                        onChange={(e) => {
                          setCidade(e.target.value)
                          if (errorsEtapa1.cidade)
                            setErrorsEtapa1((prev) => ({ ...prev, cidade: undefined }))
                        }}
                        placeholder="Ex: Erechim/RS, Passo Fundo/RS..."
                        className={`bg-white h-12 rounded-xl text-sm ${
                          errorsEtapa1.cidade
                            ? 'border-red-500 focus-visible:ring-red-400'
                            : 'border-slate-200'
                        }`}
                      />
                      {errorsEtapa1.cidade && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errorsEtapa1.cidade}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lead-necessidade-etapa1"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        Necessidade Principal (Pilar) <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="lead-necessidade-etapa1"
                        value={necessidade}
                        onChange={(e) => setNecessidade(e.target.value)}
                        className="w-full bg-white h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400"
                      >
                        <option value="Energia Solar Fotovoltaica">
                          01. Energia Solar Fotovoltaica (EPC)
                        </option>
                        <option value="BESS (Armazenamento)">
                          02. BESS (Armazenamento e Baterias)
                        </option>
                        <option value="O&M e Monitoramento">
                          03. O&M e Monitoramento de Usinas
                        </option>
                        <option value="Carregadores Veiculares">
                          04. Carregadores Veiculares & DLM
                        </option>
                        <option value="Multiplas Solucoes">
                          Ecossistema Integrado (Mais de uma)
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Botão Avançar */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold h-13 py-3 text-base rounded-xl shadow-md flex items-center justify-center gap-2 group"
                    >
                      <span>Avançar para Qualificação Técnica</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      Falta apenas 1 etapa rápida para completar seu estudo preliminar.
                    </p>
                  </div>
                </form>
              ) : (
                /* ETAPA 2 (QUALIFICAÇÃO TÉCNICA): Ligação, Valor Conta, Posse, Já possui solar */
                <form onSubmit={handleSubmitFinal} className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        Qualificação Técnica Preliminar
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Permite ao engenheiro calcular o retorno financeiro exato.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEtapa(1)}
                      className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </Button>
                  </div>

                  {/* Tipo de ligação e Concessionária */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lead-tipo-ligacao"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        Tipo de Ligação Elétrica
                      </label>
                      <select
                        id="lead-tipo-ligacao"
                        value={tipoLigacao}
                        onChange={(e) => setTipoLigacao(e.target.value as TipoLigacao)}
                        className="w-full bg-white h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400"
                      >
                        <option value="Trifasico">Trifásico (Comum comercial/industrial)</option>
                        <option value="Bifasico">Bifásico (Comum residencial)</option>
                        <option value="Monofasico">Monofásico</option>
                        <option value="Nao sei">Não tenho certeza (a confirmar na fatura)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="lead-concessionaria"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        Concessionária de Energia
                      </label>
                      <select
                        id="lead-concessionaria"
                        value={concessionaria}
                        onChange={(e) => setConcessionaria(e.target.value)}
                        className="w-full bg-white h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400"
                      >
                        <option value="RGE (CPFL Energia)">RGE (CPFL Energia)</option>
                        <option value="CEEE Equatorial">CEEE Equatorial</option>
                        <option value="Cooperativas Regionais">
                          Cooperativas Regionais (Creral, Ceriluz, etc.)
                        </option>
                        <option value="Outra">Outra concessionária</option>
                      </select>
                    </div>
                  </div>

                  {/* Valor Médio da Conta e Posse de Área */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="lead-valor-conta"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        Valor Médio da Conta (R$/mês)
                      </label>
                      <Input
                        id="lead-valor-conta"
                        value={valorContaInput}
                        onChange={(e) => {
                          setValorContaInput(e.target.value)
                          if (errorsEtapa2.valorConta)
                            setErrorsEtapa2((prev) => ({ ...prev, valorConta: undefined }))
                        }}
                        placeholder="Ex: 650,00"
                        className={`bg-white h-12 rounded-xl text-sm ${
                          errorsEtapa2.valorConta ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                      {errorsEtapa2.valorConta && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errorsEtapa2.valorConta}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lead-posse-area"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                      >
                        Posse do Imóvel / Telhado
                      </label>
                      <select
                        id="lead-posse-area"
                        value={posseArea}
                        onChange={(e) => setPosseArea(e.target.value as PosseArea)}
                        className="w-full bg-white h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400"
                      >
                        <option value="Proprio">Próprio (Telhado / Terreno)</option>
                        <option value="Alugado">Alugado</option>
                        <option value="Outro">Condomínio / Outro</option>
                      </select>
                    </div>
                  </div>

                  {/* Já possui sistema solar? */}
                  <div>
                    <label
                      htmlFor="lead-ja-possui-solar"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Já possui algum sistema solar instalado no local?
                    </label>
                    <select
                      id="lead-ja-possui-solar"
                      value={jaPossuiSolar}
                      onChange={(e) => setJaPossuiSolar(e.target.value as JaPossuiSolar)}
                      className="w-full bg-white h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400"
                    >
                      <option value="Nao">Não, pretendo instalar do zero</option>
                      <option value="Sim">Sim, preciso de ampliação, O&M ou BESS</option>
                    </select>
                  </div>

                  {/* Mensagem Opcional */}
                  <div>
                    <label
                      htmlFor="lead-msg-etapa2"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >
                      Observações Adicionais (Opcional)
                    </label>
                    <Input
                      id="lead-msg-etapa2"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Ex: Telhado metálico, horário de pico crítico, necessidade de backup..."
                      className="bg-white h-11 rounded-xl text-sm border-slate-200"
                    />
                  </div>

                  {/* Checkbox Termos */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={aceitouTermos}
                        onChange={(e) => {
                          setAceitouTermos(e.target.checked)
                          if (errorsEtapa2.termos)
                            setErrorsEtapa2((prev) => ({ ...prev, termos: undefined }))
                        }}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-solar-500 focus:ring-solar-400 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        Autorizo a <strong>Delfos Engenharia</strong> a processar meus dados para
                        cálculo da proposta técnica e contato via WhatsApp/e-mail conforme a LGPD.
                      </span>
                    </label>
                    {errorsEtapa2.termos && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errorsEtapa2.termos}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-extrabold h-14 text-base rounded-xl shadow-lg shadow-solar-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Enviando dados ao engenheiro...</span>
                      ) : (
                        <>
                          <span>{textoBotaoFinal}</span>
                          <Send className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
