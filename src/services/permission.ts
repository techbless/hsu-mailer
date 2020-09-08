import Permission from '../models/permission';

class PermissionService {
  public getPermissions(subscriberId: number) {
    return Permission.findOne({
      where: {
        subscriberId,
      },
    });
  }
}

export default new PermissionService();
