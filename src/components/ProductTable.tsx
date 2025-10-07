"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ProductRow from "./ProductRow";
import Pagination from "./Pagination";
import { ApiErrorHandler, showErrorToast } from "@/utils/errorHandler";
import styles from "./ProductTable.module.scss";

interface Product {
  id: number;
  image?: string;
  name: string;
  category: string;
  price: number;
  brand?: string;
  model?: string;
  color?: string;
  stock?: number;
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
      await ApiErrorHandler.handleFetch(`/api/products/${id}`, { 
        method: "DELETE" 
      });

      // Sayfayı yenile
      window.location.reload();
    } catch (err: any) {
      console.error("Delete error:", err);
      showErrorToast(err, lang);
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
                <th>{lang.brand}</th>
                <th>{lang.model}</th>
                <th>{lang.color}</th>
                <th>{lang.category}</th>
                <th>{lang.price}</th>
                <th>{lang.stock}</th>
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
                  brand={p.brand}
                  model={p.model}
                  color={p.color}
                  stock={p.stock}
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
