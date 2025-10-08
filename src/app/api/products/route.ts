import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import fs from "fs";
import path from "path";

// Cache için basit in-memory cache
export const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Products cache'ini temizle
export function clearProductsCache() {
  // Sadece products ile ilgili cache'leri temizle
  const keysToDelete = [];
  for (const key of cache.keys()) {
    if (key.startsWith('products_')) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => cache.delete(key));
  console.log(`Cleared ${keysToDelete.length} product cache entries`);
}

// Tüm cache'i temizle (eski fonksiyon)
export function clearAllCache() {
  cache.clear();
  console.log("All cache cleared");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Cache key oluştur
    const cacheKey = `products_${page}_${limit}_${search}_${sortBy}_${sortOrder}`;
    
    // Cache'den kontrol et
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 dakika cache
          'X-Cache': 'HIT'
        }
      });
    }

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "products.json");

    if (!fs.existsSync(filePath)) {
      const emptyResult = { products: [], totalPages: 0, currentPage: 1, totalProducts: 0 };
      setCachedData(cacheKey, emptyResult);
      return NextResponse.json(emptyResult);
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

    const result = {
      products: paginatedProducts,
      totalPages,
      currentPage: page,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    // Cache'e kaydet
    setCachedData(cacheKey, result);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 dakika cache
        'X-Cache': 'MISS'
      }
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

    // Cache'i temizle
    clearProductsCache();
    
    // Next.js cache tag'ini revalidate et
    revalidateTag('products');

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ürün kaydedilemedi" }, { status: 500 });
  }
}
