"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil, Trash2, Loader2, Package } from "lucide-react";

/* ── Types ────────────────────────────────────────────────── */
export type Produk = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  createdAt?: Date | string | null;
};

type FormState = {
  nama: string;
  kategori: string;
  harga: string;
  stok: string;
};

/* ── Constants ────────────────────────────────────────────── */
const EMPTY_FORM: FormState = { nama: "", kategori: "", harga: "", stok: "" };

const FORM_FIELDS = [
  { key: "nama",     label: "Nama Produk", type: "text",   placeholder: "contoh: Laptop ASUS" },
  { key: "kategori", label: "Kategori",    type: "text",   placeholder: "contoh: Elektronik" },
  { key: "harga",    label: "Harga (Rp)",  type: "number", placeholder: "contoh: 8500000" },
  { key: "stok",     label: "Stok",        type: "number", placeholder: "contoh: 10" },
] as const;

/* ════════════════════════════════════════════════════════════
   EXPORT 1 — TambahProdukButton
   Diletakkan di <header> pada page.tsx (server component)
════════════════════════════════════════════════════════════ */
export function TambahProdukButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-rose-700 active:bg-rose-800"
    >
      <Plus size={15} strokeWidth={2.5} />
      Tambah Produk
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   EXPORT 2 — ProdukClient (default)
   Wrapper utama: memegang semua state dan meng-compose
   TambahProdukButton + ProdukTable + Modal bersama-sama.
════════════════════════════════════════════════════════════ */
export default function ProdukClient({ produkList }: { produkList: Produk[] }) {
  const router = useRouter();
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editProduk, setEditProduk] = useState<Produk | null>(null);
  const [form, setForm]             = useState<FormState>(EMPTY_FORM);

  /* ── Helpers ────────────────────────────────────────────── */
  function handleClose() {
    setShowForm(false);
    setEditProduk(null);
    setForm(EMPTY_FORM);
  }

  function handleOpenCreate() {
    setEditProduk(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function handleOpenEdit(produk: Produk) {
    setEditProduk(produk);
    setForm({
      nama:     produk.nama,
      kategori: produk.kategori,
      harga:    String(produk.harga),
      stok:     String(produk.stok),
    });
    setShowForm(true);
  }

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ── API calls ──────────────────────────────────────────── */
  async function handleSubmit() {
    setLoading(true);
    await fetch("/api/produk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    handleClose();
    setLoading(false);
    router.refresh();
  }

  async function handleUpdate() {
    if (!editProduk) return;
    setLoading(true);
    await fetch(`/api/produk/${editProduk.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    handleClose();
    setLoading(false);
    router.refresh();
  }

  async function handleHapus(id: number) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    await fetch(`/api/produk/${id}`, { method: "DELETE" });
    router.refresh();
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <>
      {/* ── Stat Strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Produk", value: produkList.length },
          {
            label: "Ditambahkan Hari Ini",
            value: produkList.filter((p) => {
              const today = new Date();
              const created = new Date(p.createdAt ?? "");
              return created.toDateString() === today.toDateString();
            }).length,
          },
          { label: "Status", value: produkList.length > 0 ? "Aktif" : "Kosong" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl bg-white border border-rose-100 px-5 py-4 shadow-sm"
          >
            <p className="text-xs font-medium text-rose-400 uppercase tracking-wider">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-rose-950">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Content Card ───────────────────────────────────── */}
      <section className="rounded-xl bg-white border border-rose-100 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-50">
          <div>
            <h2 className="text-sm font-semibold text-rose-950">Daftar Produk</h2>
            <p className="text-xs text-rose-400 mt-0.5">{produkList.length} produk terdaftar</p>
          </div>

          {/* ✅ Tombol ada di sini — di dalam card header, sejajar dengan judul */}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-colors duration-150 hover:bg-rose-700 active:bg-rose-800"
          >
            <Plus size={13} strokeWidth={2.5} />
            Tambah Produk
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {produkList.length === 0 ? (
            <EmptyState onAdd={handleOpenCreate} />
          ) : (
            <ProdukTable
              produkList={produkList}
              onEdit={handleOpenEdit}
              onDelete={handleHapus}
            />
          )}
        </div>
      </section>

      {/* ── Modal Form ─────────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-rose-950/30 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-rose-100 overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-rose-50">
              <div>
                <h2 className="text-base font-semibold text-rose-950">
                  {editProduk ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                <p className="text-xs text-rose-400 mt-0.5">
                  {editProduk
                    ? `Mengubah data untuk "${editProduk.nama}"`
                    : "Isi detail produk yang ingin ditambahkan"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-rose-300 hover:text-rose-700 hover:bg-rose-50 transition-colors duration-150"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {FORM_FIELDS.map(({ key, label, type, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setField(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-rose-100 bg-rose-50/50 px-3.5 py-2.5 text-sm text-rose-950 placeholder:text-rose-300 outline-none transition-all duration-150 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-rose-50 bg-rose-50/50">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg border border-rose-100 bg-white px-4 py-2.5 text-sm font-medium text-rose-500 transition-colors duration-150 hover:bg-rose-50 hover:text-rose-700"
              >
                Batal
              </button>
              <button
                onClick={editProduk ? handleUpdate : handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : editProduk ? "Update Produk" : "Simpan Produk"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ───────────────────────────────────────── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-70 gap-3 rounded-lg border-2 border-dashed border-rose-100 bg-rose-50/30">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100">
        <Package size={18} className="text-rose-400" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-rose-700">Belum ada produk</p>
        <p className="text-xs text-rose-400 mt-0.5">
          Tambahkan produk pertama Anda menggunakan tombol di atas.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-rose-700 transition-colors duration-150"
      >
        <Plus size={13} strokeWidth={2.5} />
        Tambah Produk
      </button>
    </div>
  );
}

function ProdukTable({
  produkList,
  onEdit,
  onDelete,
}: {
  produkList: Produk[];
  onEdit: (p: Produk) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-rose-50">
            {["ID", "Nama Produk", "Kategori", "Harga", "Stok", "Aksi"].map((col) => (
              <th
                key={col}
                className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-rose-300 pr-6 last:pr-0"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-50/80">
          {produkList.map((produk) => (
            <tr key={produk.id} className="group hover:bg-rose-50/40 transition-colors duration-100">
              <td className="py-3.5 pr-6 text-rose-300 text-xs tabular-nums font-mono">
                #{produk.id}
              </td>
              <td className="py-3.5 pr-6 font-medium text-rose-950">
                {produk.nama}
              </td>
              <td className="py-3.5 pr-6">
                <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-500 ring-1 ring-rose-100">
                  {produk.kategori}
                </span>
              </td>
              <td className="py-3.5 pr-6 text-rose-700 tabular-nums">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(produk.harga)}
              </td>
              <td className="py-3.5 pr-6">
                <StokBadge stok={produk.stok} />
              </td>
              <td className="py-3.5">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <ActionButton onClick={() => onEdit(produk)}      variant="edit"   label="Edit"  icon={<Pencil size={13} strokeWidth={2} />} />
                  <ActionButton onClick={() => onDelete(produk.id)} variant="delete" label="Hapus" icon={<Trash2 size={13} strokeWidth={2} />} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StokBadge({ stok }: { stok: number }) {
  if (stok === 0) return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />Habis
    </span>
  );
  if (stok <= 10) return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{stok} · Rendah
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{stok} pcs
    </span>
  );
}

function ActionButton({ onClick, variant, label, icon }: {
  onClick: () => void;
  variant: "edit" | "delete";
  label: string;
  icon: React.ReactNode;
}) {
  const styles = {
    edit:   "text-rose-300 hover:text-rose-700 hover:bg-rose-50",
    delete: "text-rose-300 hover:text-red-600 hover:bg-red-50",
  };
  return (
    <button
      onClick={onClick}
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-150 ${styles[variant]}`}
    >
      {icon}{label}
    </button>
  );
}