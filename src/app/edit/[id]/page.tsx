"use client";

import ProductForm, { Product } from "@/components/ProductForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import styles from "@/app/page.module.scss";
import stylesLoader from "./EditProductPage.module.scss";

type Props = { params: { id: string } };

export default function EditProductPage({ params }: Props) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // params artık Promise, önce resolve etmemiz gerekiyor
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    }

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setNotFound(true);
          }
          throw new Error(lang.productNotFound);
        }

        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
          setNotFound(true);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className={stylesLoader.wrapper}>
        <div className={stylesLoader.loader}></div>
        <div className={stylesLoader.message}>{lang.loading}</div>
      </div>
    );

  if (notFound)
    return (
      <div className={stylesLoader.wrapper}>
        <div className={stylesLoader.message}>{lang.productNotFound}</div>
      </div>
    );
  return (
    <div className={styles.mainContent}>
      <h1>{lang.editProduct}</h1>
      <ProductForm
        mode="edit"
        initialData={product!}
        onSuccess={() => {
          router.push("/");
        }}
      />
    </div>
  );
}
