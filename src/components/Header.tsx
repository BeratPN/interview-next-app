"use client";
import { useTheme } from "@/context/ThemeContext";
import styles from "./Header.module.scss";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const { language, setLanguage, lang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.logoTitle}>
        <h1>{lang.dashboard}</h1>
      </div>
      <div className={styles.rightSection}>
        <div>{lang.greeting}, ADMIN</div>
        <button onClick={toggleTheme}>{theme === "light" ? "🌙" : "☀️"}</button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "tr" | "en")}
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </div>
    </header>
  );
}
