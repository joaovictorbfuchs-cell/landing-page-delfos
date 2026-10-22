import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  ArrowUp,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import DelfosLogo from '@/components/DelfosLogo'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#061325] text-slate-300 pt-16 pb-12 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Sobre Delfos Solar */}
          <div className="lg:col-span-5 space-y-4" id="sobre-delfos">
            <div className="flex items-center gap-2.5">
              <DelfosLogo height={40} variant="dark-bg" showSubtitle />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Da geração à operação da sua energia. Integradora de engenharia gaúcha com 12 anos de
              mercado, mais de 3.000 projetos entregues e atuação no ecossistema de geração
              fotovoltaica, baterias e armazenamento (BESS), operação e manutenção (O&M) com tempo
              de resposta combinado e recarga de veículos elétricos.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Engenharia de campo registrada no CREA-RS</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Delfos"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Delfos"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links & Soluções */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Soluções & Projetos
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/solucoes/energia-solar"
                  className="hover:text-solar-400 transition-colors block"
                >
                  Energia Solar Fotovoltaica (Projeto e Instalação)
                </a>
              </li>
              <li>
                <a href="/solucoes/bess" className="hover:text-solar-400 transition-colors block">
                  Sistema de armazenamento de energia (BESS)
                </a>
              </li>
              <li>
                <a href="/solucoes/om" className="hover:text-solar-400 transition-colors block">
                  Manutenção O&M e Monitoramento
                </a>
              </li>
              <li>
                <a
                  href="/solucoes/carregadores"
                  className="hover:text-solar-400 transition-colors block"
                >
                  Carregadores Veiculares com Gestão de Carga Inteligente
                </a>
              </li>
              <li>
                <a
                  href="/projetos"
                  className="hover:text-solar-400 transition-colors block font-medium text-solar-300"
                >
                  Projetos & Resultados (Cases Reais)
                </a>
              </li>
              <li>
                <a
                  href="/conteudos"
                  className="hover:text-solar-400 transition-colors block text-solar-300"
                >
                  Conteúdos & Blog Técnico
                </a>
              </li>
              <li>
                <a
                  href="/sobre"
                  className="hover:text-solar-400 transition-colors block text-solar-300"
                >
                  Sobre a Delfos Solar (Erechim/RS)
                </a>
              </li>
            </ul>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider pt-3 mb-2">
              Segmentos (Portas de Entrada)
            </h4>
            <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-400">
              <li>
                <a href="/segmentos/residencias" className="hover:text-solar-400 transition-colors">
                  • Residências
                </a>
              </li>
              <li>
                <a
                  href="/segmentos/comercio-servicos"
                  className="hover:text-solar-400 transition-colors"
                >
                  • Comércio e Serviços
                </a>
              </li>
              <li>
                <a href="/segmentos/industria" className="hover:text-solar-400 transition-colors">
                  • Indústria
                </a>
              </li>
              <li>
                <a href="/segmentos/agronegocio" className="hover:text-solar-400 transition-colors">
                  • Agronegócio
                </a>
              </li>
              <li>
                <a href="/segmentos/condominios" className="hover:text-solar-400 transition-colors">
                  • Condomínios
                </a>
              </li>
              <li>
                <a
                  href="/segmentos/investidores"
                  className="hover:text-solar-400 transition-colors"
                >
                  • Investidores e Usinas
                </a>
              </li>
              <li>
                <a
                  href="/segmentos/frotas-eletropostos"
                  className="hover:text-solar-400 transition-colors"
                >
                  • Frotas e Eletropostos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info & Telefone Real */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Sede Regional & Atendimento
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                <span>Erechim/RS e Região Alto Uruguai • Atuação em todo o Sul do Brasil</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/5554991292121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-semibold transition-colors"
                >
                  (54) 99129-2121 (WhatsApp Oficial)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-solar-400 shrink-0" />
                <a
                  href="mailto:contato@delfosengenharia.com.br"
                  className="hover:text-solar-400 transition-colors"
                >
                  contato@delfosengenharia.com.br
                </a>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                Horário de Atendimento Técnico: Seg a Sex das 08h às 18h
              </li>
            </ul>
          </div>
        </div>

        {/* NOTA DE DIFERENCIAÇÃO DA MARCA (Obrigatória pela especificação) */}
        <div className="py-6 border-b border-white/10"></div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Delfos Engenharia Solar. Todos os direitos reservados. CNPJ
            e registro no CREA-RS ativos.
          </p>
          <div className="flex items-center gap-5">
            <a href="/login" className="hover:text-solar-400 transition-colors font-medium">
              Acesso Administrativo
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-solar-400 transition-colors cursor-pointer"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
