// ============================================
// 机构详情页 GA4 事件跟踪组件
// 客户端组件 - 在服务端机构详情页中嵌入
// 跟踪：页面浏览事件（view_institution）
// ============================================

'use client'

import { useEffect } from 'react'
import { trackViewInstitution } from '@/lib/ga'

type Props = {
  institutionSlug: string
  institutionName: string
  institutionType: string
  rating: number
}

export default function InstitutionTracker({
  institutionSlug,
  institutionName,
  institutionType,
  rating,
}: Props) {
  // 页面加载时跟踪 view_institution 事件
  useEffect(() => {
    trackViewInstitution({
      institution_slug: institutionSlug,
      institution_name: institutionName,
      institution_type: institutionType,
      rating,
    })
  }, [institutionSlug, institutionName, institutionType, rating])

  // 不渲染任何 UI
  return null
}
