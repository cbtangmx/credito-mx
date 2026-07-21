// ============================================
// 投诉列表页 - 服务端组件
// 从 Supabase 真实数据库获取所有公开投诉
// 显示投诉列表、统计数据和"Presentar Queja"按钮
// ============================================

import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from '@/lib/supabase-server'
import {
  Complaint,
  ComplaintStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  CATEGORY_LABELS
} from '@/types/database'

// 页面元数据 - SEO 优化
export const metadata: Metadata = {
  title: "Quejas de Usuarios - Instituciones Financieras",
  description: "Lee quejas públicas de usuarios sobre instituciones financieras en México. Cargos no reconocidos, tasas abusivas, mal servicio y más.",
  alternates: {
    canonical: "/quejas",
  },
  openGraph: {
    title: "Quejas de Usuarios - Credito MX",
    description: "Quejas públicas sobre instituciones financieras en México",
    type: "website",
    locale: "es_MX",
  },
}

// 扩展的投诉类型 - 包含关联机构信息
type ComplaintWithInstitution = Complaint & {
  institution: { id: string; name: string; slug: string } | null
}

// 截断文本辅助函数 - 防止过长内容破坏布局
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

// 格式化日期为西班牙语短格式
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 投诉列表页组件
export default async function QuejasPage() {
  const supabase = await createClient()

  // 并行获取投诉列表和各类状态统计
  const [
    { data: complaintsData, error: complaintsError },
    { count: totalCount },
    { count: pendingCount },
    { count: reviewingCount },
    { count: resolvedCount },
    { count: rejectedCount }
  ] = await Promise.all([
    // 公开投诉列表：联合查询机构信息，按时间倒序
    supabase
      .from('complaints')
      .select('*, institution:institutions(id, name, slug)')
      .eq('is_public', true)
      .order('created_at', { ascending: false }),
    // 全部公开投诉总数
    supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true),
    // 各状态统计
    supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)
      .eq('status', 'pending'),
    supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)
      .eq('status', 'reviewing'),
    supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)
      .eq('status', 'resolved'),
    supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)
      .eq('status', 'rejected')
  ])

  // 类型安全兜底
  const complaints: ComplaintWithInstitution[] =
    (complaintsData as ComplaintWithInstitution[] | null) ?? []

  const hasError = !!complaintsError
  const hasData = complaints.length > 0

  // 用于统计卡片的配置
  const stats: { label: string; count: number | null; color: string; status: ComplaintStatus | 'total' }[] = [
    { label: 'Total', count: totalCount, color: 'bg-gray-100 text-gray-800', status: 'total' },
    { label: STATUS_LABELS.pending, count: pendingCount, color: STATUS_COLORS.pending, status: 'pending' },
    { label: STATUS_LABELS.reviewing, count: reviewingCount, color: STATUS_COLORS.reviewing, status: 'reviewing' },
    { label: STATUS_LABELS.resolved, count: resolvedCount, color: STATUS_COLORS.resolved, status: 'resolved' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 - 标题 + Presentar Queja 按钮 */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Quejas de Usuarios
              </h1>
              <p className="text-gray-600 mt-2">
                Quejas públicas sobre instituciones financieras en México
              </p>
            </div>
            <Link
              href="/quejas/nueva"
              className="inline-flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              <span className="mr-2">+</span>
              Presentar Queja
            </Link>
          </div>
        </div>
      </section>

      {/* 统计卡片区 */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.status}
                className="bg-white rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${stat.color}`}>
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {typeof stat.count === 'number' ? stat.count.toLocaleString('es-MX') : '0'}
                </div>
                <div className="text-xs text-gray-500 mt-1">quejas</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 投诉列表 */}
      <section className="py-6 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 顶部信息行 */}
          <div className="mb-4 text-sm text-gray-600">
            {hasError ? (
              <span className="text-red-600">Error al cargar las quejas.</span>
            ) : (
              <span>
                Mostrando <strong className="text-gray-900">{complaints.length}</strong>{' '}
                {complaints.length === 1 ? 'queja pública' : 'quejas públicas'}
              </span>
            )}
          </div>

          {/* 错误占位 */}
          {hasError ? (
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No se pudieron cargar las quejas.</p>
              <p className="text-gray-400 text-sm mt-2">Intenta recargar la página en unos momentos.</p>
            </div>
          ) : !hasData ? (
            // 空数据占位
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No hay contenido disponible todavía</p>
              <p className="text-gray-400 text-sm mt-2 mb-6">
                Sé el primero en compartir tu experiencia con una institución financiera.
              </p>
              <Link
                href="/quejas/nueva"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Presentar la primera queja
              </Link>
            </div>
          ) : (
            // 投诉卡片列表
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <Link
                  key={complaint.id}
                  href={`/quejas/${complaint.id}`}
                  className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                    {/* 标题 */}
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {complaint.title}
                    </h3>
                    {/* 状态标签 */}
                    <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[complaint.status]}`}>
                      {STATUS_LABELS[complaint.status]}
                    </span>
                  </div>

                  {/* 内容摘要 */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {truncate(complaint.content, 150)}
                  </p>

                  {/* 元信息行：分类 + 机构 + 用户 + 日期 */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded font-medium">
                      {CATEGORY_LABELS[complaint.category]}
                    </span>
                    {complaint.institution && (
                      <>
                        <span>•</span>
                        <span>
                          Institución:{' '}
                          <span className="font-medium text-gray-900">
                            {complaint.institution.name}
                          </span>
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span>Por {complaint.user_name}</span>
                    <span>•</span>
                    <span>{formatDate(complaint.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
