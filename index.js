request = require('request');
cheerio = require('cheerio');
fs = require('fs');
mailer = require('./mailer.js');


var before_latest = 0;
var latest = 0;

function check_new_post() {
  before_latest = fs.readFileSync('./storage/latest.txt', 'utf8');

  request('http://www.hansung.ac.kr/web/www/1323', function(err, res, body) {
    if(err) throw err;
    console.log('Start Checking.')
    console.log('statusCode: ' + res.statusCode);
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
          console.log(idx, title, link);
          mailer.sendNotification('yunbin@hansung.ac.kr', title, link);

        } //new post will be handled here.
      }// filter new post

    })
    console.log('End Checking.')
  });
}

check_new_post();
setInterval(check_new_post, 0.5 * 60 * 1000)
