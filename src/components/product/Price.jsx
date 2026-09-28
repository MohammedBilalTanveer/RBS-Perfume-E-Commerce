import { formatPrice } from "../../lib/format.js";
import "./Price.css";

export default function Price({ price, compareAt, size = "md" }) {
  const onSale = compareAt > price;
  return (
    <span className={`price price--${size}`}>
      <span className="price__now">
        {onSale && <span className="sr-only">Sale price </span>}
        {formatPrice(price)}
      </span>
      {onSale && (
        <s className="price__was">
          <span className="sr-only">Original price </span>
          {formatPrice(compareAt)}
        </s>
      )}
    </span>
  );
}
