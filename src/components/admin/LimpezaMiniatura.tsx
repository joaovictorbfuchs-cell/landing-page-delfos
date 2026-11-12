import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { getPocketBaseFileUrl } from '@/services/content'

interface LimpezaMiniaturaProps {
  mediaId: string
  arquivo: string
  titulo: string
}

// Miniatura grande o suficiente para comparar fotos candidatas a duplicata no celular.
// Usa a mesma URL otimizada (variante "leve") do grid da Biblioteca.
export default function LimpezaMiniatura({ mediaId, arquivo, titulo }: LimpezaMiniaturaProps) {
  const [erro, setErro] = useState(false)
  const url = arquivo ? getPocketBaseFileUrl('media', mediaId, arquivo, 'leve') : ''

  if (!url || erro) {
    return (
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg border border-dashed border-slate-300 bg-slate-100 flex flex-col items-center justify-center gap-0.5 text-slate-400">
        <ImageOff className="w-4 h-4" />
        <span className="text-[9px] font-semibold leading-none">sem imagem</span>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={titulo}
      loading="lazy"
      decoding="async"
      onError={() => setErro(true)}
      className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg border border-slate-200 bg-slate-100 object-cover"
    />
  )
}
