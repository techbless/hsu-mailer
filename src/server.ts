import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();

import UpdateChecker from './modules/updateChecker';
import { sequelize } from './models/index';
import app from './app';

sequelize.sync({ force: false })
  .then(async () => {
    const updateChecker = new UpdateChecker('http://www.hansung.ac.kr/web/www/1323');
    await updateChecker.initialize();
    updateChecker.checkEvery(10); // min

    const PORT: number = +process.env.PORT! || 3000;
    app.listen(PORT, (err) => {
      if (err) throw err;
      else console.log('Server Start: Listen on port ', PORT);
    });
  })
  .catch(() => {
    console.log('There were some error during sequelize.sync()');
  });
