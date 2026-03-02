import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Ambil semua produk
export async function GET() {
  const produk = await prisma.produk.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(produk);
}

// POST - Tambah produk baru
export async function POST(request: Request) {
  const body = await request.json();
  const produk = await prisma.produk.create({
    data: {
      nama: body.nama,
      kategori: body.kategori,
      harga: Number(body.harga),
      stok: Number(body.stok),
    },
  });
  return NextResponse.json(produk);
}