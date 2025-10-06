"use client";
import { useTheme } from "@/context/ThemeContext";
import styles from "./Header.module.scss";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.logoTitle}>
        <h1>Dashboard</h1>
      </div>
      <div className={styles.rightSection}>
        <div>Merhaba, Kullanıcı</div>
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
