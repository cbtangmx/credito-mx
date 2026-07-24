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
import InstitutionTracker from '@/components/InstitutionTracker'
import TrackedButtons from '@/components/TrackedButtons'

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
// Palabras vacías (stopwords) en español, normalizadas sin acentos,
// utilizadas para la extracción de palabras clave en pros/contras.
// ============================================
const STOPWORDS = new Set<string>([
  'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'se', 'del', 'las', 'por',
  'con', 'para', 'su', 'una', 'no', 'lo', 'muy', 'mas', 'pero', 'como', 'todo',
  'ya', 'este', 'si', 'tambien', 'fue', 'son', 'mis', 'cuando', 'donde', 'sin',
  'sobre', 'entre', 'despues', 'antes', 'siempre', 'nunca', 'algo', 'esa', 'ese',
  'esos', 'esas', 'esto', 'esta', 'estos', 'estas', 'unos', 'unas', 'algunos',
  'tan', 'poco', 'mucho', 'bastante', 'demasiado', 'todavia', 'aun', 'ser',
  'estar', 'tener', 'hacer', 'poder', 'decir', 'ver', 'dar', 'saber', 'querer',
  'llegar', 'pasar', 'deber', 'poner', 'parecer', 'dejar', 'seguir', 'encontrar',
  'llamar', 'venir', 'pensar', 'salir', 'conocer', 'quedar', 'creer', 'hablar',
  'entender', 'pedir', 'sentir', 'comprar', 'pagar', 'usar', 'dinero', 'banco',
  'credito', 'institucion', 'queja', 'quejas', 'evaluacion', 'resena', 'opinion',
  'usuario', 'usuarios', 'mio', 'mia', 'tuyo', 'tuya', 'suyo', 'suya', 'nuestro',
  'nuestra', 'eso', 'aquello', 'mi', 'tu', 'sus', 'nosotros', 'vosotros', 'ellos',
  'ellas', 'usted', 'ustedes', 'yo', 'ella', 'nosotras', 'vosotras', 'porque',
  'pues', 'sino', 'aunque', 'tampoco', 'casi', 'apenas', 'quizas', 'talvez',
  'vez', 'hay', 'haber', 'han', 'he', 'has', 'hemos', 'sera', 'seran', 'era',
  'eran', 'fueron', 'estan', 'estoy', 'estamos', 'tanto', 'tanta', 'tantos',
  'tantas', 'toda', 'todas', 'otro', 'otra', 'otros', 'otras', 'mismo', 'misma',
  'mismos', 'mismas', 'ahora', 'hoy', 'ayer', 'manana', 'gracias', 'mientras',
  'durante', 'mediante', 'tras', 'desde', 'hasta', 'hacia', 'contra', 'bajo',
  'esta', 'este', 'ese', 'esa', 'un', 'unos', 'al', 'sus'
])

// ============================================
// Normaliza una palabra: minúsculas y sin acentos.
// ============================================
function normalizeWord(w: string): string {
  return w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// ============================================
// Extrae palabras clave frecuentes de un conjunto de textos.
// - Ignora stopwords y los tokens del nombre de la institución.
// - Devuelve hasta `maxCount` términos ordenados por frecuencia.
// ============================================
function extractKeywords(
  texts: string[],
  excludeTokens: string[],
  maxCount: number
): string[] {
  const excludeSet = new Set(excludeTokens.map(normalizeWord))
  const freq = new Map<string, number>()

  for (const text of texts) {
    const words = text
      .toLowerCase()
      .replace(/[^a-záéíóúñü0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 4 &&
          !STOPWORDS.has(normalizeWord(w)) &&
          !excludeSet.has(normalizeWord(w))
      )

    for (const w of words) {
      freq.set(w, (freq.get(w) ?? 0) + 1)
    }
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxCount)
    .map(([w]) => w)
}

// ============================================
// Pone en mayúscula la primera letra de una palabra.
// ============================================
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
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

  // ============================================
  // 产品与服务推断（从 description）
  // ============================================
  const descLower = (institution.description ?? '').toLowerCase()

  const products: { name: string; description: string }[] = []
  if (descLower.includes('tarjeta')) {
    products.push({
      name: 'Tarjeta de crédito',
      description: 'Tarjeta de crédito emitida por la institución.',
    })
  }
  if (descLower.includes('préstamo') || descLower.includes('prestamo')) {
    products.push({
      name: 'Préstamos personales',
      description: 'Préstamos personales para diversos fines.',
    })
  }
  if (products.length === 0) {
    products.push({
      name: 'Servicios financieros',
      description: 'Productos y servicios financieros ofrecidos por la institución.',
    })
  }

  const sinBuro =
    descLower.includes('sin buró') ||
    descLower.includes('sin consultar buró') ||
    descLower.includes('sin buro')
  const requisitoBuro = sinBuro ? 'No' : 'No disponible'

  const procesoDigital =
    institution.type === 'fintech'
      ? 'Sí'
      : institution.type === 'bank'
        ? 'Parcial'
        : 'No disponible'

  // ============================================
  // Pros y contras (extracción desde reseñas y quejas reales)
  // - Pros: términos frecuentes en evaluaciones de 4-5 estrellas
  // - Contras: términos frecuentes en evaluaciones de 1-2 estrellas y quejas
  // ============================================
  const institutionNameTokens = institution.name
    .toLowerCase()
    .replace(/[^a-záéíóúñü0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)

  const positiveTexts = reviews
    .filter((r) => r.rating >= 4)
    .map((r) => `${r.title ?? ''} ${r.content}`)

  const negativeTexts = [
    ...reviews
      .filter((r) => r.rating <= 2)
      .map((r) => `${r.title ?? ''} ${r.content}`),
    ...complaints.map((c) => `${c.title} ${c.content}`),
  ]

  const pros = extractKeywords(positiveTexts, institutionNameTokens, 3)
  const contras = extractKeywords(negativeTexts, institutionNameTokens, 3)

  // ============================================
  // Tasa de resolución de quejas (complaints con status === 'resolved')
  // ============================================
  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'resolved'
  ).length
  const resolutionRate =
    complaints.length > 0
      ? Math.round((resolvedComplaints / complaints.length) * 100)
      : 0

  // ============================================
  // Preguntas frecuentes (FAQ)
  // ============================================
  const faqs: { question: string; answer: string }[] = [
    {
      question: `¿${institution.name} es una institución confiable?`,
      answer:
        institution.rating >= 4
          ? `Sí, ${institution.name} cuenta con una calificación promedio de ${institution.rating.toFixed(1)}/5 basada en ${institution.review_count.toLocaleString('es-MX')} evaluaciones de usuarios en Credito MX, lo que indica un buen nivel de confianza según las opiniones registradas.`
          : institution.rating >= 3
            ? `${institution.name} tiene una calificación promedio de ${institution.rating.toFixed(1)}/5 basada en ${institution.review_count.toLocaleString('es-MX')} evaluaciones, lo que refleja un nivel de confianza moderado. Te recomendamos revisar las opiniones y quejas antes de tomar una decisión.`
            : `${institution.name} tiene una calificación promedio de ${institution.rating.toFixed(1)}/5 basada en ${institution.review_count.toLocaleString('es-MX')} evaluaciones, lo que sugiere un nivel de confianza bajo. Analiza con detalle las quejas y evaluaciones antes de contratar.`,
    },
    {
      question: `¿${institution.name} consulta Buró de Crédito?`,
      answer: sinBuro
        ? `Según la información disponible, ${institution.name} no consulta Buró de Crédito, por lo que puede ser una opción para personas con historial crediticio limitado. Te recomendamos confirmar este punto directamente con la institución.`
        : `No contamos con información que indique que ${institution.name} opera sin consultar Buró de Crédito. Te recomendamos confirmar este requisito directamente con la institución antes de aplicar.`,
    },
    {
      question: `¿Qué tipo de institución es ${institution.name}?`,
      answer: `${institution.name} está registrada en Credito MX como una institución de tipo ${TYPE_LABELS[institution.type]}.`,
    },
    {
      question: `¿Cómo presento una queja contra ${institution.name}?`,
      answer: `Puedes presentar una queja contra ${institution.name} directamente en nuestro formulario de quejas en Credito MX, o acudir a CONDUSEF si requieres la intervención de la autoridad financiera.`,
    },
    {
      question: `¿${institution.name} tiene CAT?`,
      answer: `El Costo Anual Total (CAT) es un indicador estandarizado e informativo del costo total de financiamiento, expresado en términos porcentuales anuales. El CAT aplicable depende del producto y sus condiciones específicas; consulta la información oficial del producto o el portal del Banco de México (Banxico).`,
    },
  ]

  // ============================================
  // JSON-LD: FAQPage Schema
  // ============================================
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  // ============================================
  // JSON-LD: BreadcrumbList Schema
  // ============================================
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://credito-mx.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Instituciones',
        item: 'https://credito-mx.com/instituciones',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: institution.name,
        item: `https://credito-mx.com/instituciones/${slug}`,
      },
    ],
  }

  // ============================================
  // JSON-LD: Article Schema
  // ============================================
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${institution.name} - Evaluaciones, Quejas y Calificación`,
    datePublished: institution.created_at,
    dateModified: institution.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Equipo Editorial Credito MX',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Credito MX',
      logo: {
        '@type': 'ImageObject',
        url: 'https://credito-mx.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://credito-mx.com/instituciones/${slug}`,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================ */}
      {/* 面包屑导航 - 页面最顶部第一个元素 */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav aria-label="Navegación" className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">Inicio</Link> {' > '}
          <Link href="/instituciones" className="hover:underline">Instituciones</Link> {' > '}
          <span>{institution.name}</span>
        </nav>
      </div>

      {/* GA4 事件跟踪：机构页浏览 */}
      <InstitutionTracker
        institutionSlug={slug}
        institutionName={institution.name}
        institutionType={institution.type}
        rating={institution.rating}
      />
      {/* SEO: Structured Data - Organization + AggregateRating */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(institutionSchema),
        }}
      />
      {/* SEO: Structured Data - FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      {/* SEO: Structured Data - BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* SEO: Structured Data - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* ============================================ */}
      {/* 机构头部 - 返回链接 + 类型标签 + 评分 + 操作按钮 + 作者署名 */}
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
              {/* 作者署名块 */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                <span>📝 Escrito por: <strong className="text-gray-700">Equipo Editorial Credito MX</strong></span>
                <span>✅ Revisado por: <strong className="text-gray-700">Equipo de Análisis Financiero</strong></span>
                <span>📅 Última actualización: <time dateTime="2026-07-24">24 julio 2026</time></span>
              </div>
            </div>
            {/* 操作按钮 - 带 GA4 事件跟踪 */}
            <TrackedButtons
              institutionSlug={slug}
              institutionName={institution.name}
              websiteUrl={institution.website_url}
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 主体内容 - 两列布局 */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================ */}
        {/* 目录 TOC - header 之后、主内容之前 */}
        {/* ============================================ */}
        <nav aria-label="Índice del artículo" className="bg-stone-100 rounded-lg p-5 my-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Índice</h2>
          <ol className="pl-5 text-sm space-y-1 list-decimal">
            <li><a href="#acerca" className="text-blue-700 hover:underline">Acerca de {institution.name}</a></li>
            <li><a href="#productos" className="text-blue-700 hover:underline">Productos y servicios</a></li>
            <li><a href="#calificacion" className="text-blue-700 hover:underline">Calificación de usuarios</a></li>
            <li><a href="#pros-contras" className="text-blue-700 hover:underline">Pros y contras</a></li>
            <li><a href="#evaluaciones" className="text-blue-700 hover:underline">Evaluaciones de usuarios</a></li>
            <li><a href="#quejas" className="text-blue-700 hover:underline">Quejas registradas</a></li>
            <li><a href="#condusef" className="text-blue-700 hover:underline">Verificación CONDUSEF</a></li>
            <li><a href="#faq" className="text-blue-700 hover:underline">Preguntas frecuentes</a></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ============================================ */}
          {/* 左侧主内容区 (占 2/3) */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 机构描述 */}
            <div id="acerca" className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Acerca de {institution.name}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {institution.description ?? 'No hay descripción disponible para esta institución.'}
              </p>
            </div>

            {/* 产品与服务 section */}
            <section id="productos" className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Productos y servicios
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Producto</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Descripción</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Requisito Buró</th>
                      <th className="text-left px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">Proceso digital</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.name} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3 text-gray-900 font-medium">{product.name}</td>
                        <td className="px-4 py-3 text-gray-700">{product.description}</td>
                        <td className="px-4 py-3 text-gray-700">{requisitoBuro}</td>
                        <td className="px-4 py-3 text-gray-700">{procesoDigital}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                El Costo Anual Total (CAT) es un indicador estandarizado e informativo del costo total de financiamiento, expresado en términos porcentuales anuales. El CAT aplicable depende del producto y sus condiciones; consulta la información oficial del producto o el portal del Banco de México (Banxico).{' '}
                <a
                  href="https://www.banxico.org.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  Consultar información sobre CAT en Banxico ↗
                </a>
              </p>
            </section>

            {/* 统计卡片 - 3 个指标 */}
            <div id="calificacion" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {/* 优缺点 section */}
            <section id="pros-contras" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pros */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-semibold text-green-900 mb-3">Pros</h3>
                {pros.length === 0 ? (
                  <p className="text-sm text-green-800 italic">
                    Aún no hay suficientes evaluaciones positivas para destacar ventajas.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {pros.map((pro) => (
                      <li key={pro} className="text-sm text-green-900 flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{capitalize(pro)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Contras */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-semibold text-red-900 mb-3">Contras</h3>
                {contras.length === 0 ? (
                  <p className="text-sm text-red-800 italic">
                    Aún no hay suficientes evaluaciones negativas o quejas para destacar desventajas.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {contras.map((contra) => (
                      <li key={contra} className="text-sm text-red-900 flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>{capitalize(contra)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {/* 评价列表 */}
            <div id="evaluaciones" className="bg-white rounded-xl p-6 border border-gray-200">
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
            <div id="quejas" className="bg-white rounded-xl p-6 border border-gray-200">
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

            {/* CONDUSEF 验证 section */}
            <section id="condusef" className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Verificación CONDUSEF
              </h2>

              <div className="mb-4 flex flex-wrap gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${institution.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {institution.is_verified
                    ? `✓ ${institution.name} está registrada`
                    : 'Pendiente de verificación'}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-4">
                {institution.is_verified
                  ? `${institution.name} figura como institución registrada. Puedes verificar su estatus directamente en el portal de CONDUSEF.`
                  : `No contamos con confirmación de registro de ${institution.name} en CONDUSEF. Te recomendamos verificar su estatus antes de contratar.`}
              </p>

              <div className="bg-stone-50 rounded-lg p-4 mb-4">
                {complaints.length > 0 ? (
                  <p className="text-sm text-gray-700">
                    <strong>Tasa de resolución de quejas (Credito MX):</strong> {resolutionRate}% ({resolvedComplaints} de {complaints.length} quejas registradas recientemente en Credito MX).
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    <strong>Tasa de resolución de quejas (Credito MX):</strong> No hay quejas registradas en Credito MX para calcular la tasa de resolución.
                  </p>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                Pasos para verificar la institución en CONDUSEF:
              </h3>
              <ol className="list-decimal pl-6 text-sm text-gray-700 space-y-1 mb-4">
                <li>Ingresa al portal oficial de CONDUSEF (www.condusef.gob.mx).</li>
                <li>Selecciona la opción de consulta de instituciones (SIPRES).</li>
                <li>Busca el nombre de {institution.name}.</li>
                <li>Revisa su estatus de registro y vigencia.</li>
                <li>Consulta las alertas o sanciones registradas, si las hubiera.</li>
              </ol>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/quejas/nueva?institution=${slug}`}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                >
                  Presentar una queja contra {institution.name}
                </Link>
                <a
                  href="https://www.condusef.gob.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Consultar CONDUSEF ↗
                </a>
              </div>
            </section>

            {/* FAQ section */}
            <section id="faq" className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Preguntas frecuentes
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 text-sm">{faq.answer}</p>
                    {faq.question.includes('Cómo presento una queja') && (
                      <Link
                        href={`/quejas/nueva?institution=${slug}`}
                        className="inline-block mt-2 text-sm text-blue-700 hover:underline"
                      >
                        Presentar queja contra {institution.name} →
                      </Link>
                    )}
                    {faq.question.includes('tiene CAT') && (
                      <a
                        href="https://www.banxico.org.mx/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm text-blue-700 hover:underline"
                      >
                        Consultar información sobre CAT en Banxico ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 来源 section */}
            <section id="fuentes" className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Fuentes
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.condusef.gob.mx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    CONDUSEF - SIPRES (Sistema de consulta de instituciones financieras) ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.banxico.org.mx/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Banco de México (Banxico) - Costo Anual Total (CAT) ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.gob.mx/cnbv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:underline"
                  >
                    Comisión Nacional Bancaria y de Valores (CNBV) ↗
                  </a>
                </li>
                <li>
                  <Link href="/instituciones" className="text-blue-700 hover:underline">
                    Base de datos de instituciones de Credito MX
                  </Link>
                </li>
              </ul>
            </section>
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
