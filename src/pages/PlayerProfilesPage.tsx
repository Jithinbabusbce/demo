import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import heroStyles from './SubpageHero.module.css'
import InfoCard from '../components/ui/InfoCard'
import EmptyState from '../components/ui/EmptyState'
import { players } from '../data/players'

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
      <div className={heroStyles.profilesHero}>
        <h1>Player Profiles</h1>
        <p>Discover talented players, view their stats, and connect for hiring or team building.</p>
        <button className={heroStyles.heroCreateBtn} type="button">+ Create Profile</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredPlayers.map((p) => (
            <InfoCard
              key={p.name}
              title={p.name}
              badge={{ label: p.sport, className: 'sport-tag' }}
              meta={[
                { label: p.role },
                { label: `★ ${p.rating}` },
                { label: `${p.matches} matches` },
                { label: p.city },
              ]}
              action={{ label: 'View Profile' }}
            />
          ))}
        </div>
        {filteredPlayers.length === 0 ? (
          <EmptyState message="No players match these filters. Try searching by city, role, or selecting another sport." />
        ) : null}
      </div>
    </div>
  )
}
