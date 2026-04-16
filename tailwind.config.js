module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Titillium Web"', 'sans-serif'],
      },
      colors: {
        // NJE Brand Colors (brandbook)
        'nje-jaffa':     { DEFAULT: '#F7941D', light: '#FBB55A', dark: '#D4780A', faint: '#FEF3E2' },
        'nje-amethyst':  { DEFAULT: '#662D91', light: '#8B52B0', dark: '#4A1D6B', faint: '#F3EDF8' },
        'nje-cyan':      { DEFAULT: '#00AEEF', light: '#40C4F5', dark: '#0090C7', faint: '#E0F6FE' },
        'nje-anthracite':{ DEFAULT: '#3C3C3B', light: '#5A5A59', dark: '#252524', faint: '#F2F2F1' },
        'nje-pearl':     { DEFAULT: '#F0EDE6', dark: '#E0DDD6', darker: '#C8C4BC' },
        // Legacy aliases (keep for backwards compat with existing component references)
        'dkk-blue':  '#00AEEF',
        'dkk-green': '#F7941D',
        'dkk-gray':  '#3C3C3B',
        'dkk-light': '#F0EDE6',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'jaffa':    '0 4px 24px 0 rgba(247,148,29,0.20)',
        'amethyst': '0 4px 24px 0 rgba(102,45,145,0.18)',
        'cyan':     '0 4px 24px 0 rgba(0,174,239,0.18)',
        'card':     '0 2px 16px 0 rgba(60,60,59,0.08)',
      },
    },
  },
  plugins: [],
};
