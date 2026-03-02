import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE - Hapus produk
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.produk.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ message: "Produk dihapus" });
}

// PUT - Update produk
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const produk = await prisma.produk.update({
    where: { id: Number(id) },
    data: {
      nama: body.nama,
      kategori: body.kategori,
      harga: Number(body.harga),
      stok: Number(body.stok),
    },
  });
  return NextResponse.json(produk);
}