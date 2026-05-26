
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const handlePayment = async (
  serviceAmount,
  customerName,
  customerEmail,
  orderData = {}
) => {
  try {

    const orderResponse = await fetch(
      `${API_URL}/api/payments/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: serviceAmount * 100, // Conversion to paise for Razorpay
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            customerName,
            customerEmail,
          },
        }),
      }
    );

    const orderResult = await orderResponse.json();

    if (!orderResult.success) {
      alert("Failed to create payment order");
      return;
    }

    const order = orderResult.order;
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "RepairConnect",
      description: "Repair Service Booking",
      order_id: order.id,

      handler: async function (response) {
        try {
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

                orderData: {
                  ...orderData,
                  total_amount: serviceAmount,
                  payment_status: "paid",
                },
              }),
            }
          );

          const verifyResult = await verifyResponse.json();

          if (verifyResult.success) {
            alert("Payment Successful! Booking Confirmed.");
            console.log("Verified Payment Trace:", verifyResult);
          } else {
            alert("Payment verification rejected by core node.");
          }
        } catch (error) {
          console.error("Verification System Failure:", error);
          alert("Payment verification failed.");
        }
      },

      prefill: {
        name: customerName || "Guest User",
        email: customerEmail || "test@example.com",
        contact: "9999999999",
      },

      notes: {
        address: orderData.address || "Repair Service Address",
      },

      theme: {
        color: "#3B82F6", // System Blue Accent
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment Execution Terminal Error:", error);
    alert("Something went wrong during payment initialization.");
  }
};