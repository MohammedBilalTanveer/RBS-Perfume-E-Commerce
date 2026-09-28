import HeroCarousel from "../components/home/HeroCarousel.jsx";
import Perks from "../components/home/Perks.jsx";
import CategoryTiles from "../components/home/CategoryTiles.jsx";
import ProductRow from "../components/home/ProductRow.jsx";
import HotDeals from "../components/home/HotDeals.jsx";
import BrandStory from "../components/home/BrandStory.jsx";
import Reviews from "../components/home/Reviews.jsx";
import { bestsellers, inCategory, sortProducts } from "../lib/catalog.js";
import { formatPrice } from "../lib/format.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";

const TOP_10 = bestsellers().slice(0, 10);
const FOR_HIM = bestsellers(inCategory("men")).slice(0, 14);
const FOR_HER = sortProducts(inCategory("women"), "rating").slice(0, 14);
const UNISEX = sortProducts(inCategory("unisex"), "rating").slice(0, 14);
const UNDER_100 = sortProducts(
  bestsellers().filter((p) => p.price < 100),
  "rating",
).slice(0, 14);

export default function Home() {
  useDocumentTitle();

  return (
    <>
      <h1 className="sr-only">RBS Perfumes – luxury fragrances for men, women and everyone</h1>
      <HeroCarousel />
      <Perks />
      <ProductRow ranked eyebrow="Trending now" title="Top 10 bestsellers this week" products={TOP_10} seeAllTo="/shop?sort=bestselling" />
      <CategoryTiles />
      <ProductRow eyebrow="For him" title="Bold & magnetic" products={FOR_HIM} seeAllTo="/shop/men" />
      <HotDeals />
      <ProductRow eyebrow="For her" title="Luminous florals & sweet notes" products={FOR_HER} seeAllTo="/shop/women" />
      <ProductRow eyebrow="Unisex" title="Signatures for everyone" products={UNISEX} seeAllTo="/shop/unisex" />
      <BrandStory />
      <ProductRow eyebrow="Great value" title={`Luxury under ${formatPrice(100)}`} products={UNDER_100} seeAllTo="/shop?sort=price-asc" />
      <Reviews />
    </>
  );
}
