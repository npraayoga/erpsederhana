"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil, Trash2, Loader2 } from "lucide-react";

type Produk = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

type FormState = {
  nama: string;
  kategori: string;
  harga: string;
  stok: string;
};

const EMPTY_FORM: FormState = { nama: "", kategori: "", harga: "", stok: "" };

/* ── Field config untuk menghindari repetisi JSX ──────────── */
const FORM_FIELDS = [
  { key: "nama",     label: "Nama Produk", type: "text",   placeholder: "contoh: Laptop ASUS" },
  { key: "kategori", label: "Kategori",    type: "text",   placeholder: "contoh: Elektronik" },
  { key: "harga",    label: "Harga (Rp)",  type: "number", placeholder: "contoh: 8500000" },
  { key: "stok",     label: "Stok",        type: "number", placeholder: "contoh: 10" },
] as const;

export default function FormTambahProduk({ produkList }: { produkList: Produk[] }) {
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
      {/* Tombol Tambah — dirender di header halaman */}
      <button
        onClick={handleOpenCreate}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-slate-700 active:bg-slate-800"
      >
        <Plus size={15} strokeWidth={2.5} />
        Tambah Produk
      </button>

      {/* ── Tabel Produk ─────────────────────────────────── */}
      {produkList.length === 0 ? (
        <EmptyState onAdd={handleOpenCreate} />
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {["ID", "Nama Produk", "Kategori", "Harga", "Stok", "Aksi"].map((col) => (
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
                <tr key={produk.id} className="group hover:bg-slate-50/70 transition-colors duration-100">
                  <td className="py-3.5 pr-6 text-slate-400 text-xs tabular-nums font-mono">
                    #{produk.id}
                  </td>
                  <td className="py-3.5 pr-6 font-medium text-slate-800">
                    {produk.nama}
                  </td>
                  <td className="py-3.5 pr-6">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      {produk.kategori}
                    </span>
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
                  <td className="py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <ActionButton
                        onClick={() => handleOpenEdit(produk)}
                        variant="edit"
                        label="Edit"
                        icon={<Pencil size={13} strokeWidth={2} />}
                      />
                      <ActionButton
                        onClick={() => handleHapus(produk.id)}
                        variant="delete"
                        label="Hapus"
                        icon={<Trash2 size={13} strokeWidth={2} />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal Form ───────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/80 overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editProduk ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editProduk
                    ? `Mengubah data untuk "${editProduk.nama}"`
                    : "Isi detail produk yang ingin ditambahkan"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {FORM_FIELDS.map(({ key, label, type, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setField(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                onClick={editProduk ? handleUpdate : handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="flex flex-col items-center justify-center min-h-70 gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
        <Plus size={18} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">Belum ada produk</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Tambahkan produk pertama Anda menggunakan tombol di bawah.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-colors duration-150"
      >
        <Plus size={13} strokeWidth={2.5} />
        Tambah Produk
      </button>
    </div>
  );
}

function StokBadge({ stok }: { stok: number }) {
  if (stok === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 ring-1 ring-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        Habis
      </span>
    );
  }
  if (stok <= 10) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        {stok} · Rendah
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      {stok} pcs
    </span>
  );
}

function ActionButton({
  onClick,
  variant,
  label,
  icon,
}: {
  onClick: () => void;
  variant: "edit" | "delete";
  label: string;
  icon: React.ReactNode;
}) {
  const styles = {
    edit:   "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
    delete: "text-slate-400 hover:text-red-600 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors duration-150 ${styles[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
}