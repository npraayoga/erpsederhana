"use client";

import { useState } from "react";
import { Receipt, Plus, Pencil, Trash2, X, Loader2, ShoppingBag, User } from "lucide-react";

type StatusType = "Selesai" | "Proses" | "Pending";

type Transaksi = {
  id: number;
  customer: string;
  produk: string;
  jumlah: number;
  total: number;
  status: StatusType;
  tanggal: string;
};

type FormState = {
  customer: string;
  produk: string;
  jumlah: string;
  total: string;
  status: StatusType;
  tanggal: string;
};

const EMPTY_FORM: FormState = {
  customer: "",
  produk: "",
  jumlah: "",
  total: "",
  status: "Pending",
  tanggal: new Date().toISOString().split("T")[0],
};

const FORM_FIELDS = [
  { key: "customer", label: "Nama Customer", type: "text",   placeholder: "contoh: Budi Santoso" },
  { key: "produk",   label: "Nama Produk",   type: "text",   placeholder: "contoh: Laptop ASUS" },
  { key: "jumlah",   label: "Jumlah",        type: "number", placeholder: "contoh: 2" },
  { key: "total",    label: "Total Harga (Rp)", type: "number", placeholder: "contoh: 8500000" },
  { key: "tanggal",  label: "Tanggal",       type: "date",   placeholder: "" },
] as const;

const STATUS_OPTIONS: StatusType[] = ["Pending", "Proses", "Selesai"];

const STATUS_CONFIG: Record<StatusType, { dot: string; badge: string; label: string }> = {
  Selesai: {
    dot:   "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    label: "Selesai",
  },
  Proses: {
    dot:   "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    label: "Diproses",
  },
  Pending: {
    dot:   "bg-slate-300",
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    label: "Pending",
  },
};

const INITIAL_DATA: Transaksi[] = [
  { id: 1, customer: "Budi Santoso",  produk: "Laptop ASUS",          jumlah: 1, total: 8500000, status: "Selesai", tanggal: "2026-03-01" },
  { id: 2, customer: "Siti Rahayu",   produk: "Monitor LG",           jumlah: 2, total: 6400000, status: "Proses",  tanggal: "2026-03-01" },
  { id: 3, customer: "Andi Wijaya",   produk: "Keyboard Mechanical",  jumlah: 1, total: 1200000, status: "Pending", tanggal: "2026-03-02" },
  { id: 4, customer: "Dewi Lestari",  produk: "Mouse Logitech",       jumlah: 3, total: 1350000, status: "Selesai", tanggal: "2026-03-02" },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default function Transaksi() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>(INITIAL_DATA);
  const [showForm, setShowForm]           = useState(false);
  const [editTrx, setEditTrx]             = useState<Transaksi | null>(null);
  const [form, setForm]                   = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading]             = useState(false);

  /* ── Helpers ────────────────────────────────────────────── */
  function handleClose() {
    setShowForm(false);
    setEditTrx(null);
    setForm(EMPTY_FORM);
  }

  function handleOpenCreate() {
    setEditTrx(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function handleOpenEdit(trx: Transaksi) {
    setEditTrx(trx);
    setForm({
      customer: trx.customer,
      produk:   trx.produk,
      jumlah:   String(trx.jumlah),
      total:    String(trx.total),
      status:   trx.status,
      tanggal:  trx.tanggal,
    });
    setShowForm(true);
  }

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ── CRUD ───────────────────────────────────────────────── */
  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      const newTrx: Transaksi = {
        id:       Date.now(),
        customer: form.customer,
        produk:   form.produk,
        jumlah:   Number(form.jumlah),
        total:    Number(form.total),
        status:   form.status,
        tanggal:  form.tanggal,
      };
      setTransaksiList((prev) => [newTrx, ...prev]);
      handleClose();
      setLoading(false);
    }, 400);
  }

  function handleUpdate() {
    if (!editTrx) return;
    setLoading(true);
    setTimeout(() => {
      setTransaksiList((prev) =>
        prev.map((t) =>
          t.id === editTrx.id
            ? { ...t, ...form, jumlah: Number(form.jumlah), total: Number(form.total) }
            : t
        )
      );
      handleClose();
      setLoading(false);
    }, 400);
  }

  function handleHapus(id: number) {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;
    setTransaksiList((prev) => prev.filter((t) => t.id !== id));
  }

  /* ── Derived stats ──────────────────────────────────────── */
  const totalRevenue   = transaksiList.filter((t) => t.status === "Selesai").reduce((s, t) => s + t.total, 0);
  const totalSelesai   = transaksiList.filter((t) => t.status === "Selesai").length;
  const totalProses    = transaksiList.filter((t) => t.status === "Proses").length;

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto space-y-8">

      {/* ── Page Header ──────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 ring-1 ring-slate-200">
              <Receipt size={14} className="text-slate-600" strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Sales
            </p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Data Transaksi
          </h1>
          <p className="text-sm text-slate-500">
            Pantau dan kelola semua transaksi penjualan.
          </p>
        </div>
        <div className="shrink-0 self-start sm:mt-1">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-slate-700 active:bg-slate-800"
          >
            <Plus size={15} strokeWidth={2.5} />
            Tambah Transaksi
          </button>
        </div>
      </header>

      {/* ── Stat Strip ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Transaksi", value: transaksiList.length },
          { label: "Selesai",         value: totalSelesai },
          { label: "Diproses",        value: totalProses },
          { label: "Total Revenue",   value: formatRupiah(totalRevenue), wide: true },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-white border border-slate-200/80 px-5 py-4 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="mt-1.5 text-xl font-semibold text-slate-900 tabular-nums truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Content Card ─────────────────────────────────── */}
      <section className="rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Riwayat Transaksi</h2>
            <p className="text-xs text-slate-400 mt-0.5">{transaksiList.length} transaksi tercatat</p>
          </div>
        </div>
        <div className="p-6">
          {transaksiList.length === 0 ? (
            <EmptyState onAdd={handleOpenCreate} />
          ) : (
            <TransaksiTable
              transaksiList={transaksiList}
              onEdit={handleOpenEdit}
              onDelete={handleHapus}
            />
          )}
        </div>
      </section>

      {/* ── Modal Form ───────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/80 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editTrx ? "Edit Transaksi" : "Tambah Transaksi Baru"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editTrx ? `Mengubah transaksi #${editTrx.id}` : "Isi detail transaksi penjualan"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

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

              {/* Status selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setField("status", s)}
                      className={`flex-1 rounded-lg py-2 text-xs font-medium border transition-all duration-150 ${
                        form.status === s
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={handleClose}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                onClick={editTrx ? handleUpdate : handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" />Menyimpan...</>
                ) : editTrx ? "Update Transaksi" : "Simpan Transaksi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-70 gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
        <Receipt size={18} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">Belum ada transaksi</p>
        <p className="text-xs text-slate-400 mt-0.5">Catat transaksi pertama menggunakan tombol di bawah.</p>
      </div>
      <button
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-colors duration-150"
      >
        <Plus size={13} strokeWidth={2.5} />
        Tambah Transaksi
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusType }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ActionButton({
  onClick, variant, label, icon,
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

function TransaksiTable({
  transaksiList,
  onEdit,
  onDelete,
}: {
  transaksiList: Transaksi[];
  onEdit: (t: Transaksi) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {["ID", "Tanggal", "Customer", "Produk", "Qty", "Total", "Status", "Aksi"].map((col) => (
              <th key={col} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 pr-5 last:pr-0">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transaksiList.map((trx) => (
            <tr key={trx.id} className="group hover:bg-slate-50/70 transition-colors duration-100">

              <td className="py-3.5 pr-5 text-slate-400 text-xs tabular-nums font-mono">
                #{trx.id}
              </td>

              <td className="py-3.5 pr-5 text-slate-500 text-xs tabular-nums whitespace-nowrap">
                {formatDate(trx.tanggal)}
              </td>

              <td className="py-3.5 pr-5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 ring-1 ring-slate-200 shrink-0 text-xs font-semibold text-slate-600">
                    {trx.customer.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-800 whitespace-nowrap">{trx.customer}</span>
                </div>
              </td>

              <td className="py-3.5 pr-5">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag size={11} strokeWidth={1.75} className="text-slate-400 shrink-0" />
                  <span className="text-slate-600 whitespace-nowrap">{trx.produk}</span>
                </div>
              </td>

              <td className="py-3.5 pr-5 tabular-nums text-slate-600">
                {trx.jumlah}×
              </td>

              <td className="py-3.5 pr-5 tabular-nums font-medium text-slate-800 whitespace-nowrap">
                {formatRupiah(trx.total)}
              </td>

              <td className="py-3.5 pr-5">
                <StatusBadge status={trx.status} />
              </td>

              <td className="py-3.5">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <ActionButton onClick={() => onEdit(trx)}       variant="edit"   label="Edit"  icon={<Pencil size={13} strokeWidth={2} />} />
                  <ActionButton onClick={() => onDelete(trx.id)}  variant="delete" label="Hapus" icon={<Trash2 size={13} strokeWidth={2} />} />
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}