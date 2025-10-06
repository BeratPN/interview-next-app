'use client';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoTitle}>
        <h1>Dashboard</h1>
      </div>
      <div className={styles.user}>
        Hoş Geldiniz, <strong>[Kullanıcı Adı]</strong>
      </div>
    </header>
  );
}
