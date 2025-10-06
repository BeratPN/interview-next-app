"use client";

import { useState } from "react";
import styles from "./ProductRow.module.scss";
import ConfirmModal from "@/components/ConfirmModal";

interface ProductRowProps {
  image: string;
  name: string;
  category: string;
  price: string;
  onDelete?: () => void;
}

export default function ProductRow({
  image,
  name,
  category,
  price,
  onDelete,
}: ProductRowProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const categoryClass = styles[category.toLowerCase()] || "";

  const handleDelete = () => setModalOpen(true);
  const handleConfirmDelete = () => {
    setModalOpen(false);
    if (onDelete) onDelete();
    //TODO: burada API çağrısı veya state güncellemesi yapılacak
  };

  return (
    <tr className={styles.row}>
      <td>
        <img className={styles.image} src={image} alt={name} />
      </td>
      <td>{name}</td>
      <td>
        <span className={`${styles.category} ${categoryClass}`}>
          {category}
        </span>
      </td>
      <td>{price}</td>
      <td>
        <a className={styles.edit} href="#">
          Düzenle
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
          Sil
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmDelete}
            message={`"${name}" ürününü silmek istediğinizden emin misiniz?`}
          />
        </a>
      </td>
    </tr>
  );
}
