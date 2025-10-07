"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.scss";
import { useLanguage } from "@/context/LanguageContext";

export interface Product {
  id?: string | number;
  name: string;
  category: string;
  price: string;
  description?: string;
  image?: string;
}

type Mode = "add" | "edit";

interface ProductFormProps {
  mode?: Mode;
  initialData?: Product;
  categories?: string[];
  apiEndpoint?: string;
  onSuccess?: (product?: Product) => void;
  onCancel?: () => void;
}

export default function ProductForm({
  mode = "add",
  initialData,
  categories = ["Mobilya", "Dekorasyon", "Aydınlatma", "Giyim", "Elektronik"],
  apiEndpoint,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<Product>({
    name: "",
    category: categories[0] || "",
    price: "",
    description: "",
    image: "",
    ...initialData,
  });
  const { lang } = useLanguage();

  const router = useRouter();
  const handleCancel = () => {
    onCancel?.();
    router.push("/");
  };

  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ?? null
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm((s) => ({ ...s, ...initialData }));
      setImagePreview(initialData.image ?? null);
    }
  }, [initialData]);

  const setField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((prev) => ({ ...prev, [String(key)]: "" }));
  };

  const handleFile = (f: File | null) => {
    setFile(f);
    if (f) {
      setImagePreview(URL.createObjectURL(f));
      setField("image", "");
    } else {
      setImagePreview(initialData?.image ?? null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) handleFile(f);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name?.trim()) errs.name = lang.productNameError;
    const priceNum = Number(String(form.price).replace(",", "."));
    if (!form.price || Number.isNaN(priceNum) || priceNum <= 0)
      errs.price = lang.productPriceError;
    if (!form.category) errs.category = lang.productCategoryError;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      let uploadedUrl = form.image;

      // Dosya varsa upload et
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploadedUrl = data.url ?? "";

        if (!uploadedUrl) {
          alert(lang.failedToUploadImage);
          setLoading(false);
          return;
        }
      }

      const productData: Product = { ...form, image: uploadedUrl };

      // Ürünleri JSON'a kaydet
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      setForm({
        name: "",
        category: categories[0] || "",
        price: "",
        description: "",
        image: "",
      });
      setFile(null);
      setImagePreview(null);
      onSuccess?.(productData);
      alert(lang.productSaved);
      router.push("/");
    } catch (err: any) {
      alert("Hata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*[.,]?[0-9]*$/.test(value) || value === "") {
      setField("price", value);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-name">
              {lang.productName}
              <span className={styles.required}>*</span>
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              className={styles.input}
              placeholder={lang.productNamePlaceholder}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "error-name" : undefined}
            />
            {errors.name && (
              <div id="error-name" className={styles.error}>
                {errors.name}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="price">
              {lang.productPrice}
            </label>
            <input
              id="price"
              name="price"
              type="text"
              className={styles.input}
              placeholder={lang.productPricePlaceholder}
              value={form.price}
              onChange={handlePriceInput}
              aria-invalid={!!errors.price}
              aria-describedby={errors.price ? "error-price" : undefined}
            />
            {errors.price && (
              <div id="error-price" className={styles.error}>
                {errors.price}
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            {lang.category}
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            className={styles.select}
          >
            <option value="">{lang.selectCategory}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className={styles.error}>{errors.category}</div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            {lang.description}
          </label>
          <textarea
            id="description"
            rows={4}
            className={styles.textarea}
            placeholder={lang.descriptionPlaceholder}
            value={form.description || ""}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        <div
          className={styles.upload}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <label className={styles.uploadLabel}>{lang.productImage}</label>
          <div className={styles.uploadInner}>
            <div className={styles.svgWrap} aria-hidden>
              <svg
                className={styles.uploadSvg}
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className={styles.uploadText}>
              <label
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                <span>{lang.upoadImage}</span>
              </label>
              <input
                ref={fileInputRef}
                className={styles.srOnly}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                onChange={handleFileChange}
              />
              <p className={styles.small}>{lang.allowedFormats}</p>
            </div>

            {imagePreview && (
              <div className={styles.preview}>
                <img
                  src={imagePreview}
                  alt="Önizleme"
                  className={styles.previewImg}
                />
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => handleFile(null)}
                >
                  {lang.remove}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={handleCancel}
            disabled={loading}
          >
            {lang.cancel}
          </button>
          <button type="submit" className={styles.save} disabled={loading}>
            {loading
              ? lang.saving
              : mode === "add"
              ? lang.save
              : lang.update}
          </button>
        </div>
      </form>
    </div>
  );
}
