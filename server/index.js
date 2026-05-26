require('dotenv').config();

const express = require('express');
const cors = require('cors');

const supabase = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://repair-connect-one.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());

/* =========================================================
   TEST ROUTES
========================================================= */

app.get('/', (req, res) => {
  res.send('RepairX Backend is running!');
});

app.get('/api/test-db', async (req, res) => {
  try {

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Connected to Supabase successfully!',
      sampleData: data
    });

  } catch (error) {

    console.error('Database connection failed:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});

/* =========================================================
   ROUTES
========================================================= */

app.use('/api/orders', require('./Orders'));
app.use('/api/payments', require('./Payments'));

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});