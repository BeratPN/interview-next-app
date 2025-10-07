// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "products.json");

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const products = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const product = products.find((p: any) => String(p.id) === params.id);
    if (!product) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Dosya okunamadı" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const products = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
    const productIndex = products.findIndex((p: any) => String(p.id) === params.id);

    if (productIndex === -1)
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });

    const body = await req.json();
    const updatedProduct = { ...products[productIndex], ...body };
    products[productIndex] = updatedProduct;

    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}
