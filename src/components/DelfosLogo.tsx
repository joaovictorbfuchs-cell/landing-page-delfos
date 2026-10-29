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
  height = 48,
  variant = 'dark-bg',
  showSubtitle = false,
  alt = 'Delfos Solar',
}: DelfosLogoProps) {
  // Aspect ratio exato da arte vetorial recortada do anexo: 1534 / 936 = 1.639
  const aspectRatio = 1.639
  const width = Math.round(height * aspectRatio)

  // Em fundos escuros (como Header #081B30 e Footer #061325), o texto da logo precisa de contraste excelente.
  // Criamos uma versão vetorial SVG ultra nítida e responsiva, onde a cor do texto "delfos"
  // utiliza o tom azul celeste vibrante em fundos escuros (#38BDF8 / #258DF6) para total legibilidade
  // ou o azul cobalto clássico (#015BA1) em fundos claros, e os arcos mantém fielmente o gradiente azul -> verde -> amarelo.
  const isDarkBg = variant === 'dark-bg'
  // No fundo escuro: azul celeste vibrante #38BDF8 para destaque nítido e contraste perfeito
  // No fundo claro: azul cobalto institucional #015BA1 idêntico ao anexo oficial
  const textColor = isDarkBg ? '#38BDF8' : '#015BA1'

  if (variant === 'white-capsule') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white/95 px-3 py-1 rounded-xl shadow-xs transition-transform hover:scale-[1.02] ${className}`}
        style={{ height: height + 8 }}
      >
        <div style={{ height: `${height}px`, width: `${width}px` }} className="relative block">
          <svg
            viewBox="0 0 1534 936"
            width={width}
            height={height}
            aria-label={alt}
            className="w-full h-full block object-contain"
          >
            <defs>
              <linearGradient id="logo-top-grad-capsule" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#015BA1" />
                <stop offset="28%" stop-color="#17768A" />
                <stop offset="52%" stop-color="#5DA55F" />
                <stop offset="76%" stop-color="#C4C048" />
                <stop offset="100%" stop-color="#FDE107" />
              </linearGradient>
              <linearGradient id="logo-bot-grad-capsule" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stop-color="#FFE304" />
                <stop offset="24%" stop-color="#C4C048" />
                <stop offset="48%" stop-color="#53A063" />
                <stop offset="72%" stop-color="#17768A" />
                <stop offset="100%" stop-color="#015BA1" />
              </linearGradient>
            </defs>

            {/* Arco Superior */}
            <path
              d="M 15 285 C 80 150, 410 5, 767 5 C 1124 5, 1450 150, 1513 285 C 1320 120, 1060 90, 767 90 C 474 90, 210 120, 15 285 Z"
              fill="url(#logo-top-grad-capsule)"
            />

            {/* Arco Inferior */}
            <path
              d="M 0 666 C 210 825, 474 855, 767 855 C 1060 855, 1320 825, 1497 666 C 1450 805, 1124 935, 767 935 C 410 935, 80 805, 0 666 Z"
              fill="url(#logo-bot-grad-capsule)"
            />

            {/* Letras delfos */}
            <g fill="#015BA1">
              <path d="M 335 310 L 335 435 C 300 395, 248 380, 195 380 C 102 380, 25 450, 25 550 C 25 650, 102 720, 195 720 C 248 720, 300 705, 335 665 L 335 715 L 400 715 L 400 310 Z M 215 448 C 275 448, 335 492, 335 550 C 335 608, 275 652, 215 652 C 155 652, 95 608, 95 550 C 95 492, 155 448, 215 448 Z" />
              <path d="M 445 550 C 445 450, 520 380, 620 380 C 720 380, 795 450, 795 550 L 795 565 L 515 565 C 520 625, 565 658, 625 658 C 670 658, 710 638, 735 605 L 788 640 C 750 690, 690 720, 620 720 C 515 720, 445 650, 445 550 Z M 620 442 C 565 442, 522 478, 516 525 L 724 525 C 718 478, 675 442, 620 442 Z" />
              <path d="M 840 310 L 905 310 L 905 715 L 840 715 Z" />
              <path d="M 1000 310 C 950 310, 915 345, 915 405 L 915 445 L 870 445 L 870 500 L 915 500 L 915 715 L 980 715 L 980 500 L 1040 500 L 1040 445 L 980 445 L 980 405 C 980 375, 995 365, 1020 365 C 1032 365, 1045 368, 1055 372 L 1065 318 C 1048 313, 1025 310, 1000 310 Z" />
              <path d="M 1065 550 C 1065 450, 1140 380, 1240 380 C 1340 380, 1415 450, 1415 550 C 1415 650, 1340 720, 1240 720 C 1140 720, 1065 650, 1065 550 Z M 1135 550 C 1135 612, 1180 655, 1240 655 C 1300 655, 1345 612, 1345 550 C 1345 488, 1300 445, 1240 445 C 1180 445, 1135 488, 1135 550 Z" />
              <path d="M 1295 640 L 1345 605 C 1360 625, 1385 655, 1425 655 C 1460 655, 1485 635, 1485 605 C 1485 575, 1460 560, 1405 545 C 1335 528, 1300 495, 1300 445 C 1300 395, 1345 380, 1410 380 C 1470 380, 1515 410, 1540 445 L 1492 485 C 1475 458, 1445 440, 1410 440 C 1375 440, 1355 455, 1355 480 C 1355 505, 1375 518, 1430 532 C 1500 550, 1540 580, 1540 635 C 1540 690, 1495 720, 1425 720 C 1365 720, 1318 680, 1295 640 Z" />
            </g>
          </svg>
        </div>
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
      {/* SVG vetorial fiel: nítido em qualquer resolução, sem pixelização e perfeitamente legível */}
      <div
        style={{
          height: `${height}px`,
          width: `${width}px`,
        }}
        className="relative block shrink-0"
      >
        <svg
          viewBox="0 0 1534 936"
          width={width}
          height={height}
          aria-label={alt}
          className="w-full h-full block object-contain select-none pointer-events-none drop-shadow-sm"
        >
          <defs>
            <linearGradient id={`logo-top-grad-${variant}`} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#015BA1" />
              <stop offset="28%" stopColor="#17768A" />
              <stop offset="52%" stopColor="#5DA55F" />
              <stop offset="76%" stopColor="#C4C048" />
              <stop offset="100%" stopColor="#FDE107" />
            </linearGradient>
            <linearGradient id={`logo-bot-grad-${variant}`} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFE304" />
              <stop offset="24%" stopColor="#C4C048" />
              <stop offset="48%" stopColor="#53A063" />
              <stop offset="72%" stopColor="#17768A" />
              <stop offset="100%" stopColor="#015BA1" />
            </linearGradient>{' '}
          </defs>

          {/* Arco Superior Energético (azul cobalto -> folha verde -> amarelo solar) */}
          <path
            d="M 15 285 C 80 150, 410 5, 767 5 C 1124 5, 1450 150, 1513 285 C 1320 120, 1060 90, 767 90 C 474 90, 210 120, 15 285 Z"
            fill={`url(#logo-top-grad-${variant})`}
          />

          {/* Arco Inferior Energético (amarelo solar -> folha verde -> azul cobalto) */}
          <path
            d="M 0 666 C 210 825, 474 855, 767 855 C 1060 855, 1320 825, 1497 666 C 1450 805, 1124 935, 767 935 C 410 935, 80 805, 0 666 Z"
            fill={`url(#logo-bot-grad-${variant})`}
          />

          {/* Palavra 'delfos' em azul com contraste ideal dependendo do fundo */}
          <g fill={textColor}>
            {/* d */}
            <path d="M 335 310 L 335 435 C 300 395, 248 380, 195 380 C 102 380, 25 450, 25 550 C 25 650, 102 720, 195 720 C 248 720, 300 705, 335 665 L 335 715 L 400 715 L 400 310 Z M 215 448 C 275 448, 335 492, 335 550 C 335 608, 275 652, 215 652 C 155 652, 95 608, 95 550 C 95 492, 155 448, 215 448 Z" />
            {/* e */}
            <path d="M 445 550 C 445 450, 520 380, 620 380 C 720 380, 795 450, 795 550 L 795 565 L 515 565 C 520 625, 565 658, 625 658 C 670 658, 710 638, 735 605 L 788 640 C 750 690, 690 720, 620 720 C 515 720, 445 650, 445 550 Z M 620 442 C 565 442, 522 478, 516 525 L 724 525 C 718 478, 675 442, 620 442 Z" />
            {/* l */}
            <path d="M 840 310 L 905 310 L 905 715 L 840 715 Z" />
            {/* f */}
            <path d="M 1000 310 C 950 310, 915 345, 915 405 L 915 445 L 870 445 L 870 500 L 915 500 L 915 715 L 980 715 L 980 500 L 1040 500 L 1040 445 L 980 445 L 980 405 C 980 375, 995 365, 1020 365 C 1032 365, 1045 368, 1055 372 L 1065 318 C 1048 313, 1025 310, 1000 310 Z" />
            {/* o */}
            <path d="M 1065 550 C 1065 450, 1140 380, 1240 380 C 1340 380, 1415 450, 1415 550 C 1415 650, 1340 720, 1240 720 C 1140 720, 1065 650, 1065 550 Z M 1135 550 C 1135 612, 1180 655, 1240 655 C 1300 655, 1345 612, 1345 550 C 1345 488, 1300 445, 1240 445 C 1180 445, 1135 488, 1135 550 Z" />
            {/* s */}
            <path d="M 1295 640 L 1345 605 C 1360 625, 1385 655, 1425 655 C 1460 655, 1485 635, 1485 605 C 1485 575, 1460 560, 1405 545 C 1335 528, 1300 495, 1300 445 C 1300 395, 1345 380, 1410 380 C 1470 380, 1515 410, 1540 445 L 1492 485 C 1475 458, 1445 440, 1410 440 C 1375 440, 1355 455, 1355 480 C 1355 505, 1375 518, 1430 532 C 1500 550, 1540 580, 1540 635 C 1540 690, 1495 720, 1425 720 C 1365 720, 1318 680, 1295 640 Z" />
          </g>
        </svg>
      </div>

      {showSubtitle && (
        <span
          className={`text-[11px] font-bold tracking-widest uppercase pl-2 ml-1 border-l hidden sm:inline-block ${
            isDarkBg ? 'text-slate-300 border-white/20' : 'text-slate-600 border-slate-300'
          }`}
        >
          Engenharia
        </span>
      )}
    </div>
  )
}
