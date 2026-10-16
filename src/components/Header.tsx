import { useState, useEffect } from 'react'
import { Sun, Zap, Menu, X, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onOpenLeadModal?: () => void
}

export default function Header({ onOpenLeadModal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Vantagens', href: '#vantagens' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Projetos', href: '#projetos' },
    { label: 'Depoimentos', href: '#depoimentos' },
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
    if (onOpenLeadModal) {
      onOpenLeadModal()
    } else {
      const el = document.querySelector('#contato')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 text-slate-800 border-b border-slate-100'
            : 'bg-midnight/70 backdrop-blur-sm py-4 text-white border-b border-white/10'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#inicio')
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-solar-500 to-solar-300 flex items-center justify-center shadow-md shadow-solar-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-5 h-5 text-midnight-900 animate-spin-slow" />
              <Zap className="w-3.5 h-3.5 text-midnight-950 absolute bottom-1 right-1 fill-midnight-950" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-lg tracking-tight leading-none ${scrolled ? 'text-midnight-900' : 'text-white'}`}
              >
                DELFOS
              </span>
              <span
                className={`text-[11px] font-medium tracking-wider uppercase ${scrolled ? 'text-solar-600' : 'text-solar-300'}`}
              >
                Engenharia Solar
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className={`text-sm font-medium transition-colors hover:text-solar-500 ${
                  scrolled ? 'text-slate-700' : 'text-slate-200'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={handleCtaClick}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-solar-400/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Orçamento Gratuito
            </Button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className={
                scrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sliding drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-midnight-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between z-10 animate-fade-in-up">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-solar-400 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-midnight-900" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-midnight-900 block leading-tight">
                      DELFOS
                    </span>
                    <span className="text-[10px] text-solar-600 uppercase font-semibold">
                      Engenharia Solar
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-slate-900"
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
                    className="px-3 py-3 rounded-lg text-slate-800 font-medium hover:bg-solar-50 hover:text-solar-600 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
              <Button
                onClick={handleCtaClick}
                className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-semibold py-3 rounded-lg shadow-md"
              >
                Orçamento Gratuito
              </Button>
              <a
                href="https://wa.me/5554999990000?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20energia%20solar%20com%20a%20Delfos%20Engenharia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium py-2 hover:text-leaf"
              >
                <PhoneCall className="w-4 h-4 text-leaf" />
                (54) 99999-0000 • Erechim/RS
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
