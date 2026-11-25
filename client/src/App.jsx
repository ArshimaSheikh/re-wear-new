import React, { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, Leaf, Menu, Plus, Scissors, Search, Shirt, Sparkles, Sprout, X } from "lucide-react";

const API = "/api";
const fallback = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85";
const DEMO_PROPOSALS = [
  {id:"tailor-1",tailor:"Mira's Studio",specialty:"Dresses & occasion wear",price:1400,days:7,note:"A co-ord set is feasible. We recommend keeping the original neckline detail.",rating:"4.9"},
  {id:"tailor-2",tailor:"The Stitch Room",specialty:"Upcycling & alterations",price:1100,days:10,note:"Can create a skirt and cropped top if the fabric length permits.",rating:"4.8"},
  {id:"tailor-3",tailor:"Needle & Thread",specialty:"Contemporary tailoring",price:1750,days:6,note:"Can make a two-piece set with a concealed side zip.",rating:"4.9"}
];
let demoListings = [];
let demoRequests = [];
async function api(path, options = {}) {
  const method = options.method || "GET";
  const body = options.body ? JSON.parse(options.body) : {};
  await new Promise(resolve => setTimeout(resolve, 250));
  if (path === "/listings" && method === "GET") return [...demoListings];
  if (path === "/reversible" && method === "GET") return [...DEMO_REVERSIBLE];
  if (path.startsWith("/ideas") && method === "GET") {
    const garment = new URLSearchParams(path.split("?")[1] || "").get("garment") || "Other";
    return {garment,ideas:DEMO_IDEAS[garment] || DEMO_IDEAS.Other};
  }
  if (path === "/listings" && method === "POST") {
    if (!body.title?.trim()) throw new Error("Please add a title for your item.");
    const item = {...body,id:"user-"+Date.now(),createdAt:new Date().toISOString()};
    demoListings = [item,...demoListings];
    return item;
  }
  if (path === "/exchange-requests" && method === "POST") {
    const listing = demoListings.find(item => item.id === body.listingId && item.type === "exchange");
    if (!listing) throw new Error("This swap listing is no longer available.");
    const request = {id:"swap-"+Date.now(),listingId:listing.id,title:listing.title,status:"Swap request sent"};
    demoRequests.push(request);
    return request;
  }
  if (path === "/tailor-requests" && method === "POST") {
    if (!body.idea) throw new Error("Choose a design idea first.");
    const request = {...body,id:"create-"+Date.now(),status:"Awaiting tailor proposals"};
    demoRequests.push(request);
    return {request,proposals:DEMO_PROPOSALS};
  }
  if (path === "/repairs" && method === "POST") {
    if (!body.garment || !body.issue) throw new Error("Please choose a garment and describe the repair.");
    const repair = {...body,id:"repair-"+Date.now(),status:"Repair request received"};
    demoRequests.push(repair);
    return {repair,tailors:DEMO_PROPOSALS.slice(0,2).map(p=>({...p,price:Math.max(250,Math.round(p.price*.35))}))};
  }
  throw new Error("This demo action is not available yet.");
}
function fileToData(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    if (file.size > 5 * 1024 * 1024) return reject(new Error("Please use an image under 5 MB."));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}
function ImageUpload({ label, value, onChange }) {
  return <label className="upload"><input type="file" accept="image/*" onChange={async e => { try { onChange(await fileToData(e.target.files?.[0])); } catch (err) { alert(err.message); } }} />{value ? <img src={value} alt="Your upload" /> : <><span className="upload-icon"><Plus size={20}/></span><strong>{label}</strong><small>JPG or PNG · max 5 MB</small></>}</label>;
}
const nav = ["Discover", "RESELL", "RE:EXCHANGE", "RE:IMAGINE", "RE:CREATE", "RE:PAIR", "RE:VERSIBLE"];

const DEMO_LISTINGS=[
{id:"d1",title:"Sage linen co-ord set",category:"Co-ord",size:"M",condition:"Like new",price:1250,type:"resell",image:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=85"},
{id:"d2",title:"Indigo straight-fit jeans",category:"Jeans",size:"28",condition:"Very good",price:850,type:"resell",image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85"},
{id:"d3",title:"Printed cotton kurta",category:"Kurta",size:"M",condition:"Good",price:650,type:"resell",image:"https://images.unsplash.com/photo-1583391733956-6c78276477e3?w=900&q=85"},
{id:"d4",title:"Ivory occasion saree",category:"Saree",size:"Free",condition:"Very good",price:0,type:"exchange",image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85"},
{id:"d5",title:"Classic denim jacket",category:"Jacket",size:"L",condition:"Very good",price:1450,type:"resell",image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85"},
{id:"d6",title:"Floral summer dress",category:"Dress",size:"S",condition:"Like new",price:990,type:"exchange",image:"https://images.unsplash.com/photo-1495385794356-15371f348c31?w=900&q=85"}];
demoListings = [...DEMO_LISTINGS];
const DEMO_REVERSIBLE=[
{id:"rv1",title:"Reversible everyday jacket",tag:"2 SIDES · 2 MOODS",detail:"A neutral side for everyday wear and a bold printed side for colour.",image:"https://images.unsplash.com/photo-1548624149-f3f8a4a5b1c7?w=900&q=85"},
{id:"rv2",title:"Wrap-to-skirt set",tag:"CONVERTIBLE",detail:"A wrap layer styled as a skirt, dress layer or scarf.",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85"},
{id:"rv3",title:"Day-to-night co-ord",tag:"MODULAR · 3 LOOKS",detail:"Detachable sleeves and an adjustable waist make one set work across occasions.",image:"https://images.unsplash.com/photo-1539109939371-ef4b4e7c4f6d?w=900&q=85"}];
const DEMO_IDEAS={
Dress:[{title:"Two-piece co-ord",difficulty:"MODERATE",description:"Turn the dress into a crop top and relaxed skirt set.",image:"https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=85"},{title:"Everyday tote bag",difficulty:"EASY",description:"Reuse stronger panels to create a lined carry-all.",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=85"},{title:"Short summer top",difficulty:"EASY",description:"Crop and finish the bodice with adjustable straps.",image:"https://images.unsplash.com/photo-1564257577-6a9c4e5c2d1b?w=900&q=85"}],
Saree:[{title:"Flowy co-ord set",difficulty:"MODERATE",description:"Use the pallu as a statement top and remaining length as wide-leg pants.",image:"https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=900&q=85"},{title:"Indo-western dress",difficulty:"ADVANCED",description:"Keep the border as a feature panel on a modern occasion dress.",image:"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=85"},{title:"Quilted jacket",difficulty:"ADVANCED",description:"Combine saree panels with a soft lining for a one-of-a-kind layer.",image:"https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=900&q=85"}],
Jeans:[{title:"Denim mini skirt",difficulty:"MODERATE",description:"Reshape the legs into a structured skirt.",image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85"},{title:"Utility tote",difficulty:"EASY",description:"Turn sturdy denim panels into a durable everyday bag.",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=85"},{title:"Patchwork corset top",difficulty:"ADVANCED",description:"Use denim panels for a fitted statement piece.",image:"https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=900&q=85"}],
Shirt:[{title:"Tie-front summer top",difficulty:"EASY",description:"Crop the shirt and add ties for an adjustable fit.",image:"https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=900&q=85"},{title:"Relaxed shirt dress",difficulty:"MODERATE",description:"Add side panels and a belt for a longer silhouette.",image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85"},{title:"Patchwork cushion cover",difficulty:"EASY",description:"Give printed cotton a second life as home decor.",image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=85"}],
Other:[{title:"Patchwork overshirt",difficulty:"MODERATE",description:"Combine usable fabric panels into a relaxed layering piece.",image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85"},{title:"Everyday tote",difficulty:"EASY",description:"Make a useful bag from the strongest sections.",image:"https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=85"},{title:"Statement accessories",difficulty:"EASY",description:"Use leftover fabric for scrunchies, ties and pouches.",image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85"}]};
const REPAIR_MENU=[{name:"Button / hook replacement",price:"₹80–150",time:"1–2 days"},{name:"Hemming / length alteration",price:"₹150–300",time:"2–3 days"},{name:"Zip replacement",price:"₹200–450",time:"2–4 days"},{name:"Small seam / tear repair",price:"₹120–350",time:"1–3 days"},{name:"Fit alteration",price:"₹250–600",time:"3–5 days"},{name:"Patchwork / visible mending",price:"₹300–700",time:"3–6 days"}];
const RECREATE_LOOKS=[{title:"Saree → draped co-ord",detail:"A modern blouse with wide-leg pants, keeping the saree border as trim.",budget:"₹1,200–2,000",time:"5–8 days",image:"https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=900&q=85"},{title:"Shirt → corset & shrug",detail:"A fitted corset-style top paired with a light open shrug.",budget:"₹900–1,600",time:"4–7 days",image:"https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=900&q=85"},{title:"Jeans → skirt & mini bag",detail:"Rework denim into a panelled skirt and use offcuts for a mini bag.",budget:"₹800–1,500",time:"4–6 days",image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85"}];

function App() {
  const [page, setPage] = useState("Discover");
  const [listings, setListings] = useState(DEMO_LISTINGS);
  const [reversible, setReversible] = useState(DEMO_REVERSIBLE);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [ideas, setIdeas] = useState(DEMO_IDEAS.Dress);
  const [uploads, setUploads] = useState({ garment: "", inspiration: "" });
  const [garment, setGarment] = useState("Dress");
  const [tailorResult, setTailorResult] = useState(null);
  const [filter, setFilter] = useState("all");
  const [listingForm, setListingForm] = useState({ title: "", category: "Dress", size: "M", condition: "Very good", price: "500", type: "resell", description: "", image: "" });
  const [repairForm, setRepairForm] = useState({ garment: "Jeans", issue: "Torn seam", notes: "", image: "" });
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    try { const [l, v] = await Promise.all([api("/listings"), api("/reversible")]); setListings(l); setReversible(v); }
    catch { setListings(DEMO_LISTINGS); setReversible(DEMO_REVERSIBLE); }
  };
  useEffect(() => { refresh(); }, []);
  const notify = msg => { setToast(msg); setTimeout(() => setToast(""), 3200); };
  const go = p => { setPage(p); setMenu(false); setSelectedIdea(null); setTailorResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const filtered = useMemo(() => listings.filter(x => filter === "all" || x.type === filter), [listings, filter]);
  async function submitListing(e) {
    e.preventDefault(); setBusy(true);
    try { const created = await api("/listings", { method: "POST", body: JSON.stringify(listingForm) }); setListings(old => [created, ...old]); setListingForm({ title: "", category: "Dress", size: "M", condition: "Very good", price: "500", type: "resell", description: "", image: "" }); notify("Your listing is live in this demo!"); setPage("RESELL"); }
    catch (e) { notify(e.message); } finally { setBusy(false); }
  }
  async function findIdeas(e) {
    e.preventDefault(); setBusy(true);
    try { const data = await api(`/ideas?garment=${encodeURIComponent(garment)}`); setIdeas(data.ideas); setSelectedIdea(null); }
    catch { setIdeas(DEMO_IDEAS[garment] || DEMO_IDEAS.Other); setSelectedIdea(null); notify("Showing curated demo transformations."); } finally { setBusy(false); }
  }
  async function createTailorRequest(source = "recreate") {
    if (!selectedIdea) return notify("Choose a design idea first.");
    setBusy(true);
    try { const result = await api("/tailor-requests", { method: "POST", body: JSON.stringify({ garment, idea: selectedIdea.title, image: uploads.garment, inspiration: uploads.inspiration, notes: source === "reimagine" ? "Created from a RE:IMAGINE concept." : "", source }) }); setTailorResult(result); notify("Your tailor request has been created."); }
    catch (e) { notify(e.message); } finally { setBusy(false); }
  }
  async function submitRepair(e) {
    e.preventDefault(); setBusy(true);
    try { const result = await api("/repairs", { method: "POST", body: JSON.stringify(repairForm) }); setTailorResult({ proposals: result.tailors, request: result.repair }); notify("Repair request submitted."); }
    catch (e) { notify(e.message); } finally { setBusy(false); }
  }
  async function exchange(id) {
    try { await api("/exchange-requests", { method: "POST", body: JSON.stringify({ listingId: id }) }); notify("Exchange interest sent! (Demo)"); }
    catch (e) { notify(e.message); }
  }
  return <div className="app">
    <div className="announcement"><span>GOOD CLOTHES DESERVE MORE THAN ONE LIFE</span><span className="announce-right">A little less waste. A lot more style. <ArrowUpRight size={13}/></span></div>
    <header className="header">
      <button className="wordmark" onClick={() => go("Discover")}>RE<span>:</span>WEAR<span className="wordmark-dot">.</span></button>
      <nav className={menu ? "nav open" : "nav"}>{nav.map(n => <button key={n} className={page === n ? "active" : ""} onClick={() => go(n)}>{n}</button>)}</nav>
      <div className="header-actions"><button className="icon-button" aria-label="Search" onClick={() => go("RESELL")}><Search size={18}/></button><button className="sell-button" onClick={() => { go("List an item"); }}>LIST AN ITEM <ArrowUpRight size={14}/></button><button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X/> : <Menu/>}</button></div>
    </header>
    <main>
      {page === "Discover" && <><section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> THE CIRCULAR WARDROBE</div><h1>Wear it.<br/><em>Rewear it.</em><br/>Reimagine it.</h1><p>Good style doesn't have an expiry date. Give your wardrobe a second story through resale, exchange and thoughtful redesign.</p><div className="hero-actions"><button className="button dark" onClick={() => go("RE:IMAGINE")}>REIMAGINE YOUR CLOTHES <ArrowUpRight size={16}/></button><button className="text-button" onClick={() => go("RESELL")}>Explore the marketplace <ArrowRight size={16}/></button></div><div className="hero-note"><Sprout size={16}/> A more thoughtful way to get dressed.</div></div>
        <div className="hero-visual"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=90" alt="Friends exploring timeless fashion"/><div className="hero-stamp"><span>STYLE</span><span>WITH</span><span>SECOND</span><span>CHANCES <Leaf size={18}/></span></div><div className="hero-caption">THE ART OF A SECOND LIFE <ArrowDownRight size={15}/></div></div>
      </section>
      <section className="ticker"><div>RESELL <span>✳</span> EXCHANGE <span>✳</span> RECREATE <span>✳</span> REIMAGINE <span>✳</span> REPAIR <span>✳</span> REPEAT <span>✳</span> RESELL <span>✳</span> EXCHANGE <span>✳</span></div></section>
      <section className="intro section-pad"><div><div className="eyebrow">NOT JUST ANOTHER WARDROBE</div><h2>Make room for<br/><em>better stories.</em></h2></div><p>That dress you no longer wear? It could be someone's new favourite. That old fabric? It might become the outfit you've been saving on your moodboard. Start anywhere.</p></section>
      <section className="feature-grid section-pad">
        <FeatureCard number="01" title="Pass it on." name="RESELL" desc="Find a new home for pieces that deserve to be worn." image="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" onClick={() => go("RESELL")}/>
        <FeatureCard number="02" title="Trade stories." name="RE:EXCHANGE" desc="Your not-for-you might be just-right for someone else." image="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=900&q=85" onClick={() => go("RE:EXCHANGE")}/>
        <FeatureCard number="03" title="Start again." name="RE:IMAGINE" desc="See the possibilities hiding in your old clothes." image="https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=900&q=85" onClick={() => go("RE:IMAGINE")}/>
      </section>
      <section className="recreate-banner"><div className="recreate-image"><img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1000&q=85" alt="Tailor working with fabric"/></div><div className="recreate-copy"><div className="eyebrow light">YOUR IDEA. YOUR FABRIC. YOUR TAILOR.</div><h2>Dream it.<br/><em>We'll stitch it.</em></h2><p>Bring an old garment and a little inspiration. Our tailor network helps turn what you already own into something you can't wait to wear.</p><button className="button cream" onClick={() => go("RE:CREATE")}>EXPLORE RE:CREATE <ArrowUpRight size={16}/></button></div></section>
      <section className="closing section-pad"><div className="eyebrow">A WARDROBE WITH A FUTURE</div><h2>Less new.<br/><em>More you.</em></h2><button className="button dark" onClick={() => go("RE:VERSIBLE")}>DISCOVER THE POSSIBILITIES <ArrowUpRight size={16}/></button></section></>}
      {(page === "RESELL" || page === "RE:EXCHANGE") && <section className="page-shell"><PageIntro kicker="THE COMMUNITY CLOSET" title={page === "RESELL" ? <span>Good finds.<br/><em>Better second lives.</em></span> : <span>One person's maybe.<br/><em>Another's must-have.</em></span>} desc={page === "RESELL" ? "Shop pre-loved pieces, or list something from your own wardrobe." : "Swap pieces you have for pieces you'll love. No money, just a better match."}/><div className="market-toolbar"><div className="tabs"><button className={filter==="all"?"selected":""} onClick={()=>setFilter("all")}>ALL PIECES</button><button className={filter==="resell"?"selected":""} onClick={()=>setFilter("resell")}>FOR SALE</button><button className={filter==="exchange"?"selected":""} onClick={()=>setFilter("exchange")}>FOR EXCHANGE</button></div><button className="button dark small" onClick={()=>go("List an item")}>+ LIST YOUR PIECE</button></div><div className="demo-strip">CURATED DEMO CLOSET <span>Sample listings · indicative prices · no real checkout</span></div><div className="product-grid">{filtered.map(item=><article className="product-card" key={item.id}><div className="product-photo">{item.image?<img src={item.image} alt={item.title}/>:<img src={fallback} alt={item.title}/>}<span className="pill">{item.type==="exchange"?"OPEN TO SWAP":"PRE-LOVED"}</span></div><div className="product-info"><div className="product-top"><span>{item.category} · {item.size}</span><span>{item.condition}</span></div><h3>{item.title}</h3><div className="product-bottom"><strong>{item.type==="exchange"?"EXCHANGE":`₹${Number(item.price||0).toLocaleString("en-IN")}`}</strong>{item.type==="exchange"?<button className="outline-button" onClick={()=>exchange(item.id)}>REQUEST SWAP</button>:<button className="outline-button" onClick={()=>notify("Purchase interest noted! This is a no-payment demo.")}>I'M INTERESTED</button>}</div></div></article>)}</div>{filtered.length===0&&<Empty text="No pieces here yet. Be the first to list one." onClick={()=>go("List an item")}/>}</section>}
      {page === "List an item" && <section className="page-shell narrow"><button className="back-link" onClick={()=>go("RESELL")}><ArrowLeft size={15}/> BACK TO MARKETPLACE</button><PageIntro kicker="GIVE IT A NEW HOME" title={<>List a piece.<br/><em>Pass it forward.</em></>} desc="Add a few details and let your piece find its next chapter."/><form className="form-card" onSubmit={submitListing}><div className="form-grid"><div className="field full"><span className="field-label">A PHOTO OF YOUR PIECE</span><ImageUpload label="Upload a garment photo" value={listingForm.image} onChange={v=>setListingForm(x=>({...x,image:v}))}/></div><Field label="WHAT ARE YOU LISTING?"><input required value={listingForm.title} onChange={e=>setListingForm(x=>({...x,title:e.target.value}))} placeholder="e.g. Blue cotton shirt"/></Field><Field label="CATEGORY"><select value={listingForm.category} onChange={e=>setListingForm(x=>({...x,category:e.target.value}))}>{["Dress","Shirt","Jeans","Kurta","Saree","Jacket","Other"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="SIZE"><input value={listingForm.size} onChange={e=>setListingForm(x=>({...x,size:e.target.value}))}/></Field><Field label="CONDITION"><select value={listingForm.condition} onChange={e=>setListingForm(x=>({...x,condition:e.target.value}))}>{["Like new","Very good","Good","Needs some love"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="LISTING TYPE"><select value={listingForm.type} onChange={e=>setListingForm(x=>({...x,type:e.target.value}))}><option value="resell">Resell</option><option value="exchange">Exchange</option></select></Field>{listingForm.type==="resell"&&<Field label="PRICE (₹)"><input type="number" min="0" value={listingForm.price} onChange={e=>setListingForm(x=>({...x,price:e.target.value}))}/></Field>}<Field label="A LITTLE STORY" full><textarea rows="3" value={listingForm.description} onChange={e=>setListingForm(x=>({...x,description:e.target.value}))} placeholder="Tell us about the piece..."/></Field></div><button className="button dark full-button" disabled={busy}>{busy?"PUBLISHING…":"PUBLISH LISTING"} <ArrowUpRight size={16}/></button><p className="form-footnote">Demo mode: this listing is temporarily stored while the API server is running.</p></form></section>}
      {page === "RE:IMAGINE" && <section className="page-shell"><PageIntro kicker="THE POSSIBILITIES ARE ALREADY THERE" title={<>Same fabric.<br/><em>New favourite.</em></>} desc="Upload a piece, tell us what it is, and explore a few ways it could live on."/><div className="imagine-layout"><form className="form-card imagine-form" onSubmit={findIdeas}><div className="eyebrow">01 — SHOW US WHAT YOU HAVE</div><ImageUpload label="Upload your old garment" value={uploads.garment} onChange={v=>setUploads(x=>({...x,garment:v}))}/><Field label="WHAT KIND OF PIECE IS IT?"><select value={garment} onChange={e=>{setGarment(e.target.value);setIdeas([]);setSelectedIdea(null);}}>{["Dress","Saree","Jeans","Shirt","Other"].map(x=><option key={x}>{x}</option>)}</select></Field><button className="button dark full-button" disabled={busy}>{busy?"FINDING IDEAS…":"SHOW ME THE POSSIBILITIES"} <Sparkles size={16}/></button></form><div className="ideas-panel"><div className="eyebrow">02 — IMAGINE WHAT'S NEXT</div><p className="demo-hint">Curated transformation directions — choose one to carry into RE:CREATE.</p>{ideas.length===0?<div className="empty-ideas"><Sparkles size={27}/><h3>Your next favourite is waiting.</h3><p>Upload a garment and choose its type to reveal transformation ideas.</p></div>:<><div className="idea-grid">{ideas.map((idea,i)=><button key={idea.title} className={`idea-card ${selectedIdea?.title===idea.title?"chosen":""}`} onClick={()=>setSelectedIdea(idea)}><div className="idea-image"><img src={idea.image} alt={idea.title}/><span>0{i+1}</span>{selectedIdea?.title===idea.title&&<i><Check size={17}/></i>}</div><div className="idea-copy"><span>{idea.difficulty} TRANSFORMATION</span><h3>{idea.title}</h3><p>{idea.description}</p></div></button>)}</div><div className="idea-actions"><span>{selectedIdea? `Selected: ${selectedIdea.title}` : "Choose one idea to continue"}</span><button className="button dark" disabled={!selectedIdea} onClick={()=>go("RE:CREATE")}>TAKE IT TO RE:CREATE <ArrowUpRight size={15}/></button></div><p className="disclaimer">These are predefined concept suggestions, not AI-generated previews. A tailor must inspect the actual fabric and confirm feasibility.</p></>}</div></div></section>}
      {page === "RE:CREATE" && <section className="page-shell"><PageIntro kicker="MADE FROM WHAT YOU ALREADY HAVE" title={<>Your fabric.<br/><em>Your imagination.</em></>} desc="Share the garment you want to transform and the look you're dreaming of. Tailors will review the request and send proposals."/><div className="recreate-look-section"><div className="eyebrow">NEED A LITTLE INSPIRATION?</div><h2>Old pieces, <em>new silhouettes.</em></h2><div className="recreate-look-grid">{RECREATE_LOOKS.map((look,i)=><article className="look-card" key={look.title}><img src={look.image} alt={look.title}/><div><small>LOOK 0{i+1} · SAMPLE CONCEPT</small><h3>{look.title}</h3><p>{look.detail}</p><div className="look-meta"><b>{look.budget}</b><span>{look.time}</span></div><button className="outline-button" onClick={()=>{setSelectedIdea({title:look.title});notify("Concept selected. Upload your fabric and send it to a tailor.");}}>USE AS INSPIRATION</button></div></article>)}</div><p className="disclaimer">Concepts and price ranges are illustrative. Final design, fabric feasibility and quote depend on tailor assessment.</p></div><div className="recreate-form-layout"><form className="form-card" onSubmit={e=>{e.preventDefault();createTailorRequest("recreate");}}><div className="eyebrow">01 — YOUR MATERIAL</div><ImageUpload label="Upload your garment or fabric" value={uploads.garment} onChange={v=>setUploads(x=>({...x,garment:v}))}/><Field label="MATERIAL TYPE"><select value={garment} onChange={e=>setGarment(e.target.value)}>{["Dress","Saree","Jeans","Shirt","Other"].map(x=><option key={x}>{x}</option>)}</select></Field><div className="eyebrow space-top">02 — YOUR INSPIRATION</div><ImageUpload label="Upload an inspiration image" value={uploads.inspiration} onChange={v=>setUploads(x=>({...x,inspiration:v}))}/><Field label="ANYTHING THE TAILOR SHOULD KNOW"><textarea rows="3" placeholder="Fabric length, preferred fit, occasion..." id="tailor-notes"/></Field><button className="button dark full-button" disabled={busy}>{busy?"SENDING…":"SEND TO TAILORS"} <ArrowUpRight size={16}/></button></form><aside className="process-card"><div className="eyebrow">HOW RE:CREATE WORKS</div><Process n="01" title="Share your starting point" text="Upload the old garment or fabric and an inspiration reference."/><Process n="02" title="Tailors review your idea" text="They assess feasibility and may suggest practical changes."/><Process n="03" title="Compare proposals" text="Review sample quotes, timelines and tailor notes."/><Process n="04" title="Choose your maker" text="Select the proposal that feels right for your project."/><div className="note-box"><Scissors size={18}/><span>Every fabric is different. Final feasibility, cost and timeline require a tailor's physical assessment.</span></div></aside></div>{tailorResult&&<ProposalPanel result={tailorResult}/>}</section>}
      {page === "RE:PAIR" && <section className="page-shell"><PageIntro kicker="DON'T THROW IT. FIX IT." title={<>A little repair.<br/><em>A lot more wear.</em></>} desc="From a loose hem to a torn seam, give your favourite pieces the care they need."/><div className="repair-menu"><div className="eyebrow">QUICK REPAIR PRICE GUIDE</div><div className="repair-menu-grid">{REPAIR_MENU.map(x=><div className="repair-menu-item" key={x.name}><strong>{x.name}</strong><b>{x.price}</b><small>Typical time: {x.time}</small></div>)}</div><p className="disclaimer">Indicative demo estimates in INR; actual quote depends on garment and repair complexity.</p></div><div className="repair-layout"><div className="repair-photo"><img src="https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=1000&q=85" alt="Clothing repair and sewing"/><div className="photo-note">KEEP THE PIECE.<br/><em>LOSE THE WASTE.</em></div></div><form className="form-card" onSubmit={submitRepair}><div className="eyebrow">TELL US WHAT NEEDS FIXING</div><ImageUpload label="Upload a photo of the damage" value={repairForm.image} onChange={v=>setRepairForm(x=>({...x,image:v}))}/><Field label="GARMENT"><select value={repairForm.garment} onChange={e=>setRepairForm(x=>({...x,garment:e.target.value}))}>{["Jeans","Dress","Shirt","Kurta","Jacket","Other"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="WHAT NEEDS REPAIR?"><select value={repairForm.issue} onChange={e=>setRepairForm(x=>({...x,issue:e.target.value}))}>{["Torn seam","Broken zip","Loose hem","Missing button","Fabric tear","Fit alteration","Other"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="MORE DETAILS"><textarea rows="3" value={repairForm.notes} onChange={e=>setRepairForm(x=>({...x,notes:e.target.value}))} placeholder="Describe the issue..."/></Field><button className="button dark full-button" disabled={busy}>{busy?"SENDING…":"FIND A REPAIR TAILOR"} <ArrowUpRight size={16}/></button></form></div>{tailorResult&&<ProposalPanel result={tailorResult}/>}</section>}
      {page === "RE:VERSIBLE" && <section className="page-shell"><PageIntro kicker="MORE WAYS TO WEAR" title={<>One piece.<br/><em>More possibilities.</em></>} desc="Discover thoughtful designs that work twice as hard — reversible, convertible and modular."/><div className="demo-strip">DESIGN LIBRARY <span>Sample concepts · request a custom version</span></div><div className="reversible-grid">{reversible.map((x,i)=><article className="reversible-card" key={x.id}><div className="reversible-image"><img src={x.image} alt={x.title}/><span>{x.tag}</span></div><div className="reversible-info"><small>DESIGN 0{i+1}</small><h3>{x.title}</h3><p>{x.detail}</p><button className="text-button" onClick={()=>{setSelectedIdea({title:x.title});go("RE:CREATE");notify("Tell a tailor you'd like a custom version of this design.");}}>MAKE SOMETHING LIKE THIS <ArrowUpRight size={15}/></button></div></article>)}</div><div className="reversible-cta"><div><div className="eyebrow">HAVE A DESIGN IN MIND?</div><h3>Let's make it yours.</h3></div><button className="button dark" onClick={()=>go("RE:CREATE")}>REQUEST A CUSTOM PIECE <ArrowUpRight size={16}/></button></div></section>}
    </main>
    <footer className="footer"><div className="footer-top"><div><button className="wordmark footer-mark" onClick={()=>go("Discover")}>RE<span>:</span>WEAR<span className="wordmark-dot">.</span></button><p>Good clothes deserve more than one life.</p></div><div className="footer-links"><span>EXPLORE</span>{nav.slice(1).map(n=><button key={n} onClick={()=>go(n)}>{n}</button>)}</div><div className="footer-signoff">A MORE THOUGHTFUL<br/>WARDROBE STARTS HERE. <Sprout size={25}/></div></div><div className="footer-bottom"><span>© 2026 RE:WEAR — DEMO PROJECT</span><span>MADE FOR A CIRCULAR FUTURE</span><span className="demo-tag">DEMO MODE · NO REAL PAYMENTS</span></div></footer>
    {toast&&<div className="toast"><Check size={16}/>{toast}<button onClick={()=>setToast("")}><X size={15}/></button></div>}
  </div>;
}
function FeatureCard({number,title,name,desc,image,onClick}) { return <button className="feature-card" onClick={onClick}><div className="feature-image"><img src={image} alt=""/><span>{number} <ArrowUpRight size={15}/></span></div><div className="feature-text"><div><h3>{title}</h3><p>{desc}</p></div><b>{name}</b></div></button>; }
function PageIntro({kicker,title,desc}) { return <div className="page-intro"><div className="eyebrow">{kicker}</div><h1>{title}</h1><p>{desc}</p></div>; }
function Field({label,children,full}) { return <label className={`field ${full?"full":""}`}><span className="field-label">{label}</span>{children}</label>; }
function Empty({text,onClick}) { return <div className="empty-state"><Shirt size={30}/><p>{text}</p><button className="button dark" onClick={onClick}>LIST A PIECE <ArrowUpRight size={15}/></button></div>; }
function Process({n,title,text}) { return <div className="process-step"><span>{n}</span><div><h4>{title}</h4><p>{text}</p></div></div>; }
function ProposalPanel({result}) { return <div className="proposal-panel"><div className="eyebrow">YOUR REQUEST IS IN — SAMPLE TAILOR PROPOSALS</div><h2>Meet your makers.</h2><p className="proposal-sub">These are illustrative demo proposals to show how the selection flow works.</p><div className="proposal-grid">{(result.proposals||[]).map(p=><article className="proposal-card" key={p.id}><div className="tailor-avatar">{p.tailor.split(" ").map(x=>x[0]).slice(0,2).join("")}</div><div><h3>{p.tailor}</h3><small>{p.specialty} · ★ {p.rating}</small></div><div className="proposal-metrics"><span><b>₹{Number(p.price).toLocaleString("en-IN")}</b><small>EST. PRICE</small></span><span><b>{p.days} days</b><small>TIMELINE</small></span></div><p>{p.note}</p><button className="outline-button" onClick={e=>{e.currentTarget.textContent="SELECTED ✓";e.currentTarget.classList.add("chosen");}}>SELECT THIS TAILOR</button></article>)}</div></div>; }
export default App;