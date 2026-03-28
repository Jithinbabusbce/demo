import styles from './AppStoreBadges.module.css'

function AppStoreBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${styles.storeBadgeList}${compact ? ` ${styles.compact}` : ''}`}>
      <a className={styles.storeBadge} href="#" aria-label="Download on App Store">
        <svg className={styles.storeIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.35 2.77M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <span className={styles.storeBadgeText}>
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </a>
      <a className={styles.storeBadge} href="#" aria-label="Get it on Google Play">
        <svg className={styles.storeIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
        </svg>
        <span className={styles.storeBadgeText}>
          <small>GET IT ON</small>
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  )
}

export default AppStoreBadges
