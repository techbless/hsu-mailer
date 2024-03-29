import * as AWS from 'aws-sdk';
import * as ejs from 'ejs';
import Subscriber from '../models/subscriber';
import ReceivingDays from '../models/receiving_option';

class SubscriptionService {
  public subscribe(email: string) {
    return Subscriber.create({
      email,
      isVerified: false,
    });
  }

  public async unsubscribe(subscriber: Subscriber) {
    await subscriber.destroy();
  }

  public async setDefaultReceivingDays(subscriber: Subscriber) {
    ReceivingDays.create({
      subscriberId: subscriber!.subscriberId,
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      hansung: false,
      academic: false,
      hspoint: true,
      scholarship: false,
    });
  }

  public async changePassword(email: string, newPassword: string) {
    const subscriber = await this.findSubscriberByEmail(email);

    subscriber!.password = newPassword;
    subscriber!.save();
  }

  public async verifySubscription(subscriber: Subscriber) {
    subscriber.update({
      isVerified: true,
    });
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
