import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "../ui/Dialog.jsx";
import Price from "../product/Price.jsx";
import { categoryLabel, productImage, searchProducts } from "../../lib/catalog.js";
import { ArrowRight, CloseIcon, SearchIcon } from "../ui/Icons.jsx";
import "./SearchOverlay.css";

const POPULAR = ["Oud", "Rose", "Vanilla", "Ocean", "Citrus", "Jasmine", "Saffron"];

export default function SearchOverlay({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} className="search" label="Search perfumes">
      <SearchPanel onClose={onClose} />
    </Dialog>
  );
}

function SearchPanel({ onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const q = query.trim();
  const matches = useMemo(() => (q ? searchProducts(q) : []), [q]);

  const seeAll = (e) => {
    e.preventDefault();
    if (!q) return;
    navigate(`/shop?q=${encodeURIComponent(q)}`);
    onClose();
  };

  return (
    <div className="search__panel">
      <form className="search__bar container" role="search" onSubmit={seeAll}>
        <SearchIcon className="search__icon" />
        <input
          className="search__input"
          type="search"
          placeholder="Search perfumes, notes or collections…"
          aria-label="Search perfumes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="button" className="icon-btn" aria-label="Close search" onClick={onClose}>
          <CloseIcon />
        </button>
      </form>

      <div className="search__body container">
        {!q && (
          <>
            <p className="eyebrow">Popular searches</p>
            <div className="search__chips">
              {POPULAR.map((term) => (
                <button key={term} type="button" className="chip" onClick={() => setQuery(term)}>
                  {term}
                </button>
              ))}
            </div>
          </>
        )}

        {q && matches.length > 0 && (
          <>
            <div className="search__meta">
              <p className="eyebrow">
                {matches.length} {matches.length === 1 ? "result" : "results"}
              </p>
              {matches.length > 6 && (
                <button type="button" className="link-arrow" onClick={seeAll}>
                  See all results <ArrowRight width="16" />
                </button>
              )}
            </div>
            <ul className="search__results">
              {matches.slice(0, 6).map((p) => (
                <li key={p.id}>
                  <Link to={`/product/${p.id}`} className="search__result" onClick={onClose}>
                    <img src={productImage(p, "sm")} alt="" width="64" height="64" loading="lazy" />
                    <span className="search__result-text">
                      <span className="search__result-name">{p.name}</span>
                      <span className="search__result-cat">{categoryLabel(p.category)}</span>
                    </span>
                    <Price price={p.price} compareAt={p.compareAt} size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {q && matches.length === 0 && (
          <p className="search__empty">
            No perfumes match “{q}”. Try a note like <em>oud</em>, <em>rose</em> or <em>citrus</em>.
          </p>
        )}
      </div>
    </div>
  );
}
