import styles from './BrandWordmark.module.css'

function BrandWordmark({ size = 'default' }: { size?: 'default' | 'footer' }) {
  const cls = size === 'footer' ? `${styles.brandWordmark} ${styles.brandWordmarkFooter}` : styles.brandWordmark;
  return (
    <span className={cls} aria-label="Gully World">
      <span className={styles.wmGully}>GULLY</span>
      <span className={styles.wmWorld}>WORLD</span>
    </span>
  )
}

export default BrandWordmark
