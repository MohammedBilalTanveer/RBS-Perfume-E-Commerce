// Change CURRENCY / LOCALE here to switch the whole store (e.g. "INR" / "en-IN").
const CURRENCY = "USD";
const LOCALE = "en-US";

const whole = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

const exact = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** $99 for whole amounts, $109.90 when there are cents. */
export function formatPrice(amount) {
  return Number.isInteger(amount) ? whole.format(amount) : exact.format(amount);
}

export function discountPercent(price, compareAt) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function roundMoney(n) {
  return Math.round(n * 100) / 100;
}
