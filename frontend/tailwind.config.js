/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'anime-purple': '#8B5CF6',
        'anime-pink': '#EC4899',
        'anime-blue': '#3B82F6',
        'anime-cyan': '#06B6D4',
        'anime-gold': '#F59E0B',
        'battle-dark': '#0F0F1A',
        'battle-card': '#1A1A2E',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'power-surge': 'power-surge 0.5s ease-out',
        'lightning': 'lightning 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'reverse-spin': 'reverse-spin 8s linear infinite',
      },
      keyframes: {
        'reverse-spin': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        'power-surge': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'lightning': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'anime-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'battle-gradient': 'linear-gradient(180deg, #0F0F1A 0%, #1A1A2E 50%, #16213E 100%)',
      },
    },
  },
  plugins: [],
}
