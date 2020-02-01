const storage = require('./storage');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendWelcomeMail = function(bcc) {
  const msg = {
    to: 'mail.lulru@gmail.com',
    bcc: bcc,
    from: '공지알림 등록완료🔔 <mail.lulru@gmail.com>',
    subject: '이 이메일을 수신하였다면 정상적으로 등록이 완료된 것입니다.',
    text: '앞으로 번거로운 비교과 공지 확인, 공지 알림 서비스로 빠르게 확인해보세요.',
    html: `<h2>앞으로 번거로운 비교과 공지 확인, 공지 알림 서비스로 빠르게 확인해보세요.</h2>`,
  };
  sgMail.send(msg)
    .then((res) => {
      console.log(getDate(), 'Welcome Email Sent');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.sendNotification = function(idx, subject, url) {
  storage.getMails()
    .then((bcc) => {
      if (!bcc) {
        console.log(getDate(), 'Failed to get subscribers from S3');
        return;
      }

      const msg = {
        from: '새로운 비교과 공지🔔 <mail.lulru@gmail.com>',
        to: 'mail.lulru@gmail.com',
        bcc: bcc,
        subject: subject,
        text: url,
        html: `<a style='font-size: 17px' href='${url}'>공지 바로가기</a>`,
      };
      sgMail.send(msg)
        .then((res) => {
          console.log(`${idx} Notification Email Sent!`);
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

function getDate(){
    const now = new Date();
    return now.toLocaleString()+" => ";
}
