import PageHeader from "../components/PageHeader";
import ProductTable from "../components/ProductTable";
import FloatingButtonWrapper from "@/components/FloatingButtonWrapper";
import styles from "./page.module.scss";
import productsData from "../../data/products.json";

export default function Home() {
  return (
    <div>
      <main className={styles.mainContent}>
        <PageHeader />
        <ProductTable products={productsData} />
        <FloatingButtonWrapper />
      </main>
    </div>
  );
}
