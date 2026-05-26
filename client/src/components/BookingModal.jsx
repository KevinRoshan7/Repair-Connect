import { useState, useEffect } from "react";
import { supabase } from "../supabase"; 

const modalStyle = `
  @keyframes modalIn {
    from { opacity:0; transform:scale(0.96) translateY(12px); }
    to   { opacity:1; transform:scale(1)    translateY(0); }
  }
  .modal-card {
    animation: modalIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
    background: rgba(12,12,20,0.95);
    backdrop-filter: blur(32px) saturate(1.5);
    -webkit-backdrop-filter: blur(32px) saturate(1.5);
    border: 1px solid rgba(255,255,255,0.11);
    box-shadow: 0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07);
  }
`;

export default function BookingModal({ service, user, onClose, onAddedToCart }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const serviceName = service?.name || service?.title || "Repair Service";
  const rawPrice = service?.base_price || service?.price || 0;
  const numericPrice = typeof rawPrice === "number" ? rawPrice : parseInt(String(rawPrice).replace(/[^0-9]/g, ""), 10) || 0;
  const displayPrice = `₹${numericPrice.toLocaleString("en-IN")}`;

  async function handleAddToCart() {
    setLoading(true);
    setError(null);

    try {
      const {
  data: { user: currentUser },
} = await supabase.auth.getUser();

if (!currentUser) {
  alert("Please login first");
  setLoading(false);
  return;
}

const activeUserId = currentUser.id;

      const { error: supabaseError } = await supabase
        .from('cart')
        .insert([
          {
            user_id: activeUserId,
            service_title: serviceName,
            category: service?.category || "General System",
            price: numericPrice
          }
        ]);

      if (supabaseError) throw supabaseError;

      alert(`${serviceName} added to cart successfully!`);
      if (onAddedToCart) onAddedToCart();
      onClose();
    } catch (err) {
      console.error("Cart insertion failed:", err);
      setError(err.message || "Failed to add item to your staging cart.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{modalStyle}</style>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
        <div className="modal-card" onClick={e=>e.stopPropagation()} style={{ width:"100%", maxWidth:400, borderRadius:6, padding:"36px 32px 32px", position:"relative", color:"#fff" }}>
          
          <button onClick={onClose} style={{ position:"absolute", top:18, right:20, background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.25)", fontSize:16 }}>✕</button>

          <div style={{ marginBottom:24 }}>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.26em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:8 }}>Add Item</p>
            <h2 style={{ fontFamily:"system-ui, -apple-system, sans-serif", fontSize:22, fontWeight:800, color:"rgba(255,255,255,0.95)", lineHeight:1.2 }}>{serviceName}</h2>
            <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:"rgba(255,255,255,0.50)", fontWeight:600 }}>Rate: {displayPrice}</span>
              <span style={{ width:3, height:3, borderRadius:"50%", background:"rgba(255,255,255,0.15)" }} />
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#3b82f6", textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:600 }}>{service?.category || "SYSTEM"}</span>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom:18, padding:"10px 13px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.22)", borderRadius:2 }}>
              <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#f87171", margin:0 }}>{error}</p>
            </div>
          )}

          <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.5, marginBottom:28 }}>
            Would you like to stage this engineering selection into your service catalog cart? You can configure your delivery location details and complete payment for all items together at check-out.
          </p>

          <div style={{ display:"flex", gap:10 }}>
            <button type="button" onClick={onClose} style={{ flex:1, padding:"12px 0", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.10)", borderRadius:2, fontFamily:"'DM Mono',monospace", fontSize:10, textTransform:"uppercase", color:"rgba(255,255,255,0.35)", cursor:"pointer" }}>
              Cancel
            </button>
            <button type="button" onClick={handleAddToCart} disabled={loading} style={{ flex:2, padding:"12px 0", background:"#fff", color:"#000", border:"none", borderRadius:2, fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:"bold", textTransform:"uppercase", cursor:loading?"not-allowed":"pointer" }}>
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}