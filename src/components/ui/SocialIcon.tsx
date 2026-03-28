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

export default SocialIcon
