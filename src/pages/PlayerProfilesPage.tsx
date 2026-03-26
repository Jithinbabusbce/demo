import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import '../App.css'

export const players = [
  { name: 'Arjun Mehta', sport: 'Cricket', role: 'All-Rounder', rating: 4.8, matches: 156, city: 'Mumbai' },
  { name: 'Priya Sharma', sport: 'Football', role: 'Midfielder', rating: 4.6, matches: 98, city: 'Delhi' },
  { name: 'Rahul Desai', sport: 'Cricket', role: 'Fast Bowler', rating: 4.9, matches: 210, city: 'Bangalore' },
  { name: 'Sneha Patil', sport: 'Badminton', role: 'Singles', rating: 4.7, matches: 134, city: 'Pune' },
  { name: 'Vikram Singh', sport: 'Cricket', role: 'Batsman', rating: 4.5, matches: 178, city: 'Chennai' },
  { name: 'Ananya Reddy', sport: 'Football', role: 'Striker', rating: 4.8, matches: 112, city: 'Hyderabad' },
]

export default function PlayerProfilesPage() {
  const { search } = useLocation()

  const filteredPlayers = useMemo(() => {
    const params = new URLSearchParams(search)
    const q = (params.get('q') ?? '').toLowerCase()
    const sport = params.get('sport') ?? 'Sports'
    const sort = params.get('sort') ?? 'Filter & Sort By'

    const base = players.filter((item) => {
      if (sport !== 'Sports' && sport !== 'All Sports' && item.sport !== sport) return false
      if (!q) return true
      const hay = `${item.name} ${item.role} ${item.city}`.toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...base]
    if (sort === 'Top Rated') return sorted.sort((a, b) => b.rating - a.rating)
    if (sort === 'Most Matches') return sorted.sort((a, b) => b.matches - a.matches)
    if (sort === 'Recently Active') return sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [search])

  return (
    <div className="subpage">
      <div className="subpage-hero profiles-hero">
        <h1>Player Profiles</h1>
        <p>Discover talented players, view their stats, and connect for hiring or team building.</p>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredPlayers.map((p) => (
            <article className="info-card" key={p.name}>
              <div className="info-card-head">
                <h3>{p.name}</h3>
                <span className="sport-tag">{p.sport}</span>
              </div>
              <div className="info-card-meta">
                <span>{p.role}</span>
                <span>★ {p.rating}</span>
                <span>{p.matches} matches</span>
                <span>{p.city}</span>
              </div>
              <button className="card-action-btn">View Profile</button>
            </article>
          ))}
        </div>
        {filteredPlayers.length === 0 ? (
          <div className="info-card marketplace-empty-state">
            <h3>No players match these filters</h3>
            <p>Try searching by city, role, or selecting another sport.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
