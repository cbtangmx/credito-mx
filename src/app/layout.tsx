import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  metadataBase: new URL("https://credito-mx.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://credito-mx.com",
    siteName: "Credito MX",
    title: "Credito MX - Evaluaciones de Instituciones Financieras en México",
    description: "Evalúa y compara instituciones financieras en México",
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
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}