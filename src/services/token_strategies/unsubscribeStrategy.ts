import TokenStrategy from './tokenStrategy';
import SubscriptionService from '../subscription';

export class UnSubscribeStrategy implements TokenStrategy {
  public doTasks(email: string) {
    SubscriptionService.unsubscribe(email);
  }
}
