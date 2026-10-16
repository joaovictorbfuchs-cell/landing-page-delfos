import { Sun, Zap, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-midnight-950 text-slate-300 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Sobre */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-solar-500 to-solar-300 flex items-center justify-center shadow-md">
                <Sun className="w-5 h-5 text-midnight-900" />
                <Zap className="w-3.5 h-3.5 text-midnight-950 absolute bottom-1 right-1 fill-midnight-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight leading-none">
                  DELFOS
                </span>
                <span className="text-[11px] font-semibold text-solar-400 tracking-wider uppercase">
                  Engenharia Solar
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Soluções completas de engenharia fotovoltaica para residências, comércios e indústrias
              em Erechim e toda a região Alto Uruguai do Rio Grande do Sul.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Delfos"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Delfos"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Delfos"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navegação Rápida
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('#inicio')}
                  className="hover:text-solar-400 transition-colors cursor-pointer text-left"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#vantagens')}
                  className="hover:text-solar-400 transition-colors cursor-pointer text-left"
                >
                  Vantagens da Energia Solar
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#como-funciona')}
                  className="hover:text-solar-400 transition-colors cursor-pointer text-left"
                >
                  Como Funciona o Processo
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#projetos')}
                  className="hover:text-solar-400 transition-colors cursor-pointer text-left"
                >
                  Projetos Realizados
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#depoimentos')}
                  className="hover:text-solar-400 transition-colors cursor-pointer text-left"
                >
                  Depoimentos de Clientes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('#contato')}
                  className="hover:text-solar-400 transition-colors cursor-pointer text-left"
                >
                  Solicitar Orçamento Gratuito
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contato & Localização
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                <span>Erechim/RS e Região Alto Uruguai – RS</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-solar-400 shrink-0" />
                <a
                  href="https://wa.me/5554999990000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-solar-400 transition-colors"
                >
                  (54) 99999-0000 (WhatsApp)
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
              <li className="pt-2 text-xs text-slate-500">
                Horário de Atendimento: Seg a Sex das 08h às 18h
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 Delfos Engenharia. Todos os direitos reservados. CNPJ e CREA/RS ativos.</p>
          <div className="flex items-center gap-4">
            <a href="/login" className="hover:text-solar-400 transition-colors">
              Acesso Proprietário
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
