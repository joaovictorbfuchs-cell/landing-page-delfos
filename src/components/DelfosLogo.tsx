// Importa diretamente o asset recortado e transparente derivado da imagem oficial anexada
import officialLogoImg from '@/assets/delfos-logo-transparent.png'

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
 * Utiliza o asset recortado com transparência derivado diretamente da imagem oficial anexada pelo cliente,
 * garantindo 100% de fidelidade visual às formas, espessuras, tipografia e gradientes da marca.
 *
 * Otimizado para nitidez em telas retina (HiDPI) e carregamento instantâneo.
 */

export default function DelfosLogo({
  className = '',
  height = 48,
  variant = 'dark-bg',
  showSubtitle = false,
  alt = 'Delfos Solar',
  priority = false,
}: DelfosLogoProps) {
  // Proporção real da arte oficial recortada: 1534 / 936 ≈ 1.6389
  const aspectRatio = 1.6389
  const width = Math.round(height * aspectRatio)
  const isDarkBg = variant === 'dark-bg'

  if (variant === 'white-capsule') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white px-3 py-1 rounded-xl shadow-xs transition-transform hover:scale-[1.02] ${className}`}
        style={{ height: height + 8 }}
      >
        <img
          src={officialLogoImg}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="block object-contain"
          style={{ width: `${width}px`, height: `${height}px` }}
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
      {/*
        Utiliza o asset oficial PNG recortado em alta fidelidade a partir da imagem original anexada.
        Em fundo claro (light-bg / header branco), exibe a arte original limpa sem nenhum halo ou contorno artificial.
        Em fundo escuro (dark-bg, ex: footer e gaveta mobile escura), aplica contraste apropriado.
      */}
      <div
        style={{
          height: `${height}px`,
          width: `${width}px`,
        }}
        className="relative block shrink-0"
      >
        <img
          src={officialLogoImg}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full block object-contain select-none pointer-events-none ${
            isDarkBg
              ? 'filter drop-shadow-[0_0_1.5px_rgba(255,255,255,0.75)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
              : ''
          }`}
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      </div>

      {showSubtitle && (
        <span
          className={`text-[11px] font-bold tracking-widest uppercase pl-2 ml-1 border-l hidden sm:inline-block ${
            isDarkBg ? 'text-slate-300 border-white/20' : 'text-slate-700 border-slate-300'
          }`}
        >
          Engenharia
        </span>
      )}
    </div>
  )
}
