import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import OrderSummary from "../components/cart/OrderSummary.jsx";
import FormField from "../components/ui/FormField.jsx";
import { useCart } from "../context/cart.js";
import { asset, productImage } from "../lib/catalog.js";
import { formatPrice } from "../lib/format.js";
import { writeJSON } from "../lib/storage.js";
import { cardBrand, digitsOnly, formatCardNumber, formatExpiry, rules } from "../lib/validation.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { AlertIcon, BagIcon, ChevronDown, LockIcon } from "../components/ui/Icons.jsx";
import "./Checkout.css";

const CONTACT = ["name", "email", "phone"];
const DELIVERY = ["address", "city", "pincode"];
const CARD = ["cardName", "cardNumber", "expiry", "cvv"];

// Input tidy-ups applied as the user types.
const FORMAT = {
  pincode: (v) => digitsOnly(v).slice(0, 6),
  cardNumber: formatCardNumber,
  expiry: formatExpiry,
  cvv: (v) => digitsOnly(v).slice(0, 4),
};

const EMPTY = Object.fromEntries([...CONTACT, ...DELIVERY, ...CARD].map((k) => [k, ""]));

export const LAST_ORDER_KEY = "rbs.lastOrder";

const newOrderId = () => `RBS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [method, setMethod] = useState("card");
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false); // phones: summary starts collapsed
  useDocumentTitle("Checkout");

  // Nothing to check out (unless we're mid-way through placing the order).
  if (cart.lines.length === 0 && !placing) return <Navigate to="/cart" replace />;

  const activeFields = [...CONTACT, ...DELIVERY, ...(method === "card" ? CARD : [])];
  const errors = {};
  for (const key of activeFields) {
    const result = rules[key](values[key]);
    if (result !== true) errors[key] = result;
  }
  const visibleError = (key) => (touched[key] || submitted ? errors[key] : undefined);
  const brand = cardBrand(values.cardNumber);

  const field = (key, props) => ({
    id: `co-${key}`,
    name: key,
    value: values[key],
    error: visibleError(key),
    onChange: (e) => {
      const v = FORMAT[key] ? FORMAT[key](e.target.value) : e.target.value;
      setValues((prev) => ({ ...prev, [key]: v }));
    },
    onBlur: () => setTouched((prev) => ({ ...prev, [key]: true })),
    ...props,
  });

  const placeOrder = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = activeFields.find((k) => errors[k]);
    if (firstInvalid) {
      document.getElementById(`co-${firstInvalid}`)?.focus();
      return;
    }

    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1200)); // pretend to talk to a payment provider

    const order = {
      id: newOrderId(),
      placedAt: new Date().toISOString(),
      name: values.name.trim(),
      email: values.email.trim(),
      address: `${values.address.trim()}, ${values.city.trim()} ${values.pincode}`,
      payment:
        method === "card" ? `${brand ?? "Card"} ending ${digitsOnly(values.cardNumber).slice(-4)}` : "Cash on delivery",
      lines: cart.lines.map((l) => ({ id: l.id, name: l.product.name, qty: l.qty, total: l.total })),
      totals: {
        compareTotal: cart.compareTotal,
        savings: cart.savings,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
      },
    };

    // Card details are never stored – only the brand and last four digits above.
    writeJSON(LAST_ORDER_KEY, order, "session");
    navigate("/order-confirmed", { replace: true, state: { order } });
    cart.clear();
  };

  return (
    <div className="container checkout">
      <header className="page-head">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumbs">
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <span aria-current="page">Checkout</span>
            </li>
          </ol>
        </nav>
        <h1 className="page-title">Checkout</h1>
      </header>

      <div className="checkout__grid">
        <form className="checkout__form" onSubmit={placeOrder} noValidate>
          <fieldset className="co-step" disabled={placing}>
            <legend className="co-step__title">
              <span>1</span> Contact
            </legend>
            <div className="co-grid">
              <FormField {...field("name", { label: "Full name", autoComplete: "name" })} className="co-span-2" />
              <FormField
                {...field("email", { label: "Email", type: "email", autoComplete: "email", placeholder: "you@email.com" })}
              />
              <FormField
                {...field("phone", {
                  label: "Mobile number",
                  type: "tel",
                  inputMode: "tel",
                  autoComplete: "tel",
                  placeholder: "+91 98765 43210",
                })}
              />
            </div>
          </fieldset>

          <fieldset className="co-step" disabled={placing}>
            <legend className="co-step__title">
              <span>2</span> Delivery address
            </legend>
            <div className="co-grid">
              <FormField
                {...field("address", {
                  label: "Address",
                  autoComplete: "street-address",
                  placeholder: "House no., street, area",
                })}
                className="co-span-2"
              />
              <FormField {...field("city", { label: "City", autoComplete: "address-level2" })} className="co-half" />
              <FormField
                {...field("pincode", { label: "PIN code", inputMode: "numeric", autoComplete: "postal-code", placeholder: "560001" })}
                className="co-half"
              />
            </div>
          </fieldset>

          <fieldset className="co-step" disabled={placing}>
            <legend className="co-step__title">
              <span>3</span> Payment
            </legend>

            <div className="co-methods" role="radiogroup" aria-label="Payment method">
              <label className={`co-method${method === "card" ? " is-selected" : ""}`}>
                <input type="radio" name="method" value="card" checked={method === "card"} onChange={() => setMethod("card")} />
                <span>
                  <strong>Credit / debit card</strong>
                  <span>Visa, Mastercard</span>
                </span>
                <span className="co-method__logos">
                  <img src={asset("images/payments/visa.jpg")} alt="" width="40" height="26" />
                  <img src={asset("images/payments/mastercard.png")} alt="" width="40" height="26" />
                </span>
              </label>
              <label className={`co-method${method === "cod" ? " is-selected" : ""}`}>
                <input type="radio" name="method" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} />
                <span>
                  <strong>Cash on delivery</strong>
                  <span>Pay when your order arrives</span>
                </span>
              </label>
            </div>

            {method === "card" && (
              <>
                <p className="co-demo" role="note">
                  <AlertIcon />
                  <span>
                    <strong>Demo store – no payment is taken.</strong> Please don't enter real card details. Use the test
                    card <code>4242 4242 4242 4242</code> with any future date and any CVV.
                  </span>
                </p>
                <div className="co-grid">
                  <FormField {...field("cardName", { label: "Name on card", autoComplete: "off" })} className="co-span-2" />
                  <FormField
                    {...field("cardNumber", {
                      label: "Card number",
                      inputMode: "numeric",
                      autoComplete: "off",
                      placeholder: "1234 5678 9012 3456",
                      hint: brand ? `${brand} detected` : undefined,
                    })}
                    className="co-span-2"
                  />
                  <FormField
                    {...field("expiry", { label: "Expiry date", inputMode: "numeric", autoComplete: "off", placeholder: "MM/YY" })}
                    className="co-half"
                  />
                  <FormField
                    {...field("cvv", {
                      label: "CVV",
                      type: "password",
                      inputMode: "numeric",
                      autoComplete: "off",
                      placeholder: "•••",
                    })}
                    className="co-half"
                  />
                </div>
              </>
            )}
          </fieldset>

          {submitted && Object.keys(errors).length > 0 && (
            <p className="field__error co-summary-error" role="alert">
              <AlertIcon width="16" height="16" /> Please fix the highlighted fields to continue.
            </p>
          )}

          <button type="submit" className="btn btn--primary btn--block co-submit" disabled={placing}>
            {placing ? (
              <>
                <span className="spinner" /> Placing your order…
              </>
            ) : (
              <>
                <LockIcon /> Place order · {formatPrice(cart.total)}
              </>
            )}
          </button>
        </form>

        <aside className={`checkout__aside${summaryOpen ? " is-open" : ""}`}>
          <button
            type="button"
            className="co-toggle"
            aria-expanded={summaryOpen}
            aria-controls="co-summary"
            onClick={() => setSummaryOpen((o) => !o)}
          >
            <BagIcon />
            <span>Order summary</span>
            <ChevronDown className="co-toggle__chevron" />
            <strong>{formatPrice(cart.total)}</strong>
          </button>
          <div id="co-summary" className="co-summary-body">
            <OrderSummary totals={cart} title="Your order">
              <ul className="co-items">
                {cart.lines.map((l) => (
                  <li key={l.id}>
                    <span className="co-items__img">
                      <img src={productImage(l.product, "sm")} alt="" width="56" height="56" />
                      <span className="co-items__qty">{l.qty}</span>
                    </span>
                    <span className="co-items__name">{l.product.name}</span>
                    <span className="co-items__price">{formatPrice(l.total)}</span>
                  </li>
                ))}
              </ul>
            </OrderSummary>
          </div>
        </aside>
      </div>
    </div>
  );
}
