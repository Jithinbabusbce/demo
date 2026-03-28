import { useEffect, useRef, useState, useCallback } from 'react'
import contactBanner from '../assets/subpages/teams.jpg'
import heroStyles from './SubpageHero.module.css'
import styles from './ContactPage.module.css'

function generateCaptcha() {
  const a = Math.floor(Math.random() * 20) + 1
  const b = Math.floor(Math.random() * 20) + 1
  return { question: `${a} + ${b}`, answer: a + b }
}

export default function ContactPage() {
  const selectRef = useRef<HTMLSelectElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [captcha, setCaptcha] = useState(generateCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState(false)
  const [captchaPassed, setCaptchaPassed] = useState(false)
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha())
    setCaptchaInput('')
    setCaptchaError(false)
    setCaptchaPassed(false)
  }, [])

  useEffect(() => {
    if (window.location.hash === '#advertise' && selectRef.current) {
      selectRef.current.value = 'advertise'
      selectRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  function handleCaptchaChange(value: string) {
    setCaptchaInput(value)
    setCaptchaError(false)
    if (parseInt(value, 10) === captcha.answer) {
      setCaptchaPassed(true)
    } else {
      setCaptchaPassed(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const allowed = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowed.includes(file.type)) {
        setFileName('')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      setFileName(file.name)
    } else {
      setFileName('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaPassed) {
      setCaptchaError(true)
      return
    }
    setCaptchaError(false)
    setSubmitted(true)
    // TODO: handle actual form submission (no backend API yet — frontend only)
  }

  return (
    <div className="subpage">
      <div className={heroStyles.contactHero}>
        <h1>Contact Us</h1>
        <p>Reach the Gully World Technology team for partnerships, events, hiring, and support.</p>
      </div>
      <div className={styles.contactSportsBg}>
        <div className="subpage-content">
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.contactVisual}>
                <img src={contactBanner} alt="Sports team discussing strategy before a match" loading="lazy" width={600} height={400} />
              </div>
              <h2>Get in Touch</h2>
              <div className={styles.contactItem}>
                <strong>Email</strong>
                <p>hello@gullyworld.com</p>
              </div>
              <div className={styles.contactItem}>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
              <div className={styles.contactItem}>
                <strong>Address</strong>
                <p>Gully World Technology Pvt. Ltd.<br/>Mumbai, Maharashtra, India</p>
              </div>
            </div>
            <div className={styles.contactFormCard}>
              {submitted ? (
                <div className={styles.contactSuccess}>
                  <span className={styles.contactSuccessIcon}>✅</span>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you shortly.</p>
                  <button type="button" className="card-action-btn" onClick={() => { setSubmitted(false); refreshCaptcha(); setFileName('') }}>Send Another</button>
                </div>
              ) : (
                <>
                  <h3>Submit Query</h3>
                  <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name…" className="form-input" required aria-label="Your name" autoComplete="name" />
                    <input type="email" placeholder="Email…" className="form-input" required aria-label="Email address" autoComplete="email" spellCheck={false} />
                    <select ref={selectRef} className="form-input form-select" defaultValue="" aria-label="Subject">
                      <option value="" disabled>Subject…</option>
                      <option value="support">Support &amp; Help</option>
                      <option value="advertise">Advertise with Us</option>
                      <option value="sponsor">Sponsorship &amp; Partnership</option>
                      <option value="events">Events &amp; Tournaments</option>
                      <option value="hiring">Player Hiring &amp; Talent</option>
                      <option value="issues">Report an Issue</option>
                      <option value="other">Other</option>
                    </select>
                    <textarea placeholder="Message…" className="form-input form-textarea" rows={5} required aria-label="Your message" autoComplete="off"></textarea>
                    <div className={styles.fileUploadRow}>
                      <label className={styles.fileUploadLabel}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif"
                          className={styles.fileUploadInput}
                          onChange={handleFileChange}
                        />
                        <span className={styles.fileUploadBtn}>📎 Upload screenshot</span>
                        <span className={styles.fileUploadHint}>(jpg, png, gif) optional</span>
                      </label>
                      {fileName && <span className={styles.fileUploadName}>{fileName}</span>}
                    </div>
                    <div className={styles.captchaRow}>
                      <span className={styles.captchaChallenge}><span aria-hidden="true">{'\uD83D\uDD12'}</span> What is <strong>{captcha.question}</strong>?</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`form-input ${styles.captchaInput}`}
                        placeholder="Answer…"
                        aria-label={`Captcha: what is ${captcha.question}?`}
                        autoComplete="off"
                        value={captchaInput}
                        onChange={(e) => handleCaptchaChange(e.target.value)}
                      />
                      <button type="button" className={styles.captchaRefresh} onClick={refreshCaptcha} aria-label="Generate new captcha question">{'\u21BB'}</button>
                      {captchaPassed && <span className={styles.captchaPass} aria-label="Captcha solved">{'\u2713'}</span>}
                    </div>
                    <div aria-live="polite">
                      {captchaError && <p className={styles.captchaError} role="alert">Please solve the captcha correctly to submit.</p>}
                    </div>
                    <button type="submit" className="card-action-btn" disabled={!captchaPassed}>Submit</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
