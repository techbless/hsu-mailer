const crypto = require('crypto');
const storage = require('./storage');
const mailer = require('./mailer.js');

// 주어진 메일에 대한 토큰, url 생성후 S3 업로드
async function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

// 사용자의 구독 요청 처리
async function requestSubscription(email) {
  if (!validateEmail(email))
    return false;

  const mails = await storage.getMails();
  if(mails.includes(email))
    return false;

  if(await storage.doesTokenExist(email)) {
    return true;
  }

  const token = await generateToken();
  await storage.addNewMAil(email, token);
  //await storage.updateToken(email, token);

  // verification url format -> https://hspoint.herokuapp.com/verify/subscribe/example@email.com/TOKEN
  const url = `https://${process.env.SITE_URL}/verify/subscribe/${email}/${token}`;
  await mailer.sendVerificationMail(email, url, '구독');

  return true;
}

async function requestUnsubscription(email) {
  if(!validateEmail(email))
    return false;

  const mails = await storage.getMails();
  if(!mails.includes(email))
    return false;

  if(await storage.doesTokenExist(email)) {
    return true;
  }

  const token = await generateToken();
  await storage.updateToken(email, token);

  // verification url format -> https://hspoint.herokuapp.com/verify/unsubscribe/example@email.com/TOKEN
  const url = `https://${process.env.SITE_URL}/verify/unsubscribe/${email}/${token}`;
  await mailer.sendVerificationMail(email, url, '구독취소');

  return true;
}

// 메일 인증 검증
async function verifyEmail(email, token) {
  const realToken = await storage.getToken(email);
  return realToken === token;
}

// Change verified column to 1
async function subscribe(email) {
  return await storage.verifyMail(email);
}

async function unsubscribe(email) {
  return await storage.deleteEmail(email);
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = {
  requestSubscription: requestSubscription,
  requestUnsubscription: requestUnsubscription,
  verifyEmail: verifyEmail,
  subscribe: subscribe,
  unsubscribe: unsubscribe
};