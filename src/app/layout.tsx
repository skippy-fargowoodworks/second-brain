import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Second Brain | Fargo Woodworks",
  description: "Task management, notes, and knowledge base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.className} antialiased bg-gray-950 text-white`}>
        <Sidebar />
        {/* Mobile: top padding for header. Desktop: left margin for sidebar */}
        <main className="pt-16 min-[1536px]:pt-0 min-[1536px]:ml-72 p-4 min-[1536px]:p-10 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
