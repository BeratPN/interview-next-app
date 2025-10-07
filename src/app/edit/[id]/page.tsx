"use client";

import ProductForm, { Product } from "@/components/ProductForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.scss";
import stylesLoader from "./EditProductPage.module.scss";

type Props = { params: { id: string } };

export default function EditProductPage({ params }: Props) {
  const router = useRouter();
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
          throw new Error("Ürün bulunamadı");
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
        <div className={stylesLoader.message}>Yükleniyor...</div>
      </div>
    );

  if (notFound)
    return (
      <div className={stylesLoader.wrapper}>
        <div className={stylesLoader.message}>Ürün bulunamadı</div>
      </div>
    );
  return (
    <div className={styles.mainContent}>
      <h1>Ürünü Düzenle</h1>
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
