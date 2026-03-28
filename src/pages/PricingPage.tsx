import heroStyles from './SubpageHero.module.css'
import styles from './PricingPage.module.css'

const plans = [
  {
    name: 'Free Starter',
    price: 'Free',
    note: 'Ads included',
    features: [
      'Ads shown in app experience',
      'Up to 2 event creations per month',
      '1 active tournament at a time',
      'Basic player discovery filters',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Pro Organizer',
    price: '₹999/month',
    note: 'Most Popular',
    features: [
      'Ad-free experience for organizers',
      'Unlimited events and tournaments',
      'Advanced hiring and seller filters',
      'Priority listing in discovery',
      'Premium support and analytics',
    ],
    cta: 'Upgrade to Pro',
  },
]

export default function PricingPage() {
  return (
    <div className="subpage">
      <div className={heroStyles.pricingHero}>
        <h1>Simple Pricing for Sports Communities</h1>
        <p>Start free with limits and ads, or go Pro for ad-free unlimited tournaments and events.</p>
      </div>

      <div className="subpage-content">
        <div className={styles.pricingGrid}>
          {plans.map((plan, index) => (
            <article className={`info-card ${styles.pricingCard}${index === 1 ? ' featured' : ''}`} key={plan.name}>
              <div className="info-card-head">
                <h3>{plan.name}</h3>
                <span className="sport-tag">{plan.note}</span>
              </div>
              <p className={styles.pricingValue}>{plan.price}</p>
              <ul className={styles.pricingFeatures}>
                {plan.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="card-action-btn">{plan.cta}</button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
