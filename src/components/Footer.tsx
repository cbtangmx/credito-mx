import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-white">Credito</span>
              <span className="text-xl font-light text-gray-400">MX</span>
            </div>
            <p className="text-sm text-gray-400">
              Plataforma de evaluaciones y quejas de instituciones financieras en México.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/instituciones" className="hover:text-white transition-colors">
                  Instituciones
                </Link>
              </li>
              <li>
                <Link href="/quejas" className="hover:text-white transition-colors">
                  Quejas
                </Link>
              </li>
              <li>
                <Link href="/evaluar" className="hover:text-white transition-colors">
                  Evaluar
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/instituciones?tipo=bank" className="hover:text-white transition-colors">
                  Bancos
                </Link>
              </li>
              <li>
                <Link href="/instituciones?tipo=fintech" className="hover:text-white transition-colors">
                  Fintech
                </Link>
              </li>
              <li>
                <Link href="/instituciones?tipo=sofom" className="hover:text-white transition-colors">
                  SOFOM
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/nosotros" className="hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-white transition-colors">
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center text-xs text-gray-500 space-y-2">
            <p>© {new Date().getFullYear()} Credito MX. Todos los derechos reservados.</p>
            <p>
              Publicidad: Este sitio utiliza Google AdSense para mostrar anuncios.
              Las opiniones expresadas por los usuarios no constituyen consejo financiero.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}