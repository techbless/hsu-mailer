/* eslint-disable no-unused-expressions */
//  eslint-disable-next-line spaced-comment
/// <reference path="../@types/express.d.ts" />

import * as dotenv from 'dotenv';

dotenv.config();

import { expect } from 'chai';
import * as request from 'supertest';
import { sequelize } from '../models/index';
import app from '../app';
import User from '../models/user';

describe('typescript-express starter', () => {
  let req: request.SuperTest<request.Test>;

  before(async () => {
    await sequelize.sync();
    req = request(app);
  });


  describe('public/css/common.css', () => {
    it('GET /css/common.css status code should be 200', async () => {
      await req.get('/css/common.css').expect(200);
    });
  });

  describe('veiws/index.ejs', () => {
    it('GET / status code should be 200', async () => {
      await req.get('/').expect(200);
    });

    it('GET / should return "Hello, Guest"', async () => {
      const result = await req.get('/');

      // const isNormalIndexPage = result.text.search('Hello, Guest') !== -1;
      // expect(isNormalIndexPage).to.be.true;
      expect(result.text).includes('Hello, Guest');
    });
  });

  describe('register', () => {
    it('GET /register', async () => {
      await req.get('/register').expect(200);
    });

    it('POST /register', async () => {
      const result = await req.post('/register')
        .send({
          username: 'test',
          password: '1234',
          email: 'test@email.com',
          firstname: 'first',
          lastname: 'last',
        })
        .expect(200);

      const UserId: number = result.body;
      expect(result.body.userId).to.be.a('number');

      const user = await User.findOne({
        where: {
          userId: UserId,
        },
      });
      expect(user).not.to.be.undefined;
    });

    after(async () => {
      await User.destroy({
        where: {
          userName: 'test',
          password: '1234',
        },
      });
    });
  });

  describe('login', () => {
    it('GET /login', async () => {
      await req.get('/login').expect(200);
    });

    before(async () => {
      await User.create({
        userName: 'test',
        password: '1234',
        email: 'test@email.com',
      });
    });

    it('POST /login with invalid username', async () => {
      const result = await req.post('/login')
        .send({
          username: 'wrong',
          password: '1234',
        })
        .expect(302)
        .expect('Location', '/login');
    });

    it('POST /login with invalid password', async () => {
      const result = await req.post('/login')
        .send({
          username: 'test',
          password: 'wrong',
        })
        .expect(302)
        .expect('Location', '/login');
    });

    it('POST /login with all valid account', async () => {
      const result = await req.post('/login')
        .send({
          username: 'test',
          password: '1234',
        })
        .expect(302)
        .expect('Location', '/');
    });

    after(async () => {
      await User.destroy({
        where: {
          userName: 'test',
          password: '1234',
        },
      });
    });
  });
});
