/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        scrapBox: 'rgb(152,196,196)',
      },
      margin: {
        "-1": "-0.7rem",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      width: {
        'canvas': '300px',
      },
      height: {
        'canvas': '200px',
      },
      aspectRatio: {
        '3/2': '3 / 2',
      },
    },
  },
  plugins: [],
}
