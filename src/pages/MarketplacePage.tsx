import { useMemo, useState } from 'react'
import heroStyles from './SubpageHero.module.css'
import styles from './MarketplacePage.module.css'

type Mode = 'hire' | 'offer'

type Listing = {
  id: number
  mode: Mode
  title: string
  summary: string
  sport: 'Cricket' | 'Football' | 'Badminton'
  role: string
  level: 'Amateur' | 'Level 1' | 'Level 2' | 'Pro'
  serviceTier: 'Basic' | 'Standard' | 'Premium'
  budget: number
  rating: number
  completed: number
  responseHours: number
  city: string
}

const roleBySport: Record<string, string[]> = {
  Cricket: ['Batter', 'Bowler', 'All-Rounder', 'Wicket Keeper', 'Coach'],
  Football: ['Defender', 'Midfielder', 'Attacker', 'Goalkeeper', 'Coach'],
  Badminton: ['Singles Specialist', 'Doubles Specialist', 'Smash Specialist', 'Defensive Player', 'Coach'],
}

const listings: Listing[] = [
  {
    id: 1,
    mode: 'hire',
    title: 'Hire T20 Power Batter',
    summary: 'Need a top-order hitter for weekend turf league with strong strike rotation.',
    sport: 'Cricket',
    role: 'Batter',
    level: 'Level 2',
    serviceTier: 'Standard',
    budget: 2500,
    rating: 4.7,
    completed: 46,
    responseHours: 3,
    city: 'Bangalore',
  },
  {
    id: 2,
    mode: 'hire',
    title: 'Hire Left-Arm Swing Bowler',
    summary: 'Looking for opening spell specialist for district-level cricket challenge.',
    sport: 'Cricket',
    role: 'Bowler',
    level: 'Pro',
    serviceTier: 'Premium',
    budget: 5200,
    rating: 4.9,
    completed: 88,
    responseHours: 1,
    city: 'Mumbai',
  },
  {
    id: 3,
    mode: 'hire',
    title: 'Hire Counter-Attacking Defender',
    summary: 'Need a football defender for 7v7 city cup and weekly practice sessions.',
    sport: 'Football',
    role: 'Defender',
    level: 'Level 1',
    serviceTier: 'Basic',
    budget: 1400,
    rating: 4.5,
    completed: 28,
    responseHours: 5,
    city: 'Delhi',
  },
  {
    id: 4,
    mode: 'hire',
    title: 'Hire Pressing Attacker',
    summary: 'Seeking aggressive attacker for short-format football challenge matches.',
    sport: 'Football',
    role: 'Attacker',
    level: 'Level 2',
    serviceTier: 'Standard',
    budget: 3200,
    rating: 4.8,
    completed: 67,
    responseHours: 2,
    city: 'Hyderabad',
  },
  {
    id: 5,
    mode: 'hire',
    title: 'Hire Singles Specialist',
    summary: 'Need badminton singles specialist for open ladder and academy events.',
    sport: 'Badminton',
    role: 'Singles Specialist',
    level: 'Pro',
    serviceTier: 'Premium',
    budget: 4800,
    rating: 4.9,
    completed: 73,
    responseHours: 2,
    city: 'Pune',
  },
  {
    id: 6,
    mode: 'hire',
    title: 'Hire Cricket Skills Coach',
    summary: 'Need batting and bowling coach for under-19 weekly training batch.',
    sport: 'Cricket',
    role: 'Coach',
    level: 'Pro',
    serviceTier: 'Premium',
    budget: 6500,
    rating: 5.0,
    completed: 120,
    responseHours: 1,
    city: 'Chennai',
  },
  {
    id: 7,
    mode: 'offer',
    title: 'I am a Pro Death-Over Bowler',
    summary: 'Accurate yorkers, slower ball variations, and final-over match control.',
    sport: 'Cricket',
    role: 'Bowler',
    level: 'Pro',
    serviceTier: 'Premium',
    budget: 5600,
    rating: 4.9,
    completed: 95,
    responseHours: 1,
    city: 'Bangalore',
  },
  {
    id: 8,
    mode: 'offer',
    title: 'Level 2 Midfielder Available',
    summary: 'High stamina midfielder for league games, transitions, and set-piece play.',
    sport: 'Football',
    role: 'Midfielder',
    level: 'Level 2',
    serviceTier: 'Standard',
    budget: 2700,
    rating: 4.7,
    completed: 52,
    responseHours: 3,
    city: 'Kolkata',
  },
  {
    id: 9,
    mode: 'offer',
    title: 'Amateur Goalkeeper for Weekend Games',
    summary: 'Reliable football goalkeeper for community matches and trial games.',
    sport: 'Football',
    role: 'Goalkeeper',
    level: 'Amateur',
    serviceTier: 'Basic',
    budget: 900,
    rating: 4.2,
    completed: 18,
    responseHours: 8,
    city: 'Noida',
  },
  {
    id: 10,
    mode: 'offer',
    title: 'Badminton Smash Specialist',
    summary: 'Fast attacking player available for doubles events and partner leagues.',
    sport: 'Badminton',
    role: 'Smash Specialist',
    level: 'Level 1',
    serviceTier: 'Standard',
    budget: 2100,
    rating: 4.6,
    completed: 39,
    responseHours: 4,
    city: 'Jaipur',
  },
  {
    id: 11,
    mode: 'offer',
    title: 'Cricket Wicket Keeper for Tournaments',
    summary: 'Quick hands, sharp stumpings, and dependable lower-order batting.',
    sport: 'Cricket',
    role: 'Wicket Keeper',
    level: 'Level 1',
    serviceTier: 'Basic',
    budget: 1600,
    rating: 4.4,
    completed: 27,
    responseHours: 6,
    city: 'Surat',
  },
  {
    id: 12,
    mode: 'offer',
    title: 'Football Defensive Coach',
    summary: 'Team shape coaching, backline coordination, and transition defense drills.',
    sport: 'Football',
    role: 'Coach',
    level: 'Pro',
    serviceTier: 'Premium',
    budget: 7000,
    rating: 5.0,
    completed: 130,
    responseHours: 1,
    city: 'Mumbai',
  },
]

const sortOptions = ['Best Match', 'Top Rated', 'Most Experienced', 'Fast Response', 'Budget Low to High', 'Budget High to Low', 'Newest']
const budgetOptions = ['Any Budget', 'Under ₹1,500', '₹1,500 - ₹3,000', '₹3,000 - ₹5,000', 'Above ₹5,000']
const levelOptions = ['All Levels', 'Amateur', 'Level 1', 'Level 2', 'Pro']
const serviceLevelOptions = ['All Service Levels', 'Basic', 'Standard', 'Premium']

export default function MarketplacePage() {
  const [mode, setMode] = useState<Mode>('hire')
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState('All Sports')
  const [role, setRole] = useState('All Roles')
  const [level, setLevel] = useState('All Levels')
  const [serviceLevel, setServiceLevel] = useState('All Service Levels')
  const [budgetRange, setBudgetRange] = useState('Any Budget')
  const [sortBy, setSortBy] = useState('Best Match')

  const roleOptions = useMemo(() => {
    if (sport === 'All Sports') {
      const all = new Set(Object.values(roleBySport).flat())
      return ['All Roles', ...Array.from(all)]
    }
    return ['All Roles', ...(roleBySport[sport] ?? [])]
  }, [sport])

  const filteredListings = useMemo(() => {
    const lowered = query.trim().toLowerCase()

    function inBudget(value: number) {
      if (budgetRange === 'Any Budget') return true
      if (budgetRange === 'Under ₹1,500') return value < 1500
      if (budgetRange === '₹1,500 - ₹3,000') return value >= 1500 && value <= 3000
      if (budgetRange === '₹3,000 - ₹5,000') return value > 3000 && value <= 5000
      return value > 5000
    }

    const base = listings.filter((item) => {
      if (item.mode !== mode) return false
      if (sport !== 'All Sports' && item.sport !== sport) return false
      if (role !== 'All Roles' && item.role !== role) return false
      if (level !== 'All Levels' && item.level !== level) return false
      if (serviceLevel !== 'All Service Levels' && item.serviceTier !== serviceLevel) return false
      if (!inBudget(item.budget)) return false

      if (lowered) {
        const hay = `${item.title} ${item.summary} ${item.sport} ${item.role} ${item.city}`.toLowerCase()
        if (!hay.includes(lowered)) return false
      }

      return true
    })

    const sorted = [...base]
    sorted.sort((a, b) => {
      if (sortBy === 'Top Rated') return b.rating - a.rating
      if (sortBy === 'Most Experienced') return b.completed - a.completed
      if (sortBy === 'Fast Response') return a.responseHours - b.responseHours
      if (sortBy === 'Budget Low to High') return a.budget - b.budget
      if (sortBy === 'Budget High to Low') return b.budget - a.budget
      if (sortBy === 'Newest') return b.id - a.id

      const scoreA = a.rating * 22 + a.completed * 0.35 + (12 - a.responseHours) + (a.level === 'Pro' ? 8 : 0)
      const scoreB = b.rating * 22 + b.completed * 0.35 + (12 - b.responseHours) + (b.level === 'Pro' ? 8 : 0)
      return scoreB - scoreA
    })

    return sorted
  }, [budgetRange, level, mode, query, role, serviceLevel, sortBy, sport])

  return (
    <div className="subpage">
      <div className={heroStyles.marketplaceHero}>
        <h1>Sports Talent Hub</h1>
        <p>Fiverr + Upwork style discovery for sports: filter by level, role, service tier, budget, and sort by quality.</p>
      </div>

      <div className="subpage-content">
        <section className={styles.marketplaceModePanel}>
          <button type="button" className={`${styles.modeCard} ${mode === 'hire' ? 'active' : ''}`} onClick={() => setMode('hire')}>
            <h3>I'm looking to hire</h3>
            <p>My team needs vetted sports talent and services.</p>
          </button>
          <button type="button" className={`${styles.modeCard} ${mode === 'offer' ? 'active' : ''}`} onClick={() => setMode('offer')}>
            <h3>I want to offer services</h3>
            <p>I'd like to get hired as a player, coach, or sports creator.</p>
          </button>
        </section>

        <section className={styles.marketplaceFilterBarCompact} aria-label="Talent Hub filter and sort controls">
          <div className={styles.marketplaceCompactSingleRow}>
            <div className={styles.marketplaceCompactSearchBox}>
              <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5-1.48 1.48-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
              </svg>
              <input
                type="search"
                placeholder="Search talent…"
                aria-label="Search talent"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className={styles.marketplaceCompactPillSelect}>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className={styles.marketplaceCompactPillSelect}>
              <select value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)}>
                {budgetOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className={styles.marketplaceCompactPillSelect}>
              <select value={sport} onChange={(event) => {
                setSport(event.target.value)
                setRole('All Roles')
              }}>
                <option value="All Sports">All Sports</option>
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Badminton">Badminton</option>
              </select>
            </div>

            <div className={styles.marketplaceCompactPillSelect}>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                {roleOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className={styles.marketplaceCompactPillSelect}>
              <select value={level} onChange={(event) => setLevel(event.target.value)}>
                {levelOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className={styles.marketplaceCompactPillSelect}>
              <select value={serviceLevel} onChange={(event) => setServiceLevel(event.target.value)}>
                {serviceLevelOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className={styles.marketplaceCompactClearPill}
              onClick={() => {
                setQuery('')
                setSport('All Sports')
                setRole('All Roles')
                setLevel('All Levels')
                setServiceLevel('All Service Levels')
                setBudgetRange('Any Budget')
                setSortBy('Best Match')
              }}
            >
              Clear
            </button>
          </div>
        </section>

        <p className={styles.marketplaceResultsMeta}>
          {filteredListings.length} results found
          {mode === 'hire' ? ' for hiring needs' : ' for seller profiles'}
        </p>

        <div className={`card-list ${styles.marketplaceGrid}`}>
          {filteredListings.map((card) => (
            <article className={`info-card ${styles.marketplaceCard}`} key={card.id}>
              <div className="info-card-head">
                <h3>{card.title}</h3>
                <span className="sport-tag">{card.sport}</span>
              </div>
              <p>{card.summary}</p>
              <div className="info-card-meta">
                <span>{card.role}</span>
                <span>{card.level}</span>
                <span>{card.serviceTier}</span>
                <span>{card.city}</span>
              </div>
              <div className="info-card-meta">
                <span>⭐ {card.rating.toFixed(1)}</span>
                <span>{card.completed} completed</span>
                <span>{card.responseHours}h response</span>
              </div>
              <p className="price-tag">Budget: ₹{card.budget.toLocaleString()}</p>
              <button className="card-action-btn">{mode === 'hire' ? 'Contact Talent' : 'View Seller Profile'}</button>
            </article>
          ))}
        </div>

        {filteredListings.length === 0 ? (
          <div className={`info-card ${styles.marketplaceEmptyState}`}>
            <h3>No results for this filter combination</h3>
            <p>Try changing sport, role, level, service tier, or budget range to discover more talent.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
