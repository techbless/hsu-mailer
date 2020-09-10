import Subscriber from '../models/subscriber';
import { NotificationType } from '../models/receiving_option';

type DAYS = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

class TargetFilter {
  public async filter(subscribers: Subscriber[], notificationType: NotificationType) {
    const DAY_OF_WEEK: DAYS[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    const now = new Date();
    const todayDayOfWeek = DAY_OF_WEEK[now.getDay()];

    const filteredSubscribers: Subscriber[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const subscriber of subscribers) {
      const receivingOption = await subscriber.getReceivingOption();
      if (receivingOption[todayDayOfWeek] && receivingOption[notificationType]) {
        filteredSubscribers.push(subscriber);
      }
    }

    return filteredSubscribers;
  }
}

export default new TargetFilter();
