"use client";
import { useLanguage } from "@/context/LanguageContext";
import ProductRow from "./ProductRow";
import styles from "./ProductTable.module.scss";

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  price: string;
}

interface ProductTableProps {
  products: Product[];
}
export default function ProductTable({ products }: ProductTableProps) {
  const { lang } = useLanguage();
  return (
    <div className={styles.tableContainer}>
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
              image={p.image}
              name={p.name}
              category={p.category}
              price={p.price}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
