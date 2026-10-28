import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  ArrowUp,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import DelfosLogo from '@/components/DelfosLogo'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#061325] text-slate-300 pt-16 pb-12 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Sobre Delfos Solar */}
          <div className="lg:col-span-5 space-y-4" id="sobre-delfos">
            <div className="flex items-center gap-2.5">
              <DelfosLogo height={52} variant="dark-bg" showSubtitle />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Da geração à operação da sua energia. Integradora de engenharia gaúcha com 12 anos de
              mercado, mais de 3.000 projetos entregues e atuação no ecossistema de geração
              fotovoltaica, baterias e armazenamento (BESS), operação e manutenção (O&M) com tempo
              de resposta combinado e recarga de veículos elétricos.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Engenharia de campo registrada no CREA-RS</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/delfosenergia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @delfosenergia"
                title="Instagram @delfosenergia"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/9211385"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Delfos Engenharia"
                title="LinkedIn Delfos Engenharia"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/DelfosEnergiaSolar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Delfos Energia Solar"
                title="Facebook Delfos Energia Solar"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5554991292121"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Delfos (54) 99129-2121"
                title="WhatsApp (54) 99129-2121"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-400 hover:text-midnight-950 text-slate-300 flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links & Soluções */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Soluções & Projetos
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/solucoes/energia-solar"
                  className="hover:text-solar-400 transition-colors block"
                >
                  Energia solar
                </a>
              </li>
              <li>
                <a href="/solucoes/bess" className="hover:text-solar-400 transition-colors block">
                  Baterias de energia
                </a>
              </li>
              <li>
                <a href="/solucoes/om" className="hover:text-solar-400 transition-colors block">
                  Manutenção e monitoramento
                </a>
              </li>
              <li>
                <a
                  href="/solucoes/carregadores"
                  className="hover:text-solar-400 transition-colors block"
                >
                  Recarga veicular
                </a>
              </li>
              <li>
                <a
                  href="/projetos"
                  className="hover:text-solar-400 transition-colors block font-medium text-solar-300"
                >
                  Projetos & Resultados (Cases Reais)
                </a>
              </li>
              <li>
                <a
                  href="/conteudos"
                  className="hover:text-solar-400 transition-colors block text-solar-300"
                >
                  Conteúdos & Blog Técnico
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="hover:text-solar-400 transition-colors block text-solar-300 font-medium"
                >
                  Perguntas Frequentes (FAQ Completo)
                </a>
              </li>
              <li>
                <a
                  href="/sobre"
                  className="hover:text-solar-400 transition-colors block text-solar-300"
                >
                  Sobre a Delfos Solar (Erechim/RS)
                </a>
              </li>
            </ul>

            <h4 className="text-xs font-bold text-white uppercase tracking-wider pt-3 mb-2">
              Segmentos (Portas de Entrada)
            </h4>
            <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-400">
              <li>
                <a href="/segmentos/residencias" className="hover:text-solar-400 transition-colors">
                  • Residências
                </a>
              </li>
              <li>
                <a
                  href="/segmentos/comercio-servicos"
                  className="hover:text-solar-400 transition-colors"
                >
                  • Comércio e Serviços
                </a>
              </li>
              <li>
                <a href="/segmentos/industria" className="hover:text-solar-400 transition-colors">
                  • Indústria
                </a>
              </li>
              <li>
                <a href="/segmentos/agronegocio" className="hover:text-solar-400 transition-colors">
                  • Agronegócio
                </a>
              </li>
              <li>
                <a href="/segmentos/condominios" className="hover:text-solar-400 transition-colors">
                  • Condomínios
                </a>
              </li>
              <li>
                <a
                  href="/segmentos/investidores"
                  className="hover:text-solar-400 transition-colors"
                >
                  • Investidores e Usinas
                </a>
              </li>
              <li>
                <a
                  href="/segmentos/frotas-eletropostos"
                  className="hover:text-solar-400 transition-colors"
                >
                  • Frotas e Eletropostos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info & Telefone Real */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Sede Regional & Atendimento
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-solar-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Rua Espírito Santo, 275, bairro Fátima</p>
                  <p className="text-xs text-slate-400">
                    Erechim - RS • Atuação em todo o Sul do Brasil
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/5554991292121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-semibold transition-colors"
                >
                  (54) 99129-2121 (WhatsApp Oficial)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-solar-400 shrink-0" />
                <a
                  href="mailto:contato@delfos.eng.br"
                  className="hover:text-solar-400 transition-colors"
                >
                  contato@delfos.eng.br
                </a>
              </li>
              <li className="text-xs text-slate-400">
                Horário de Atendimento Técnico: Seg a Sex das 08h às 17:20h
              </li>
            </ul>

            {/* Mapa compacto do Google Maps */}
            <div className="w-full h-[190px] rounded-xl overflow-hidden border border-white/10 bg-[#08172c]/60 shadow-inner">
              <iframe
                title="Localização da Delfos Engenharia - Erechim/RS"
                src="https://maps.google.com/maps?q=Rua%20Esp%C3%ADrito%20Santo%2C%20275%2C%20F%C3%A1tima%2C%20Erechim%2C%20RS&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Bloco Google Meu Negócio / Google Business Profile */}
        <div className="py-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.9 7.5C.7 9.8 0 12.4 0 15.2s.7 5.4 1.9 7.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 22.8 12 22.8z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  Delfos Engenharia no Google
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Perfil Oficial Verificado
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Sede em Erechim - RS • Consulte nossa localização oficial e avaliações de clientes
                </p>
              </div>
            </div>

            <a
              href="https://share.google/kjuaSjNM7WOz3bVZq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-solar-400 hover:text-midnight-950 text-slate-200 text-xs font-semibold border border-white/10 hover:border-solar-400 transition-all shrink-0"
            >
              <span>Ver perfil e avaliar no Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Delfos Engenharia • CNPJ 21.379.952/0001-38. Todos os
            direitos reservados.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-solar-400 transition-colors cursor-pointer"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
