import { Link } from "react-router-dom";
import Price from "../product/Price.jsx";
import Rating from "../product/Rating.jsx";
import { useCart } from "../../context/cart.js";
import { deals, productImage, productSrcSet } from "../../lib/catalog.js";
import { discountPercent, formatPrice } from "../../lib/format.js";
import { BagIcon } from "../ui/Icons.jsx";
import "./HotDeals.css";

export default function HotDeals() {
  const { add } = useCart();

  return (
    <section className="section container" id="deals" aria-labelledby="deals-title">
      <div className="section-head section-head--center">
        <p className="eyebrow">Limited time</p>
        <h2 id="deals-title" className="section-title">
          Hot deals
        </h2>
        <p className="section-sub">Our most-loved signatures at half price – while stocks last.</p>
      </div>

      <ul className="deals">
        {deals.map((p) => (
          <li key={p.id} className="deal">
            <Link to={`/product/${p.id}`} className="deal__media" tabIndex={-1} aria-hidden="true" draggable={false}>
              <img
                src={productImage(p, "sm")}
                srcSet={productSrcSet(p)}
                sizes="(min-width: 960px) 22vw, 40vw"
                alt=""
                width="560"
                height="560"
                loading="lazy"
                decoding="async"
              />
              <span className="badge badge--gold deal__badge">Save {discountPercent(p.price, p.compareAt)}%</span>
            </Link>
            <div className="deal__body">
              <Rating value={p.rating} />
              <h3 className="deal__name">
                <Link to={`/product/${p.id}`}>{p.name}</Link>
              </h3>
              <p className="deal__desc">{p.description}</p>
              <div className="deal__foot">
                <Price price={p.price} compareAt={p.compareAt} size="lg" />
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => add(p)}
                  aria-label={`Add ${p.name} to cart, ${formatPrice(p.price)}`}
                >
                  <BagIcon /> Add
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
