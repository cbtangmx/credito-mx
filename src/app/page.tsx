import Link from "next/link";

// Mock data for demonstration - will be replaced with Supabase data
const featuredInstitutions = [
  {
    id: "1",
    name: "Stori",
    slug: "stori",
    type: "fintech",
    rating: 4.2,
    review_count: 1250,
    complaint_count: 45,
    description: "Tarjeta de crédito digital con beneficios exclusivos"
  },
  {
    id: "2",
    name: "Klar",
    slug: "klar",
    type: "fintech",
    rating: 3.8,
    review_count: 890,
    complaint_count: 32,
    description: "Servicios financieros digitales sin comisiones"
  },
  {
    id: "3",
    name: "Nu Bank",
    slug: "nu-bank",
    type: "fintech",
    rating: 4.5,
    review_count: 2100,
    complaint_count: 28,
    description: "Banco digital líder en Latinoamérica"
  },
  {
    id: "4",
    name: "Crediclub",
    slug: "crediclub",
    type: "sofom",
    rating: 3.5,
    review_count: 450,
    complaint_count: 65,
    description: "Préstamos personales rápidos"
  }
];

const recentComplaints = [
  {
    id: "1",
    title: "Cargos no autorizados en mi tarjeta",
    institution: "Stori",
    category: "charges",
    status: "pending",
    created_at: "2024-01-15"
  },
  {
    id: "2",
    title: "Demora en procesamiento de préstamo",
    institution: "Crediclub",
    category: "service",
    status: "reviewing",
    created_at: "2024-01-14"
  },
  {
    id: "3",
    title: "Cobranza agresiva después de 2 días",
    institution: "Klar",
    category: "collection",
    status: "resolved",
    created_at: "2024-01-10"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Evalúa Instituciones Financieras en México
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Lee evaluaciones de usuarios, presenta quejas y encuentra las mejores opciones de crédito, préstamos y servicios financieros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/instituciones" 
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Ver Instituciones
              </Link>
              <Link 
                href="/quejas/nueva" 
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Presentar Queja
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-700">50+</div>
              <div className="text-gray-600 mt-2">Instituciones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">5,000+</div>
              <div className="text-gray-600 mt-2">Evaluaciones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">1,200+</div>
              <div className="text-gray-600 mt-2">Quejas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-gray-600 mt-2">Resueltas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Institutions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Instituciones Populares
            </h2>
            <Link 
              href="/instituciones" 
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredInstitutions.map((institution) => (
              <Link 
                key={institution.id}
                href={`/instituciones/${institution.slug}`}
                className="institution-card bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                    {institution.type}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{institution.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {institution.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {institution.description}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{institution.review_count} evaluaciones</span>
                  <span className="text-red-600">{institution.complaint_count} quejas</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Complaints */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Quejas Recientes
            </h2>
            <Link 
              href="/quejas" 
              className="text-blue-700 hover:text-blue-800 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentComplaints.map((complaint) => (
              <div 
                key={complaint.id}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`complaint-badge status-${complaint.status}`}>
                    {complaint.status === 'pending' && 'Pendiente'}
                    {complaint.status === 'reviewing' && 'En Revisión'}
                    {complaint.status === 'resolved' && 'Resuelto'}
                  </span>
                  <span className="text-xs text-gray-500">{complaint.created_at}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {complaint.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Institución: <span className="font-medium">{complaint.institution}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Explora por Categoría
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/instituciones?tipo=fintech"
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors"
            >
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-blue-700">Fintech</h3>
              <p className="text-sm text-gray-600 mt-1">Apps y servicios digitales</p>
            </Link>
            
            <Link 
              href="/instituciones?tipo=sofom"
              className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center hover:border-green-400 transition-colors"
            >
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-green-700">SOFOM</h3>
              <p className="text-sm text-gray-600 mt-1">Préstamos personales</p>
            </Link>
            
            <Link 
              href="/instituciones?tipo=bank"
              className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors"
            >
              <div className="text-3xl mb-2">🏦</div>
              <h3 className="font-semibold text-purple-700">Bancos</h3>
              <p className="text-sm text-gray-600 mt-1">Bancos tradicionales</p>
            </Link>
            
            <Link 
              href="/instituciones?tipo=credit_card"
              className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center hover:border-orange-400 transition-colors"
            >
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold text-orange-700">Tarjetas</h3>
              <p className="text-sm text-gray-600 mt-1">Tarjetas de crédito</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes una experiencia con una institución financiera?
          </h2>
          <p className="text-blue-100 mb-8">
            Ayuda a otros usuarios haciendo una evaluación honesta. Tu opinión importa.
          </p>
          <Link 
            href="/evaluar"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Hacer Evaluación
          </Link>
        </div>
      </section>
    </div>
  );
}