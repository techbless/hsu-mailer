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
        res.send('성공적으로 비교과 공지 구독을 완료했습니다.');
        mailer.sendWelcomeMail(email);
      } else {
        res.send('이미 등록된 메일로는 구독할 수 없습니다.');
      }
    })
    .catch(err => {
      console.log(err);
      res.send('비교과 공지 구독에 실패하였습니다.')
    }) 
});

app.listen(process.env.PORT, function() {
  console.log('Server Started!');
  updateChecker.checkNewPost();
});

//----------- Upper web, Lower service -----------

setInterval(updateChecker.checkNewPost, 10 * 60 * 1000);
