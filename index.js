request = require('request');
cheerio = require('cheerio');
fs = require('fs');
mailer = require('./mailer.js');
http = require('http');
/*
var app = http.createServer(function(req, res) {
  var url = req.url;
  if(url == '/') {
    url = '/index.html'
  }
  if(url == '/favicon.ico'){
    return res.writeHead(404);
  }

  res.writeHead(200);
  res.end(fs.readFileSync(__dirname + url));
});

app.listen(3000);
*/
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
          mailer.sendNotification('yunbin@hansung.ac.kr', title, link);

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

check_new_post();
setInterval(check_new_post, 10 * 60 * 1000)
