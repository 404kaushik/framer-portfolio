/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'grid-pattern': "url('data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(255 255 255 / 0.1)\'%3e%3cpath d=\'M0 .5H31.5V32'/%3e%3c/svg%3e')",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        gothic: ['"Century Gothic"', "sans-serif"],
      },
      colors: {
        background: '#0a0a0a',
        foreground: '#f5f5f5',
        accent: '#a3a3a3',
      },
      keyframes: {
          "fade-in": {
              "0%": {
                  opacity: 0
              },
              "100%": {
                  opacity: 1
              },
          },
          "fade-in-up": {
              "0%": {
                  opacity: 0,
                  transform: "translate3d(0, 100%, 0)",
              },
              "100%": {
                  opacity: 1,
                  transform: "translate3d(0, 0, 0)",
              },
          },
        },
        animation: {
          "fade-in": "fade-in 0.3s ease both",
          "fade-in-up": "fade-in-up 0.3s ease both",
        },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};