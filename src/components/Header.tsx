import { useState, useEffect } from 'react'
import { Sun, Zap, Menu, X, PhoneCall, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onSolicitarAvaliacao: () => void
}

export default function Header({ onSolicitarAvaliacao }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Novo Menu conforme especificação:
  // Início | Soluções | Segmentos | Projetos e Resultados | Conteúdos | Sobre a Delfos | Contato
  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Soluções', href: '#solucoes' },
    { label: 'Segmentos', href: '#segmentos' },
    { label: 'Projetos e Resultados', href: '#projetos-resultados' },
    { label: 'Conteúdos', href: '#faq' }, // FAQ didático e conceitos nesta fase
    { label: 'Sobre a Delfos', href: '#sobre-delfos' },
    { label: 'Contato', href: '#contato' },
  ]

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCtaClick = () => {
    setMobileMenuOpen(false)
    onSolicitarAvaliacao()
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#081B30]/95 backdrop-blur-md shadow-lg py-3 text-white border-b border-white/10'
            : 'bg-[#081B30]/75 backdrop-blur-sm py-4 text-white border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Delfos mantido e valorizado */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#inicio')
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-solar-500 to-solar-300 flex items-center justify-center shadow-md shadow-solar-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-5 h-5 text-midnight-950 animate-spin-slow" />
              <Zap className="w-3.5 h-3.5 text-midnight-950 absolute bottom-1 right-1 fill-midnight-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight leading-none text-white">
                DELFOS
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-solar-300">
                Engenharia Solar
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="text-xs xl:text-sm font-medium transition-colors text-slate-200 hover:text-solar-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Fixed Global Desktop CTA: "Solicitar avaliação" */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={handleCtaClick}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold px-5 py-2.5 rounded-xl shadow-md shadow-solar-400/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs lg:text-sm flex items-center gap-1.5"
            >
              <span>Solicitar avaliação</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:bg-white/10"
              aria-label="Abrir menu principal"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-midnight-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-[#081B30] text-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-fade-in-up border-l border-white/10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-solar-400 flex items-center justify-center text-midnight-950">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-extrabold text-base text-white block leading-tight">
                      DELFOS
                    </span>
                    <span className="text-[10px] text-solar-300 uppercase font-bold">
                      Engenharia Solar
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white hover:bg-white/10"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex flex-col gap-1 mt-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.href)
                    }}
                    className="px-3 py-3 rounded-xl text-slate-200 font-medium hover:bg-white/5 hover:text-solar-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <Button
                onClick={handleCtaClick}
                className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold py-3.5 rounded-xl shadow-md text-sm"
              >
                Solicitar avaliação
              </Button>

              <a
                href="https://wa.me/5554991292121?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20engenharia%20da%20Delfos%20Solar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs text-slate-300 font-medium py-2 hover:text-emerald-400"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                (54) 99129-2121 • Erechim/RS
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
