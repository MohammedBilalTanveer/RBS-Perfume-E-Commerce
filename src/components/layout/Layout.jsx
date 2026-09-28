import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";

  // New page → start at the top. Links like "/#deals" → scroll to that section.
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header overlay={isHome} />
      <main id="main" className={isHome ? "main main--flush" : "main"} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
