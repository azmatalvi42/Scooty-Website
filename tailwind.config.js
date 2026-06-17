/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      // Targets phones in landscape (wide but short)
      'ls': { raw: '(orientation: landscape) and (max-height: 500px)' },
    },
    extend: {
      colors: {
        // Primary brand yellow — Scooty #FEC001
        primary: {
          50:  '#FFFDE0',
          100: '#FFF9B3',
          200: '#FFF280',
          300: '#FFE540',
          400: '#FFD00F',
          500: '#FEC001',   // ← Scooty brand yellow
          600: '#DFA400',
          700: '#B88400',
          800: '#8A6400',
          900: '#5C4200',
        },
        // Neutral / surface greys
        secondary: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Brand accent palette — use ONLY for gradients / hovers / glows
        brand: {
          yellow:     '#FEC001',
          turquoise:  '#01FEC0',
          ultramarine:'#4101FE',
          purple:     '#C001FE',
          sky:        '#01BDFE',
          green:      '#01FE01',
          orange:     '#FE4601',
          pink:       '#FE01BE',
          red:        '#FE0101',
        },
        // Dark surface hierarchy
        navy: {
          900: '#000000',
          800: '#0A0A0A',
          700: '#111111',
          600: '#141414',
        },
      },
      fontFamily: {
        sans:    ['Avenir', 'Avenir Next', 'Nunito Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Avenir', 'Avenir Next', 'Nunito Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Editorial serifs — scoped to the Blog ("The Ride Log") newspaper UI
        masthead: ['Fraunces', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        news:     ['"Source Serif 4"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-out',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-slow':  'bounce 2.5s infinite',
        'counter':      'counter 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 2.2s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'glow-pulse':   'glowPulse 2.5s ease-in-out infinite',
        'marquee':      'marquee 32s linear infinite',
        'marquee-slow': 'marquee 48s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        counter: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(254,192,1,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(254,192,1,0.6)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'expo-out':   'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-soft':'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        'brand':   '0 0 32px rgba(254,192,1,0.25)',
        'brand-lg':'0 0 56px rgba(254,192,1,0.35)',
        'glow-sm': '0 0 16px rgba(254,192,1,0.2)',
      },
    },
  },
  plugins: [],
};
