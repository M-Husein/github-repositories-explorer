/** @type {import('tailwindcss').Config} */

module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      zIndex: {
        '1040': '1040',
        '1041': '1041',
      },
      width: {
        'calc-screen--175px': 'calc(100vw - 175px)',
      },
      minHeight: {
        'calc-screen--128px': 'calc(100vh - 128px)',
      },
      spacing: {
        '108px': '108px',
      },
    },
  },
  plugins: [],
}
