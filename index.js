request = require('request');
cheerio = require('cheerio');
fs = require('fs');
mailer = require('./mailer.js');
conn = require('./db');
express = require('express');
var bodyParser = require('body-parser');
const puppeteer = require('puppeteer')
const URL = 'http://www.hansung.ac.kr/web/www/1323'

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



function check_new_post() {
  console.log(getDate(), 'Start Checking.');
  before_latest = fs.readFileSync('./storage/latest.txt', 'utf8');
  latest = 0
  puppeteer.launch({ headless: true, args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({width: 320, height: 600})
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1')

    await page.goto(URL, {waitUntil: 'networkidle0'})
    await page.waitForSelector('tr')
    await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'})
    //await page.addScriptTag({content: 'fs'})

    const result = await page.evaluate(() => {

      try {
        posts = []
        $('tr').each(function(index, element) {
          idx = $(this)
                .find('td')
                .first()
                .text()
                .trim();// Get a each post-id from the webpage.
          subject = $(this).find('td.subject > a');
          title = subject.text();
          link = subject.attr('href');
          posts.push({
            idx: idx,
            title: title,
            link: link
          })
        })

      } catch(err) {
         throw err
      }

      return posts
    })
    //console.log(result) -> well done
    await browser.close()

    // DONE of loading data.

    before_latest = fs.readFileSync('./storage/latest.txt', 'utf8');
    //before_latest = 490
    is_latest = true;
    result.forEach(function(elm) {
      idx = elm.idx
      title = elm.title
      link = elm.link

      if(idx != '') {
        if(is_latest) {
          updateLatestStorage(idx)
        } is_latest = false

        if(idx > before_latest) {
          console.log(getDate(), idx, title, link)
          mailer.sendNotification(title, link)
        }
      }
    })

    console.log(getDate(), 'End Checking.')
  }).catch(err => {
    throw err
  });

}

function updateLatestStorage(latest) {
  fs.writeFile('./storage/latest.txt', latest, 'utf8', function(err) {
    if(err) throw err;
  })
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
