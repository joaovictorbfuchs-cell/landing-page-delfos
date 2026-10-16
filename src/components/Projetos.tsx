import { useState } from 'react'
import { Eye, MapPin, Zap, X, Check, Calendar, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  title: string
  tipo: 'Residencial' | 'Empresarial'
  potencia: string
  local: string
  modulos: string
  economiaEstimada: string
  imagem: string
  descricao: string
}

export default function Projetos() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const projects: Project[] = [
    {
      id: '1',
      title: 'Residência Família Martins',
      tipo: 'Residencial',
      potencia: '8,2 kWp',
      local: 'Bairro Espírito Santo, Erechim/RS',
      modulos: '15 módulos monocristalinos 550W',
      economiaEstimada: 'R$ 850,00 / mês',
      imagem: 'https://img.usecurling.com/p/800/600?q=solar+house+roof&color=blue',
      descricao:
        'Instalação residencial de alta eficiência em telhado cerâmico, com inversor de última geração e monitoramento em tempo real via smartphone pelo proprietário.',
    },
    {
      id: '2',
      title: 'Centro Logístico e Distribuidora RS',
      tipo: 'Empresarial',
      potencia: '45,6 kWp',
      local: 'Distrito Industrial, Erechim/RS',
      modulos: '84 módulos bifaciais de alto rendimento',
      economiaEstimada: 'R$ 4.700,00 / mês',
      imagem: 'https://img.usecurling.com/p/800/600?q=solar+panels+commercial+factory&color=amber',
      descricao:
        'Grande projeto comercial em estrutura metálica com sistema de injeção direta de energia na rede, viabilizando redução expressiva dos custos fixos operacionais da indústria.',
    },
    {
      id: '3',
      title: 'Residência Sobrado Alto Padrão',
      tipo: 'Residencial',
      potencia: '12,5 kWp',
      local: 'Bairro Fátima, Erechim/RS',
      modulos: '23 módulos de 545W com microinversores',
      economiaEstimada: 'R$ 1.350,00 / mês',
      imagem: 'https://img.usecurling.com/p/800/600?q=modern+solar+home&color=teal',
      descricao:
        'Sistema planejado esteticamente para preservar a arquitetura moderna da residência, integrando aquecimento solar e energia fotovoltaica total.',
    },
    {
      id: '4',
      title: 'Supermercado Regional',
      tipo: 'Empresarial',
      potencia: '75,0 kWp',
      local: 'Centro, Erechim/RS',
      modulos: '136 módulos de alta potência',
      economiaEstimada: 'R$ 8.200,00 / mês',
      imagem: 'https://img.usecurling.com/p/800/600?q=solar+farm+rooftop+building&color=yellow',
      descricao:
        'Dimensionamento industrial robusto com redundância de segurança para suprir as câmaras frias e maquinários de alta demanda da rede de supermercados.',
    },
    {
      id: '5',
      title: 'Clínica Médica e Odontológica',
      tipo: 'Empresarial',
      potencia: '15,8 kWp',
      local: 'Bairro Três Vendas, Erechim/RS',
      modulos: '29 módulos com tecnologia Tier 1',
      economiaEstimada: 'R$ 1.620,00 / mês',
      imagem: 'https://img.usecurling.com/p/800/600?q=solar+installation+building&color=blue',
      descricao:
        'Sustentabilidade e corte de gastos para equipamentos de diagnóstico e ar condicionado contínuo. Homologação rápida sem interromper o atendimento.',
    },
    {
      id: '6',
      title: 'Chácara Solar & Residencial Rural',
      tipo: 'Residencial',
      potencia: '10,4 kWp',
      local: 'Zona Rural, Região de Erechim/RS',
      modulos: '19 módulos instalados em solo com ângulo otimizado',
      economiaEstimada: 'R$ 1.100,00 / mês',
      imagem: 'https://img.usecurling.com/p/800/600?q=solar+panels+ground+farm&color=green',
      descricao:
        'Instalação em solo com estrutura galvanizada sob medida para abastecer residência e sistema de bombeamento de água da propriedade.',
    },
  ]

  return (
    <section id="projetos" className="py-24 bg-frost">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-100 text-solar-700 text-xs font-bold uppercase tracking-wider mb-3">
            Portfólio Real
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Projetos Recentes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Conheça algumas das centenas de instalações fotovoltaicas já entregues pela Delfos
            Engenharia com segurança, acabamento premium e homologação garantida.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group flex flex-col"
            >
              {/* Image container */}
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img
                  src={project.imagem}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md text-white shadow-sm ${
                      project.tipo === 'Residencial' ? 'bg-solar-500' : 'bg-leaf'
                    }`}
                  >
                    {project.tipo}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5 font-bold text-sm bg-midnight-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <Zap className="w-4 h-4 text-solar-400" />
                    <span>{project.potencia}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/90 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver detalhes</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-solar-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.local}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {project.descricao}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Economia gerada:</span>
                  <span className="text-leaf-dark font-bold">{project.economiaEstimada}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-transform hover:scale-105"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative h-64 sm:h-72 bg-midnight-900">
              <img
                src={selectedProject.imagem}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-md text-white mb-2 inline-block ${
                    selectedProject.tipo === 'Residencial' ? 'bg-solar-500' : 'bg-leaf'
                  }`}
                >
                  {selectedProject.tipo}
                </span>
                <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-frost p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                    Potência
                  </span>
                  <div className="flex items-center gap-1.5 text-base font-bold text-midnight-900">
                    <Zap className="w-4 h-4 text-solar-500" />
                    {selectedProject.potencia}
                  </div>
                </div>

                <div className="bg-frost p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                    Economia
                  </span>
                  <div className="flex items-center gap-1.5 text-base font-bold text-leaf-dark">
                    <Sun className="w-4 h-4 text-solar-500" />
                    {selectedProject.economiaEstimada}
                  </div>
                </div>

                <div className="bg-frost p-3.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                    Cidade
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-solar-500" />
                    Erechim/RS
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Sobre este projeto
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedProject.descricao}
                </p>
              </div>

              <div className="bg-solar-50 p-4 rounded-xl border border-solar-200 text-xs text-solar-900 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-solar-600 mt-0.5 shrink-0" />
                <span>
                  <strong>Módulos e Estrutura:</strong> {selectedProject.modulos}. Projeto
                  homologado e inspecionado segundo as normas da concessionária local.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  onClick={() => {
                    setSelectedProject(null)
                    const el = document.querySelector('#contato')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold py-3 rounded-xl shadow-md"
                >
                  Quero um Projeto Semelhante
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
