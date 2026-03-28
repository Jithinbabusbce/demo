import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import heroStyles from './SubpageHero.module.css'
import InfoCard from '../components/ui/InfoCard'
import EmptyState from '../components/ui/EmptyState'
import { events } from '../data/events'

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
      <div className={heroStyles.eventsHero}>
        <h1>Events</h1>
        <p>Create events, manage RSVPs, and coordinate venues — all in one place.</p>
        <button className={heroStyles.heroCreateBtn} type="button">+ Create Event</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredEvents.map((e) => (
            <InfoCard
              key={e.name}
              title={e.name}
              badge={{ label: e.type, className: 'sport-tag' }}
              meta={[
                { label: e.status, className: `status-badge ${e.status === 'Live' ? 'live' : ''}` },
                { label: e.date },
                { label: e.venue },
                { label: `${e.spots} spots left` },
              ]}
              action={{ label: 'Register Now' }}
            />
          ))}
        </div>
        {filteredEvents.length === 0 ? (
          <EmptyState message="No events match these filters. Try changing search, sport, or sorting by Live/Finished/Upcoming." />
        ) : null}
      </div>
    </div>
  )
}
