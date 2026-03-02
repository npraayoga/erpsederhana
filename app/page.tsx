import Link from "next/link";
import {
  Package,
  Users,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Minus,
  LayoutDashboard,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

/* ── Types ────────────────────────────────────────────────── */
type StatusType = "Selesai" | "Proses" | "Pending";

type RecentTransaction = {
  id: string;
  customer: string;
  produk: string;
  total: number;
  status: StatusType;
  tanggal: string;
};

/* ── Static Data (ganti dengan Prisma query saat siap) ────── */
const STATS = [
  {
    label:    "Total Produk",
    value:    "128",
    delta:    "+12 produk baru",
    trend:    "up" as const,
    icon:     Package,
    href:     "/produk",
  },
  {
    label:    "Total Customer",
    value:    "64",
    delta:    "+5 customer baru",
    trend:    "up" as const,
    icon:     Users,
    href:     "/customer",
  },
  {
    label:    "Transaksi Bulan Ini",
    value:    "32",
    delta:    "Sama seperti bulan lalu",
    trend:    "neutral" as const,
    icon:     Receipt,
    href:     "/transaksi",
  },
  {
    label:    "Total Revenue",
    value:    "Rp 48jt",
    delta:    "+8% dari bulan lalu",
    trend:    "up" as const,
    icon:     TrendingUp,
    href:     "/transaksi",
  },
];

const RECENT_TRANSACTIONS: RecentTransaction[] = [
  { id: "001", customer: "Budi Santoso", produk: "Laptop ASUS",         total: 8500000, status: "Selesai", tanggal: "2026-03-01" },
  { id: "002", customer: "Siti Rahayu",  produk: "Monitor LG",          total: 3200000, status: "Proses",  tanggal: "2026-03-01" },
  { id: "003", customer: "Andi Wijaya",  produk: "Keyboard Mechanical", total: 1200000, status: "Pending", tanggal: "2026-03-02" },
  { id: "004", customer: "Dewi Lestari", produk: "Mouse Logitech",      total: 1350000, status: "Selesai", tanggal: "2026-03-02" },
];

const STATUS_CONFIG: Record<StatusType, { dot: string; badge: string; label: string }> = {
  Selesai: { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Selesai" },
  Proses:  { dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 ring-amber-200",       label: "Diproses" },
  Pending: { dot: "bg-slate-300",   badge: "bg-slate-100 text-slate-600 ring-slate-200",      label: "Pending" },
};

/* ── Helpers ──────────────────────────────────────────────── */
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

const now = new Date();
const greetingHour = now.getHours();
const greeting =
  greetingHour < 11 ? "Selamat pagi" :
  greetingHour < 15 ? "Selamat siang" :
  greetingHour < 18 ? "Selamat sore" : "Selamat malam";

/* ── Page ─────────────────────────────────────────────────── */
export default function Dashboard() {
  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto space-y-8">

      {/* ── Page Header ──────────────────────────────────── */}
      <header className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 ring-1 ring-slate-200">
            <LayoutDashboard size={14} className="text-slate-600" strokeWidth={1.75} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Overview
          </p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          {greeting}, Admin 👋
        </h1>
        <p className="text-sm text-slate-500">
          Berikut ringkasan bisnis Anda hari ini,{" "}
          <span className="text-slate-700 font-medium">
            {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </p>
      </header>

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map(({ label, value, delta, trend, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group relative rounded-xl bg-white border border-slate-200/80 px-5 py-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden"
          >
            {/* Background icon — dekoratif */}
            <div className="absolute -right-3 -top-3 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-200">
              <Icon size={72} strokeWidth={1.5} className="text-slate-900" />
            </div>

            <div className="relative space-y-3">
              {/* Label + Icon */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider leading-none">
                  {label}
                </p>
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 ring-1 ring-slate-200 group-hover:bg-slate-900 group-hover:ring-slate-900 transition-colors duration-200">
                  <Icon size={13} className="text-slate-500 group-hover:text-white transition-colors duration-200" strokeWidth={2} />
                </div>
              </div>

              {/* Value */}
              <p className="text-2xl font-semibold tabular-nums text-slate-900 leading-none">
                {value}
              </p>

              {/* Delta */}
              <div className="flex items-center gap-1">
                {trend === "up" ? (
                  <ArrowUpRight size={13} className="text-emerald-500 shrink-0" strokeWidth={2.5} />
                ) : (
                  <Minus size={13} className="text-slate-400 shrink-0" strokeWidth={2.5} />
                )}
                <p className={`text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-slate-400"}`}>
                  {delta}
                </p>
              </div>
            </div>

            {/* Hover arrow */}
            <ChevronRight
              size={14}
              className="absolute bottom-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              strokeWidth={2}
            />
          </Link>
        ))}
      </div>

      {/* ── Recent Transactions ──────────────────────────── */}
      <section className="rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Transaksi Terakhir</h2>
            <p className="text-xs text-slate-400 mt-0.5">{RECENT_TRANSACTIONS.length} transaksi terbaru</p>
          </div>
          <Link
            href="/transaksi"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
          >
            Lihat semua
            <ChevronRight size={13} strokeWidth={2} />
          </Link>
        </div>

        {/* Table */}
        <div className="px-6 pb-2">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["ID", "Tanggal", "Customer", "Produk", "Total", "Status"].map((col) => (
                    <th
                      key={col}
                      className="py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 pr-6 last:pr-0"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_TRANSACTIONS.map((trx) => (
                  <tr key={trx.id} className="group hover:bg-slate-50/70 transition-colors duration-100">

                    <td className="py-3.5 pr-6 text-slate-400 text-xs tabular-nums font-mono">
                      #{trx.id}
                    </td>

                    <td className="py-3.5 pr-6 text-slate-500 text-xs tabular-nums whitespace-nowrap">
                      {formatDate(trx.tanggal)}
                    </td>

                    <td className="py-3.5 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 ring-1 ring-slate-200 shrink-0 text-xs font-semibold text-slate-600">
                          {trx.customer.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800 whitespace-nowrap">{trx.customer}</span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-6">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag size={11} strokeWidth={1.75} className="text-slate-400 shrink-0" />
                        <span className="text-slate-600 whitespace-nowrap">{trx.produk}</span>
                      </div>
                    </td>

                    <td className="py-3.5 pr-6 tabular-nums font-medium text-slate-800 whitespace-nowrap">
                      {formatRupiah(trx.total)}
                    </td>

                    <td className="py-3.5">
                      <StatusBadge status={trx.status} />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
          <Link
            href="/transaksi"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
          >
            Lihat seluruh riwayat transaksi
            <ChevronRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </section>

    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────── */
function StatusBadge({ status }: { status: StatusType }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}