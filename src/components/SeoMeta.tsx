import { useEffect } from 'react'

interface SeoMetaProps {
  title: string
  description: string
  canonicalPath?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  schemaJsonLd?: object
}

export default function SeoMeta({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = '/og-image.png',
  schemaJsonLd,
}: SeoMetaProps) {
  useEffect(() => {
    // Title
    const formattedTitle = title.includes('Delfos') ? title : `${title} | Delfos Engenharia Solar`
    document.title = formattedTitle

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute(
      'content',
      'energia solar Erechim, BESS industrial, manutencao de usina solar, carregador veicular condominio, Delfos Solar RS, engenharia fotovoltaica, armazenamento baterias',
    )

    const BASE_URL = 'https://landing-page-delfos-engenharia-672ab.goskip.app'

    // OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', formattedTitle)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.setAttribute('content', description)

    let ogTypeEl = document.querySelector('meta[property="og:type"]')
    if (!ogTypeEl) {
      ogTypeEl = document.createElement('meta')
      ogTypeEl.setAttribute('property', 'og:type')
      document.head.appendChild(ogTypeEl)
    }
    ogTypeEl.setAttribute('content', ogType)

    const fullImageUrl = ogImage.startsWith('http')
      ? ogImage
      : `${BASE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`

    let ogImgEl = document.querySelector('meta[property="og:image"]')
    if (!ogImgEl) {
      ogImgEl = document.createElement('meta')
      ogImgEl.setAttribute('property', 'og:image')
      document.head.appendChild(ogImgEl)
    }
    ogImgEl.setAttribute('content', fullImageUrl)

    // Twitter Card tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]')
    if (!twitterCard) {
      twitterCard = document.createElement('meta')
      twitterCard.setAttribute('name', 'twitter:card')
      document.head.appendChild(twitterCard)
    }
    twitterCard.setAttribute('content', 'summary_large_image')

    let twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta')
      twitterTitle.setAttribute('name', 'twitter:title')
      document.head.appendChild(twitterTitle)
    }
    twitterTitle.setAttribute('content', formattedTitle)

    let twitterDesc = document.querySelector('meta[name="twitter:description"]')
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta')
      twitterDesc.setAttribute('name', 'twitter:description')
      document.head.appendChild(twitterDesc)
    }
    twitterDesc.setAttribute('content', description)

    let twitterImg = document.querySelector('meta[name="twitter:image"]')
    if (!twitterImg) {
      twitterImg = document.createElement('meta')
      twitterImg.setAttribute('name', 'twitter:image')
      document.head.appendChild(twitterImg)
    }
    twitterImg.setAttribute('content', fullImageUrl)

    // Canonical link
    const normalizedPath = canonicalPath || window.location.pathname
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute(
      'href',
      normalizedPath.startsWith('http')
        ? normalizedPath
        : `${BASE_URL}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`,
    )

    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    ogUrl.setAttribute(
      'content',
      `${BASE_URL}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`,
    )

    // Optional dynamic Schema.org JSON-LD
    let scriptJsonLd: HTMLScriptElement | null = null
    if (schemaJsonLd) {
      scriptJsonLd = document.querySelector(
        'script[data-page-schema="true"]',
      ) as HTMLScriptElement | null
      if (!scriptJsonLd) {
        scriptJsonLd = document.createElement('script')
        scriptJsonLd.type = 'application/ld+json'
        scriptJsonLd.setAttribute('data-page-schema', 'true')
        document.head.appendChild(scriptJsonLd)
      }
      scriptJsonLd.textContent = JSON.stringify(schemaJsonLd)
    }

    return () => {
      if (scriptJsonLd && scriptJsonLd.parentNode) {
        scriptJsonLd.parentNode.removeChild(scriptJsonLd)
      }
    }
  }, [title, description, canonicalPath, ogType, ogImage, schemaJsonLd])

  return null
}
