import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import AccountMenu from "./AccountMenu.jsx";
import MobileMenu from "./MobileMenu.jsx";
import SearchOverlay from "./SearchOverlay.jsx";
import { NAV_LINKS } from "./nav.js";
import { useCart } from "../../context/cart.js";
import useScrolled from "../../hooks/useScrolled.js";
import { BagIcon, MenuIcon, SearchIcon } from "../ui/Icons.jsx";
import "./Header.css";

/**
 * `overlay` = the page starts with a full-bleed hero (home page): the header is
 * transparent at the top and turns solid once the visitor scrolls, like Netflix.
 */
export default function Header({ overlay = false }) {
  const scrolled = useScrolled(32);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();

  // Press "/" anywhere to open search.
  useEffect(() => {
    const onKey = (e) => {
      const typing = e.target.closest?.("input, textarea, select, [contenteditable]");
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const solid = !overlay || scrolled;

  return (
    <>
      <header className={`header ${solid ? "header--solid" : "header--overlay"}`}>
        <div className="header__inner container">
          <div className="header__start">
            <button
              type="button"
              className="icon-btn header__menu-btn"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
            <Logo />
          </div>

          <nav className="header__nav" aria-label="Main">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  {link.hash ? (
                    <Link to={link.to} className="nav-link">
                      {link.label}
                    </Link>
                  ) : (
                    <NavLink to={link.to} end={link.end} className="nav-link">
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <button
              type="button"
              className="icon-btn"
              aria-label="Search (press /)"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <AccountMenu />
            <Link to="/cart" className="icon-btn cart-btn" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
              <BagIcon />
              {count > 0 && (
                <span key={count} className="cart-btn__badge" aria-hidden="true">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
