import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos - Estamos aquí para ayudarte con cualquier pregunta o comentario sobre Credito MX.",
  alternates: {
    canonical: "/contacto",
  },
}

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Contáctanos
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            ¿Tienes preguntas, comentarios o sugerencias? Nos encantaría saber de ti.
            Completa el formulario a continuación o contáctanos directamente por email.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Información de Contacto
              </h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📧</span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:contacto@credito-mx.com" className="text-blue-700 hover:underline">
                      contacto@credito-mx.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">🌐</span>
                  <div>
                    <p className="font-semibold">Sitio Web</p>
                    <a href="https://credito-mx.com" className="text-blue-700 hover:underline">
                      https://credito-mx.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">⏰</span>
                  <div>
                    <p className="font-semibold">Tiempo de Respuesta</p>
                    <p>24-48 horas hábiles</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-3">🇲🇽</span>
                  <div>
                    <p className="font-semibold">Ubicación</p>
                    <p>México</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ¿Eres una institución financiera?
                </h3>
                <p className="text-sm text-blue-800">
                  Si representas a una institución financiera y quieres responder a quejas o
                  colaborar con nosotros, escríbenos a{" "}
                  <a href="mailto:contacto@credito-mx.com" className="underline font-medium">
                    contacto@credito-mx.com
                  </a>{" "}
                  con el asunto "Institución Financiera".
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Formulario de Contacto
              </h2>

              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="general">Consulta general</option>
                    <option value="bug">Reportar problema técnico</option>
                    <option value="complaint">Ayuda con una queja</option>
                    <option value="review">Ayuda con una evaluación</option>
                    <option value="partnership">Colaboración / Patrocinio</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Enviar Mensaje
                </button>

                <p className="text-xs text-gray-500 mt-2">
                  Al enviar este formulario, aceptas nuestra{" "}
                  <a href="/privacidad" className="text-blue-700 hover:underline">
                    Política de Privacidad
                  </a>.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
