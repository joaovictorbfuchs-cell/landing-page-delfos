import { useEffect } from 'react'

interface SeoMetaProps {
  title: string
  description: string
  canonicalPath?: string
}

export default function SeoMeta({ title, description, canonicalPath }: SeoMetaProps) {
  useEffect(() => {
    document.title = `${title} | Delfos Engenharia Solar`

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', `${title} | Delfos Engenharia`)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.setAttribute('content', description)

    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', `https://delfosengenharia.com.br${canonicalPath}`)
    }
  }, [title, description, canonicalPath])

  return null
}
