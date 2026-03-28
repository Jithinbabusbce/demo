import { useMemo, useState } from 'react'
import heroStyles from './SubpageHero.module.css'
import styles from './TurfPartnerPage.module.css'
import InfoCard from '../components/ui/InfoCard'
import EmptyState from '../components/ui/EmptyState'

type Turf = {
  name: string
  city: string
  sport: 'Cricket' | 'Football' | 'Badminton'
  pricePerHour: number
  availability: 'Available Now' | 'Today Evening' | 'Fully Booked'
  surface: 'Natural Grass' | 'Artificial Turf' | 'Indoor Court'
  rating: number
}

const turfListings: Turf[] = [
  { name: 'Royal Turf Arena', city: 'Bangalore', sport: 'Football', pricePerHour: 1800, availability: 'Available Now', surface: 'Artificial Turf', rating: 4.8 },
  { name: 'Cover Drive Ground', city: 'Mumbai', sport: 'Cricket', pricePerHour: 3200, availability: 'Today Evening', surface: 'Natural Grass', rating: 4.9 },
  { name: 'Smash Point Court', city: 'Pune', sport: 'Badminton', pricePerHour: 1100, availability: 'Available Now', surface: 'Indoor Court', rating: 4.6 },
  { name: 'Night Riders Turf', city: 'Hyderabad', sport: 'Football', pricePerHour: 2100, availability: 'Fully Booked', surface: 'Artificial Turf', rating: 4.5 },
  { name: 'PowerPlay Box Cricket', city: 'Chennai', sport: 'Cricket', pricePerHour: 2500, availability: 'Today Evening', surface: 'Artificial Turf', rating: 4.7 },
]

type TurfTab = 'register' | 'book'

export default function TurfPartnerPage() {
  const [tab, setTab] = useState<TurfTab>('book')
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState('All Sports')
  const [availability, setAvailability] = useState('Any Availability')
  const [sortBy, setSortBy] = useState('Top Rated')

  const filteredTurfs = useMemo(() => {
    const lowered = query.trim().toLowerCase()
    const base = turfListings.filter((item) => {
      if (sport !== 'All Sports' && item.sport !== sport) return false
      if (availability !== 'Any Availability' && item.availability !== availability) return false
      if (!lowered) return true
      const hay = `${item.name} ${item.city} ${item.sport} ${item.surface}`.toLowerCase()
      return hay.includes(lowered)
    })

    const sorted = [...base]
    if (sortBy === 'Top Rated') return sorted.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'Price Low to High') return sorted.sort((a, b) => a.pricePerHour - b.pricePerHour)
    if (sortBy === 'Price High to Low') return sorted.sort((a, b) => b.pricePerHour - a.pricePerHour)
    return sorted
  }, [availability, query, sortBy, sport])

  return (
    <div className="subpage">
      <div className={heroStyles.turfHero}>
        <h1>Integrate Your Turf with Gully World</h1>
        <p>Register your turf for free and receive bookings from challenges, leagues, and events.</p>
      </div>

      <div className="subpage-content">
        <section className={`marketplace-mode-panel ${styles.turfTabPanel}`} aria-label="Turf actions">
          <button type="button" className={`mode-card ${tab === 'book' ? 'active' : ''}`} onClick={() => setTab('book')}>
            <h3>Book Turf</h3>
            <p>Browse all listed turfs, apply filters, and book instantly.</p>
          </button>
          <button type="button" className={`mode-card ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
            <h3>Register Turf</h3>
            <p>List your turf for free and receive leads from events and challenges.</p>
          </button>
        </section>

        {tab === 'book' ? (
          <>
            <section className={styles.turfFilterBarFiverr} aria-label="Turf search and filter">
              <div className={styles.turfFilterTopRow}>
                <div className={styles.turfSearchBox}>
                  <svg className={styles.turfSearchIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5-1.48 1.48-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
                  </svg>
                  <input
                    type="search"
                    placeholder="Search turf by name, city, or surface"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div className={styles.turfPillFilters}>
                  <div className={styles.turfPillSelect}>
                    <select value={sport} onChange={(event) => setSport(event.target.value)}>
                      <option value="All Sports">All Sports</option>
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Badminton">Badminton</option>
                    </select>
                  </div>
                  <div className={styles.turfPillSelect}>
                    <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                      <option value="Any Availability">Availability</option>
                      <option value="Available Now">Available Now</option>
                      <option value="Today Evening">Today Evening</option>
                      <option value="Fully Booked">Fully Booked</option>
                    </select>
                  </div>
                  <div className={styles.turfPillSelect}>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      <option>Top Rated</option>
                      <option>Price Low to High</option>
                      <option>Price High to Low</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className={styles.turfClearPill}
                    onClick={() => {
                      setQuery('')
                      setSport('All Sports')
                      setAvailability('Any Availability')
                      setSortBy('Top Rated')
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
              <p className={styles.turfResultsCount}>{filteredTurfs.length} turf{filteredTurfs.length !== 1 ? 's' : ''} found</p>
            </section>

            <div className="card-list">
              {filteredTurfs.map((item) => (
                <InfoCard
                  key={item.name}
                  title={item.name}
                  badge={{ label: item.sport, className: 'sport-tag' }}
                  meta={[
                    { label: item.city },
                    { label: item.surface },
                    { label: item.availability, className: item.availability === 'Available Now' ? styles.availabilityNow : item.availability === 'Fully Booked' ? styles.availabilityBooked : styles.availabilityEvening },
                    { label: `⭐ ${item.rating.toFixed(1)}` },
                  ]}
                  action={{ label: 'Book Turf' }}
                >
                  <p className="price-tag">₹{item.pricePerHour.toLocaleString()} / hour</p>
                </InfoCard>
              ))}
            </div>

            {filteredTurfs.length === 0 ? (
              <EmptyState message="No turf listings match these filters. Try another city keyword, sport, or availability option." />
            ) : null}
          </>
        ) : (
          <section className={`info-card ${styles.turfRegisterCard}`} aria-label="Register your turf">
            <h3>Register Your Turf for Free</h3>
            <p>Fill your turf details and start receiving booking requests from teams and organizers.</p>
            <div className={styles.turfRegisterGrid}>
              <input className="form-input" type="text" placeholder="Turf Name" aria-label="Turf Name" />
              <input className="form-input" type="text" placeholder="City" aria-label="City" />
              <select className="form-input" aria-label="Primary sport">
                <option>Primary Sport</option>
                <option>Cricket</option>
                <option>Football</option>
                <option>Badminton</option>
              </select>
              <input className="form-input" type="text" placeholder="Price per hour" aria-label="Price per hour" />
              <input className="form-input" type="text" placeholder="Surface type" aria-label="Surface type" />
              <input className="form-input" type="text" placeholder="Contact Number" aria-label="Contact Number" />
            </div>
            <button className="card-action-btn">Submit Turf Registration</button>
          </section>
        )}
      </div>
    </div>
  )
}
