import { TAX_RATE } from "../../context/cart.js";
import { formatPrice } from "../../lib/format.js";
import "./OrderSummary.css";

/** Price breakdown shared by the cart, checkout and confirmation pages. */
export default function OrderSummary({ totals, title = "Order summary", children, footer }) {
  const { compareTotal, savings, subtotal, tax, total } = totals;

  return (
    <section className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title" className="summary__title">
        {title}
      </h2>
      {children}
      <dl className="summary__rows">
        {savings > 0 && (
          <>
            <div>
              <dt>Original price</dt>
              <dd>
                <s>{formatPrice(compareTotal)}</s>
              </dd>
            </div>
            <div className="summary__saving">
              <dt>Discount</dt>
              <dd>−{formatPrice(savings)}</dd>
            </div>
          </>
        )}
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>GST ({Math.round(TAX_RATE * 100)}%)</dt>
          <dd>{formatPrice(tax)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd className="summary__free">Free</dd>
        </div>
        <div className="summary__total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {savings > 0 && <p className="summary__note">You're saving {formatPrice(savings)} on this order.</p>}
      {footer}
    </section>
  );
}
