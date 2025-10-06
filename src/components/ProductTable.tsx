'use client';
import ProductRow from './ProductRow';
import styles from './ProductTable.module.scss';

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
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
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
