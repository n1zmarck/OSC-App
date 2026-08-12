/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'md3-float': '#38bdf8',
        'md3-bool': '#34d399',
        'md3-int': '#c084fc',
        'md3-string': '#fbbf24',
        'md3-vector': '#fb7185',
        'md3-custom': '#a855f7',
      },
    },
  },
  plugins: [],
};
