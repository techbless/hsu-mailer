const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
var config = require('./mail-config.json')
const conn = require('./db');

const transporter = nodemailer.createTransport(smtpPool({
  service: 'Gmail',
  host: 'localhost',
  port: '465',
  auth: {
    user: config.user,
    pass: config.password,
  },
  tls: {
    rejectUnauthorize: false,
  },
  maxConnections: 5,
  maxMessages: 10,
}));

exports.sendTestMail = function(bcc) {
  const from = '새로운 비교과 공지🔔 <mail.lulru@gmail.com>';
  const text = '이 이메일을 수신하였다면 정상적으로 등록이 완료된 것입니다.'
  const to = 'mail.lulru@gmail.com'
  const html = `<h1>${text}</h1>`;
  const subject = '테스트메일입니다.'
  const mailOptions = {
    from,
    to,
    bcc,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (err, res) => {
   if (err) {
     console.log(getDate(), 'failed... => ', err);
   } else {
     console.log(getDate(), 'succeed... => ', res);
   }
 });
};

exports.sendNotification = function(subject, url) {
  const from = '새로운 비교과 공지🔔 <mail.lulru@gmail.com>';
  const text = url
  const html = `<a style='font-size: 17px' href='${url}'>공지 바로가기</a>`;
  const to = 'mail.lulru@gmail.com';
  var bcc = [];
  conn.query('SELECT * FROM hsu_list', function(err, results) {
    if (err) throw err;

    for(r in results) {
      if(results[r].email) {
        bcc.push(results[r].email);
      }
    }
  });
  const mailOptions = {
    from,
    to,
    bcc,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, (err, res) => {
   if (err) {
     console.log(getDate(), 'failed... => ', err);
   } else {
     console.log(getDate(), 'succeed... => ', res);
   }
 });
};

function getDate(){
    var now = new Date();
    return now.toLocaleString()+" =>  ";
}
