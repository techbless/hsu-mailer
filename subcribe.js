const crypto = require('crypto');
const storage = require('./storage');
const mailer = require('./mailer.js');

// 주어진 메일에 대한 토큰, url 생성후 S3 업로드
async function generateToken(email) {
  return crypto.randomBytes(64).toString('hex');
}

// 사용자의 구독 요청 처리
async function requestSubscription(email) {
  if (!validateEmail(email))
    return false;

  const mails = await storage.getMails();
  if(mails.includes(email))
    return false;

  if(await storage.doesExist(`token/${email}`)) {
    return true;
  }

  const token = await generateToken();
  await storage.uploadToken(email, token);

  // verification url format -> https://hspoint.herokuapp.com/verify/email/example@email.com/TOKEN
  const url = `https://${process.env.SITE_URL}/verify/email/${email}/${token}`;
  await mailer.sendVerificationMail(email, url);

  return true;
}

// 메일 인증 검증
async function verifyEmail(email, token) {
  const realToken = await storage.getToken(email);
  return realToken === token;
}

// subscribers.json 등록
async function subscribe(email) {
  return await storage.addNewMAil(email);
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = {
  requestSubscription: requestSubscription,
  verifyEmail: verifyEmail,
  subscribe: subscribe
};