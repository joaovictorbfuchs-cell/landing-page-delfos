/**
 * Módulo de telemetria e integração com Google Analytics 4 (GA4).
 *
 * Configuração:
 * O usuário pode definir o ID de medição via variável de ambiente:
 * VITE_GA4_MEASUREMENT_ID (ex: "G-XXXXXXXXXX")
 *
 * Eventos monitorados conforme especificação:
 * 1. cta_click (clique em qualquer botão de CTA)
 * 2. calculator_used (interação/uso da calculadora de perda solar)
 * 3. form_submit (envio de formulário de captura / diagnóstico)
 * 4. whatsapp_click (clique em botões direcionando para o WhatsApp)
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_MEASUREMENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA4_MEASUREMENT_ID) || ''

let isInitialized = false

export function initGA(): void {
  if (typeof window === 'undefined') return
  if (isInitialized) return

  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-')) {
    // Carrega script oficial do Google se ainda não existir
    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`,
    )
    if (!existingScript) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(script)
    }

    window.dataLayer = window.dataLayer || []
    if (!window.gtag) {
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments)
      }
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true,
      anonymize_ip: true,
    })
    isInitialized = true
  } else {
    // Garante que o dataLayer exista mesmo sem ID configurado, para registrar eventos em modo buffer
    window.dataLayer = window.dataLayer || []
  }
}

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined | null
}

export function trackEvent(eventName: string, params: AnalyticsEventParams = {}): void {
  if (typeof window === 'undefined') return

  // Se o gtag estiver ativo, dispara via gtag oficial
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params)
    } catch (err) {
      console.debug('[GA4] Falha ao enviar evento:', eventName, err)
    }
  }

  // Sempre faz push no dataLayer para compatibilidade com Google Tag Manager
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...params,
      timestamp: Date.now(),
    })
  }

  // Log informativo em desenvolvimento
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[Analytics] ${eventName}:`, params)
  }
}

/**
 * 1. Clique no CTA
 */
export function trackCtaClick(ctaName: string, location: string, target?: string): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: location,
    target_action: target || 'contato',
  })
}

/**
 * 2. Uso da calculadora de perda solar
 */
export function trackCalculatorUsed(params: {
  kwp: number
  meses: number
  tarifa: number
  perdaEstimadaAnual: number
}): void {
  trackEvent('calculator_used', {
    kwp: params.kwp,
    meses: params.meses,
    tarifa: params.tarifa,
    perda_anual_brl: Math.round(params.perdaEstimadaAnual),
  })
}

/**
 * 3. Envio de formulário de captura / diagnóstico
 */
export function trackFormSubmit(formName: string, fields: { kwp?: number; origem?: string }): void {
  trackEvent('form_submit', {
    form_name: formName,
    kwp: fields.kwp,
    origem: fields.origem || 'blog-manutencao-placa-solar',
  })
}

/**
 * 4. Clique no WhatsApp
 */
export function trackWhatsappClick(location: string, messagePreview?: string): void {
  trackEvent('whatsapp_click', {
    source_location: location,
    message_preview: messagePreview?.substring(0, 80),
  })
}
