# RBS Perfumes – React storefront

A React rebuild of the original HTML/CSS/JS perfume site (`cmr-mini-project`), with a dark, cinematic
"luxury + Netflix" look.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
npm run lint
```

## What's inside

| Page | Route | Highlights |
| --- | --- | --- |
| Home | `/` | Netflix-style hero carousel, Top 10 row with big numerals, horizontally scrolling product rows, hot deals, collections, reviews |
| Shop | `/shop`, `/shop/men`, `/shop/women`, `/shop/unisex` | Collection chips, live search, sorting, "show more" |
| Product | `/product/:id` | Hover zoom, quantity, add to cart / buy now, "you may also like" row |
| Cart | `/cart` | Quantity steppers, remove with undo, GST 10 % summary |
| Checkout | `/checkout` | Validated form, card formatting + Luhn check, cash on delivery |
| Order confirmed | `/order-confirmed` | Animated tick, order number and summary |
| Sign in / Sign up | `/login`, `/signup` | Demo accounts (see below) |

Also: search overlay (press <kbd>/</kbd>), mobile menu, toast notifications, 404 page, keyboard and
screen-reader support, and `prefers-reduced-motion` support.

### The hero carousel

`src/components/home/HeroCarousel.jsx` – slides one by one and loops forever (it clones the first and
last slide, then silently jumps back), autoplays with story-style progress bars, pauses when the tab is
hidden or with the pause button, supports swipe/drag and arrow keys. Edit the slides in
`src/data/slides.js`.

## Project structure

```
src/
  components/
    layout/    Header, Footer, MobileMenu, SearchOverlay, AccountMenu
    home/      HeroCarousel, ProductRow, HotDeals, CategoryTiles, Reviews, BrandStory, Perks
    product/   ProductCard, Price, Rating, QuantityStepper
    cart/      OrderSummary
    ui/        Icons, Dialog, Toaster, FormField, PasswordInput, AuthShell
  context/     Cart, Auth and Toast providers (+ their hooks)
  data/        products.js, slides.js, reviews.js
  lib/         catalog helpers, formatting, validation, storage
  pages/       one file per route
  styles/      global.css – design tokens, buttons, forms
public/images/ optimised WebP images
scripts/       optimize-images.mjs
```

## Changes from the original site

- **Data fixed:** the old JSON files re-used ids 1–30 across collections, which mixed up cart items;
  `unisexdata.json` contained copies of every men's and women's product; some sale prices were higher
  than the full price; some star image paths were broken. Everything now lives in one clean
  `src/data/products.js` (88 products, unique ids).
- **Images:** 2048 px / ~500 KB photos converted to WebP at 1400 px and 560 px (cards load ~30 KB each).
  To add new photos: `node scripts/optimize-images.mjs <folder-with-jpgs>`.
- **Reviews:** the celebrity names and photos were replaced with placeholder customers – swap in real
  reviews in `src/data/reviews.js`.
- **Hero slides:** the old banner images had AI-garbled text and a third-party logo baked in, so the
  carousel now uses the product photography with real text on top.

## Photo credits

The three collection tiles on the home page (`public/images/site/category-*.webp`) are free stock photos.
Neither licence requires credit, but it's appreciated:

| Tile | Photo | Licence |
| --- | --- | --- |
| Men | [Man spraying perfume on his neck](https://unsplash.com/photos/man-spraying-perfume-on-his-neck-Ut5czMy3Pe0) by Sasun Bughdaryan | [Unsplash License](https://unsplash.com/license) |
| Women | [Woman spraying perfume in black and white](https://www.pexels.com/photo/woman-spraying-perfume-in-black-and-white-17837242/) by Sandro Tavares | [Pexels License](https://www.pexels.com/license/) |
| Unisex | [Photo of perfume](https://www.pexels.com/photo/photo-of-perfume-3059609/) by RF._.studio | [Pexels License](https://www.pexels.com/license/) |

The crop of each tile is controlled by `focus` (a CSS `object-position`) in `CATEGORIES` in
`src/lib/catalog.js`. All product photography is your own.

## Demo-only features

This is a front-end project with no server:

- **Accounts** are stored in the browser's localStorage (passwords as SHA-256 hashes). Demo login:
  `cmr123` / `cmr@123`. The original `login.php` / `signup.php` can be connected by replacing `login`
  and `signup` in `src/context/AuthProvider.jsx` with `fetch()` calls.
- **Payments** are simulated. Use the test card `4242 4242 4242 4242`, any future date, any CVV. Card
  details are never stored.

## Settings you may want to change

- Currency: `src/lib/format.js` (`CURRENCY`, `LOCALE`)
- Tax rate: `src/context/cart.js` (`TAX_RATE`)
- Colours and fonts: the `:root` block in `src/styles/global.css`

## Deploying

The site uses client-side routing, so the host must serve `index.html` for every path.
`public/_redirects` (Netlify) and `vercel.json` (Vercel) are included.
