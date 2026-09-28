import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard.jsx";
import NotFound from "./NotFound.jsx";
import products, { CATEGORIES, SORTS, asset, getCategory, inCategory, searchProducts, sortProducts } from "../lib/catalog.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { CloseIcon, SearchIcon } from "../components/ui/Icons.jsx";
import "./Shop.css";

const PAGE_SIZE = 24;
const GRID_SIZES = "(min-width: 1280px) 20vw, (min-width: 960px) 25vw, (min-width: 640px) 33vw, 50vw";

export default function Shop() {
  const { category } = useParams();
  const [params, setParams] = useSearchParams();
  const cat = category ? getCategory(category) : null;

  const q = params.get("q") ?? "";
  const sortParam = params.get("sort");
  const sort = SORTS.some((s) => s.id === sortParam) ? sortParam : "featured";

  // "Show more" resets whenever the filters change.
  const filterKey = `${category}|${q}|${sort}`;
  const [shown, setShown] = useState({ key: filterKey, count: PAGE_SIZE });
  const visible = shown.key === filterKey ? shown.count : PAGE_SIZE;

  const results = useMemo(() => {
    const base = inCategory(category);
    if (!q.trim()) return sortProducts(base, sort);
    const found = searchProducts(q, base);
    return sort === "featured" ? found : sortProducts(found, sort); // keep relevance order by default
  }, [category, q, sort]);

  useDocumentTitle(cat ? cat.heading : "Shop all perfumes");

  if (category && !cat) return <NotFound />;

  const updateParam = (key, value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value && !(key === "sort" && value === "featured")) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const search = params.toString() ? `?${params}` : "";

  return (
    <>
      <header className="shop-hero">
        <img
          className="shop-hero__img"
          src={asset(`${cat ? cat.image : "images/site/story"}.webp`)}
          alt=""
          style={cat ? { objectPosition: cat.focus } : undefined}
        />
        <div className="shop-hero__inner container">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumbs">
              <li>
                <Link to="/">Home</Link>
              </li>
              {cat ? (
                <>
                  <li>
                    <Link to="/shop">Shop</Link>
                  </li>
                  <li>
                    <span aria-current="page">{cat.label}</span>
                  </li>
                </>
              ) : (
                <li>
                  <span aria-current="page">Shop</span>
                </li>
              )}
            </ol>
          </nav>
          <p className="eyebrow">{cat ? cat.title : "The collection"}</p>
          <h1 className="page-title">{cat ? cat.heading : "All perfumes"}</h1>
          <p className="shop-hero__blurb">
            {cat
              ? cat.blurb
              : "Every RBS fragrance in one place – from smoky ouds and electric colognes to delicate florals."}
          </p>
        </div>
      </header>

      <div className="container">
        <div className="shop-toolbar">
          <nav className="shop-chips" aria-label="Collections">
            <Link to={{ pathname: "/shop", search }} className="chip" aria-current={!cat ? "page" : undefined}>
              All <span className="chip__count">{products.length}</span>
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={{ pathname: `/shop/${c.id}`, search }}
                className="chip"
                aria-current={cat?.id === c.id ? "page" : undefined}
              >
                {c.label} <span className="chip__count">{inCategory(c.id).length}</span>
              </Link>
            ))}
          </nav>

          <div className="shop-controls">
            <div className="shop-search">
              <SearchIcon className="shop-search__icon" />
              <input
                className="input"
                type="search"
                placeholder="Search this collection"
                aria-label="Search perfumes"
                value={q}
                onChange={(e) => updateParam("q", e.target.value)}
              />
              {q && (
                <button
                  type="button"
                  className="shop-search__clear"
                  aria-label="Clear search"
                  onClick={() => updateParam("q", "")}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
            <label className="sr-only" htmlFor="shop-sort">
              Sort by
            </label>
            <select id="shop-sort" className="select" value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="shop-count" aria-live="polite">
          {results.length} {results.length === 1 ? "perfume" : "perfumes"}
          {q.trim() && <> matching “{q.trim()}”</>}
        </p>

        {results.length > 0 ? (
          <>
            <ul className="product-grid">
              {results.slice(0, visible).map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} sizes={GRID_SIZES} />
                </li>
              ))}
            </ul>

            {visible < results.length && (
              <div className="shop-more">
                <p>
                  Showing {visible} of {results.length}
                </p>
                <div className="shop-more__bar" aria-hidden="true">
                  <span style={{ width: `${(visible / results.length) * 100}%` }} />
                </div>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShown({ key: filterKey, count: visible + PAGE_SIZE })}
                >
                  Show more
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-state__icon">
              <SearchIcon />
            </span>
            <h2>No perfumes found</h2>
            <p>
              Nothing in {cat ? cat.heading.toLowerCase() : "the collection"} matches “{q.trim()}”. Try another note
              such as oud, rose or citrus.
            </p>
            <button type="button" className="btn btn--ghost" onClick={() => updateParam("q", "")}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </>
  );
}
