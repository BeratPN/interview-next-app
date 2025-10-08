import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Read products
    const raw = await fs.readFile(DATA_PATH, "utf8").catch(() => "[]");
    let products = [];
    try {
      products = JSON.parse(raw || "[]");
    } catch (e) {
      products = [];
    }

    // Search
    let filteredProducts = products;
    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      filteredProducts = products.filter((p: any) =>
        p.name?.toLowerCase().includes(lowerCaseSearch) ||
        p.description?.toLowerCase().includes(lowerCaseSearch) ||
        p.category?.toLowerCase().includes(lowerCaseSearch) ||
        p.brand?.toLowerCase().includes(lowerCaseSearch) ||
        p.model?.toLowerCase().includes(lowerCaseSearch) ||
        p.color?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Sort
    if (sortBy) {
      filteredProducts.sort((a: any, b: any) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      totalPages,
      currentPage: page,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Ürünler getirilemedi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // read file (if missing, start with [])
    const raw = await fs.readFile(DATA_PATH, "utf8").catch(() => "[]");
    let products = [];
    try {
      products = JSON.parse(raw || "[]");
    } catch (e) {
      products = [];
    }

    // generate id server-side
    const newId = (products?.length ?? 0) + 1;
    const newProduct = { ...body, id: newId }; // server id wins

    products.push(newProduct);
    await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf8");

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}