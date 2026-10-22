import { useState } from 'react'
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  User,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import type { PostRecord, UpsertPostPayload, PostCategoria, PostStatus } from '@/types/content'
import {
  listPostsAdmin,
  createPost,
  updatePost,
  togglePostStatus,
  deletePost,
  getPostImageUrl,
} from '@/services/content'

const CATEGORIAS: PostCategoria[] = [
  'Energia Solar',
  'Armazenamento BESS',
  'Operação & Manutenção',
  'Mobilidade Elétrica',
  'Institucional e Outros',
]

interface AdminPostsTabProps {
  posts: PostRecord[]
  loading: boolean
  onRefresh: () => void
}

export default function AdminPostsTab({ posts, loading, onRefresh }: AdminPostsTabProps) {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<PostRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  // Form State
  const [titulo, setTitulo] = useState('')
  const [slug, setSlug] = useState('')
  const [subtitulo, setSubtitulo] = useState('')
  const [resumo, setResumo] = useState('')
  const [categoria, setCategoria] = useState<PostCategoria>('Energia Solar')
  const [conteudo, setConteudo] = useState('')
  const [status, setStatus] = useState<PostStatus>('publicado')
  const [dataPublicacao, setDataPublicacao] = useState('')
  const [tempoLeitura, setTempoLeitura] = useState('5 min de leitura')
  const [autorNome, setAutorNome] = useState('Eng. João Silveira')
  const [autorCargo, setAutorCargo] = useState('Engenheiro Eletricista • CREA-RS')
  const [palavraChave, setPalavraChave] = useState('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditingPost(null)
    setTitulo('')
    setSlug('')
    setSubtitulo('')
    setResumo('')
    setCategoria('Energia Solar')
    setConteudo('')
    setStatus('publicado')
    setDataPublicacao(
      new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
    )
    setTempoLeitura('5 min de leitura')
    setAutorNome('Engenharia Delfos')
    setAutorCargo('CREA-RS • Especialista em Energia')
    setPalavraChave('')
    setFotoFile(null)
    setFotoPreview(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (post: PostRecord) => {
    setEditingPost(post)
    setTitulo(post.titulo)
    setSlug(post.slug)
    setSubtitulo(post.subtitulo || '')
    setResumo(post.resumo || '')
    setCategoria(post.categoria)
    setConteudo(post.conteudo || '')
    setStatus(post.status)
    setDataPublicacao(post.data_publicacao || '')
    setTempoLeitura(post.tempo_leitura || '5 min de leitura')
    setAutorNome(post.autor_nome || '')
    setAutorCargo(post.autor_cargo || '')
    setPalavraChave(post.palavra_chave || '')
    setFotoFile(null)
    setFotoPreview(getPostImageUrl(post) || null)
    setModalOpen(true)
  }

  // Gera slug automaticamente se o usuário estiver criando
  const handleTituloChange = (val: string) => {
    setTitulo(val)
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(generatedSlug)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoFile(file)
      setFotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titulo.trim() || !slug.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Título e slug são obrigatórios.',
      })
      return
    }

    setSubmitting(true)
    try {
      const payload: UpsertPostPayload = {
        titulo: titulo.trim(),
        slug: slug.trim(),
        subtitulo: subtitulo.trim(),
        resumo: resumo.trim(),
        categoria,
        conteudo: conteudo.trim(),
        status,
        data_publicacao: dataPublicacao.trim(),
        tempo_leitura: tempoLeitura.trim(),
        autor_nome: autorNome.trim(),
        autor_cargo: autorCargo.trim(),
        palavra_chave: palavraChave.trim(),
        foto_capa: fotoFile,
      }

      if (editingPost) {
        await updatePost(editingPost.id, payload)
        toast({
          title: 'Post atualizado',
          description: `O post "${titulo}" foi salvo com sucesso.`,
        })
      } else {
        await createPost(payload)
        toast({
          title: 'Post criado',
          description: `O post "${titulo}" foi adicionado com sucesso.`,
        })
      }

      setModalOpen(false)
      onRefresh()
    } catch (err: unknown) {
      console.error('Erro ao salvar post:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: (err as Error)?.message || 'Não foi possível salvar o post.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (post: PostRecord) => {
    setActionLoadingId(post.id)
    try {
      await togglePostStatus(post.id, post.status)
      toast({
        title: post.status === 'publicado' ? 'Post despublicado' : 'Post publicado',
        description: `O post agora está em status ${post.status === 'publicado' ? 'rascunho' : 'publicado'}.`,
      })
      onRefresh()
    } catch (err) {
      console.error('Erro ao alternar status:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar status',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (post: PostRecord) => {
    if (!window.confirm(`Tem certeza que deseja excluir o post "${post.titulo}"?`)) {
      return
    }

    setActionLoadingId(post.id)
    try {
      await deletePost(post.id)
      toast({
        title: 'Post excluído',
        description: 'O post foi removido do sistema.',
      })
      onRefresh()
    } catch (err) {
      console.error('Erro ao excluir post:', err)
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
      })
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-600 block">
              Gestão de Conteúdo
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Artigos e Publicações do Blog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Artigos publicados aparecem automaticamente na página pública de Conteúdos do site.
            Rascunhos nunca aparecem publicamente.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl shadow-sm text-xs h-10 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Artigo</span>
        </Button>
      </div>

      {/* Posts Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-6 h-6 border-2 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Carregando artigos do banco de dados...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Nenhum artigo cadastrado no banco
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Clique no botão "Novo Artigo" para criar seu primeiro post com foto de capa via
              upload. O site continuará exibindo os artigos padrão até você publicar novos!
            </p>
            <Button
              onClick={handleOpenCreate}
              className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold text-xs rounded-xl"
            >
              Criar Primeiro Artigo
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Capa</th>
                  <th className="py-4 px-5">Título / Categoria</th>
                  <th className="py-4 px-5">Data / Leitura</th>
                  <th className="py-4 px-5">Autor</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {posts.map((post) => {
                  const imageUrl = getPostImageUrl(post)
                  const isPublicado = post.status === 'publicado'

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Foto Capa */}
                      <td className="py-3 px-5 w-24">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={post.titulo}
                            className="w-16 h-12 object-cover rounded-xl border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </td>

                      {/* Título & Categoria */}
                      <td className="py-3 px-5 max-w-md">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-solar-100 text-solar-900 inline-block">
                            {post.categoria}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-solar-600">
                            {post.titulo}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            /{post.slug}
                          </span>
                        </div>
                      </td>

                      {/* Data & Leitura */}
                      <td className="py-3 px-5 text-xs text-slate-600 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{post.data_publicacao || 'Sem data'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>{post.tempo_leitura || '5 min'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Autor */}
                      <td className="py-3 px-5 text-xs text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{post.autor_nome || 'Delfos'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isPublicado
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublicado ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          {isPublicado ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Publicar / Despublicar */}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoadingId === post.id}
                            onClick={() => handleToggleStatus(post)}
                            className="text-xs h-8 text-slate-600 hover:text-slate-900"
                            title={isPublicado ? 'Mudar para rascunho' : 'Publicar no site'}
                          >
                            {isPublicado ? (
                              <EyeOff className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            )}
                            <span>{isPublicado ? 'Despublicar' : 'Publicar'}</span>
                          </Button>

                          {/* Editar */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(post)}
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                            title="Editar post"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          {/* Excluir */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={actionLoadingId === post.id}
                            onClick={() => handleDelete(post)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Excluir post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Criar / Editar Post */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-6 overflow-hidden shadow-2xl border border-slate-100 space-y-6 p-6 sm:p-8 animate-fade-in-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-solar-600 block">
                  {editingPost ? 'Editar Postagem' : 'Nova Postagem no Blog'}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingPost ? 'Editar Artigo de Conteúdo' : 'Criar Novo Artigo'}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Título & Slug */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Título do Post *</label>
                <Input
                  value={titulo}
                  onChange={(e) => handleTituloChange(e.target.value)}
                  placeholder="Ex: Como funciona a homologação solar na RGE em Erechim"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Slug (URL amigável) *</label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="como-funciona-homologacao-solar-rge"
                    required
                    className="rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as PostCategoria)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtítulo & Resumo */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Subtítulo / Linha Fina</label>
                <Input
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  placeholder="Resumo em uma frase que aparece logo abaixo do título"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Resumo (aparece nos cards)
                </label>
                <textarea
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  rows={2}
                  placeholder="Breve resumo para os cards de listagem e meta descrição"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                />
              </div>

              {/* Texto Completo */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Texto do Conteúdo (parágrafos)
                </label>
                <textarea
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  rows={6}
                  placeholder="Escreva ou cole o texto do artigo. Pode separar parágrafos dando Enter duplo."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400 leading-relaxed font-sans"
                />
              </div>

              {/* Foto de Capa via Upload */}
              <div className="space-y-2 p-4 bg-frost rounded-2xl border border-slate-200/80">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-solar-600" />
                  Foto de Capa via Upload (armazenada no banco)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-midnight-950 file:text-white hover:file:bg-midnight-900 cursor-pointer"
                  />
                  {fotoPreview && (
                    <div className="relative">
                      <img
                        src={fotoPreview}
                        alt="Preview"
                        className="w-20 h-14 object-cover rounded-xl border border-slate-300 shadow-xs"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 10MB.
                </p>
              </div>

              {/* Metadados: Data, Autor, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Data de Publicação</label>
                  <Input
                    value={dataPublicacao}
                    onChange={(e) => setDataPublicacao(e.target.value)}
                    placeholder="Ex: 25 de Outubro de 2026"
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tempo de Leitura</label>
                  <Input
                    value={tempoLeitura}
                    onChange={(e) => setTempoLeitura(e.target.value)}
                    placeholder="Ex: 5 min de leitura"
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PostStatus)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-400"
                  >
                    <option value="publicado">Publicado (visível no site)</option>
                    <option value="rascunho">Rascunho (oculto no site)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Autor</label>
                  <Input
                    value={autorNome}
                    onChange={(e) => setAutorNome(e.target.value)}
                    placeholder="Ex: Eng. João Silveira"
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Palavra-chave SEO</label>
                  <Input
                    value={palavraChave}
                    onChange={(e) => setPalavraChave(e.target.value)}
                    placeholder="Ex: energia solar Erechim"
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-solar-400 hover:bg-solar-500 text-midnight-950 font-bold rounded-xl text-xs shadow-md"
                >
                  {submitting ? 'Salvando...' : editingPost ? 'Atualizar Post' : 'Criar Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
