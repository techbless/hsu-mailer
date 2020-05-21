import * as crypto from 'crypto';
import Token from '../models/token';

class TokenService {
  public async issueToken(emailId: number) {
    const token = crypto.randomBytes(64).toString('hex');

    const issuedToken = await Token.create({
      token,
      emailId,
    });

    return issuedToken.token;
  }
}

export default new TokenService();
