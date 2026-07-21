// ============================================
// 数据库类型定义
// ============================================

export type InstitutionType = 'fintech' | 'sofom' | 'bank' | 'credit_card'
export type ComplaintCategory = 'service' | 'rates' | 'charges' | 'collection' | 'other'
export type ComplaintStatus = 'pending' | 'reviewing' | 'resolved' | 'rejected'

export interface Institution {
  id: string
  name: string
  slug: string
  type: InstitutionType
  logo_url: string | null
  website_url: string | null
  app_url: string | null
  description: string | null
  rating: number
  review_count: number
  complaint_count: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  institution_id: string
  user_id: string | null
  user_name: string
  user_avatar: string | null
  rating: number
  title: string | null
  content: string
  source: 'user' | 'google_play' | 'app_store'
  source_url: string | null
  is_approved: boolean
  created_at: string
  institution?: Pick<Institution, 'id' | 'name' | 'slug'>
}

export interface Complaint {
  id: string
  institution_id: string
  user_id: string | null
  user_name: string
  user_email: string | null
  title: string
  content: string
  category: ComplaintCategory
  status: ComplaintStatus
  resolution: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  institution?: Pick<Institution, 'id' | 'name' | 'slug'>
}

export const TYPE_LABELS: Record<InstitutionType, string> = {
  fintech: 'Fintech',
  sofom: 'SOFOM',
  bank: 'Banco',
  credit_card: 'Tarjeta de Crédito'
}

export const TYPE_COLORS: Record<InstitutionType, string> = {
  fintech: 'bg-blue-100 text-blue-700',
  sofom: 'bg-green-100 text-green-700',
  bank: 'bg-purple-100 text-purple-700',
  credit_card: 'bg-orange-100 text-orange-700'
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  service: 'Servicio al Cliente',
  rates: 'Tasas e Intereses',
  charges: 'Cargos',
  collection: 'Cobranza',
  other: 'Otros'
}

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: 'Pendiente',
  reviewing: 'En Revisión',
  resolved: 'Resuelto',
  rejected: 'Rechazado'
}

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
}
