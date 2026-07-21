import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Credito MX - Cómo recopilamos, usamos y protegemos tu información personal.",
  alternates: {
    canonical: "/privacidad",
  },
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Política de Privacidad
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: 15 de julio de 2026
          </p>

          <div className="prose prose-blue max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. Información que Recopilamos
              </h2>
              <p>
                En Credito MX, recopilamos los siguientes tipos de información personal de nuestros usuarios:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Información de registro:</strong> nombre, dirección de correo electrónico y contraseña (encriptada).</li>
                <li><strong>Información de perfil:</strong> nombre para mostrar, foto de perfil (opcional).</li>
                <li><strong>Contenido generado por el usuario:</strong> evaluaciones, quejas, comentarios sobre instituciones financieras.</li>
                <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo de permanencia.</li>
                <li><strong>Cookies y tecnologías similares:</strong> para mejorar tu experiencia y analizar el tráfico del sitio.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Cómo Usamos tu Información
              </h2>
              <p>Utilizamos la información recopilada para los siguientes fines:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Proporcionar y mantener nuestros servicios de evaluación y quejas.</li>
                <li>Personalizar tu experiencia en el sitio.</li>
                <li>Mostrar contenido relevante de instituciones financieras.</li>
                <li>Mostrar anuncios personalizados a través de Google AdSense y otros socios publicitarios.</li>
                <li>Analizar el uso del sitio y mejorar nuestros servicios.</li>
                <li>Comunicarnos contigo sobre actualizaciones y cambios importantes.</li>
                <li>Detectar y prevenir actividades fraudulentas o abusivas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Publicidad y Cookies de Terceros
              </h2>
              <p>
                Utilizamos Google AdSense, un servicio de publicidad proporcionado por Google LLC ("Google"),
                para mostrar anuncios en nuestro sitio web. Google AdSense utiliza cookies para mostrar
                anuncios basados en tus visitas anteriores a nuestro sitio web y otros sitios en Internet.
              </p>
              <p className="mt-3">
                <strong>Cookies DART de Google:</strong> Google utiliza la cookie DART para mostrar anuncios
                basados en tu interacción con nuestro sitio web y otros sitios web. Puedes optar por no usar
                la cookie DART visitando la <a href="https://policies.google.com/technologies/ads" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">política de anuncios de Google</a>.
              </p>
              <p className="mt-3">
                <strong>Socios publicitarios terceros:</strong> Otros proveedores de anuncios o redes
                publicitarias también pueden usar cookies para mostrar anuncios en nuestro sitio. Estos
                terceros pueden incluir:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Google AdSense</li>
                <li>Google AdX</li>
                <li>Otros socios publicitarios de Google</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Cookies y Almacenamiento Local
              </h2>
              <p>
                Utilizamos cookies y tecnologías de almacenamiento local (incluyendo LocalStorage) para:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Mantener tu sesión iniciada.</li>
                <li>Recordar tus preferencias.</li>
                <li>Analizar el tráfico del sitio.</li>
                <li>Personalizar anuncios.</li>
              </ul>
              <p className="mt-3">
                Puedes controlar las cookies a través de la configuración de tu navegador. Ten en cuenta
                que deshabilitar las cookies puede afectar tu experiencia en nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Compartir tu Información
              </h2>
              <p>No vendemos tu información personal a terceros. Podemos compartir información en los siguientes casos:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Con proveedores de servicios (Supabase para base de datos, Vercel para hosting).</li>
                <li>Con socios publicitarios para mostrar anuncios personalizados.</li>
                <li>Con autoridades legales cuando sea requerido por ley.</li>
                <li>En caso de fusión, adquisición o venta de activos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Tus Derechos (LFPDPPP - México)
              </h2>
              <p>Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México, tienes derecho a:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Acceso:</strong> conocer qué datos personales tenemos sobre ti.</li>
                <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                <li><strong>Cancelación:</strong> eliminar tus datos personales de nuestras bases de datos.</li>
                <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos para fines específicos.</li>
                <li><strong>Revocación:</strong> revocar el consentimiento otorgado.</li>
              </ul>
              <p className="mt-3">
                Para ejercer cualquiera de estos derechos, contáctanos en: <a href="mailto:contacto@credito-mx.com" className="text-blue-700 hover:underline">contacto@credito-mx.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Seguridad de los Datos
              </h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal,
                incluyendo encriptación SSL/TLS, autenticación segura a través de Supabase, y acceso restringido
                a datos personales por parte de nuestro equipo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Menores de Edad
              </h2>
              <p>
                Nuestro sitio no está dirigido a menores de 18 años. No recopilamos intencionalmente
                información personal de menores. Si eres padre/madre y descubres que tu hijo nos ha
                proporcionado datos personales, contáctanos para que podamos eliminarlos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Cambios a esta Política
              </h2>
              <p>
                Podemos actualizar esta política de privacidad periódicamente. Te notificaremos sobre
                cambios significativos publicando la nueva política en esta página y actualizando la
                fecha de "última actualización".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Contacto
              </h2>
              <p>
                Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos,
                contáctanos en:
              </p>
              <p className="mt-3">
                <strong>Email:</strong> <a href="mailto:contacto@credito-mx.com" className="text-blue-700 hover:underline">contacto@credito-mx.com</a><br />
                <strong>Sitio web:</strong> <a href="https://credito-mx.com" className="text-blue-700 hover:underline">https://credito-mx.com</a>
              </p>
            </section>

            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Esta política cumple con la Ley Federal de Protección de Datos Personales en Posesión
                de los Particulares (LFPDPPP) de México y las políticas de Google AdSense.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
