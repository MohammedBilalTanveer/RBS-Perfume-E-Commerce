import { Link, Navigate, useLocation } from "react-router-dom";
import OrderSummary from "../components/cart/OrderSummary.jsx";
import { LAST_ORDER_KEY } from "./Checkout.jsx";
import { getProduct, productImage } from "../lib/catalog.js";
import { formatDate, formatPrice } from "../lib/format.js";
import { readJSON } from "../lib/storage.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import "./OrderConfirmed.css";

export default function OrderConfirmed() {
  const { state } = useLocation();
  // Falls back to sessionStorage so a page refresh still shows the order.
  const order = state?.order ?? readJSON(LAST_ORDER_KEY, null, "session");
  useDocumentTitle("Order confirmed");

  if (!order) return <Navigate to="/" replace />;

  const firstName = order.name.split(" ")[0];

  return (
    <div className="container confirm">
      <div className="confirm__hero">
        <svg className="confirm__check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15.5 27.5l7 7 14-15" />
        </svg>
        <p className="eyebrow">Order {order.id}</p>
        <h1 className="page-title">Thank you, {firstName}!</h1>
        <p className="confirm__lead">
          Your order has been placed and will be delivered within <strong>2 working days</strong>.
        </p>
        <div className="confirm__actions">
          <Link to="/shop" className="btn btn--primary">
            Continue shopping
          </Link>
          <Link to="/" className="btn btn--ghost">
            Back to home
          </Link>
        </div>
      </div>

      <div className="confirm__grid">
        <dl className="confirm__details">
          <div>
            <dt>Order number</dt>
            <dd>{order.id}</dd>
          </div>
          <div>
            <dt>Order date</dt>
            <dd>{formatDate(order.placedAt)}</dd>
          </div>
          <div>
            <dt>Delivering to</dt>
            <dd>
              {order.name}
              <br />
              {order.address}
            </dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>{order.payment}</dd>
          </div>
        </dl>

        <OrderSummary totals={order.totals} title="Order details">
          <ul className="confirm__items">
            {order.lines.map((l) => {
              const product = getProduct(l.id);
              return (
                <li key={l.id}>
                  {product && <img src={productImage(product, "sm")} alt="" width="48" height="48" />}
                  <span className="confirm__item-name">
                    {l.name} <span>× {l.qty}</span>
                  </span>
                  <span>{formatPrice(l.total)}</span>
                </li>
              );
            })}
          </ul>
        </OrderSummary>
      </div>
    </div>
  );
}
