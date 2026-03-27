import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import '../App.css'

export const challenges = [
  { name: 'Six Hitting Challenge', sport: 'Cricket', prize: '₹10,000', entries: 342, deadline: 'Mar 30, 2026', status: 'Live' },
  { name: 'Free Kick Master', sport: 'Football', prize: '₹8,000', entries: 218, deadline: 'Apr 5, 2026', status: 'Upcoming' },
  { name: 'Sprint King 100m', sport: 'Athletics', prize: '₹15,000', entries: 156, deadline: 'Apr 10, 2026', status: 'Finished' },
  { name: 'Penalty Shootout', sport: 'Football', prize: '₹5,000', entries: 420, deadline: 'Mar 28, 2026', status: 'Live' },
  { name: 'Bowling Accuracy', sport: 'Cricket', prize: '₹7,500', entries: 189, deadline: 'Apr 2, 2026', status: 'Upcoming' },
]

export default function ChallengesPage() {
  const { search } = useLocation()

  const filteredChallenges = useMemo(() => {
    const params = new URLSearchParams(search)
    const q = (params.get('q') ?? '').toLowerCase()
    const sport = params.get('sport') ?? 'Sports'
    const sort = params.get('sort') ?? 'Filter & Sort By'
    const date = params.get('date') ?? 'Date'

    function matchesDateWindow(label: string, dateText: string) {
      if (label === 'Date' || label === 'Any Date') return true
      const parsed = new Date(dateText)
      if (Number.isNaN(parsed.getTime())) return true
      const now = new Date('2026-03-23')
      const ms = parsed.getTime() - now.getTime()
      const dayDiff = ms / (1000 * 60 * 60 * 24)
      if (label === 'Today') return dayDiff >= 0 && dayDiff < 1
      if (label === 'This Week') return dayDiff >= 0 && dayDiff <= 7
      if (label === 'This Month') return dayDiff >= 0 && dayDiff <= 31
      return true
    }

    const base = challenges.filter((item) => {
      if (sport !== 'Sports' && sport !== 'All Sports' && sport !== 'Multi-Sport' && item.sport !== sport) return false
      if (!matchesDateWindow(date, item.deadline)) return false
      if (!q) return true
      const hay = `${item.name} ${item.sport} ${item.status}`.toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...base]
    if (sort === 'Live') return sorted.filter((item) => item.status === 'Live')
    if (sort === 'Finished') return sorted.filter((item) => item.status === 'Finished')
    if (sort === 'Ending Soon') return sorted.sort((a, b) => a.deadline.localeCompare(b.deadline))
    if (sort === 'Popular') return sorted.sort((a, b) => b.entries - a.entries)
    return sorted
  }, [search])

  return (
    <div className="subpage">
      <div className="subpage-hero challenges-hero">
        <h1>Challenges</h1>
        <p>Compete in sports challenges, win prizes, and climb leaderboards.</p>
        <button className="hero-create-btn" type="button">+ Create Challenge</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredChallenges.map((c) => (
            <article className="info-card" key={c.name}>
              <div className="info-card-head">
                <h3>{c.name}</h3>
                <span className="sport-tag">{c.sport}</span>
              </div>
              <div className="info-card-meta">
                <span className={`status-badge ${c.status === 'Live' ? 'live' : ''}`}>{c.status}</span>
                <span>Prize: {c.prize}</span>
                <span>{c.entries} entries</span>
                <span>Deadline: {c.deadline}</span>
              </div>
              <button className="card-action-btn">Join Challenge</button>
            </article>
          ))}
        </div>
        {filteredChallenges.length === 0 ? (
          <div className="info-card marketplace-empty-state">
            <h3>No challenges match these filters</h3>
            <p>Try a different sport or use Live/Finished sorting.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
