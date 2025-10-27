import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import { Providers } from "@/components/providers";

const lato = localFont({
  src: "../public/fonts/Lato-Regular.ttf",
  variable: "--font-lato"
})

const recoleta = localFont({
  src: "../public/fonts/Recoleta-Regular.woff2",
  variable: "--font-recoleta",
});

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "Generate professional invoices instantly",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${recoleta.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
