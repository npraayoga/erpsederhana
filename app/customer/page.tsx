"use client";

import { useState } from "react";
import { Users, Plus, Pencil, Trash2, X, Loader2, MapPin, Phone, Mail } from "lucide-react";

type Customer = {
  id: number;
  nama: string;
  email: string;
  telp: string;
  kota: string;
};

type FormState = {
  nama: string;
  email: string;
  telp: string;
  kota: string;
};

const EMPTY_FORM: FormState = { nama: "", email: "", telp: "", kota: "" };

const FORM_FIELDS = [
  { key: "nama",  label: "Nama Lengkap",  type: "text",  placeholder: "contoh: Budi Santoso" },
  { key: "email", label: "Alamat Email",  type: "email", placeholder: "contoh: budi@email.com" },
  { key: "telp",  label: "No. Telepon",   type: "tel",   placeholder: "contoh: 081234567890" },
  { key: "kota",  label: "Kota",          type: "text",  placeholder: "contoh: Jakarta" },
] as const;

const INITIAL_DATA: Customer[] = [
  { id: 1, nama: "Budi Santoso",  email: "budi@email.com",  telp: "081234567890", kota: "Jakarta"  },
  { id: 2, nama: "Siti Rahayu",   email: "siti@email.com",  telp: "082345678901", kota: "Bandung"  },
  { id: 3, nama: "Andi Wijaya",   email: "andi@email.com",  telp: "083456789012", kota: "Surabaya" },
  { id: 4, nama: "Dewi Lestari",  email: "dewi@email.com",  telp: "084567890123", kota: "Medan"    },
];

export default function Customer() {
  const [customerList, setCustomerList] = useState<Customer[]>(INITIAL_DATA);
  const [showForm, setShowForm]         = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm]                 = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading]           = useState(false);

  /* ── Helpers ────────────────────────────────────────────── */
  function handleClose() {
    setShowForm(false);
    setEditCustomer(null);
    setForm(EMPTY_FORM);
  }

  function handleOpenCreate() {
    setEditCustomer(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function handleOpenEdit(customer: Customer) {
    setEditCustomer(customer);
    setForm({ nama: customer.nama, email: customer.email, telp: customer.telp, kota: customer.kota });
    setShowForm(true);
  }

  function setField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ── CRUD (local state — sambungkan ke API saat siap) ───── */
  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      const newCustomer: Customer = { id: Date.now(), ...form };
      setCustomerList((prev) => [newCustomer, ...prev]);
      handleClose();
      setLoading(false);
    }, 400);
  }

  function handleUpdate() {
    if (!editCustomer) return;
    setLoading(true);
    setTimeout(() => {
      setCustomerList((prev) =>
        prev.map((c) => (c.id === editCustomer.id ? { ...c, ...form } : c))
      );
      handleClose();
      setLoading(false);
    }, 400);
  }

  function handleHapus(id: number) {
    if (!confirm("Yakin ingin menghapus customer ini?")) return;
    setCustomerList((prev) => prev.filter((c) => c.id !== id));
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto space-y-8">

      {/* ── Page Header ──────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-slate-100 ring-1 ring-slate-200">
              <Users size={14} className="text-slate-600" strokeWidth={1.75} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              CRM
            </p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Data Customer
          </h1>
          <p className="text-sm text-slate-500">
            Kelola daftar pelanggan dan informasi kontak mereka.
          </p>
        </div>

        <div className="shrink-0 self-start sm:mt-1">
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-slate-700 active:bg-slate-800"
          >
            <Plus size={15} strokeWidth={2.5} />
            Tambah Customer
          </button>
        </div>
      </header>

      {/* ── Stat Strip ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Customer", value: customerList.length },
          {
            label: "Kota Tercakup",
            value: new Set(customerList.map((c) => c.kota)).size,
          },
          { label: "Status", value: customerList.length > 0 ? "Aktif" : "Kosong" },
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

      {/* ── Content Card ─────────────────────────────────── */}
      <section className="rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Daftar Customer</h2>
            <p className="text-xs text-slate-400 mt-0.5">{customerList.length} customer terdaftar</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {customerList.length === 0 ? (
            <EmptyState onAdd={handleOpenCreate} />
          ) : (
            <CustomerTable
              customerList={customerList}
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

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {editCustomer ? "Edit Customer" : "Tambah Customer Baru"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editCustomer
                    ? `Mengubah data untuk "${editCustomer.nama}"`
                    : "Isi informasi kontak customer baru"}
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
                onClick={editCustomer ? handleUpdate : handleSubmit}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : editCustomer ? "Update Customer" : "Simpan Customer"}
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
        <Users size={18} className="text-slate-400" strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">Belum ada customer</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Tambahkan customer pertama Anda menggunakan tombol di bawah.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-700 transition-colors duration-150"
      >
        <Plus size={13} strokeWidth={2.5} />
        Tambah Customer
      </button>
    </div>
  );
}

function CustomerTable({
  customerList,
  onEdit,
  onDelete,
}: {
  customerList: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {["ID", "Nama", "Kontak", "Kota", "Aksi"].map((col) => (
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
          {customerList.map((customer) => (
            <tr key={customer.id} className="group hover:bg-slate-50/70 transition-colors duration-100">

              {/* ID */}
              <td className="py-3.5 pr-6 text-slate-400 text-xs tabular-nums font-mono">
                #{customer.id}
              </td>

              {/* Nama */}
              <td className="py-3.5 pr-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 ring-1 ring-slate-200 shrink-0 text-xs font-semibold text-slate-600">
                    {customer.nama.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-800">{customer.nama}</span>
                </div>
              </td>

              {/* Kontak — email + telp digabung dalam 1 kolom */}
              <td className="py-3.5 pr-6">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Mail size={11} strokeWidth={1.75} className="text-slate-400" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Phone size={11} strokeWidth={1.75} className="text-slate-400" />
                    {customer.telp}
                  </div>
                </div>
              </td>

              {/* Kota */}
              <td className="py-3.5 pr-6">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  <MapPin size={10} strokeWidth={2} className="text-slate-400" />
                  {customer.kota}
                </span>
              </td>

              {/* Aksi */}
              <td className="py-3.5">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <ActionButton onClick={() => onEdit(customer)} variant="edit"   label="Edit"  icon={<Pencil size={13} strokeWidth={2} />} />
                  <ActionButton onClick={() => onDelete(customer.id)} variant="delete" label="Hapus" icon={<Trash2 size={13} strokeWidth={2} />} />
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
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