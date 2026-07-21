// ============================================
// Google Analytics 4 组件
// 尊重 Cookie 同意：仅在用户接受 Cookie 后加载 gtag.js
// 与 CookieConsent 组件配合工作
// ============================================

'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { GA_MEASUREMENT_ID } from '@/lib/ga'

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState<boolean>(false)

  // 监听 Cookie 同意状态
  useEffect(() => {
    const checkConsent = () => {
      const value = localStorage.getItem('cookie-consent')
      setConsent(value === 'accepted')
    }

    checkConsent()

    // 监听同意状态更新事件
    window.addEventListener('cookie-consent-updated', checkConsent)
    return () => window.removeEventListener('cookie-consent-updated', checkConsent)
  }, [])

  // 未配置 GA4 ID 或用户未同意 → 不加载
  if (!GA_MEASUREMENT_ID || !consent) {
    return null
  }

  return (
    <>
      {/* GA4 gtag.js 脚本 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {/* GA4 初始化配置 */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            anonymize_ip: true,
            language: 'es-MX'
          });
        `}
      </Script>
    </>
  )
}
