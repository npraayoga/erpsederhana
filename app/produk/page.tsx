import { prisma } from "@/lib/prisma";
import FormTambahProduk from "./FormTambahProduk";
import { Package } from "lucide-react";

export default async function Produk() {
  const produkList = await prisma.produk.findMany({
    orderBy: { createdAt: "desc" },
  });

  const isEmpty = produkList.length === 0;

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto space-y-8">

      {/* ── Page Header ─────────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 ring-1 ring-slate-200">
              <Package size={14} className="text-slate-600" strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Inventaris
            </p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Data Produk
          </h1>
          <p className="text-sm text-slate-500">
            Kelola daftar produk dan inventaris toko Anda.
          </p>
        </div>

        <div className="shrink-0 self-start sm:mt-1">
          <FormTambahProduk produkList={produkList} />
        </div>
      </header>

      {/* ── Stat Strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Produk", value: produkList.length },
          { label: "Ditambahkan Hari Ini", value: produkList.filter(p => {
            const today = new Date();
            const created = new Date(p.createdAt);
            return created.toDateString() === today.toDateString();
          }).length },
          { label: "Status", value: isEmpty ? "Kosong" : "Aktif" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-white border border-slate-200/80 px-5 py-4 shadow-sm"
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Content Card ────────────────────────────────────── */}
      <section className="rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Daftar Produk</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {produkList.length} produk terdaftar
            </p>
          </div>
          {/* Placeholder: search / filter bisa diletakkan di sini */}
        </div>

        {/* Card Body */}
        <div className="p-6">
          {isEmpty ? (
            <EmptyState />
          ) : (
            <ProductTable produkList={produkList} />
          )}
        </div>

      </section>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
        <Package size={18} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">Belum ada produk</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Tambahkan produk pertama Anda menggunakan tombol di atas.
        </p>
      </div>
    </div>
  );
}

type Produk = {
  id: string | number;
  nama: string;
  harga: number;
  stok: number;
  createdAt: Date;
};

function ProductTable({ produkList }: { produkList: Produk[] }) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {["Nama Produk", "Harga", "Stok", "Tanggal Ditambahkan"].map((col) => (
              <th
                key={col}
                className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 pr-6 last:pr-0"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {produkList.map((produk) => (
            <tr
              key={produk.id}
              className="group hover:bg-slate-50/70 transition-colors duration-100"
            >
              <td className="py-3.5 pr-6 font-medium text-slate-800">
                {produk.nama}
              </td>
              <td className="py-3.5 pr-6 text-slate-600 tabular-nums">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(produk.harga)}
              </td>
              <td className="py-3.5 pr-6">
                <StokBadge stok={produk.stok} />
              </td>
              <td className="py-3.5 text-slate-400 tabular-nums text-xs">
                {new Date(produk.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StokBadge({ stok }: { stok: number }) {
  const isLow = stok > 0 && stok <= 10;
  const isEmpty = stok === 0;

  if (isEmpty) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Habis
      </span>
    );
  }

  if (isLow) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Stok Rendah · {stok}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      {stok}
    </span>
  );
}