# API

Base: `/api` · Response: `{ success, data? }` or `{ success: false, message }`  
Session: `amazon_session_id` cookie (axios `withCredentials: true`)

## Health

`GET /health` → `{ status, timestamp }`

## Products

`GET /products`

| Param | Notes |
|-------|-------|
| `search` | name/description |
| `categoryId` | filter |
| `cursor` | pagination |
| `limit` | max 50, default 20 |
| `sortBy` | `price_asc` \| `price_desc` \| `rating` \| `newest` |

`GET /products/:id` — full product with images + specs

## Categories

`GET /categories` — all categories

## Cart

All routes use session cookie.

| Method | Path | Body |
|--------|------|------|
| GET | `/cart` | — |
| POST | `/cart/items` | `{ productId, quantity }` |
| PUT | `/cart/items/:itemId` | `{ quantity }` |
| DELETE | `/cart/items/:itemId` | — |
| DELETE | `/cart` | clear |

## Orders

| Method | Path | Body |
|--------|------|------|
| GET | `/orders` | session orders |
| GET | `/orders/:id` | single order |
| POST | `/orders` | `{ shippingAddress, items? }` |

`items` optional — for Buy Now. Without it, order uses cart contents.

**Pricing:** subtotal + 8% tax + shipping (₹0 if subtotal ≥ ₹499, else ₹49). Stock decremented in a transaction; cart cleared after order.

## Shipping address shape

```json
{
  "fullName": "...",
  "street": "...",
  "city": "...",
  "state": "...",
  "zip": "...",
  "country": "...",
  "phone": "..."
}
```
