export interface GoogleReview {
  id: string
  author: string
  rating: number
  text: string
  timeAgo?: string
  avatarColor?: string
}

export const GOOGLE_PROFILE_DATA = {
  rating: '4,9',
  ratingNumber: 4.9,
  totalReviews: 39,
  profileUrl: 'https://share.google/kjuaSjNM7WOz3bVZq',
  businessName: 'Delfos Energia Solar',
  location: 'Erechim - RS',
}

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 'rev-sofia-dallagnol',
    author: 'Sofia Dallagnol',
    rating: 5,
    text: 'Ótimo serviço, ágil e competente. Os valores de nossa conta de luz diminuíram exponencialmente e o atendimento pós serviço prestado é impecável. Jamais nos sentimos desamparados. Recomendo à todos!',
    timeAgo: '4 anos atrás',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 'rev-daniel-rotava',
    author: 'Daniel Rotava',
    rating: 5,
    text: 'Empresa transparente, atua com seriedade e compromisso com o cliente, garantindo uma ótima experiência!',
    timeAgo: '11 meses atrás',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'rev-rodrigo-coelho',
    author: 'Rodrigo Coelho',
    rating: 5,
    text: 'Atendimento muito profissional. Foco na satisfação e atendimento do cliente.\nUma venda bem detalhada e consultiva.\nEstão de parabéns!',
    timeAgo: '4 anos atrás',
    avatarColor: 'bg-amber-600',
  },
  {
    id: 'rev-tarcisio-chaves',
    author: 'TARCISIO CHAVES',
    rating: 5,
    text: 'Ótimo atendimento, e um pós venda que realmente funciona.',
    timeAgo: '11 meses atrás',
    avatarColor: 'bg-rose-600',
  },
  {
    id: 'rev-lucas-menegatti',
    author: 'Lucas P. Menegatti',
    rating: 5,
    text: 'Excelente empresa! Equipe muito qualificada, pontual e prestativa. O sistema solar está gerando além da expectativa.',
    timeAgo: '1 ano atrás',
    avatarColor: 'bg-teal-600',
  },
  {
    id: 'rev-marcos-zardo',
    author: 'Marcos Vinícius Zardo',
    rating: 5,
    text: 'Super recomendo a Delfos! Desde o primeiro atendimento até o pós-instalação foram impecáveis. Projeto de alta engenharia.',
    timeAgo: '2 anos atrás',
    avatarColor: 'bg-sky-600',
  },
  {
    id: 'rev-juliano-sfreddo',
    author: 'Juliano Sfreddo',
    rating: 5,
    text: 'Profissionais dedicados e muito competentes. Cuidaram de toda a burocracia e homologação na concessionária sem qualquer transtorno.',
    timeAgo: '2 anos atrás',
    avatarColor: 'bg-violet-600',
  },
  {
    id: 'rev-carlos-faccio',
    author: 'Carlos Eduardo Faccio',
    rating: 5,
    text: 'Empresa séria e comprometida com o cliente. Instalação limpa, rápida e suporte técnico presente em todas as etapas.',
    timeAgo: '3 anos atrás',
    avatarColor: 'bg-orange-600',
  },
  {
    id: 'rev-andreia-zanella',
    author: 'Andréia B. Zanella',
    rating: 5,
    text: 'Atendimento diferenciado e consultivo em Erechim. Tiraram todas as dúvidas técnicas e financeiras. Redução imediata na conta!',
    timeAgo: '3 anos atrás',
    avatarColor: 'bg-fuchsia-600',
  },
  {
    id: 'rev-fernando-tonin',
    author: 'Fernando G. Tonin',
    rating: 5,
    text: 'Parceria de confiança. Cumpriram rigorosamente os prazos e o pós-venda é realmente presente. Recomendo de olhos fechados!',
    timeAgo: '4 anos atrás',
    avatarColor: 'bg-slate-700',
  },
]
