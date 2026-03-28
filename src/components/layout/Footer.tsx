import { Link } from 'react-router-dom'
import SocialIcon from '../ui/SocialIcon'
import gullyWorldLogo from '../../assets/gully-world-logo.svg'
import styles from './Footer.module.css'

function Footer() {
  return (
    <>
      {/* Sports-themed footer */}
      <footer className={styles.footerMain}>
        <div className={styles.footerSportsBg} aria-hidden="true">
          <span>&#x26BD;</span><span>&#x1F3CF;</span><span>&#x1F3C0;</span><span>&#x1F3BE;</span><span>&#x1F3D0;</span><span>&#x1F94A;</span><span>&#x1F3D1;</span><span>&#x1F3F8;</span>
        </div>
        <div className={styles.footerTopBand}>
          <div className={styles.footerTopInner}>
            <div className={styles.footerTrustHeading}>
              <h2>Trusted by Sports Brands</h2>
              <p>Partners powering events, talent growth, and sports communities on Gully World.</p>
            </div>
            <div className={styles.footerTrustTrack} aria-hidden="true">
              <div className={styles.footerTrustScroll}>
                <span className={styles.footerTrustItem}>&#x1F3CF; CricZone</span>
                <span className={styles.footerTrustItem}>&#x26BD; KickStart</span>
                <span className={styles.footerTrustItem}>&#x1F3F8; ShuttlePro</span>
                <span className={styles.footerTrustItem}>&#x1F94A; FightClub</span>
                <span className={styles.footerTrustItem}>&#x1F3C0; DunkCity</span>
                <span className={styles.footerTrustItem}>&#x1F3D1; HockeyEdge</span>
                <span className={styles.footerTrustItem}>&#x1F3BE; AceServe</span>
                <span className={styles.footerTrustItem}>&#x1F3D0; VolleyNet</span>
                <span className={styles.footerTrustItem}>&#x1F3CF; CricZone</span>
                <span className={styles.footerTrustItem}>&#x26BD; KickStart</span>
                <span className={styles.footerTrustItem}>&#x1F3F8; ShuttlePro</span>
                <span className={styles.footerTrustItem}>&#x1F94A; FightClub</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerInner}>
          <div className={`${styles.footerCol} ${styles.footerBrandCol}`}>
            <Link to="/" className={styles.footerBrandLink} aria-label="Gully World home">
              <img className={styles.footerLogo} src={gullyWorldLogo} alt="Gully World" width={48} height={48} />
            </Link>
            <p className={styles.footerTagline}>The sports network for modern players</p>
            <div className={styles.footerSocial} role="group" aria-label="Social media links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook (opens in new tab)">
                <SocialIcon platform="facebook" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in new tab)">
                <SocialIcon platform="instagram" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube (opens in new tab)">
                <SocialIcon platform="youtube" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter (opens in new tab)">
                <SocialIcon platform="twitter" />
              </a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Company</h4>
            <Link to="/contact">About Us</Link>
            <Link to="/contact">Careers</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/pricing">Pricing</Link>
          </div>

          <div className={styles.footerCol}>
            <h4>Support</h4>
            <Link to="/contact">Help Center</Link>
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Terms of Service</Link>
            <Link to="/contact">Report Issue</Link>
          </div>

          <div className={styles.footerCol}>
            <h4>Community</h4>
            <Link to="/feed">Blog</Link>
            <Link to="/feed">Forum</Link>
            <Link to="/feed">How Gully World Works</Link>
            <Link to="/feed">Community Stories</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2026 Gully World Technology Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Footer
