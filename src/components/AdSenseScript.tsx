'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function AdSenseScript() {
  const [consent, setConsent] = useState<boolean>(false)

  useEffect(() => {
    // Check cookie consent
    const checkConsent = () => {
      const value = localStorage.getItem('cookie-consent')
      setConsent(value === 'accepted')
    }

    checkConsent()

    // Listen for consent updates
    window.addEventListener('cookie-consent-updated', checkConsent)
    return () => window.removeEventListener('cookie-consent-updated', checkConsent)
  }, [])

  // Replace with your actual AdSense Publisher ID after approval
  // Format: ca-pub-XXXXXXXXXXXXXXXX
  const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID

  // Don't load if user hasn't accepted cookies or no AdSense ID configured
  if (!consent || !ADSENSE_ID) {
    return null
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
