import { getPocketBaseFileUrl, type ImageSizeVariant } from '@/services/content'
import type { CaseRecord } from '@/types/content'

export interface PortfolioImageSelection {
  url: string
  alt: string
  titulo: string
  local: string
  potencia: string
  cliente?: string
}

// Catálogo fixo de fotos reais de instalações da Delfos homologadas no banco (PocketBase 'cases')
// Todas as fotos aqui vêm das usinas reais instaladas pela Delfos em telhados industriais, comerciais,
// rurais, residenciais e solo, com placas solares em destaque.
export const PORTFOLIO_REAL_CASES: Array<{
  id: string
  foto: string
  titulo: string
  cliente: string
  setor: string
  local: string
  potencia: string
  temaTags: string[]
  altDestaque: string
}> = [
  {
    id: 'psl026eq9dcvpjr',
    foto: 'clanel_ind_confeccoes_erechim_rs_123_5_kwp_2_ourlwcmvml.jpg',
    titulo: 'Clanel Ind. e Comércio de Confecções — Erechim/RS — 123,5 kWp',
    cliente: 'Clanel Indústria e Comércio',
    setor: 'Indústria',
    local: 'Erechim / RS',
    potencia: '123,5 kWp',
    temaTags: ['industria', 'bess', 'baterias', 'demanda', 'armazenamento', 'alta-potencia'],
    altDestaque:
      'Painéis solares fotovoltaicos instalados em cobertura industrial pela Delfos Engenharia (Clanel 123,5 kWp em Erechim/RS)',
  },
  {
    id: '4a4b0ludx9rb5yr',
    foto: 'cassul_erechim_rs_155_0_kwp_dji_0120_v1j0v1ir7u.jpg',
    titulo: 'Cassul Distribuidora — Erechim/RS — 155,0 kWp',
    cliente: 'Cassul Distribuidora',
    setor: 'Comércio e Serviços',
    local: 'Erechim / RS',
    potencia: '155,0 kWp',
    temaTags: [
      'comercio',
      'om',
      'manutencao',
      'limpeza',
      'geracao',
      'perda',
      'usina',
      'alto-uruguai',
    ],
    altDestaque:
      'Instalação de usina solar com módulos fotovoltaicos em telhado metálico pela Delfos Engenharia (Cassul 155 kWp em Erechim/RS)',
  },
  {
    id: 'wsvai8gfu5e4ksl',
    foto: 'panificadora_garcia_passo_fundo_rs_112_5_kwp_dji_0047_e7x7hfeq17.jpg',
    titulo: 'Panificadora Garcia — Passo Fundo/RS — 112,5 kWp',
    cliente: 'Panificadora Garcia',
    setor: 'Comércio e Serviços',
    local: 'Passo Fundo / RS',
    potencia: '112,5 kWp',
    temaTags: ['comercio', 'om', 'monitoramento', 'manutencao', 'passo-fundo'],
    altDestaque:
      'Vista aérea de placas solares instaladas na Panificadora Garcia em Passo Fundo/RS pela Delfos Engenharia',
  },
  {
    id: '2i9vws5rfgjujs9',
    foto: 'system_desenvolvimento_software_erechim_rs_25_kwp_whatsapp_image_2019_08_01_at_18_17_hl9lw8fxqh.00.jpeg',
    titulo: 'System Desenvolvimento de Software — Erechim/RS — 25,0 kWp',
    cliente: 'System Software',
    setor: 'Indústria',
    local: 'Erechim / RS',
    potencia: '25,0 kWp',
    temaTags: [
      'carregadores',
      'mobilidade',
      'carport',
      'veicular',
      'estacionamento',
      'eletropostos',
    ],
    altDestaque:
      'Carport solar com módulos fotovoltaicos integrados a estacionamento e infraestrutura de recarga veicular (Delfos Engenharia em Erechim/RS)',
  },
  {
    id: 'l1xdzcvzlzft48x',
    foto: 'condominio_residencial_notabile_erechim_rs_32_kwp_captura_de_tela_2025_12_18_213403_yrmrvcr6t9.png',
    titulo: 'Condomínio Residencial Notabile — Erechim/RS — 32,0 kWp',
    cliente: 'Condomínio Notabile',
    setor: 'Condomínios',
    local: 'Erechim / RS',
    potencia: '32,0 kWp',
    temaTags: ['condominio', 'condominios', 'carregador', 'rateio', 'dlm', 'apartamentos'],
    altDestaque:
      'Cobertura de condomínio residencial com painéis solares instalados pela Delfos Engenharia em Erechim/RS',
  },
  {
    id: 'uyibkaudvcqkn37',
    foto: 'residencia_urbana_erechim_rs_6_48_kwp_dji_0029_e1591648388934_keeojbs3ip.jpg',
    titulo: 'Residência Urbana — Erechim/RS — 6,48 kWp',
    cliente: 'Residência Familiar',
    setor: 'Residências',
    local: 'Erechim / RS',
    potencia: '6,48 kWp',
    temaTags: ['residencia', 'residencial', 'erechim', 'telhado', 'economia'],
    altDestaque:
      'Painéis fotovoltaicos em telhado residencial cerâmico instalados pela Delfos Engenharia em Erechim/RS',
  },
  {
    id: 'jfeklgmlxlawntj',
    foto: 'usina_solar_solo_erechim_rs_40_8_kwp_whatsapp_image_2019_12_11_at_17_44_3pvx4pqxm9.44-1.jpeg',
    titulo: 'Usina Solar de Solo — Erechim/RS — 40,8 kWp',
    cliente: 'Residência & Empreendimento Rural',
    setor: 'Investidores e Usinas',
    local: 'Erechim / RS',
    potencia: '40,8 kWp',
    temaTags: ['solo', 'usina', 'investidores', 'gd', 'rural', 'fazenda'],
    altDestaque:
      'Usina solar de solo com fileiras de módulos fotovoltaicos instalada pela Delfos Engenharia em Erechim/RS',
  },
  {
    id: '88p02q2qkva9dlj',
    foto: 'dal_pra_moveis_erechim_rs_74_43_kwp_dji_0003_1d9mh592m5.jpg',
    titulo: 'Dal Pra Móveis — Erechim/RS — 74,43 kWp',
    cliente: 'Dal Pra Móveis',
    setor: 'Indústria',
    local: 'Erechim / RS',
    potencia: '74,43 kWp',
    temaTags: ['industria', 'erechim', 'solar', 'economia'],
    altDestaque:
      'Módulos solares fotovoltaicos sobre pavilhão industrial pela Delfos Engenharia (Dal Pra 74,4 kWp)',
  },
  {
    id: '6gzbgbg3gptt1wf',
    foto: 'silo_erebango_rs_76_16_kwp_dji_0023_w27mvffe58.jpg',
    titulo: 'Silo de Grãos — Erebango/RS — 76,16 kWp',
    cliente: 'Produtor Rural de Erebango',
    setor: 'Agronegócio',
    local: 'Erebango / RS',
    potencia: '76,16 kWp',
    temaTags: ['rural', 'agronegocio', 'silo', 'graos', 'safra'],
    altDestaque:
      'Instalação solar fotovoltaica com placas sobre estrutura de silo rural em Erebango/RS pela Delfos Engenharia',
  },
  {
    id: 'm6s7q8vxo8pdjh3',
    foto: 'posto_caminho_do_mercosul_severiano_de_almeida_rs_54_9_kwp_dji_0068_ztv7viayyz.jpg',
    titulo: 'Posto Caminho do Mercosul — Severiano de Almeida/RS — 54,9 kWp',
    cliente: 'Posto Caminho do Mercosul',
    setor: 'Comércio e Serviços',
    local: 'Severiano de Almeida / RS',
    potencia: '54,9 kWp',
    temaTags: ['comercio', 'posto', 'posto-combustivel', 'solar'],
    altDestaque:
      'Cobertura com 169 módulos solares fotovoltaicos instalada pela Delfos Engenharia em Severiano de Almeida/RS',
  },
]

// Hash estável e determinístico de string para índice numérico
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Seleciona de forma DETERMINÍSTICA e COERENTE com o tema uma foto real de portfólio
 * com as placas solares aparecendo.
 *
 * Se liveCases for fornecido (do banco), também busca cases compatíveis adicionais.
 */
export function getArticlePortfolioPhoto(
  slugOrKey: string,
  categoria?: string,
  variant: ImageSizeVariant = 'grande',
  liveCases?: CaseRecord[],
): PortfolioImageSelection {
  const normKey = (slugOrKey || '').toLowerCase()
  const normCat = (categoria || '').toLowerCase()

  // 1. Tenta mapeamento contextual específico por slug conhecido
  if (normKey.includes('manutencao') || normKey.includes('om') || normCat.includes('manutenção')) {
    // Foto de grande porte comercial/industrial onde as placas ficam nítidas para ilustrar O&M
    const c =
      PORTFOLIO_REAL_CASES.find((item) => item.id === '4a4b0ludx9rb5yr') || PORTFOLIO_REAL_CASES[1]
    return {
      url: getPocketBaseFileUrl('cases', c.id, c.foto, variant),
      alt: c.altDestaque,
      titulo: c.titulo,
      local: c.local,
      potencia: c.potencia,
      cliente: c.cliente,
    }
  }

  if (
    normKey.includes('carregador') ||
    normKey.includes('eletromobilidade') ||
    normCat.includes('mobilidade')
  ) {
    // Carport Solar com placas sobre vagas ou condomínio residencial
    const c = normKey.includes('condominio')
      ? PORTFOLIO_REAL_CASES.find((item) => item.id === 'l1xdzcvzlzft48x') ||
        PORTFOLIO_REAL_CASES[4]
      : PORTFOLIO_REAL_CASES.find((item) => item.id === '2i9vws5rfgjujs9') ||
        PORTFOLIO_REAL_CASES[3]
    return {
      url: getPocketBaseFileUrl('cases', c.id, c.foto, variant),
      alt: c.altDestaque,
      titulo: c.titulo,
      local: c.local,
      potencia: c.potencia,
      cliente: c.cliente,
    }
  }

  if (normKey.includes('bess') || normKey.includes('bateria') || normCat.includes('bess')) {
    // Instalação industrial de alta potência
    const c =
      PORTFOLIO_REAL_CASES.find((item) => item.id === 'psl026eq9dcvpjr') || PORTFOLIO_REAL_CASES[0]
    return {
      url: getPocketBaseFileUrl('cases', c.id, c.foto, variant),
      alt: c.altDestaque,
      titulo: c.titulo,
      local: c.local,
      potencia: c.potencia,
      cliente: c.cliente,
    }
  }

  if (normKey.includes('erechim') || normKey.includes('guia') || normCat.includes('solar')) {
    // Foto aérea da Clanel ou Dal Pra ou Residência em Erechim
    const c =
      PORTFOLIO_REAL_CASES.find((item) => item.id === '88p02q2qkva9dlj') || PORTFOLIO_REAL_CASES[7]
    return {
      url: getPocketBaseFileUrl('cases', c.id, c.foto, variant),
      alt: c.altDestaque,
      titulo: c.titulo,
      local: c.local,
      potencia: c.potencia,
      cliente: c.cliente,
    }
  }

  // 2. Se houver liveCases do banco com foto, podemos combinar
  const poolFromDb = (liveCases || [])
    .filter((lc) => lc.foto && lc.status === 'publicado')
    .map((lc) => ({
      id: lc.id,
      foto: lc.foto,
      titulo: lc.titulo,
      cliente: lc.cliente || 'Cliente Delfos',
      setor: lc.setor,
      local: lc.local,
      potencia: lc.potencia_capacidade || '',
      temaTags: [lc.setor?.toLowerCase() || '', lc.solucao?.toLowerCase() || ''],
      altDestaque: `Usina solar fotovoltaica instalada pela Delfos Engenharia — ${lc.titulo}`,
    }))

  const combinedPool = poolFromDb.length > 0 ? poolFromDb : PORTFOLIO_REAL_CASES

  // Filtra por coerência de tema se possível
  const matchingPool = combinedPool.filter((item) => {
    if (normCat.includes('solar')) return true
    return item.temaTags.some((tag) => normKey.includes(tag) || normCat.includes(tag))
  })

  const finalPool = matchingPool.length > 0 ? matchingPool : combinedPool
  const index = hashString(normKey || 'delfos-post') % finalPool.length
  const selected = finalPool[index]

  return {
    url: getPocketBaseFileUrl('cases', selected.id, selected.foto, variant),
    alt: selected.altDestaque,
    titulo: selected.titulo,
    local: selected.local,
    potencia: selected.potencia,
    cliente: selected.cliente,
  }
}
