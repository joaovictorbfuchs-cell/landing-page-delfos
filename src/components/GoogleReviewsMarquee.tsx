import { ExternalLink, Star } from 'lucide-react'
import { GOOGLE_PROFILE_DATA, GOOGLE_REVIEWS, type GoogleReview } from '@/data/googleReviews'

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  )
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const initials = review.author
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

  return (
    <article
      aria-label={`Avaliação de ${review.author}`}
      className="w-[300px] sm:w-[360px] md:w-[380px] shrink-0 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between text-left select-none"
    >
      <div>
        {/* Card Header: Avatar + Autor + Google Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-full ${review.avatarColor || 'bg-solar-500'} text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-inner`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{review.author}</h4>
              <p className="text-[11px] text-slate-500 truncate">
                {review.timeAgo ? review.timeAgo : 'Avaliação verificada'}
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 shrink-0"
            title="Avaliação verificada no Google Meu Negócio"
          >
            <GoogleIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold text-slate-600 tracking-tight">Google</span>
          </div>
        </div>

        {/* 5 Estrelas */}
        <div
          className="flex items-center gap-0.5 mb-3"
          aria-label={`${review.rating} de 5 estrelas`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Texto da Avaliação */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line line-clamp-4">
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* Card Footer: Selo de cliente verificado */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 font-medium text-leaf-dark">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Cliente verificado
        </span>
        <span className="text-slate-400">{GOOGLE_PROFILE_DATA.location}</span>
      </div>
    </article>
  )
}

export default function GoogleReviewsMarquee() {
  // Duplicamos a lista para criar a ilusão perfeita de esteira infinita contínua
  const displayReviews = [...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS]

  return (
    <div className="w-full">
      {/* Cabeçalho da Faixa */}
      <div className="max-w-[1200px] mx-auto px-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Selo Google */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <GoogleIcon className="w-6 h-6 shrink-0" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-900 leading-none">
                  {GOOGLE_PROFILE_DATA.rating}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {GOOGLE_PROFILE_DATA.totalReviews} avaliações no Google Meu Negócio
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Avaliações reais no Google
            </h3>
          </div>
        </div>

        {/* Link para o perfil completo no Google */}
        <a
          href={GOOGLE_PROFILE_DATA.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors shrink-0 shadow-sm"
        >
          <span>Ver todas as avaliações no Google</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </a>
      </div>

      {/* Esteira Animada Contínua (Marquee) */}
      <div className="relative w-full overflow-hidden group-marquee py-2 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30">
        {/* Máscaras de Fade laterais para transição suave */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10"
          aria-hidden="true"
        />

        {/* Pista de Scroll Contínuo — utiliza classe .animate-marquee-scroll definida em src/main.css */}
        <div className="animate-marquee-scroll flex gap-6 px-4">
          {displayReviews.map((review, idx) => (
            <ReviewCard key={`${review.id}-${idx}`} review={review} />
          ))}
        </div>
      </div>

      {/* Micro-legenda de acessibilidade / pausar */}
      <p className="text-center text-[11px] text-slate-400 mt-4">
        Passe o mouse ou toque para pausar a rolagem
      </p>
    </div>
  )
}
