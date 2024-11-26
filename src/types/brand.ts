export interface BrandConfig {
  name: string;
  domain: string;
  title: string;
  description: string;

  social: {
    twitter: string;
    discord: string;
    github: string;
  };

  colors: {
    primary: {
      pink: string;
      coral: string;
      brown: string;
      blue: string;
      gold: string;
    };
    accent: {
      yellow: string;
      orange: string;
      teal: string;
      purple: string;
    };
    theme: {
      light: {
        background: string;
        card: string;
        text: {
          primary: string;
          secondary: string;
          muted: string;
        };
      };
      dark: {
        background: string;
        card: string;
        text: {
          primary: string;
          secondary: string;
          muted: string;
        };
      };
    };
  };

  fonts: {
    primary: string;
    display: string;
  };

  collection: {
    address: string;
    name: string;
  };

  admin: {
    wallet: string;
  };

  assets: {
    logo: string;
    favicon: string;
    defaultPfp: string;
    loadingScreen: string;
    music: string;
  };

  effects: {
    glassBlur: 'sm' | 'md' | 'lg' | 'xl';
    animationDuration: number;
    hoverScale: number;
  };

  rpc: {
    defaultEndpoint: string;
    defaultApiKey: string;
  };
}