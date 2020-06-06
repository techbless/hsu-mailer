import TokenCommand from './token_command';
import SubscriptionService from '../subscription';
import EmailService from '../email';

export class SubscribeCommand implements TokenCommand {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  public execute() {
    const setDefaultReceivingDays = SubscriptionService.setDefaultReceivingDays(this.email);
    const verify = SubscriptionService.verifySubscription(this.email);
    const sendMail = EmailService.sendWelcomeEmail(this.email);
    Promise.all([verify, sendMail, setDefaultReceivingDays]);
  }
}

export default SubscribeCommand;
