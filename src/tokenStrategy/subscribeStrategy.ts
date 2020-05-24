import TokenStrategy from './tokenStrategy';
import SubscriptionService from '../services/subscription';
import EmailService from '../services/email';

export class SubscribeStrategy implements TokenStrategy {
  public doTasks(email: string) {
    const verify = SubscriptionService.verifySubscription(email);
    const sendMail = EmailService.sendWelcomeEmail(email);
    Promise.all([verify, sendMail]);
  }
}
