"use client";
import ProductForm from "@/components/ProductForm";
// import ProductForm from "@/components/ProductForm";
import styles from "../page.module.scss";
import { useLanguage } from "@/context/LanguageContext";

export default function AddProductPage() {
    const { lang } = useLanguage();
  return (
    <div className={styles.mainContent}>
      <h1>{lang.addNewProduct}</h1>
      <ProductForm mode="add" />
    </div>
  );
}
