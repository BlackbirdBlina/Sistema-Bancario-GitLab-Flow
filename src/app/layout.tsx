import type { Metadata } from "next";
import { IBM_Plex_Sans_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema Bancário",
  description:
    "Sistema Bancário para a disciplina de Gerência de Configuração e Mudanças",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${ibmPlexCondensed.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
