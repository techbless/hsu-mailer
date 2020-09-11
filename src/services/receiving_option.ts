import Subscriber from '../models/subscriber';
import ReceivingOption from '../models/receiving_option';

class ReceivingDayService {
  public getReceivingOption(subscriberId: number) {
    return ReceivingOption.findOne({
      where: {
        subscriberId,
      },
    });
  }

  public async removeReceivingOption(subscriberId: number) {
    const receivingOption = await this.getReceivingOption(subscriberId);

    receivingOption!.destroy();
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
    const receivingOption = await ReceivingOption.findOne({
      where: {
        subscriberId,
      },
    });

    return receivingOption?.update({
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    });
  }

  public async updateReceivingType(subscriberId: number, {
    hansung, academic, hspoint, scholarship,
  }: {
    hansung: boolean,
    academic: boolean,
    hspoint: boolean,
    scholarship: boolean,
  }) {
    const receivingOption = await ReceivingOption.findOne({
      where: {
        subscriberId,
      },
    });

    return receivingOption?.update({
      hansung, academic, hspoint, scholarship,
    });
  }
}

export default new ReceivingDayService();
