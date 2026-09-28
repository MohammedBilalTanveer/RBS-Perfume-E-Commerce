import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderSummary from "../components/cart/OrderSummary.jsx";
import QuantityStepper from "../components/product/QuantityStepper.jsx";
import ProductRow from "../components/home/ProductRow.jsx";
import { useCart } from "../context/cart.js";
import { useToast } from "../context/toast.js";
import { bestsellers, categoryLabel, productImage } from "../lib/catalog.js";
import { formatPrice } from "../lib/format.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { ArrowRight, BagIcon, LockIcon, TrashIcon } from "../components/ui/Icons.jsx";
import "./Cart.css";

const SUGGESTIONS = bestsellers().slice(0, 12);

export default function Cart() {
  const cart = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  useDocumentTitle("Your cart");

  // Phones: a sticky "Total · Checkout" bar until the real checkout button scrolls into view.
  const checkoutRef = useRef(null);
  const [showBar, setShowBar] = useState(false);
  const hasItems = cart.lines.length > 0;
  useEffect(() => {
    const el = checkoutRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top > 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasItems]);

  const removeLine = (line) => {
    const snapshot = cart.items;
    cart.remove(line.id);
    toast.show({
      title: `${line.product.name} removed`,
      image: productImage(line.product, "sm"),
      action: { label: "Undo", onClick: () => cart.restore(snapshot) },
    });
  };

  const clearAll = () => {
    const snapshot = cart.items;
    cart.clear();
    toast.show({ title: "Cart cleared", action: { label: "Undo", onClick: () => cart.restore(snapshot) } });
  };

  if (cart.lines.length === 0) {
    return (
      <>
        <div className="container">
          <div className="empty-state">
            <span className="empty-state__icon">
              <BagIcon />
            </span>
            <h1 className="page-title">Your cart is empty</h1>
            <p>Looks like you haven't found your signature scent yet. Our bestsellers are a great place to start.</p>
            <Link to="/shop" className="btn btn--primary">
              Explore perfumes <ArrowRight />
            </Link>
          </div>
        </div>
        <ProductRow eyebrow="Popular right now" title="Bestsellers" products={SUGGESTIONS} seeAllTo="/shop?sort=bestselling" />
      </>
    );
  }

  return (
    <div className="container cart">
      <header className="page-head cart__head">
        <div>
          <h1 className="page-title">Shopping cart</h1>
          <p className="muted">
            {cart.count} {cart.count === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="cart__head-actions">
          <Link to="/shop" className="btn btn--text">
            ← Continue shopping
          </Link>
          <button type="button" className="btn btn--text" onClick={clearAll}>
            Clear cart
          </button>
        </div>
      </header>

      <div className="cart__grid">
        <ul className="cart__lines">
          {cart.lines.map((line) => {
            const p = line.product;
            return (
              <li key={line.id} className="line">
                <Link to={`/product/${p.id}`} className="line__img" tabIndex={-1} aria-hidden="true">
                  <img src={productImage(p, "sm")} alt="" width="120" height="120" loading="lazy" />
                </Link>
                <div className="line__info">
                  <p className="line__cat">{categoryLabel(p.category)}</p>
                  <h2 className="line__name">
                    <Link to={`/product/${p.id}`}>{p.name}</Link>
                  </h2>
                  <p className="line__unit">
                    {formatPrice(p.price)}
                    {p.compareAt > p.price && <s>{formatPrice(p.compareAt)}</s>}
                    <span> each</span>
                  </p>
                </div>
                <div className="line__controls">
                  <QuantityStepper
                    size="sm"
                    value={line.qty}
                    min={0}
                    label={`Quantity of ${p.name}`}
                    onChange={(qty) => (qty === 0 ? removeLine(line) : cart.setQty(line.id, qty))}
                  />
                  <button
                    type="button"
                    className="line__remove"
                    onClick={() => removeLine(line)}
                    aria-label={`Remove ${p.name} from cart`}
                  >
                    <TrashIcon />
                  </button>
                </div>
                <p className="line__total">
                  {formatPrice(line.total)}
                  {line.compareTotal > line.total && <s>{formatPrice(line.compareTotal)}</s>}
                </p>
              </li>
            );
          })}
        </ul>

        <aside className="cart__aside">
          <OrderSummary
            totals={cart}
            footer={
              <>
                <button
                  type="button"
                  className="btn btn--primary btn--block"
                  ref={checkoutRef}
                  onClick={() => navigate("/checkout")}
                >
                  <LockIcon /> Proceed to checkout
                </button>
                <p className="cart__secure">Free shipping · Delivered within 2 working days</p>
              </>
            }
          />
        </aside>
      </div>

      <div className={`cart-bar${showBar ? " is-visible" : ""}`} inert={!showBar}>
        <div className="cart-bar__total">
          <span>
            Total · {cart.count} {cart.count === 1 ? "item" : "items"}
          </span>
          <strong>{formatPrice(cart.total)}</strong>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => navigate("/checkout")}>
          <LockIcon /> Checkout
        </button>
      </div>
    </div>
  );
}
