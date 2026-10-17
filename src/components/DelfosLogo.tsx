import React from 'react'
import officialLogoPng from '@/assets/delfos-solar-c6f93.png'

interface DelfosLogoProps {
  className?: string
  /**
   * Altura em pixels da logo (padrão: 38).
   * A largura é calculada automaticamente mantendo a proporção nativa da marca.
   */
  height?: number
  /**
   * 'dark-bg': Para fundos escuros (como Header azul-marinho #081B30 e Footer #061325).
   *   Sem retângulo branco estático: contraste natural e elegante, ou pílula suave opcional.
   * 'light-bg': Para fundos claros (Login, Admin, cartões brancos).
   * 'white-capsule': Fundo branco arredondado sutil para quando se deseja destaque máximo.
   */
  variant?: 'dark-bg' | 'light-bg' | 'white-capsule'
  priority?: boolean
  showSubtitle?: boolean
  alt?: string
}

/**
 * Componente oficial de logotipo da Delfos Solar.
 * Utiliza o arquivo oficial fornecido pelo cliente (`src/assets/delfos-solar-c6f93.png`),
 * garantindo 100% de fidelidade visual às cores, tipografia, espessuras e gradientes reais.
 *
 * Otimizado para nitidez em telas retina (HiDPI) e carregamento instantâneo.
 */
export default function DelfosLogo({
  className = '',
  height = 38,
  variant = 'dark-bg',
  showSubtitle = false,
  alt = 'Delfos Solar',
}: DelfosLogoProps) {
  // Proporção aproximada da arte da logo
  const aspectRatio = 1.77
  const width = Math.round(height * aspectRatio)

  if (variant === 'white-capsule') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white/95 px-3 py-1 rounded-xl shadow-xs transition-transform hover:scale-[1.02] ${className}`}
        style={{ height: height + 8 }}
      >
        <img
          src={officialLogoPng}
          alt={alt}
          height={height}
          width={width}
          loading="eager"
          decoding="async"
          style={{
            height: `${height}px`,
            width: 'auto',
            maxHeight: '100%',
          }}
          className="block object-contain"
        />
        {showSubtitle && (
          <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase text-slate-700 pl-2 ml-2 border-l border-slate-200">
            Engenharia
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Imagem oficial com renderização ultra-nítida e sem distorção */}
      <img
        src={officialLogoPng}
        alt={alt}
        height={height}
        width={width}
        loading="eager"
        decoding="async"
        style={{
          height: `${height}px`,
          width: 'auto',
          maxHeight: '100%',
          // Garante nitidez máxima em telas retina e anti-aliasing suave
          imageRendering: 'auto',
        }}
        className="block object-contain select-none pointer-events-none drop-shadow-xs"
      />

      {showSubtitle && (
        <span
          className={`hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase pl-2 border-l ${
            variant === 'dark-bg'
              ? 'text-solar-400 border-white/20'
              : 'text-slate-600 border-slate-300'
          }`}
        >
          Engenharia
        </span>
      )}
    </div>
  )
}
