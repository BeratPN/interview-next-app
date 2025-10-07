"use client";
import { useState } from "react";
import styles from "./ProductRow.module.scss";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";

interface ProductRowProps {
  id: number;
  image?: string;
  name: string;
  category: string;
  price: number;
  brand?: string;
  model?: string;
  color?: string;
  stock?: number;
  onDelete?: () => void; // parent'e haber ver
}

export default function ProductRow({
  id,
  image,
  name,
  category,
  price,
  brand,
  model,
  color,
  stock,
  onDelete,
}: ProductRowProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const getCategoryClass = (category: string) => {
    const normalizedCategory = category
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
    return styles[normalizedCategory] || "";
  };
  const { lang } = useLanguage();

  const openModal = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Sadece parent'e haber ver, API çağrısı parent'ta yapılacak
    setModalOpen(false);
    onDelete?.();
  };

  return (
    <tr className={styles.row}>
      <td>
        {image ? (
          <img className={styles.image} src={image} alt={name} />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </td>
      <td>{name}</td>
      <td>{brand || '-'}</td>
      <td>{model || '-'}</td>
      <td>{color || '-'}</td>
      <td>
        <span className={`${styles.category} ${getCategoryClass(category)}`}>{category}</span>
      </td>
      <td>${price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
      <td>
        <span className={styles.stock}>{stock || 0}</span>
      </td>
      <td>
        <a className={styles.edit} href={`/edit/${id}`}>
          {lang.edit}
        </a>
        <span className={styles.separator}>|</span>
        <a className={styles.delete} href="#" onClick={openModal}>
          {lang.delete}
        </a>

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message={`"${name}" ${lang.confirmDelete}`}
        />
      </td>
    </tr>
  );
}
