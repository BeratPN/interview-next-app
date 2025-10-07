"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  onSearchChange: (searchTerm: string) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export default function PageHeader({ onSearchChange, onSortChange }: PageHeaderProps) {
  const { lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange(value, sortOrder);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOrder(value);
    if (sortBy) {
      onSortChange(sortBy, value);
    }
  };

  return (
    <div className={styles.pageHeader}>
      <h2>{lang.products}</h2>
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <svg
            className="searchIcon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-4.35-4.35A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
          <input 
            type="text" 
            placeholder={lang.search}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className={styles.sortWrapper}>
          <svg
            viewBox="0 0 24 24"
            className="dropdownIcon"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M6 9L12 15L18 9"
                stroke="var(--text-color)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
          <select 
            className={styles.sort}
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">{lang.sortBy}</option>
            <option value="name">{lang.sortByName}</option>
            <option value="price">{lang.sortByPrice}</option>
            <option value="category">{lang.sortByCategory}</option>
          </select>
        </div>

        {sortBy && (
          <div className={styles.sortOrderWrapper}>
            <select 
              className={styles.sortOrder}
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="asc">{lang.sortAscending}</option>
              <option value="desc">{lang.sortDescending}</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
