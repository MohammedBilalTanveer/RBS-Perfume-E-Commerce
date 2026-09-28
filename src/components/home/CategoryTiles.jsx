import { Link } from "react-router-dom";
import { CATEGORIES, asset, countByCategory } from "../../lib/catalog.js";
import { ArrowRight } from "../ui/Icons.jsx";
import "./CategoryTiles.css";

export default function CategoryTiles() {
  return (
    <section className="section container" id="categories" aria-labelledby="categories-title">
      <div className="section-head">
        <div>
          <p className="eyebrow">Shop by collection</p>
          <h2 id="categories-title" className="section-title">
            Find your signature
          </h2>
        </div>
        <Link to="/shop" className="link-arrow">
          All perfumes <ArrowRight width="16" />
        </Link>
      </div>

      <ul className="tiles">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Link to={`/shop/${c.id}`} className="tile">
              <img
                src={asset(`${c.image}.webp`)}
                srcSet={`${asset(`${c.image}-sm.webp`)} 560w, ${asset(`${c.image}.webp`)} 1400w`}
                sizes="(max-width: 559px) 78vw, (max-width: 820px) 46vw, 33vw"
                alt=""
                width="1400"
                height="1680"
                loading="lazy"
                decoding="async"
                style={{ objectPosition: c.focus }}
              />
              <span className="tile__shade" />
              <span className="tile__body">
                <span className="tile__count">{countByCategory(c.id)} fragrances</span>
                <span className="tile__title">{c.label}</span>
                <span className="tile__cta">
                  Shop {c.title.toLowerCase()} <ArrowRight width="16" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
