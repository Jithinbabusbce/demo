import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import type { Notification, User } from './types'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import SubpageSearchBar from './components/search/SubpageSearchBar'
import SupportChatWidget from './components/chat/SupportChatWidget'
import HomePage from './pages/HomePage'
const TournamentPage = lazy(() => import('./pages/TournamentPage'))
const ChallengesPage = lazy(() => import('./pages/ChallengesPage'))
const PlayerProfilesPage = lazy(() => import('./pages/PlayerProfilesPage'))
const TeamsPage = lazy(() => import('./pages/TeamsPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const AuctionPage = lazy(() => import('./pages/AuctionPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const StorePage = lazy(() => import('./pages/StorePage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const TurfPartnerPage = lazy(() => import('./pages/TurfPartnerPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const FeedPage = lazy(() => import('./pages/FeedPage'))

function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('gullyworld-user')
      return saved ? JSON.parse(saved) as User : null
    } catch { return null }
  })
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('gullyworld-notifications')
      return saved ? JSON.parse(saved) as Notification[] : []
    } catch { return [] }
  })

  function addNotification(author: string, action: Notification['action'], text: string) {
    const newNotification: Notification = {
      id: Date.now(),
      author,
      action,
      text,
      timestamp: 'Just now',
      read: false,
    }
    const updated = [newNotification, ...notifications].slice(0, 20)
    setNotifications(updated)
    localStorage.setItem('gullyworld-notifications', JSON.stringify(updated))
  }

  function loginUser(name: string) {
    const initials = name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
    const newUser: User = {
      name,
      avatar: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      initials,
    }
    setUser(newUser)
    localStorage.setItem('gullyworld-user', JSON.stringify(newUser))
  }

  function logoutUser() {
    setUser(null)
    localStorage.removeItem('gullyworld-user')
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="page-shell">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header user={user} notifications={notifications} setNotifications={setNotifications} onLogout={logoutUser} />
        <SubpageSearchBar />
        <main id="main-content">
          <Suspense fallback={
            <div className="page-loading" role="status" aria-live="polite">
              <div className="cricket-spinner" aria-hidden="true">
                <div className="cricket-ball">
                  <div className="ball-seam"></div>
                </div>
              </div>
              <p className="loading-text">Setting up the pitch…</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tournament" element={<TournamentPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/players" element={<PlayerProfilesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/auction" element={<AuctionPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/feed" element={<FeedPage isLoggedIn={Boolean(user)} onAddNotification={addNotification} />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/turf-partner" element={<TurfPartnerPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage onLogin={loginUser} />} />
            </Routes>
          </Suspense>
        </main>
        <SupportChatWidget />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
