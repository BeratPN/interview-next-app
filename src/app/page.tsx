import PageHeader from "../components/PageHeader";
import ProductTable from "../components/ProductTable";
import FloatingButtonWrapper from "@/components/FloatingButtonWrapper";
import styles from "./page.module.scss";
import { SearchParams, HomeProps } from "@/types";

async function getProducts(searchParams: SearchParams) {
  const params = new URLSearchParams();
  
  if (searchParams.page) params.append('page', searchParams.page);
  if (searchParams.search) params.append('search', searchParams.search);
  if (searchParams.sortBy) params.append('sortBy', searchParams.sortBy);
  if (searchParams.sortOrder) params.append('sortOrder', searchParams.sortOrder);
  
  params.append('limit', '10');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    next: { 
      revalidate: 300, // 5 dakika cache
      tags: ['products']
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const {
    page = '1',
    search = '',
    sortBy = '',
    sortOrder = 'asc'
  } = resolvedSearchParams;

  const data = await getProducts({ page, search, sortBy, sortOrder });

  return (
    <div>
      <main className={styles.mainContent}>
        <PageHeader 
          searchTerm={search}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        <ProductTable 
          products={data.products}
          totalPages={data.totalPages}
          currentPage={data.currentPage}
          totalProducts={data.totalProducts}
          hasNextPage={data.hasNextPage}
          hasPrevPage={data.hasPrevPage}
        />
        <FloatingButtonWrapper />
      </main>
    </div>
  );
}
