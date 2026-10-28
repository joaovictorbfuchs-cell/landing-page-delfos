import React, { useState } from 'react'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Phone,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createLead } from '@/services/leads'
import { trackFormSubmit, trackWhatsappClick } from '@/lib/analytics'

interface FormCapturaArtigoProps {
  origem?: string
  potenciaInicialKwp?: number
}

export default function FormCapturaArtigo({
  origem = 'artigo-manutencao-placa-solar',
  potenciaInicialKwp,
}: FormCapturaArtigoProps) {
  const { toast } = useToast()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [potenciaKwp, setPotenciaKwp] = useState<string>(
    potenciaInicialKwp ? String(potenciaInicialKwp) : '',
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const formatPhone = (val: string) => {
    const numbers = val.replace(/\D/g, '').slice(0, 11)
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhatsapp(formatPhone(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const cleanPhone = whatsapp.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setErrorMessage('Por favor, informe um WhatsApp válido com DDD.')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Por favor, informe um e-mail válido.')
      return
    }

    const kwpNum = parseFloat(potenciaKwp.replace(',', '.'))
    if (!potenciaKwp || isNaN(kwpNum) || kwpNum <= 0) {
      setErrorMessage('Por favor, informe a potência aproximada da usina em kWp.')
      return
    }

    setIsSubmitting(true)

    try {
      await createLead({
        nome: nome.trim(),
        telefone: cleanPhone,
        email: email.trim().toLowerCase(),
        tipo_imovel: 'Empresa',
        necessidade: 'O&M e Monitoramento',
        origem: origem,
        mensagem: `Lead capturado no artigo de manutenção de placas solares. Potência informada da usina: ${kwpNum} kWp.`,
      })

      trackFormSubmit('form_captura_artigo_blog', {
        kwp: kwpNum,
        origem,
      })

      setIsSuccess(true)
      toast({
        title: 'Cadastro recebido com sucesso!',
        description:
          'Nossa equipe de engenharia entrará em contato para apresentar o diagnóstico da sua usina.',
      })
    } catch (err) {
      console.error('Erro ao cadastrar lead do artigo:', err)
      setErrorMessage('Não foi possível enviar os dados no momento. Tente falar pelo WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenWhatsApp = () => {
    trackWhatsappClick(
      'sucesso_form_artigo',
      'Olá! Acabei de enviar meus dados no artigo de manutenção e gostaria de adiantar o diagnóstico.',
    )
    const phone = '5554991292121'
    const msg = encodeURIComponent(
      `Olá! Acabei de preencher o formulário no artigo sobre manutenção de placas solares (usina de aprox. ${potenciaKwp || '8'} kWp) e gostaria de falar com o engenheiro.`,
    )
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  if (isSuccess) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-emerald-950/60 border-2 border-emerald-500/50 text-white space-y-5 animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            Solicitação Confirmada
          </span>
          <h3 className="text-2xl font-extrabold text-white">Recebemos seus dados com sucesso!</h3>
          <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
            A equipe técnica da <strong>Delfos Engenharia</strong> já registrou sua solicitação de
            diagnóstico para usina de <strong>{potenciaKwp} kWp</strong>. Nosso responsável técnico{' '}
            <strong>Eng. João Victor Bagetti Fuchs (CREA-RS 151894)</strong> avaliará o perfil da
            sua instalação.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            type="button"
            onClick={handleOpenWhatsApp}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Adiantar atendimento pelo WhatsApp agora</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsSuccess(false)
              setNome('')
              setEmail('')
              setWhatsapp('')
              setPotenciaKwp('')
            }}
            className="text-slate-300 hover:text-white text-xs"
          >
            Enviar outra solicitação
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-solar-400/80 shadow-xl space-y-5 text-slate-800">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-solar-800">
          <ShieldCheck className="w-4 h-4 text-solar-600" />
          <span>Diagnóstico Técnico Especializado</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          Descubra quanto a sua usina pode estar perdendo
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Preencha os 4 campos abaixo para receber o contato da engenharia da Delfos e alinhar o
          levantamento técnico preliminar da sua instalação fotovoltaica.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Nome */}
          <div className="space-y-1.5">
            <label htmlFor="lead-nome" className="text-xs font-bold text-slate-700 block">
              Seu nome completo *
            </label>
            <Input
              id="lead-nome"
              type="text"
              required
              placeholder="Ex: Carlos Eduardo Silveira"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-slate-50 border-slate-300 focus:border-solar-500 text-sm h-11"
            />
          </div>

          {/* 2. E-mail */}
          <div className="space-y-1.5">
            <label htmlFor="lead-email" className="text-xs font-bold text-slate-700 block">
              Seu e-mail corporativo ou pessoal *
            </label>
            <Input
              id="lead-email"
              type="email"
              required
              placeholder="Ex: carlos@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 border-slate-300 focus:border-solar-500 text-sm h-11"
            />
          </div>

          {/* 3. WhatsApp */}
          <div className="space-y-1.5">
            <label htmlFor="lead-whatsapp" className="text-xs font-bold text-slate-700 block">
              WhatsApp com DDD *
            </label>
            <Input
              id="lead-whatsapp"
              type="tel"
              required
              placeholder="(54) 99999-9999"
              value={whatsapp}
              onChange={handlePhoneChange}
              maxLength={15}
              className="bg-slate-50 border-slate-300 focus:border-solar-500 text-sm h-11"
            />
          </div>

          {/* 4. Potência da Usina em kWp */}
          <div className="space-y-1.5">
            <label htmlFor="lead-kwp" className="text-xs font-bold text-slate-700 block">
              Potência da usina (kWp) *
            </label>
            <Input
              id="lead-kwp"
              type="number"
              step="0.1"
              min="1"
              max="2000"
              required
              placeholder="Ex: 8 ou 75 (kWp)"
              value={potenciaKwp}
              onChange={(e) => setPotenciaKwp(e.target.value)}
              className="bg-slate-50 border-slate-300 focus:border-solar-500 text-sm h-11"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#081B30] hover:bg-[#0D2A4A] text-solar-400 hover:text-solar-300 font-extrabold py-6 rounded-xl text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all border border-solar-400/40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-solar-400" />
              <span>Registrando solicitação...</span>
            </>
          ) : (
            <>
              <span>Solicitar contato da engenharia Delfos</span>
              <ArrowRight className="w-4 h-4 text-solar-400" />
            </>
          )}
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Dados protegidos e tratados sob a LGPD
          </span>
          <span>CREA-RS 151894 • Delfos Engenharia</span>
        </div>
      </form>
    </div>
  )
}
