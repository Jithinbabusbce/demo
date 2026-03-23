import '../App.css'

export default function StorePage() {
  return (
    <div className="subpage">
      <div className="subpage-hero store-hero">
        <h1>Store Coming Soon</h1>
        <p>A powerful sports commerce layer is on the way for teams, creators, and turf owners.</p>
      </div>
      <div className="subpage-content">
        <section className="info-card store-coming-card">
          <h3>Future-Ready Sports Store Integration</h3>
          <p>
            You can integrate your own store catalog in future releases and sell sports products directly inside Gully World.
          </p>
          <ul className="pricing-features">
            <li>Sell equipment, apparel, nutrition, and accessories</li>
            <li>Connect your own inventory and order flow</li>
            <li>Promote products through events, teams, and marketplace profiles</li>
          </ul>
          <button className="card-action-btn">Notify Me When Store Launches</button>
        </section>
      </div>
    </div>
  )
}
