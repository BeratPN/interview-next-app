'use client';

import styles from './FloatingButton.module.scss';

interface FloatingButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export default function FloatingButton({ onClick, children }: FloatingButtonProps) {
  return (
    <button className={styles.floatingButton} onClick={onClick}>
      {children}
    </button>
  );
}
