import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DelfosLogo from '@/components/DelfosLogo'
import { Input } from '@/components/ui/input'
import { loginWithPassword, isAuthenticated } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [email, setEmail] = useState('joao@delfosengenharia.com.br')
  const [password, setPassword] = useState('Skip@Pass')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await loginWithPassword(email, password)
      toast({
        title: 'Login efetuado com sucesso',
        description: 'Bem-vindo ao painel administrativo da Delfos Engenharia.',
      })
      navigate('/admin', { replace: true })
    } catch (err: unknown) {
      console.error('Erro de login:', err)
      const message = err instanceof Error ? err.message : 'E-mail ou senha inválidos'
      setError(
        message.includes('400')
          ? 'E-mail ou senha incorretos'
          : 'Falha na autenticação. Tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 p-6 text-white relative">
      {/* Decorative solar glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-solar-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-leaf/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-solar-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o site
          </Link>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 text-slate-800">
          {/* Logo Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <DelfosLogo height={48} variant="light-bg" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Acesso Restrito</h1>
            <p className="text-xs text-slate-500 mt-1">
              Painel de Gestão de Leads • Delfos Engenharia Solar
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                E-mail do Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@delfosengenharia.com.br"
                  required
                  className="pl-10 h-12 bg-frost rounded-xl border-slate-200 text-slate-900 focus-visible:ring-solar-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 h-12 bg-frost rounded-xl border-slate-200 text-slate-900 focus-visible:ring-solar-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                'Autenticando...'
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Credenciais padrão configuradas para o gestor:
              <br />
              <code className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                joao@delfosengenharia.com.br / Skip@Pass
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
