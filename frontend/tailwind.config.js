/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    extend: {
      colors: {
        // HFTS Retro-Neon Palette
        'hfts-navy': '#0F1419',
        'hfts-teal': '#1BA087',
        'hfts-orange': '#FF6B35',
        'hfts-coral': '#FF3F5D',
        'hfts-gold': '#FFD700',
        'hfts-cream': '#F8F7F5',
      },
      fontFamily: {
        'display': ['Space Mono', 'monospace'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      backgroundImage: {
        'gradient-navy-to-teal': 'linear-gradient(135deg, #0F1419 0%, #1BA087 100%)',
        'gradient-orange-coral': 'linear-gradient(135deg, #FF6B35 0%, #FF3F5D 100%)',
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(27, 160, 135, 0.3)',
        'neon-glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
    },
  },
  plugins: [],
}

