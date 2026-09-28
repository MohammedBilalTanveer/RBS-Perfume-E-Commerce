import { Link, NavLink } from "react-router-dom";
import Dialog from "../ui/Dialog.jsx";
import Logo from "./Logo.jsx";
import { NAV_LINKS } from "./nav.js";
import { useAuth } from "../../context/auth.js";
import { useCart } from "../../context/cart.js";
import { CloseIcon } from "../ui/Icons.jsx";
import "./MobileMenu.css";

export default function MobileMenu({ open, onClose }) {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <Dialog open={open} onClose={onClose} className="drawer" label="Menu">
      <div className="drawer__panel">
        <div className="drawer__head">
          <Logo onClick={onClose} />
          <button type="button" className="icon-btn" aria-label="Close menu" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul className="drawer__nav">
            {NAV_LINKS.map((link, i) => (
              <li key={link.to} style={{ "--i": i }}>
                {link.hash ? (
                  <Link to={link.to} className="drawer__link" onClick={onClose}>
                    {link.label}
                  </Link>
                ) : (
                  <NavLink to={link.to} end={link.end} className="drawer__link" onClick={onClose}>
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
            <li style={{ "--i": NAV_LINKS.length }}>
              <NavLink to="/cart" className="drawer__link" onClick={onClose}>
                Cart {count > 0 && <span className="drawer__count">{count}</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="drawer__foot">
          {user ? (
            <>
              <p className="drawer__who">
                Signed in as <strong>{user.username}</strong>
              </p>
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn--primary btn--block" onClick={onClose}>
                Sign in
              </Link>
              <Link to="/signup" className="btn btn--ghost btn--block" onClick={onClose}>
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
