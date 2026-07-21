// ============================================
// "如何评估" 指南页面 - 静态内容页面
// 介绍网站服务、评价指南、投诉指南、社区规则
// 不需要数据库，但需专业、美观、符合金融机构评价主题
// ============================================

import Link from "next/link"
import type { Metadata } from "next"

// 页面元数据 - SEO 优化
export const metadata: Metadata = {
  title: "Cómo Evaluar - Guía para Evaluaciones y Quejas",
  description: "Aprende cómo escribir evaluaciones valiosas, presentar quejas efectivas y participar en nuestra comunidad de evaluación de instituciones financieras en México.",
  alternates: {
    canonical: "/evaluar",
  },
  openGraph: {
    title: "Cómo Evaluar - Guía de Credito MX",
    description: "Guía completa para escribir evaluaciones y presentar quejas en Credito MX",
    type: "website",
    locale: "es_MX",
  },
}

// 服务特性数据 - 顶部展示
const SERVICES = [
  {
    icon: "📊",
    title: "Evaluaciones Transparentes",
    description: "Lee experiencias reales de usuarios sobre bancos, fintech, SOFOM y más. Cada evaluación ayuda a otros a tomar mejores decisiones."
  },
  {
    icon: "⚠️",
    title: "Sistema de Quejas",
    description: "Presenta quejas sobre cargos no autorizados, tasas abusivas, mal servicio o prácticas engañosas. Damos seguimiento público."
  },
  {
    icon: "🔍",
    title: "Comparación Honesta",
    description: "Compara calificaciones, comisiones, tasas de interés y experiencias de múltiples instituciones en un solo lugar."
  },
  {
    icon: "🛡️",
    title: "Comunidad Moderada",
    description: "Todas las evaluaciones son revisadas para asegurar autenticidad y respeto. Fomentamos un ambiente constructivo."
  }
]

// 评价指南要点
const REVIEW_GUIDELINES = [
  {
    title: "1. Basado en Experiencia Real",
    description: "Escribe solo sobre productos o servicios que hayas utilizado. No publiques rumores ni información de segunda mano."
  },
  {
    title: "2. Sé Objetivo y Equilibrado",
    description: "Menciona tanto los aspectos positivos como negativos. Una crítica constructiva es más útil que una queja sin contexto."
  },
  {
    title: "3. Proporciona Detalles Concretos",
    description: "Incluye información específica: tipo de producto, montos, fechas, tasas de interés, comisiones. Los detalles ayudan a otros usuarios."
  },
  {
    title: "4. Mantén un Tono Respetuoso",
    description: "Critica productos y servicios, no a personas. Evita lenguaje ofensivo, discriminatorio o difamatorio."
  },
  {
    title: "5. Sé Constructivo",
    description: "Si tuviste un problema, explica qué esperabas y qué obtuviste. Sugiere mejoras si es posible."
  },
  {
    title: "6. Verifica la Información",
    description: "Asegúrate de que los datos sean correctos. No publiques información personal de empleados o terceros."
  }
]

// 投诉指南要点
const COMPLAINT_GUIDELINES = [
  {
    title: "Identifica el Problema",
    description: "Define claramente cuál es el problema: cargo no reconocido, tasa no informada, mal servicio, cobranza indebida, etc."
  },
  {
    title: "Documenta Todo",
    description: "Reúne pruebas: recibos, contratos, capturas de pantalla, correos, números de folio. Tu queja será más sólida con evidencia."
  },
  {
    title: "Intenta Resolver Primero",
    description: "Antes de presentar una queja pública, contacta directamente a la institución. Anota los números de folio y fechas de contacto."
  },
  {
    title: "Sé Específico y Cronológico",
    description: "Cuenta los hechos en orden temporal. Incluye fechas, montos, nombres de personas con quienes hablaste, y cualquier acción tomada."
  },
  {
    title: "Especifica lo que Buscas",
    description: "¿Quieres un reembolso? ¿Una disculpa? ¿La cancelación de un cargo? Define claramente tu诉求 para facilitar la resolución."
  },
  {
    title: "Proporciona Datos de Contacto",
    description: "Incluye tu nombre y un correo válido (opcional) para que la institución o nuestro equipo pueda dar seguimiento."
  }
]

// 社区规则
const COMMUNITY_RULES = [
  {
    icon: "✅",
    title: "Sé Honesto",
    description: "Publica solo información veraz sobre tus experiencias reales."
  },
  {
    icon: "✅",
    title: "Sé Respetuoso",
    description: "Trata con respeto a otros usuarios, instituciones y sus empleados."
  },
  {
    icon: "✅",
    title: "Privacidad Primero",
    description: "No compartas datos personales tuyos ni de terceros (números de tarjeta completos, contraseñas, etc.)."
  },
  {
    icon: "❌",
    title: "No Spam ni Publicidad",
    description: "No publiques enlaces promocionales ni contenido comercial no solicitado."
  },
  {
    icon: "❌",
    title: "No Lenguaje Ofensivo",
    description: "Evita insultos, amenazas, lenguaje discriminatorio o acoso de cualquier tipo."
  },
  {
    icon: "❌",
    title: "No Múltiples Cuentas",
    description: "No crees cuentas múltiples para manipular calificaciones o promover contenido."
  }
]

// 评估页面组件
export default function EvaluarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cómo Evaluar
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Guía completa para escribir evaluaciones valiosas, presentar quejas efectivas
            y participar en nuestra comunidad.
          </p>
        </div>
      </section>

      {/* 我们的服务 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¿Qué Ofrecemos?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Una plataforma diseñada para empoderar a los consumidores mexicanos
              con información transparente y honesta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 评价指南 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
              Guía de Evaluaciones
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
              Cómo Escribir una Evaluación Valiosa
            </h2>
            <p className="text-gray-600">
              Una buena evaluación ayuda a miles de personas a tomar mejores decisiones.
              Sigue estas recomendaciones para que tu voz tenga el máximo impacto.
            </p>
          </div>

          <div className="space-y-4">
            {REVIEW_GUIDELINES.map((guideline) => (
              <div
                key={guideline.title}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {guideline.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {guideline.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/instituciones"
              className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Explorar Instituciones
            </Link>
          </div>
        </div>
      </section>

      {/* 投诉指南 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">
              Guía de Quejas
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-3">
              Cómo Presentar una Queja Efectiva
            </h2>
            <p className="text-gray-600">
              Una queja bien estructurada tiene más posibilidades de ser escuchada
              y resuelta. Sigue estos pasos para maximizar el impacto de tu caso.
            </p>
          </div>

          <div className="space-y-4">
            {COMPLAINT_GUIDELINES.map((guideline) => (
              <div
                key={guideline.title}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {guideline.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {guideline.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/quejas/nueva"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Presentar una Queja
            </Link>
          </div>
        </div>
      </section>

      {/* 社区规则 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Reglas de la Comunidad
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Para mantener un espacio seguro y útil, todos los miembros deben seguir
              estas reglas básicas. El incumplimiento puede resultar en la moderación
              del contenido o la suspensión de la cuenta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMUNITY_RULES.map((rule) => (
              <div
                key={rule.title}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{rule.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {rule.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 流程说明 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¿Qué Pasa Después de Publicar?
            </h2>
            <p className="text-gray-600">
              Conoce el proceso que sigue tu evaluación o queja una vez publicada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Revisión</h3>
              <p className="text-sm text-gray-600">
                Nuestro equipo de moderación revisa cada publicación para verificar
                que cumple con las reglas de la comunidad.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Publicación</h3>
              <p className="text-sm text-gray-600">
                Una vez aprobada, tu contenido es visible para todos los usuarios
                y queda registrado permanentemente en la institución correspondiente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguimiento</h3>
              <p className="text-sm text-gray-600">
                Las quejas pueden ser marcadas como resueltas, en revisión o rechazadas.
                Las instituciones son notificadas para que puedan dar respuesta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 行动召唤 */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Compartir tu Experiencia?
          </h2>
          <p className="text-blue-100 mb-8">
            Tu voz es importante. Ya sea una evaluación positiva o una queja que
            necesita atención, cada testimonio ayuda a construir un ecosistema
            financiero más transparente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/instituciones"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Ver Instituciones
            </Link>
            <Link
              href="/quejas/nueva"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Presentar una Queja
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
