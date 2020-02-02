const crypto = require('crypto');
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

exports.sendVerificationMail = async function(email, url) {
  const subject = '안녕하세요. 비교과 공지 알림 구독을 위해 이메일 인증을 완료해주세요.';
  const html = await renderVerificationHtml(url);

  const msg = {
    from: '새로운 비교과 공지🔔 <mail.lulru@gmail.com>',
    to: 'mail.lulru@gmail.com',
    bcc: email,
    subject: subject,
    text: url,
    html: html,
  };

  sgMail.send(msg)
    .then((res) => {
      console.log(getDate(), 'Verification Email Sent');
    })
    .catch((err) => {
      console.log(err);
    });
};


async function renderVerificationHtml(url) {
  return `
    <html>
      <body style="font-family: 'Nanum Gothic', sans-serif;">
        <div style="
          width: 450px;
          height: 300px;
          box-shadow: 0px 0px 5px black;
          padding: 50px;
        ">
          <h2>메일인증 안내입니다.</h2>
          <hr style="
            border: solid 2px;
            margin: 30px 0px;
          " />
          <p>안녕하세요.</p>
          <p>원할한 서비스 이용을 위해 메일인증을 실시하고있습니다.</p>
          <p>아래 '메일 인증'버튼을 클릭하여 알림 구독을 완료해 주세요.</p>
          <p>감사합니다.</p>
          <a style="
            margin-top: 70px;
            background-color: #baf;
            border: none;
            color: white;
            padding: 11px 22px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
          " href="${url}">메일 인증</a>
        </div>
      </body>
    </html>
  `;
}

function getDate(){
    const now = new Date();
    return now.toLocaleString()+" => ";
}
