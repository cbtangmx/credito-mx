// ============================================
// 机构列表页 - 服务端组件
// 使用 Supabase 真实数据库获取机构数据
// 支持按类型筛选和按名称搜索
// ============================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { Institution, TYPE_LABELS, TYPE_COLORS, InstitutionType } from '@/types/database'

export const metadata: Metadata = {
  title: "Instituciones Financieras en México",
  description: "Lista completa de bancos, fintech y SOFOM en México. Compara calificaciones, lee evaluaciones de usuarios y encuentra la mejor opción de crédito.",
  alternates: {
    canonical: "/instituciones",
  },
}

// 机构类型筛选配置
const TYPE_FILTERS: { value: '' | InstitutionType; label: string }[] = [
  { value: '', label: 'Todas' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'sofom', label: 'SOFOM' },
  { value: 'bank', label: 'Bancos' },
  { value: 'credit_card', label: 'Tarjetas' }
]

// 页面 props 类型 - 接收 searchParams 用于筛选
type Props = {
  searchParams: Promise<{ tipo?: string; q?: string }>
}

// 服务端组件：直接连接 Supabase 获取机构列表
export default async function InstitutionsPage({ searchParams }: Props) {
  const supabase = await createClient()
  const params = await searchParams

  // 构建基础查询 - 按评分降序排列
  let query = supabase
    .from('institutions')
    .select('*')
    .order('rating', { ascending: false })

  // 按机构类型筛选
  if (params.tipo && (params.tipo === 'fintech' || params.tipo === 'sofom' || params.tipo === 'bank' || params.tipo === 'credit_card')) {
    query = query.eq('type', params.tipo)
  }

  // 按机构名称模糊搜索
  if (params.q && params.q.trim() !== '') {
    query = query.ilike('name', `%${params.q.trim()}%`)
  }

  // 执行查询
  const { data: institutions, error } = await query

  // 类型断言 - 数据库返回的数据符合 Institution 类型
  const institutionsList = (institutions as Institution[] | null) ?? []

  // 当前选中的筛选类型
  const currentType = params.tipo ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部 Header */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Instituciones Financieras en México
          </h1>
          <p className="text-gray-600 mt-2">
            Evaluaciones y quejas de usuarios sobre bancos, fintech y SOFOM
          </p>
        </div>
      </section>

      {/* 搜索框 + 分类筛选 */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* GET 表单 - 提交后刷新查询参数 */}
          <form method="GET" action="/instituciones" className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                name="q"
                defaultValue={params.q ?? ''}
                placeholder="Buscar institución..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* 保留当前 tipo 筛选条件 */}
              {params.tipo && <input type="hidden" name="tipo" value={params.tipo} />}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* 分类筛选标签 - 链接形式，点击切换筛选类型 */}
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((filter) => {
              const isActive = currentType === filter.value
              // 构造链接：保留 q 参数，切换 tipo
              const linkParams = new URLSearchParams()
              if (params.q) linkParams.set('q', params.q)
              if (filter.value) linkParams.set('tipo', filter.value)
              const href = linkParams.toString() ? `/instituciones?${linkParams.toString()}` : '/instituciones'

              return (
                <Link
                  key={filter.value || 'all'}
                  href={href}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter.label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 机构卡片网格 */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 顶部统计信息 */}
          <div className="mb-4 text-sm text-gray-600">
            {error ? (
              <span className="text-red-600">Error al cargar instituciones.</span>
            ) : (
              <span>
                Mostrando <strong className="text-gray-900">{institutionsList.length}</strong>{' '}
                {institutionsList.length === 1 ? 'institución' : 'instituciones'}
                {params.tipo && (
                  <>
                    {' '}en <strong className="text-gray-900">{TYPE_LABELS[params.tipo as InstitutionType]}</strong>
                  </>
                )}
                {params.q && (
                  <>
                    {' '}para &quot;<strong className="text-gray-900">{params.q}</strong>&quot;
                  </>
                )}
              </span>
            )}
          </div>

          {/* 数据为空时显示友好提示 */}
          {institutionsList.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <p className="text-gray-500 text-lg">
                No se encontraron instituciones
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Intenta con otros filtros o términos de búsqueda.
              </p>
              <Link
                href="/instituciones"
                className="inline-block mt-4 text-blue-700 hover:underline font-medium"
              >
                Ver todas las instituciones
              </Link>
            </div>
          ) : (
            // 响应式网格：移动1列 / 平板2列 / 桌面3列
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institutionsList.map((institution) => (
                <Link
                  key={institution.id}
                  href={`/instituciones/${institution.slug}`}
                  className="institution-card bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  {/* 顶部：类型标签 + 评分 */}
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

                  {/* 机构名称 */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {institution.name}
                    {institution.is_verified && (
                      <span className="ml-2 text-blue-700 text-sm" title="Verificada">✓</span>
                    )}
                  </h3>

                  {/* 描述 - 截断2行 */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {institution.description ?? 'Sin descripción disponible.'}
                  </p>

                  {/* 统计：评价数和投诉数 */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{institution.review_count} evaluaciones</span>
                    <span className="text-red-600">{institution.complaint_count} quejas</span>
                  </div>

                  {/* 查看详情按钮 */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-blue-700 font-medium text-sm">
                      Ver detalles →
                    </span>
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
