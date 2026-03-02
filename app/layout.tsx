import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Package, Users, Receipt, Building2, UserCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "ERP System",
  description: "Simple ERP built with Next.js",
};

const navItems = [
  { href: "/",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/produk",    label: "Produk",      icon: Package },
  { href: "/customer",  label: "Customer",    icon: Users },
  { href: "/transaksi", label: "Transaksi",   icon: Receipt },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="h-full antialiased" style={{ background: "#fdf8f8", color: "#1c0a0d" }}>
        <div className="flex h-full">

          {/* ── SIDEBAR ─────────────────────────────────────── */}
          <aside
            className="hidden md:flex w-50 flex-col shrink-0"
            style={{ background: "#fff5f6", borderRight: "1px solid #fbc8d0" }}
          >

            {/* Logo / Brand */}
            <div
              className="flex items-center gap-2.5 px-5 h-16"
              style={{ borderBottom: "1px solid #fbc8d0" }}
            >
              <div
                className="flex items-center justify-center w-7 h-7 rounded-md"
                style={{ background: "linear-gradient(135deg, #f43f5e, #fb7185)" }}
              >
                <Building2 size={14} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold tracking-tight leading-none" style={{ color: "#1c0a0d" }}>
                ERP System
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              <p
                className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "#b07a84" }}
              >
                Menu
              </p>
              {navItems.map(({ href, label, icon: Icon }) => (
                <NavLink key={href} href={href} label={label} icon={Icon} />
              ))}
            </nav>

            {/* User Footer */}
            <div className="px-3 py-4" style={{ borderTop: "1px solid #fbc8d0" }}>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: "#fce7ea", border: "1px solid #fbc8d0" }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                  style={{ background: "#fbc8d0" }}
                >
                  <UserCircle2 size={15} strokeWidth={1.75} style={{ color: "#e11d48" }} />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold" style={{ color: "#1c0a0d" }}>Admin User</p>
                  <p className="text-[10px]" style={{ color: "#b07a84" }}>admin@erp.com</p>
                </div>
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ────────────────────────────────── */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}

/* ── NavLink — komponen terpisah agar bisa pakai hover state ── */
function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 hover:bg-rose-100"
      style={{ color: "#7f4a55" }}
    >
      <Icon
        size={16}
        strokeWidth={1.75}
        className="transition-colors duration-150 group-hover:text-rose-600"
        style={{ color: "#f43f5e" }}
      />
      <span className="transition-colors duration-150 group-hover:text-rose-900">
        {label}
      </span>
    </Link>
  );
}