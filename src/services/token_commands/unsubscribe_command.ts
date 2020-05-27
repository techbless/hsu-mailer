import TokenCommand from './token_command';
import SubscriptionService from '../subscription';

class UnSubscribeCommand implements TokenCommand {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  public execute() {
    SubscriptionService.unsubscribe(this.email);
  }
}
