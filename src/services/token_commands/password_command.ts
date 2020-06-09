import TokenCommand from './token_command';
import AuthService from '../auth';

export class PasswordCommand implements TokenCommand {
  private email: string;

  private password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  public execute() {
    AuthService.changePassword(this.email, this.password);
  }
}

export default PasswordCommand;
