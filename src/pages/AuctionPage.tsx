import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import '../App.css'

const auctionItems = [
  { name: 'City Sports Draft 2026', basePrice: '₹5,000', teams: 8, players: 120, status: 'Live' },
  { name: 'Gully Premier Auction', basePrice: '₹2,000', teams: 10, players: 80, status: 'Upcoming' },
  { name: 'Corporate League Auction', basePrice: '₹10,000', teams: 6, players: 60, status: 'Completed' },
  { name: 'Under-19 Talent Draft', basePrice: '₹1,000', teams: 12, players: 150, status: 'Upcoming' },
]

export default function AuctionPage() {
  const { search } = useLocation()

  const filteredAuctions = useMemo(() => {
    const params = new URLSearchParams(search)
    const q = (params.get('q') ?? '').toLowerCase()
    const sort = params.get('sort') ?? 'Filter & Sort By'

    const base = auctionItems.filter((item) => {
      if (!q) return true
      const hay = `${item.name} ${item.status} ${item.basePrice}`.toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...base]
    if (sort === 'Live') return sorted.filter((item) => item.status === 'Live')
    if (sort === 'Finished') return sorted.filter((item) => item.status === 'Completed')
    if (sort === 'Upcoming') return sorted.filter((item) => item.status === 'Upcoming')
    if (sort === 'Highest Budget') {
      return sorted.sort((a, b) => Number(b.basePrice.replace(/[^\d]/g, '')) - Number(a.basePrice.replace(/[^\d]/g, '')))
    }
    return sorted
  }, [search])

  return (
    <div className="subpage">
      <div className="subpage-hero auction-hero">
        <h1>Auction</h1>
        <p>Host player auctions with bids, team budgets, and live updates.</p>
        <button className="hero-create-btn" type="button">+ Start Auction</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredAuctions.map((a) => (
            <article className="info-card" key={a.name}>
              <div className="info-card-head">
                <h3>{a.name}</h3>
                <span className={`status-badge ${a.status === 'Live' ? 'live' : ''}`}>{a.status}</span>
              </div>
              <div className="info-card-meta">
                <span>Base: {a.basePrice}</span>
                <span>{a.teams} teams</span>
                <span>{a.players} players</span>
              </div>
              <button className="card-action-btn">Enter Auction</button>
            </article>
          ))}
        </div>
        {filteredAuctions.length === 0 ? (
          <div className="info-card marketplace-empty-state">
            <h3>No auction listings match these filters</h3>
            <p>Try changing search text or use Live/Upcoming sorting.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
