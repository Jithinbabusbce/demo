import { useEffect, useRef, useState } from 'react'
import styles from './SupportChatWidget.module.css'

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
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

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
    <div className={styles.supportChat}>
      {open ? (
        <div
          className={styles.supportChatPanel}
          role="dialog"
          aria-label="Gully World support chat"
          ref={panelRef}
        >
          <div className={styles.supportChatHeader}>
            <strong>Gully World Chat</strong>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <span aria-hidden="true">{'\u2715'}</span>
            </button>
          </div>
          <div className={styles.supportChatMessages} aria-live="polite" aria-relevant="additions">
            {messages.map((item, index) => (
              <p key={`${item.text}-${index}`} className={item.sender === 'bot' ? styles.bot : styles.user}>
                {item.sender === 'user' ? `You: ${item.text}` : `Gully AI: ${item.text}`}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.supportChatQuickActions} role="group" aria-label="Quick questions">
            <button type="button" onClick={() => setInput('Tell me about pricing')}>Pricing</button>
            <button type="button" onClick={() => setInput('Where is blog?')}>Blog</button>
            <button type="button" onClick={() => setInput('How to book turf?')}>Book Turf</button>
            <button type="button" onClick={() => setInput('Show community forum')}>Forum</button>
          </div>
          <div className={styles.supportChatInputRow}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') sendMessage()
              }}
              placeholder="Type your message…"
              aria-label="Chat message"
              autoComplete="off"
            />
            <button type="button" onClick={sendMessage} aria-label="Send message">Send</button>
          </div>
        </div>
      ) : null}
      <button
        className={styles.supportChatToggle}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
      >
        {open ? 'Close Chat' : 'Chat with Us'}
      </button>
    </div>
  )
}

export default SupportChatWidget
