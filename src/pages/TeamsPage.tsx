import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import heroStyles from './SubpageHero.module.css'
import InfoCard from '../components/ui/InfoCard'
import EmptyState from '../components/ui/EmptyState'

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
      <div className={heroStyles.teamsHero}>
        <h1>Teams</h1>
        <p>Browse teams, view squads, and follow your favorite clubs.</p>
        <button className={heroStyles.heroCreateBtn} type="button">+ Create Team</button>
      </div>
      <div className="subpage-content">
        <div className="card-list">
          {filteredTeams.map((t) => (
            <InfoCard
              key={t.name}
              title={t.name}
              badge={{ label: t.sport, className: 'sport-tag' }}
              meta={[
                { label: t.status, className: `status-badge ${t.status === 'Live' ? 'live' : ''}` },
                { label: `${t.members} members` },
                { label: `${t.wins} wins` },
                { label: t.city },
              ]}
              action={{ label: 'View Team' }}
            />
          ))}
        </div>
        {filteredTeams.length === 0 ? (
          <EmptyState message="No teams match these filters. Try a different sport or sorting option." />
        ) : null}
      </div>
    </div>
  )
}
