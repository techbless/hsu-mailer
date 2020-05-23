import * as crypto from 'crypto';
import Token, { Purpose } from '../models/token';

import SubscriptionService from './subscription';

class TokenService {
  public async issueToken(subscriberId: number, purposeOrNull: Purpose) {
    const token = crypto.randomBytes(64).toString('hex');

    const issuedToken = await Token.create({
      token,
      subscriberId,
      purpose: purposeOrNull,
    });

    return issuedToken.token;
  }

  public async verifyToken(email: string, tokenFromLink: string, purpose: Purpose) {
    const subscriber = await SubscriptionService.findSubscriberByAddress(email);

    if (!subscriber) {
      return false;
    }

    const token = await subscriber.getTokens({
      where: {
        token: tokenFromLink,
        purpose,
      },
    });

    // if the token exists here, the verification is valid.
    if (token.length <= 0) {
      return false;
    }

    token[0].destroy();
    subscriber.isVerified = true;
    subscriber.save();

    return true;
  }
}

export default new TokenService();
