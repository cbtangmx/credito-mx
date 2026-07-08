# Credito MX - 墨西哥金融评价社区

一个用于评价墨西哥金融机构的 Web 平台，帮助用户分享贷款体验、提交投诉、比较机构。

## 技术栈

- **前端**: Next.js 16 + TypeScript + Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel

## 功能

- 机构列表和详情展示
- 用户评价和投诉系统
- SEO 优化（sitemap, robots.txt）
- 西班牙语内容

## 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 环境变量

创建 `.env.local` 文件：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 部署

项目已配置好 Vercel 部署，只需连接 GitHub repo 到 Vercel 即可自动部署。

## License

MIT