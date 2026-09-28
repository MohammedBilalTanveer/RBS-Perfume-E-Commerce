import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard.jsx";
import Price from "../product/Price.jsx";
import { productImage, productSrcSet } from "../../lib/catalog.js";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";
import { ArrowRight, ChevronLeft, ChevronRight } from "../ui/Icons.jsx";
import "./ProductRow.css";

/**
 * A Netflix-style row: a horizontally scrolling strip of products with
 * arrow buttons on the edges. Touch users simply swipe (native scrolling
 * with scroll-snap), mouse users get the arrows on hover.
 *
 * `ranked` renders the "Top 10" look with large numerals beside each poster.
 */
export default function ProductRow({ title, eyebrow, products, seeAllTo, ranked = false }) {
  const headingId = useId();
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const reduceMotion = usePrefersReducedMotion();

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByPage = (direction) => {
    const el = trackRef.current;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: reduceMotion ? "auto" : "smooth" });
  };

  if (!products.length) return null;

  return (
    <section className={`row${ranked ? " row--ranked" : ""}`} aria-labelledby={headingId}>
      <div className="row__head container">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={headingId} className="row__title">
            {title}
          </h2>
        </div>
        {seeAllTo && (
          <Link to={seeAllTo} className="link-arrow">
            See all <ArrowRight width="16" />
          </Link>
        )}
      </div>

      <div className="row__frame">
        <button
          type="button"
          className="row__nav row__nav--prev"
          onClick={() => scrollByPage(-1)}
          hidden={edges.start}
          aria-label={`Scroll ${title} back`}
        >
          <ChevronLeft />
        </button>

        <ul className="row__track" ref={trackRef} onScroll={updateEdges}>
          {products.map((product, i) => (
            <li key={product.id} className="row__item">
              {ranked ? <RankedCard product={product} rank={i + 1} /> : <ProductCard product={product} />}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="row__nav row__nav--next"
          onClick={() => scrollByPage(1)}
          hidden={edges.end}
          aria-label={`Scroll ${title} forward`}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

function RankedCard({ product, rank }) {
  return (
    <Link to={`/product/${product.id}`} className="ranked" draggable={false}>
      <span className={`ranked__num${rank >= 10 ? " ranked__num--wide" : ""}`} aria-hidden="true">
        {rank}
      </span>
      <span className="ranked__poster">
        <span className="ranked__media">
          <img
            src={productImage(product, "sm")}
            srcSet={productSrcSet(product)}
            sizes="(min-width: 960px) 16vw, 30vw"
            alt=""
            width="560"
            height="560"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </span>
        <span className="ranked__info">
          <span className="sr-only">Number {rank}: </span>
          <span className="ranked__name">{product.name}</span>
          <Price price={product.price} compareAt={product.compareAt} size="sm" />
        </span>
      </span>
    </Link>
  );
}
