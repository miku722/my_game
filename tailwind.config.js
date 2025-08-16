/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'museum-blue': '#1e40af',
        'artifact-gold': '#f59e0b',
        'ancient-purple': '#7c3aed',
        'danger-red': '#dc2626'
      },
      fontFamily: {
        'chinese': ['PingFang SC', 'Microsoft YaHei', 'sans-serif']
      },
      animation: {
        'portal': 'portal 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      }
    },
  },
  plugins: [],
}