import UserModel from '../models/email';

declare global {
  namespace Express {
    export interface User extends UserModel { }
  }
}
