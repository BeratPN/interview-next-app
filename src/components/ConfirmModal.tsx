"use client";
import { useEffect, useRef } from "react";
import styles from "./ConfirmModal.module.scss";
import { useLanguage } from "@/context/LanguageContext";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (modalRef.current && target && !modalRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} aria-modal="true" role="dialog">
      <div className={styles.modal} ref={modalRef}>
        <p>{message || lang.confirmDelete }</p>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.cancel}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            {lang.cancel}
          </button>
          <button
            type="button"
            className={styles.confirm}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
          >
            {lang.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
