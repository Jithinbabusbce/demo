import '../App.css'

export default function ContactPage() {
  return (
    <div className="subpage">
      <div className="subpage-hero contact-hero">
        <h1>Contact Us</h1>
        <p>Reach the Gully World Technology team for partnerships, events, hiring, and support.</p>
      </div>
      <div className="subpage-content">
        <div className="contact-grid">
          <div className="contact-info">
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
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your Name" className="form-input" />
              <input type="email" placeholder="Your Email" className="form-input" />
              <textarea placeholder="Your Message" className="form-input form-textarea" rows={5}></textarea>
              <button type="submit" className="card-action-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
