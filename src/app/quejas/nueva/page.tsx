// ============================================
// 提交投诉页面 - 客户端组件
// 用户填写表单：机构、标题、分类、内容、姓名、邮箱、同意条款
// 提交到 Supabase complaints 表
// ============================================

'use client'

import { useEffect, useState, useTransition, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import {
  Institution,
  ComplaintCategory,
  CATEGORY_LABELS,
  TYPE_LABELS
} from '@/types/database'

// 分类选项 - 从类型定义中提取
const CATEGORY_OPTIONS: ComplaintCategory[] = ['service', 'rates', 'charges', 'collection', 'other']

// 机构列表项类型 - 精简版
type InstitutionOption = Pick<Institution, 'id' | 'name' | 'type'>

// 表单状态类型
type FormState = {
  institutionId: string
  title: string
  category: ComplaintCategory | ''
  content: string
  userName: string
  userEmail: string
  agreeTerms: boolean
}

const INITIAL_STATE: FormState = {
  institutionId: '',
  title: '',
  category: '',
  content: '',
  userName: '',
  userEmail: '',
  agreeTerms: false
}

// 提交结果类型
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function NuevaQuejaPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // 机构列表状态
  const [institutions, setInstitutions] = useState<InstitutionOption[]>([])
  const [loadingInstitutions, setLoadingInstitutions] = useState(true)
  const [institutionsError, setInstitutionsError] = useState<string | null>(null)

  // 表单数据
  const [form, setForm] = useState<FormState>(INITIAL_STATE)

  // 提交状态
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 组件挂载时从 Supabase 加载机构列表
  useEffect(() => {
    let cancelled = false

    async function loadInstitutions() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('institutions')
          .select('id, name, type')
          .order('name', { ascending: true })

        if (cancelled) return

        if (error) {
          setInstitutionsError('No se pudieron cargar las instituciones. Recarga la página.')
        } else {
          setInstitutions((data as InstitutionOption[] | null) ?? [])
        }
      } catch (err) {
        if (!cancelled) {
          setInstitutionsError('Error de conexión. Intenta de nuevo.')
        }
      } finally {
        if (!cancelled) setLoadingInstitutions(false)
      }
    }

    loadInstitutions()
    return () => { cancelled = true }
  }, [])

  // 更新表单字段
  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    // 输入时清除错误
    if (errorMessage) setErrorMessage(null)
  }

  // 验证表单
  function validate(): string | null {
    if (!form.institutionId) return 'Por favor selecciona una institución.'
    if (form.title.trim().length < 5) return 'El título debe tener al menos 5 caracteres.'
    if (form.title.trim().length > 100) return 'El título no puede tener más de 100 caracteres.'
    if (!form.category) return 'Por favor selecciona una categoría.'
    if (form.content.trim().length < 50) return 'El detalle debe tener al menos 50 caracteres.'
    if (form.userName.trim().length < 2) return 'Por favor ingresa tu nombre.'
    if (form.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) {
      return 'El formato del correo electrónico no es válido.'
    }
    if (!form.agreeTerms) return 'Debes aceptar los términos para continuar.'
    return null
  }

  // 提交表单
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // 客户端验证
    const validationError = validate()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setSubmitStatus('submitting')
    setErrorMessage(null)

    try {
      const supabase = createClient()

      // 构造要插入的记录
      const payload = {
        institution_id: form.institutionId,
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category as ComplaintCategory,
        user_name: form.userName.trim(),
        user_email: form.userEmail.trim() || null,
        status: 'pending' as const,
        is_public: true,
        user_id: null
      }

      const { error } = await supabase
        .from('complaints')
        .insert([payload])

      if (error) {
        console.error('Supabase insert error:', error)
        setErrorMessage(
          error.message.includes('duplicate')
            ? 'Ya existe una queja similar. Verifica antes de continuar.'
            : 'No se pudo enviar la queja. Por favor intenta de nuevo.'
        )
        setSubmitStatus('error')
        return
      }

      // 成功 - 跳转回列表页
      setSubmitStatus('success')
      startTransition(() => {
        router.push('/quejas?success=1')
        router.refresh()
      })
    } catch (err) {
      console.error('Submit error:', err)
      setErrorMessage('Error inesperado. Por favor intenta de nuevo.')
      setSubmitStatus('error')
    }
  }

  // 成功页面
  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-green-600">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Queja Enviada Exitosamente!
            </h1>
            <p className="text-gray-600 mb-8">
              Gracias por compartir tu experiencia. Tu queja ha sido registrada
              y será revisada por nuestro equipo de moderación en las próximas
              24-48 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quejas"
                className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Ver todas las quejas
              </Link>
              <Link
                href="/"
                className="inline-block bg-white text-blue-700 border border-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <Link href="/quejas" className="text-blue-700 hover:underline text-sm">
            ← Volver a quejas
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-200">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Presentar una Queja
          </h1>
          <p className="text-gray-600 mb-8">
            Completa el siguiente formulario para presentar una queja sobre una
            institución financiera. Toda la información es revisada antes de su
            publicación.
          </p>

          {/* 错误提示 */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {errorMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* 机构选择 */}
            <div>
              <label htmlFor="institutionId" className="block text-sm font-semibold text-gray-900 mb-2">
                Institución <span className="text-red-600">*</span>
              </label>
              {loadingInstitutions ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  Cargando instituciones...
                </div>
              ) : institutionsError ? (
                <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
                  {institutionsError}
                </div>
              ) : (
                <select
                  id="institutionId"
                  value={form.institutionId}
                  onChange={(e) => updateField('institutionId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona una institución</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({TYPE_LABELS[inst.type]})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Título de la queja <span className="text-red-600">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                maxLength={100}
                placeholder="Ej: Cobranza indebida en mi tarjeta de crédito"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.title.length} / 100 caracteres
              </p>
            </div>

            {/* 分类 */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                Categoría <span className="text-red-600">*</span>
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value as ComplaintCategory | '')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            {/* 详细内容 */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
                Detalle de la queja <span className="text-red-600">*</span>
              </label>
              <textarea
                id="content"
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                rows={8}
                minLength={50}
                placeholder="Describe el problema con el mayor detalle posible: fechas, montos, números de folio, personas con quienes hablaste, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {form.content.length} caracteres (mínimo 50)
              </p>
            </div>

            {/* 用户名 */}
            <div>
              <label htmlFor="userName" className="block text-sm font-semibold text-gray-900 mb-2">
                Tu nombre <span className="text-red-600">*</span>
              </label>
              <input
                id="userName"
                type="text"
                value={form.userName}
                onChange={(e) => updateField('userName', e.target.value)}
                maxLength={50}
                placeholder="Ej: María G."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 邮箱（可选） */}
            <div>
              <label htmlFor="userEmail" className="block text-sm font-semibold text-gray-900 mb-2">
                Correo electrónico <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="userEmail"
                type="email"
                value={form.userEmail}
                onChange={(e) => updateField('userEmail', e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo se usará para dar seguimiento a tu queja. No será público.
              </p>
            </div>

            {/* 同意条款 */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={form.agreeTerms}
                onChange={(e) => updateField('agreeTerms', e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-700 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-700 leading-relaxed">
                Confirmo que esta queja se basa en mi experiencia real, que la
                información proporcionada es veraz, y que he leído y acepto los{' '}
                <Link href="/terminos" className="text-blue-700 hover:underline font-medium">
                  Términos de Uso
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" className="text-blue-700 hover:underline font-medium">
                  Política de Privacidad
                </Link>
                . <span className="text-red-600">*</span>
              </label>
            </div>

            {/* 提交按钮 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={submitStatus === 'submitting' || isPending}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitStatus === 'submitting' || isPending ? 'Enviando...' : 'Enviar Queja'}
              </button>
              <Link
                href="/quejas"
                className="flex-1 text-center bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>

          {/* 提示信息 */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Nota:</strong> Tu queja será revisada por nuestro equipo de
              moderación antes de ser publicada. Esto puede tomar entre 24 y 48 horas.
              Si requiere información adicional, te contactaremos al correo proporcionado.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
