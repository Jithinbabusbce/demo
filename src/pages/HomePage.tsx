import { Link } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import cricketHero from '../assets/cricket.png'
import { useCity } from '../hooks'
import AppStoreBadges from '../components/ui/AppStoreBadges'
import { quickAccessActions, featureCards, stats, platformFeatures } from '../data/navigation'
import { events } from '../data/events'
import { challenges } from '../data/challenges'
import { players } from '../data/players'
import styles from './HomePage.module.css'

function HomePage() {
  const [activeCity] = useCity()

  const liveEventsCount = events.filter((item) => item.status === 'Live').length
  const liveChallengesCount = challenges.filter((item) => item.status === 'Live').length
  const cityPlayersCount = players.filter((item) => item.city.toLowerCase() === activeCity.toLowerCase()).length || players.length

  // Phone feed: auto-scroll visual demo with drag-to-scroll user control
  const feedRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const dragging = useRef(false)
  const dragStartY = useRef(0)
  const scrollStartTop = useRef(0)
  const rafId = useRef<number>(undefined)
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const direction = useRef(1)

  // Sync scroll thumb position with actual scrollTop
  // Thumb is 30% of track height → must travel 70% of track → 233% of its own height
  const syncThumb = useCallback(() => {
    const el = feedRef.current
    const thumb = thumbRef.current
    if (!el || !thumb) return
    const max = el.scrollHeight - el.clientHeight
    if (max <= 0) return
    const pct = el.scrollTop / max
    thumb.style.transform = `translateY(${pct * 233}%)`
  }, [])

  const runAutoScroll = useCallback(() => {
    const el = feedRef.current
    if (!el) return
    const tick = () => {
      if (!el || paused.current) return
      const max = el.scrollHeight - el.clientHeight
      if (max <= 0) return
      el.scrollTop += 0.4 * direction.current
      if (el.scrollTop >= max - 1) direction.current = -1
      if (el.scrollTop <= 1) direction.current = 1
      syncThumb()
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
  }, [syncThumb])

  const pause = useCallback(() => {
    paused.current = true
    if (rafId.current) cancelAnimationFrame(rafId.current)
    clearTimeout(resumeTimer.current)
  }, [])

  const scheduleResume = useCallback((delayMs = 2500) => {
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      paused.current = false
      runAutoScroll()
    }, delayMs)
  }, [runAutoScroll])

  useEffect(() => {
    const el = feedRef.current
    if (!el) return
    const startDelay = setTimeout(() => runAutoScroll(), 2000)

    // Hover: pause auto-scroll, resume on leave
    const onEnter = () => { pause() }
    const onLeave = () => { if (!dragging.current) { scheduleResume(1500) } }
    // Wheel: scroll feed, but pass through to page at boundaries
    const onWheel = (e: WheelEvent) => {
      const max = el.scrollHeight - el.clientHeight
      const atTop = el.scrollTop <= 0 && e.deltaY < 0
      const atBottom = el.scrollTop >= max - 1 && e.deltaY > 0
      if (atTop || atBottom) return // let page scroll normally at boundaries
      e.preventDefault()
      e.stopPropagation()
      pause()
      el.scrollTop = Math.max(0, Math.min(max, el.scrollTop + e.deltaY))
      syncThumb()
      scheduleResume(2500)
    }

    // Drag-to-scroll (mouse)
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      pause()
      dragging.current = true
      dragStartY.current = e.clientY
      scrollStartTop.current = el.scrollTop
      try { el.setPointerCapture(e.pointerId) } catch { /* noop */ }
      e.preventDefault()
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging.current) return
      const delta = dragStartY.current - e.clientY
      el.scrollTop = scrollStartTop.current + delta
      syncThumb()
    }
    const onPointerUp = () => {
      if (!dragging.current) return
      dragging.current = false
      scheduleResume(2500)
    }

    // Touch drag (mobile)
    const onTouchStart = (e: TouchEvent) => {
      pause()
      dragging.current = true
      dragStartY.current = e.touches[0].clientY
      scrollStartTop.current = el.scrollTop
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      const delta = dragStartY.current - e.touches[0].clientY
      el.scrollTop = scrollStartTop.current + delta
      syncThumb()
      e.preventDefault()
    }
    const onTouchEnd = () => {
      dragging.current = false
      scheduleResume(2500)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      clearTimeout(startDelay)
      clearTimeout(resumeTimer.current)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [runAutoScroll, pause, scheduleResume, syncThumb])

  // Scoreboard carousel with nav buttons
  const scoreTrackRef = useRef<HTMLDivElement>(null)
  const scoreDrag = useRef({ active: false, startX: 0, scrollL: 0, moved: 0 })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollButtons = useCallback(() => {
    const track = scoreTrackRef.current
    if (!track) return
    setCanScrollLeft(track.scrollLeft > 2)
    setCanScrollRight(track.scrollLeft < track.scrollWidth - track.clientWidth - 2)
  }, [])

  const scrollScore = useCallback((dir: 'left' | 'right') => {
    const track = scoreTrackRef.current
    if (!track) return
    const cardWidth = 262 // 250 + 12 gap
    track.scrollBy({ left: dir === 'right' ? cardWidth * 2 : -cardWidth * 2, behavior: 'smooth' })
    setTimeout(updateScrollButtons, 350)
  }, [updateScrollButtons])

  // Native wheel listener (React onWheel is passive, can't preventDefault)
  useEffect(() => {
    const track = scoreTrackRef.current
    if (!track) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        track.scrollLeft += e.deltaY
        updateScrollButtons()
      }
    }
    const onScroll = () => updateScrollButtons()
    track.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('scroll', onScroll, { passive: true })
    updateScrollButtons()
    return () => {
      track.removeEventListener('wheel', onWheel)
      track.removeEventListener('scroll', onScroll)
    }
  }, [updateScrollButtons])

  const onScorePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const track = scoreTrackRef.current
    if (!track || e.button !== 0) return
    scoreDrag.current = { active: true, startX: e.clientX, scrollL: track.scrollLeft, moved: 0 }
    track.setPointerCapture(e.pointerId)
    e.preventDefault()
  }, [])

  const onScorePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!scoreDrag.current.active) return
    const track = scoreTrackRef.current
    if (!track) return
    const dx = e.clientX - scoreDrag.current.startX
    scoreDrag.current.moved += Math.abs(dx)
    track.scrollLeft = scoreDrag.current.scrollL - dx
    scoreDrag.current.startX = e.clientX
    scoreDrag.current.scrollL = track.scrollLeft
  }, [])

  const onScorePointerUp = useCallback(() => {
    scoreDrag.current.active = false
  }, [])

  const onScoreClick = useCallback((e: React.MouseEvent) => {
    if (scoreDrag.current.moved > 8) e.preventDefault()
    scoreDrag.current.moved = 0
  }, [])

  const dynamicFeed = [
    {
      label: `${liveEventsCount} events firing right now 🔥`,
      path: '/events',
      chip: 'Jump In',
      meta: 'Instant action. Real prizes. Real players.',
    },
    {
      label: `${liveChallengesCount} battles waiting for you`,
      path: '/challenges',
      chip: 'Compete',
      meta: `Level up against the best near ${activeCity}`,
    },
    {
      label: `${cityPlayersCount} superstars ready to hire`,
      path: '/players',
      chip: 'Hire Now',
      meta: `Unbeatable talent. Fast booking. ${activeCity} focus.`,
    },
    {
      label: '3 auctions open for bidding',
      path: '/auction',
      chip: 'Bid Now',
      meta: `Draft your dream squad in ${activeCity}.`,
    },
    {
      label: '5 turfs available nearby',
      path: '/turf-partner',
      chip: 'Book',
      meta: `Grass and turf grounds near ${activeCity}.`,
    },
    {
      label: '12 teams recruiting players',
      path: '/teams',
      chip: 'Apply',
      meta: 'Open roster spots across cricket and football.',
    },
  ]

  return (
    <>
      <section className={styles.heroPanel}>
        <div className={styles.heroPanelMedia} aria-hidden="true">
          <video
            className={styles.heroPanelVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={cricketHero}
          >
            <source src="/videos/dhoni-six.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroPanelScrim}></div>
        </div>

        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>The sports network for modern players</p>
          <h1>Get discovered, get hired, and run sports events at scale.</h1>
          <p className={styles.heroText}>
            Gully World is built for players, partners, and organizers to create tournaments, publish events,
            hire talent, and expand into future store experiences without rebuilding the platform.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} to="/events">
              Create Event
            </Link>
            <Link className={styles.secondaryAction} to="/tournament">
              Explore Features
            </Link>
          </div>
          <div className={styles.heroStoreInline}>
            <AppStoreBadges compact />
          </div>
          <div className={styles.clubTicker} aria-label="Quick access actions">
            {quickAccessActions.map((item) => (
              <Link key={item.label} className={styles.quickAccessChip} to={item.path}>{item.label}</Link>
            ))}
          </div>
          <div className={styles.heroStatStrip} id="stats">
            {stats.map((card) => (
              <article className={styles.heroStatCard} key={card.label}>
                <strong>{card.value}</strong>
                <span>{card.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.heroStage} aria-label="Cricket app hero image and live widgets">
          <section className={styles.scoreShell}>
            <div className={styles.scorePhoneShell}>
              <div className={styles.scorePhoneNotch} aria-hidden="true"></div>
              <div className={styles.scoreVisual}>
                <img className={styles.heroImage} src={cricketHero} alt="Cricket player celebrating on the field" />
                <div className={styles.scoreVisualScrim}></div>
                <div className={styles.scrollIndicator} aria-hidden="true">
                  <div className={styles.scrollThumb} ref={thumbRef}></div>
                </div>
                <div className={styles.scorePhoneFeed} id="matches" ref={feedRef}>
                  <div className={`${styles.scoreFloatingCard} ${styles.primaryFloatingCard}`}>
                    <div className={styles.scoreTopline}>
                      <span className={styles.pulseDot}></span>
                      <span>Live Feed</span>
                      <span className={styles.chip}>Now</span>
                    </div>
                    <Link to="/events" className={styles.activePlaysLink}>
                      <strong>{liveEventsCount + liveChallengesCount}</strong>
                      <span>active plays</span>
                    </Link>
                    <p>Scouting, hiring, and event action in {activeCity}</p>
                    <span>Open any tile to jump directly into that section.</span>
                  </div>

                  <div className={styles.scoreList}>
                    {dynamicFeed.map((item, index) => (
                      <Link className={`${styles.scoreCard} ${styles.compactCard} ${styles.liveEventCard} ${styles.feedInsightCard}${index === 0 ? ` ${styles.featuredCompactCard}` : ''}`} to={item.path} key={item.label}>
                        <div className={styles.compactHead}>
                          <p>Live update</p>
                          <span className={`${styles.chip} alt`}>{item.chip}</span>
                        </div>
                        <strong>{item.label}</strong>
                        <p className={styles.feedMetaText}>{item.meta}</p>
                        <div className={styles.compactFoot}>
                          <span>{activeCity}</span>
                          <span>Open</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Live Scoreboard Carousel */}
      <section className={styles.scoreboardStrip} aria-label="Live scores">
        {canScrollLeft && (
          <button className={`${styles.scoreNavBtn} ${styles.scoreNavLeft}`} type="button" onClick={() => scrollScore('left')} aria-label="Previous matches">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        {canScrollRight && (
          <button className={`${styles.scoreNavBtn} ${styles.scoreNavRight}`} type="button" onClick={() => scrollScore('right')} aria-label="More matches">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
        <div
          className={styles.scoreboardTrack}
          ref={scoreTrackRef}
          onPointerDown={onScorePointerDown}
          onPointerMove={onScorePointerMove}
          onPointerUp={onScorePointerUp}
          onPointerCancel={onScorePointerUp}
          onClickCapture={onScoreClick}
          onDragStart={(e) => e.preventDefault()}
        >
          {[
            { status: 'LIVE', league: 'IPL 2026', venue: 'Mumbai', team1: 'MI', team1Score: '182/4', team1Overs: '18.2 ov', team2: 'CSK', team2Score: '165/6', team2Overs: '20 ov', note: 'MI need 18 from 10 balls', path: '/events' },
            { status: 'LIVE', league: 'GPL T20', venue: 'Bangalore', team1: 'RCB', team1Score: '62/1', team1Overs: '7.3 ov', team2: 'KKR', team2Score: '', team2Overs: '', note: 'RCB chose to bat first', path: '/events' },
            { status: 'UPCOMING', league: 'ISL 2026', venue: 'Goa', team1: 'FCG', team1Score: '', team1Overs: 'Tomorrow', team2: 'MCFC', team2Score: '', team2Overs: '7:30 PM', note: 'Semi Final Leg 1', path: '/events' },
            { status: 'RESULT', league: 'IPL 2026', venue: 'Delhi', team1: 'DC', team1Score: '214/4', team1Overs: '20 ov', team2: 'SRH', team2Score: '218/5', team2Overs: '19.1 ov', note: 'SRH won by 5 wickets', path: '/events' },
            { status: 'LIVE', league: 'PBL', venue: 'Hyderabad', team1: 'HYD', team1Score: '2', team1Overs: 'Set 3', team2: 'CHE', team2Score: '1', team2Overs: '15-12', note: 'Hyderabad leads 2-1', path: '/events' },
            { status: 'UPCOMING', league: 'GPL T20', venue: 'Pune', team1: 'PW', team1Score: '', team1Overs: 'Today', team2: 'GT', team2Score: '', team2Overs: '3:30 PM', note: 'League stage match', path: '/events' },
            { status: 'RESULT', league: 'PL 2026', venue: 'London', team1: 'ARS', team1Score: '3', team1Overs: 'FT', team2: 'CHE', team2Score: '1', team2Overs: '', note: 'Arsenal move to 2nd place', path: '/events' },
            { status: 'LIVE', league: 'NBL', venue: 'Chennai', team1: 'TNC', team1Score: '78', team1Overs: 'Q3', team2: 'BLR', team2Score: '72', team2Overs: '4:22', note: 'TNC leads by 6 points', path: '/events' },
            { status: 'UPCOMING', league: 'IPL 2026', venue: 'Kolkata', team1: 'KKR', team1Score: '', team1Overs: 'Tomorrow', team2: 'PBKS', team2Score: '', team2Overs: '7:30 PM', note: 'Night match at Eden Gardens', path: '/events' },
          ].map((match, i) => (
            <Link key={i} to={match.path} className={styles.scoreCard2}>
              <div className={styles.scoreCardHeader}>
                <span className={`${styles.scoreCardStatus} ${styles[match.status.toLowerCase()]}`}>
                  {match.status === 'LIVE' && <span className={styles.liveDot2} />}
                  {match.status}
                </span>
                <span className={styles.scoreCardLeague}>{match.league} &middot; {match.venue}</span>
              </div>
              <div className={styles.scoreCardTeams}>
                <div className={styles.scoreCardTeamRow}>
                  <span className={styles.teamName}>{match.team1}</span>
                  <span className={styles.teamScore}>{match.team1Score}</span>
                  <span className={styles.teamOvers}>{match.team1Overs}</span>
                </div>
                <div className={styles.scoreCardTeamRow}>
                  <span className={styles.teamName}>{match.team2}</span>
                  <span className={styles.teamScore}>{match.team2Score}</span>
                  <span className={styles.teamOvers}>{match.team2Overs}</span>
                </div>
              </div>
              <p className={styles.scoreCardNote}>{match.note}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now Section */}
      <section className={styles.trendingStrip}>
        <div className={styles.trendingInner}>
          <div className={styles.trendingHeading}>
            <span className={styles.trendingBadge}>🔥 Trending</span>
            <h3>What's hot on Gully World</h3>
          </div>
          <div className={styles.trendingCards}>
            <Link to="/events" className={styles.trendingCard}>
              <span className={styles.trendingCardIcon}>⚡</span>
              <div>
                <strong>{liveEventsCount} Live Events</strong>
                <p>Happening right now in {activeCity}</p>
              </div>
            </Link>
            <Link to="/challenges" className={styles.trendingCard}>
              <span className={styles.trendingCardIcon}>🎯</span>
              <div>
                <strong>{liveChallengesCount} Active Challenges</strong>
                <p>Compete and climb leaderboards</p>
              </div>
            </Link>
            <Link to="/players" className={styles.trendingCard}>
              <span className={styles.trendingCardIcon}>🏆</span>
              <div>
                <strong>{cityPlayersCount} Players Available</strong>
                <p>Ready to hire near {activeCity}</p>
              </div>
            </Link>
            <Link to="/auction" className={styles.trendingCard}>
              <span className={styles.trendingCardIcon}>🔨</span>
              <div>
                <strong>Auctions Open</strong>
                <p>Draft your dream team today</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.featureBand} id="features">
        <div className={styles.featureBandTop}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Everything a sports ecosystem needs</p>
            <h2>From events and tournaments to hiring and partner discovery, everything stays in one platform.</h2>
            <p className={styles.featureSubtext}>Move from discovering games to closing hires in one continuous sports workflow.</p>
          </div>
          <article className={styles.sponsorAdCard} aria-label="Sponsor advertising">
            <div className={styles.sponsorAdBadge}>
              <p>Partner with us</p>
              <span>Featured Spot</span>
            </div>
            <h3>Advertise your sports brand to thousands of active players and organizers</h3>
            <p className={styles.sponsorAdDescription}>Reach your audience. Get discovered. Grow your sports business.</p>
            <ul className={styles.sponsorBenefits}>
              <li>Premium placement on homepage</li>
              <li>Access 100K+ sports enthusiasts</li>
              <li>Sponsor badges and co-branding</li>
            </ul>
            <Link className={styles.sponsorAdCta} to="/contact#advertise">Click here to advertise</Link>
          </article>
        </div>
        <div className={styles.featureGrid}>
          {featureCards.map((feature, index) => (
            <article className={styles.featureCard} key={feature.title}>
              <span className={styles.featureIndex}>{String(index + 1).padStart(2, '0')}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <Link className={styles.featureCardAction} to={feature.actionPath}>{feature.actionLabel}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.turfOwnerStrip} aria-label="Turf partner onboarding">
        <div className={styles.turfOwnerStripInner}>
          <div className={styles.turfOwnerCopy}>
            <p className={styles.eyebrow}>Turf Owners</p>
            <h3>Register your turf for free and get discovered for challenges and events.</h3>
            <p>Integrate your ground so teams can book slots directly when hosting challenges, leagues, and tournaments.</p>
          </div>
          <Link className={styles.primaryAction} to="/turf-partner">Register Turf Free</Link>
        </div>
      </section>

      <section className={`insight-panel ${styles.featureShowcaseSection}`}>
        <div className={styles.featureShowcaseHeader}>
          <p className={styles.eyebrow}>How Gully World works</p>
          <h2>Everything you need to dominate your sport</h2>
        </div>
        <div className={styles.featureShowcaseLayout}>
          <div className={styles.featuresLeft}>
            {platformFeatures.slice(0, 5).map((feature) => (
              <article key={feature.id} className={styles.featureShowcaseCard}>
                <div className={styles.fscTop}>
                  <span className={styles.fscIcon}>{feature.icon}</span>
                  <span className={styles.fscNum}>{feature.id}</span>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
                <Link className={styles.fscBtn} to={feature.path}>{feature.btn}</Link>
              </article>
            ))}
          </div>

          <div className={styles.showcasePhoneFrame}>
            <div className={styles.phoneNotch}></div>
            <div className={styles.phoneScreen}>
              <img src={cricketHero} alt="Live sports action on Gully World" className={styles.phoneContent} />
              <div className={styles.phoneOverlay}>
                <div className={styles.liveBadge}>● LIVE</div>
                <Link className={styles.phoneAction} to="/login">Tap to join</Link>
              </div>
            </div>
            <div className={styles.phoneFrameBottom}></div>
          </div>

          <div className={styles.featuresRight}>
            {platformFeatures.slice(5, 10).map((feature) => (
              <article key={feature.id} className={styles.featureShowcaseCard}>
                <div className={styles.fscTop}>
                  <span className={styles.fscIcon}>{feature.icon}</span>
                  <span className={styles.fscNum}>{feature.id}</span>
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
                <Link className={styles.fscBtn} to={feature.path}>{feature.btn}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
