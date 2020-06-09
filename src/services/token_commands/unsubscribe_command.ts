import TokenCommand from './token_command';
import SubscriptionService from '../subscription';
import ReceivingDayService from '../receiving_days';
import Subscriber from '../../models/subscriber';

export class UnSubscribeCommand implements TokenCommand {
  private subscriber: Subscriber;

  constructor(subscriber: Subscriber) {
    this.subscriber = subscriber;
  }

  public async execute() {
    await ReceivingDayService.removeReceivingDays(this.subscriber.subscriberId);
    await SubscriptionService.unsubscribe(this.subscriber);
  }
}

export default UnSubscribeCommand;
