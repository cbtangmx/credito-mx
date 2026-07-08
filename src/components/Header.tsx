import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-700">Credito</span>
            <span className="text-2xl font-light text-gray-600">MX</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/instituciones" 
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Instituciones
            </Link>
            <Link 
              href="/quejas" 
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
            >
              Quejas
            </Link>
            <Link 
              href="/evaluar" 
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Evaluar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 hidden">
          <div className="flex flex-col space-y-4">
            <Link href="/instituciones" className="text-gray-700 hover:text-blue-700 font-medium">
              Instituciones
            </Link>
            <Link href="/quejas" className="text-gray-700 hover:text-blue-700 font-medium">
              Quejas
            </Link>
            <Link href="/evaluar" className="bg-blue-700 text-white px-4 py-2 rounded-lg text-center">
              Evaluar
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}