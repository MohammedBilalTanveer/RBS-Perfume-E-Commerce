import { Link } from "react-router-dom";
import products, { CATEGORIES, asset, averageRating } from "../../lib/catalog.js";
import "./BrandStory.css";

export default function BrandStory() {
  const stats = [
    { value: products.length, label: "Signature fragrances" },
    { value: CATEGORIES.length, label: "Curated collections" },
    { value: `${averageRating}★`, label: "Average rating" },
  ];

  return (
    <section className="story section container" aria-labelledby="story-title">
      <div className="story__media">
        <img src={asset("images/site/story.webp")} alt="A perfume bottle on a wooden deck beside a calm lake" width="1024" height="651" loading="lazy" decoding="async" />
      </div>
      <div className="story__copy">
        <p className="eyebrow">The art of scent</p>
        <h2 id="story-title" className="section-title">
          Fragrance that tells your story
        </h2>
        <p>
          Every RBS perfume starts with a place, a memory or a mood – a monsoon garden, a spice market at dusk,
          the ocean at first light. We layer rich top notes over deep, long-lasting bases so your scent evolves
          beautifully from morning to midnight.
        </p>
        <dl className="story__stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <Link to="/shop" className="btn btn--primary">
          Discover the collection
        </Link>
      </div>
    </section>
  );
}
