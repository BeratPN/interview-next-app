"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ProductRow from "./ProductRow";
import Pagination from "./Pagination";
import styles from "./ProductTable.module.scss";

interface Product {
  id: number;
  image?: string;
  name: string;
  category: string;
  price: number;
}

interface ProductTableProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function ProductTable({ 
  products, 
  totalPages, 
  currentPage, 
  totalProducts, 
  hasNextPage, 
  hasPrevPage 
}: ProductTableProps) {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    router.push(`/?${newSearchParams.toString()}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error || `Silme başarısız (status ${res.status})`;
        throw new Error(msg);
      }

      // Sayfayı yenile
      window.location.reload();
    } catch (err: any) {
      alert("Hata: " + (err?.message || "Silme işlemi başarısız"));
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={styles.tableContainer}>
      {products.length === 0 ? (
        <div className={styles.noProducts}>
          <p>{lang.noProducts}</p>
        </div>
      ) : (
        <>
          <div className={styles.tableInfo}>
            <p>
              {lang.showing} {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalProducts)} {lang.of} {totalProducts} {lang.results}
            </p>
          </div>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{lang.image}</th>
                <th>{lang.product}</th>
                <th>{lang.category}</th>
                <th>{lang.price}</th>
                <th>{lang.actions}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow
                  key={p.id}
                  id={p.id}
                  image={p.image}
                  name={p.name}
                  category={p.category}
                  price={p.price}
                  onDelete={() => handleDelete(p.id)} 
                />
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
          />
        </>
      )}
    </div>
  );
}
