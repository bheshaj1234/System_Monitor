import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span className="dot"></span>
          SystemMonitor
        </div>

        <div className="nav-links">
          <span>Features</span>
          <span>Monitoring</span>
          <span>Product</span>
          <span>Company</span>
        </div>

        <div className="nav-buttons">
          <button className="login" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button className="start" onClick={() => navigate("/login")}>
            Get started free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="badge">🚀 Trusted by Developers</div>

        <h1>
          Meet the #1 <br />
          <span>uptime monitoring</span> service.
        </h1>

        <div className="features-row">
          <p>✔ 24/7 Monitoring</p>
          <p>✔ Real-time Alerts</p>
          <p>✔ Metrics Dashboard</p>
          <p>✔ Public Status Pages</p>
        </div>

        <button className="cta" onClick={() => navigate("/login")}>
          Start monitoring in 30 seconds
        </button>
      </section>

      {/* FEATURES SECTION */}
      <section className="feature-section">
        <h2>
          Catch downtime before your users do<span className="blue-dot">.</span>
        </h2>

        <div className="card-container">

          <div className="feature-card">
            <div className="icon">🌐</div>
            <h3>Website Monitoring</h3>
            <p>Monitor any HTTP(s) endpoint or page.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🔑</div>
            <h3>Keyword Monitoring</h3>
            <p>Get alerted if a keyword appears or disappears.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🎯</div>
            <h3>Ping Monitoring</h3>
            <p>Ensure your server is always available.</p>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq">
        <h2>
          Frequently asked questions<span className="blue-dot">.</span>
        </h2>

        <div className="faq-item">
          <h3>What is SystemMonitor?</h3>
          <p>
            SystemMonitor is a real-time uptime monitoring service that continuously
            checks your websites and APIs and alerts you instantly if something goes down.
          </p>
        </div>

        <div className="faq-item">
          <h3>What is an uptime monitor?</h3>
        </div>

        <div className="faq-item">
          <h3>How do I monitor my website?</h3>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <h3>SystemMonitor</h3>
          <p>Downtime happens. Get notified!</p>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Monitoring</h4>
            <p>Website Monitoring</p>
            <p>Ping Monitoring</p>
            <p>Port Monitoring</p>
            <p>API Monitoring</p>
          </div>

          <div>
            <h4>Product</h4>
            <p>Integrations</p>
            <p>API</p>
            <p>Status</p>
          </div>

          <div>
            <h4>Company</h4>
            <p>Contact</p>
            <p>Careers</p>
            <p>Privacy</p>
          </div>
        </div>
      </footer>

    </div>
  );
}