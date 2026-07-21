// ============================================
// 写评价页面 - 客户端组件
// 用户填写表单后提交评价到 Supabase
// 提交成功后跳转到机构详情页
// ============================================

'use client'

import { useEffect, useState, use, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { Institution, TYPE_LABELS, TYPE_COLORS } from '@/types/database'

// 页面 props 类型 - Next.js 15+ 中 params 是 Promise
type Props = {
  params: Promise<{ slug: string }>
}

// 表单数据类型
interface FormData {
  rating: number
  title: string
  content: string
  userName: string
  agree: boolean
}

export default function ResenaPage({ params }: Props) {
  // 在客户端解包 params Promise
  const { slug } = use(params)
  const router = useRouter()

  // ============================================
  // 状态管理
  // ============================================
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [loadingInstitution, setLoadingInstitution] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    rating: 0,
    title: '',
    content: '',
    userName: '',
    agree: false
  })

  // 字符计数 - 用于显示内容长度
  const contentLength = formData.content.length
  const minContentLength = 30

  // ============================================
  // 加载机构信息
  // ============================================
  useEffect(() => {
    let cancelled = false

    async function loadInstitution() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('slug', slug)
        .single()

      if (cancelled) return

      if (error || !data) {
        setLoadError('No se pudo cargar la información de la institución.')
        setLoadingInstitution(false)
        return
      }

      setInstitution(data as Institution)
      setLoadingInstitution(false)
    }

    loadInstitution()
    return () => {
      cancelled = true
    }
  }, [slug])

  // ============================================
  // 客户端 Supabase 实例（只创建一次）
  // ============================================
  const supabase = useMemo(() => createClient(), [])

  // ============================================
  // 表单提交处理
  // ============================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)
    setSubmitError(null)

    // 客户端验证
    if (formData.rating < 1) {
      setValidationError('Por favor selecciona una calificación de 1 a 5 estrellas.')
      return
    }
    if (formData.content.trim().length < minContentLength) {
      setValidationError(`La evaluación debe tener al menos ${minContentLength} caracteres.`)
      return
    }
    if (formData.userName.trim().length < 2) {
      setValidationError('Por favor ingresa tu nombre.')
      return
    }
    if (!formData.agree) {
      setValidationError('Debes aceptar los términos y condiciones.')
      return
    }
    if (!institution) {
      setValidationError('La institución no está disponible.')
      return
    }

    setSubmitting(true)

    try {
      // 插入评价记录
      const { error: insertError } = await supabase.from('reviews').insert([
        {
          institution_id: institution.id,
          user_name: formData.userName.trim(),
          rating: formData.rating,
          title: formData.title.trim() || null,
          content: formData.content.trim(),
          source: 'user',
          is_approved: true
        }
      ])

      if (insertError) {
        setSubmitError(insertError.message || 'Error al enviar la evaluación.')
        setSubmitting(false)
        return
      }

      // 提交成功，跳转到机构详情页
      router.push(`/instituciones/${slug}`)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Error inesperado al enviar la evaluación.'
      )
      setSubmitting(false)
    }
  }

  // ============================================
  // 加载中状态
  // ============================================
  if (loadingInstitution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Cargando...</p>
        </div>
      </div>
    )
  }

  // ============================================
  // 加载失败 / 机构不存在
  // ============================================
  if (loadError || !institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Institución no encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            {loadError ?? 'La institución que buscas no existe.'}
          </p>
          <Link
            href="/instituciones"
            className="inline-block px-6 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            ← Volver a instituciones
          </Link>
        </div>
      </div>
    )
  }

  // ============================================
  // 主表单界面
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回链接 */}
        <Link
          href={`/instituciones/${slug}`}
          className="text-blue-700 hover:underline text-sm mb-4 inline-block"
        >
          ← Volver a {institution.name}
        </Link>

        {/* 表单卡片 */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-200">
          {/* 头部 - 机构信息 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Escribe tu evaluación
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[institution.type]}`}>
                {TYPE_LABELS[institution.type]}
              </span>
              <span className="font-semibold text-gray-900">
                {institution.name}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <span className="text-yellow-500 mr-1">★</span>
                {institution.rating.toFixed(1)} ({institution.review_count.toLocaleString('es-MX')} evaluaciones)
              </span>
            </div>
          </div>

          {/* 评价表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 评分选择 - 1-5 星 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tu calificación <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating || formData.rating)
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-transform hover:scale-110"
                      aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
                    >
                      <span className={isFilled ? 'text-yellow-500' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  )
                })}
                {formData.rating > 0 && (
                  <span className="ml-3 text-sm text-gray-600">
                    {formData.rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* 标题（可选） */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Título <span className="text-gray-400 text-xs">(opcional)</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resume tu experiencia en una frase"
                maxLength={120}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 评价内容（必填，最少 30 字符） */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
                Tu evaluación <span className="text-red-600">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Describe tu experiencia con esta institución..."
                rows={6}
                maxLength={2000}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>
                  Mínimo {minContentLength} caracteres
                </span>
                <span className={contentLength < minContentLength ? 'text-red-600' : 'text-gray-500'}>
                  {contentLength}/2000
                </span>
              </div>
            </div>

            {/* 用户名（必填） */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-900 mb-2">
                Tu nombre <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="¿Cómo te identificas?"
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 同意条款 */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agree"
                checked={formData.agree}
                onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                Confirmo que esta evaluación refleja mi experiencia real y acepto los{' '}
                <Link href="/terminos" className="text-blue-700 hover:underline">
                  términos y condiciones
                </Link>
                .
              </label>
            </div>

            {/* 验证错误提示 */}
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {validationError}
              </div>
            )}

            {/* 提交错误提示 */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {submitError}
              </div>
            )}

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : 'Publicar evaluación'}
              </button>
              <Link
                href={`/instituciones/${slug}`}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
