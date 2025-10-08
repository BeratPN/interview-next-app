// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import fs from "fs";
import path from "path";
import { clearProductsCache } from "../route";

const dataFile = path.join(process.cwd(), "data", "products.json");

function readProducts() {
  if (!fs.existsSync(dataFile)) return [];
  const txt = fs.readFileSync(dataFile, "utf-8");
  try {
    return JSON.parse(txt);
  } catch (e) {
    console.error("products.json parse error:", e);
    return [];
  }
}

function writeProducts(products: any[]) {
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2), "utf-8");
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = readProducts();
  const p = products.find((x: any) => String(x.id) === String(id));
  if (!p) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const products = readProducts();
    const idx = products.findIndex((x: any) => String(x.id) === String(id));
    if (idx === -1) return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    products[idx] = { ...products[idx], ...body, id: products[idx].id }; // id korunur
    writeProducts(products);
    
    // Cache'i temizle
    clearProductsCache();
    
    // Next.js cache tag'ini revalidate et
    revalidateTag('products');
    
    return NextResponse.json(products[idx]);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Güncelleme hatası" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`Attempting to delete product with ID: ${id}`);
    
    const products = readProducts();
    console.log(`Total products in file: ${products.length}`);
    console.log(`Available IDs: ${products.map(p => p.id).join(', ')}`);
    
    const idx = products.findIndex((x: any) => String(x.id) === String(id));
    if (idx === -1) {
      console.log(`Product with ID ${id} not found`);
      return NextResponse.json({ error: `Ürün bulunamadı (ID: ${id})` }, { status: 404 });
    }
    
    console.log(`Found product at index ${idx}, deleting...`);
    const removed = products.splice(idx, 1);
    writeProducts(products);
    
    // Cache'i temizle
    clearProductsCache();
    
    // Next.js cache tag'ini revalidate et
    revalidateTag('products');
    
    console.log(`Product deleted successfully: ${removed[0].name}`);
    return NextResponse.json({ success: true, removed: removed[0] });
  } catch (err: any) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: err.message || "Silme hatası" }, { status: 500 });
  }
}
