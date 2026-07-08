import Link from "next/link";

// Mock data - will be replaced with Supabase data
const institutions = [
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
  },
  {
    id: "5",
    name: "Minu",
    slug: "minu",
    type: "fintech",
    rating: 4.0,
    review_count: 680,
    complaint_count: 22,
    description: "Préstamos para empleados con descuento directo"
  },
  {
    id: "6",
    name: "Konfio",
    slug: "konfio",
    type: "fintech",
    rating: 4.3,
    review_count: 520,
    complaint_count: 18,
    description: "Préstamos para pequeñas empresas"
  }
];

export default function InstitutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Instituciones Financieras en México
          </h1>
          <p className="text-gray-600 mt-2">
            Evaluaciones y quejas de usuarios sobre bancos, fintech y SOFOM
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/instituciones"
              className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium"
            >
              Todas
            </Link>
            <Link 
              href="/instituciones?tipo=fintech"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100"
            >
              Fintech
            </Link>
            <Link 
              href="/instituciones?tipo=sofom"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100"
            >
              SOFOM
            </Link>
            <Link 
              href="/instituciones?tipo=bank"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100"
            >
              Bancos
            </Link>
            <Link 
              href="/instituciones?tipo=credit_card"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100"
            >
              Tarjetas
            </Link>
          </div>
        </div>
      </section>

      {/* Institution Grid */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution) => (
              <Link 
                key={institution.id}
                href={`/instituciones/${institution.slug}`}
                className="institution-card bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    institution.type === 'fintech' ? 'bg-blue-100 text-blue-700' :
                    institution.type === 'sofom' ? 'bg-green-100 text-green-700' :
                    institution.type === 'bank' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
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
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-blue-700 font-medium text-sm">
                    Ver detalles →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}