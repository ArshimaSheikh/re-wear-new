import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: "12mb" }));

// In-memory demo data: everything resets when the server restarts.
const store = {
  listings: [
    { id: "l1", title: "Ivory embroidered kurta", category: "Kurta", size: "M", condition: "Very good", price: 650, type: "resell", description: "Worn twice. Beautiful hand embroidery.", image: "", createdAt: new Date().toISOString() },
    { id: "l2", title: "Indigo straight-fit jeans", category: "Jeans", size: "28", condition: "Good", price: 0, type: "exchange", description: "Looking to exchange for a similar fit in size 29.", image: "", createdAt: new Date().toISOString() },
    { id: "l3", title: "Floral cotton summer dress", category: "Dress", size: "S", condition: "Like new", price: 900, type: "resell", description: "Lightweight cotton, perfect for summer.", image: "", createdAt: new Date().toISOString() }
  ],
  requests: [],
  proposals: [
    { id: "p1", tailor: "Mira's Studio", specialty: "Dresses & occasion wear", price: 1400, days: 7, note: "A co-ord set is feasible. I recommend keeping the original neckline detail.", rating: "4.9" },
    { id: "p2", tailor: "The Stitch Room", specialty: "Upcycling & alterations", price: 1100, days: 10, note: "Can create a skirt and a cropped top if the fabric length permits.", rating: "4.8" },
    { id: "p3", tailor: "Needle & Thread", specialty: "Contemporary tailoring", price: 1750, days: 6, note: "Can make a two-piece set with a concealed side zip.", rating: "4.9" }
  ],
  repairs: [],
  reversible: [
    { id: "v1", title: "Reversible everyday jacket", detail: "Two contrasting sides, one easy layer.", tag: "2 looks in 1", image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=700&q=85" },
    { id: "v2", title: "Convertible wrap skirt", detail: "Wear it as a skirt or style it as a beach cover-up.", tag: "Convertible", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=700&q=85" },
    { id: "v3", title: "Detachable-sleeve shirt", detail: "A full-sleeve shirt that transforms into a relaxed short-sleeve look.", tag: "Modular", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=700&q=85" }
  ]
};

const ideas = {
  Saree: [
    { title: "Contemporary co-ord set", description: "Use the border as a statement detail on the top and trousers.", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=85", difficulty: "Moderate" },
    { title: "Flowy midi dress", description: "Let the drape and print become the focus of a modern silhouette.", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=85", difficulty: "Moderate" },
    { title: "Statement skirt", description: "Create a versatile skirt while preserving the most beautiful section.", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=85", difficulty: "Easy" }
  ],
  Jeans: [
    { title: "Utility tote bag", description: "Turn sturdy denim panels into an everyday carry-all.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85", difficulty: "Easy" },
    { title: "Patchwork mini skirt", description: "Combine denim panels for a playful, textured skirt.", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=85", difficulty: "Moderate" },
    { title: "Denim corset top", description: "Reuse the strongest panels for a structured statement piece.", image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=85", difficulty: "Advanced" }
  ],
  Shirt: [
    { title: "Relaxed crop top", description: "Rework the body and sleeves into a fresh everyday silhouette.", image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=85", difficulty: "Easy" },
    { title: "Two-piece lounge set", description: "Pair a redesigned shirt with matching shorts.", image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=85", difficulty: "Moderate" },
    { title: "Patchwork tote", description: "Use buttons and fabric panels to create a practical accessory.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85", difficulty: "Easy" }
  ],
  Dress: [
    { title: "Chic co-ord set", description: "Split the dress into a top and a matching bottom.", image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=85", difficulty: "Moderate" },
    { title: "Short summer dress", description: "Refresh the length and shape while retaining its character.", image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=85", difficulty: "Easy" },
    { title: "Gathered skirt", description: "Turn the fabric into a skirt with a comfortable waistband.", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=85", difficulty: "Easy" }
  ],
  Other: [
    { title: "Everyday tote bag", description: "A practical way to give useful fabric a second life.", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85", difficulty: "Easy" },
    { title: "Layered skirt", description: "Create a new silhouette using the best available fabric panels.", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=85", difficulty: "Moderate" },
    { title: "Custom top", description: "A made-to-measure top designed around the fabric you have.", image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=85", difficulty: "Moderate" }
  ]
};

app.get("/api/health", (_req, res) => res.json({ ok: true, mode: "demo", message: "RE:WEAR demo API is running" }));
app.get("/api/listings", (_req, res) => res.json(store.listings));
app.post("/api/listings", (req, res) => {
  const { title, category, size, condition, price, type, description, image } = req.body || {};
  if (!title || !category || !type || !["resell", "exchange"].includes(type)) return res.status(400).json({ error: "Please complete the required listing details." });
  const item = { id: randomUUID(), title, category, size: size || "Not specified", condition: condition || "Good", price: Number(price) || 0, type, description: description || "", image: image || "", createdAt: new Date().toISOString() };
  store.listings.unshift(item);
  res.status(201).json(item);
});
app.post("/api/exchange-requests", (req, res) => {
  const { listingId, note } = req.body || {};
  const listing = store.listings.find(x => x.id === listingId && x.type === "exchange");
  if (!listing) return res.status(404).json({ error: "Exchange listing not found." });
  const request = { id: randomUUID(), listingId, note: note || "", status: "Request sent" };
  store.requests.push(request);
  res.status(201).json(request);
});
app.get("/api/ideas", (req, res) => {
  const garment = ideas[req.query.garment] ? req.query.garment : "Other";
  res.json({ garment, ideas: ideas[garment], disclaimer: "Concept suggestions only. A tailor must confirm fabric condition, measurements and feasibility." });
});
app.post("/api/tailor-requests", (req, res) => {
  const { garment, idea, image, inspiration, notes, source } = req.body || {};
  if (!garment || !idea) return res.status(400).json({ error: "Choose a garment type and a design idea first." });
  const request = { id: randomUUID(), garment, idea, image: image || "", inspiration: inspiration || "", notes: notes || "", source: source || "recreate", status: "Awaiting tailor proposals", createdAt: new Date().toISOString() };
  store.requests.push(request);
  res.status(201).json({ request, proposals: store.proposals });
});
app.post("/api/repairs", (req, res) => {
  const { garment, issue, image, notes } = req.body || {};
  if (!garment || !issue) return res.status(400).json({ error: "Please choose a garment and describe the repair." });
  const repair = { id: randomUUID(), garment, issue, image: image || "", notes: notes || "", status: "Repair request received", createdAt: new Date().toISOString() };
  store.repairs.unshift(repair);
  res.status(201).json({ repair, tailors: store.proposals.slice(0, 2).map(p => ({ ...p, price: Math.max(250, Math.round(p.price * 0.35)) })) });
});
app.get("/api/reversible", (_req, res) => res.json(store.reversible));
app.listen(PORT, () => console.log(`RE:WEAR demo API listening on ${PORT}`));