import products from "../data/products.js";

const BASE = import.meta.env.BASE_URL;

/** Build a URL for a file in /public, respecting Vite's `base` option. */
export const asset = (path) => `${BASE}${path.replace(/^\//, "")}`;

export const CATEGORIES = [
  {
    id: "men",
    label: "Men",
    title: "For Him",
    heading: "Men’s perfumes",
    blurb: "Bold woods, smoky leather and electric freshness – statement scents made to be noticed.",
    image: "images/site/category-men",
    focus: "62% 45%", // object-position: keeps the hand and bottle in frame
  },
  {
    id: "women",
    label: "Women",
    title: "For Her",
    heading: "Women’s perfumes",
    blurb: "Luminous florals, ripe fruits and warm spice – elegant fragrances that linger all day.",
    image: "images/site/category-women",
    focus: "40% 30%",
  },
  {
    id: "unisex",
    label: "Unisex",
    title: "For Everyone",
    heading: "Unisex perfumes",
    blurb: "Oud, ocean air and soft musks – signature scents that belong to no one and everyone.",
    image: "images/site/category-unisex",
    focus: "55% 100%", // bottle sits above the tile's text
  },
];

const byId = new Map(products.map((p) => [p.id, p]));

export const getProduct = (id) => byId.get(id);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
export const categoryLabel = (id) => getCategory(id)?.label ?? id;
export const countByCategory = (id) => products.filter((p) => p.category === id).length;

export function productImage(product, size = "lg") {
  return asset(`images/products/${product.image}${size === "sm" ? "-sm" : ""}.webp`);
}

export function productSrcSet(product) {
  return `${productImage(product, "sm")} 560w, ${productImage(product)} 1400w`;
}

export const deals = products.filter((p) => p.deal);

export function bestsellers(list = products) {
  return [...list].sort((a, b) => b.soldCount - a.soldCount);
}

export function inCategory(category, list = products) {
  return category ? list.filter((p) => p.category === category) : list;
}

/** Catalog order, but with categories interleaved so "All" isn't grouped. */
function featured(list) {
  const groups = CATEGORIES.map((c) => list.filter((p) => p.category === c.id));
  const out = [];
  for (let i = 0; out.length < list.length; i++) {
    for (const g of groups) if (g[i]) out.push(g[i]);
  }
  return out;
}

export const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "bestselling", label: "Bestselling" },
  { id: "rating", label: "Top rated" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "savings", label: "Biggest savings" },
];

export function sortProducts(list, sort) {
  const sorted = [...list];
  switch (sort) {
    case "bestselling":
      return bestsellers(sorted);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.soldCount - a.soldCount);
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "savings":
      return sorted.sort((a, b) => b.compareAt - b.price - (a.compareAt - a.price));
    default:
      return featured(sorted);
  }
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Simple ranked search: every word must match the start of a word in the
 * name, collection or description ("ros" finds "rose", "men" doesn't find
 * "women"). Name matches rank highest.
 */
export function searchProducts(query, list = products) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  const patterns = words.map((w) => new RegExp(`\\b${escapeRegExp(w)}`));

  return list
    .map((p) => {
      const name = p.name.toLowerCase();
      const haystack = `${name} ${categoryLabel(p.category).toLowerCase()} ${p.description.toLowerCase()}`;
      if (!patterns.every((re) => re.test(haystack))) return null;
      const score = patterns.reduce((s, re, i) => s + (name.startsWith(words[i]) ? 3 : re.test(name) ? 2 : 0), 0);
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || b.p.soldCount - a.p.soldCount)
    .map((r) => r.p);
}

export function relatedProducts(product, limit = 12) {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => b.rating - a.rating || b.soldCount - a.soldCount)
    .slice(0, limit);
}

export const averageRating =
  Math.round((products.reduce((s, p) => s + p.rating, 0) / products.length) * 10) / 10;

export default products;
