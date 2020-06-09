import Subscriber from '../models/subscriber';

class AuthService {
  public async changePassword(subscriber: Subscriber, newPassword: string) {
    subscriber.update({
      password: newPassword,
    });
  }
}

export default new AuthService();
