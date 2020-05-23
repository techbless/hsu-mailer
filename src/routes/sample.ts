import { Router, Response, Request } from 'express';
import * as passportConfig from '../config/passport';
import SampleController from '../controllers/sample';

/**
 * This is a Router templates, Duplicate this file to use.
 */
class SampleRouter {
  public router!: Router;

  constructor() {
    this.router = Router();

    this.router.get('/echo', passportConfig.isAuthenticated, SampleController.sample);
  }
}

export default new SampleRouter().router;
