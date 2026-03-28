import { Link } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Notification, User } from '../../types'
import { menuGroups } from '../../data/navigation'
import BrandWordmark from '../ui/BrandWordmark'
import gullyWorldLogo from '../../assets/gully-world-logo.svg'
import styles from './Header.module.css'

function Header({ user, notifications, setNotifications, onLogout }: { user: User | null, notifications: Notification[], setNotifications: (n: Notification[]) => void, onLogout: () => void }) {
  const [city, setCity] = useState('Bangalore')
  const [locationMenuOpen, setLocationMenuOpen] = useState(false)
  const [locationInput, setLocationInput] = useState('Bangalore')
  const [isLocating, setIsLocating] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const locationMenuRef = useRef<HTMLDivElement>(null)
  const notificationMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const closeAllMenus = useCallback(() => {
    setLocationMenuOpen(false)
    setNotificationMenuOpen(false)
    setProfileMenuOpen(false)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeAllMenus()
    }
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (locationMenuOpen && locationMenuRef.current && !locationMenuRef.current.contains(target)) {
        setLocationMenuOpen(false)
      }
      if (notificationMenuOpen && notificationMenuRef.current && !notificationMenuRef.current.contains(target)) {
        setNotificationMenuOpen(false)
      }
      if (profileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [locationMenuOpen, notificationMenuOpen, profileMenuOpen, closeAllMenus])

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

  function markNotificationsAsRead() {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('gullyworld-notifications', JSON.stringify(updated))
  }

  function clearNotifications() {
    setNotifications([])
    localStorage.removeItem('gullyworld-notifications')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <div className={styles.topbarStickyWrapper}>
        <header className={styles.topbar}>
        <div className={styles.topbarLeft} ref={locationMenuRef}>
          <Link className={styles.brandBlock} to="/" aria-label="Gully World home">
            <img className={styles.brandLogo} src={gullyWorldLogo} alt="Gully World logo" width={44} height={44} />
            <BrandWordmark />
          </Link>
          <button
            className={styles.locationPill}
            type="button"
            aria-label={`Select city, current: ${city}`}
            aria-expanded={locationMenuOpen}
            aria-haspopup="dialog"
            onClick={() => setLocationMenuOpen((open) => !open)}
          >
            <svg className={styles.locPinIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{city}</span>
            <svg className={styles.locCaret} viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
          {locationMenuOpen ? (
            <div className={styles.locationMenu} role="dialog" aria-label="Change location">
              <div className={styles.locationSearchRow}>
                <svg className={styles.locationSearchIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5-1.48 1.48-5-5zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.51 4.51 0 0 1 9.5 14z"/>
                </svg>
                <input
                  id="location-input"
                  type="text"
                  value={locationInput}
                  onChange={(event) => setLocationInput(event.target.value)}
                  placeholder="Search cities, places…"
                  aria-label="Search city or location"
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') applyCity(locationInput)
                  }}
                />
                <button className={styles.detectInlineBtn} type="button" onClick={detectCurrentLocation} disabled={isLocating} aria-label="Use current location">
                  <span aria-hidden="true">{isLocating ? '\u2026' : '\u25CE'}</span>
                </button>
              </div>
              <div className={styles.locationChipList} role="listbox" aria-label="Suggested cities">
                {filteredCities.map((item) => (
                  <button key={item} type="button" role="option" aria-selected={item === city} onClick={() => applyCity(item)}>{item}</button>
                ))}
              </div>
              <button className={styles.locateBtn} type="button" onClick={detectCurrentLocation} disabled={isLocating}>
                {isLocating ? 'Detecting your sports zone\u2026' : 'Use Current Location'}
              </button>
            </div>
          ) : null}
        </div>

        <nav className={styles.navLinks} aria-label="Primary">
          {menuGroups.map((group) => (
            <div className={styles.navItem} key={group.title}>
              <button className={styles.navTrigger} type="button" aria-haspopup="menu" aria-expanded={false}>
                {group.title}
                <span className={styles.navCaret} aria-hidden="true">&#x25BE;</span>
              </button>
              <div className={styles.dropdownPanel} role="menu">
                <div className={styles.dropdownGrid}>
                  {group.items.map((item) => (
                    <Link className={styles.dropdownLink} to={item.path} key={item.label} role="menuitem">
                      <strong>{item.label}</strong>
                      <span>{item.text}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link className={styles.navPlainLink} to="/marketplace">
            Talent Hub
          </Link>
          <Link className={styles.navPlainLink} to="/feed">
            Community
          </Link>
          <Link className={styles.navPlainLink} to="/turf-partner">
            Find a Turf
          </Link>
          <Link className={styles.navPlainLink} to="/contact">
            Contact
          </Link>
          <Link className={styles.navPlainLink} to="/store">
            Store
          </Link>
        </nav>

        <div className={styles.topbarActions}>
          {user ? (
            <>
              {/* Notification Bell */}
              <div className={styles.notificationButtonWrapper} ref={notificationMenuRef}>
                <button
                  className={styles.notificationBell}
                  type="button"
                  onClick={() => {
                    setNotificationMenuOpen(!notificationMenuOpen)
                    if (!notificationMenuOpen) markNotificationsAsRead()
                  }}
                  aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                  aria-expanded={notificationMenuOpen}
                  aria-haspopup="dialog"
                >
                  <svg className={styles.bellIcon} viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 3.36 6 5.92 6 9v5l-2 2v1h16v-1l-2-2z"/>
                  </svg>
                  {unreadCount > 0 && <span className={styles.notificationBadge} aria-hidden="true">{unreadCount}</span>}
                </button>
                {notificationMenuOpen && (
                  <div className={styles.notificationMenu} role="dialog" aria-label="Notifications">
                    <div className={styles.notificationMenuHeader}>
                      <h4>Notifications</h4>
                      {notifications.length > 0 && (
                        <button
                          className={styles.notificationClearBtn}
                          type="button"
                          onClick={clearNotifications}
                          aria-label="Clear all notifications"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className={styles.notificationMenuList}>
                      {notifications.length === 0 ? (
                        <div className={styles.notificationEmpty}>
                          <p>No notifications yet</p>
                          <span>You're all caught up!</span>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className={`${styles.notificationItem}${!notif.read ? ` ${styles.unread}` : ''}`}>
                            <span className={styles.notificationIcon} aria-hidden="true">
                              {notif.action === 'mention' && '\uD83D\uDC64'}
                              {notif.action === 'tag' && '\uD83C\uDFF7\uFE0F'}
                              {notif.action === 'like' && '\uD83D\uDC4D'}
                              {notif.action === 'comment' && '\uD83D\uDCAC'}
                              {notif.action === 'follow' && '\u2728'}
                            </span>
                            <div className={styles.notificationContent}>
                              <strong>{notif.author}</strong>
                              <p>{notif.text}</p>
                              <small>{notif.timestamp}</small>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar */}
              <div className={styles.profileButtonWrapper} ref={profileMenuRef}>
                <button
                  className={styles.profileAvatarBtn}
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  aria-label={`Profile menu for ${user.name}`}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="dialog"
                  title={user.name}
                >
                  <div className={styles.profileAvatar} style={{ background: user.avatar }} aria-hidden="true">
                    {user.initials}
                  </div>
                </button>
                {profileMenuOpen && (
                  <div className={styles.profileMenu} role="dialog" aria-label="Profile menu">
                    <div className={styles.profileMenuHeader}>
                      <div className={styles.profileMenuUser}>
                        <div className={styles.profileAvatarLarge} style={{ background: user.avatar }}>
                          {user.initials}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                          <span>Gully World Member</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.profileMenuLinks}>
                      <Link to="/players" className={styles.profileMenuLink}>
                        👤 My Profile
                      </Link>
                      <Link to="/feed" className={styles.profileMenuLink}>
                        📰 My Community
                      </Link>
                      <button
                        type="button"
                        className={`${styles.profileMenuLink} ${styles.logoutBtn}`}
                        onClick={() => {
                          onLogout()
                          setProfileMenuOpen(false)
                        }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link className={styles.headerSecondaryLink} to="/pricing">Pricing</Link>
              <Link className={styles.headerLink} to="/login">Login / Signup</Link>
            </>
          )}
        </div>
      </header>
      </div>
    </>
  )
}

export default Header
