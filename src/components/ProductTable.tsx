"use client";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ProductRow from "./ProductRow";
import styles from "./ProductTable.module.scss";

interface Product {
  id: number;
  image?: string;
  name: string;
  category: string;
  price: number;
}

interface ProductTableProps {
  products: Product[]; // başlangıç verisi (server-side import ile verilebilir)
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function ProductTable({ products, searchTerm = "", sortBy = "", sortOrder = "asc" }: ProductTableProps) {
  const { lang } = useLanguage();
  const [productList, setProductList] = useState<Product[]>(products);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  // Filtrelenmiş ve sıralanmış ürünleri hesapla
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productList;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toString().includes(searchTerm)
      );
    }

    // Sıralama
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
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

    return filtered;
  }, [productList, searchTerm, sortBy, sortOrder]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (!res.ok) {
        // backend'den gelen hatayı yakala ve göster
        const data = await res.json().catch(() => null);
        const msg = data?.error || `Silme başarısız (status ${res.status})`;
        throw new Error(msg);
      }

      // Başarılıysa local state'i güncelle
      setProductList((prev) => prev.filter((p) => p.id !== id));
      alert("Ürün başarıyla silindi.");
    } catch (err: any) {
      alert("Hata: " + (err?.message || "Silme işlemi başarısız"));
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={styles.tableContainer}>
      {filteredAndSortedProducts.length === 0 ? (
        <div className={styles.noProducts}>
          <p>{lang.noProducts}</p>
        </div>
      ) : (
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
            {filteredAndSortedProducts.map((p) => (
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
      )}
    </div>
  );
}
