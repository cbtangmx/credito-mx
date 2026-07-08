// Institution Types
export interface Institution {
  id: string
  name: string
  slug: string
  type: 'bank' | 'fintech' | 'sofom' | 'credit_card'
  logo_url?: string
  website_url?: string
  app_url?: string
  description?: string
  rating: number
  review_count: number
  complaint_count: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

// Review Types
export interface Review {
  id: string
  institution_id: string
  user_name?: string
  rating: number
  title?: string
  content: string
  source: 'google_play' | 'app_store' | 'user'
  source_url?: string
  is_approved: boolean
  created_at: string
}

// Complaint Types
export interface Complaint {
  id: string
  institution_id: string
  user_name: string
  user_email?: string
  title: string
  content: string
  category: 'service' | 'rates' | 'charges' | 'collection' | 'other'
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected'
  resolution?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

// Category Types
export type InstitutionCategory = 'bank' | 'fintech' | 'sofom' | 'credit_card'

export const CATEGORY_LABELS: Record<InstitutionCategory, string> = {
  bank: 'Bancos',
  fintech: 'Fintech',
  sofom: 'SOFOM (Sociedades Financieras)',
  credit_card: 'Tarjetas de Crédito'
}

export const COMPLAINT_CATEGORY_LABELS: Record<string, string> = {
  service: 'Servicio al Cliente',
  rates: 'Tasas y Intereses',
  charges: 'Cargos Incorrectos',
  collection: 'Cobranza',
  other: 'Otros'
}