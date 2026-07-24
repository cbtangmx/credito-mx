import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AdSenseScript from "@/components/AdSenseScript";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Credito MX - Evaluaciones de Instituciones Financieras en México",
    template: "%s | Credito MX"
  },
  description: "Evalúa y compara instituciones financieras en México. Lee evaluaciones de usuarios, presenta quejas y encuentra las mejores opciones de crédito.",
  keywords: ["credito", "prestamos", "financiera", "banco", "fintech", "mexico", "evaluaciones", "quejas"],
  authors: [{ name: "Credito MX" }],
  creator: "Credito MX",
  metadataBase: new URL("https://www.credito-mx.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://www.credito-mx.com",
    siteName: "Credito MX",
    title: "Credito MX - Evaluaciones de Instituciones Financieras en México",
    description: "Evalúa y compara instituciones financieras en México",
    images: [
      {
        url: 'https://www.credito-mx.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Credito MX — Reseñas financieras en México',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credito MX - Evaluaciones de Instituciones Financieras en México',
    description: 'Evalúa y compara instituciones financieras en México. Lee evaluaciones de usuarios, presenta quejas y encuentra las mejores opciones de crédito.',
    images: ['https://www.credito-mx.com/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ============================================
  // JSON-LD: Organization Schema (全站)
  // ============================================
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Credito MX",
    url: "https://credito-mx.com",
    logo: "https://credito-mx.com/logo.png",
    description: "Plataforma de evaluaciones y quejas de instituciones financieras en México. Compara bancos, fintech y SOFOM con calificaciones reales de usuarios.",
    foundingDate: "2026",
    areaServed: {
      "@type": "Country",
      name: "México",
    },
    knowsLanguage: ["es-MX"],
    sameAs: [
      "https://credito-mx.com",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://credito-mx.com/contacto",
      availableLanguage: ["Spanish"],
    },
  }

  // ============================================
  // JSON-LD: WebSite Schema (搜索入口)
  // ============================================
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Credito MX",
    url: "https://credito-mx.com",
    description: "Evaluaciones y quejas de instituciones financieras en México",
    inLanguage: "es-MX",
    publisher: {
      "@type": "Organization",
      name: "Credito MX",
      url: "https://credito-mx.com",
    },
  }

  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* hreflang 标签 - 告诉搜索引擎此页面面向墨西哥西班牙语用户 */}
        <link rel="alternate" hrefLang="es-MX" href="https://www.credito-mx.com/" />
        <link rel="alternate" hrefLang="es" href="https://www.credito-mx.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.credito-mx.com/" />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <AdSenseScript />
        <Analytics />
        <GoogleAnalytics />
        {/* SEO: Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </body>
    </html>
  )
}