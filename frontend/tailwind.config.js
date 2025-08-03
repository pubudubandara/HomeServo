/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#218838',
          'green-hover': '#28a745',
        },
        background: {
          light: '#F6FAF9',
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#6b7280',
        },
        border: {
          light: '#e5e7eb',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'custom-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'custom-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'custom-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'custom-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'custom-sm': '6px',
        'custom-md': '8px',
        'custom-lg': '12px',
        'custom-xl': '16px',
        'custom-2xl': '24px',
      },
      backdropBlur: {
        'custom': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}
