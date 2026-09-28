import { Link } from "react-router-dom";
import Rating from "../product/Rating.jsx";
import reviews from "../../data/reviews.js";
import { getProduct } from "../../lib/catalog.js";
import { formatDate } from "../../lib/format.js";
import "./Reviews.css";

export default function Reviews() {
  return (
    <section className="section container" id="reviews" aria-labelledby="reviews-title">
      <div className="section-head section-head--center">
        <p className="eyebrow">Loved by our customers</p>
        <h2 id="reviews-title" className="section-title">
          Our top reviews
        </h2>
      </div>

      <ul className="reviews">
        {reviews.map((r) => {
          const product = getProduct(r.productId);
          return (
            <li key={r.id} className="review">
              <Rating value={r.rating} size="md" />
              <blockquote className="review__text">“{r.text}”</blockquote>
              <div className="review__foot">
                <span className="review__avatar" aria-hidden="true">
                  {r.name[0]}
                </span>
                <div>
                  <p className="review__name">{r.name}</p>
                  <p className="review__meta">
                    {r.location} · <time dateTime={r.date}>{formatDate(r.date)}</time>
                  </p>
                  {product && (
                    <p className="review__product">
                      Reviewed <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
