import * as AWS from 'aws-sdk';
import * as ejs from 'ejs';
import Subscriber from '../models/subscriber';
import ReceivingDays from '../models/receiving_days';

class SubscriptionService {
  public subscribe(email: string) {
    return Subscriber.create({
      email,
      isVerified: false,
    });
  }

  public async unsubscribe(email: string) {
    const subscriber = await Subscriber.findOne({
      where: {
        email,
      },
    });

    await subscriber?.destroy();
  }

  public async setDefaultReceivingDays(email: string) {
    const subscriber = await Subscriber.findOne({
      where: {
        email,
      },
    });


    ReceivingDays.create({
      subscriberId: subscriber!.subscriberId,
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
    });
  }


  public async verifySubscription(email: string) {
    const subscriber = await Subscriber.findOne({
      where: {
        email,
      },
    });

    subscriber!.isVerified = true;
    await subscriber!.save();
  }

  public async getVerifiedSubscribers() {
    return Subscriber.findAll({
      where: {
        isVerified: true,
      },
    });
  }

  public async checkSubscription(email: string) {
    const subscriber = await this.findSubscriberByEmail(email);

    if (subscriber) {
      return true;
    }
    return false;
  }

  public findSubscriberByEmail(email: string) {
    return Subscriber.findOne({
      where: {
        email,
      },
    });
  }
}

export default new SubscriptionService();
