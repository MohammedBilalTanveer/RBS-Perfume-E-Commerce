import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NotFound from "./NotFound.jsx";
import Price from "../components/product/Price.jsx";
import Rating from "../components/product/Rating.jsx";
import QuantityStepper from "../components/product/QuantityStepper.jsx";
import ProductRow from "../components/home/ProductRow.jsx";
import { useCart } from "../context/cart.js";
import { getCategory, getProduct, productImage, productSrcSet, relatedProducts } from "../lib/catalog.js";
import { discountPercent, formatPrice } from "../lib/format.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { BagIcon, ClockIcon, GiftIcon, ShieldIcon, TruckIcon } from "../components/ui/Icons.jsx";
import "./ProductPage.css";

// Keyed by id so quantity and zoom reset when moving between products.
export default function ProductPage() {
  const { id } = useParams();
  return <ProductDetail key={id} id={id} />;
}

function ProductDetail({ id }) {
  const product = getProduct(id);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const navigate = useNavigate();
  const zoomRef = useRef(null);

  useDocumentTitle(product?.name ?? "Perfume not found");

  if (!product) return <NotFound />;

  const category = getCategory(product.category);
  const off = discountPercent(product.price, product.compareAt);

  // Hover-zoom follows the pointer (mouse only).
  const onZoomMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const el = zoomRef.current;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const buyNow = () => {
    add(product, qty, { silent: true });
    navigate("/checkout");
  };

  return (
    <>
      <div className="pdp container">
        <nav aria-label="Breadcrumb" className="pdp__crumbs">
          <ol className="breadcrumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to={`/shop/${category.id}`}>{category.label}</Link>
            </li>
            <li>
              <span aria-current="page">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="pdp__grid">
          <div className="pdp__gallery">
            <div className="pdp__zoom" ref={zoomRef} onPointerMove={onZoomMove}>
              <img
                src={productImage(product)}
                srcSet={productSrcSet(product)}
                sizes="(min-width: 960px) 50vw, 100vw"
                alt={`${product.name} perfume bottle`}
                width="1400"
                height="1400"
                fetchPriority="high"
              />
            </div>
            <div className="pdp__badges">
              {product.deal && <span className="badge badge--gold">Hot deal</span>}
              {off > 0 && <span className="badge">−{off}%</span>}
            </div>
          </div>

          <div className="pdp__info">
            <p className="eyebrow">{category.title}</p>
            <h1 className="pdp__title">{product.name}</h1>
            <Rating value={product.rating} size="md">
              {product.rating}.0 {product.sold && <>· {product.sold} sold</>}
            </Rating>

            <div className="pdp__price">
              <Price price={product.price} compareAt={product.compareAt} size="lg" />
              {off > 0 && (
                <span className="badge badge--soft">You save {formatPrice(product.compareAt - product.price)}</span>
              )}
            </div>
            <p className="pdp__tax">Inclusive of all offers. GST calculated at checkout.</p>

            <p className="pdp__desc">{product.description}</p>

            <div className="pdp__buy">
              <QuantityStepper value={qty} onChange={setQty} />
              <button type="button" className="btn btn--primary pdp__add" onClick={() => add(product, qty)}>
                <BagIcon /> Add to cart · {formatPrice(product.price * qty)}
              </button>
            </div>
            <button type="button" className="btn btn--ghost btn--block" onClick={buyNow}>
              Buy it now
            </button>

            <ul className="pdp__perks">
              <li>
                <TruckIcon /> Free shipping on every order
              </li>
              <li>
                <ClockIcon /> Delivered within 2 working days
              </li>
              <li>
                <GiftIcon /> Gift-ready packaging
              </li>
              <li>
                <ShieldIcon /> Secure checkout
              </li>
            </ul>

            <div className="pdp__details">
              <details open>
                <summary>The {category.label.toLowerCase()} collection</summary>
                <p>
                  {category.blurb}{" "}
                  <Link to={`/shop/${category.id}`} className="pdp__link">
                    Browse all {category.heading.toLowerCase()}
                  </Link>
                </p>
              </details>
              <details>
                <summary>How to wear it</summary>
                <p>
                  Spray from about 15 cm onto pulse points – wrists, neck and behind the ears – after a shower when
                  skin is warm. Let it dry naturally rather than rubbing, so the top notes can open up.
                </p>
              </details>
              <details>
                <summary>Shipping &amp; delivery</summary>
                <p>
                  Orders are dispatched within 24 hours and delivered within 2 working days. Shipping is free on
                  every order.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <ProductRow
        eyebrow="You may also like"
        title={`More ${category.heading.toLowerCase()}`}
        products={relatedProducts(product)}
        seeAllTo={`/shop/${category.id}`}
      />
    </>
  );
}
