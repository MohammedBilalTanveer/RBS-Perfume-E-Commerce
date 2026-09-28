import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import slideData from "../../data/slides.js";
import Price from "../product/Price.jsx";
import Rating from "../product/Rating.jsx";
import { categoryLabel, getProduct, productImage } from "../../lib/catalog.js";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion.js";
import { ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "../ui/Icons.jsx";
import "./HeroCarousel.css";

const SLIDE_MS = 6500; // how long each slide stays on screen
const MOVE_MS = 800; // slide animation length
const SWIPE_PX = 50; // how far to drag before it counts as a swipe

const slides = slideData
  .map((s) => ({ ...s, product: getProduct(s.productId) }))
  .filter((s) => s.product);

const pad = (n) => String(n).padStart(2, "0");

/**
 * Netflix-style hero carousel.
 *
 * How the infinite loop works: the track is rendered as
 *   [copy of last] [slide 1] [slide 2] … [slide N] [copy of first]
 * and `pos` is the index in that track. Sliding past slide N lands on the copy
 * of slide 1; once the animation finishes we silently jump (no transition) to
 * the real slide 1, so it always slides forward and never rewinds.
 *
 * Autoplay is driven by the CSS progress-bar animation: when the bar finishes
 * filling, we go to the next slide. Pausing is just `animation-play-state`.
 */
export default function HeroCarousel() {
  const count = slides.length;
  const reduceMotion = usePrefersReducedMotion();

  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const suppressClick = useRef(false);

  const active = (((pos - 1) % count) + count) % count;
  const onClone = pos === 0 || pos === count + 1;
  const playing = !reduceMotion && !userPaused && !keyboardFocus && !tabHidden && !dragging;

  const go = useCallback(
    (target) => {
      if (onClone) return; // wait for the silent jump back to a real slide
      setAnimate(true);
      setPos(target);
    },
    [onClone],
  );

  // With reduced motion there is no animation, so wrap directly instead of using the copies.
  const next = useCallback(() => go(reduceMotion ? ((active + 1) % count) + 1 : pos + 1), [go, reduceMotion, active, count, pos]);
  const prev = useCallback(() => go(reduceMotion ? ((active - 1 + count) % count) + 1 : pos - 1), [go, reduceMotion, active, count, pos]);
  const goTo = (i) => i !== active && go(i + 1);

  // Landed on a copy → jump to the real slide without animating.
  useEffect(() => {
    if (!onClone) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setPos(pos === 0 ? count : 1);
    }, MOVE_MS);
    return () => clearTimeout(t);
  }, [onClone, pos, count]);

  // Turn the transition back on once the jump has been painted.
  useEffect(() => {
    if (animate) return;
    let inner;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate]);

  // Don't advance while the browser tab is in the background.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // ----- Swipe / drag -----
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    suppressClick.current = false;
    drag.current = { x: e.clientX, y: e.clientY, dx: 0, axis: null };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.axis && Math.abs(dx) + Math.abs(dy) > 8) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "x") {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Pointer already released – dragging still works without capture.
        }
        setDragging(true);
      }
    }
    if (d.axis === "x") {
      d.dx = dx;
      setDragX(dx);
    }
  };

  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.axis !== "x") return;
    suppressClick.current = Math.abs(d.dx) > 6;
    setDragging(false);
    setDragX(0);
    if (d.dx <= -SWIPE_PX) next();
    else if (d.dx >= SWIPE_PX) prev();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  if (!count) return null;

  const track = [
    { slide: slides[count - 1], index: count - 1, clone: true },
    ...slides.map((slide, index) => ({ slide, index, clone: false })),
    { slide: slides[0], index: 0, clone: true },
  ];

  const moving = animate && !dragging && !reduceMotion;

  return (
    <section
      className={`hero ${dragging ? "hero--dragging" : ""}`}
      aria-roledescription="carousel"
      aria-label="Featured fragrances"
      onKeyDown={onKeyDown}
      onFocus={(e) => e.target.matches?.(":focus-visible") && setKeyboardFocus(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setKeyboardFocus(false)}
    >
      <div
        className="hero__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
            suppressClick.current = false;
          }
        }}
      >
        <div
          className="hero__track"
          style={{
            transform: `translate3d(calc(${-pos * 100}% + ${dragX}px), 0, 0)`,
            transition: moving ? `transform ${MOVE_MS}ms var(--ease)` : "none",
          }}
        >
          {track.map(({ slide, index, clone }, i) => (
            <HeroSlide
              key={clone ? `clone-${i}` : slide.productId}
              slide={slide}
              index={index}
              count={count}
              current={index === active}
              hidden={clone || index !== active}
              priority={!clone && index === 0}
            />
          ))}
        </div>
      </div>

      <div className="hero__controls container">
        <p className="hero__counter" aria-hidden="true">
          <span>{pad(active + 1)}</span> / {pad(count)}
        </p>

        <div className="hero__segments">
          {slides.map((s, i) => (
            <button
              key={s.productId}
              type="button"
              className={`hero__seg${i === active ? " is-active" : ""}${i < active ? " is-done" : ""}`}
              aria-label={`Show slide ${i + 1}: ${s.product.name}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
            >
              <span
                className="hero__seg-fill"
                style={
                  i === active && !reduceMotion
                    ? { animationDuration: `${SLIDE_MS}ms`, animationPlayState: playing ? "running" : "paused" }
                    : undefined
                }
                onAnimationEnd={
                  i === active && playing ? (e) => e.animationName === "hero-progress" && next() : undefined
                }
              />
            </button>
          ))}
        </div>

        <div className="hero__buttons">
          {!reduceMotion && (
            <button
              type="button"
              className="hero__btn"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {userPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
          <button type="button" className="hero__btn" onClick={prev} aria-label="Previous slide">
            <ChevronLeft />
          </button>
          <button type="button" className="hero__btn" onClick={next} aria-label="Next slide">
            <ChevronRight />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        Slide {active + 1} of {count}: {slides[active].product.name}
      </p>
    </section>
  );
}

function HeroSlide({ slide, index, count, current, hidden, priority }) {
  const { product } = slide;
  const category = categoryLabel(product.category);

  return (
    <div
      className={`hero__slide${current ? " is-current" : ""}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      aria-hidden={hidden || undefined}
      inert={hidden}
    >
      <div className="hero__ambient" style={{ backgroundImage: `url(${productImage(product, "sm")})` }} />
      <img
        className="hero__img"
        src={productImage(product)}
        alt=""
        width="1400"
        height="1400"
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        draggable={false}
        style={slide.focus ? { objectPosition: slide.focus } : undefined}
      />
      <div className="hero__shade" />

      <div className="hero__content container">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">{slide.eyebrow}</p>
          <h2 className="hero__title">{product.name}</h2>
          <div className="hero__meta">
            <Rating value={product.rating} />
            <span className="hero__dot" />
            <span>{category}</span>
            <span className="hero__dot" />
            <Price price={product.price} compareAt={product.compareAt} />
          </div>
          <p className="hero__tagline">{slide.tagline}</p>
          <div className="hero__actions">
            <Link to={`/product/${product.id}`} className="btn btn--light" draggable={false}>
              Shop now
            </Link>
            <Link to={`/shop/${product.category}`} className="btn btn--glass" draggable={false}>
              Explore {category}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
