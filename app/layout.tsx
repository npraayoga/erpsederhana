import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ERP System",
  description: "Simple ERP built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="h-full antialiased" style={{ background: "#fdf8f8", color: "#1c0a0d" }}>
        <div className="flex h-full">

          {/* ── SIDEBAR (client component) ── */}
          <Sidebar />

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}