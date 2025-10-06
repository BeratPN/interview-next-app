import styles from "./PageHeader.module.scss";

export default function PageHeader() {
  return (
    <div className={styles.pageHeader}>
      <h2>Products</h2>
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
          <input type="text" placeholder="Search" />
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
          <select className={styles.sort}>
            <option>Sort by</option>
            <option>Name</option>
            <option>Price</option>
            <option>Category</option>
          </select>
        </div>
      </div>
    </div>
  );
}
