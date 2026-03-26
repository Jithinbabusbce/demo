import { Link } from 'react-router-dom'
import '../App.css'

export default function LoginPage() {
  return (
    <div className="subpage login-page">
      <div className="subpage-hero login-hero">
        <h1>Login / Signup</h1>
        <p>Join Gully World to play, hire, and run events with your sports community.</p>
      </div>

      <div className="subpage-content">
        <div className="login-card">
          <h2>Welcome Back, Champion</h2>
          <p>Use your email or phone to continue.</p>
          <form onSubmit={(event) => event.preventDefault()}>
            <input className="form-input" type="text" placeholder="Email or Phone" />
            <input className="form-input" type="password" placeholder="Password" />
            <button className="card-action-btn" type="submit">Continue</button>
          </form>
          <p className="login-footnote">
            New user? <Link to="/pricing">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
