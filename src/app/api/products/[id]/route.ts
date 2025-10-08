import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "products.json");

function readProducts() {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeProducts(products: any[]) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = readProducts();
    const product = products.find((p: any) => String(p.id) === String(id));
    
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ürün getirilemedi" }, { status: 500 });
  }
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
    
    return NextResponse.json(products[idx]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Güncelleme hatası" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    console.log("DELETE Debug:", { id, type: typeof id });
    
    const products = readProducts();
    console.log("Available products:", products.map(p => ({ id: p.id, name: p.name })));
    
    const idx = products.findIndex((x: any) => String(x.id) === String(id));
    console.log("Found index:", idx);
    
    if (idx === -1) {
      console.log("Product not found!");
      return NextResponse.json({ error: `Ürün bulunamadı (ID: ${id})` }, { status: 404 });
    }
    
    const removed = products.splice(idx, 1);
    writeProducts(products);
    
    console.log("Product deleted successfully:", removed[0]);
    return NextResponse.json({ success: true, removed: removed[0] });
  } catch (err: any) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: err.message || "Silme hatası" }, { status: 500 });
  }
}