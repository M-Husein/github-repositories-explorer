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
        '1': '1',
        '1030': '1030',
        '1040': '1040',
        '1041': '1041',
      },
      width: {
        'calc-screen--165px': 'calc(100vw - 165px)',
      },
      minWidth: {
        '400px': '400px',
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
