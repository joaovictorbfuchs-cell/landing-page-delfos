import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sun,
  Zap,
  Menu,
  X,
  PhoneCall,
  ArrowRight,
  ChevronDown,
  BatteryCharging,
  Wrench,
  Car,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  onSolicitarAvaliacao: () => void
}

export default function Header({ onSolicitarAvaliacao }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solucoesDropdownOpen, setSolucoesDropdownOpen] = useState(false)
  const [segmentosDropdownOpen, setSegmentosDropdownOpen] = useState(false)
  const [mobileSolucoesOpen, setMobileSolucoesOpen] = useState(false)
  const [mobileSegmentosOpen, setMobileSegmentosOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const segmentosDropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setSolucoesDropdownOpen(false)
      }
      if (segmentosDropdownRef.current && !segmentosDropdownRef.current.contains(target)) {
        setSegmentosDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const solucoesList = [
    {
      title: 'Energia Solar Fotovoltaica (EPC)',
      desc: 'On-grid e híbrido, telhado e solo, redução de até 90%',
      href: '/solucoes/energia-solar',
      icon: Sun,
      color: 'text-solar-400',
    },
    {
      title: 'Sistemas de Armazenamento BESS',
      desc: 'Peak shaving, arbitragem tarifária e backup ininterrupto C&I',
      href: '/solucoes/bess',
      icon: BatteryCharging,
      color: 'text-emerald-400',
    },
    {
      title: 'Manutenção O&M e Monitoramento',
      desc: 'Termografia por drone, limpeza técnica e planos com SLA',
      href: '/solucoes/om',
      icon: Wrench,
      color: 'text-blue-400',
    },
    {
      title: 'Carregadores Veiculares & DLM',
      desc: 'Wallbox inteligente, medição individual em condomínios e frotas',
      href: '/solucoes/carregadores',
      icon: Car,
      color: 'text-indigo-400',
    },
  ]

  const segmentosNavList = [
    { title: 'Residências', desc: 'Economia e backup residencial', href: '/segmentos/residencias' },
    {
      title: 'Comércio e Serviços',
      desc: 'Redução de custo sem parar a operação',
      href: '/segmentos/comercio-servicos',
    },
    {
      title: 'Indústria',
      desc: 'Dimensionamento, BESS e demanda contratada',
      href: '/segmentos/industria',
    },
    {
      title: 'Agronegócio',
      desc: 'Energia contínua para avicultura, leite e grãos',
      href: '/segmentos/agronegocio',
    },
    {
      title: 'Condomínios',
      desc: 'Recarga veicular DLM e rateio individual',
      href: '/segmentos/condominios',
    },
    {
      title: 'Investidores e Usinas',
      desc: 'Usinas de solo e diagnóstico de O&M',
      href: '/segmentos/investidores',
    },
    {
      title: 'Frotas e Eletropostos',
      desc: 'Infraestrutura de recarga rápida DC',
      href: '/segmentos/frotas-eletropostos',
    },
  ]

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    setSolucoesDropdownOpen(false)
    setSegmentosDropdownOpen(false)

    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        window.location.href = `/${href}`
        return
      }
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleCtaClick = () => {
    setMobileMenuOpen(false)
    setSolucoesDropdownOpen(false)
    setSegmentosDropdownOpen(false)
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
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
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
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            <Link
              to="/"
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="text-xs xl:text-sm font-medium transition-colors text-slate-200 hover:text-solar-400"
            >
              Início
            </Link>

            {/* Soluções com Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSolucoesDropdownOpen(!solucoesDropdownOpen)}
                onMouseEnter={() => setSolucoesDropdownOpen(true)}
                className={`text-xs xl:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  location.pathname.startsWith('/solucoes')
                    ? 'text-solar-400 font-semibold'
                    : 'text-slate-200 hover:text-solar-400'
                }`}
                aria-expanded={solucoesDropdownOpen}
              >
                <span>Soluções</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    solucoesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {solucoesDropdownOpen && (
                <div
                  onMouseLeave={() => setSolucoesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-3 w-80 bg-[#061526] border border-white/15 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl animate-fade-in z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-solar-300">
                      As 4 Soluções Delfos
                    </span>
                    <Link
                      to="/#solucoes"
                      onClick={() => setSolucoesDropdownOpen(false)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Ver na home
                    </Link>
                  </div>
                  {solucoesList.map((sol) => {
                    const Icon = sol.icon
                    const isCurrent = location.pathname === sol.href
                    return (
                      <Link
                        key={sol.href}
                        to={sol.href}
                        onClick={() => setSolucoesDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-solar-500/15 border border-solar-500/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className={`w-4 h-4 ${sol.color}`} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block leading-snug">
                            {sol.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
                            {sol.desc}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Segmentos com Dropdown */}
            <div className="relative" ref={segmentosDropdownRef}>
              <button
                type="button"
                onClick={() => setSegmentosDropdownOpen(!segmentosDropdownOpen)}
                onMouseEnter={() => setSegmentosDropdownOpen(true)}
                className={`text-xs xl:text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  location.pathname.startsWith('/segmentos')
                    ? 'text-solar-400 font-semibold'
                    : 'text-slate-200 hover:text-solar-400'
                }`}
                aria-expanded={segmentosDropdownOpen}
              >
                <span>Segmentos</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    segmentosDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Segmentos */}
              {segmentosDropdownOpen && (
                <div
                  onMouseLeave={() => setSegmentosDropdownOpen(false)}
                  className="absolute top-full left-0 mt-3 w-88 bg-[#061526] border border-white/15 rounded-2xl shadow-2xl p-2.5 backdrop-blur-xl animate-fade-in z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-solar-300">
                      As 7 Portas de Entrada
                    </span>
                    <Link
                      to="/#segmentos"
                      onClick={() => setSegmentosDropdownOpen(false)}
                      className="text-[10px] text-slate-400 hover:text-white"
                    >
                      Ver na home
                    </Link>
                  </div>
                  {segmentosNavList.map((seg) => {
                    const isCurrent = location.pathname === seg.href
                    return (
                      <Link
                        key={seg.href}
                        to={seg.href}
                        onClick={() => setSegmentosDropdownOpen(false)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-solar-500/15 border border-solar-500/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-solar-400 mt-1.5 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-white block leading-snug">
                            {seg.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
                            {seg.desc}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <Link
              to="/projetos"
              onClick={() => {
                setMobileMenuOpen(false)
                setSolucoesDropdownOpen(false)
              }}
              className={`text-xs xl:text-sm font-medium transition-colors ${
                location.pathname === '/projetos'
                  ? 'text-solar-400 font-semibold'
                  : 'text-slate-200 hover:text-solar-400'
              }`}
            >
              Projetos e Resultados
            </Link>

            <Link
              to="/conteudos"
              onClick={() => {
                setMobileMenuOpen(false)
                setSolucoesDropdownOpen(false)
                setSegmentosDropdownOpen(false)
              }}
              className={`text-xs xl:text-sm font-medium transition-colors ${
                location.pathname.startsWith('/conteudos')
                  ? 'text-solar-400 font-semibold'
                  : 'text-slate-200 hover:text-solar-400'
              }`}
            >
              Conteúdos
            </Link>

            <Link
              to="/sobre"
              onClick={() => {
                setMobileMenuOpen(false)
                setSolucoesDropdownOpen(false)
                setSegmentosDropdownOpen(false)
              }}
              className={`text-xs xl:text-sm font-medium transition-colors ${
                location.pathname === '/sobre'
                  ? 'text-solar-400 font-semibold'
                  : 'text-slate-200 hover:text-solar-400'
              }`}
            >
              Sobre a Delfos
            </Link>

            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('#contato')
              }}
              className="text-xs xl:text-sm font-medium transition-colors text-slate-200 hover:text-solar-400"
            >
              Contato
            </a>
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
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-slate-200 font-medium hover:bg-white/5 hover:text-solar-400 transition-colors text-sm"
                >
                  Início
                </Link>

                {/* Submenu mobile Soluções */}
                <div className="rounded-xl bg-white/5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileSolucoesOpen(!mobileSolucoesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-200 hover:text-solar-400 transition-colors"
                  >
                    <span className="font-semibold text-solar-300">Soluções (4 Pilares)</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileSolucoesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileSolucoesOpen && (
                    <div className="px-2 pb-2 space-y-1">
                      {solucoesList.map((sol) => (
                        <Link
                          key={sol.href}
                          to={sol.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 hover:text-white"
                        >
                          <sol.icon className={`w-3.5 h-3.5 ${sol.color} shrink-0`} />
                          <span className="truncate">{sol.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submenu mobile Segmentos */}
                <div className="rounded-xl bg-white/5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileSegmentosOpen(!mobileSegmentosOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-200 hover:text-solar-400 transition-colors"
                  >
                    <span className="font-semibold text-solar-300">Segmentos (7 Setores)</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        mobileSegmentosOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileSegmentosOpen && (
                    <div className="px-2 pb-2 space-y-1">
                      {segmentosNavList.map((seg) => {
                        const isCurrent = location.pathname === seg.href
                        return (
                          <Link
                            key={seg.href}
                            to={seg.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex flex-col px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              isCurrent
                                ? 'bg-solar-500/20 text-solar-300 font-bold'
                                : 'text-slate-200 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="font-semibold">{seg.title}</span>
                            <span className="text-[10px] text-slate-400">{seg.desc}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
                <Link
                  to="/projetos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl font-medium transition-colors text-sm ${
                    location.pathname === '/projetos'
                      ? 'bg-solar-500/15 text-solar-400 font-semibold'
                      : 'text-slate-200 hover:bg-white/5 hover:text-solar-400'
                  }`}
                >
                  Projetos e Resultados
                </Link>
                <Link
                  to="/conteudos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl font-medium transition-colors text-sm ${
                    location.pathname.startsWith('/conteudos')
                      ? 'bg-solar-500/15 text-solar-400 font-semibold'
                      : 'text-slate-200 hover:bg-white/5 hover:text-solar-400'
                  }`}
                >
                  Conteúdos (Blog)
                </Link>
                <Link
                  to="/sobre"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl font-medium transition-colors text-sm ${
                    location.pathname === '/sobre'
                      ? 'bg-solar-500/15 text-solar-400 font-semibold'
                      : 'text-slate-200 hover:bg-white/5 hover:text-solar-400'
                  }`}
                >
                  Sobre a Delfos
                </Link>
                <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick('#contato')
                  }}
                  className="px-3 py-2.5 rounded-xl text-slate-200 font-medium hover:bg-white/5 hover:text-solar-400 transition-colors text-sm"
                >
                  Contato
                </a>
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
