const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const storage = require('./storage');

const transporter = nodemailer.createTransport(smtpPool({
  service: 'Gmail',
  host: 'localhost',
  port: '465',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorize: false,
  },
  maxConnections: 5,
  maxMessages: 10,
}));

exports.sendTestMail = function(bcc) {
  const from = '새로운 비교과 공지🔔 <mail.lulru@gmail.com>';
  const text = '이 이메일을 수신하였다면 정상적으로 등록이 완료된 것입니다.';
  const to = 'mail.lulru@gmail.com';
  const html = `<h1>${text}</h1>`;
  const subject = '테스트메일입니다.';
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
  storage.getMails()
    .then((bcc) => {
      const from = '새로운 비교과 공지🔔 <mail.lulru@gmail.com>';
      const text = url
      const html = `<a style='font-size: 17px' href='${url}'>공지 바로가기</a>`;
      const to = 'mail.lulru@gmail.com';
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
          console.log(getDate(), 'failed => ', err);
        } else {
          console.log(
            getDate(),
            'Mail Sent Successfully!',
            '\n  accepted : ', res.accepted,
            '\n  rejected : ', res.rejected,
            '\n================= END ================='
          );
        }
      });
    });
};

function getDate(){
    const now = new Date();
    return now.toLocaleString()+" =>  ";
}
