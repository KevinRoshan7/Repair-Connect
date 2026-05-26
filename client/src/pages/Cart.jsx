import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

// 🚀 Dynamically pull the API endpoint directly from your project's .env profile
const API_URL = import.meta.env.VITE_API_URL;

export default function Cart({ onCartUpdated }) {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userPhone, setUserPhone] = useState("");
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setActiveUser(user);
      setFetching(false);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (activeUser?.id) {
      fetchCartItems();
      fetchUserPhoneNumber();
    }
  }, [activeUser]);

  async function fetchUserPhoneNumber() {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("phone_number, phone, mobile")
        .eq("id", activeUser.id)
        .maybeSingle();

      if (data) {
        setUserPhone(
          data.phone_number ||
          data.phone ||
          data.mobile ||
          ""
        );
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }

  async function fetchCartItems() {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", activeUser.id);

      if (error) throw error;

      setCartItems(data || []);
    } catch (err) {
      console.error("Cart retrieval error:", err);
    }
  }

  async function removeItem(id) {
    try {
      await supabase
        .from("cart")
        .delete()
        .eq("id", id);

      setCartItems((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (onCartUpdated) onCartUpdated();

    } catch (err) {
      console.error(err);
    }
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const minDate = new Date()
    .toISOString()
    .split("T")[0];

  const handleCheckoutPayment = async () => {
    if (!activeUser?.id) {
      return alert("Please login first.");
    }

    if (!address.trim()) {
      return alert("Please enter address.");
    }

    if (!date) {
      return alert("Please choose booking date.");
    }

    setLoading(true);

    try {
      /* =========================================================
          1. CREATE ORDER
      ========================================================= */
      const createOrderResponse = await fetch(
        `${API_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
          }),
        }
      );

      // 🛡️ Pre-intercept HTML server errors to prevent JSON structural collapse
      if (!createOrderResponse.ok) {
        setLoading(false);
        return alert(`Order generation failed. Server returned status: ${createOrderResponse.status}`);
      }

      // Consumes order object cleanly to map against backend payment router modifications
      const order = await createOrderResponse.json();

      /* =========================================================
          2. RAZORPAY CONFIGURATION OPTIONS
      ========================================================= */
      const options = {
        key: "rzp_test_St3YfhCVZpAw3B", 
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "RepairX",
        description: "Secure System Service Checkout Gateway",
        handler: async function (response) {
          try {
            /* =========================================================
                3. VERIFY PAYMENT + INSERT RECORD BATCH
            ========================================================= */
            const verifyResponse = await fetch(
              `${API_URL}/api/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  bookings: cartItems.map((item) => ({
                    user_id: activeUser.id,
                    service_title: item.service_title,
                    category: item.category,
                    price: item.price,
                    address: address.trim(),
                    booking_date: new Date(date).toISOString(),
                  })),
                }),
              }
            );

            // 🛡️ Pre-intercept verification routine failures
            if (!verifyResponse.ok) {
              throw new Error(`Server returned error status code: ${verifyResponse.status}`);
            }

            const verifyResult = await verifyResponse.json();

            if (!verifyResult.success) {
              throw new Error(
                verifyResult.error ||
                verifyResult.message ||
                "Payment verification failed"
              );
            }

            /* =========================================================
                4. CLEAR TRANSIENT CART ENTRIES ON SUCCESS
            ========================================================= */
            const { error: clearError } = await supabase
              .from("cart")
              .delete()
              .eq("user_id", activeUser.id);

            if (clearError) throw clearError;

            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

            setCartItems([]);
            setAddress("");
            setDate("");

            if (onCartUpdated) {
              onCartUpdated();
            }

          } catch (err) {
            console.error(err);
            alert("Payment verification failed: " + err.message);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false); // Clean fallback if user dismisses modal layout out-of-bounds
          }
        },
        prefill: {
          name: activeUser?.user_metadata?.full_name || "Customer",
          email: activeUser?.email || "billing@repairx.io",
          contact: userPhone || "9876543210",
        },
        theme: {
          color: "#0c0c14",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Unable to initialize payment gateway.");
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#fff" }}>
        Loading cart...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 6 }}>
          <p>Your cart contains no staged items.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: 20, borderRadius: 4 }}>
                <div>
                  <h4 style={{ margin: 0 }}>{item.service_title}</h4>
                  <span style={{ fontSize: 10, color: "#3b82f6" }}>{item.category}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <span style={{ fontWeight: 600 }}>₹{item.price.toLocaleString("en-IN")}</span>
                  <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>
                    [REMOVE]
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(12,12,20,0.6)", border: "1px solid rgba(255,255,255,0.1)", padding: 28, borderRadius: 6 }}>
            <h3 style={{ margin: "0 0 20px" }}>Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <span>Total Bill:</span>
              <span style={{ fontWeight: "bold" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 9, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>DELIVERY ADDRESS</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", padding: 10, background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 4, resize: "vertical", minHeight: "60px" }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 9, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>DEPLOYMENT DATE</label>
              <input type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: 10, background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 4 }} />
            </div>

            <button onClick={handleCheckoutPayment} disabled={loading} style={{ width: "100%", padding: 14, background: "#fff", color: "#000", fontWeight: "bold", border: "none", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Processing..." : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}