import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useToast } from "../../context/toast.js";
import { asset } from "../../lib/catalog.js";
import { ArrowRight, InstagramIcon } from "../ui/Icons.jsx";
import "./Footer.css";

const TEAM = [
  { name: "Raasiq", href: "https://www.instagram.com/raasiq.adeebkhan/" },
  { name: "Bilal", href: "https://www.instagram.com/bilaltanveer03" },
  { name: "Surakshith", href: "https://www.instagram.com/surakshith_sarathi/" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Footer() {
  return (
    <footer className="footer">
      <Newsletter />

      <div className="footer__main container">
        <div className="footer__brand">
          <Logo />
          <p>
            Long-lasting luxury fragrances for him, her and everyone – crafted to be remembered, priced to be
            enjoyed every day.
          </p>
        </div>

        <nav className="footer__col" aria-label="Shop">
          <h3>Shop</h3>
          <ul>
            <li><Link to="/shop">All perfumes</Link></li>
            <li><Link to="/shop/men">Men</Link></li>
            <li><Link to="/shop/women">Women</Link></li>
            <li><Link to="/shop/unisex">Unisex</Link></li>
            <li><Link to="/#deals">Hot deals</Link></li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Account">
          <h3>Account</h3>
          <ul>
            <li><Link to="/login">Sign in</Link></li>
            <li><Link to="/signup">Create account</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/#reviews">Reviews</Link></li>
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Contact the team">
          <h3>Contact us</h3>
          <ul>
            {TEAM.map((m) => (
              <li key={m.name}>
                <a href={m.href} target="_blank" rel="noreferrer" className="footer__social">
                  <InstagramIcon width="16" height="16" /> {m.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} RBS Perfumes. All rights reserved.</p>
        <div className="footer__pay" aria-label="Accepted payments">
          <img src={asset("images/payments/visa.jpg")} alt="Visa" width="46" height="30" />
          <img src={asset("images/payments/mastercard.png")} alt="Mastercard" width="46" height="30" />
        </div>
      </div>
    </footer>
  );
}

function Newsletter() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    toast.show({ title: "You're on the list!", message: "Watch your inbox for early access and offers." });
  };

  return (
    <section className="newsletter container" aria-labelledby="newsletter-title">
      <div className="newsletter__copy">
        <p className="eyebrow">The RBS Circle</p>
        <h2 id="newsletter-title">Early access to new scents &amp; members-only offers</h2>
      </div>
      <form className="newsletter__form" onSubmit={submit} noValidate>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <div className="newsletter__row">
          <input
            id="newsletter-email"
            className="input"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "newsletter-error" : undefined}
          />
          <button type="submit" className="btn btn--primary">
            Join <ArrowRight />
          </button>
        </div>
        {error && (
          <p id="newsletter-error" className="field__error">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
