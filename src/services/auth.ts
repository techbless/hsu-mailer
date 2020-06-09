import Subscriber from '../models/subscriber';
import SubscriptionService from '../services/subscription';

class AuthService {
  public async changePassword(email: string, newPassword: string) {
    const subscriber = await SubscriptionService.findSubscriberByEmail(email);
    subscriber!.password = newPassword;

    subscriber!.save();
  }
}

export default new AuthService();
