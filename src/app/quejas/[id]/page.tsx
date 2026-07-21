// ============================================
// 投诉详情页 - 服务端组件
// 从 Supabase 真实数据库获取单条公开投诉及关联机构信息
// 支持动态元数据生成 (SEO)
// ============================================

import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from '@/lib/supabase-server'
import {
  Complaint,
  Institution,
  STATUS_LABELS,
  STATUS_COLORS,
  CATEGORY_LABELS,
  TYPE_LABELS
} from '@/types/database'

// 扩展类型 - 包含完整的关联机构信息
type ComplaintDetail = Complaint & {
  institution: Pick<Institution, 'id' | 'name' | 'slug' | 'type' | 'rating' | 'review_count' | 'complaint_count' | 'logo_url'> | null
}

// 页面 props - Next.js 15+ 中 params 是 Promise
type Props = {
  params: Promise<{ id: string }>
}

// 动态生成页面元数据 - SEO 优化
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  // 仅查询需要的字段以减少开销
  const { data } = await supabase
    .from('complaints')
    .select('title, content, institution:institutions(name)')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  if (!data) {
    return {
      title: "Queja no encontrada",
      description: "La queja que buscas no existe o no está disponible públicamente."
    }
  }

  // Supabase 关联查询返回的是数组（即使是一对一关系），需要先取首项
  const rawInstitution = data.institution as unknown as
    | { name: string }
    | { name: string }[]
    | null
    | undefined
  const institutionName = Array.isArray(rawInstitution)
    ? rawInstitution[0]?.name
    : rawInstitution?.name
  const finalInstitutionName = institutionName ?? 'una institución'

  return {
    title: data.title,
    description: `Queja sobre ${finalInstitutionName}: ${data.content.slice(0, 150)}`,
    alternates: {
      canonical: `/quejas/${id}`,
    },
    openGraph: {
      title: `${data.title} | Credito MX`,
      description: `Queja pública sobre ${institutionName}`,
      type: "article",
      locale: "es_MX",
    },
  }
}

// 格式化日期 - 完整格式
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 投诉详情页组件
export default async function ComplaintDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // 获取单条投诉 + 关联机构完整信息
  const { data: complaintData, error } = await supabase
    .from('complaints')
    .select('*, institution:institutions(id, name, slug, type, rating, review_count, complaint_count, logo_url)')
    .eq('id', id)
    .eq('is_public', true)
    .single()

  // 数据不存在或查询错误 - 触发 404
  if (error || !complaintData) {
    notFound()
  }

  const complaint = complaintData as unknown as ComplaintDetail
  const institution = complaint.institution

  // ============================================
  // JSON-LD: WebPage + CreativeWork Schema
  // 让搜索引擎和 AI 引擎结构化理解投诉内容
  // ============================================
  const complaintSchema = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'CreativeWork'],
    name: complaint.title,
    headline: complaint.title,
    description: complaint.content.slice(0, 300),
    url: `https://credito-mx.com/quejas/${complaint.id}`,
    datePublished: complaint.created_at,
    ...(complaint.resolution && { dateModified: complaint.resolution }),
    inLanguage: 'es-MX',
    author: {
      '@type': 'Person',
      name: complaint.user_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Credito MX',
      url: 'https://credito-mx.com',
    },
    // 投诉关联的金融机构
    about: institution
      ? {
          '@type': 'Organization',
          name: institution.name,
          url: `https://credito-mx.com/instituciones/${institution.slug}`,
          ...(institution.rating > 0 && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: institution.rating.toFixed(1),
              ratingCount: institution.review_count,
              bestRating: '5',
              worstRating: '1',
            },
          }),
        }
      : undefined,
    // 投诉分类
    keywords: [
      CATEGORY_LABELS[complaint.category],
      'queja',
      'queja financiera',
      institution?.name,
      'México',
    ].filter(Boolean).join(', '),
    // 投诉状态
    creativeWorkStatus: complaint.status === 'resolved'
      ? 'resolved'
      : complaint.status === 'reviewing'
        ? 'in progress'
        : 'pending',
    // 投诉内容正文
    text: complaint.content,
  }

  // BreadcrumbList Schema - 面包屑导航
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://credito-mx.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Quejas',
        item: 'https://credito-mx.com/quejas',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: complaint.title.slice(0, 50),
        item: `https://credito-mx.com/quejas/${complaint.id}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO: Structured Data - WebPage + CreativeWork */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(complaintSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* 顶部导航 + 标题 */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/quejas"
            className="text-blue-700 hover:underline text-sm mb-3 inline-block"
          >
            ← Volver a todas las quejas
          </Link>

          {/* 分类 + 状态标签 */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded font-medium">
              {CATEGORY_LABELS[complaint.category]}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[complaint.status]}`}>
              {STATUS_LABELS[complaint.status]}
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {complaint.title}
          </h1>

          {/* 元信息：用户、日期 */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            <span>Presentada por <strong className="text-gray-900">{complaint.user_name}</strong></span>
            <span>•</span>
            <span>{formatDate(complaint.created_at)}</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 投诉详细内容 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Detalle de la Queja
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {complaint.content}
                </p>
              </div>
            </div>

            {/* 解决方案（如有） */}
            {complaint.resolution && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">✓</span>
                  <div>
                    <h2 className="text-xl font-semibold text-green-900 mb-2">
                      Resolución
                    </h2>
                    <p className="text-green-800 leading-relaxed whitespace-pre-wrap">
                      {complaint.resolution}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 联系信息提示 */}
            {complaint.user_email && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">📧</span>
                  <div>
                    <h2 className="text-lg font-semibold text-blue-900 mb-1">
                      Contacto del Usuario
                    </h2>
                    <p className="text-sm text-blue-800">
                      El usuario proporcionó un correo de contacto para seguimiento
                      (no visible públicamente para proteger su privacidad).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 反馈提示 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Tienes información adicional?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Si tienes experiencia similar con esta institución o información
                relevante sobre este caso, considera compartirla.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/quejas/nueva"
                  className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                >
                  Presentar queja similar
                </Link>
                <Link
                  href="/instituciones"
                  className="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Ver todas las instituciones
                </Link>
              </div>
            </div>
          </div>

          {/* 右侧：机构信息卡片 */}
          <div className="space-y-6">
            {institution && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Institución
                </h3>
                <Link
                  href={`/instituciones/${institution.slug}`}
                  className="block group"
                >
                  {/* Logo / 头像 */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-700 mb-3 group-hover:scale-105 transition-transform">
                    {institution.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={institution.logo_url}
                        alt={institution.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      institution.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {institution.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {TYPE_LABELS[institution.type]}
                  </p>
                </Link>

                {/* 机构统计 */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Calificación</span>
                    <span className="font-semibold text-gray-900">
                      <span className="text-yellow-500">★</span>{' '}
                      {institution.rating.toFixed(1)} / 5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Evaluaciones</span>
                    <span className="font-semibold text-gray-900">
                      {institution.review_count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quejas totales</span>
                    <span className="font-semibold text-red-600">
                      {institution.complaint_count}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/instituciones/${institution.slug}`}
                  className="block mt-4 text-center px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors text-sm"
                >
                  Ver detalles de {institution.name} →
                </Link>
              </div>
            )}

            {/* 分享/举报卡片 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Información
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Esta queja es pública y forma parte de nuestro registro transparente
                de experiencias con instituciones financieras en México.
              </p>
              <p className="text-xs text-gray-400 mt-3">
                ID de queja: {complaint.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
