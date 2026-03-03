"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Receipt,
  Building2,
  UserCircle2,
  BookOpen,
  BarChart3,
  ShoppingCart,
  Factory,
  Layers,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  Settings,
  Wrench,
  FileText,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
type NavItem = {
  href:    string;
  label:   string;
  icon:    React.ElementType;
  badge?:  string;
};

type NavGroup = {
  section: string;
  items:   NavItem[];
};

/* ── Nav Structure ─────────────────────────────────────────── */
const NAV_GROUPS: NavGroup[] = [
  {
    section: "Utama",
    items: [
      { href: "/",           label: "Dashboard",   icon: LayoutDashboard },
      { href: "/produk",     label: "Produk",       icon: Package },
      { href: "/customer",   label: "Customer",     icon: Users },
      { href: "/transaksi",  label: "Transaksi",    icon: Receipt },
    ],
  },
  {
    section: "Akuntansi",
    items: [
      { href: "/jurnal",       label: "Jurnal & Buku Besar",  icon: BookOpen },
      { href: "/laporan",      label: "Laporan Keuangan",     icon: BarChart3 },
      { href: "/pembelian",    label: "Purchase Order",       icon: ShoppingCart },
      { href: "/invoice",      label: "Invoice & Tagihan",    icon: FileText },
    ],
  },
  {
    section: "Produksi",
    items: [
      { href: "/bom",          label: "Bill of Materials",    icon: Layers },
      { href: "/manufaktur",   label: "Manufaktur",           icon: Factory },
      { href: "/aset",         label: "Manajemen Aset",       icon: Wrench },
    ],
  },
];

/* ── Quick Action ──────────────────────────────────────────── */
const QUICK_ACTION = {
  href:  "/transaksi/baru",
  label: "Transaksi Baru",
};

/* ── Root Sidebar ──────────────────────────────────────────── */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 transition-all duration-300 ease-in-out relative"
      style={{
        width:       collapsed ? "64px" : "220px",
        background:  "#fff5f6",
        borderRight: "1px solid #fbc8d0",
      }}
    >
      {/* ── Logo / Brand ── */}
      <div
        className="flex items-center h-16 px-4 shrink-0 overflow-hidden"
        style={{ borderBottom: "1px solid #fbc8d0" }}
      >
        <div
          className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
          style={{ background: "linear-gradient(135deg, #f43f5e, #fb7185)" }}
        >
          <Building2 size={14} className="text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <span
            className="ml-2.5 text-sm font-semibold tracking-tight leading-none whitespace-nowrap overflow-hidden transition-all duration-200"
            style={{ color: "#1c0a0d" }}
          >
            ERP System
          </span>
        )}
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-[52px] z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-md transition-all duration-150 hover:shadow-lg"
        style={{ border: "1px solid #fbc8d0" }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={11} style={{ color: "#f43f5e" }} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={11} style={{ color: "#f43f5e" }} strokeWidth={2.5} />
        )}
      </button>

      {/* ── Quick Action ── */}
      <div className={`px-3 pt-4 pb-2 ${collapsed ? "flex justify-center" : ""}`}>
        <Link
          href={QUICK_ACTION.href}
          className="flex items-center justify-center gap-2 rounded-lg text-xs font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #f43f5e, #fb7185)",
            padding:    collapsed ? "8px" : "8px 12px",
            width:      collapsed ? "36px" : "100%",
            height:     "36px",
          }}
          title={collapsed ? QUICK_ACTION.label : undefined}
        >
          <Plus size={14} strokeWidth={2.5} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">{QUICK_ACTION.label}</span>}
        </Link>
      </div>

      {/* ── Navigation Groups ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin">
        {NAV_GROUPS.map(({ section, items }) => (
          <div key={section}>
            {/* Section label — hanya tampil saat expanded */}
            {!collapsed && (
              <p
                className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "#b07a84" }}
              >
                {section}
              </p>
            )}

            {/* Divider saat collapsed */}
            {collapsed && (
              <div className="my-1 mx-auto w-6 border-t" style={{ borderColor: "#fbc8d0" }} />
            )}

            <div className="space-y-0.5">
              {items.map(({ href, label, icon: Icon, badge }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className="group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      gap:        collapsed ? 0 : "10px",
                      padding:    collapsed ? "9px" : "9px 10px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: isActive ? "#fce7ea"  : "transparent",
                      color:      isActive ? "#e11d48"  : "#7f4a55",
                      boxShadow:  isActive ? "inset 2px 0 0 #f43f5e" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fce7ea";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={isActive ? 2.25 : 1.75}
                      style={{ color: isActive ? "#f43f5e" : "#f43f5e", opacity: isActive ? 1 : 0.7 }}
                      className="shrink-0"
                    />
                    {!collapsed && (
                      <span
                        className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis leading-none"
                        style={{ color: isActive ? "#be123c" : "#7f4a55" }}
                      >
                        {label}
                      </span>
                    )}
                    {!collapsed && badge && (
                      <span
                        className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#fbc8d0", color: "#e11d48" }}
                      >
                        {badge}
                      </span>
                    )}

                    {/* Tooltip saat collapsed */}
                    {collapsed && (
                      <span
                        className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
                        style={{
                          background: "#1c0a0d",
                          color:      "#fff5f6",
                        }}
                      >
                        {label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="px-3 py-3 space-y-1" style={{ borderTop: "1px solid #fbc8d0" }}>

        {/* Settings */}
        <Link
          href="/pengaturan"
          title={collapsed ? "Pengaturan" : undefined}
          className="group relative flex items-center rounded-lg text-xs font-medium transition-all duration-150"
          style={{
            gap:           collapsed ? 0 : "10px",
            padding:       collapsed ? "8px" : "8px 10px",
            justifyContent: collapsed ? "center" : "flex-start",
            color:         "#b07a84",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fce7ea"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <Settings size={14} strokeWidth={1.75} style={{ color: "#f43f5e", opacity: 0.6 }} className="shrink-0" />
          {!collapsed && <span>Pengaturan</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50"
              style={{ background: "#1c0a0d", color: "#fff5f6" }}>
              Pengaturan
            </span>
          )}
        </Link>

        {/* User card */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{
            gap:        collapsed ? 0 : "10px",
            padding:    collapsed ? "8px" : "8px 10px",
            background: "#fce7ea",
            border:     "1px solid #fbc8d0",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full shrink-0"
            style={{ background: "#fbc8d0" }}
          >
            <UserCircle2 size={15} strokeWidth={1.75} style={{ color: "#e11d48" }} />
          </div>
          {!collapsed && (
            <div className="flex-1 leading-tight overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: "#1c0a0d" }}>Admin User</p>
              <p className="text-[10px] truncate" style={{ color: "#b07a84" }}>admin@erp.com</p>
            </div>
          )}
          {!collapsed && (
            <button
              className="ml-auto shrink-0 p-1 rounded-md transition-colors hover:bg-rose-100"
              title="Logout"
            >
              <LogOut size={12} strokeWidth={2} style={{ color: "#b07a84" }} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}