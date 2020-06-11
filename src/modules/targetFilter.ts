import Subscriber from '../models/subscriber';

type DAYS = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

class TargetFilter {
  public async filterByWeekDays(subscribers: Subscriber[]) {
    const DAY_OF_WEEK: DAYS[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    const now = new Date();
    const todayDayOfWeek = DAY_OF_WEEK[now.getDay()];
    console.log(todayDayOfWeek);

    const filteredSubscribers: Subscriber[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for await (const subscriber of subscribers) {
      const receivingDay = await subscriber.getReceivingDay();
      if (receivingDay[todayDayOfWeek]) {
        filteredSubscribers.push(subscriber);
      }
    }

    return filteredSubscribers;
  }
}

export default new TargetFilter();
