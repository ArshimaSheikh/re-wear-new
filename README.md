# RE:WEAR 2.0

A circular-fashion marketplace demo with RESELL, RE:EXCHANGE, RE:IMAGINE, RE:CREATE, RE:PAIR and RE:VERSIBLE.

## Stack
- React + Vite frontend
- Express REST API
- In-memory demo data (no database, authentication or payments)

## Run locally
Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. The API runs at http://localhost:5000.

For a production-style frontend build:

```bash
npm run build
```

Vite proxies /api to localhost:5000 during development.

## Demo behavior and limitations
- Listings, exchange requests, tailor requests and repair requests are held in server memory and reset when the server restarts.
- Image uploads are read as browser data URLs and sent to the API for the current demo session. They are not permanently stored.
- RE:IMAGINE uses predefined ideas by garment category. It does not use computer vision or generate new images.
- Tailor profiles and proposals are sample data to demonstrate the proposal-comparison flow.
- No real purchase, exchange fulfilment, tailoring booking, messaging, authentication or payments occur.
- For public deployment, host the Express API on a persistent Node service. A static frontend deployment alone will not run this in-memory Express server as written.

## API
- GET /api/health
- GET /api/listings
- POST /api/listings
- POST /api/exchange-requests
- GET /api/ideas?garment=Dress
- POST /api/tailor-requests
- POST /api/repairs
- GET /api/reversible

This project is separate from the original Re-Wear repository.
