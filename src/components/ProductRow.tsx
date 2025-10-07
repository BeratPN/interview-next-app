"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./ProductRow.module.scss";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";
import { ProductRowProps } from "@/types";
import { formatPrice, getCategoryClass } from "@/utils";
import { BLUR_DATA_URL, APP_CONFIG } from "@/constants";

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
  const { lang } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  return (
    <>
      <tr className={styles.row}>
        <td>
          {image ? (
            <Image
              className={styles.image}
              src={image}
              alt={name}
              width={APP_CONFIG.IMAGES.PLACEHOLDER_SIZE}
              height={APP_CONFIG.IMAGES.PLACEHOLDER_SIZE}
              loading="lazy"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              style={{
                objectFit: 'cover',
                borderRadius: '0.375rem'
              }}
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </td>
        <td>{name}</td>
        <td>{brand || '-'}</td>
        <td>{model || '-'}</td>
        <td>{color || '-'}</td>
        <td>
          <span className={`${styles.category} ${getCategoryClass(category)}`}>
            {category}
          </span>
        </td>
        <td>{formatPrice(price)}</td>
        <td>
          <span className={styles.stock}>{stock || 0}</span>
        </td>
        <td>
          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={() => window.location.href = `/edit/${id}`}
              title={lang.edit}
            >
              ✏️
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDeleteClick}
              title={lang.delete}
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>

      {showModal && (
        <ConfirmModal
          isOpen={showModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          message={`${lang.confirmDeleteMessage} "${name}"?`}
        />
      )}
    </>
  );
}