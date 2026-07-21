import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Presentar una Queja",
  description: "Presenta una queja sobre una institución financiera en México. Tu voz ayuda a otros usuarios a tomar decisiones informadas.",
  alternates: {
    canonical: "/quejas/nueva",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function NuevaQuejaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
