"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default function PageHeader({ 
  searchTerm = "", 
  sortBy = "", 
  sortOrder = "asc" 
}: PageHeaderProps) {
  const { lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  const updateURL = useCallback((params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    
    newSearchParams.set('page', '1');
    router.push(`/?${newSearchParams.toString()}`);
  }, [searchParams, router]);

  // Sync local state with URL params
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search
  useEffect(() => {
    if (localSearchTerm !== searchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        updateURL({ search: localSearchTerm });
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm, updateURL]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateURL({ sortBy: value, sortOrder });
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateURL({ sortBy, sortOrder: value });
  };

  return (
    <div className={styles.pageHeader}>
      <h2>{lang.products}</h2>
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          {isSearching ? (
            <div className={styles.loadingSpinner}></div>
          ) : (
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
          )}
          <input 
            type="text" 
            placeholder={lang.search}
            value={localSearchTerm}
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
