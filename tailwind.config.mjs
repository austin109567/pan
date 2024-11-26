import scrollbar from 'tailwind-scrollbar';
import animate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        title: ['Archivo Black', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          dark: '#1a1a1a',
          main: '#f7931a',
          light: '#ffa940',
        },
        background: {
          // Light theme - sandy, warm colors
          light: '#FAF1E4',     // Light sand base
          lighter: '#FFF8ED',   // Lighter sand
          'light-accent': '#F5E6D3', // Warm accent
          // Dark theme - deeper, richer
          dark: '#1E1F2B',     // Rich navy
          darker: '#171822',    // Deeper navy
          'dark-accent': '#252632', // Navy accent
          // Sand theme colors
          sand: '#F5E6D3',      // Base sand color
          'sand-light': '#FAF1E4', // Light sand
          'sand-dark': '#E6D5BC',  // Dark sand
          lavender: '#E6E6FA'    // Lavender accent
        },
        text: {
          light: {
            primary: '#2C1810',    // Deep warm brown
            secondary: '#4A3F39',   // Warm gray
            muted: '#6B5D54'       // Muted warm gray
          },
          dark: {
            primary: '#FFFFFF',     // Pure white
            secondary: '#E5E5E5',   // Light gray
            muted: '#A0A0A0'       // Medium gray
          }
        },
        card: {
          light: {
            background: '#FAF1E4',  // Light sand
            hover: '#F5E6D3',      // Medium sand
            border: '#E6D5BC'      // Dark sand
          },
          dark: {
            background: '#252632',  // Lighter navy
            hover: '#2A2B38',      // Even lighter
            border: '#32333F'      // Light border
          }
        },
        accent: {
          sand: {
            light: '#FAF1E4',   // Lightest sand
            DEFAULT: '#F5E6D3', // Medium sand
            dark: '#E6D5BC'     // Darker sand
          },
          warm: {
            light: '#FFB088',   // Light coral
            DEFAULT: '#E8825F', // Coral
            dark: '#D15F36'     // Dark coral
          }
        },
        bitcoin: {
          light: '#f7931a',
          DEFAULT: '#f7931a',
          dark: '#e17f0e',
        },
        neon: {
          orange: '#ff7b00',
          glow: '#ff9933',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-15px, 15px)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(10px, -10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'hologram': {
          '0%, 100%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            filter: 'hue-rotate(0deg)'
          },
          '25%': {
            transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)',
            filter: 'hue-rotate(45deg)'
          },
          '50%': {
            transform: 'perspective(1000px) rotateX(-2deg) rotateY(2deg)',
            filter: 'hue-rotate(90deg)'
          },
          '75%': {
            transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)',
            filter: 'hue-rotate(45deg)'
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-medium': 'float-medium 5s ease-in-out infinite',
        'float-fast': 'float-fast 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'hologram': 'hologram 3s ease infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      boxShadow: {
        'card': '0 2px 4px rgba(44, 24, 16, 0.05)',
        'card-hover': '0 4px 6px rgba(44, 24, 16, 0.1)',
        'glow': '0 0 20px rgba(232, 130, 95, 0.2)',
        'glow-strong': '0 0 30px rgba(232, 130, 95, 0.3)',
        'neon': '0 0 10px rgba(255, 123, 0, 0.3)',
        'neon-strong': '0 0 20px rgba(255, 123, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'aero': '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [
    scrollbar({ nocompatible: true }),
    animate,
  ],
};