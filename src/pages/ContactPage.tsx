import { useEffect, useRef, useState, useCallback } from 'react'
import contactBanner from '../assets/subpages/teams.jpg'
import '../App.css'

function generateCaptcha() {
  const a = Math.floor(Math.random() * 20) + 1
  const b = Math.floor(Math.random() * 20) + 1
  return { question: `${a} + ${b}`, answer: a + b }
}

export default function ContactPage() {
  const selectRef = useRef<HTMLSelectElement>(null)
  const [captcha, setCaptcha] = useState(generateCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState(false)

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
    setCaptchaError(false)
  }, [])

  useEffect(() => {
    if (window.location.hash === '#advertise' && selectRef.current) {
      selectRef.current.value = 'advertise'
      selectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setCaptchaError(true)
      refreshCaptcha()
      return
    }
    setCaptchaError(false)
    // TODO: handle actual form submission
  }

  return (
    <div className="subpage">
      <div className="subpage-hero contact-hero">
        <h1>Contact Us</h1>
        <p>Reach the Gully World Technology team for partnerships, events, hiring, and support.</p>
      </div>
      <div className="contact-sports-bg">
        <div className="subpage-content">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-visual">
                <img src={contactBanner} alt="Sports team discussing strategy before a match" />
              </div>
              <h2>Get in Touch</h2>
              <div className="contact-item">
                <strong>Email</strong>
                <p>hello@gullyworld.com</p>
              </div>
              <div className="contact-item">
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
              <div className="contact-item">
                <strong>Address</strong>
                <p>Gully World Technology Pvt. Ltd.<br/>Mumbai, Maharashtra, India</p>
              </div>
            </div>
            <div className="contact-form-card">
              <h3>Send us a message</h3>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Your Name" className="form-input" />
                <input type="email" placeholder="Your Email" className="form-input" />
                <select ref={selectRef} className="form-input form-select" defaultValue="">
                  <option value="" disabled>Select inquiry type</option>
                  <option value="support">Support &amp; Help</option>
                  <option value="advertise">Advertise with Us</option>
                  <option value="sponsor">Sponsorship &amp; Partnership</option>
                  <option value="events">Events &amp; Tournaments</option>
                  <option value="hiring">Player Hiring &amp; Talent</option>
                  <option value="issues">Report an Issue</option>
                  <option value="other">Other</option>
                </select>
                <textarea placeholder="Your Message" className="form-input form-textarea" rows={5}></textarea>
                <div className="captcha-row">
                  <span className="captcha-challenge">🔒 What is <strong>{captcha.question}</strong> ?</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input captcha-input"
                    placeholder="Answer"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                  <button type="button" className="captcha-refresh" onClick={refreshCaptcha} title="New question">↻</button>
                </div>
                {captchaError && <p className="captcha-error">Incorrect answer. Please try again.</p>}
                <button type="submit" className="card-action-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
