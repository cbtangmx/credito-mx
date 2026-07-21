import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Acerca de Nosotros",
  description: "Conoce Credito MX - La plataforma líder de evaluaciones y quejas sobre instituciones financieras en México.",
  alternates: {
    canonical: "/nosotros",
  },
}

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Acerca de Credito MX
          </h1>

          <div className="prose prose-blue max-w-none space-y-6 text-gray-700">
            <section>
              <p className="text-lg text-gray-600">
                Credito MX es la plataforma líder en México para evaluar y comparar instituciones
                financieras. Nuestra misión es empoderar a los consumidores con información transparente
                y honesta para tomar mejores decisiones financieras.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Nuestra Misión
              </h2>
              <p>
                Proporcionar un espacio abierto y confiable donde los usuarios mexicanos puedan compartir
                sus experiencias con bancos, fintech, SOFOM y otros servicios financieros, ayudando a
                otros consumidores a tomar decisiones informadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                ¿Qué Ofrecemos?
              </h2>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Evaluaciones honestas:</strong> Lee y publica reseñas detalladas de instituciones financieras.</li>
                <li><strong>Sistema de quejas:</strong> Presenta quejas sobre productos y servicios.</li>
                <li><strong>Comparación transparente:</strong> Compara calificaciones, comisiones y experiencias de múltiples instituciones.</li>
                <li><strong>Información actualizada:</strong> Datos sobre las principales instituciones financieras en México.</li>
                <li><strong>Comunidad activa:</strong> Miles de usuarios compartiendo experiencias reales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                ¿Por Qué Confiar en Nosotros?
              </h2>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Transparencia:</strong> Todas las evaluaciones son revisadas por nuestro equipo de moderación.</li>
                <li><strong>Independencia:</strong> No somos propiedad ni afiliados a ninguna institución financiera.</li>
                <li><strong>Privacidad:</strong> Protegemos tus datos personales conforme a la LFPDPPP.</li>
                <li><strong>Comunidad:</strong> Fomentamos un ambiente respetuoso y constructivo.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Cobertura
              </h2>
              <p>
                Cubrimos todas las principales instituciones financieras en México, incluyendo:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Bancos tradicionales (BBVA, Santander, Banorte, HSBC, etc.)</li>
                <li>Fintech (Stori, Klar, Nu Bank, Konfio, etc.)</li>
                <li>SOFOM y sociedades financieras de objeto múltiple</li>
                <li>Emisores de tarjetas de crédito</li>
                <li>Casas de préstamo y crédito al consumo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Únete a Nuestra Comunidad
              </h2>
              <p>
                Tu experiencia es valiosa. Al compartir tus evaluaciones y quejas, ayudas a otros
                consumidores a evitar malas experiencias y a encontrar las mejores opciones financieras
                para sus necesidades.
              </p>
              <p className="mt-3">
                <a href="/register" className="text-blue-700 hover:underline font-medium">
                  Crea una cuenta gratis →
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Contacto
              </h2>
              <p>
                ¿Tienes preguntas, sugerencias o quieres colaborar con nosotros? Contáctanos en:
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
