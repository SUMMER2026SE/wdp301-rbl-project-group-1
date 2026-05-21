import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOAuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid token');
    }

    return {
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
      googleId: payload.sub,
      emailVerified: payload.email_verified,
    };
  }
}
