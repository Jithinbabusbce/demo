import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import '../App.css'

const tournaments = [
  { name: 'City Sports Draft 2026', sport: 'Cricket', teams: 42, format: 'Auction + League', status: 'Live' },
  { name: 'Weekend Warriors Cup', sport: 'Cricket', teams: 16, format: 'Knockout', status: 'Finished' },
  { name: 'Corporate Cricket League', sport: 'Cricket', teams: 24, format: 'Round Robin', status: 'Upcoming' },
  { name: 'Gully Premier League', sport: 'Cricket', teams: 32, format: 'Franchise', status: 'Live' },
  { name: 'Under-19 Championship', sport: 'Cricket', teams: 20, format: 'League + Knockout', status: 'Upcoming' },
  { name: 'Night Smash T10', sport: 'Cricket', teams: 8, format: 'T10 Knockout', status: 'Finished' },
]

export default function TournamentPage() {
  const { search } = useLocation()

  const filteredTournaments = useMemo(() => {
    const params = new URLSearchParams(search)
    const q = (params.get('q') ?? '').toLowerCase()
    const sport = params.get('sport') ?? 'Sports'
    const sort = params.get('sort') ?? 'Filter & Sort By'

    const base = tournaments.filter((item) => {
      if (sport !== 'Sports' && sport !== 'All Sports' && item.sport !== sport) return false
      if (!q) return true
      const hay = `${item.name} ${item.format} ${item.status}`.toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...base]
    if (sort === 'Live') return sorted.filter((item) => item.status === 'Live')
    if (sort === 'Finished') return sorted.filter((item) => item.status === 'Finished')
    if (sort === 'Upcoming') return sorted.filter((item) => item.status === 'Upcoming')
    if (sort === 'Popular') return sorted.sort((a, b) => b.teams - a.teams)
    return sorted
  }, [search])

  return (
    <div className="subpage">
      <div className="subpage-hero tournament-hero">
        <h1>Tournaments</h1>
        <p>Create and manage tournaments with fixtures, standings, brackets, and live scores.</p>
        <button className="hero-create-btn" type="button">+ Create Tournament</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredTournaments.map((t) => (
            <article className="info-card" key={t.name}>
              <div className="info-card-head">
                <h3>{t.name}</h3>
                <span className={`status-badge ${t.status === 'Live' ? 'live' : ''}`}>{t.status}</span>
              </div>
              <div className="info-card-meta">
                <span>{t.teams} Teams</span>
                <span>{t.format}</span>
              </div>
              <button className="card-action-btn">View Details</button>
            </article>
          ))}
        </div>
        {filteredTournaments.length === 0 ? (
          <div className="info-card marketplace-empty-state">
            <h3>No tournaments match these filters</h3>
            <p>Try changing search text or using a different sort and sport filter.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
