/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        // CONCEPT.md palette (WCAG checked there). Noon is never text on light.
        caliche: '#EDECE6',
        limestone: '#E1DFD6',
        ink: '#15211B',
        cedar: '#4D5852',
        boxwood: { DEFAULT: '#2E5A2C', deep: '#244A23' },
        noon: '#F2B53A',
        grass: '#A9B3AD',
        leaf: '#8FC08A',
        line: 'rgb(21 33 27 / 0.14)',
        rule: 'rgb(21 33 27 / 0.22)',
        control: 'rgb(21 33 27 / 0.55)',
      },
      fontFamily: {
        sans: ['"Libre Franklin"', '"Libre Franklin Fallback"', 'Arial', 'sans-serif'],
        display: ['Besley', '"Besley Fallback"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"JetBrains Mono Fallback"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        btn: '4px',
      },
      maxWidth: {
        prose: '62ch',
      },
    },
  },
  plugins: [],
};
