import { Link } from "react-router-dom";
import Price from "./Price.jsx";
import Rating from "./Rating.jsx";
import { useCart } from "../../context/cart.js";
import { categoryLabel, productImage, productSrcSet } from "../../lib/catalog.js";
import { discountPercent } from "../../lib/format.js";
import { BagIcon } from "../ui/Icons.jsx";
import "./ProductCard.css";

const DEFAULT_SIZES = "(min-width: 1280px) 20vw, (min-width: 960px) 25vw, (min-width: 640px) 33vw, 50vw";

export default function ProductCard({ product, sizes = DEFAULT_SIZES }) {
  const { add } = useCart();
  const off = discountPercent(product.price, product.compareAt);
  const href = `/product/${product.id}`;

  return (
    <article className="card">
      <div className="card__media">
        {/* The name link below is the accessible one; this image link is a mouse shortcut. */}
        <Link to={href} tabIndex={-1} aria-hidden="true" className="card__img-link" draggable={false}>
          <img
            src={productImage(product, "sm")}
            srcSet={productSrcSet(product)}
            sizes={sizes}
            alt=""
            width="560"
            height="560"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </Link>
        <div className="card__badges">
          {product.deal && <span className="badge badge--gold">Hot deal</span>}
          {off > 0 && <span className="badge">−{off}%</span>}
        </div>
        <button type="button" className="card__add" onClick={() => add(product)} aria-label={`Add ${product.name} to cart`}>
          <BagIcon />
          <span>Add to cart</span>
        </button>
      </div>

      <div className="card__body">
        <p className="card__cat">{categoryLabel(product.category)}</p>
        <h3 className="card__name">
          <Link to={href} draggable={false}>
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating}>{product.sold && `${product.sold} sold`}</Rating>
        <Price price={product.price} compareAt={product.compareAt} />
      </div>
    </article>
  );
}
