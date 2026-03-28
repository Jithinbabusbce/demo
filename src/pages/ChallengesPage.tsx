import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import heroStyles from './SubpageHero.module.css'
import InfoCard from '../components/ui/InfoCard'
import EmptyState from '../components/ui/EmptyState'
import { challenges } from '../data/challenges'

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
      <div className={heroStyles.challengesHero}>
        <h1>Challenges</h1>
        <p>Compete in sports challenges, win prizes, and climb leaderboards.</p>
        <button className={heroStyles.heroCreateBtn} type="button">+ Create Challenge</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredChallenges.map((c) => (
            <InfoCard
              key={c.name}
              title={c.name}
              badge={{ label: c.sport, className: 'sport-tag' }}
              meta={[
                { label: c.status, className: `status-badge ${c.status === 'Live' ? 'live' : ''}` },
                { label: `Prize: ${c.prize}` },
                { label: `${c.entries} entries` },
                { label: `Deadline: ${c.deadline}` },
              ]}
              action={{ label: 'Join Challenge' }}
            />
          ))}
        </div>
        {filteredChallenges.length === 0 ? (
          <EmptyState message="No challenges match these filters. Try a different sport or use Live/Finished sorting." />
        ) : null}
      </div>
    </div>
  )
}
