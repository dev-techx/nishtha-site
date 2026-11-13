/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        library: {
          bg: '#f5efe0',
          'bg-dark': '#e8dfc8',
          'wood-dark': '#3d2b1f',
          'wood-mid': '#5c3d2e',
          'wood-light': '#8b6f47',
          shelf: '#6b4423',
          gold: '#b8860b',
          'gold-light': '#d4a017',
          leather: '#4a3728',
          cream: '#faf6ed',
          ink: '#2c2016',
          red: '#8b3a3a',
          green: '#3d5a3d',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        ui: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
