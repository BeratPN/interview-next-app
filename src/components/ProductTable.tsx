"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import ProductRow from "./ProductRow";
import Pagination from "./Pagination";
import { ApiErrorHandler, showErrorToast } from "@/utils/errorHandler";
import { ProductTableProps } from "@/types";
import { formatNumber } from "@/utils";
import styles from "./ProductTable.module.scss";

export default function ProductTable({
  products,
  totalPages,
  currentPage,
  totalProducts,
  hasNextPage,
  hasPrevPage,
}: ProductTableProps) {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDelete = async (id: number) => {
    try {
      await ApiErrorHandler.handleFetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      window.location.reload(); // Sayfayı yenile
    } catch (err: any) {
      console.error("Delete error:", err);
      showErrorToast(err, lang);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/?${params.toString()}`);
  };

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📦</div>
        <h3 className={styles.emptyTitle}>{lang.noProductsFound}</h3>
        <p className={styles.emptyMessage}>{lang.noProductsMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableInfo}>
        <p className={styles.infoText}>
          {lang.showing} {formatNumber((currentPage - 1) * 10 + 1)} - {formatNumber(Math.min(currentPage * 10, totalProducts))} {lang.of} {formatNumber(totalProducts)} {lang.products}
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
          {products.map((product) => (
            <ProductRow
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              category={product.category}
              price={product.price}
              brand={product.brand}
              model={product.model}
              color={product.color}
              stock={product.stock}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
      )}
    </div>
  );
}