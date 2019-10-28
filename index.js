request = require('request');
cheerio = require('cheerio');
fs = require('fs');
mailer = require('./mailer.js');
conn = require('./db');
express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/register/email', function(req, res) {
  var sig = req.query.sig;
  var code = sig.split('*')[0];
  var email = sig.split('*')[1];

  var sql = 'UPDATE hsu_list SET email=? WHERE code=?';
  var params = [email, code];

  conn.query(sql, params, function(err, results) {
    if(err) {
      throw err;
    } else {
      if(results.affectedRows >= 1) {
        res.send("이메일 등록에 성공하였습니다.");
      } else {
        res.send("인증코드를 확인해주세요.");
      }
    }
  });
});

app.get('/send/testmail', function(req, res) {
  var bcc = req.query.bcc;
  var pw = req.query.pw;

  if(pw == 'as12') {
    mailer.sendTestMail(bcc);
    res.send('Done.')
  } else {
    res.send('Your are not admin.')
  }

});

app.listen(3550, function() {
  console.log('listen on port 3000!');
});

//----------- Upper web, Lower service -----------

var before_latest = 0;
var latest = 0;

function check_new_post() {
  before_latest = fs.readFileSync('./storage/latest.txt', 'utf8');

  request('http://www.hansung.ac.kr/web/www/1323', function(err, res, body) {
    if(err) throw err;
    console.log(getDate(), 'Start Checking : ' + res.statusCode);
    $ = cheerio.load(body);

    isLatest = true;

    tr = $('tr')

    tr.each(function(index, element) {

      idx = $(this).find('td')
      .first()
      .text()
      .trim();// Get a each post-id from the webpage.

      if(idx != '') {
        if(isLatest) {
          latest = idx;
          fs.writeFile('./storage/latest.txt', latest, 'utf8', function(err) {
            if(err) throw err;
          })
        } isLatest = false;


        if(idx > before_latest) {
          subject = $(this).find('td.subject > a');
          title = subject.text();
          link = subject.attr('href');
          console.log(getDate(), idx, title, link);
          mailer.sendNotification(title, link);

        } //new post will be handled here.
      }// filter new post

    })
    console.log(getDate(), 'End Checking.')
  });
}

function getDate(){
    var now = new Date();
    return now.toLocaleString()+" =>  ";
}

function updateLatestIdxLog() {
  latest = fs.readFileSync('./storage/latest.txt', 'utf8');
  newlog = getDate() + latest + '\r\n';
  fs.appendFileSync('./log/latest_idx.log', newlog);
}

function getDate(){
    var now = new Date();
    return now.toLocaleString()+" =>  ";
}

updateLatestIdxLog();
check_new_post();
setInterval(updateLatestIdxLog, 5 * 60 * 1000)
setInterval(check_new_post, 10 * 60 * 1000)
