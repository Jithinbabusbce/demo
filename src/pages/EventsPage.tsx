import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import '../App.css'

export const events = [
  { name: 'Sports Carnival 2026', type: 'Multi-Sport', date: 'Apr 15-17, 2026', venue: 'DY Patil Stadium', spots: 500, status: 'Upcoming' },
  { name: 'Weekend Cricket Bash', type: 'Cricket', date: 'Mar 29, 2026', venue: 'Oval Maidan', spots: 120, status: 'Live' },
  { name: 'Football Fiesta', type: 'Football', date: 'Apr 5, 2026', venue: 'Cooperage Ground', spots: 200, status: 'Upcoming' },
  { name: 'Corporate Sports Day', type: 'Multi-Sport', date: 'Apr 20, 2026', venue: 'NSCI Club', spots: 300, status: 'Finished' },
  { name: 'Night Cricket League', type: 'Cricket', date: 'Apr 8-12, 2026', venue: 'Wankhede Ground', spots: 160, status: 'Live' },
]

export default function EventsPage() {
  const { search } = useLocation()

  const filteredEvents = useMemo(() => {
    const params = new URLSearchParams(search)
    const q = (params.get('q') ?? '').toLowerCase()
    const sport = params.get('sport') ?? 'Sports'
    const sort = params.get('sort') ?? 'Filter & Sort By'
    const date = params.get('date') ?? 'Date'

    function matchesDateWindow(label: string, dateText: string) {
      if (label === 'Date' || label === 'Any Date') return true
      const primaryPart = dateText.split('-')[0]?.trim() ?? dateText
      const parsed = new Date(primaryPart)
      if (Number.isNaN(parsed.getTime())) return true
      const now = new Date('2026-03-23')
      const ms = parsed.getTime() - now.getTime()
      const dayDiff = ms / (1000 * 60 * 60 * 24)
      if (label === 'Today') return dayDiff >= 0 && dayDiff < 1
      if (label === 'This Weekend') return dayDiff >= 0 && dayDiff <= 6
      if (label === 'This Month') return dayDiff >= 0 && dayDiff <= 31
      return true
    }

    const base = events.filter((item) => {
      if (sport !== 'Sports' && sport !== 'All Sports' && sport !== 'Basketball' && item.type !== sport && item.type !== 'Multi-Sport') return false
      if (!matchesDateWindow(date, item.date)) return false
      if (!q) return true
      const hay = `${item.name} ${item.type} ${item.venue} ${item.status}`.toLowerCase()
      return hay.includes(q)
    })

    const sorted = [...base]
    if (sort === 'Live') return sorted.filter((item) => item.status === 'Live')
    if (sort === 'Finished') return sorted.filter((item) => item.status === 'Finished')
    if (sort === 'Upcoming') return sorted.filter((item) => item.status === 'Upcoming')
    if (sort === 'Popular') return sorted.sort((a, b) => b.spots - a.spots)
    return sorted
  }, [search])

  return (
    <div className="subpage">
      <div className="subpage-hero events-hero">
        <h1>Events</h1>
        <p>Create events, manage RSVPs, and coordinate venues — all in one place.</p>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredEvents.map((e) => (
            <article className="info-card" key={e.name}>
              <div className="info-card-head">
                <h3>{e.name}</h3>
                <span className="sport-tag">{e.type}</span>
              </div>
              <div className="info-card-meta">
                <span className={`status-badge ${e.status === 'Live' ? 'live' : ''}`}>{e.status}</span>
                <span>{e.date}</span>
                <span>{e.venue}</span>
                <span>{e.spots} spots left</span>
              </div>
              <button className="card-action-btn">Register Now</button>
            </article>
          ))}
        </div>
        {filteredEvents.length === 0 ? (
          <div className="info-card marketplace-empty-state">
            <h3>No events match these filters</h3>
            <p>Try changing search, sport, or sorting by Live/Finished/Upcoming.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
