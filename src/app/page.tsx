"use client";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ProductTable from "../components/ProductTable";
import FloatingButtonWrapper from "@/components/FloatingButtonWrapper";
import styles from "./page.module.scss";
import productsData from "../../data/products.json";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (by: string, order: string) => {
    setSortBy(by);
    setSortOrder(order);
  };

  return (
    <div>
      <main className={styles.mainContent}>
        <PageHeader 
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />
        <ProductTable 
          products={productsData}
          searchTerm={searchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        <FloatingButtonWrapper />
      </main>
    </div>
  );
}
