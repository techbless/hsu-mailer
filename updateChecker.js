const mailer = require('./mailer.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const storage = require('./storage');

const URL = 'http://www.hansung.ac.kr/web/www/1323';

function checkNewPost() {
  console.log(getDate(), 'Start Checking.');
  puppeteer.launch({args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ]}).then(async browser => {
    let page = undefined;
    try {
      page = await browser.newPage();
      await page.setViewport({width: 320, height: 600});
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_0_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13A404 Safari/601.1')

      await page.goto(URL, {waitUntil: 'networkidle0'});
      await page.waitForSelector('tr');
      await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});
    } catch (e) {
      console.log(e);
    }

    const result = await page.evaluate(() => {
      let posts = [];
      try {
        $('tr').each(function(index, element) {
          const idx = $(this)
            .find('td')
            .first()
            .text()
            .trim();// Get a each post-id from the webpage.
          const subject = $(this).find('td.subject > a');
          const title = subject.text();
          const link = subject.attr('href');
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
    });
    //console.log(result) -> well done
    await browser.close();

    // DONE of loading data.

    //const before_latest = fs.readFileSync('./storage/latest.txt', 'utf8');
    const before_latest = await storage.getLatestIndex();
    let is_latest = true;
    result.forEach(function(elm) {
      const idx = elm.idx;
      const title = elm.title;
      const link = elm.link;

      if(idx !== '') {
        if(is_latest) {
          storage.updateLatestIndex(idx);
          //updateLatestStorage(idx)
        }
        is_latest = false;

        if(idx > before_latest) {
          console.log(getDate(), "New Post Detected!");
          console.log(getDate(), idx, title);
          mailer.sendNotification(title, link);
        }
      }
    });

    console.log(getDate(), 'End Checking.');
  }).catch(err => {
    throw err;
  });

}

/*function updateLatestStorage(latest) {
  fs.writeFile('./storage/latest.txt', latest, 'utf8', function(err) {
    if(err) throw err;
  })
}*/

function updateLatestIdxLog() {
  const latest = fs.readFileSync('./storage/latest.txt', 'utf8');
  const newlog = getDate() + latest + '\r\n';
  fs.appendFileSync('./log/latest_idx.log', newlog);
}

function getDate(){
  const now = new Date();
  return now.toLocaleString()+" =>  ";
}

module.exports = {
  updateLatestIdxLog: updateLatestIdxLog,
  checkNewPost: checkNewPost
};