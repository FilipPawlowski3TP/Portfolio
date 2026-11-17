/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0c',
        surface: '#0f0f13',
        elevated: '#141419',
        line: 'rgba(255,255,255,0.08)',
        ink: '#F2F2F0',
        muted: '#9A9AA3',
        accent: '#D8FF3E',
        danger: '#FF6B6B',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 7.2vw, 6.75rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-l': ['clamp(2.125rem, 5.2vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-m': ['clamp(1.625rem, 3.4vw, 2.875rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-s': ['clamp(1.25rem, 2.1vw, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        content: '80rem',
        prose: '40rem',
      },
      transitionTimingFunction: {
        swift: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.82)' },
        },
        'line-grow': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        marquee: 'marquee 36s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'line-grow': 'line-grow 1.6s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
