import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import cricketHero from './assets/cricket.png'
import gullyWorldLogo from './assets/gully-world-logo.svg'
import './App.css'

import TournamentPage from './pages/TournamentPage'
import ChallengesPage from './pages/ChallengesPage'
import PlayerProfilesPage from './pages/PlayerProfilesPage'
import TeamsPage from './pages/TeamsPage'
import EventsPage from './pages/EventsPage'
import AuctionPage from './pages/AuctionPage'
import MarketplacePage from './pages/MarketplacePage'
import StorePage from './pages/StorePage'
import ContactPage from './pages/ContactPage'
import PricingPage from './pages/PricingPage'
import TurfPartnerPage from './pages/TurfPartnerPage'

const menuGroups = [
  {
    title: 'Features',
    items: [
      { label: 'Tournament', path: '/tournament', text: 'Run league fixtures, standings, knockout brackets, and match schedules.' },
      { label: 'Challenges', path: '/challenges', text: 'Launch in-app sports challenges for clubs and fan communities.' },
      { label: 'Player Profiles', path: '/players', text: 'Track player stats, rankings, and match performance timelines.' },
      { label: 'Teams Pages', path: '/teams', text: 'Publish squads, announcements, stories, and recent team form.' },
      { label: 'Events', path: '/events', text: 'Users can create events, manage RSVPs, and coordinate venues.' },
      { label: 'Auction', path: '/auction', text: 'Host player auctions with bids, team budgets, and live updates.' },
    ],
  },
]


const partnerClubs = ['Mumbai Mavericks', 'Royal Turf', 'Cover Drive CC', 'Night Riders', 'PowerPlay XI']

const featureCards = [
  {
    title: 'Get hired and build your profile',
    text: 'Players can showcase skills, publish achievements, and get hired by teams, partners, and organizers.',
  },
  {
    title: 'Tournaments and events in one flow',
    text: 'Conduct tournaments, create events, manage registrations, and coordinate schedules from one dashboard.',
  },
  {
    title: 'Talent Hub built on hire-and-offer logic',
    text: 'Hire sports talent or create your own profile to get hired, inspired by Fiverr-style service flow.',
  },
]

const stats = [
  { value: '5M+', label: 'sports users reached' },
  { value: '180K+', label: 'events hosted annually' },
  { value: '3200+', label: 'teams hiring talent' },
]

/* Brand wordmark: GULLY W⚽RLD — Playo-style clean big text with football as O */
function BrandWordmark() {
  return (
    <span className="brand-wordmark">
      <span className="wordmark-gully">GULLY</span>
      <span className="wordmark-space">&nbsp;</span>
      <span className="wordmark-w">W</span>
      <svg className="wordmark-football" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#DC2626" />
        <circle cx="20" cy="20" r="18" fill="none" stroke="#991B1B" strokeWidth="1"/>
        {/* Classic pentagon pattern */}
        <polygon points="20,8 25,12 23,18 17,18 15,12" fill="#FFFFFF" fillOpacity="0.9"/>
        <polygon points="15,12 10,10 7,15 10,20 17,18" fill="#FFFFFF" fillOpacity="0.25"/>
        <polygon points="25,12 30,10 33,15 30,20 23,18" fill="#FFFFFF" fillOpacity="0.25"/>
        <polygon points="17,18 10,20 9,27 15,32 20,28" fill="#FFFFFF" fillOpacity="0.25"/>
        <polygon points="23,18 30,20 31,27 25,32 20,28" fill="#FFFFFF" fillOpacity="0.25"/>
        {/* Seam lines */}
        <polygon points="20,8 25,12 23,18 17,18 15,12" fill="none" stroke="#FFFFFF" strokeWidth="0.6" strokeOpacity="0.5"/>
        <line x1="20" y1="8" x2="20" y2="2" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.3"/>
        <line x1="25" y1="12" x2="31" y2="9" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.3"/>
        <line x1="15" y1="12" x2="9" y2="9" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.3"/>
        <line x1="23" y1="18" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.3"/>
        <line x1="17" y1="18" x2="10" y2="20" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.3"/>
        {/* Mustache */}
        <path d="M12 22 Q15 18, 18 22 Q19 24, 20 21 Q21 24, 22 22 Q25 18, 28 22" stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M12 22 Q10 24, 8 22" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <path d="M28 22 Q30 24, 32 22" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      </svg>
      <span className="wordmark-rld">RLD</span>
    </span>
  )
}

function AppStoreBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`store-badge-list${compact ? ' compact' : ''}`}>
      <a className="store-badge" href="#" aria-label="Download on App Store">
        <svg className="store-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.35 2.77M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <span className="store-badge-text">
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </a>
      <a className="store-badge" href="#" aria-label="Get it on Google Play">
        <svg className="store-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
        </svg>
        <span className="store-badge-text">
          <small>GET IT ON</small>
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  )
}

function Header() {
  const [city, setCity] = useState('Bangalore')
  const [locationMenuOpen, setLocationMenuOpen] = useState(false)
  const [locationInput, setLocationInput] = useState('Bangalore')
  const [isLocating, setIsLocating] = useState(false)

  const suggestedCities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune']
  const filteredCities = suggestedCities.filter((item) => item.toLowerCase().includes(locationInput.toLowerCase()))

  useEffect(() => {
    const savedCity = localStorage.getItem('gullyworld-city')
    if (savedCity) {
      setCity(savedCity)
      setLocationInput(savedCity)
    }
  }, [])

  async function reverseGeocode(lat: number, lon: number) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`,
    )
    if (!response.ok) return ''
    const payload = await response.json()
    return (
      payload?.address?.city ||
      payload?.address?.town ||
      payload?.address?.state_district ||
      payload?.address?.state ||
      payload?.display_name?.split(',')?.[0] ||
      ''
    )
  }

  function applyCity(nextCity: string) {
    const sanitizedCity = nextCity.trim()
    if (!sanitizedCity) return
    setCity(sanitizedCity)
    setLocationInput(sanitizedCity)
    localStorage.setItem('gullyworld-city', sanitizedCity)
    setLocationMenuOpen(false)
  }

  function detectCurrentLocation() {
    if (!navigator.geolocation) {
      applyCity(locationInput)
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const nextCity = await reverseGeocode(coords.latitude, coords.longitude)
          applyCity(nextCity || 'Current Location')
        } catch {
          applyCity('Current Location')
        } finally {
          setIsLocating(false)
        }
      },
      () => {
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 },
    )
  }

  return (
    <>
      <div className="announcement-bar">
        <p>Gully World helps players get hired, run tournaments, create events, and grow sports communities.</p>
      </div>

      <header className="topbar">
        <div className="topbar-left">
          <Link className="brand-block" to="/" aria-label="Gully World home">
            <img className="brand-logo" src={gullyWorldLogo} alt="Gully World logo" />
            <BrandWordmark />
          </Link>
          <button
            className="location-pill"
            type="button"
            aria-label="Select city"
            onClick={() => setLocationMenuOpen((open) => !open)}
          >
            <svg className="loc-pin-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{city}</span>
            <svg className="loc-caret" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          {locationMenuOpen ? (
            <div className="location-menu" role="dialog" aria-label="Change location">
              <div className="location-search-row">
                <svg className="location-search-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5-1.48 1.48-5-5zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.51 4.51 0 0 1 9.5 14z"/>
                </svg>
                <input
                  id="location-input"
                  type="text"
                  value={locationInput}
                  onChange={(event) => setLocationInput(event.target.value)}
                  placeholder="Select for cities, places ..."
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') applyCity(locationInput)
                  }}
                />
                <button className="detect-inline-btn" type="button" onClick={detectCurrentLocation} disabled={isLocating} aria-label="Use current location">
                  <span>{isLocating ? '...' : '◎'}</span>
                </button>
              </div>
              <div className="location-chip-list">
                {filteredCities.map((item) => (
                  <button key={item} type="button" onClick={() => applyCity(item)}>{item}</button>
                ))}
              </div>
              <button className="locate-btn" type="button" onClick={detectCurrentLocation} disabled={isLocating}>
                {isLocating ? 'Detecting your sports zone...' : 'Use Current Location'}
              </button>
            </div>
          ) : null}
        </div>

        <nav className="nav-links" aria-label="Primary">
          {menuGroups.map((group) => (
            <div className="nav-item" key={group.title}>
              <button className="nav-trigger" type="button">
                {group.title}
                <span className="nav-caret">▾</span>
              </button>
              <div className="dropdown-panel">
                <div className="dropdown-grid">
                  {group.items.map((item) => (
                    <Link className="dropdown-link" to={item.path} key={item.label}>
                      <strong>{item.label}</strong>
                      <span>{item.text}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link className="nav-plain-link" to="/marketplace">
            Talent Hub
          </Link>
          <Link className="nav-plain-link" to="/turf-partner">
            List Your Turf
          </Link>
          <Link className="nav-plain-link" to="/contact">
            Contact
          </Link>
          <Link className="nav-plain-link" to="/store">
            Store
          </Link>
        </nav>

        <div className="topbar-actions">
          <Link className="header-secondary-link" to="/pricing">Pricing</Link>
          <Link className="header-link" to="/">Login / Signup</Link>
        </div>
      </header>
    </>
  )
}

function SocialIcon({ platform }: { platform: 'facebook' | 'instagram' | 'youtube' | 'twitter' }) {
  if (platform === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M13.5 22v-8h2.7l.5-3h-3.2V9.2c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6V11H7v3h3v8h3.5z"/>
      </svg>
    )
  }

  if (platform === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
      </svg>
    )
  }

  if (platform === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.8 30.8 0 0 0 2 12c0 1.7.1 3.4.4 4.8a2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2c.3-1.4.4-3.1.4-4.8 0-1.7-.1-3.4-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z"/>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M22 5.9c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.7.4-1.5.8-2.4.9A3.8 3.8 0 0 0 12.5 8v.8A10.7 10.7 0 0 1 4.8 5a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5 0 1.8 1.2 3.3 2.9 3.7-.5.1-1 .2-1.5.1.4 1.5 1.8 2.6 3.5 2.6A7.7 7.7 0 0 1 3 17.8a10.8 10.8 0 0 0 5.9 1.7c7 0 10.9-5.9 10.9-11v-.5c.8-.5 1.5-1.2 2.1-2.1z"/>
    </svg>
  )
}

function Footer() {
  return (
    <>
      {/* Playo-style CTA banner */}
      <section className="cta-banner">
        <div className="cta-banner-inner">
          <div className="cta-banner-text">
            <h2>Ready to play? Join the largest sports network today.</h2>
            <p>Create events, hire players, run tournaments — all on one platform.</p>
          </div>
          <div className="cta-banner-actions">
            <Link className="cta-btn-primary" to="/events">Create Event</Link>
            <Link className="cta-btn-secondary" to="/tournament">Start Tournament</Link>
            <Link className="cta-btn-secondary" to="/pricing">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* Playo-style Footer */}
      <footer className="footer-main">
        <div className="footer-inner">
          <div className="footer-col footer-brand-col">
            <Link to="/" className="footer-brand-link">
              <img className="footer-logo" src={gullyWorldLogo} alt="Gully World" />
              <span className="footer-brand-text">GULLY WORLD</span>
            </Link>
            <p className="footer-tagline">The sports network for modern players</p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <SocialIcon platform="facebook" />
              </a>
              <a href="#" aria-label="Instagram">
                <SocialIcon platform="instagram" />
              </a>
              <a href="#" aria-label="YouTube">
                <SocialIcon platform="youtube" />
              </a>
              <a href="#" aria-label="Twitter">
                <SocialIcon platform="twitter" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/contact">About Us</Link>
            <Link to="/contact">Careers</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/pricing">Pricing</Link>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <Link to="/contact">Report Issue</Link>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <a href="#">Blog</a>
            <a href="#">Forum</a>
            <a href="#">How Gully World Works</a>
            <a href="#">Community Stories</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Gully World Technology Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

function HomePage() {
  const firstTwoFeatures = menuGroups[0].items.slice(0, 2)

  return (
    <main>
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">The sports network for modern players</p>
          <h1>Get discovered, get hired, and run sports events at scale.</h1>
          <p className="hero-text">
            Gully World is built for players, partners, and organizers to create tournaments, publish events,
            hire talent, and expand into future store experiences without rebuilding the platform.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" to="/events">
              Create Event
            </Link>
            <Link className="secondary-action" to="/tournament">
              Explore Features
            </Link>
          </div>
          <div className="club-ticker">
            {partnerClubs.map((club) => (
              <span key={club}>{club}</span>
            ))}
          </div>
          <div className="stat-strip" id="stats">
            {stats.map((card) => (
              <article className="stat-card" key={card.label}>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-stage" aria-label="Cricket app hero image and live widgets">
          <div className="hero-download-strip">
            <AppStoreBadges compact />
          </div>
          <section className="score-shell">
            <div className="score-visual">
              <img className="hero-image" src={cricketHero} alt="Cricket player celebrating on the field" />
            </div>

            <div className="score-floating-card primary-floating-card">
              <div className="score-topline">
                <span className="pulse-dot"></span>
                <span>Live Event</span>
                <span className="chip">Open</span>
              </div>
              <strong>1264</strong>
              <p>Players available to hire now</p>
              <span>Updated 2 min ago</span>
            </div>

            <div className="score-list" id="matches">
              <article className="score-card compact-card featured-compact-card">
                <div className="compact-head">
                  <p>Trending Format</p>
                  <span className="chip alt">Auction</span>
                </div>
                <strong>City Sports Draft 2026</strong>
                <div className="compact-foot">
                  <span>42 teams</span>
                  <span>11 partners</span>
                </div>
              </article>

              <div className="match-stack">
                {firstTwoFeatures.map((item) => (
                  <article className="score-card compact-card stack-card" key={item.label}>
                    <div className="compact-head">
                      <p>{item.label}</p>
                      <span className="chip alt">New</span>
                    </div>
                    <strong>{item.text}</strong>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="feature-band" id="features">
        <div className="section-heading">
          <p className="eyebrow">Everything a sports ecosystem needs</p>
          <h2>From events and tournaments to hiring and partner discovery, everything stays in one platform.</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="turf-owner-strip" aria-label="Turf partner onboarding">
        <div className="turf-owner-strip-inner">
          <div className="turf-owner-copy">
            <p className="eyebrow">Turf Owners</p>
            <h3>Register your turf for free and get discovered for challenges and events.</h3>
            <p>Integrate your ground so teams can book slots directly when hosting challenges, leagues, and tournaments.</p>
          </div>
          <Link className="primary-action" to="/turf-partner">Register Turf Free</Link>
        </div>
      </section>

      <section className="insight-panel">
        <div className="insight-copy">
          <p className="eyebrow">Built for player-first growth</p>
          <h2>Launch now for hiring and events, then extend into store integrations in future releases.</h2>
          <p>
            Gully World Technology builds sports-centered platforms. Role-based dashboards for players, partners,
            organizers, and talent providers are available as your next step.
          </p>
        </div>
        <div className="roadmap-card" id="download">
          <p className="card-label">Suggested next modules</p>
          <ul>
            <li>Player hiring profile and portfolio pages</li>
            <li>Tournament and event creation workflows</li>
            <li>Partner onboarding and lead management</li>
            <li>Future-ready sports store integration</li>
          </ul>
          <Link className="primary-action block-action" to="/tournament">
            Build Next Feature
          </Link>
        </div>
      </section>
    </main>
  )
}

/* Scroll to top when navigating between pages */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const pageSearchConfig: Record<string, {
  placeholder: string
  sports: string[]
  sortBy: string[]
  dateOptions: string[]
}> = {
  '/tournament': {
    placeholder: 'Search tournaments, formats, teams, locations...',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Upcoming', 'Popular'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week', 'This Month'],
  },
  '/challenges': {
    placeholder: 'Search active challenges, sports, clubs...',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Multi-Sport'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Ending Soon', 'Popular'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week', 'This Month'],
  },
  '/players': {
    placeholder: 'Search players by name, sport, skill level...',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball'],
    sortBy: ['Filter & Sort By', 'Top Rated', 'Most Matches', 'Recently Active'],
    dateOptions: ['Date', 'Any Date', 'Available Today', 'Available This Week'],
  },
  '/teams': {
    placeholder: 'Search teams, clubs, academies...',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Trending', 'Most Active'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week'],
  },
  '/events': {
    placeholder: 'Search events by sport, location, date...',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Upcoming', 'Popular'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Weekend', 'This Month'],
  },
  '/auction': {
    placeholder: 'Search player auctions, teams, budgets...',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football'],
    sortBy: ['Filter & Sort By', 'Live', 'Upcoming', 'Highest Budget'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week'],
  },
  '/marketplace': {
    placeholder: 'Search hires, offers, sports services, creators...',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Tennis'],
    sortBy: ['Filter & Sort By', 'Most Relevant', 'Top Rated', 'Nearest', 'Lowest Price'],
    dateOptions: ['Date', 'Any Date', 'Available Today', 'This Week'],
  },
}

function SubpageSearchBar() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const config = pageSearchConfig[pathname]
  const searchParams = new URLSearchParams(search)

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [sport, setSport] = useState(config?.sports[0] ?? '')
  const [sortBy, setSortBy] = useState(config?.sortBy[0] ?? '')
  const [date, setDate] = useState(config?.dateOptions[0] ?? '')
  const [payAndJoin, setPayAndJoin] = useState(false)

  function applyFilters(next: {
    q?: string
    sport?: string
    sortBy?: string
    date?: string
    payAndJoin?: boolean
  }) {
    if (!config) return
    const params = new URLSearchParams()
    const nextQuery = next.q ?? query
    const nextSport = next.sport ?? sport
    const nextSortBy = next.sortBy ?? sortBy
    const nextDate = next.date ?? date
    const nextPayAndJoin = next.payAndJoin ?? payAndJoin

    if (nextQuery.trim()) params.set('q', nextQuery.trim())
    if (nextSport && nextSport !== config.sports[0]) params.set('sport', nextSport)
    if (nextSortBy && nextSortBy !== config.sortBy[0]) params.set('sort', nextSortBy)
    if (nextDate && nextDate !== config.dateOptions[0]) params.set('date', nextDate)
    if (nextPayAndJoin) params.set('pay', '1')

    const queryString = params.toString()
    navigate({ pathname, search: queryString ? `?${queryString}` : '' }, { replace: true })
  }

  useEffect(() => {
    const freshConfig = pageSearchConfig[pathname]
    const params = new URLSearchParams(search)
    setQuery(params.get('q') ?? '')
    setSport(params.get('sport') ?? freshConfig?.sports[0] ?? '')
    setSortBy(params.get('sort') ?? freshConfig?.sortBy[0] ?? '')
    setDate(params.get('date') ?? freshConfig?.dateOptions[0] ?? '')
    setPayAndJoin(params.get('pay') === '1')
  }, [pathname, search])

  if (!config || pathname === '/marketplace' || pathname === '/turf-partner') return null

  return (
    <section className="subpage-search-wrap" aria-label="Search and filter">
      <div className="subpage-search-bar">
        <div className="subpage-search-input-row">
          <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5-1.48 1.48-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
          </svg>
          <input
            className="subpage-search-input"
            type="search"
            placeholder={config.placeholder}
            aria-label="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') applyFilters({ q: query })
            }}
          />
          <button className="subpage-search-button" type="button" onClick={() => applyFilters({ q: query })}>Search</button>
          <button
            className="subpage-clear-filter-btn"
            type="button"
            onClick={() => {
              setQuery('')
              setSport(config.sports[0])
              setSortBy(config.sortBy[0])
              setDate(config.dateOptions[0])
              setPayAndJoin(false)
              navigate({ pathname, search: '' }, { replace: true })
            }}
          >
            Clear Filter
          </button>
        </div>
        <div className="subpage-filter-bar" role="group" aria-label="Filter controls">
          <label className="filter-control select-control">
            <span className="filter-icon">⇅</span>
            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                applyFilters({ sortBy: event.target.value })
              }}
            >
              {config.sortBy.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="filter-control select-control">
            <span className="filter-icon">◎</span>
            <select
              value={sport}
              onChange={(event) => {
                setSport(event.target.value)
                applyFilters({ sport: event.target.value })
              }}
            >
              {config.sports.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="filter-control select-control">
            <span className="filter-icon">📅</span>
            <select
              value={date}
              onChange={(event) => {
                setDate(event.target.value)
                applyFilters({ date: event.target.value })
              }}
            >
              {config.dateOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={`filter-control${payAndJoin ? ' active' : ''}`}
            onClick={() => {
              const nextPay = !payAndJoin
              setPayAndJoin(nextPay)
              applyFilters({ payAndJoin: nextPay })
            }}
          >
            <span className="filter-icon">💳</span>
            <span>Pay & Join Game</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function SupportChatWidget() {
  type ChatMessage = {
    sender: 'bot' | 'user'
    text: string
  }

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hi! I am Gully AI Assistant. Ask about pricing, blog, forum, turf booking, events, or Talent Hub.' },
  ])
  const [input, setInput] = useState('')

  function getBotReply(query: string) {
    const text = query.toLowerCase()

    if (text.includes('pricing') || text.includes('plan') || text.includes('subscription') || text.includes('pro')) {
      return 'Please refer Pricing page: /pricing. Free plan includes ads and limits. Pro plan is ad-free with unlimited events/tournaments.'
    }
    if (text.includes('blog') || text.includes('article') || text.includes('news')) {
      return 'Please refer Blog in the footer Community section for updates and playbooks.'
    }
    if (text.includes('forum') || text.includes('community')) {
      return 'Please refer Forum and Community Stories from the footer Community section to connect with players and organizers.'
    }
    if (text.includes('how') && text.includes('work')) {
      return 'Please refer How Gully World Works in the footer Community section for the full workflow.'
    }
    if (text.includes('turf') || text.includes('book turf') || text.includes('register turf')) {
      return 'Go to /turf-partner. Use Book Turf tab for filtering and booking, or Register Turf tab to list your turf for free.'
    }
    if (text.includes('marketplace') || text.includes('talent hub') || text.includes('hire') || text.includes('seller') || text.includes('talent')) {
      return 'Open /marketplace and use filters for sport, role, level, service tier, budget, and sort for best match.'
    }
    if (text.includes('event') || text.includes('tournament') || text.includes('challenge')) {
      return 'Use the top filters on Events/Tournament/Challenges pages. You can search, sort by Live/Finished, and clear filters anytime.'
    }

    return 'I can help with Pricing, Blog, Forum, Turf booking, Talent Hub hiring, and Events. Try asking one of these.'
  }

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    const reply = getBotReply(text)
    setMessages((prev) => [...prev, { sender: 'user', text }, { sender: 'bot', text: reply }])
    setInput('')
  }

  return (
    <div className={`support-chat${open ? ' open' : ''}`}>
      {open ? (
        <div className="support-chat-panel" role="dialog" aria-label="Gully World support chat">
          <div className="support-chat-header">
            <strong>Gully World Chat</strong>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>
          <div className="support-chat-messages">
            {messages.map((item, index) => (
              <p key={`${item.text}-${index}`} className={`chat-msg ${item.sender}`}>
                {item.sender === 'user' ? `You: ${item.text}` : `Gully AI: ${item.text}`}
              </p>
            ))}
          </div>
          <div className="support-chat-quick-actions">
            <button type="button" onClick={() => setInput('Tell me about pricing')}>Pricing</button>
            <button type="button" onClick={() => setInput('Where is blog?')}>Blog</button>
            <button type="button" onClick={() => setInput('How to book turf?')}>Book Turf</button>
            <button type="button" onClick={() => setInput('Show community forum')}>Forum</button>
          </div>
          <div className="support-chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage()
              }}
              placeholder="Type your message"
              aria-label="Chat message"
            />
            <button type="button" onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : null}
      <button className="support-chat-toggle" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close Chat' : 'Chat with Us'}
      </button>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="page-shell">
        <Header />
        <SubpageSearchBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tournament" element={<TournamentPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/players" element={<PlayerProfilesPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/auction" element={<AuctionPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/turf-partner" element={<TurfPartnerPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <SupportChatWidget />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
