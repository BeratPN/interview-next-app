"use client";

import { useState } from "react";
import styles from "./ProductRow.module.scss";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";

interface ProductRowProps {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  onDelete?: () => void;
}

export default function ProductRow({
  id,
  image,
  name,
  category,
  price,
  onDelete,
}: ProductRowProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const categoryClass = styles[category.toLowerCase()] || "";
  const { lang } = useLanguage();

  const handleDelete = () => setModalOpen(true);
  const handleConfirmDelete = () => {
    setModalOpen(false);
    if (onDelete) onDelete();
    //TODO: burada API çağrısı veya state güncellemesi yapılacak
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
      <td>
        <span className={`${styles.category} ${categoryClass}`}>
          {category}
        </span>
      </td>
      <td>${price.toFixed(2)}</td>
      <td>
        <a className={styles.edit} href={`/edit/${id}`}>
          {lang.edit}
        </a>
        <span className={styles.separator}>|</span>
        <a
          className={styles.delete}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDelete();
          }}
        >
          {lang.delete}
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmDelete}
            message={`"${name}" ${lang.confirmDelete}`}
          />
        </a>
      </td>
    </tr>
  );
}
