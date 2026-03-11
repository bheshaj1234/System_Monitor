import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Landing.css";

export default function Landing() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleDropdown = (menu) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="landing">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <span className="dot"></span>
          SystemMonitor
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>

          {/* FEATURES */}
          <div
            className="nav-item"
            onMouseEnter={() => setDropdown("features")}
            onMouseLeave={() => setDropdown(null)}
            onClick={() => toggleDropdown("features")}
          >
            Features
            {dropdown === "features" && (
              <div className="dropdown">
                <p>Website Monitoring</p>
                <p>API Monitoring</p>
                <p>Ping Monitoring</p>
                <p>Status Pages</p>
              </div>
            )}
          </div>

          {/* SOLUTIONS */}
          <div
            className="nav-item"
            onMouseEnter={() => setDropdown("solutions")}
            onMouseLeave={() => setDropdown(null)}
            onClick={() => toggleDropdown("solutions")}
          >
            Solutions
            {dropdown === "solutions" && (
              <div className="dropdown">
                <p>Developers</p>
                <p>Startups</p>
                <p>DevOps Teams</p>
                <p>Enterprise Teams</p>
              </div>
            )}
          </div>

          {/* ENTERPRISE */}
          <div
            className="nav-item"
            onMouseEnter={() => setDropdown("enterprise")}
            onMouseLeave={() => setDropdown(null)}
            onClick={() => toggleDropdown("enterprise")}
          >
            Enterprise
            {dropdown === "enterprise" && (
              <div className="dropdown">
                <p>Advanced Monitoring</p>
                <p>Custom Integrations</p>
                <p>Dedicated Support</p>
              </div>
            )}
          </div>

          {/* PRICING */}
          <div
            className="nav-item"
            onMouseEnter={() => setDropdown("pricing")}
            onMouseLeave={() => setDropdown(null)}
            onClick={() => toggleDropdown("pricing")}
          >
            Pricing
            {dropdown === "pricing" && (
              <div className="dropdown">
                <p>Free Plan</p>
                <p>Pro Plan</p>
                <p>Enterprise Plan</p>
              </div>
            )}
          </div>

        </div>

        <div className="nav-buttons">

          <button
            className="login"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>

          <button
            className="start"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

        </div>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

      </nav>

      {/* HERO */}

      <section className="hero">

        <div className="badge">
          🚀 Trusted by developers worldwide
        </div>

        <h1>
          Monitor your websites <br />
          <span>before users notice downtime</span>
        </h1>

        <p className="hero-text">
          SystemMonitor continuously checks your websites, APIs and servers
          so you always know when something goes wrong.
        </p>

        <div className="features-row">
          <p>✔ 24/7 Monitoring</p>
          <p>✔ Real-time Alerts</p>
          <p>✔ Performance Metrics</p>
          <p>✔ Public Status Pages</p>
        </div>

        <button
          className="cta"
          onClick={() => navigate("/login")}
        >
          Start monitoring in 30 seconds
        </button>

      </section>


      {/* FEATURES */}

      <section className="feature-section">

        <h2>
          Catch downtime before your users do
          <span className="blue-dot">.</span>
        </h2>

        <div className="card-container">

          <div className="feature-card">
            <div className="icon">🌐</div>
            <h3>Website Monitoring</h3>
            <p>Track uptime and response times for any HTTP or HTTPS website.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🔑</div>
            <h3>API Monitoring</h3>
            <p>Monitor APIs and endpoints to ensure they remain healthy.</p>
          </div>

          <div className="feature-card">
            <div className="icon">📡</div>
            <h3>Ping Monitoring</h3>
            <p>Ensure your servers stay reachable from different locations.</p>
          </div>

        </div>

      </section>


      {/* FAQ */}

      <section className="faq">

        <h2>
          Frequently asked questions
          <span className="blue-dot">.</span>
        </h2>

        <div className="faq-container">

          <div className="faq-item" onClick={() => toggleFaq(1)}>
            <div className="faq-question">
              What is SystemMonitor?
              <span>{openFaq === 1 ? "-" : "+"}</span>
            </div>

            {openFaq === 1 && (
              <p>
                SystemMonitor is a real-time uptime monitoring platform that
                continuously checks your services and alerts you instantly when downtime occurs.
              </p>
            )}
          </div>


          <div className="faq-item" onClick={() => toggleFaq(2)}>
            <div className="faq-question">
              How does uptime monitoring work?
              <span>{openFaq === 2 ? "-" : "+"}</span>
            </div>

            {openFaq === 2 && (
              <p>
                Our system sends requests to your service every minute
                and detects failures or slow responses instantly.
              </p>
            )}
          </div>


          <div className="faq-item" onClick={() => toggleFaq(3)}>
            <div className="faq-question">
              What alerts will I receive?
              <span>{openFaq === 3 ? "-" : "+"}</span>
            </div>

            {openFaq === 3 && (
              <p>
                You will receive alerts via email and integrations
                whenever downtime is detected.
              </p>
            )}
          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">
            <h3>SystemMonitor</h3>
            <p>
              Reliable uptime monitoring for modern developers and teams.
            </p>
          </div>

          <div className="footer-links">

            <div>
              <h4>Monitoring</h4>
              <p>Website Monitoring</p>
              <p>API Monitoring</p>
              <p>Ping Monitoring</p>
              <p>Status Pages</p>
            </div>

            <div>
              <h4>Product</h4>
              <p>Integrations</p>
              <p>API</p>
              <p>Incident Reports</p>
            </div>

            <div>
              <h4>Company</h4>
              <p>About</p>
              <p>Careers</p>
              <p>Privacy</p>
              <p>Contact</p>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} SystemMonitor. All rights reserved.
        </div>

      </footer>

    </div>
  );
}