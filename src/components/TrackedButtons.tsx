// ============================================
// 带事件跟踪的按钮组件
// 客户端组件 - 用于服务端机构详情页中的操作按钮
// 跟踪：外部链接点击、写评价按钮点击
// ============================================

'use client'

import Link from 'next/link'
import { trackClickExternalLink, trackClickWriteReview } from '@/lib/ga'

type Props = {
  institutionSlug: string
  institutionName: string
  websiteUrl?: string | null
}

export default function TrackedButtons({
  institutionSlug,
  institutionName,
  websiteUrl,
}: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackClickExternalLink({
              institution_slug: institutionSlug,
              institution_name: institutionName,
              link_url: websiteUrl,
            })
          }
          className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Visitar sitio web →
        </a>
      )}
      <Link
        href={`/instituciones/${institutionSlug}/resena`}
        onClick={() =>
          trackClickWriteReview({
            institution_slug: institutionSlug,
            institution_name: institutionName,
          })
        }
        className="px-4 py-2 bg-white text-blue-700 border border-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
      >
        Escribir evaluación
      </Link>
    </div>
  )
}
