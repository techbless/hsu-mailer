import TokenCommand from './token_command';
import SubscriptionService from '../../services/subscription';
import ReceivingOptionService from '../../services/receiving_option';
import Subscriber from '../../models/subscriber';

export class UnSubscribeCommand implements TokenCommand {
  private subscriber: Subscriber;

  constructor(subscriber: Subscriber) {
    this.subscriber = subscriber;
  }

  public async execute() {
    await ReceivingOptionService.removeReceivingOption(this.subscriber.subscriberId);
    await SubscriptionService.unsubscribe(this.subscriber);
  }
}

export default UnSubscribeCommand;
