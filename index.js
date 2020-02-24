require('dotenv').config();
var compression = require('compression')
const express = require('express');
const storage = require('./storage');
const updateChecker = require('./updateChecker');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mailer = require('./mailer.js');
const subscribe = require('./subcribe');

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(logger('dev'));

app.set('view engine', 'ejs');

app.post('/register/email/', function(req, res) {
  const email = req.body.email;

  subscribe.requestSubscription(email)
    .then((success) => {
      if(success) {
        res.render('result', {
          title: '메일 인증',
          content: '인증메일이 발송되었습니다. 메일 인증을 마치면 구독이 완료됩니다.'
        })
      } else {
        res.render('result', {
          title: '이미 등록된 메일주소 입니다.',
          content: '이미 구독중인 메일입니다. 다시 확인해주세요.'
        });
      }

    })
    .catch((err) => {
      res.render('result', {
        title: '메일 전송 실패',
        content: '인증메일 전송에 실패했습니다.'
      });
      console.log(err);
    });
});

app.get('/verify/subscribe/:email/:token', function (req, res) {
  const email = req.params.email;
  const token = req.params.token;

  subscribe.verifyEmail(email, token)
    .then(verified => {
      if(!verified) {
        res.render('result', {
          title: '유효하지 않은 메일인증',
          content: '유효하지 않은 메일 인증입니다.'
        });
        return;
      }

      subscribe.subscribe(email)
        .then(success => {
          if(success) {
            res.render('result', {
              title: '구독 성공',
              content: '비교과 공지 알림 구독을 성공적으로 마쳤습니다. 이제 새로운 공지를 편하게 확인하세요.'
            });
            storage.updateToken(email, null);
            mailer.sendWelcomeMail([email]);
          } else {
            res.render('result', {
              title: '잘못된 메일 주소',
              content: '이미 등록된 이메일이거나 잘못된 이메일 주소입니다.'
            });
          }
        })
        .catch(err => {
          res.render('result', {
            title: '구독 실패',
            content: '구독자 리스트에 추가하는 동안 오류가 발생했습니다.'
          });
          console.log(err);
        });
    })
    .catch((err) => {
      res.render('result', {
        title: '메일 인증 실패',
        content: '메일 인증 과정에서 오류가 발생했습니다.'
      });
      console.log(err);
    })
});

app.get('/unsubscribe', function(req, res) {
  res.render('unsubscribe');
});

app.post("/unsubscribe", function(req, res) {
  const email = req.body.email;

  subscribe.requestUnsubscription(email)
    .then((success) => {
      if(success) {
        res.render('result', {
          title: '메일 인증',
          content: '인증메일이 발송되었습니다. 메일 인증을 마치면 구독취소가 완료됩니다.'
        })
      } else {
        res.render('result', {
          title: '등록되지 않은 메일주소 입니다.',
          content: '등록되지 않은 메일주소 입니다. 다시 확인해주세요.'
        });
      }

    })
    .catch((err) => {
      res.render('result', {
        title: '메일 전송 실패',
        content: '인증메일 전송에 실패했습니다.'
      });
      console.log(err);
    });
});

app.get('/verify/unsubscribe/:email/:token', function(req, res) {
  const email = req.params.email;
  const token = req.params.token;

  subscribe.verifyEmail(email, token)
    .then(verified => {
      if (!verified) {
        res.render('result', {
          title: '유효하지 않은 메일인증',
          content: '유효하지 않은 메일 인증입니다.'
        });
        return;
      }

      subscribe.unsubscribe(email)
        .then(success => {
          if(success) {
            res.render('result', {
              title: '구독 취소 완료',
              content: '비교과 공지 알림 구독을 성공적으로 취소했습니다. 더 이상 새로운 공지 알림을 받을 수 없습니다.'
            });
          } else {
            res.render('result', {
              title: '구독 취소 실패',
              content: '구독된 이메일이 아니거나 잘못된 이메일 주소입니다.'
            });
          }
        })
        .catch(err => {
          res.render('result', {
            title: '구독 취소 실패',
            content: '구독자 리스트에서 삭제하는 동안 오류가 발생했습니다.'
          });
          console.log(err);
        });

    })
    .catch((err) => {
      res.render('result', {
        title: '메일 인증 실패',
        content: '메일 인증 과정에서 오류가 발생했습니다.'
      });
      console.log(err);
    })
});

app.listen(process.env.PORT, function() {
  console.log('Server Started!');
  updateChecker.checkNewPost()
    .catch(err => {
      console.log("Error occurred at first check.");
      console.log(err);
    })
});

//----------- Upper web, Lower service -----------

//setInterval(updateChecker.checkNewPost, 10 * 60 * 1000);
setInterval(async() => {
  await updateChecker.checkNewPost();
}, 10 * 60 * 1000);