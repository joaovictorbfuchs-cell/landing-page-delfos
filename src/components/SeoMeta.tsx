import { useEffect } from 'react'

export interface SeoMetaProps {
  title: string
  description: string
  canonicalPath?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  ogSiteName?: string
  ogLocale?: string
  robots?: string
  schemaJsonLd?: object | object[]
  articlePublishedTime?: string
  articleModifiedTime?: string
  articleAuthor?: string
}

export default function SeoMeta({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = '/og-image.png',
  ogSiteName = 'Delfos Engenharia',
  ogLocale = 'pt_BR',
  robots = 'index, follow',
  schemaJsonLd,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
}: SeoMetaProps) {
  useEffect(() => {
    // 1. Title Tag
    const formattedTitle = title.includes('Delfos') ? title : `${title} | Delfos Engenharia`
    document.title = formattedTitle

    // 2. Lang no html
    document.documentElement.lang = 'pt-BR'

    // 3. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // 4. Meta Robots
    let metaRobots = document.querySelector('meta[name="robots"]')
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.setAttribute('name', 'robots')
      document.head.appendChild(metaRobots)
    }
    metaRobots.setAttribute('content', robots)

    // 5. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute(
      'content',
      'energia solar Erechim, BESS industrial, manutencao de usina solar, Delfos Engenharia RS, engenharia fotovoltaica, O&M solar',
    )

    const BASE_URL = 'https://landing-page-delfos-engenharia-672ab.goskip.app'

    // 6. OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', formattedTitle)

    // 7. OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.setAttribute('content', description)

    // 8. OpenGraph Type
    let ogTypeEl = document.querySelector('meta[property="og:type"]')
    if (!ogTypeEl) {
      ogTypeEl = document.createElement('meta')
      ogTypeEl.setAttribute('property', 'og:type')
      document.head.appendChild(ogTypeEl)
    }
    ogTypeEl.setAttribute('content', ogType)

    // 9. OpenGraph Site Name
    let ogSiteNameEl = document.querySelector('meta[property="og:site_name"]')
    if (!ogSiteNameEl) {
      ogSiteNameEl = document.createElement('meta')
      ogSiteNameEl.setAttribute('property', 'og:site_name')
      document.head.appendChild(ogSiteNameEl)
    }
    ogSiteNameEl.setAttribute('content', ogSiteName)

    // 10. OpenGraph Locale
    let ogLocaleEl = document.querySelector('meta[property="og:locale"]')
    if (!ogLocaleEl) {
      ogLocaleEl = document.createElement('meta')
      ogLocaleEl.setAttribute('property', 'og:locale')
      document.head.appendChild(ogLocaleEl)
    }
    ogLocaleEl.setAttribute('content', ogLocale)

    // 11. OpenGraph Image
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

    // 12. Twitter Card tags
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

    // 13. Canonical link (sempre URL absoluta definitiva, sem parâmetros)
    const rawPath = canonicalPath || window.location.pathname
    // Remove query params ou hashes se houver
    const cleanPath = rawPath.split('?')[0].split('#')[0]
    const absoluteCanonical = cleanPath.startsWith('http')
      ? cleanPath
      : `${BASE_URL}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', absoluteCanonical)

    let ogUrl = document.querySelector('meta[property="og:url"]')
    if (!ogUrl) {
      ogUrl = document.createElement('meta')
      ogUrl.setAttribute('property', 'og:url')
      document.head.appendChild(ogUrl)
    }
    ogUrl.setAttribute('content', absoluteCanonical)

    // 13b. Article Meta tags (apenas quando ogType === 'article')
    const articleTags = [
      { property: 'article:published_time', value: articlePublishedTime },
      { property: 'article:modified_time', value: articleModifiedTime },
      { property: 'article:author', value: articleAuthor },
    ]
    articleTags.forEach(({ property, value }) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (value && ogType === 'article') {
        if (!el) {
          el = document.createElement('meta')
          el.setAttribute('property', property)
          document.head.appendChild(el)
        }
        el.setAttribute('content', value)
      } else if (el) {
        el.remove()
      }
    })

    // 14. Inserção de Schemas JSON-LD
    // Remove scripts antigos inseridos por esta rota
    const oldScripts = document.querySelectorAll('script[data-seo-meta-schema="true"]')
    oldScripts.forEach((sc) => sc.remove())

    const scriptsCreated: HTMLScriptElement[] = []

    if (schemaJsonLd) {
      const schemas = Array.isArray(schemaJsonLd) ? schemaJsonLd : [schemaJsonLd]
      schemas.forEach((schema) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-meta-schema', 'true')
        script.textContent = JSON.stringify(schema)
        document.head.appendChild(script)
        scriptsCreated.push(script)
      })
    }

    return () => {
      scriptsCreated.forEach((sc) => {
        if (sc.parentNode) sc.parentNode.removeChild(sc)
      })
    }
  }, [
    title,
    description,
    canonicalPath,
    ogType,
    ogImage,
    ogSiteName,
    ogLocale,
    robots,
    schemaJsonLd,
    articlePublishedTime,
    articleModifiedTime,
    articleAuthor,
  ])

  return null
}
