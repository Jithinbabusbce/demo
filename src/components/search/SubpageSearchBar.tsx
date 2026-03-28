import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import styles from './SubpageSearchBar.module.css'

const pageSearchConfig: Record<string, {
  placeholder: string
  sports: string[]
  sortBy: string[]
  dateOptions: string[]
}> = {
  '/tournament': {
    placeholder: 'Search tournaments, formats, teams, locations\u2026',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball', 'Tennis'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Upcoming', 'Popular'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week', 'This Month'],
  },
  '/challenges': {
    placeholder: 'Search active challenges, sports, clubs\u2026',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Multi-Sport'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Ending Soon', 'Popular'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week', 'This Month'],
  },
  '/players': {
    placeholder: 'Search players by name, sport, skill level\u2026',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball'],
    sortBy: ['Filter & Sort By', 'Top Rated', 'Most Matches', 'Recently Active'],
    dateOptions: ['Date', 'Any Date', 'Available Today', 'Available This Week'],
  },
  '/teams': {
    placeholder: 'Search teams, clubs, academies\u2026',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Trending', 'Most Active'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week'],
  },
  '/events': {
    placeholder: 'Search events by sport, location, date\u2026',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football', 'Badminton', 'Basketball'],
    sortBy: ['Filter & Sort By', 'Live', 'Finished', 'Upcoming', 'Popular'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Weekend', 'This Month'],
  },
  '/auction': {
    placeholder: 'Search player auctions, teams, budgets\u2026',
    sports: ['Sports', 'All Sports', 'Cricket', 'Football'],
    sortBy: ['Filter & Sort By', 'Live', 'Upcoming', 'Highest Budget'],
    dateOptions: ['Date', 'Any Date', 'Today', 'This Week'],
  },
  '/marketplace': {
    placeholder: 'Search hires, offers, sports services, creators\u2026',
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

  const { sport, sortBy, date, payAndJoin } = useMemo(() => {
    const params = new URLSearchParams(search)
    const freshConfig = pageSearchConfig[pathname]
    return {
      sport: params.get('sport') ?? freshConfig?.sports[0] ?? '',
      sortBy: params.get('sort') ?? freshConfig?.sortBy[0] ?? '',
      date: params.get('date') ?? freshConfig?.dateOptions[0] ?? '',
      payAndJoin: params.get('pay') === '1',
    }
  }, [pathname, search])

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

  if (!config || pathname === '/marketplace' || pathname === '/turf-partner') return null

  return (
    <section className={styles.subpageSearchWrap} aria-label="Search and filter">
      <div className={styles.subpageSearchBar}>
        <div className={styles.subpageSearchInputRow}>
          <div className={styles.subpageSearchBox}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5-1.48 1.48-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
            </svg>
            <input
              className={styles.subpageSearchInput}
              type="search"
              placeholder={config.placeholder}
              aria-label={`Search ${pathname.slice(1)}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') applyFilters({ q: query })
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button className={styles.subpageSearchButton} type="button" onClick={() => applyFilters({ q: query })}>Search</button>
          <button
            className={styles.subpageClearFilterBtn}
            type="button"
            onClick={() => {
              setQuery('')
              navigate({ pathname, search: '' }, { replace: true })
            }}
          >
            Clear Filter
          </button>
        </div>
        <div className={styles.subpageFilterBar} role="group" aria-label="Filter controls">
          <label className={`${styles.filterControl} ${styles.selectControl}`}>
            <span className={styles.filterIcon} aria-hidden="true">{'\u21C5'}</span>
            <select
              value={sortBy}
              aria-label="Sort by"
              onChange={(event) => {
                applyFilters({ sortBy: event.target.value })
              }}
            >
              {config.sortBy.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className={`${styles.filterControl} ${styles.selectControl}`}>
            <span className={styles.filterIcon} aria-hidden="true">{'\u25CE'}</span>
            <select
              value={sport}
              aria-label="Filter by sport"
              onChange={(event) => {
                applyFilters({ sport: event.target.value })
              }}
            >
              {config.sports.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className={`${styles.filterControl} ${styles.selectControl}`}>
            <span className={styles.filterIcon} aria-hidden="true">{'\uD83D\uDCC5'}</span>
            <select
              value={date}
              aria-label="Filter by date"
              onChange={(event) => {
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
            className={`${styles.filterControl}${payAndJoin ? ` ${styles.active}` : ''}`}
            onClick={() => {
              applyFilters({ payAndJoin: !payAndJoin })
            }}
            aria-pressed={payAndJoin}
          >
            <span className={styles.filterIcon} aria-hidden="true">{'\uD83D\uDCB3'}</span>
            <span>Pay &amp; Join Game</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default SubpageSearchBar
