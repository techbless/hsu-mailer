require('dotenv').config();
const express = require('express');
const storage = require('./storage');
const updateChecker = require('./updateChecker');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mailer = require('./mailer.js');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(logger('dev'));

app.post('/register/email/', function(req, res) {
  const email = req.body.email;
  storage.addNewMAil(email)
    .then(wasSuccess => {
      if(wasSuccess) {
        res.send('성공적으로 메일링 리스트에 추가되었습니다.');
        mailer.sendWelcomeMail(email);
      } else {
        res.send('메일 주소가 정확한지 확인한 후 다시 시도해주세요.');
      }
    })
});

app.listen(3550, function() {
  console.log('Server Started!');
});

//----------- Upper web, Lower service -----------


updateChecker.updateLatestIdxLog();
updateChecker.checkNewPost();

setInterval(updateChecker.updateLatestIdxLog, 5 * 60 * 1000);
setInterval(updateChecker.checkNewPost, 10 * 60 * 1000);
