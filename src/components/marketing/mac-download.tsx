import styles from "./mac-download.module.css";

export function MacDownload() {
  return (
    <div className={styles.root} data-proto-id="download-cta">
      <a
        href="/api/desktop/download"
        className={styles.button}
      >
        <Apple />
        <span>Download for macOS</span>
        <span className={styles.key}>
          <Arrow />
        </span>
      </a>
    </div>
  );
}

function Apple() {
  return (
    <svg
      width="19"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 12.54c.02 3.11 2.73 4.15 2.76 4.16-.02.07-.43 1.48-1.43 2.94-.87 1.26-1.77 2.52-3.19 2.55-1.39.03-1.84-.82-3.43-.82-1.58 0-2.08.79-3.4.85-1.37.05-2.4-1.37-3.28-2.62-1.79-2.58-3.16-7.29-1.32-10.48.91-1.59 2.54-2.6 4.31-2.63 1.35-.03 2.62.91 3.44.91.82 0 2.36-1.13 3.97-.96.67.03 2.56.27 3.77 2.04-.1.06-2.25 1.31-2.2 4.06ZM14.44 4.73c.73-.88 1.22-2.1 1.09-3.32-1.05.04-2.32.7-3.07 1.58-.68.78-1.27 2.03-1.11 3.23 1.17.09 2.36-.59 3.09-1.49Z" />
    </svg>
  );
}
function Arrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" />
    </svg>
  );
}
