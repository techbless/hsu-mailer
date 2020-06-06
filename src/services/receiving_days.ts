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

  public async updateReceivingDays(subscriberId: number, {
    sunday, monday, tuesday, wednesday, thursday, friday, saturday,
  }: {
    sunday: boolean,
    monday: boolean,
    tuesday: boolean,
    wednesday: boolean,
    thursday: boolean,
    friday: boolean,
    saturday: boolean
  }) {
    const receivingDays = await ReceivingDays.findOne({
      where: {
        subscriberId,
      },
    });

    return receivingDays?.update({
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    });
  }
}

export default new ReceivingDayService();
