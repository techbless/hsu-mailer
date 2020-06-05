import Subscriber from '../models/subscriber';

declare global {
  namespace Express {
    export interface User extends Subscriber { }
  }
}
