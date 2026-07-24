// ============================================
// 首页 - 服务端组件
// 从 Supabase 真实数据库获取：热门机构、最近投诉、评价总数
// 使用并行请求 (Promise.all) 提升性能
// ============================================

import Link from "next/link"
import { buildMetadata } from '@/lib/seo'
import { createClient } from '@/lib/supabase-server'
import {
  Institution,
  Complaint,
  TYPE_LABELS,
  TYPE_COLORS,
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS
} from '@/types/database'

// 页面元数据 - SEO 优化
export const metadata = buildMetadata({
  title: 'Credito MX - Evaluaciones de Instituciones Financieras en México',
  description: 'Evalúa y compara instituciones financieras en México. Lee evaluaciones de usuarios, presenta quejas y encuentra las mejores opciones de crédito, préstamos y servicios financieros.',
  url: '/',
  type: 'website',
  imageAlt: 'Credito MX — Reseñas financieras en México',
})

// 首页组件 - 异步获取 Supabase 数据
export default async function HomePage() {
  // 创建服务端 Supabase 客户端
  const supabase = await createClient()

  // 并行获取三组数据：热门机构、最近公开投诉、已审核评价总数
  const [
    { data: institutionsData, error: instError },
    { data: complaintsData, error: compError },
    { data: _reviews, count: reviewCount, error: revError }
  ] = await Promise.all([
    // 热门机构：按评分降序，取前 4
    supabase
      .from('institutions')
      .select('*')
      .order('rating', { ascending: false })
      .limit(4),
    // 最近公开投诉：联合查询关联机构名称，取前 3
    supabase
      .from('complaints')
      .select('*, institution:institutions(id, name, slug)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(3),
    // 已审核评价总数（仅获取计数，不拉取数据）
    supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', true)
  ])

  // 类型安全的空数据兜底
  const institutions: Institution[] = (institutionsData as Institution[] | null) ?? []
  const complaints: (Complaint & { institution?: { id: string; name: string; slug: string } })[] =
    (complaintsData as any[] | null) ?? []

  // 数据是否有内容的标志
  const hasInstitutions = institutions.length > 0
  const hasComplaints = complaints.length > 0

  // 错误信息聚合
  const hasError = !!(instError || compError || revError)

  return (
    <div className="min-h-screen">
      {/* Hero Section - 顶部主视觉 */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Evalúa Instituciones Financieras en México
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Lee evaluaciones de usuarios, presenta quejas y encuentra las mejores opciones de crédito, préstamos y servicios financieros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/instituciones"
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Ver Instituciones
              </Link>
              <Link
                href="/quejas/nueva"
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Presentar Queja
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - 平台数据统计 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-700">
                {hasInstitutions ? `${institutions.length}+` : '0'}
              </div>
              <div className="text-gray-600 mt-2">Instituciones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">
                {/* 显示真实已审核评价数量 */}
                {typeof reviewCount === 'number' ? `${reviewCount.toLocaleString('es-MX')}+` : '0'}
              </div>
              <div className="text-gray-600 mt-2">Evaluaciones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">
                {hasComplaints ? `${complaints.length}+` : '0'}
              </div>
              <div className="text-gray-600 mt-2">Quejas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-gray-600 mt-2">Resueltas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Institutions - 热门机构列表 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Instituciones Populares
            </h2>
            <Link
              href="/instituciones"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Ver todas →
            </Link>
          </div>

          {hasError && !hasInstitutions ? (
            // 加载错误占位
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No se pudieron cargar las instituciones.</p>
              <p className="text-gray-400 text-sm mt-2">Intenta recargar la página en unos momentos.</p>
            </div>
          ) : !hasInstitutions ? (
            // 空数据友好提示
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No hay contenido disponible todavía</p>
              <p className="text-gray-400 text-sm mt-2">
                Estamos trabajando para agregar las primeras instituciones. Vuelve pronto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {institutions.map((institution) => (
                <Link
                  key={institution.id}
                  href={`/instituciones/${institution.slug}`}
                  className="institution-card bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[institution.type]}`}>
                      {TYPE_LABELS[institution.type]}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-semibold text-gray-900">
                        {institution.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {institution.name}
                    {institution.is_verified && (
                      <span className="ml-2 text-blue-700 text-sm" title="Verificada">✓</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {institution.description ?? 'Sin descripción disponible.'}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{institution.review_count} evaluaciones</span>
                    <span className="text-red-600">{institution.complaint_count} quejas</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Complaints - 最近投诉 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Quejas Recientes
            </h2>
            <Link
              href="/quejas"
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Ver todas →
            </Link>
          </div>

          {!hasComplaints ? (
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">No hay contenido disponible todavía</p>
              <p className="text-gray-400 text-sm mt-2">
                Sé el primero en compartir tu experiencia con una institución financiera.
              </p>
              <Link
                href="/quejas/nueva"
                className="inline-block mt-4 text-blue-700 hover:underline font-medium"
              >
                Presentar una queja →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {complaints.map((complaint) => (
                <Link
                  key={complaint.id}
                  href={`/quejas/${complaint.id}`}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[complaint.status]}`}>
                      {STATUS_LABELS[complaint.status]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(complaint.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {complaint.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">
                      {CATEGORY_LABELS[complaint.category]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Institución:{' '}
                    <span className="font-medium text-gray-900">
                      {complaint.institution?.name ?? 'Desconocida'}
                    </span>
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section - 按类型浏览 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explora por Categoría
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/instituciones?tipo=fintech"
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors"
            >
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-blue-700">Fintech</h3>
              <p className="text-sm text-gray-600 mt-1">Apps y servicios digitales</p>
            </Link>

            <Link
              href="/instituciones?tipo=sofom"
              className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center hover:border-green-400 transition-colors"
            >
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-green-700">SOFOM</h3>
              <p className="text-sm text-gray-600 mt-1">Préstamos personales</p>
            </Link>

            <Link
              href="/instituciones?tipo=bank"
              className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors"
            >
              <div className="text-3xl mb-2">🏦</div>
              <h3 className="font-semibold text-purple-700">Bancos</h3>
              <p className="text-sm text-gray-600 mt-1">Bancos tradicionales</p>
            </Link>

            <Link
              href="/instituciones?tipo=credit_card"
              className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center hover:border-orange-400 transition-colors"
            >
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold text-orange-700">Tarjetas</h3>
              <p className="text-sm text-gray-600 mt-1">Tarjetas de crédito</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - 行动召唤 */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes una experiencia con una institución financiera?
          </h2>
          <p className="text-blue-100 mb-8">
            Ayuda a otros usuarios haciendo una evaluación honesta. Tu opinión importa.
          </p>
          <Link
            href="/evaluar"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Hacer Evaluación
          </Link>
        </div>
      </section>
    </div>
  )
}
