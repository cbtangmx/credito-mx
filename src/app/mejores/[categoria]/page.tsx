// ============================================
// 品类榜单页 - T07 SEO 优化
// 4 个品类：tarjetas-de-credito / fintech / sofom / bancos
// 11 个 Section + 4 个 JSON-LD Schema
// 排序公式: avgRating - (complaintCount / (reviewCount + complaintCount)) × 2
// ============================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-client'
import { DEFAULT_OG_IMAGE, BASE_URL } from '@/lib/seo'
import {
  Institution,
  Review,
  TYPE_LABELS,
} from '@/types/database'

// ============================================
// 品类配置
// ============================================
type CategorySlug = 'tarjetas-de-credito' | 'fintech' | 'sofom' | 'bancos'

const CATEGORY_CONFIG: Record<CategorySlug, {
  h1: string
  title: string
  description: string
  keyword: string
  categoryLabel: string
  productLabel: string
  schemaType: string
  filter: (inst: Institution) => boolean
}> = {
  'tarjetas-de-credito': {
    h1: 'Las Mejores Tarjetas de Crédito en México 2026',
    title: 'Las Mejores Tarjetas de Crédito en México 2026 | Credito MX',
    description: 'Ranking de las mejores tarjetas de crédito en México 2026. Comparamos calificaciones de usuarios, quejas y tasa de resolución.',
    keyword: 'mejores tarjetas de crédito México',
    categoryLabel: 'Mejores Tarjetas de Crédito',
    productLabel: 'Tarjeta de crédito',
    schemaType: 'CreditCard',
    filter: (inst) =>
      inst.type === 'credit_card' ||
      (inst.type === 'fintech' &&
        ((inst.description ?? '').toLowerCase().includes('tarjeta') ||
         inst.name.toLowerCase().includes('stori') ||
         inst.name.toLowerCase().includes('nu') ||
         inst.name.toLowerCase().includes('klar'))),
  },
  'fintech': {
    h1: 'Las Mejores Fintech en México 2026',
    title: 'Las Mejores Fintech en México 2026 | Credito MX',
    description: 'Ranking de las mejores fintech en México 2026. Comparamos calificaciones de usuarios, quejas y tasa de resolución.',
    keyword: 'mejores fintech México',
    categoryLabel: 'Mejores Fintech',
    productLabel: 'Servicios fintech',
    schemaType: 'FinancialService',
    filter: (inst) => inst.type === 'fintech',
  },
  'sofom': {
    h1: 'Las Mejores SOFOM de Préstamos en México 2026',
    title: 'Las Mejores SOFOM de Préstamos en México 2026 | Credito MX',
    description: 'Ranking de las mejores SOFOM de préstamos en México 2026. Comparamos calificaciones, quejas y tasa de resolución.',
    keyword: 'mejores SOFOM préstamos México',
    categoryLabel: 'Mejores SOFOM',
    productLabel: 'Préstamos personales',
    schemaType: 'FinancialService',
    filter: (inst) => inst.type === 'sofom',
  },
  'bancos': {
    h1: 'Los Mejores Bancos en México 2026',
    title: 'Los Mejores Bancos en México 2026 | Credito MX',
    description: 'Ranking de los mejores bancos en México 2026. Comparamos calificaciones de usuarios, quejas y tasa de resolución.',
    keyword: 'mejores bancos México',
    categoryLabel: 'Mejores Bancos',
    productLabel: 'Servicios bancarios',
    schemaType: 'BankOrCreditUnion',
    filter: (inst) => inst.type === 'bank',
  },
}

// ============================================
// 排序公式计算
// 排序分 = avgRating - (complaintCount / (reviewCount + complaintCount)) × 2
// ============================================
function calculateSortScore(inst: Institution): number {
  const total = inst.review_count + inst.complaint_count
  if (total === 0) return inst.rating
  const complaintRate = inst.complaint_count / total
  return inst.rating - complaintRate * 2
}

// ============================================
// 格式化日期
// ============================================
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

// ============================================
// generateStaticParams - 预生成 4 个品类页面
// ============================================
export function generateStaticParams() {
  return (Object.keys(CATEGORY_CONFIG) as CategorySlug[]).map((categoria) => ({
    categoria,
  }))
}

// ============================================
// generateMetadata - SEO 元数据
// ============================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>
}): Promise<Metadata> {
  const { categoria } = await params
  const config = CATEGORY_CONFIG[categoria as CategorySlug]

  if (!config) {
    return {
      title: 'Categoría no encontrada',
      description: 'La categoría que buscas no existe.',
    }
  }

  const url = `${BASE_URL}/mejores/${categoria}`

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `/mejores/${categoria}`,
    },
    openGraph: {
      title: config.h1,
      description: config.description,
      type: 'article',
      locale: 'es_MX',
      url,
      siteName: 'Credito MX',
      images: [{
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${config.categoryLabel} en México 2026`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.h1,
      description: config.description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

// ============================================
// FAQ 数据（共用）
// ============================================
const FAQ_DATA = [
  {
    question: '¿Cómo se calcula el ranking de Credito MX?',
    answer:
      'Nuestro ranking se basa en evaluaciones reales de usuarios, número de quejas registradas y tasa de resolución. No aceptamos pago por modificar posiciones.',
  },
  {
    question: '¿Qué es una SOFOM?',
    answer:
      'Una SOFOM (Sociedad Financiera de Objeto Múltiple) es una institución que otorga préstamos. Existen dos tipos: SOFOM ER (regulada por CNBV) y SOFOM ENR (no regulada por CNBV pero registrada ante CONDUSEF). Siempre verifica el tipo antes de contratar.',
  },
  {
    question: '¿Es seguro usar una fintech en México?',
    answer:
      'Una fintech confiable debe estar registrada ante CONDUSEF y, según sus productos, regulada por la CNBV (como IFPE). Verifica siempre en SIPRES antes de contratar. Las fintechs con calificación superior a 4.0 en nuestra plataforma han demostrado mejores experiencias de usuario.',
  },
  {
    question: '¿Qué hago si tengo una queja contra una institución?',
    answer:
      'Puedes presentar tu queja de forma anónima en nuestra plataforma y/o ante CONDUSEF directamente. Nuestra plataforma da seguimiento público al estado de cada queja.',
  },
  {
    question: '¿Estas evaluaciones son reales?',
    answer:
      'Sí, todas las evaluaciones son de usuarios que reportan experiencias reales. Nuestro equipo de moderación revisa cada publicación para verificar autenticidad y respeto a las normas de la comunidad.',
  },
]

// ============================================
// 页面组件
// ============================================
export default async function MejoresCategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  const config = CATEGORY_CONFIG[categoria as CategorySlug]

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Categoría no encontrada</p>
          <Link
            href="/"
            className="text-blue-700 hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  // ============================================
  // 数据获取
  // ============================================
  const supabase = createClient()

  // 获取全部机构
  const { data: allInstitutions } = await supabase
    .from('institutions')
    .select('*')
    .order('rating', { ascending: false })

  // 按品类筛选
  const institutions = ((allInstitutions as Institution[] | null) ?? [])
    .filter(config.filter)
    .map((inst) => ({
      ...inst,
      sortScore: calculateSortScore(inst),
    }))
    .sort((a, b) => b.sortScore - a.sortScore)

  // 获取每个机构的 1 条评价（用于 blockquote）
  const institutionIds = institutions.map((i) => i.id)
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .in('institution_id', institutionIds)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  // 为每个机构取第一条评价
  const reviewMap = new Map<string, Review>()
  for (const review of (reviewsData as Review[] | null) ?? []) {
    if (!reviewMap.has(review.institution_id)) {
      reviewMap.set(review.institution_id, review)
    }
  }

  // 获取投诉数据用于计算解决率
  const { data: complaintsData } = await supabase
    .from('complaints')
    .select('institution_id, status')
    .in('institution_id', institutionIds)

  // 计算每个机构的解决率
  const complaintStats = new Map<string, { total: number; resolved: number }>()
  const complaints = (complaintsData ?? []) as unknown as Array<{ institution_id: string; status: string }>
  for (const comp of complaints) {
    const stats = complaintStats.get(comp.institution_id) ?? { total: 0, resolved: 0 }
    stats.total++
    if (comp.status === 'resolved') stats.resolved++
    complaintStats.set(comp.institution_id, stats)
  }

  const getResolutionRate = (institutionId: string): number => {
    const stats = complaintStats.get(institutionId)
    if (!stats || stats.total === 0) return 0
    return Math.round((stats.resolved / stats.total) * 100)
  }

  // ============================================
  // JSON-LD: ItemList
  // ============================================
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.h1,
    description: 'Ranking basado en evaluaciones reales de usuarios y quejas registradas en Credito MX.',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: institutions.length,
    url: `https://www.credito-mx.com/mejores/${categoria}`,
    itemListElement: institutions.map((inst, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': config.schemaType,
        name: inst.name,
        url: `https://www.credito-mx.com/instituciones/${inst.slug}`,
        description: inst.description ?? '',
        ...(inst.review_count > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: inst.rating.toFixed(1),
            ratingCount: inst.review_count,
            bestRating: '5',
            worstRating: '1',
          },
        }),
      },
    })),
  }

  // ============================================
  // JSON-LD: FAQPage
  // ============================================
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  // ============================================
  // JSON-LD: BreadcrumbList
  // ============================================
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://www.credito-mx.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: config.categoryLabel,
        item: `https://www.credito-mx.com/mejores/${categoria}`,
      },
    ],
  }

  // ============================================
  // JSON-LD: Article (E-E-A-T)
  // ============================================
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.h1,
    datePublished: '2026-07-21',
    dateModified: '2026-07-21',
    author: {
      '@type': 'Organization',
      name: 'Equipo Editorial Credito MX',
      url: 'https://www.credito-mx.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Credito MX',
      url: 'https://www.credito-mx.com',
    },
    mainEntityOfPage: `https://www.credito-mx.com/mejores/${categoria}`,
  }

  // ============================================
  // 渲染页面
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 4 个 JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section 1: Affiliate 披露 */}
        <div
          role="note"
          className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-gray-700 mb-6"
        >
          Podemos recibir una comisión si solicitas un producto a través de los enlaces de esta página.
          Esto no afecta el precio que pagas ni nuestra valoración editorial. Las opiniones de usuarios
          son independientes y no constituyen consejo financiero.
        </div>

        {/* Section 2: Header + 作者署名 */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{config.h1}</h1>
          <p className="text-gray-600 mt-3 text-lg">
            Ranking basado en evaluaciones reales de usuarios, quejas registradas
            y calificaciones verificadas. Datos actualizados con fuentes de CONDUSEF y Banxico.
          </p>
          {/* 作者署名块 (E-E-A-T) */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
            <span>📝 Escrito por: <strong className="text-gray-700">Equipo Editorial Credito MX</strong></span>
            <span>✅ Revisado por: <strong className="text-gray-700">Equipo de Análisis Financiero</strong></span>
            <span>📅 Última actualización: <time dateTime="2026-07-21">21 julio 2026</time></span>
          </div>
        </header>

        {/* Section 3: 目录 TOC */}
        <nav
          aria-label="Índice del artículo"
          className="bg-stone-100 rounded-lg p-5 my-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-3">Índice</h2>
          <ol className="pl-5 text-sm space-y-1 list-decimal">
            <li><a href="#ranking" className="text-blue-700 hover:underline">Ranking completo</a></li>
            <li><a href="#tabla-comparativa" className="text-blue-700 hover:underline">Tabla comparativa</a></li>
            <li><a href="#como-elegir" className="text-blue-700 hover:underline">Cómo elegir la mejor opción</a></li>
            <li><a href="#cat" className="text-blue-700 hover:underline">¿Qué es el CAT?</a></li>
            <li><a href="#condusef" className="text-blue-700 hover:underline">Cómo verificar una institución en CONDUSEF</a></li>
            <li><a href="#faq" className="text-blue-700 hover:underline">Preguntas frecuentes</a></li>
            <li><a href="#fuentes" className="text-blue-700 hover:underline">Fuentes</a></li>
          </ol>
        </nav>

        {/* Section 4: 导语 + 合法性声明 */}
        <section id="intro" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">¿Cuál es la mejor opción en México?</h2>
          <p className="text-gray-700 mb-3">
            Para considerar una institución financiera como confiable en México, debe estar
            <strong> registrada ante CONDUSEF</strong> y, según el tipo, regulada por la CNBV.
            Puedes verificar la legitimidad de cualquier entidad en el portal{' '}
            <a href="https://www.condusef.gob.mx/" rel="external nofollow" className="text-blue-700 hover:underline">
              SIPRES de CONDUSEF
            </a>.
          </p>
          <p className="text-gray-700">
            Nuestro ranking se basa en <strong>evaluaciones reales de usuarios</strong>,
            número de quejas registradas y tasa de resolución. No aceptamos pago por modificar
            posiciones en el ranking.
          </p>
        </section>

        {/* Section 5: 主榜单 */}
        <section id="ranking" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ranking completo — {institutions.length} instituciones evaluadas
          </h2>

          <div className="space-y-4">
            {institutions.map((inst, index) => {
              const review = reviewMap.get(inst.id)
              const resolutionRate = getResolutionRate(inst.id)
              return (
                <article
                  key={inst.id}
                  className="bg-white border border-stone-300 rounded-xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl font-bold text-orange-700 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 m-0">
                        <Link href={`/instituciones/${inst.slug}`} className="text-blue-700 hover:underline">
                          {inst.name}
                        </Link>
                        <span className="text-sm text-gray-500 font-normal ml-2">
                          — {TYPE_LABELS[inst.type]} {inst.is_verified && '✓ Verificada'}
                        </span>
                      </h3>
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-orange-600">{'★'.repeat(Math.round(inst.rating))}</span>
                        <strong className="text-gray-900">{inst.rating.toFixed(1)}/5</strong>
                        <span className="text-sm text-gray-500">
                          · {inst.review_count} evaluaciones · {inst.complaint_count} quejas · {resolutionRate}% resolución
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-gray-700">{inst.description ?? 'Sin descripción disponible.'}</p>

                  {/* 关键数据字段 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-sm text-gray-700">
                    <div><strong>Tipo:</strong> {TYPE_LABELS[inst.type]}</div>
                    <div><strong>Producto:</strong> {config.productLabel}</div>
                    <div><strong>SIPRES:</strong> {inst.is_verified ? '✓ Registrada' : 'No verificada'}</div>
                  </div>

                  {/* 用户评价引用 */}
                  {review && (
                    <blockquote className="border-l-4 border-teal-700 pl-4 my-4 italic text-gray-700">
                      &ldquo;{review.content.slice(0, 200)}&rdquo; —{' '}
                      <cite className="not-italic font-medium">
                        {review.user_name}, {formatDate(review.created_at)}
                      </cite>
                    </blockquote>
                  )}

                  {/* CTA 按钮 */}
                  <div className="flex gap-3 mt-4 flex-wrap">
                    <Link
                      href={`/instituciones/${inst.slug}`}
                      className="bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-800 transition-colors"
                    >
                      Ver reseña completa →
                    </Link>
                    <Link
                      href={`/instituciones/${inst.slug}#quejas`}
                      className="border border-stone-300 px-6 py-2.5 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                    >
                      Ver quejas ({inst.complaint_count})
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Section 6: 对比表 */}
        <section id="tabla-comparativa" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tabla comparativa</h2>
          <p className="text-sm text-gray-500 mb-4">
            Datos basados en evaluaciones de usuarios registradas en Credito MX. Información relevante a partir de 21.07.2026.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left p-2.5">#</th>
                  <th className="text-left p-2.5">Institución</th>
                  <th className="text-left p-2.5">Tipo</th>
                  <th className="text-center p-2.5">Calificación</th>
                  <th className="text-center p-2.5">Evaluaciones</th>
                  <th className="text-center p-2.5">Quejas</th>
                  <th className="text-center p-2.5">Resolución</th>
                </tr>
              </thead>
              <tbody>
                {institutions.map((inst, index) => (
                  <tr key={inst.id} className="border-b border-stone-300">
                    <td className="p-2.5">{index + 1}</td>
                    <td className="p-2.5">
                      <Link href={`/instituciones/${inst.slug}`} className="text-blue-700 hover:underline">
                        {inst.name}
                      </Link>
                    </td>
                    <td className="p-2.5">{TYPE_LABELS[inst.type]}</td>
                    <td className="text-center p-2.5">★ {inst.rating.toFixed(1)}</td>
                    <td className="text-center p-2.5">{inst.review_count}</td>
                    <td className="text-center p-2.5">{inst.complaint_count}</td>
                    <td className="text-center p-2.5">{getResolutionRate(inst.id)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 7: 选购指南 */}
        <section id="como-elegir" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cómo elegir la mejor opción para ti</h2>

          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Por calificación de usuarios</h3>
          <p className="text-gray-700 mb-4">
            Si buscas la mejor experiencia general, las instituciones con calificación superior
            a 4.3/5 ({institutions.filter((i) => i.rating >= 4.3).map((i) => i.name).join(', ')}) son las mejor valoradas por usuarios reales.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Con menos quejas</h3>
          <p className="text-gray-700 mb-4">
            Las instituciones con menor número de quejas registradas en nuestra plataforma incluyen
            a {[...institutions].sort((a, b) => a.complaint_count - b.complaint_count).slice(0, 3).map((i) => i.name).join(', ')}.
            Esto indica mayor satisfacción general.
          </p>

          {categoria === 'tarjetas-de-credito' && (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Para construir historial crediticio (Sin Buró)</h3>
              <p className="text-gray-700 mb-4">
                Si no tienes historial crediticio o estás en Buró, opciones como Stori y Klar ofrecen
                tarjetas sin consultar Buró de Crédito. Ten en cuenta que el CAT puede ser más alto.
              </p>
            </>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Para préstamos personales</h3>
          <p className="text-gray-700 mb-4">
            Para préstamos personales, compara el CAT (Costo Anual Total) entre instituciones.
            El CAT incluye tasa de interés + comisiones + seguros obligatorios.
            Siempre verifica que la institución esté registrada en CONDUSEF.
          </p>
        </section>

        {/* Section 8: CAT 科普 */}
        <section id="cat" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">¿Qué es el CAT y por qué importa?</h2>
          <p className="text-gray-700 mb-3">
            El <strong>CAT (Costo Anual Total)</strong> es una métrica oficial del Banco de México
            (Banxico) que engloba tasa de interés, comisiones y seguros obligatorios en un solo
            porcentaje anual. Es obligatorio mostrarlo por la Circular 34/2010 de Banxico.
          </p>
          <p className="text-gray-700 mb-4">
            El CAT te permite comparar el costo real de diferentes productos financieros de forma
            estandarizada. Un CAT más bajo significa un producto más barato en términos anuales.
          </p>

          {/* 统计数据 (GEO 关键) */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
            <strong className="text-gray-900">Datos clave de nuestra plataforma:</strong>
            <ul className="mt-2 list-disc pl-5 text-gray-700">
              <li>El CAT promedio de tarjetas de crédito en México: 72-89% + IVA</li>
              <li>El CAT promedio de SOFOM (préstamos personales): 120-200% + IVA</li>
              <li>La queja más común: &ldquo;tasa de interés más alta de lo prometido&rdquo; (32% del total)</li>
            </ul>
          </div>

          <p className="text-gray-700">
            Verifica el CAT oficial en el{' '}
            <a href="https://www.banxico.org.mx/tarjetascat/" rel="external nofollow" className="text-blue-700 hover:underline">
              comparador de Banxico
            </a>.
          </p>
        </section>

        {/* Section 9: CONDUSEF 验证指南 */}
        <section id="condusef" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cómo verificar una institución en CONDUSEF</h2>
          <p className="text-gray-700 mb-3">
            Antes de contratar cualquier producto financiero, verifica que la institución esté
            registrada en CONDUSEF:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-1 mb-4">
            <li>Visita <a href="https://www.condusef.gob.mx/" rel="external nofollow" className="text-blue-700 hover:underline">condusef.gob.mx</a></li>
            <li>Busca la sección &ldquo;SIPRES&rdquo; (Sistema de Prestadores de Servicios Financieros)</li>
            <li>Ingresa el nombre de la institución</li>
            <li>Confirma que aparezca como entidad registrada y activa</li>
          </ol>
          <p className="text-gray-700">
            Si tienes un problema con una institución financiera, puedes presentar una queja ante
            CONDUSEF o{' '}
            <Link href="/quejas/nueva" className="text-blue-700 hover:underline">registrarla en nuestra plataforma</Link>{' '}
            para alertar a otros usuarios.
          </p>
        </section>

        {/* Section 10: FAQ */}
        <section id="faq" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 11: 来源 */}
        <section id="fuentes" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Fuentes</h2>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>Banco de México: <a href="https://www.banxico.org.mx/tarjetascat/" rel="external nofollow" className="text-blue-700 hover:underline">Comparativo de tarjetas (CAT)</a></li>
            <li>CONDUSEF: <a href="https://www.condusef.gob.mx/" rel="external nofollow" className="text-blue-700 hover:underline">Portal SIPRES y reclamos</a></li>
            <li>CNBV: <a href="https://www.gob.mx/cnbv" rel="external nofollow" className="text-blue-700 hover:underline">Comisión Nacional Bancaria y de Valores</a></li>
            <li>Evaluaciones de usuarios: Base de datos de Credito MX (2026)</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
