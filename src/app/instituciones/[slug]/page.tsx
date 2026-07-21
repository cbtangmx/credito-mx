// ============================================
// 机构详情页 - 服务端组件
// 使用 Supabase 真实数据库获取机构、评价、投诉数据
// 通过 slug 路由参数查找具体机构
// ============================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import {
  Institution,
  Review,
  Complaint,
  TYPE_LABELS,
  TYPE_COLORS,
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS
} from '@/types/database'

// 页面 props 类型
type Props = {
  params: Promise<{ slug: string }>
}

// ============================================
// 动态生成页面 Metadata (SEO)
// 按 T06 规范生成 meta description
// 模板: Reseñas y quejas de {name} en México. {description}. {reviewCount} evaluaciones, {complaintCount} quejas. Calificación: {rating}/5. Opiniones reales de usuarios.
// 长度控制: 140-160 字符
// ============================================

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('institutions')
    .select('name, description, type, rating, review_count, complaint_count')
    .eq('slug', slug)
    .single()

  const institution = data as Pick<Institution, 'name' | 'description' | 'type' | 'rating' | 'review_count' | 'complaint_count'> | null

  if (!institution) {
    return {
      title: 'Institución no encontrada',
      description: 'La institución financiera que buscas no existe.'
    }
  }

  const rating = institution.rating.toFixed(1)
  const reviewCount = institution.review_count
  const complaintCount = institution.complaint_count
  const desc = institution.description ?? ''

  // ---- 按 T06 规范生成 meta description ----
  // 模板: Reseñas y quejas de {name} en México. {description}. {reviewCount} evaluaciones, ...
  const fixedHead = `Reseñas y quejas de ${institution.name} en México. `
  const tail = `. ${reviewCount} evaluaciones, ${complaintCount} quejas. Calificación: ${rating}/5.`
  const tailFull = `. ${reviewCount} evaluaciones, ${complaintCount} quejas. Calificación: ${rating}/5. Opiniones reales de usuarios.`

  // 尝试完整版（含尾部 "Opiniones reales de usuarios."）
  let metaDescription = fixedHead + desc + tailFull

  // 超长 → 去掉尾部
  if (metaDescription.length > 160) {
    metaDescription = fixedHead + desc + tail
  }

  // 仍超长 → 截断 description
  if (metaDescription.length > 160) {
    const maxDescLen = 160 - fixedHead.length - tail.length
    const truncatedDesc = desc.substring(0, Math.max(10, maxDescLen))
    metaDescription = fixedHead + truncatedDesc + tail
  }

  return {
    title: `${institution.name} - Evaluaciones, Quejas y Calificación`,
    description: metaDescription,
    alternates: {
      canonical: `/instituciones/${slug}`,
    },
    openGraph: {
      title: `${institution.name} - Evaluaciones y Quejas`,
      description: metaDescription,
      type: 'website',
      locale: 'es_MX',
      siteName: 'Credito MX',
    },
    twitter: {
      card: 'summary',
      title: `${institution.name} - Calificación: ${rating}/5`,
      description: metaDescription,
    },
  }
}

// ============================================
// 格式化日期辅助函数
// ============================================
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// ============================================
// 渲染星级评分
// ============================================
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ============================================
// 机构详情页主组件
// ============================================
export default async function InstitutionDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // 根据 slug 查询机构基本信息
  const { data: institutionData, error: institutionError } = await supabase
    .from('institutions')
    .select('*')
    .eq('slug', slug)
    .single()

  const institution = institutionData as Institution | null

  // 机构不存在时显示 404 页面
  if (!institution || institutionError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Institución no encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            La institución que buscas no existe o ha sido eliminada.
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

  // 并行获取评价和投诉（只取已审核/公开的，最多 20 条）
  const [
    { data: reviewsData },
    { data: complaintsData }
  ] = await Promise.all([
    supabase
      .from('reviews')
      .select('*')
      .eq('institution_id', institution.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('complaints')
      .select('*')
      .eq('institution_id', institution.id)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20)
  ])

  const reviews = (reviewsData as Review[] | null) ?? []
  const complaints = (complaintsData as Complaint[] | null) ?? []

  // 取前 5 条用于详情页展示
  const topReviews = reviews.slice(0, 5)
  const topComplaints = complaints.slice(0, 5)

  // ============================================
  // JSON-LD: Organization + AggregateRating Schema
  // 根据机构类型映射 schema.org 类型
  // ============================================
  const schemaTypeMap: Record<string, string> = {
    bank: 'BankOrCreditUnion',
    sofom: 'FinancialService',
    fintech: 'FinancialService',
    government: 'GovernmentOrganization',
    credit_card: 'FinancialService',
  }

  const institutionSchema = {
    '@context': 'https://schema.org',
    '@type': schemaTypeMap[institution.type] || 'Organization',
    name: institution.name,
    url: `https://credito-mx.com/instituciones/${slug}`,
    ...(institution.website_url && { sameAs: [institution.website_url] }),
    ...(institution.description && { description: institution.description }),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MX',
    },
    ...(institution.is_verified && {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'Institución verificada',
      }
    }),
    // AggregateRating - 核心评分数据
    ...(institution.review_count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: institution.rating.toFixed(1),
        bestRating: '5',
        worstRating: '1',
        ratingCount: institution.review_count,
        reviewCount: institution.review_count,
      },
    }),
    // Review - 前5条评价
    ...(topReviews.length > 0 && {
      review: topReviews.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.user_name,
        },
        datePublished: review.created_at,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1',
        },
        ...(review.title && { name: review.title }),
        ...(review.content && { reviewBody: review.content }),
      })),
    }),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO: Structured Data - Organization + AggregateRating */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(institutionSchema),
        }}
      />
      {/* ============================================ */}
      {/* 机构头部 - 返回链接 + 类型标签 + 评分 + 操作按钮 */}
      {/* ============================================ */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/instituciones"
            className="text-blue-700 hover:underline text-sm mb-4 inline-block"
          >
            ← Todas las instituciones
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {/* 机构类型标签 */}
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${TYPE_COLORS[institution.type]}`}>
                  {TYPE_LABELS[institution.type]}
                </span>
                {/* 评分 */}
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1 text-lg">★</span>
                  <span className="font-bold text-lg text-gray-900">
                    {institution.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/5</span>
                </div>
                {/* 已验证标识 */}
                {institution.is_verified && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    ✓ Verificada
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {institution.name}
              </h1>
            </div>
            {/* 操作按钮 */}
            <div className="flex gap-3 flex-wrap">
              {institution.website_url && (
                <a
                  href={institution.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
                >
                  Visitar sitio web →
                </a>
              )}
              <Link
                href={`/instituciones/${slug}/resena`}
                className="px-4 py-2 bg-white text-blue-700 border border-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Escribir evaluación
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 主体内容 - 两列布局 */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============================================ */}
          {/* 左侧主内容区 (占 2/3) */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 机构描述 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Acerca de {institution.name}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {institution.description ?? 'No hay descripción disponible para esta institución.'}
              </p>
            </div>

            {/* 统计卡片 - 3 个指标 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {institution.review_count.toLocaleString('es-MX')}
                </p>
                <p className="text-sm text-gray-500 mt-1">Evaluaciones</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <p className="text-3xl font-bold text-red-600">
                  {institution.complaint_count.toLocaleString('es-MX')}
                </p>
                <p className="text-sm text-gray-500 mt-1">Quejas</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <p className="text-3xl font-bold text-yellow-500">
                  {institution.rating.toFixed(1)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Calificación</p>
              </div>
            </div>

            {/* 评价列表 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Evaluaciones ({institution.review_count.toLocaleString('es-MX')})
              </h2>
              {topReviews.length === 0 ? (
                <p className="text-gray-500 text-sm italic py-4 text-center">
                  No hay evaluaciones todavía. ¡Sé el primero en compartir tu experiencia!
                </p>
              ) : (
                <div className="space-y-4">
                  {topReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <span className="font-medium text-gray-900">
                          {review.user_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      <div className="mb-2">
                        <StarRating rating={review.rating} />
                      </div>
                      {review.title && (
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {review.title}
                        </h4>
                      )}
                      <p className="text-gray-700 text-sm whitespace-pre-line">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {reviews.length > 0 && (
                <p className="text-sm text-gray-500 mt-4 italic">
                  Mostrando {topReviews.length} de {institution.review_count.toLocaleString('es-MX')} evaluaciones.
                </p>
              )}
            </div>

            {/* 投诉列表 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quejas ({institution.complaint_count.toLocaleString('es-MX')})
              </h2>
              {topComplaints.length === 0 ? (
                <p className="text-gray-500 text-sm italic py-4 text-center">
                  No hay quejas todavía para esta institución.
                </p>
              ) : (
                <div className="space-y-4">
                  {topComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="border-b border-gray-100 pb-4 last:border-0"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                        <span>{complaint.user_name}</span>
                        <span>·</span>
                        <span>{formatDate(complaint.created_at)}</span>
                        <span>·</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                          {CATEGORY_LABELS[complaint.category]}
                        </span>
                        <span>·</span>
                        <span
                          className={`px-2 py-0.5 rounded font-medium ${STATUS_COLORS[complaint.status]}`}
                        >
                          {STATUS_LABELS[complaint.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* 右侧侧边栏 (占 1/3) */}
          {/* ============================================ */}
          <div className="space-y-6">
            {/* 机构摘要 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Resumen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo</span>
                  <span className="font-medium text-gray-900">
                    {TYPE_LABELS[institution.type]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Calificación</span>
                  <span className="font-medium text-gray-900">
                    {institution.rating.toFixed(1)}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Evaluaciones</span>
                  <span className="font-medium text-gray-900">
                    {institution.review_count.toLocaleString('es-MX')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quejas</span>
                  <span className="font-medium text-red-600">
                    {institution.complaint_count.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
            </div>

            {/* 写评价 CTA */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">
                ¿Tienes una experiencia?
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                Comparte tu evaluación para ayudar a otros usuarios a tomar mejores decisiones.
              </p>
              <Link
                href={`/instituciones/${slug}/resena`}
                className="block text-center px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm"
              >
                Escribe tu experiencia
              </Link>
            </div>

            {/* 投诉 CTA */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Presentar una queja
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Si tuviste un problema con {institution.name}, puedes presentar una queja aquí.
              </p>
              <Link
                href={`/quejas/nueva?institution=${slug}`}
                className="block text-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
              >
                Presentar queja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
