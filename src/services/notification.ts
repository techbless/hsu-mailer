import Notification from '../models/notification';

class NotificationHistoryService {
  public async getLatestIdx(notificationType: string) {
    const latestNotification = await Notification.findOne({
      order: [['webpostIdx', 'DESC']],
      where: { notificationType },
    });

    return latestNotification!.webpostIdx;
  }

  public addHistory(webpostIdx: number, title: string, link: string, notificationType: string) {
    Notification.create({
      webpostIdx,
      title,
      link,
      notificationType,
    });
  }
}

export default new NotificationHistoryService();
