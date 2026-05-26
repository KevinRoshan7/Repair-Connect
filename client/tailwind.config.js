/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Enabling class-based dark mode so you have perfect control over theme states
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Minimalist SaaS Dark Palette
        brand: {
          bg: '#09090b',         // Deep slate black base canvas (Zinc 950)
          surface: '#18181b',    // Lighter elevated card/container background (Zinc 900)
          muted: '#27272a',      // Subtle dividers, borders, and disabled states (Zinc 800)
          accent: '#3b82f6',     // Premium Royal Blue focal color
          accentHover: '#2563eb',// Deep blue hover state
          textMain: '#f4f4f5',   // High-contrast primary text (Zinc 100)
          textSub: '#a1a1aa',    // Crisp secondary/muted text (Zinc 400)
        }
      },
      animation: {
        // Butter-smooth hardware accelerated entry/fade animations
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        // Custom "butter" easing function for transitions
        'butter': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}