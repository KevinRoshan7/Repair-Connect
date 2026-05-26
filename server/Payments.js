const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('./supabaseClient');

require('dotenv').config();

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================================================
   1. CREATE RAZORPAY ORDER
========================================================= */
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Amount required'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Converted to paise + fixed floating point safety
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Returns the clean order object directly to match the frontend expectations
    res.status(200).json(order);

  } catch (error) {
    console.error('Razorpay Order Creation Failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* =========================================================
   2. VERIFY PAYMENT + BULK INSERT BOOKINGS
========================================================= */
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookings // Receives the array directly from Cart.jsx mapping
    } = req.body;

    // Strict structural parameter check
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: "Missing mandatory payment details"
      });
    }

    /* Cryptographic Signature Verification */
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        error: "Invalid payment signature verification failed"
      });
    }

    /* Safe DB Batch Operation */
    let insertedBookings = null;

    if (bookings && bookings.length > 0) {
      // Maps fields directly into clean key-pairs matching public.bookings database columns
      const recordsToInsert = bookings.map(item => ({
        user_id: item.user_id,
        service_title: item.service_title,
        category: item.category,
        price: parseInt(item.price, 10), // Guard against rogue floating strings
        address: item.address,
        booking_date: item.booking_date
      }));

      const { data, error } = await supabase
        .from('bookings')
        .insert(recordsToInsert) // Supabase naturally bulk inserts clean object arrays
        .select();

      if (error) throw error;
      insertedBookings = data;
    }

    // Returns success structure checked by frontend validation loop
    return res.status(200).json({
      success: true,
      message: 'Payment verified and bookings stored successfully',
      bookings: insertedBookings
    });

  } catch (error) {
    console.error('Verification/Database Insertion Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;