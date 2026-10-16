import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, TrendingDown, Sun, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createLead } from '@/services/leads'
import type { TipoImovel } from '@/types/leads'

interface FormErrors {
  nome?: string
  telefone?: string
  email?: string
  tipo_imovel?: string
  consumo_mensal?: string
  termos?: string
}

export default function ContatoForm() {
  const { toast } = useToast()

  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [tipoImovel, setTipoImovel] = useState<TipoImovel>('Residencia')
  const [consumoMensal, setConsumoMensal] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [aceitouTermos, setAceitouTermos] = useState(false)

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Phone mask helper
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
    if (errors.telefone) setErrors((prev) => ({ ...prev, telefone: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!nome.trim() || nome.trim().length < 3) {
      newErrors.nome = 'Informe seu nome completo (mínimo 3 caracteres)'
    }

    const rawPhone = telefone.replace(/\D/g, '')
    if (!rawPhone || rawPhone.length < 10) {
      newErrors.telefone = 'Informe um telefone/WhatsApp válido com DDD (ex: (54) 99999-9999)'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Informe um endereço de e-mail válido'
    }

    if (!tipoImovel) {
      newErrors.tipo_imovel = 'Selecione o tipo de imóvel'
    }

    if (consumoMensal) {
      const cleanConsumo = consumoMensal.replace(/[^\d.,]/g, '').replace(',', '.')
      const num = parseFloat(cleanConsumo)
      if (Number.isNaN(num) || num <= 0) {
        newErrors.consumo_mensal = 'Informe um valor numérico válido para o consumo'
      }
    }

    if (!aceitouTermos) {
      newErrors.termos = 'Você precisa aceitar a Política de Privacidade para prosseguir'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      let consumoNumber: number | undefined
      if (consumoMensal) {
        const clean = consumoMensal.replace(/[^\d.,]/g, '').replace(',', '.')
        const parsed = parseFloat(clean)
        if (!Number.isNaN(parsed)) {
          consumoNumber = parsed
        }
      }

      await createLead({
        nome,
        telefone,
        email,
        tipo_imovel: tipoImovel,
        consumo_mensal: consumoNumber,
        mensagem: mensagem || undefined,
      })

      setIsSuccess(true)
      toast({
        title: 'Solicitação enviada!',
        description:
          'Nossa equipe de engenharia entrará em contato em breve para apresentar sua proposta.',
      })

      // Reset form fields
      setNome('')
      setTelefone('')
      setEmail('')
      setTipoImovel('Residencia')
      setConsumoMensal('')
      setMensagem('')
      setAceitouTermos(false)
      setErrors({})
    } catch (err) {
      console.error('Erro ao enviar lead:', err)
      toast({
        variant: 'destructive',
        title: 'Falha no envio',
        description:
          'Ocorreu um erro ao registrar sua solicitação. Por favor, tente novamente ou fale pelo WhatsApp.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contato" className="py-24 bg-white relative">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Visual & Previsão de Retorno */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-700 text-xs font-bold uppercase tracking-wider mb-3">
                Proposta Gratuita
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                Solicite seu Orçamento Gratuito
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Preencha seus dados ao lado e receba uma proposta personalizada e dimensionada para
                sua residência ou empresa em Erechim e região.
              </p>
            </div>

            {/* Engineer photo container */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-midnight-950 group">
              <img
                src="https://img.usecurling.com/p/800/600?q=solar+engineers+installation&color=yellow"
                alt="Equipe de engenheiros instalando painéis solares Delfos"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlaid preview badge / ROI stat */}
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-solar-400 text-midnight-950 flex items-center justify-center font-bold">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                      Economia Média
                    </span>
                    <span className="text-base font-extrabold text-midnight-900">
                      Redução de até 95%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-leaf-dark uppercase block">
                    Payback
                  </span>
                  <span className="text-xs font-bold text-slate-700">3 a 5 anos</span>
                </div>
              </div>
            </div>

            {/* Reassurance pills */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-frost p-3 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-solar-500 shrink-0" />
                <span>Sem compromisso financeiro: análise e dimensionamento 100% gratuitos.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 bg-frost p-3 rounded-xl border border-slate-100">
                <Sun className="w-4 h-4 text-leaf shrink-0" />
                <span>Atendimento direto com engenheiro responsável técnico (CREA/RS).</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <div className="bg-frost rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Simulação Rápida de Energia Solar
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Leva menos de 1 minuto. Entraremos em contato com o estudo completo.
                </p>
              </div>

              {isSuccess && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-sm">
                    <strong>Solicitação registrada com sucesso!</strong> Nossa equipe técnica já
                    recebeu seus dados e iniciou a análise prévia.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label
                    htmlFor="lead-nome"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lead-nome"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }))
                    }}
                    placeholder="Seu nome completo"
                    className={`bg-white text-slate-900 h-12 rounded-xl focus-visible:ring-solar-400 focus-visible:border-solar-400 transition-colors ${
                      errors.nome ? 'border-red-500 focus-visible:ring-red-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.nome && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.nome}
                    </p>
                  )}
                </div>

                {/* Grid: Telefone e Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lead-telefone"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Telefone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lead-telefone"
                      value={telefone}
                      onChange={handleTelefoneChange}
                      placeholder="(54) 99999-9999"
                      maxLength={15}
                      className={`bg-white text-slate-900 h-12 rounded-xl focus-visible:ring-solar-400 focus-visible:border-solar-400 ${
                        errors.telefone
                          ? 'border-red-500 focus-visible:ring-red-400'
                          : 'border-slate-200'
                      }`}
                    />
                    {errors.telefone && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.telefone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lead-email"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="lead-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                      }}
                      placeholder="seuemail@exemplo.com"
                      className={`bg-white text-slate-900 h-12 rounded-xl focus-visible:ring-solar-400 focus-visible:border-solar-400 ${
                        errors.email
                          ? 'border-red-500 focus-visible:ring-red-400'
                          : 'border-slate-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid: Tipo de Imóvel e Consumo Mensal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lead-tipo"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Tipo de Imóvel <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="lead-tipo"
                      value={tipoImovel}
                      onChange={(e) => setTipoImovel(e.target.value as TipoImovel)}
                      className="w-full bg-white text-slate-900 h-12 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-solar-400 transition-colors"
                    >
                      <option value="Residencia">Residência</option>
                      <option value="Empresa">Empresa / Comercial</option>
                      <option value="Outro">Outro (Rural / Galpão / Terreno)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="lead-consumo"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Consumo Médio (R$/mês)
                    </label>
                    <Input
                      id="lead-consumo"
                      value={consumoMensal}
                      onChange={(e) => {
                        setConsumoMensal(e.target.value)
                        if (errors.consumo_mensal)
                          setErrors((prev) => ({ ...prev, consumo_mensal: undefined }))
                      }}
                      placeholder="Ex: R$ 450,00"
                      className={`bg-white text-slate-900 h-12 rounded-xl focus-visible:ring-solar-400 focus-visible:border-solar-400 ${
                        errors.consumo_mensal
                          ? 'border-red-500 focus-visible:ring-red-400'
                          : 'border-slate-200'
                      }`}
                    />
                    {errors.consumo_mensal && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.consumo_mensal}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mensagem Opcional */}
                <div>
                  <label
                    htmlFor="lead-msg"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Mensagem ou Detalhes (Opcional)
                  </label>
                  <Textarea
                    id="lead-msg"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Conte-nos mais sobre seu projeto (tipo de telhado, cidade, dúvidas)..."
                    rows={3}
                    className="bg-white text-slate-900 rounded-xl border-slate-200 focus-visible:ring-solar-400 focus-visible:border-solar-400 resize-none"
                  />
                </div>

                {/* Checkbox Política de Privacidade */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={aceitouTermos}
                      onChange={(e) => {
                        setAceitouTermos(e.target.checked)
                        if (errors.termos) setErrors((prev) => ({ ...prev, termos: undefined }))
                      }}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-solar-500 focus:ring-solar-400 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      Li e concordo com a <strong>Política de Privacidade</strong> e autorizo a
                      Delfos Engenharia a entrar em contato para envio da proposta de energia solar.
                    </span>
                  </label>
                  {errors.termos && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.termos}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold h-14 text-base rounded-xl shadow-lg shadow-solar-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Enviando proposta...</span>
                    ) : (
                      <>
                        <span>Enviar e Receber Proposta</span>
                        <Send className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    🔒 Seus dados estão seguros e protegidos. Nunca enviamos spam.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
