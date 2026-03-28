export const menuGroups = [
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


export const quickAccessActions = [
  { label: 'Hire a Player', path: '/players' },
  { label: 'Join Live Events', path: '/events' },
  { label: 'Book a Turf', path: '/turf-partner' },
  { label: 'Start a Tournament', path: '/tournament' },
]

export const featureCards = [
  {
    title: 'Get hired and build your profile',
    text: 'Players can showcase skills, publish achievements, and get hired by teams, partners, and organizers.',
    actionLabel: 'Build My Profile',
    actionPath: '/players',
  },
  {
    title: 'Tournaments and events in one flow',
    text: 'Conduct tournaments, create events, manage registrations, and coordinate schedules from one dashboard.',
    actionLabel: 'Run Tournament',
    actionPath: '/tournament',
  },
  {
    title: 'Talent Hub built on hire-and-offer logic',
    text: 'Hire sports talent or create your own profile to get hired, inspired by Fiverr-style service flow.',
    actionLabel: 'Open Talent Hub',
    actionPath: '/marketplace',
  },
]

export const stats = [
  { value: '5M+', label: 'sports users reached' },
  { value: '180K+', label: 'events hosted annually' },
  { value: '3200+', label: 'teams hiring talent' },
]

export const platformFeatures = [
  { id: '01', icon: '⚡', title: 'Live Events', desc: 'Discover instant sports action happening around you right now.', path: '/events', btn: 'Browse Events' },
  { id: '02', icon: '🏆', title: 'Run Tournaments', desc: 'Organize brackets, manage fixtures, and track standings end to end.', path: '/tournament', btn: 'Start Tournament' },
  { id: '03', icon: '🎯', title: 'Challenges', desc: 'Post a challenge, rally rivals, and compete for bragging rights.', path: '/challenges', btn: 'View Challenges' },
  { id: '04', icon: '🤝', title: 'Hire Players', desc: 'Scout proven talent and fill your squad vacancies in minutes.', path: '/marketplace', btn: 'Open Talent Hub' },
  { id: '05', icon: '👤', title: 'Player Profiles', desc: 'Build your sporting CV, publish stats, and get discovered.', path: '/players', btn: 'See Players' },
  { id: '06', icon: '🛡️', title: 'Team Pages', desc: 'Manage rosters, share stories, and rally your fan base.', path: '/teams', btn: 'Explore Teams' },
  { id: '07', icon: '🔨', title: 'Player Auction', desc: 'Run a live auction, set budgets, and draft your dream team.', path: '/auction', btn: 'Open Auction' },
  { id: '08', icon: '🛒', title: 'Sports Store', desc: 'Kit up with licensed gear, jerseys, and sports accessories.', path: '/store', btn: 'Visit Store' },
  { id: '09', icon: '🗺️', title: 'Find a Turf', desc: 'Discover and book sports turfs near you, or register your own.', path: '/turf-partner', btn: 'Find Turf' },
  { id: '10', icon: '💬', title: 'Community', desc: 'Connect with players, coaches, and organizers near you.', path: '/contact', btn: 'Join Now' },
]
