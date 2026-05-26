import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import logoAsset from './assets/logo.png';

const faviconElement =
  document.getElementById('favicon');

if (faviconElement) {
  faviconElement.href = logoAsset;
}

/* =========================================
   LOAD RAZORPAY SCRIPT SAFELY
========================================= */

const existingScript = document.querySelector(
  'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
);

if (!existingScript) {
  const script = document.createElement('script');

  script.src =
    'https://checkout.razorpay.com/v1/checkout.js';

  script.async = true;

  document.body.appendChild(script);
}

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <App />
);