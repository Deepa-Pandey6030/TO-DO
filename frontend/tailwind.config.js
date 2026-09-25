/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Use class strategy — we toggle the "dark" class on <html>
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // All colors reference CSS variables so they respond to .dark class
        bg: {
          primary:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card:      'var(--bg-card)',
          hover:     'var(--bg-hover)',
          border:    'var(--bg-border)',
        },
        'accent-green':       'var(--accent-green)',
        'accent-green-light': 'var(--accent-green-light)',
        'accent-green-dark':  'var(--accent-green-dark)',
        'accent-green-dim':   'var(--accent-green-dim)',
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
        status: {
          todo:     'var(--status-todo)',
          progress: 'var(--status-progress)',
          done:     'var(--status-done)',
        },
      },
    },
  },
  plugins: [],
};