import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import heroStyles from './SubpageHero.module.css'
import InfoCard from '../components/ui/InfoCard'
import EmptyState from '../components/ui/EmptyState'

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
      <div className={heroStyles.auctionHero}>
        <h1>Auction</h1>
        <p>Host player auctions with bids, team budgets, and live updates.</p>
        <button className={heroStyles.heroCreateBtn} type="button">+ Start Auction</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredAuctions.map((a) => (
            <InfoCard
              key={a.name}
              title={a.name}
              badge={{ label: a.status, className: `status-badge ${a.status === 'Live' ? 'live' : ''}` }}
              meta={[
                { label: `Base: ${a.basePrice}` },
                { label: `${a.teams} teams` },
                { label: `${a.players} players` },
              ]}
              action={{ label: 'Enter Auction' }}
            />
          ))}
        </div>
        {filteredAuctions.length === 0 ? (
          <EmptyState message="No auction listings match these filters. Try changing search text or use Live/Upcoming sorting." />
        ) : null}
      </div>
    </div>
  )
}
