"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./ProductForm.module.scss";
import { useLanguage } from "@/context/LanguageContext";
import { ApiErrorHandler, showErrorToast } from "@/utils/errorHandler";
import { Product, FormMode, FormErrors } from "@/types";
import { validateProduct, formatPrice, validateFile, BLUR_DATA_URL } from "@/utils";
import { APP_CONFIG, PRODUCT_CATEGORIES } from "@/constants";

interface ProductFormProps {
  mode?: FormMode;
  initialData?: Product;
  categories?: string[];
  apiEndpoint?: string;
  onSuccess?: (product?: Product) => void;
  onCancel?: () => void;
}

export default function ProductForm({
  mode = "add",
  initialData,
  categories = PRODUCT_CATEGORIES,
  apiEndpoint,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { lang } = useLanguage();
  const router = useRouter();

  // Form state
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

  // Input states for controlled inputs
  const [priceInput, setPriceInput] = useState<string>(
    initialData?.price?.toString() || ""
  );
  const [stockInput, setStockInput] = useState<string>(
    initialData?.stock?.toString() || ""
  );

  // File and preview states
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ?? null
  );

  // UI states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
      setPriceInput(initialData.price.toString());
      setStockInput(initialData.stock.toString());
      setImagePreview(initialData.image ?? null);
    }
  }, [initialData]);

  // Helper function to update form fields
  const setField = <K extends keyof Product>(key: K, value: Product[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Hata mesajını temizle
    setErrors((prev) => ({ ...prev, [String(key)]: "" }));
  };

  // Real-time validation for individual fields
  const validateField = <K extends keyof Product>(key: K, value: Product[K]) => {
    const fieldErrors = validateProduct({ [key]: value }, lang);
    if (fieldErrors[key]) {
      setErrors((prev) => ({ ...prev, [String(key)]: fieldErrors[key] }));
    } else {
      setErrors((prev) => ({ ...prev, [String(key)]: "" }));
    }
  };

  // File handling
  const handleFile = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setErrors((prev) => ({ ...prev, image: validationError }));
        return;
      }
      setImagePreview(URL.createObjectURL(selectedFile));
      setField("image", "");
    } else {
      setImagePreview(initialData?.image ?? null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    handleFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0] ?? null;
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // Price input handling
  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.,]/g, "");
    value = value.replace(",", ".");
    setPriceInput(value);
    const priceValue = value === "" ? 0 : parseFloat(value);
    setField("price", priceValue);
  };

  const handlePriceBlur = () => {
    validateField("price", form.price);
  };

  // Stock input handling
  const handleStockInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (/^\d*$/.test(value) || value === "") {
      setStockInput(value);
      const stockValue = value === "" ? 0 : parseInt(value);
      setField("stock", stockValue);
    }
  };

  const handleStockBlur = () => {
    validateField("stock", form.stock);
  };

  // Form validation
  const validate = (): boolean => {
    const validationErrors = validateProduct(form, lang);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.image;

      // Upload file if exists
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadResponse = await ApiErrorHandler.handleFetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        imageUrl = uploadResponse.url;
      }

      // Prepare product data
      const productData = {
        ...form,
        image: imageUrl,
        price: parseFloat(priceInput) || 0,
        stock: parseInt(stockInput) || 0,
      };

      // Determine API endpoint
      const endpoint = apiEndpoint || 
        (mode === "add" ? "/api/products" : `/api/products/${initialData?.id}`);

      // Submit product
      await ApiErrorHandler.handleFetch(endpoint, {
        method: mode === "add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      onSuccess?.(productData);
      
      // Reset form
      setPriceInput("");
      setStockInput("");
      
      // Navigate or call success callback
      if (!onSuccess) {
        setTimeout(() => router.push("/"), 100);
      }
    } catch (err: any) {
      console.error("Form error:", err);
      showErrorToast(err, lang);
    } finally {
      setLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
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
              onBlur={() => validateField("name", form.name)}
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
              onBlur={() => validateField("brand", form.brand)}
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
              onBlur={() => validateField("model", form.model)}
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
              onBlur={handlePriceBlur}
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
              onBlur={() => validateField("color", form.color)}
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
              onBlur={handleStockBlur}
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
            {lang.productCategory}
            <span className={styles.required}>*</span>
          </label>
          <select
            id="category"
            name="category"
            className={styles.select}
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            onBlur={() => validateField("category", form.category)}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "error-category" : undefined}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <div id="error-category" className={styles.error}>
              {errors.category}
            </div>
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
                accept={APP_CONFIG.IMAGES.ALLOWED_TYPES.join(",")}
                onChange={handleFileChange}
              />
              <p className={styles.small}>{lang.allowedFormats}</p>
            </div>

            {imagePreview && (
              <div className={styles.preview}>
                <Image
                  src={imagePreview}
                  alt="Önizleme"
                  className={styles.previewImg}
                  width={APP_CONFIG.IMAGES.PREVIEW_SIZE}
                  height={APP_CONFIG.IMAGES.PREVIEW_SIZE}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '0.375rem'
                  }}
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
          {errors.image && (
            <div className={styles.error}>
              {errors.image}
            </div>
          )}
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