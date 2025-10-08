"use client";
import styles from "./ProductTableSkeleton.module.scss";

export default function ProductTableSkeleton() {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableInfo}>
        <div className={styles.skeletonText}></div>
      </div>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
            <th><div className={styles.skeletonText}></div></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index} className={styles.skeletonRow}>
              <td>
                <div className={styles.skeletonImage}></div>
              </td>
              <td>
                <div className={styles.skeletonText}></div>
              </td>
              <td>
                <div className={styles.skeletonText}></div>
              </td>
              <td>
                <div className={styles.skeletonText}></div>
              </td>
              <td>
                <div className={styles.skeletonText}></div>
              </td>
              <td>
                <div className={styles.skeletonCategory}></div>
              </td>
              <td>
                <div className={styles.skeletonText}></div>
              </td>
              <td>
                <div className={styles.skeletonStock}></div>
              </td>
              <td>
                <div className={styles.skeletonActions}></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

