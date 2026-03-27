import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import '../App.css'

const teams = [
  { name: 'Mumbai Mavericks', sport: 'Cricket', members: 18, wins: 24, city: 'Mumbai', status: 'Live' },
  { name: 'Royal Turf FC', sport: 'Football', members: 22, wins: 16, city: 'Delhi', status: 'Finished' },
  { name: 'Cover Drive CC', sport: 'Cricket', members: 15, wins: 31, city: 'Bangalore', status: 'Live' },
  { name: 'Night Riders', sport: 'Cricket', members: 16, wins: 20, city: 'Kolkata', status: 'Upcoming' },
  { name: 'PowerPlay XI', sport: 'Cricket', members: 14, wins: 28, city: 'Chennai', status: 'Live' },
  { name: 'Thunder Strikers', sport: 'Football', members: 20, wins: 12, city: 'Pune', status: 'Upcoming' },
]

export default function TeamsPage() {
  const { search } = useLocation()

  const filteredTeams = useMemo(() => {
    const params = new URLSearchParams(search)
    const q = (params.get('q') ?? '').toLowerCase()
    const sport = params.get('sport') ?? 'Sports'
    const sort = params.get('sort') ?? 'Filter & Sort By'

    const base = teams.filter((item) => {
      if (sport !== 'Sports' && sport !== 'All Sports' && item.sport !== sport) return false
      if (!q) return true
      const hay = `${item.name} ${item.city} ${item.status}`.toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...base]
    if (sort === 'Live') return sorted.filter((item) => item.status === 'Live')
    if (sort === 'Finished') return sorted.filter((item) => item.status === 'Finished')
    if (sort === 'Trending') return sorted.sort((a, b) => b.wins - a.wins)
    if (sort === 'Most Active') return sorted.sort((a, b) => b.members - a.members)
    return sorted
  }, [search])

  return (
    <div className="subpage">
      <div className="subpage-hero teams-hero">
        <h1>Teams</h1>
        <p>Browse teams, view squads, and follow your favorite clubs.</p>
        <button className="hero-create-btn" type="button">+ Create Team</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredTeams.map((t) => (
            <article className="info-card" key={t.name}>
              <div className="info-card-head">
                <h3>{t.name}</h3>
                <span className="sport-tag">{t.sport}</span>
              </div>
              <div className="info-card-meta">
                <span className={`status-badge ${t.status === 'Live' ? 'live' : ''}`}>{t.status}</span>
                <span>{t.members} members</span>
                <span>{t.wins} wins</span>
                <span>{t.city}</span>
              </div>
              <button className="card-action-btn">View Team</button>
            </article>
          ))}
        </div>
        {filteredTeams.length === 0 ? (
          <div className="info-card marketplace-empty-state">
            <h3>No teams match these filters</h3>
            <p>Try a different sport or sorting option.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
