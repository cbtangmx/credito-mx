// ============================================
// 对比索引页 - /comparar
// 列出全部 10 个机构对比页面
// ============================================

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparativas de Instituciones Financieras en México | Credito MX',
  description:
    'Compara instituciones financieras en México: tarjetas de crédito, préstamos, bancos y fintech. Evaluaciones reales de usuarios, quejas y calificaciones verificadas.',
  alternates: {
    canonical: '/comparar',
  },
  openGraph: {
    title: 'Comparativas de Instituciones Financieras en México',
    description:
      'Compara bancos, fintech y SOFOM en México. Evaluaciones reales, quejas y calificaciones.',
    type: 'website',
    locale: 'es_MX',
    url: 'https://www.credito-mx.com/comparar',
    siteName: 'Credito MX',
  },
}

// ============================================
// 10 个对比配置（与 [comparison]/page.tsx 保持一致）
// ============================================
const COMPARISONS = [
  { slug: 'stori-vs-klar', title: 'Stori vs Klar', desc: '¿Cuál es mejor tarjeta sin Buró? Comparamos dos tarjetas de crédito que no consultan Buró.' },
  { slug: 'nu-bank-vs-stori', title: 'Nu Bank vs Stori', desc: 'Banco digital vs tarjeta de crédito digital. Comparativa de dos de las fintech más populares.' },
  { slug: 'mercado-pago-vs-nu-bank', title: 'Mercado Pago vs Nu Bank', desc: 'Billetera digital vs banco digital. ¿Qué cuenta digital te conviene más?' },
  { slug: 'kueski-vs-baubap', title: 'Kueski vs Baubap', desc: 'Préstamos en línea comparados. Tasas, requisitos y opiniones de usuarios reales.' },
  { slug: 'konfio-vs-minu', title: 'Konfío vs Minu', desc: 'Crédito para negocios vs crédito personal. Compara requisitos y calificaciones.' },
  { slug: 'citibanamex-vs-bbva-mexico', title: 'Citibanamex vs BBVA México', desc: 'Los dos bancos más grandes de México. Compara calificaciones, quejas y servicios.' },
  { slug: 'hey-banco-vs-banorte', title: 'Hey Banco vs Banorte', desc: 'Banco digital vs banco tradicional. ¿Qué opción es mejor para ti?' },
  { slug: 'banco-azteca-vs-bancoppel', title: 'Banco Azteca vs Bancoppel', desc: 'Bancos de crédito al consumo. Compara productos, quejas y calificaciones.' },
  { slug: 'stori-vs-mercado-pago', title: 'Stori vs Mercado Pago', desc: 'Tarjeta de crédito vs billetera digital. ¿Cuál te conviene más?' },
  { slug: 'nu-bank-vs-mercado-pago', title: 'Nu Bank vs Mercado Pago', desc: 'Banco digital vs billetera digital. ¿Dónde abrir tu cuenta?' },
]

export default function CompararIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑 */}
        <nav aria-label="Navegación" className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:underline">Inicio</Link>
          {' > '}
          <span>Comparativas</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Comparativas de Instituciones Financieras
          </h1>
          <p className="text-gray-600 text-lg">
            Compara bancos, fintech y SOFOM en México basándote en evaluaciones reales
            de usuarios, quejas registradas y calificaciones verificadas.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
            <span>📝 Escrito por: <strong className="text-gray-700">Equipo Editorial Credito MX</strong></span>
            <span>✅ Revisado por: <strong className="text-gray-700">Equipo de Análisis Financiero</strong></span>
            <span>📅 Última actualización: <time dateTime="2026-07-24">24 julio 2026</time></span>
          </div>
        </header>

        {/* Affiliate 披露 */}
        <div
          role="note"
          className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-gray-700 mb-8"
        >
          Podemos recibir una comisión si solicitas un producto a través de los enlaces de esta página.
          Esto no afecta el precio que pagas ni nuestra valoración editorial. Las comparaciones se basan
          en evaluaciones reales de usuarios y datos públicos.
        </div>

        {/* 对比列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COMPARISONS.map((comp, index) => (
            <Link
              key={comp.slug}
              href={`/comparar/${comp.slug}`}
              className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-[#C24A1F] hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#C24A1F] transition-colors">
                  {comp.title}
                </h2>
                <span className="text-2xl text-gray-300 group-hover:text-[#C24A1F] transition-colors flex-shrink-0">
                  →
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {comp.desc}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  Comparativa #{index + 1}
                </span>
                <span>Ver análisis completo →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO 内容段落 */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Cómo elegimos las comparativas?
          </h2>
          <p className="text-gray-600 mb-4">
            Nuestras comparativas se basan en datos reales de usuarios registrados en Credito MX.
            Analizamos calificaciones, número de quejas, tasa de resolución de quejas y productos
            ofrecidos por cada institución. No aceptamos pago por modificar los resultados de
            nuestras comparativas.
          </p>
          <p className="text-gray-600 mb-4">
            Todas las instituciones financieras en México deben estar registradas ante CONDUSEF
            (Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros).
            Te recomendamos verificar el registro de cualquier institución en el portal{' '}
            <a
              href="https://www.condusef.gob.mx/"
              rel="external nofollow"
              className="text-blue-700 hover:underline"
            >
              SIPRES de CONDUSEF
            </a>{' '}
            antes de contratar cualquier producto financiero.
          </p>
          <p className="text-gray-600">
            El CAT (Costo Anual Total) es un indicador obligatorio que todas las instituciones deben
            mostrar según la Circular 34/2010 de Banxico. Puedes comparar CATs oficiales en el{' '}
            <a
              href="https://www.banxico.org.mx/tarjetascat/"
              rel="external nofollow"
              className="text-blue-700 hover:underline"
            >
              comparador de Banxico
            </a>
            .
          </p>
        </section>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            ¿No encuentras la comparativa que buscas?
          </p>
          <Link
            href="/instituciones"
            className="inline-block px-6 py-3 bg-[#1F2A33] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Ver todas las instituciones →
          </Link>
        </div>
      </div>
    </div>
  )
}
