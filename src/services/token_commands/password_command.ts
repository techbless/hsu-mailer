import TokenCommand from './token_command';
import AuthService from '../auth';
import Subscriber from '../../models/subscriber';

export class PasswordCommand implements TokenCommand {
  private subscriber: Subscriber;

  private password: string;

  constructor(subscriber: Subscriber, password: string) {
    this.subscriber = subscriber;
    this.password = password;
  }

  public execute() {
    AuthService.changePassword(this.subscriber, this.password);
  }
}

export default PasswordCommand;
