import React from 'react'

interface DelfosLogoProps {
  className?: string
  /**
   * Altura em pixels (padrão: 38).
   * Mantém a proporção exata da logo (~2.4:1 largura/altura).
   */
  height?: number
  /**
   * 'dark-bg': Para fundos escuros (header, rodapé escuro).
   * 'light-bg': Para fundos claros (fundo branco, login, admin).
   * 'white-capsule': Fundo branco arredondado sutil para visual idêntico ao oficial com contraste perfeito.
   */
  variant?: 'dark-bg' | 'light-bg' | 'white-capsule'
  priority?: boolean
  showSubtitle?: boolean
}

/**
 * Componente oficial de logotipo da Delfos Solar.
 * Renderiza a marca com precisão vetorial (SVG nativo superleve, 0 requisições de rede adicionais, ~1.8KB).
 * Apresenta o elipse/laço com gradiente azul-verde-amarelo e o lettering "delfos solar".
 */
export default function DelfosLogo({
  className = '',
  height = 38,
  variant = 'dark-bg',
  showSubtitle = false,
}: DelfosLogoProps) {
  // Proporção viewBox: 360 x 150 (largura / altura = 2.4)
  const width = Math.round(height * 2.4)

  // Cores de texto adaptáveis conforme o fundo
  const isDarkBg = variant === 'dark-bg'
  const textDelfosColor = isDarkBg ? '#FFFFFF' : '#0B4870'
  const textSolarColor = isDarkBg ? '#38BDF8' : '#06304E'

  // Se o usuário pedir cápsula branca para contraste impecável em fundos escuros
  if (variant === 'white-capsule') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white px-3 py-1 rounded-xl shadow-xs transition-transform group-hover:scale-[1.02] ${className}`}
        style={{ height: height + 6 }}
      >
        <svg
          viewBox="0 0 360 150"
          width={width}
          height={height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Delfos Solar"
          className="overflow-visible block shrink-0"
        >
          <defs>
            {/* Gradiente superior: Azul profundo -> Teal/Verde -> Amarelo Solar */}
            <linearGradient id="delfos-top-loop" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#1E5B8E" />
              <stop offset="28%" stopColor="#25867E" />
              <stop offset="58%" stopColor="#4FA561" />
              <stop offset="85%" stopColor="#BDCB38" />
              <stop offset="100%" stopColor="#F9D417" />
            </linearGradient>

            {/* Gradiente inferior: Amarelo Solar -> Verde -> Teal/Azul profundo */}
            <linearGradient id="delfos-bottom-loop" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#F9D417" />
              <stop offset="18%" stopColor="#B3C43B" />
              <stop offset="50%" stopColor="#3F9668" />
              <stop offset="78%" stopColor="#1B6D82" />
              <stop offset="100%" stopColor="#124E76" />
            </linearGradient>
          </defs>

          {/* Arco Superior (laço elíptico afinado nas extremidades) */}
          <path
            d="M 12 70 C 40 34, 115 10, 180 10 C 245 10, 320 34, 348 70 C 315 28, 235 20, 180 20 C 125 20, 45 28, 12 70 Z"
            fill="url(#delfos-top-loop)"
          />

          {/* Arco Inferior (laço elíptico invertido afinado) */}
          <path
            d="M 12 80 C 45 122, 125 130, 180 130 C 235 130, 315 122, 348 80 C 320 116, 245 140, 180 140 C 115 140, 40 116, 12 80 Z"
            fill="url(#delfos-bottom-loop)"
          />

          {/* Texto "delfos" */}
          <text
            x="180"
            y="88"
            textAnchor="middle"
            fill="#0B4870"
            fontFamily="'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="800"
            fontSize="46"
            letterSpacing="6px"
          >
            delfos
          </text>

          {/* Texto "solar" */}
          <text
            x="180"
            y="114"
            textAnchor="middle"
            fill="#06304E"
            fontFamily="'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="600"
            fontSize="18"
            letterSpacing="11px"
          >
            solar
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 360 150"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Delfos Solar"
        className="overflow-visible block shrink-0"
      >
        <defs>
          {/* Gradiente superior: Azul profundo -> Verde esmeralda -> Amarelo Solar */}
          <linearGradient id={`delfos-top-${variant}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="30%" stopColor="#0D9488" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="85%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>

          {/* Gradiente inferior: Amarelo Solar -> Verde -> Teal/Azul profundo */}
          <linearGradient id={`delfos-bottom-${variant}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="20%" stopColor="#84CC16" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="75%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Arco Superior (laço elíptico) */}
        <path
          d="M 12 70 C 40 34, 115 10, 180 10 C 245 10, 320 34, 348 70 C 315 28, 235 20, 180 20 C 125 20, 45 28, 12 70 Z"
          fill={`url(#delfos-top-${variant})`}
        />

        {/* Arco Inferior (laço elíptico) */}
        <path
          d="M 12 80 C 45 122, 125 130, 180 130 C 235 130, 315 122, 348 80 C 320 116, 245 140, 180 140 C 115 140, 40 116, 12 80 Z"
          fill={`url(#delfos-bottom-${variant})`}
        />

        {/* Texto "delfos" */}
        <text
          x="180"
          y="88"
          textAnchor="middle"
          fill={textDelfosColor}
          fontFamily="'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          fontSize="46"
          letterSpacing="6px"
        >
          delfos
        </text>

        {/* Texto "solar" */}
        <text
          x="180"
          y="114"
          textAnchor="middle"
          fill={textSolarColor}
          fontFamily="'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="600"
          fontSize="18"
          letterSpacing="11px"
        >
          solar
        </text>
      </svg>

      {showSubtitle && (
        <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase text-solar-400 pl-1 border-l border-white/20">
          Engenharia
        </span>
      )}
    </div>
  )
}
