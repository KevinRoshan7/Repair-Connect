import { useState } from "react";
import { supabase } from "../supabase";

export default function BecomePartnerModal({ user, isOpen, onClose }) {
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("AC"); // Default category match
  const [experience, setExperience] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !experience.trim()) {
      return alert("Please fill out all operational fields.");
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from("partners").insert([
        {
          user_id: user?.id || null, // Associates application with current user node
          full_name: fullName,
          email: user?.email || "unknown@node.io",
          phone: phone.trim(),
          category: category,
          experience_years: parseInt(experience, 10) || 0,
          status: "pending"
        }
      ]);

      if (error) throw error;

      alert("Application deployed successfully! Staged for administrative review.");
      onClose(); // Shut down overlay portal
    } catch (err) {
      console.error("Data submission routine failed:", err);
      alert("Error uploading application parameters: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
    }}>
      <div style={{
        background: "rgba(12, 12, 20, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: 32, borderRadius: 6, width: "100%", maxWidth: 440, color: "#fff",
        fontFamily: "system-ui, sans-serif", boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>Become a Partner</h2>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: "uppercase" }}>
              Join the RepairConnect Engineering Fleet
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>FULL NAME</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "#fff", fontSize: 13, boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>CONTACT PHONE PHONE NUMBER</label>
            <input type="tel" placeholder="e.g., +91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} required style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "#fff", fontSize: 13, boxSizing: "border-box" }} />
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>SERVICE SPECIALIZATION FIELD</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: 10, background: "#0c0c14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "#fff", fontSize: 13, boxSizing: "border-box" }}>
              <option value="AC">Air Conditioner (AC) Engineering</option>
              <option value="Refrigerator">Refrigeration Systems</option>
              <option value="Electrical">General High-Voltage Electrical</option>
              <option value="Plumbing">Fluid Dynamics / Plumbing</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>YEARS OF FIELD EXPERIENCE</label>
            <input type="number" min="0" placeholder="e.g., 3" value={experience} onChange={e => setExperience(e.target.value)} required style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "#fff", fontSize: 13, boxSizing: "border-box" }} />
          </div>

          <button type="submit" disabled={submitting} style={{ width: "100%", padding: "12px 0", background: "#fff", color: "#000", fontWeight: "bold", border: "none", borderRadius: 4, cursor: submitting ? "not-allowed" : "pointer", fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 8 }}>
            {submitting ? "Uploading Credentials..." : "Submit Registry Application"}
          </button>
        </form>
      </div>
    </div>
  );
}