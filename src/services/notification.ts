import Notification from '../models/notification';

class NotificationHistoryService {
  public async getLatestIdx() {
    const latestNotification = await Notification.findOne({
      order: [['webpostIdx', 'DESC']],
    });

    return latestNotification!.webpostIdx;
  }

  public addHistory(webpostIdx: number, title: string, link: string) {
    Notification.create({
      webpostIdx,
      title,
      link,
    });
  }
}

export default new NotificationHistoryService();
