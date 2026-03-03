import { prisma } from "@/lib/prisma";
import ProdukClient from "./ProdukClient";
import { Package } from "lucide-react";

export default async function ProdukPage() {
  const produkList = await prisma.produk.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto space-y-8">

      {/* ── Page Header (murni display, tidak ada tombol di sini) ── */}
      <header className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-rose-50 ring-1 ring-rose-100">
            <Package size={14} className="text-rose-500" strokeWidth={1.75} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">
            Inventaris
          </p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-rose-950 md:text-3xl">
          Data Produk
        </h1>
        <p className="text-sm text-rose-400">
          Kelola daftar produk dan inventaris toko Anda.
        </p>
      </header>

      {/*
        ProdukClient menangani SEMUA interaksi:
        - Stat strip
        - Card header dengan tombol "+ Tambah Produk"
        - Tabel produk
        - Modal form tambah / edit
      */}
      <ProdukClient produkList={produkList} />

    </div>
  );
}