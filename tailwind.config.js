/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66aaf9',
          400: '#338ef7',
          500: '#0072f5', // Main blue for navigation
          600: '#005bc4',
          700: '#004493',
          800: '#002e62',
          900: '#001731',
        },
        success: {
          50: '#e8f8f0',
          100: '#d1f1e1',
          200: '#a3e3c3',
          300: '#76d5a5',
          400: '#48c787',
          500: '#1ab369', // Green for completed tasks
          600: '#158f54',
          700: '#106b3f',
          800: '#0a482a',
          900: '#052415',
        },
        warning: {
          50: '#fef9e6',
          100: '#fdf3cd',
          200: '#fbe79b',
          300: '#f9db69',
          400: '#f7cf37',
          500: '#f5c305', // Yellow for pending tasks
          600: '#c49c04',
          700: '#937503',
          800: '#624e02',
          900: '#312701',
        },
        info: {
          50: '#e6fcff',
          100: '#cdf9ff',
          200: '#9bf3ff',
          300: '#68ecff',
          400: '#36e6ff',
          500: '#04e0ff', // Cyan for completion rate
          600: '#03b3cc',
          700: '#028699',
          800: '#015a66',
          900: '#002d33',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // ...other plugins
  ],
}
