import type { Metadata } from "next"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: "Escribir Evaluación",
    description: "Comparte tu experiencia con esta institución financiera. Tu evaluación ayuda a otros usuarios a tomar decisiones informadas.",
    alternates: {
      canonical: `/instituciones/${slug}/resena`,
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default function ResenaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
