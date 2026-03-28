import heroStyles from './SubpageHero.module.css'
import styles from './StorePage.module.css'

const storeFeatures = [
  { icon: '🏏', label: 'Equipment & Gear' },
  { icon: '👕', label: 'Team Apparel' },
  { icon: '🥤', label: 'Sports Nutrition' },
]

export default function StorePage() {
  return (
    <div className="subpage">
      <div className={heroStyles.storeHero}>
        <h1>Store Coming Soon</h1>
        <p>A powerful sports commerce layer is on the way for teams, creators, and turf owners.</p>
      </div>
      <div className="subpage-content">
        <div className={styles.storeComingWrapper}>
          <section className={`info-card ${styles.storeComingCard}`}>
            <div className={styles.storeIconRow}>
              <span>🛒</span>
              <span>🏆</span>
              <span>⚡</span>
            </div>
            <h3>Future-Ready Sports Store Integration</h3>
            <p>
              Integrate your own store catalog in future releases and sell sports products directly inside Gully World.
            </p>

            <ul className={styles.storeFeatures}>
              {storeFeatures.map((item) => (
                <li key={item.label} className={styles.storeFeatureItem}>
                  <span className={styles.storeFeatureIcon}>{item.icon}</span>
                  <span className={styles.storeFeatureLabel}>{item.label}</span>
                </li>
              ))}
            </ul>

            <div className={styles.storeNotifySection}>
              <div className={styles.storeEmailRow}>
                <input
                  className={styles.storeEmailInput}
                  type="email"
                  placeholder="Enter your email for updates"
                  aria-label="Email for store launch notification"
                />
                <button className="card-action-btn" style={{ marginTop: 0 }}>Notify Me</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
