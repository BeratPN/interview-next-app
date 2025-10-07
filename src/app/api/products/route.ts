import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "products.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ products: [], totalPages: 0, currentPage: 1, totalProducts: 0 });
    }

    let products = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Arama filtresi
    if (search) {
      products = products.filter((product: any) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.price.toString().includes(search)
      );
    }

    // Sıralama
    if (sortBy) {
      products.sort((a: any, b: any) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'category':
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      totalPages,
      currentPage: page,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ürünler getirilemedi" }, { status: 500 });
  }
}

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
