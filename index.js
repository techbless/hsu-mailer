require('dotenv').config();
const express = require('express');
const storage = require('./storage');
const updateChecker = require('./updateChecker');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mailer = require('./mailer.js');
const subscribe = require('./subcribe');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(logger('dev'));

app.post('/register/email/', function(req, res) {
  const email = req.body.email;

  subscribe.requestSubscription(email)
    .then((success) => {
      if(success) {
        res.send('인증메일이 발송되었습니다. 메일 인증을 마치면 구독이 완료됩니다.');
      } else {
        res.send('이미 구독된 메일은 중복 등록할 수 없습니다.');
      }

    })
    .catch((err) => {
      res.send('인증메일 전송에 실패했습니다.');
      console.log(err);
    });
});

app.get('/verify/email/:email/:token', function (req, res) {
  const email = req.params.email;
  const token = req.params.token;

  subscribe.verifyEmail(email, token)
    .then(verified => {
      if(!verified) {
        res.send('유효하지 않은 메일 인증입니다.');
      }

      subscribe.subscribe(email)
        .then(success => {
          if(success) {
            res.send('비교과 공지 알림 구독을 성공적으로 마쳤습니다. 이제 새로운 공지를 편하게 확인하세요.');
            mailer.sendWelcomeMail(email);
          } else {
            res.send('잘못된 메일이거나 이미 등록된 메일입니다.');
          }
        })
        .catch(err => {
          res.send('구독 리스트에 추가하는 과정에서 오류가 발생하였습니다.');
          console.log(err);
        });
    })
    .catch((err) => {
      res.send('메일 인증 과정에서 오류가 발생하였습니다.');
      console.log(err);
    })
});

app.listen(process.env.PORT, function() {
  console.log('Server Started!');
  updateChecker.checkNewPost();
});

//----------- Upper web, Lower service -----------

setInterval(updateChecker.checkNewPost, 10 * 60 * 1000);
