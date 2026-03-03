"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart2, ChevronRight } from "lucide-react";

/* ── Types ────────────────────────────────────────────────── */
type FilterType = "mingguan" | "bulanan";

type DataPoint = {
  name: string;
  Elektronik: number;
  Aksesoris: number;
  Peripheral: number;
  Jaringan: number;
};

/* ── Static Data ──────────────────────────────────────────── */
const DATA_BULANAN: DataPoint[] = [
  { name: "Okt",  Elektronik: 32000000, Aksesoris: 8500000,  Peripheral: 11200000, Jaringan: 5400000  },
  { name: "Nov",  Elektronik: 41000000, Aksesoris: 12300000, Peripheral: 9800000,  Jaringan: 7100000  },
  { name: "Des",  Elektronik: 58000000, Aksesoris: 19800000, Peripheral: 14500000, Jaringan: 9200000  },
  { name: "Jan",  Elektronik: 29000000, Aksesoris: 7400000,  Peripheral: 8900000,  Jaringan: 4800000  },
  { name: "Feb",  Elektronik: 37500000, Aksesoris: 10200000, Peripheral: 12100000, Jaringan: 6300000  },
  { name: "Mar",  Elektronik: 48000000, Aksesoris: 14600000, Peripheral: 13800000, Jaringan: 8500000  },
];

const DATA_MINGGUAN: DataPoint[] = [
  { name: "Mg 1", Elektronik: 10200000, Aksesoris: 3100000, Peripheral: 4200000, Jaringan: 2100000 },
  { name: "Mg 2", Elektronik: 13500000, Aksesoris: 4800000, Peripheral: 3900000, Jaringan: 2600000 },
  { name: "Mg 3", Elektronik: 11800000, Aksesoris: 3600000, Peripheral: 3200000, Jaringan: 1900000 },
  { name: "Mg 4", Elektronik: 12500000, Aksesoris: 3100000, Peripheral: 2500000, Jaringan: 1900000 },
];

/* Sesuai tema slate dashboard */
const CATEGORY_COLORS: Record<string, string> = {
  Elektronik: "#0f172a",   // slate-900
  Aksesoris:  "#475569",   // slate-600
  Peripheral: "#94a3b8",   // slate-400
  Jaringan:   "#cbd5e1",   // slate-300
};

const CATEGORIES = ["Elektronik", "Aksesoris", "Peripheral", "Jaringan"] as const;

/* ── Helpers ──────────────────────────────────────────────── */
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatRupiahFull = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

/* ── Custom Tooltip ───────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum: number, p: any) => sum + p.value, 0);

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-lg p-3.5 min-w-[200px]">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-sm shrink-0"
                style={{ backgroundColor: p.fill }}
              />
              <span className="text-xs text-slate-600">{p.name}</span>
            </div>
            <span className="text-xs font-semibold text-slate-800 tabular-nums">
              {formatRupiah(p.value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between">
        <span className="text-xs text-slate-400">Total</span>
        <span className="text-xs font-bold text-slate-900 tabular-nums">{formatRupiah(total)}</span>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function SalesBarChart() {
  const [filter, setFilter] = useState<FilterType>("bulanan");
  const [activeBar, setActiveBar] = useState<string | null>(null);

  const data = filter === "bulanan" ? DATA_BULANAN : DATA_MINGGUAN;

  const totalRevenue = useMemo(() =>
    data.reduce((sum, d) =>
      sum + CATEGORIES.reduce((s, c) => s + (d[c] as number), 0), 0
    ), [data]);

  const topCategory = useMemo(() => {
    const totals = CATEGORIES.map((c) => ({
      name: c,
      total: data.reduce((s, d) => s + (d[c] as number), 0),
    }));
    return totals.sort((a, b) => b.total - a.total)[0];
  }, [data]);

  return (
    <section className="rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">

      {/* ── Card Header ─────────────────────────────────── */}
      <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 ring-1 ring-slate-200 mt-0.5 shrink-0">
            <BarChart2 size={14} className="text-slate-600" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Penjualan per Kategori
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Perbandingan total penjualan berdasarkan kategori produk
            </p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 ring-1 ring-slate-200 shrink-0">
          {(["mingguan", "bulanan"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all duration-150 ${
                filter === f
                  ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary Strip ───────────────────────────────── */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
        <div className="px-6 py-3">
          <p className="text-xs text-slate-400">Total Revenue ({filter})</p>
          <p className="text-lg font-semibold text-slate-900 tabular-nums mt-0.5">
            {formatRupiah(totalRevenue)}
          </p>
        </div>
        <div className="px-6 py-3">
          <p className="text-xs text-slate-400">Kategori Teratas</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[topCategory.name] }}
            />
            <p className="text-lg font-semibold text-slate-900">{topCategory.name}</p>
            <p className="text-xs text-slate-400 tabular-nums self-end mb-0.5">
              {formatRupiah(topCategory.total)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────── */}
      <div className="px-6 pt-5 pb-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            barCategoryGap="28%"
            barGap={3}
            onMouseLeave={() => setActiveBar(null)}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tickFormatter={formatRupiah}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#f8fafc", radius: 4 }}
            />
            {CATEGORIES.map((category) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                radius={
                  category === "Jaringan"
                    ? [4, 4, 0, 0]
                    : [0, 0, 0, 0]
                }
                onMouseEnter={() => setActiveBar(category)}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[category]}
                    opacity={
                      activeBar === null || activeBar === category ? 1 : 0.45
                    }
                    style={{ transition: "opacity 150ms ease" }}
                  />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Legend ──────────────────────────────────────── */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onMouseEnter={() => setActiveBar(cat)}
              onMouseLeave={() => setActiveBar(null)}
              className="flex items-center gap-1.5 group"
            >
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0 transition-transform duration-150 group-hover:scale-125"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              />
              <span className="text-xs text-slate-500 group-hover:text-slate-800 transition-colors duration-150">
                {cat}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Card Footer ─────────────────────────────────── */}
      <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
        <Link
          href="/transaksi"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
        >
          Lihat detail laporan penjualan
          <ChevronRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}