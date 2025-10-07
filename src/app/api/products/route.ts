import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dataDir = path.join(process.cwd(), "data");
    fs.mkdirSync(dataDir, { recursive: true });

    const filePath = path.join(dataDir, "products.json");

    const products = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
      : [];

    // id atama
    const newId = products.length ? Number(products[products.length - 1].id) + 1 : 1;
    const newProduct = { id: newId, ...body };

    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ürün kaydedilemedi" }, { status: 500 });
  }
}
