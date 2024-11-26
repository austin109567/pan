/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        sand: {
          50: '#f5f4ef',
          100: '#e0dbc6',
          200: '#d6d1b8',
          300: '#ccc6aa',
          400: '#c2bc9c',
          500: '#b8b28e',
          600: '#aea880',
          700: '#a49e72',
          800: '#9a9464',
          900: '#908a56',
          950: '#868048',
        },
        background: {
          50: '#f5f4ef',
          100: '#e0dbc6',
          200: '#d6d1b8',
          300: '#ccc6aa',
          400: '#c2bc9c',
          500: '#b8b28e',
          600: '#aea880',
          700: '#a49e72',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        display: ['Cal Sans', 'Inter var', 'sans-serif'],
        sans: ['Inter', 'system-ui'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'container-glow': 'container-glow 4s ease-in-out infinite',
        'slowBounce': 'slowBounce 2s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        'container-glow': {
          '0%, 100%': {
            boxShadow: '0 0 15px -3px rgba(249, 115, 22, 0.3)',
            borderColor: 'rgba(249, 115, 22, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 30px -3px rgba(249, 115, 22, 0.4)',
            borderColor: 'rgba(249, 115, 22, 0.4)',
          },
        },
        slowBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(15%)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(249, 115, 22, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
      },
      boxShadow: {
        'glow': '0 0 50px -12px rgb(249 115 22 / 0.25)',
        'glow-lg': '0 0 100px -12px rgb(249 115 22 / 0.25)',
        'glow-sm': '0 0 15px -3px rgba(249, 115, 22, 0.3)',
        'glow-xl': '0 0 70px -15px rgba(249, 115, 22, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwindcss-animate'),
  ],
}
