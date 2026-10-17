import { useState } from 'react'
import { MessageCircle, FileText, Phone } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface BarraLateralConversaoProps {
  telefone?: string
  numeroWhatsApp?: string
}

export default function BarraLateralConversao({
  telefone = '(54) 99129-2121',
  numeroWhatsApp = '5554991292121',
}: BarraLateralConversaoProps) {
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Ocultar em rotas administrativas e de autenticação
  const pathname = location.pathname.toLowerCase()
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return null
  }

  // Número puro para links tel: e wa.me
  const cleanPhone = numeroWhatsApp.replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Olá! Vim pelo site da Delfos Engenharia e gostaria de atendimento técnico.',
  )}`

  const handleScrollToOrcamento = () => {
    const el = document.querySelector('#contato')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Se a página não tiver #contato direto, navegar até /#contato
      window.location.href = '/#contato'
    }
  }

  const items = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      sublabel: 'Conversar agora',
      href: whatsappUrl,
      isExternal: true,
      icon: MessageCircle,
      bgClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      borderClass: 'border-emerald-400/40',
      shadowClass: 'shadow-emerald-500/20',
      ariaLabel: 'Falar pelo WhatsApp com a Delfos Engenharia',
    },
    {
      id: 'orcamento',
      label: 'Orçamento Gratuito',
      sublabel: 'Dimensionamento rápido',
      onClick: handleScrollToOrcamento,
      icon: FileText,
      bgClass: 'bg-solar-400 hover:bg-solar-500 text-midnight-950 font-black',
      borderClass: 'border-solar-300/60',
      shadowClass: 'shadow-solar-500/20',
      ariaLabel: 'Solicitar orçamento gratuito no formulário',
    },
    {
      id: 'telefone',
      label: 'Ligar agora',
      sublabel: telefone,
      href: `tel:+55${cleanPhone}`,
      isExternal: false,
      icon: Phone,
      bgClass: 'bg-midnight-900 hover:bg-midnight-800 text-white',
      borderClass: 'border-white/20',
      shadowClass: 'shadow-midnight-950/40',
      ariaLabel: `Ligar para a Delfos Engenharia: ${telefone}`,
    },
  ]

  return (
    <aside
      aria-label="Barra rápida de conversão"
      className="hidden md:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5 pointer-events-auto"
    >
      <div className="flex flex-col gap-2.5 p-1.5 rounded-3xl bg-midnight-950/70 backdrop-blur-md border border-white/10 shadow-2xl">
        {items.map((item) => {
          const Icon = item.icon
          const isHovered = hoveredItem === item.id

          const buttonContent = (
            <div
              className={`flex items-center h-12 rounded-2xl border transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                item.bgClass
              } ${item.borderClass} ${item.shadowClass} ${
                isHovered ? 'pr-4 pl-3.5 shadow-xl' : 'w-12 justify-center shadow-md'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-6 h-6">
                <Icon className="w-5 h-5 shrink-0" />
              </div>

              <div
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
                  isHovered ? 'max-w-xs opacity-100 ml-2.5' : 'max-w-0 opacity-0 ml-0'
                }`}
              >
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-xs font-extrabold tracking-tight">{item.label}</span>
                  {item.sublabel && (
                    <span className="text-[10px] opacity-85 font-medium leading-none mt-0.5">
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                aria-label={item.ariaLabel}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="group focus:outline-none focus:ring-2 focus:ring-solar-400 rounded-2xl block"
              >
                {buttonContent}
              </a>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-label={item.ariaLabel}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="group focus:outline-none focus:ring-2 focus:ring-solar-400 rounded-2xl block text-left"
            >
              {buttonContent}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
