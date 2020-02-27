const storage = require('./storage');
const AWS = require('aws-sdk');


AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const ses = new AWS.SES();

function generateParams(bcc, subject, html, text) {
  return {
    Destination: {
      ToAddresses: ["hspoint@techbless.live"],  // 받는 사람 이메일 주소
      CcAddresses: [],    // 참조
      BccAddresses: bcc    // 숨은 참조
    },
    Message: {
      Body: {
        Html: {
          Data: html,
          Charset: "utf-8"
        },
        Text: {
          Data: text,      // 본문 내용
          Charset: "utf-8"            // 인코딩 타입
        }
      },
      Subject: {
        Data: subject,   // 제목 내용
        Charset: "utf-8"              // 인코딩 타입
      }
    },
    Source: "=?utf-8?B?67mE6rWQ6rO8IOqzteyngCDwn5SU?= <hspoint@techbless.live>",          // 보낸 사람 주소
    ReplyToAddresses: ["hspoint@techbless.live"] // 답장 받을 이메일 주소
  }
}

exports.sendWelcomeMail = function(bcc) {
  const subject = '이 이메일을 수신하였다면 정상적으로 등록이 완료된 것입니다.';
  const text = '번거로운 비교과 공지 확인, 이제 메일로 빠르게 받아보세요!';
  const html = `<h2>${text}</h2>`;
  const params = generateParams(bcc, subject, html, text);
  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err);
    else console.log(getDate(), 'Welcome Email Sent -> ', bcc);
  })
};

function divideArray(arr, n) {
  const length = arr.length;
  const cnt = Math.floor(length / n);
  let tmp = [];

  for (let i = 0; i <= cnt; i++) {
    const spliced = arr.splice(0, n);
    if(spliced.length !== 0)
      tmp.push(spliced);
  }

  return tmp;
}

function sendDistributedNotification(emails, idx, subject, url) {
  const bccs = divideArray(emails, 30);
  const html = `<a style='font-size: 17px' href='${url}'>공지 바로가기</a>`;
  for(let i = 0; i < bccs.length; i++) {
    const params = generateParams(bccs[i], subject, html, url);

    ses.sendEmail(params, (err, data) => {
      if(err) console.log(err);
      else console.log(getDate(), `${idx} Notification Email Sent!`, bccs[i].length);
    });
  }
}

exports.sendNotification = function(idx, subject, url) {
  storage.getMails()
    .then((bcc) => {
      if (!bcc) {
        console.log(getDate(), 'Failed to get subscribers from S3');
        return;
      }
      console.log(getDate(), 'Start Sending Notification Emails of ', idx, ', total : ', bcc.length);
      sendDistributedNotification(bcc, idx, subject, url);
    });
};

exports.sendVerificationMail = async function(email, url, forWhat) {
  const subject = `[${forWhat}] 이메일 인증을 완료해주세요.`;
  const html = await renderVerificationHtml(url);

  const params = generateParams([email], subject, html, url);

  ses.sendEmail(params, (err, data) => {
    if(err) console.log(err);
    else console.log(getDate(), 'Verification Email Sent! -> ', email);
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
          color: black;
        ">
          <h2>메일인증 안내입니다.</h2>
          <hr style="
            border: solid 2px;
            margin: 30px 0px;
          " />
          <p>안녕하세요.</p>
          <p>원할한 서비스 이용을 위해 메일인증을 실시하고있습니다.</p>
          <p>아래 '메일 인증'버튼을 클릭하여 작업을 완료해 주세요.</p>
          <p>감사합니다.</p>
          <a style="
            margin-top: 35px;
            background-color: #75cbe7;
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
