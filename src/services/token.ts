import * as crypto from 'crypto';
import Token from '../models/token';

class TokenService {
  public async issueToken() {
    const token = crypto.randomBytes(64).toString('hex');

    return Token.create({
      token,
    });
  }
}

export default new TokenService();
