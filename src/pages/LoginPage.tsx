import { Link, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import '../App.css'

export default function LoginPage({ onLogin }: { onLogin?: (name: string) => void }) {
  const [contact, setContact] = useState('')
  const [provider, setProvider] = useState<'google' | 'facebook' | 'direct'>('direct')
  const [otpSent, setOtpSent] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState<'info' | 'success' | 'error'>('info')
  const navigate = useNavigate()

  function sendOtp() {
    if (!contact.trim()) {
      setStatusTone('error')
      setStatusMessage('Enter your email or phone to receive OTP.')
      return
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    setGeneratedOtp(otp)
    setOtpSent(true)
    setStatusTone('success')
    setStatusMessage(`OTP sent successfully. Demo OTP: ${otp}`)
  }

  function verifyOtp(event: FormEvent) {
    event.preventDefault()
    if (!otpSent) return

    if (!otpInput.trim()) {
      setStatusTone('error')
      setStatusMessage('Enter the OTP to continue.')
      return
    }

    if (otpInput !== generatedOtp) {
      setStatusTone('error')
      setStatusMessage('Invalid OTP. Please try again.')
      return
    }

    const base = contact.includes('@') ? contact.split('@')[0] : contact
    const cleanBase = base.trim() || 'Player'
    const prefix = provider === 'google' ? 'G' : provider === 'facebook' ? 'F' : ''
    const seedName = prefix ? `${prefix} ${cleanBase}` : cleanBase
    const name = seedName
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
    const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/[._-]/g, ' ')

    if (onLogin) {
      onLogin(displayName)
    }

    setStatusTone('success')
    setStatusMessage('Login successful. Redirecting...')
    navigate('/feed')
  }

  function chooseProvider(next: 'google' | 'facebook') {
    setProvider(next)
    setStatusTone('info')
    setStatusMessage(`Selected ${next === 'google' ? 'Gmail' : 'Facebook'} login. Enter email/phone and request OTP.`)
  }

  return (
    <div className="subpage login-page">
      <div className="subpage-content">
        <div className="login-card">
          <h2>Sign in</h2>
          <p>Choose a login method, get OTP, and continue.</p>

          <div className="login-auth-toggle" aria-label="Social login options">
            <button type="button" className={`social-login-btn${provider === 'google' ? ' selected' : ''}`} onClick={() => chooseProvider('google')}>
              <span className="social-icon google" aria-hidden="true">G</span>
              <span>Continue with Gmail</span>
            </button>
            <button type="button" className={`social-login-btn facebook${provider === 'facebook' ? ' selected' : ''}`} onClick={() => chooseProvider('facebook')}>
              <span className="social-icon facebook" aria-hidden="true">f</span>
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="login-or-divider">
            <span>or use email / phone</span>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (otpSent) {
                verifyOtp(event)
                return
              }
              sendOtp()
            }}
          >
            <input
              className="form-input"
              type="text"
              placeholder="Email or Phone"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            {otpSent ? (
              <>
                <input
                  className="form-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
                <div className="login-otp-row">
                  <button className="card-action-btn" type="submit" disabled={otpInput.length !== 6}>
                    Verify OTP & Continue
                  </button>
                  <button className="card-action-btn ghost" type="button" onClick={sendOtp}>
                    Resend OTP
                  </button>
                </div>
              </>
            ) : (
              <button className="card-action-btn" type="submit" disabled={!contact.trim()}>
                Send OTP
              </button>
            )}
          </form>

          {statusMessage ? (
            <p className={`login-status ${statusTone}`}>{statusMessage}</p>
          ) : null}

          <p className="login-footnote">
            New user? <Link to="/pricing">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
