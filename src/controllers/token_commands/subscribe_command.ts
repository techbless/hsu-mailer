import TokenCommand from './token_command';
import SubscriptionService from '../../services/subscription';
import EmailService from '../../services/email';
import Subscriber from '../../models/subscriber';

export class SubscribeCommand implements TokenCommand {
  private subscriber: Subscriber;

  constructor(subscriber: Subscriber) {
    this.subscriber = subscriber;
  }

  public execute() {
    const setDefaultReceivingDays = SubscriptionService.setDefaultReceivingDays(this.subscriber);
    const verify = SubscriptionService.verifySubscription(this.subscriber);
    const sendMail = EmailService.sendWelcomeEmail(this.subscriber.email);
    Promise.all([verify, sendMail, setDefaultReceivingDays]);
  }
}

export default SubscribeCommand;
