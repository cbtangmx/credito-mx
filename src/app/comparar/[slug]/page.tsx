// ============================================
// 机构对比页 - T09 SEO 优化
// 10 个对比页面：stori-vs-klar, nu-bank-vs-stori, ...
// 9 个 Section + 4 个 JSON-LD Schema
// 数据来源: Supabase (institutions / reviews / complaints)
// ============================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-client'
import { DEFAULT_OG_IMAGE, BASE_URL } from '@/lib/seo'
import {
  Institution,
  Review,
  Complaint,
  TYPE_LABELS,
  CATEGORY_LABELS,
  STATUS_LABELS,
} from '@/types/database'

// ============================================
// 10 个对比配置
// ============================================
type ComparisonConfig = {
  slug: string
  slugA: string
  slugB: string
  h1: string
  subtitle: string
  keyword: string
}

const COMPARISONS: ComparisonConfig[] = [
  { slug: 'stori-vs-klar', slugA: 'stori', slugB: 'klar', h1: 'Stori vs Klar: ¿Cuál es mejor tarjeta sin Buró?', subtitle: 'Comparativa de tarjetas sin Buró de Crédito', keyword: 'stori vs klar' },
  { slug: 'nu-bank-vs-stori', slugA: 'nu-bank', slugB: 'stori', h1: 'Nu Bank vs Stori: Comparativa de Tarjetas Digitales', subtitle: 'Banco digital vs tarjeta de crédito digital', keyword: 'nu bank vs stori' },
  { slug: 'mercado-pago-vs-nu-bank', slugA: 'mercado-pago', slugB: 'nu-bank', h1: 'Mercado Pago vs Nu Bank: ¿Qué Cuenta Digital Conviene?', subtitle: 'Billetera digital vs banco digital', keyword: 'mercado pago vs nu bank' },
  { slug: 'kueski-vs-baubap', slugA: 'kueski', slugB: 'baubap', h1: 'Kueski vs Baubap: Préstamos en Línea Comparados', subtitle: 'Préstamos personales en línea', keyword: 'kueski vs baubap' },
  { slug: 'konfio-vs-minu', slugA: 'konfio', slugB: 'minu', h1: 'Konfío vs Minu: Crédito para Negocios y Personas', subtitle: 'Crédito para negocios vs crédito personal', keyword: 'konfio vs minu' },
  { slug: 'citibanamex-vs-bbva-mexico', slugA: 'citibanamex', slugB: 'bbva-mexico', h1: 'Citibanamex vs BBVA México: ¿Qué Banco es Mejor?', subtitle: 'Comparativa de los dos bancos más grandes de México', keyword: 'citibanamex vs bbva' },
  { slug: 'hey-banco-vs-banorte', slugA: 'hey-banco', slugB: 'banorte', h1: 'Hey Banco vs Banorte: Banco Digital vs Tradicional', subtitle: 'Banco digital vs banco tradicional', keyword: 'hey banco vs banorte' },
  { slug: 'banco-azteca-vs-bancoppel', slugA: 'banco-azteca', slugB: 'bancoppel', h1: 'Banco Azteca vs Bancoppel: Crédito al Consumo', subtitle: 'Bancos de crédito al consumo', keyword: 'banco azteca vs bancoppel' },
  { slug: 'stori-vs-mercado-pago', slugA: 'stori', slugB: 'mercado-pago', h1: 'Stori vs Mercado Pago: Tarjeta vs Billetera Digital', subtitle: 'Tarjeta de crédito vs billetera digital', keyword: 'stori vs mercado pago' },
  { slug: 'nu-bank-vs-mercado-pago', slugA: 'nu-bank', slugB: 'mercado-pago', h1: 'Nu Bank vs Mercado Pago: ¿Dónde Abrir tu Cuenta?', subtitle: 'Banco digital vs billetera digital', keyword: 'nu bank vs mercado pago' },
]

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
  'un', 'al'
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
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1))
}

// ============================================
// Formatea una fecha en formato es-MX.
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
// Pone en mayúscula la primera letra de una palabra.
// ============================================
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

// ============================================
// Genera estrellas visuales para una calificación.
// ============================================
function starString(rating: number): string {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}

// ============================================
// Inferir el producto principal a partir de la descripción.
// ============================================
function inferMainProduct(description: string | null | undefined): string {
  const desc = (description ?? '').toLowerCase()
  if (desc.includes('tarjeta')) return 'Tarjeta de crédito'
  if (desc.includes('préstamo') || desc.includes('prestamo')) return 'Préstamos personales'
  if (desc.includes('cuenta') || desc.includes('billetera')) return 'Cuenta digital'
  if (desc.includes('crédito') || desc.includes('credito')) return 'Crédito'
  return 'Servicios financieros'
}

// ============================================
// Estructura de estadísticas calculadas por institución.
// ============================================
type InstitutionStats = {
  institution: Institution
  reviews: Review[]
  complaints: Complaint[]
  resolutionRate: number
  resolvedCount: number
  pros: string[]
  contras: string[]
  requisitoBuro: string
  procesoDigital: string
  condusefLabel: string
  mainProduct: string
  catLabel: string
}

// ============================================
// Calcula todas las estadísticas para una institución.
// ============================================
function computeStats(
  institution: Institution,
  reviews: Review[],
  complaints: Complaint[]
): InstitutionStats {
  // Tasa de resolución de quejas
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length
  const resolutionRate =
    complaints.length > 0
      ? Math.round((resolvedCount / complaints.length) * 100)
      : 0

  // Tokens del nombre de la institución (para excluir de keywords)
  const nameTokens = institution.name
    .toLowerCase()
    .replace(/[^a-záéíóúñü0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)

  // Pros: términos frecuentes en evaluaciones de 4-5 estrellas
  const positiveTexts = reviews
    .filter((r) => r.rating >= 4)
    .map((r) => `${r.title ?? ''} ${r.content}`)
  const pros = extractKeywords(positiveTexts, nameTokens, 3)

  // Contras: términos frecuentes en evaluaciones de 1-2 estrellas y quejas
  const negativeTexts = [
    ...reviews
      .filter((r) => r.rating <= 2)
      .map((r) => `${r.title ?? ''} ${r.content}`),
    ...complaints.map((c) => `${c.title} ${c.content}`),
  ]
  const contras = extractKeywords(negativeTexts, nameTokens, 3)

  // Requisito Buró
  const descLower = (institution.description ?? '').toLowerCase()
  const sinBuro =
    descLower.includes('sin buró') ||
    descLower.includes('sin consultar buró') ||
    descLower.includes('sin buro')
  const requisitoBuro = sinBuro ? 'No consulta Buró' : 'No disponible'

  // Proceso digital
  const procesoDigital =
    institution.type === 'fintech'
      ? 'Sí'
      : institution.type === 'bank'
        ? 'Parcial'
        : 'No disponible'

  // CONDUSEF
  const condusefLabel = institution.is_verified
    ? '✓ Verificada'
    : 'Pendiente de verificación'

  // Producto principal
  const mainProduct = inferMainProduct(institution.description)

  // CAT (no hay campo CAT en la base de datos)
  const catLabel = 'No disponible'

  return {
    institution,
    reviews,
    complaints,
    resolutionRate,
    resolvedCount,
    pros,
    contras,
    requisitoBuro,
    procesoDigital,
    condusefLabel,
    mainProduct,
    catLabel,
  }
}

// ============================================
// generateStaticParams - 预生成 10 个对比页面
// ============================================
export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }))
}

// ============================================
// generateMetadata - SEO 元数据
// ============================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = COMPARISONS.find((c) => c.slug === slug)
  if (!config) {
    return { title: 'Comparativa no encontrada' }
  }

  // Obtener ambas instituciones para generar meta description con calificaciones
  const supabase = createClient()
  const { data: instA } = await supabase
    .from('institutions')
    .select('name, rating, review_count')
    .eq('slug', config.slugA)
    .single()
  const { data: instB } = await supabase
    .from('institutions')
    .select('name, rating, review_count')
    .eq('slug', config.slugB)
    .single()

  const instATyped = instA as Pick<Institution, 'name' | 'rating' | 'review_count'> | null
  const instBTyped = instB as Pick<Institution, 'name' | 'rating' | 'review_count'> | null

  const nameA = instATyped?.name ?? config.slugA
  const nameB = instBTyped?.name ?? config.slugB
  const ratingA = instATyped?.rating?.toFixed(1) ?? 'N/A'
  const ratingB = instBTyped?.rating?.toFixed(1) ?? 'N/A'

  const title = `${nameA} vs ${nameB}: ¿Cuál es Mejor? | Credito MX`
  const description = `Comparamos ${nameA} vs ${nameB}: calificaciones, quejas, requisitos y CAT. ${ratingA}/5 vs ${ratingB}/5. Opiniones reales de usuarios en México.`

  return {
    title,
    description,
    alternates: { canonical: `/comparar/${slug}` },
    openGraph: {
      title: `${nameA} vs ${nameB}: ¿Cuál es Mejor?`,
      description: 'Comparativa basada en evaluaciones reales de usuarios y quejas registradas.',
      type: 'article',
      locale: 'es_MX',
      url: `${BASE_URL}/comparar/${slug}`,
      siteName: 'Credito MX',
      images: [{
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${nameA} vs ${nameB} — Comparativa en Credito MX`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${nameA} vs ${nameB}: ¿Cuál es Mejor?`,
      description: 'Comparativa basada en evaluaciones reales de usuarios y quejas registradas.',
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

// ============================================
// 页面 props 类型
// ============================================
type Props = {
  params: Promise<{ slug: string }>
}

// ============================================
// 对比页主组件
// ============================================
export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params
  const config = COMPARISONS.find((c) => c.slug === slug)

  // 对比配置不存在时显示 404 页面
  if (!config) {
    // 兜底解析 slug: 分割 "-vs-"
    const parts = slug.split('-vs-')
    if (parts.length !== 2) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Comparativa no encontrada
            </h1>
            <p className="text-gray-600 mb-6">
              La comparativa que buscas no existe o ha sido eliminada.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      )
    }
  }

  const slugA = config!.slugA
  const slugB = config!.slugB

  // ============================================
  // 数据获取
  // ============================================
  const supabase = createClient()

  // 1. 获取两个机构
  const [
    { data: instAData, error: instAError },
    { data: instBData, error: instBError },
  ] = await Promise.all([
    supabase.from('institutions').select('*').eq('slug', slugA).single(),
    supabase.from('institutions').select('*').eq('slug', slugB).single(),
  ])

  const instA = instAData as Institution | null
  const instB = instBData as Institution | null

  // 任一机构不存在时显示 404 页面
  if (!instA || instAError || !instB || instBError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Institución no encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            Una o ambas instituciones de esta comparativa no están disponibles.
          </p>
          <Link
            href="/instituciones"
            className="inline-block px-6 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            ← Ver instituciones
          </Link>
        </div>
      </div>
    )
  }

  // 2. 获取两个机构的评价 (最多 10 条已审核)
  const [
    { data: reviewsAData },
    { data: reviewsBData },
  ] = await Promise.all([
    supabase
      .from('reviews')
      .select('*')
      .eq('institution_id', instA.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('reviews')
      .select('*')
      .eq('institution_id', instB.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const reviewsA = (reviewsAData as Review[] | null) ?? []
  const reviewsB = (reviewsBData as Review[] | null) ?? []

  // 3. 获取两个机构的投诉 (最多 10 条公开)
  const [
    { data: complaintsAData },
    { data: complaintsBData },
  ] = await Promise.all([
    supabase
      .from('complaints')
      .select('*')
      .eq('institution_id', instA.id)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('complaints')
      .select('*')
      .eq('institution_id', instB.id)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const complaintsA = (complaintsAData as Complaint[] | null) ?? []
  const complaintsB = (complaintsBData as Complaint[] | null) ?? []

  // ============================================
  // 计算统计
  // ============================================
  const statsA = computeStats(instA, reviewsA, complaintsA)
  const statsB = computeStats(instB, reviewsB, complaintsB)

  const nameA = instA.name
  const nameB = instB.name
  const comparisonTitle = `${nameA} vs ${nameB}`

  // ============================================
  // FAQ 数据 (5 条, 基于真实数据)
  // ============================================
  const betterName = instA.rating >= instB.rating ? nameA : nameB
  const faqs: { question: string; answer: string }[] = [
    {
      question: `¿Cuál es mejor: ${nameA} o ${nameB}?`,
      answer:
        instA.rating !== instB.rating
          ? `Según las evaluaciones de usuarios en Credito MX, ${betterName} tiene una calificación más alta (${(instA.rating >= instB.rating ? instA.rating : instB.rating).toFixed(1)}/5 vs ${(instA.rating < instB.rating ? instA.rating : instB.rating).toFixed(1)}/5). Sin embargo, la mejor opción depende de tus necesidades: revisa las quejas, el proceso digital y el requisito de Buró antes de decidir.`
          : `${nameA} y ${nameB} tienen la misma calificación promedio (${instA.rating.toFixed(1)}/5). Te recomendamos comparar el número de quejas, la tasa de resolución y el tipo de producto que necesitas antes de elegir.`,
    },
    {
      question: `¿${nameA} consulta Buró de Crédito?`,
      answer:
        statsA.requisitoBuro === 'No consulta Buró'
          ? `Según la información disponible, ${nameA} no consulta Buró de Crédito, por lo que puede ser una opción para personas con historial crediticio limitado. Te recomendamos confirmar este punto directamente con la institución.`
          : `No contamos con información que indique que ${nameA} opera sin consultar Buró de Crédito. Te recomendamos confirmar este requisito directamente con la institución antes de aplicar.`,
    },
    {
      question: `¿${nameB} consulta Buró de Crédito?`,
      answer:
        statsB.requisitoBuro === 'No consulta Buró'
          ? `Según la información disponible, ${nameB} no consulta Buró de Crédito, por lo que puede ser una opción para personas con historial crediticio limitado. Te recomendamos confirmar este punto directamente con la institución.`
          : `No contamos con información que indique que ${nameB} opera sin consultar Buró de Crédito. Te recomendamos confirmar este requisito directamente con la institución antes de aplicar.`,
    },
    {
      question: `¿Cómo presento una queja contra ${nameA} o ${nameB}?`,
      answer: `Puedes presentar una queja contra ${nameA} o ${nameB} directamente en nuestro formulario de quejas en Credito MX, o acudir a CONDUSEF si requieres la intervención de la autoridad financiera. Registra tu experiencia para alertar a otros usuarios.`,
    },
    {
      question: `¿${nameA} y ${nameB} están registradas en CONDUSEF?`,
      answer: `${nameA} ${instA.is_verified ? 'está verificada como institución registrada' : 'figura como pendiente de verificación'} en nuestra plataforma, y ${nameB} ${instB.is_verified ? 'está verificada como institución registrada' : 'figura como pendiente de verificación'}. Te recomendamos confirmar el estatus de ambas directamente en el portal SIPRES de CONDUSEF antes de contratar.`,
    },
  ]

  // ============================================
  // JSON-LD: Article Schema
  // ============================================
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config!.h1,
    description: config!.subtitle,
    datePublished: '2026-07-24',
    dateModified: '2026-07-24',
    author: {
      '@type': 'Organization',
      name: 'Equipo Editorial Credito MX',
      url: 'https://www.credito-mx.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Credito MX',
      url: 'https://www.credito-mx.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.credito-mx.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.credito-mx.com/comparar/${config!.slug}`,
    },
    about: [
      {
        '@type': 'FinancialService',
        name: nameA,
        url: `https://www.credito-mx.com/instituciones/${slugA}`,
      },
      {
        '@type': 'FinancialService',
        name: nameB,
        url: `https://www.credito-mx.com/instituciones/${slugB}`,
      },
    ],
  }

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
        item: 'https://www.credito-mx.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Comparativas',
        item: 'https://www.credito-mx.com/comparar',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${nameA} vs ${nameB}`,
        item: `https://www.credito-mx.com/comparar/${config!.slug}`,
      },
    ],
  }

  // ============================================
  // JSON-LD: ItemList Schema (2 FinancialService items con aggregateRating)
  // ============================================
  const buildFinancialService = (stats: InstitutionStats, slug: string) => {
    const inst = stats.institution
    return {
      '@type': 'FinancialService',
      name: inst.name,
      url: `https://www.credito-mx.com/instituciones/${slug}`,
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
    }
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${nameA} vs ${nameB}`,
    numberOfItems: 2,
    url: `https://www.credito-mx.com/comparar/${config!.slug}`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: buildFinancialService(statsA, slugA),
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: buildFinancialService(statsB, slugB),
      },
    ],
  }

  // ============================================
  // 频繁的投诉类别 (común)
  // ============================================
  const allComplaints = [...complaintsA, ...complaintsB]
  const categoryCount = new Map<string, number>()
  for (const c of allComplaints) {
    categoryCount.set(c.category, (categoryCount.get(c.category) ?? 0) + 1)
  }
  const commonCategories = [...categoryCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS])
    .filter(Boolean)

  // ============================================
  // 渲染页面
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 4 个 JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ============================================ */}
        {/* Section 1: Affiliate 披露 */}
        {/* ============================================ */}
        <div
          role="note"
          className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-gray-700 mb-6"
        >
          Podemos recibir una comisión si solicitas un producto a través de los enlaces de esta
          página. Esto no afecta el precio que pagas ni nuestra valoración editorial. Las
          comparaciones se basan en evaluaciones reales de usuarios y datos públicos.
        </div>

        {/* ============================================ */}
        {/* Section 2: Header + Breadcrumb + 作者署名 */}
        {/* ============================================ */}
        <header className="mb-6">
          {/* 面包屑导航 */}
          <nav aria-label="Navegación" className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:underline">Inicio</Link> {' > '}
            <Link href="/comparar" className="hover:underline">Comparativas</Link> {' > '}
            <span>{comparisonTitle}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{config!.h1}</h1>
          <p className="text-gray-600 mt-3 text-lg">{config!.subtitle}</p>

          {/* 作者署名块 (E-E-A-T) */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
            <span>📝 Escrito por: <strong className="text-gray-700">Equipo Editorial Credito MX</strong></span>
            <span>✅ Revisado por: <strong className="text-gray-700">Equipo de Análisis Financiero</strong></span>
            <span>📅 Última actualización: <time dateTime="2026-07-24">24 julio 2026</time></span>
          </div>
        </header>

        {/* ============================================ */}
        {/* Section 3: 目录 TOC */}
        {/* ============================================ */}
        <nav
          aria-label="Índice del artículo"
          className="bg-[#F5F1EA] rounded-lg p-5 my-6"
        >
          <h2 className="text-base font-semibold text-gray-900 mb-3">Índice</h2>
          <ol className="pl-5 text-sm space-y-1 list-decimal">
            <li><a href="#resumen" className="text-blue-700 hover:underline">Resumen ejecutivo</a></li>
            <li><a href="#comparativa" className="text-blue-700 hover:underline">Tabla comparativa</a></li>
            <li><a href="#calificaciones" className="text-blue-700 hover:underline">Calificaciones de usuarios</a></li>
            <li><a href="#pros-contras" className="text-blue-700 hover:underline">Pros y contras</a></li>
            <li><a href="#quejas" className="text-blue-700 hover:underline">Quejas registradas</a></li>
            <li><a href="#veredicto" className="text-blue-700 hover:underline">Veredicto</a></li>
            <li><a href="#faq" className="text-blue-700 hover:underline">Preguntas frecuentes</a></li>
          </ol>
        </nav>

        {/* ============================================ */}
        {/* Section 4: Resumen ejecutivo (id="resumen") */}
        {/* ============================================ */}
        <section id="resumen" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Resumen ejecutivo</h2>
          <p className="text-gray-700 mb-4">
            En esta comparativa analizamos <strong>{nameA}</strong> y <strong>{nameB}</strong> con
            base en evaluaciones reales de usuarios, quejas registradas y datos públicos de cada
            institución en México. {nameA} cuenta con una calificación de{' '}
            <strong>{instA.rating.toFixed(1)}/5</strong> y {instA.review_count.toLocaleString('es-MX')}{' '}
            evaluaciones, mientras que {nameB} tiene <strong>{instB.rating.toFixed(1)}/5</strong> y{' '}
            {instB.review_count.toLocaleString('es-MX')} evaluaciones.
          </p>

          {/* Conclusión rápida */}
          <div className="bg-amber-50 border-l-4 border-[#C24A1F] rounded-r-lg p-4 my-4">
            <strong className="text-gray-900">Conclusión rápida: </strong>
            <span className="text-gray-700">
              {instA.rating > instB.rating
                ? `${nameA} lidera en calificación de usuarios (${instA.rating.toFixed(1)}/5 vs ${instB.rating.toFixed(1)}/5).`
                : instB.rating > instA.rating
                  ? `${nameB} lidera en calificación de usuarios (${instB.rating.toFixed(1)}/5 vs ${instA.rating.toFixed(1)}/5).`
                  : `${nameA} y ${nameB} comparten la misma calificación promedio (${instA.rating.toFixed(1)}/5).`}
              {' '}En cuanto a quejas, {nameA} registra {instA.complaint_count} y {nameB} registra {instB.complaint_count}.
              Revisa el veredicto para saber cuál conviene según tu perfil.
            </span>
          </div>

          <p className="text-sm text-gray-500">
            <strong>Fuente de datos:</strong> Base de datos de Credito MX (evaluaciones y quejas de
            usuarios) y portales públicos de CONDUSEF y Banxico. Información relevante a partir de{' '}
            24 de julio de 2026.
          </p>
        </section>

        {/* ============================================ */}
        {/* Section 5: Tabla comparativa (id="comparativa") */}
        {/* ============================================ */}
        <section id="comparativa" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tabla comparativa</h2>
          <p className="text-sm text-gray-500 mb-4">
            Datos basados en evaluaciones de usuarios registradas en Credito MX. El CAT no está
            disponible en nuestra base de datos; consulta el portal de Banxico para información oficial.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left p-2.5">Característica</th>
                  <th className="text-left p-2.5">{nameA}</th>
                  <th className="text-left p-2.5">{nameB}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Tipo</td>
                  <td className="p-2.5 text-gray-900">{TYPE_LABELS[instA.type]}</td>
                  <td className="p-2.5 text-gray-900">{TYPE_LABELS[instB.type]}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Calificación</td>
                  <td className="p-2.5 text-gray-900">
                    {starString(instA.rating)} <strong>{instA.rating.toFixed(1)}/5</strong>
                  </td>
                  <td className="p-2.5 text-gray-900">
                    {starString(instB.rating)} <strong>{instB.rating.toFixed(1)}/5</strong>
                  </td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Evaluaciones</td>
                  <td className="p-2.5 text-gray-900">{instA.review_count.toLocaleString('es-MX')}</td>
                  <td className="p-2.5 text-gray-900">{instB.review_count.toLocaleString('es-MX')}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Quejas registradas</td>
                  <td className="p-2.5 text-gray-900">{instA.complaint_count.toLocaleString('es-MX')}</td>
                  <td className="p-2.5 text-gray-900">{instB.complaint_count.toLocaleString('es-MX')}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Tasa de resolución</td>
                  <td className="p-2.5 text-gray-900">{statsA.resolutionRate}%</td>
                  <td className="p-2.5 text-gray-900">{statsB.resolutionRate}%</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Producto principal</td>
                  <td className="p-2.5 text-gray-900">{statsA.mainProduct}</td>
                  <td className="p-2.5 text-gray-900">{statsB.mainProduct}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Requisito Buró</td>
                  <td className="p-2.5 text-gray-900">{statsA.requisitoBuro}</td>
                  <td className="p-2.5 text-gray-900">{statsB.requisitoBuro}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Proceso digital</td>
                  <td className="p-2.5 text-gray-900">{statsA.procesoDigital}</td>
                  <td className="p-2.5 text-gray-900">{statsB.procesoDigital}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">Registro CONDUSEF</td>
                  <td className="p-2.5 text-gray-900">{statsA.condusefLabel}</td>
                  <td className="p-2.5 text-gray-900">{statsB.condusefLabel}</td>
                </tr>
                <tr className="border-b border-stone-300">
                  <td className="p-2.5 font-medium text-gray-700">CAT promedio</td>
                  <td className="p-2.5 text-gray-500">{statsA.catLabel}</td>
                  <td className="p-2.5 text-gray-500">{statsB.catLabel}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            El Costo Anual Total (CAT) es un indicador estandarizado e informativo del costo total de
            financiamiento, expresado en términos porcentuales anuales. Consulta la información oficial
            en el portal del <a href="https://www.banxico.org.mx/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Banco de México (Banxico) ↗</a>.
          </p>
        </section>

        {/* ============================================ */}
        {/* Section 6: Calificaciones de usuarios (id="calificaciones") */}
        {/* ============================================ */}
        <section id="calificaciones" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Calificaciones de usuarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta InstA */}
            <div className="bg-white border border-stone-300 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                <Link href={`/instituciones/${slugA}`} className="hover:underline">{nameA}</Link>
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">{instA.rating.toFixed(1)}</span>
                <span className="text-gray-500">/5</span>
                <span className="text-yellow-500 text-xl ml-1">{starString(instA.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <strong>{instA.review_count.toLocaleString('es-MX')}</strong> evaluaciones ·{' '}
                <strong>{instA.complaint_count.toLocaleString('es-MX')}</strong> quejas
              </p>
              {reviewsA.length > 0 ? (
                <blockquote className="border-l-4 border-teal-700 pl-4 italic text-gray-700">
                  &ldquo;{(reviewsA[0].content ?? '').slice(0, 220)}&rdquo; —{' '}
                  <cite className="not-italic font-medium">
                    {reviewsA[0].user_name}, {formatDate(reviewsA[0].created_at)}
                  </cite>
                </blockquote>
              ) : (
                <p className="text-sm text-gray-500 italic">Aún no hay evaluaciones para {nameA}.</p>
              )}
            </div>

            {/* Tarjeta InstB */}
            <div className="bg-white border border-stone-300 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                <Link href={`/instituciones/${slugB}`} className="hover:underline">{nameB}</Link>
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">{instB.rating.toFixed(1)}</span>
                <span className="text-gray-500">/5</span>
                <span className="text-yellow-500 text-xl ml-1">{starString(instB.rating)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                <strong>{instB.review_count.toLocaleString('es-MX')}</strong> evaluaciones ·{' '}
                <strong>{instB.complaint_count.toLocaleString('es-MX')}</strong> quejas
              </p>
              {reviewsB.length > 0 ? (
                <blockquote className="border-l-4 border-teal-700 pl-4 italic text-gray-700">
                  &ldquo;{(reviewsB[0].content ?? '').slice(0, 220)}&rdquo; —{' '}
                  <cite className="not-italic font-medium">
                    {reviewsB[0].user_name}, {formatDate(reviewsB[0].created_at)}
                  </cite>
                </blockquote>
              ) : (
                <p className="text-sm text-gray-500 italic">Aún no hay evaluaciones para {nameB}.</p>
              )}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* Section 7: Pros y contras (id="pros-contras") */}
        {/* ============================================ */}
        <section id="pros-contras" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pros y contras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna InstA */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <Link href={`/instituciones/${slugA}`} className="text-blue-700 hover:underline">{nameA}</Link>
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-4">
                <h4 className="font-semibold text-green-900 mb-3">Pros</h4>
                {statsA.pros.length === 0 ? (
                  <p className="text-sm text-green-800 italic">
                    Aún no hay suficientes evaluaciones positivas para destacar ventajas.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {statsA.pros.map((pro) => (
                      <li key={pro} className="text-sm text-green-900 flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{capitalize(pro)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h4 className="font-semibold text-red-900 mb-3">Contras</h4>
                {statsA.contras.length === 0 ? (
                  <p className="text-sm text-red-800 italic">
                    Aún no hay suficientes evaluaciones negativas o quejas para destacar desventajas.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {statsA.contras.map((contra) => (
                      <li key={contra} className="text-sm text-red-900 flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>{capitalize(contra)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Columna InstB */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <Link href={`/instituciones/${slugB}`} className="text-blue-700 hover:underline">{nameB}</Link>
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-4">
                <h4 className="font-semibold text-green-900 mb-3">Pros</h4>
                {statsB.pros.length === 0 ? (
                  <p className="text-sm text-green-800 italic">
                    Aún no hay suficientes evaluaciones positivas para destacar ventajas.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {statsB.pros.map((pro) => (
                      <li key={pro} className="text-sm text-green-900 flex items-start gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{capitalize(pro)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h4 className="font-semibold text-red-900 mb-3">Contras</h4>
                {statsB.contras.length === 0 ? (
                  <p className="text-sm text-red-800 italic">
                    Aún no hay suficientes evaluaciones negativas o quejas para destacar desventajas.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {statsB.contras.map((contra) => (
                      <li key={contra} className="text-sm text-red-900 flex items-start gap-2">
                        <span className="text-red-600 font-bold">✗</span>
                        <span>{capitalize(contra)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* Section 8: Quejas + Veredicto (id="quejas" + id="veredicto") */}
        {/* ============================================ */}
        <section id="quejas" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Quejas registradas</h2>
          <p className="text-gray-700 mb-4">
            {nameA} registra <strong>{instA.complaint_count.toLocaleString('es-MX')}</strong> quejas
            en Credito MX con una tasa de resolución del <strong>{statsA.resolutionRate}%</strong>{' '}
            ({statsA.resolvedCount} resueltas de {complaintsA.length} mostradas), mientras que {nameB}{' '}
            registra <strong>{instB.complaint_count.toLocaleString('es-MX')}</strong> quejas con una
            tasa de resolución del <strong>{statsB.resolutionRate}%</strong> ({statsB.resolvedCount}{' '}
            resueltas de {complaintsB.length} mostradas).
          </p>

          {commonCategories.length > 0 && (
            <div className="bg-white border border-stone-300 rounded-lg p-5 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Tipos de quejas más comunes</h3>
              <div className="flex flex-wrap gap-2">
                {commonCategories.map((cat) => (
                  <span key={cat} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lista de quejas recientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div className="bg-white border border-stone-300 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Quejas recientes — {nameA}</h3>
              {complaintsA.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No hay quejas registradas.</p>
              ) : (
                <ul className="space-y-3">
                  {complaintsA.slice(0, 3).map((c) => (
                    <li key={c.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">
                        {CATEGORY_LABELS[c.category]} · {STATUS_LABELS[c.status]} · {formatDate(c.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white border border-stone-300 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Quejas recientes — {nameB}</h3>
              {complaintsB.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No hay quejas registradas.</p>
              ) : (
                <ul className="space-y-3">
                  {complaintsB.slice(0, 3).map((c) => (
                    <li key={c.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500">
                        {CATEGORY_LABELS[c.category]} · {STATUS_LABELS[c.status]} · {formatDate(c.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section id="veredicto" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Veredicto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Elige InstA si... */}
            <div className="bg-white border-2 border-green-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Elige {nameA} si…</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Buscas una institución de tipo {TYPE_LABELS[instA.type].toLowerCase()}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Valoras una calificación de {instA.rating.toFixed(1)}/5 con {instA.review_count.toLocaleString('es-MX')} evaluaciones.</span>
                </li>
                {statsA.requisitoBuro === 'No consulta Buró' && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Necesitas un producto sin consultar Buró de Crédito.</span>
                  </li>
                )}
                {statsA.procesoDigital === 'Sí' && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Prefieres un proceso 100% digital.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Quieres un producto de {statsA.mainProduct.toLowerCase()}.</span>
                </li>
              </ul>
            </div>

            {/* Elige InstB si... */}
            <div className="bg-white border-2 border-orange-600 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Elige {nameB} si…</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Buscas una institución de tipo {TYPE_LABELS[instB.type].toLowerCase()}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Valoras una calificación de {instB.rating.toFixed(1)}/5 con {instB.review_count.toLocaleString('es-MX')} evaluaciones.</span>
                </li>
                {statsB.requisitoBuro === 'No consulta Buró' && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span>Necesitas un producto sin consultar Buró de Crédito.</span>
                  </li>
                )}
                {statsB.procesoDigital === 'Sí' && (
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✓</span>
                    <span>Prefieres un proceso 100% digital.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">✓</span>
                  <span>Quieres un producto de {statsB.mainProduct.toLowerCase()}.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Recordatorio CONDUSEF */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-700">
              <strong>Recordatorio CONDUSEF:</strong> Antes de contratar cualquier producto, verifica
              que {nameA} y {nameB} estén registradas en el portal{' '}
              <a href="https://www.condusef.gob.mx/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                SIPRES de CONDUSEF ↗
              </a>
              . {nameA} {instA.is_verified ? 'figura como verificada' : 'figura como pendiente de verificación'} y{' '}
              {nameB} {instB.is_verified ? 'figura como verificada' : 'figura como pendiente de verificación'} en nuestra plataforma.
            </p>
          </div>
        </section>

        {/* ============================================ */}
        {/* Section 9: FAQ + Fuentes (id="faq" + id="fuentes") */}
        {/* ============================================ */}
        <section id="faq" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-700 text-sm">{faq.answer}</p>
                {faq.question.includes('Cómo presento una queja') && (
                  <Link
                    href="/quejas/nueva"
                    className="inline-block mt-2 text-sm text-blue-700 hover:underline"
                  >
                    Presentar una queja →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="fuentes" className="my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Fuentes</h2>
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>
              CONDUSEF - SIPRES:{' '}
              <a href="https://www.condusef.gob.mx/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                Sistema de consulta de instituciones financieras ↗
              </a>
            </li>
            <li>
              Banco de México (Banxico):{' '}
              <a href="https://www.banxico.org.mx/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                Costo Anual Total (CAT) ↗
              </a>
            </li>
            <li>
              <Link href="/instituciones" className="text-blue-700 hover:underline">
                Base de datos de instituciones de Credito MX
              </Link>
            </li>
            <li>Evaluaciones y quejas de usuarios: Base de datos de Credito MX (2026)</li>
          </ul>

          {/* CTA a páginas de detalle */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href={`/instituciones/${slugA}`}
              className="px-5 py-2.5 bg-orange-700 text-white rounded-lg font-medium hover:bg-orange-800 transition-colors text-sm"
            >
              Ver reseña de {nameA} →
            </Link>
            <Link
              href={`/instituciones/${slugB}`}
              className="px-5 py-2.5 bg-orange-700 text-white rounded-lg font-medium hover:bg-orange-800 transition-colors text-sm"
            >
              Ver reseña de {nameB} →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
