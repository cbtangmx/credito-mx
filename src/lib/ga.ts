// ============================================
// Google Analytics 4 事件跟踪工具函数
// 文档: https://developers.google.com/analytics/devguides/collection/ga4/events
// ============================================

// GA4 Measurement ID（从环境变量读取）
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// gtag 类型声明
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set' | 'consent',
      targetOrAction: string,
      params?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}

// ============================================
// 检查 Cookie 同意状态
// ============================================
function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('cookie-consent') === 'accepted'
}

// ============================================
// 发送 GA4 事件
// 仅在用户同意 Cookie 且 GA4 ID 已配置时发送
// ============================================
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return
  if (!GA_MEASUREMENT_ID) return
  if (!hasAnalyticsConsent()) return
  if (typeof window.gtag !== 'function') return

  window.gtag('event', eventName, eventParams)
}

// ============================================
// 预定义事件跟踪函数
// ============================================

// 评价提交成功
export function trackReviewSubmit(params: {
  institution_slug: string
  institution_name: string
  rating: number
}): void {
  trackEvent('review_submit', {
    ...params,
    event_category: 'engagement',
    event_label: params.institution_name,
    value: params.rating,
  })
}

// 投诉提交成功
export function trackComplaintSubmit(params: {
  institution_slug: string
  institution_name: string
  category: string
}): void {
  trackEvent('complaint_submit', {
    ...params,
    event_category: 'engagement',
    event_label: params.institution_name,
  })
}

// 查看机构详情页
export function trackViewInstitution(params: {
  institution_slug: string
  institution_name: string
  institution_type: string
  rating: number
}): void {
  trackEvent('view_institution', {
    ...params,
    event_category: 'engagement',
    event_label: params.institution_name,
  })
}

// 点击访问机构官网
export function trackClickExternalLink(params: {
  institution_slug: string
  institution_name: string
  link_url: string
}): void {
  trackEvent('click_external_link', {
    ...params,
    event_category: 'engagement',
    event_label: params.institution_name,
    link_url: params.link_url,
  })
}

// 点击写评价按钮
export function trackClickWriteReview(params: {
  institution_slug: string
  institution_name: string
}): void {
  trackEvent('click_write_review', {
    ...params,
    event_category: 'engagement',
    event_label: params.institution_name,
  })
}

// 搜索机构
export function trackSearch(params: {
  search_term: string
  result_count?: number
}): void {
  trackEvent('search', {
    ...params,
    event_category: 'engagement',
  })
}
