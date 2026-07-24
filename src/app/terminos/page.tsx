import { buildMetadata, buildBreadcrumbJsonLd, BASE_URL } from '@/lib/seo'

export const dynamic = 'force-static'
export const revalidate = false

export const metadata = buildMetadata({
  title: 'Términos de Uso | Credito MX',
  description: 'Términos y condiciones de uso de Credito MX - Reglas y responsabilidades para usuarios de la plataforma de evaluaciones financieras.',
  url: '/terminos',
  type: 'article',
  imageAlt: 'Términos de Uso — Credito MX',
})

export default function TerminosPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Inicio', url: `${BASE_URL}/` },
    { name: 'Términos de Uso', url: `${BASE_URL}/terminos` },
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <nav aria-label="Navegación" className="text-sm text-gray-500 mb-6">
            <a href="/" className="hover:underline">Inicio</a>
            {' > '}
            <span>Términos de Uso</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Términos de Uso
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Última actualización: 15 de julio de 2026
          </p>

          <div className="prose prose-blue max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. Aceptación de los Términos
              </h2>
              <p>
                Al acceder y utilizar Credito MX (credito-mx.com), aceptas estar sujeto a estos Términos
                de Uso. Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Descripción del Servicio
              </h2>
              <p>
                Credito MX es una plataforma que permite a los usuarios:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Leer y publicar evaluaciones de instituciones financieras en México.</li>
                <li>Presentar quejas sobre productos y servicios financieros.</li>
                <li>Consultar calificaciones y opiniones de otros usuarios.</li>
                <li>Acceder a contenido informativo sobre finanzas personales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Registro y Cuenta de Usuario
              </h2>
              <p>Para acceder a ciertas funciones, debes crear una cuenta. Al registrarte, te comprometes a:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Proporcionar información veraz, precisa y actualizada.</li>
                <li>Mantener la seguridad de tu contraseña.</li>
                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.</li>
                <li>Ser responsable de todas las actividades en tu cuenta.</li>
                <li>Tener al menos 18 años de edad.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Contenido del Usuario
              </h2>
              <p>Al publicar contenido (evaluaciones, quejas, comentarios), garantizas que:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Eres el autor original o tienes derecho a publicar dicho contenido.</li>
                <li>El contenido es veraz y basado en tu experiencia real.</li>
                <li>No viola derechos de terceros (copyright, marca, privacidad).</li>
                <li>No contiene material difamatorio, obsceno, ofensivo o ilegal.</li>
                <li>No contiene spam, publicidad no autorizada, virus o código malicioso.</li>
              </ul>
              <p className="mt-3">
                Nos reservamos el derecho de moderar, editar o eliminar contenido que consideremos
                inapropiado o que viole estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Moderación de Contenido
              </h2>
              <p>
                Todo el contenido publicado por los usuarios pasa por un proceso de moderación antes
                de ser visible públicamente. Nos reservamos el derecho de:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Aprobar, rechazar o eliminar contenido a nuestra discreción.</li>
                <li>Verificar la autenticidad de las evaluaciones y quejas.</li>
                <li>Solicitar información adicional para validar quejas.</li>
                <li>Suspender o banear usuarios que violen estos términos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Propiedad Intelectual
              </h2>
              <p>
                El contenido del sitio (textos, gráficos, logos, código) es propiedad de Credito MX o
                sus licenciantes. No puedes reproducir, distribuir o crear obras derivadas sin
                autorización escrita previa.
              </p>
              <p className="mt-3">
                Las evaluaciones y quejas publicadas por usuarios son propiedad de sus respectivos autores,
                quienes otorgan a Credito MX una licencia no exclusiva para mostrarlas en la plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Publicidad
              </h2>
              <p>
                Nuestro sitio muestra anuncios a través de Google AdSense y otros socios publicitarios.
                No somos responsables del contenido de los anuncios de terceros. Las opiniones expresadas
                en evaluaciones y quejas no constituyen consejo financiero ni respaldo a ninguna institución.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Limitación de Responsabilidad
              </h2>
              <p>Credito MX no se hace responsable de:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Decisiones financieras tomadas con base en la información del sitio.</li>
                <li>Contenido publicado por usuarios o terceros.</li>
                <li>Daños derivados del uso o la imposibilidad de usar el servicio.</li>
                <li>Interrupciones, errores o virus en el sitio.</li>
                <li>Acciones de instituciones financieras evaluadas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Conducta Prohibida
              </h2>
              <p>Está estrictamente prohibido:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Publicar contenido falso, difamatorio o fraudulento.</li>
                <li>Suplantar la identidad de otras personas o instituciones.</li>
                <li>Acosar, amenazar o intimidar a otros usuarios.</li>
                <li>Intentar acceder a cuentas o sistemas sin autorización.</li>
                <li>Usar el sitio para actividades comerciales no autorizadas.</li>
                <li>Recopilar información de otros usuarios sin consentimiento.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Modificaciones
              </h2>
              <p>
                Podemos modificar estos términos en cualquier momento. Los cambios entrarán en vigor
                una vez publicados en esta página. Tu uso continuado del sitio después de los cambios
                constituye tu aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                11. CONDUSEF y Resolución de Controversias
              </h2>
              <p>
                Credito MX es una plataforma independiente de evaluaciones y no es una institución
                financiera regulada por la Comisión Nacional para la Protección y Defensa de los
                Usuarios de Servicios Financieros (CONDUSEF). Sin embargo, recomendamos a nuestros
                usuarios que tengan controversias con instituciones financieras registradas en
                nuestro sitio acudir a CONDUSEF para obtener asesoría y resolución de disputas.
              </p>
              <p className="mt-3">
                CONDUSEF ofrece servicios gratuitos de conciliación y arbitraje para usuarios de
                productos financieros en México. Puedes contactar a CONDUSEF a través de su sitio
                web oficial (<a href="https://www.gob.mx/condusef" className="text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">www.gob.mx/condusef</a>)
                o al teléfono 55 5342 0910.
              </p>
              <p className="mt-3">
                Las evaluaciones y quejas publicadas en Credito MX no sustituyen los procedimientos
                legales formales. Si tienes una disputa legal con una institución financiera, te
                recomendamos presentar una queja formal ante CONDUSEF o las autoridades competentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                12. Ley Aplicable
              </h2>
              <p>
                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier disputa
                será resuelta por los tribunales competentes de la Ciudad de México. El uso de esta
                plataforma está sujeto a las disposiciones de la Ley Federal de Protección al Consumidor
                y demás normativas aplicables en territorio mexicano.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                13. Contacto
              </h2>
              <p>
                Si tienes preguntas sobre estos términos, contáctanos en:
                <br />
                <strong>Email:</strong> <a href="mailto:contacto@credito-mx.com" className="text-blue-700 hover:underline">contacto@credito-mx.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
