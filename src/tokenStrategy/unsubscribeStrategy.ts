import TokenStrategy from './tokenStrategy';
import SubscriptionService from '../services/subscription';

export class UnSubscribeStrategy implements TokenStrategy {
  public doTasks(email: string) {
    SubscriptionService.unsubscribe(email);
  }
}
