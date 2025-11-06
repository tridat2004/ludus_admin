/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4ed',   // Cam nhạt
          100: '#ffe6d5',  // Cam pastel
          200: '#feccaa',  // Cam sáng
          300: '#fdac74',  // Cam vàng
          400: '#fb8340',  // Cam đậm
          500: '#f9631d',  // Cam đỏ chính - VỪA PHẢI, HƠI ĐẬM
          600: '#ea4d13',  // Đỏ cam
          700: '#c23a12',  // Đỏ cam đậm
          800: '#9a3116',  // Đỏ nâu
          900: '#7c2c15',  // Nâu đỏ
          950: '#431409',  // Nâu đỏ tối
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}