// Layout matching Final-Website exactly
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PgHeader from "@/components/PgHeader";

// SF Pro-inspired typography - exact match for Final-Website
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Custom Closet Doors Ottawa | Professional Installation | PG Closets",
  description: "Beautiful closet doors that make your home amazing. Official Renin dealer in Ottawa with barn, bypass & bifold doors. Professional installation and quotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-light`}>
        <PgHeader />
        <main className="pt-32">
          {children}
        </main>
      </body>
    </html>
  );
}
