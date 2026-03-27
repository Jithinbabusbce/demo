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
              {submitted ? (
                <div className="contact-success">
                  <span className="contact-success-icon">✅</span>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you shortly.</p>
                  <button type="button" className="card-action-btn" onClick={() => { setSubmitted(false); refreshCaptcha(); setFileName('') }}>Send Another</button>
                </div>
              ) : (
                <>
                  <h3>Submit Query</h3>
                  <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" className="form-input" required />
                    <input type="email" placeholder="Email Id" className="form-input" required />
                    <select ref={selectRef} className="form-input form-select" defaultValue="">
                      <option value="" disabled>Subject</option>
                      <option value="support">Support &amp; Help</option>
                      <option value="advertise">Advertise with Us</option>
                      <option value="sponsor">Sponsorship &amp; Partnership</option>
                      <option value="events">Events &amp; Tournaments</option>
                      <option value="hiring">Player Hiring &amp; Talent</option>
                      <option value="issues">Report an Issue</option>
                      <option value="other">Other</option>
                    </select>
                    <textarea placeholder="Message" className="form-input form-textarea" rows={5} required></textarea>
                    <div className="file-upload-row">
                      <label className="file-upload-label">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif"
                          className="file-upload-input"
                          onChange={handleFileChange}
                        />
                        <span className="file-upload-btn">📎 Upload screenshot</span>
                        <span className="file-upload-hint">(jpg, png, gif) optional</span>
                      </label>
                      {fileName && <span className="file-upload-name">{fileName}</span>}
                    </div>
                    <div className="captcha-row">
                      <span className="captcha-challenge">🔒 What is <strong>{captcha.question}</strong> ?</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input captcha-input"
                        placeholder="Answer"
                        value={captchaInput}
                        onChange={(e) => handleCaptchaChange(e.target.value)}
                      />
                      <button type="button" className="captcha-refresh" onClick={refreshCaptcha} title="New question">↻</button>
                      {captchaPassed && <span className="captcha-pass">✓</span>}
                    </div>
                    {captchaError && <p className="captcha-error">Please solve the captcha correctly to submit.</p>}
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
