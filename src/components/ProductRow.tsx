'use client';
import styles from './ProductRow.module.scss';

interface ProductRowProps {
  image: string;
  name: string;
  category: string;
  price: string;
}

export default function ProductRow({ image, name, category, price }: ProductRowProps) {
  const categoryClass = styles[category.toLowerCase()] || '';

  return (
    <tr className={styles.row}>
      <td>
        <img className={styles.image} src={image} alt={name} />
      </td>
      <td>{name}</td>
      <td>
        <span className={`${styles.category} ${categoryClass}`}>{category}</span>
      </td>
      <td>{price}</td>
      <td>
        <a className={styles.edit} href="#">Düzenle</a>
        <span className={styles.separator}>|</span>
        <a className={styles.delete} href="#">Sil</a>
      </td>
    </tr>
  );
}
