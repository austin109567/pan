import { TwitterProfile } from '../types/twitter';

class TwitterService {
  private static instance: TwitterService;
  private readonly TWITTER_API_URL = 'https://api.twitter.com/2';
  private readonly CLIENT_ID = 'your_client_id'; // Replace with your Twitter API credentials
  private readonly REDIRECT_URI = `${window.location.origin}/twitter-callback`;

  private constructor() {}

  static getInstance(): TwitterService {
    if (!TwitterService.instance) {
      TwitterService.instance = new TwitterService();
    }
    return TwitterService.instance;
  }

  initiateOAuth(): void {
    const scope = 'tweet.read users.read';
    const state = this.generateRandomState();
    localStorage.setItem('twitter_oauth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope,
      state,
      code_challenge: 'challenge', // In production, generate a proper PKCE challenge
      code_challenge_method: 'plain'
    });

    window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  async handleCallback(code: string, state: string): Promise<TwitterProfile | null> {
    const savedState = localStorage.getItem('twitter_oauth_state');
    if (!savedState || savedState !== state) {
      throw new Error('Invalid state parameter');
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.REDIRECT_URI,
          client_id: this.CLIENT_ID,
          code_verifier: 'challenge', // In production, use the same value used for code_challenge
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const { access_token } = await tokenResponse.json();

      // Get user profile
      const userResponse = await fetch(`${this.TWITTER_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await userResponse.json();
      
      return {
        id: userData.data.id,
        username: userData.data.username,
        name: userData.data.name,
        profileImageUrl: userData.data.profile_image_url,
        verified: userData.data.verified,
      };
    } catch (error) {
      console.error('Twitter OAuth error:', error);
      return null;
    } finally {
      localStorage.removeItem('twitter_oauth_state');
    }
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

export const twitterService = TwitterService.getInstance();