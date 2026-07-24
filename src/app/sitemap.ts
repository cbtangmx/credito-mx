import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.credito-mx.com'

  // ============================================
  // 10 个对比页 slug (T09 SEO)
  // ============================================
  const COMPARISON_SLUGS = [
    'stori-vs-klar',
    'nu-bank-vs-stori',
    'mercado-pago-vs-nu-bank',
    'kueski-vs-baubap',
    'konfio-vs-minu',
    'citibanamex-vs-bbva-mexico',
    'hey-banco-vs-banorte',
    'banco-azteca-vs-bancoppel',
    'stori-vs-mercado-pago',
    'nu-bank-vs-mercado-pago',
  ]

  // ============================================
  // 静态页面
  // ============================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/instituciones`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quejas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/evaluar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // 品类榜单页 (T07 SEO)
    {
      url: `${baseUrl}/mejores/tarjetas-de-credito`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mejores/fintech`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mejores/sofom`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mejores/bancos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // 对比索引页 (T09 SEO)
    {
      url: `${baseUrl}/comparar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // ============================================
  // 10 个对比详情页 (T09 SEO)
  // ============================================
  const comparisonPages: MetadataRoute.Sitemap = COMPARISON_SLUGS.map((slug) => ({
    url: `${baseUrl}/comparar/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // ============================================
  // 动态机构详情页 (40+ pages)
  // ============================================
  let institutionPages: MetadataRoute.Sitemap = []
  let complaintPages: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()

    // 获取全部机构 slug 和更新时间
    const { data: institutions } = await supabase
      .from('institutions')
      .select('slug, updated_at')
      .order('rating', { ascending: false })

    institutionPages = (institutions || []).map((inst) => ({
      url: `${baseUrl}/instituciones/${inst.slug}`,
      lastModified: inst.updated_at ? new Date(inst.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 获取全部公开投诉 ID 和创建时间
    const { data: complaints } = await supabase
      .from('complaints')
      .select('id, created_at')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    complaintPages = (complaints || []).map((comp) => ({
      url: `${baseUrl}/quejas/${comp.id}`,
      lastModified: comp.created_at ? new Date(comp.created_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    // 如果数据库连接失败，仅返回静态页面
    console.error('Sitemap generation: database error:', error)
  }

  return [...staticPages, ...comparisonPages, ...institutionPages, ...complaintPages]
}
