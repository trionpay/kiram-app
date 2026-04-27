import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kiram — Kira ve aidat odemeleri",
  description: "Kira ve aidat odemelerinizi tek yerden, guvenle yapin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
