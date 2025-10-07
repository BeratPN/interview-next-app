// import ProductForm from "@/components/ProductForm";
// import { getProductById } from "@/lib/products";
import styles from "@/app/page.module.scss";

type Props = { params: { id: string } };

export default async function EditProductPage({ params }: Props) {
const product = 5 ; // server-side - await getProductById(params.id)
if (!product) {
return <div>Ürün bulunamadı</div>;
}
// ProductForm client component olduğundan "use client" içinde çalışır — initialData'i prop olarak veriyoruz
return (
<div className={styles.container}>
<h1>Ürünü Düzenle</h1>
{/* <ProductForm mode="edit" initialData={product} /> */}
</div>
);
}
