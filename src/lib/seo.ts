// ============================================
// SEO 工具函数库 - T11 + T13
// buildMetadata: 统一生成 OG + Twitter Card 元数据
// buildBreadcrumbJsonLd: 生成 BreadcrumbList JSON-LD
// ============================================

import type { Metadata } from 'next'

// ============================================
// 常量
// ============================================
export const BASE_URL = 'https://www.credito-mx.com'
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`
export const SITE_NAME = 'Credito MX'

// ============================================
// BreadcrumbList 类型定义
// ============================================
type BreadcrumbItem = {
  name: string
  url: string
}

// ============================================
// buildBreadcrumbJsonLd
// 生成 BreadcrumbList JSON-LD Schema
// ============================================
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ============================================
// PageMetaInput - buildMetadata 的输入参数
// ============================================
interface PageMetaInput {
  title: string
  description: string
  url: string // 相对路径，如 /instituciones/stori
  type?: 'website' | 'article'
  image?: string
  imageAlt?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

// ============================================
// buildMetadata
// 统一构建包含 OG + Twitter Card 的 Metadata 对象
// ============================================
export function buildMetadata({
  title,
  description,
  url,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  imageAlt = SITE_NAME,
  publishedTime,
  modifiedTime,
  author,
  section,
}: PageMetaInput): Metadata {
  const fullUrl = `${BASE_URL}${url}`
  const twitterTitle = title.length > 70 ? title.substring(0, 67) + '...' : title
  const twitterDesc =
    description.length > 200 ? description.substring(0, 197) + '...' : description

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type,
      url: fullUrl,
      siteName: SITE_NAME,
      locale: 'es_MX',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDesc,
      images: [image],
    },
  }
}
