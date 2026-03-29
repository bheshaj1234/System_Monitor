import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (menu) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={`landing ${mounted ? 'visible' : ''}`}>
      
      {/* Animated Background Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo cursor-pointer" onClick={() => navigate("/")}>
          <span className="logo-icon">⚡</span>
          <span>System<span className="font-bold text-accent">Monitor</span></span>
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <div
            className="nav-item"
            onMouseEnter={() => setDropdown("features")}
            onMouseLeave={() => setDropdown(null)}
            onClick={() => toggleDropdown("features")}
          >
            Features
            <div className={`dropdown ${dropdown === "features" ? "open" : ""}`}>
              <p>Website Monitoring</p>
              <p>API Monitoring</p>
              <p>Ping Monitoring</p>
              <p>Status Pages</p>
            </div>
          </div>

          <div
            className="nav-item"
            onMouseEnter={() => setDropdown("solutions")}
            onMouseLeave={() => setDropdown(null)}
            onClick={() => toggleDropdown("solutions")}
          >
            Solutions
            <div className={`dropdown ${dropdown === "solutions" ? "open" : ""}`}>
              <p>Developers</p>
              <p>Startups</p>
              <p>DevOps Teams</p>
              <p>Enterprise</p>
            </div>
          </div>

          <div
            className="nav-item"
            onMouseEnter={() => setDropdown("pricing")}
            onMouseLeave={() => setDropdown(null)}
            onClick={() => toggleDropdown("pricing")}
          >
            Pricing
            <div className={`dropdown ${dropdown === "pricing" ? "open" : ""}`}>
              <p>Free Tier</p>
              <p>Pro Plan</p>
              <p>Enterprise Plan</p>
            </div>
          </div>

          {!menuOpen && (
            <div className="nav-buttons mobile-hide">
              <button className="btn-outline" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Get Started
              </button>
            </div>
          )}
          <div className="nav-buttons desktop-hide" style={{display: menuOpen ? "flex" : "none", flexDirection: "row", gap: "15px", marginTop: "20px", width: "100%", justifyContent: "center"}}>
              <button className="btn-outline" style={{width: "25%", minWidth: "100px"}} onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn-primary" style={{width: "25%", minWidth: "100px"}} onClick={() => navigate("/register")}>
                Signup
              </button>
          </div>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="badge animate-slide-up">
          <span className="pulse-dot"></span> Protected by Industry Leading Uptime
        </div>

        <h1 className="animate-slide-up delay-1">
          Monitor your architecture <br />
          <span className="gradient-text">before users notice downtime</span>
        </h1>

        <p className="hero-text animate-slide-up delay-2">
          SystemMonitor continuously checks your APIs, websites, and servers from around the globe so your team always knows when something goes offline.
        </p>

        <div className="features-row animate-slide-up delay-3">
          <p><span className="check">✔</span> 24/7 Monitoring</p>
          <p><span className="check">✔</span> Real-time Alerts</p>
          <p><span className="check">✔</span> Deep Analytics</p>
          <p><span className="check">✔</span> Public Status</p>
        </div>

        <div className="hero-actions animate-slide-up delay-4">
          <button className="btn-primary btn-large" onClick={() => navigate("/register")}>
            Start monitoring in 30s
            <div className="btn-glow"></div>
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feature-section">
        <h2>
          Catch downtime before your users do<span className="text-accent">.</span>
        </h2>

        <div className="card-container">
          <div className="feature-card">
            <div className="icon-container">
              <div className="icon">🌐</div>
              <div className="icon-glow"></div>
            </div>
            <h3>Website Integrity</h3>
            <p>Track uptime, certificates, and response times for any HTTP/HTTPS domain.</p>
          </div>

          <div className="feature-card delay-1">
            <div className="icon-container">
              <div className="icon">⚡</div>
              <div className="icon-glow"></div>
            </div>
            <h3>API Monitoring</h3>
            <p>Validate payloads and track response latency to ensure APIs remain completely healthy.</p>
          </div>

          <div className="feature-card delay-2">
            <div className="icon-container">
              <div className="icon">📡</div>
              <div className="icon-glow"></div>
            </div>
            <h3>Ping Operations</h3>
            <p>Ensure your servers stay reachable at the network level from different global nodes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <h2>
          Frequently asked questions<span className="text-accent">.</span>
        </h2>

        <div className="faq-container">
          {[
            { q: "What is SystemMonitor?", a: "SystemMonitor is a real-time uptime monitoring platform that continuously checks your services and alerts you instantly when downtime occurs via Webhooks, Email, or SMS." },
            { q: "How accurate is the uptime tracking?", a: "We run checks from decentralized edge nodes every minute, ensuring 99.99% accuracy in global downtime detection and latency measuring." },
            { q: "How do I get alerted?", a: "You can configure granular alerts to trigger instantly on failure, and set up escalations so the right person on your on-call team is notified immediately." }
          ].map((item, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
              <div className="faq-question">
                {item.q}
                <span className="toggle-icon">{openFaq === i ? "−" : "+"}</span>
              </div>
              <div className="faq-answer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-glow"></div>
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <span className="logo-icon">⚡</span>
              <span>System<span className="font-bold text-accent">Monitor</span></span>
            </div>
            <p>
              Enterprise-grade uptime monitoring for modern developers and distributed engineering teams.
            </p>
          </div>

          <div className="footer-links">
            <div>
              <h4>Monitoring</h4>
              <p>Websites</p>
              <p>REST APIs</p>
              <p>Servers / Ping</p>
              <p>Status Pages</p>
            </div>
            <div>
              <h4>Product</h4>
              <p>Integrations</p>
              <p>Developer API</p>
              <p>Uptime Reports</p>
            </div>
            <div>
              <h4>Company</h4>
              <p>About Us</p>
              <p>Changelog</p>
              <p>Privacy Policy</p>
              <p>Contact</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} SystemMonitor. Built for resilience.
        </div>
      </footer>
    </div>
  );
}