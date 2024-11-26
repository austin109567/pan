export const brandConfig = {
  name: "Pan Da Pan",
  domain: "pandapan.xyz",
  title: "NFT Portfolio Dashboard",
  description: "The ultimate NFT gaming experience on Solana",

  admin: {
    wallet: "8jN1XtgiuWeyNjzysYVqGZ1mPAG37sjmuCTnENz66wrs"
  },

  theme: {
    colors: {
      primary: '#E8825F',
      secondary: '#63b0ad',
      tertiary: '#ADC8E2',
      accent: {
        coral: '#D76A4C',
        teal: '#567A82',
        blue: '#6A94BE'
      },
      background: {
        light: '#F3E5C5',
        sand: '#E2CD9F',
        lavender: '#E6E5F8',
        dark: '#2F3B54',
        darker: '#242B3D'
      },
      text: {
        light: {
          primary: '#3E3534',
          secondary: '#2B3C5A',
          muted: '#567A82'
        },
        dark: {
          primary: '#E2CD9F',
          secondary: '#ADC8E2',
          muted: '#63b0ad'
        }
      }
    },
    glass: {
      light: 'rgba(232, 130, 95, 0.08)',
      dark: 'rgba(232, 130, 95, 0.05)'
    }
  },

  assets: {
    logo: {
      light: '/assets/logo-light.svg',
      dark: '/assets/logo-dark.svg'
    },
    favicon: '/vite.svg',
    defaultPfp: '/assets/defaultpfp.jpg',
    loadingScreen: '/assets/loading.png',
    music: '/assets/music/music.mp3'
  }
};