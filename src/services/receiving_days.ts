import Subscriber from '../models/subscriber';
import ReceivingDays from '../models/receiving_days';

class ReceivingDayService {
  public getReceivingDays(subscriberId: number) {
    return ReceivingDays.findOne({
      where: {
        subscriberId,
      },
    });
  }
}

export default new ReceivingDayService();
