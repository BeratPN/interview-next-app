"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.scss";
import { useLanguage } from "@/context/LanguageContext";
import { ApiErrorHandler, showErrorToast } from "@/utils/errorHandler";

export interface Product {
  id?: string | number;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  brand: string;
  model: string;
  color: string;
  stock: number;
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
  const { lang } = useLanguage();
  const router = useRouter();

  const [form, setForm] = useState<Product>({
    name: "",
    category: categories[0] || "",
    price: 0,
    description: "",
    image: "",
    brand: "",
    model: "",
    color: "",
    stock: 0,
    ...initialData,
  });

  // ayrı bir string state input için
  const [priceInput, setPriceInput] = useState<string>(
    initialData?.price?.toString() || ""
  );
  const [stockInput, setStockInput] = useState<string>(
    initialData?.stock?.toString() || ""
  );

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
      setPriceInput(initialData.price.toString());
      setStockInput(initialData.stock.toString());
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
    
    // Temel alanlar
    if (!form.name?.trim()) errs.name = lang.productNameError;
    if (form.price <= 0 || Number.isNaN(form.price)) errs.price = lang.productPriceError;
    if (!form.category) errs.category = lang.productCategoryError;
    
    // Yeni alanlar
    if (!form.brand?.trim()) errs.brand = lang.brandError;
    if (!form.model?.trim()) errs.model = lang.modelError;
    if (!form.color?.trim()) errs.color = lang.colorError;
    
    // Stok validasyonu
    if (Number.isNaN(form.stock) || form.stock < 0) {
      errs.stock = lang.stockError;
    } else if (form.stock === 0) {
      errs.stock = lang.stockMinError;
    } else if (form.stock > 999999) {
      errs.stock = lang.stockMaxError;
    }
    
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

      if (mode === "edit" && initialData?.id) {
        // Güncelleme işlemi
        await ApiErrorHandler.handleFetch(`/api/products/${initialData.id}`, {
          method: "PUT",
          body: JSON.stringify(productData),
        });
      } else {
        // Yeni ürün ekleme
        await ApiErrorHandler.handleFetch("/api/products", {
          method: "POST",
          body: JSON.stringify(productData),
        });
      }

      setForm({
        name: "",
        category: categories[0] || "",
        price: 0,
        description: "",
        image: "",
        brand: "",
        model: "",
        color: "",
        stock: 0,
      });
      setPriceInput("");
      setStockInput("");
      setFile(null);
      setImagePreview(null);
      onSuccess?.(productData);
      mode === "edit" ? alert(lang.productUpdated) : alert(lang.productSaved);
      router.push("/");
    } catch (err: any) {
      console.error("Form error:", err);
      showErrorToast(err, lang);
    } finally {
      setLoading(false);
      setTimeout(() => router.push("/"), 100); // hala yönlendirme yapmazsa diye
    }
  };

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(",", ".");

    // sadece geçerli float formatına izin ver
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setPriceInput(value);
      setField("price", value === "" ? 0 : parseFloat(value)); // number olarak kaydet
    }
  };

  const handleStockInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // sadece geçerli integer formatına izin ver
    if (/^\d*$/.test(value) || value === "") {
      setStockInput(value);
      setField("stock", value === "" ? 0 : parseInt(value)); // number olarak kaydet
    }
  };

  const handleCancel = () => {
    onCancel?.();
    router.push("/");
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
            <label className={styles.label} htmlFor="brand">
              {lang.brand}
              <span className={styles.required}>*</span>
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              className={styles.input}
              placeholder={lang.brandPlaceholder}
              value={form.brand}
              onChange={(e) => setField("brand", e.target.value)}
              aria-invalid={!!errors.brand}
              aria-describedby={errors.brand ? "error-brand" : undefined}
            />
            {errors.brand && (
              <div id="error-brand" className={styles.error}>
                {errors.brand}
              </div>
            )}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="model">
              {lang.model}
              <span className={styles.required}>*</span>
            </label>
            <input
              id="model"
              name="model"
              type="text"
              className={styles.input}
              placeholder={lang.modelPlaceholder}
              value={form.model}
              onChange={(e) => setField("model", e.target.value)}
              aria-invalid={!!errors.model}
              aria-describedby={errors.model ? "error-model" : undefined}
            />
            {errors.model && (
              <div id="error-model" className={styles.error}>
                {errors.model}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="price">
              {lang.productPrice}
              <span className={styles.required}>*</span>
            </label>
            <input
              id="price"
              name="price"
              type="text"
              className={styles.input}
              placeholder={lang.productPricePlaceholder}
              value={priceInput}
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

        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="color">
              {lang.color}
              <span className={styles.required}>*</span>
            </label>
            <input
              id="color"
              name="color"
              type="text"
              className={styles.input}
              placeholder={lang.colorPlaceholder}
              value={form.color}
              onChange={(e) => setField("color", e.target.value)}
              aria-invalid={!!errors.color}
              aria-describedby={errors.color ? "error-color" : undefined}
            />
            {errors.color && (
              <div id="error-color" className={styles.error}>
                {errors.color}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="stock">
              {lang.stock}
              <span className={styles.required}>*</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="text"
              className={styles.input}
              placeholder={lang.stockPlaceholder}
              value={stockInput}
              onChange={handleStockInput}
              aria-invalid={!!errors.stock}
              aria-describedby={errors.stock ? "error-stock" : undefined}
            />
            {errors.stock && (
              <div id="error-stock" className={styles.error}>
                {errors.stock}
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
            {loading ? lang.saving : mode === "add" ? lang.save : lang.update}
          </button>
        </div>
      </form>
    </div>
  );
}
