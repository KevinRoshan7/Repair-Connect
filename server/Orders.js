const express = require('express');
const router = express.Router();
const supabase = require('./supabaseClient');

/* =========================================================
   1. GET USER BOOKINGS
========================================================= */
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id is required'
      });
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // 🚀 FIXED: Returns clean array directly
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching bookings:', error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* =========================================================
   2. CREATE BOOKING
========================================================= */
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      service_title,
      category,
      price,
      address,
      booking_date
    } = req.body;

    // 🛡️ FIXED: Proper validation syntax
    if (
      !user_id ||
      !service_title ||
      !category ||
      !price ||
      !address ||
      !booking_date
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields'
      });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id,
          service_title,
          category,
          price: parseInt(price, 10),
          address: address.trim(),
          booking_date: new Date(booking_date).toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      booking: data
    });

  } catch (error) {
    console.error('Error creating booking:', error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/* =========================================================
   3. DELETE BOOKING (CANCEL ORDER)
========================================================= */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Error removing booking execution entry:', error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;