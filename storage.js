const AWS = require('aws-sdk');
const db = require('./modules/mysql');

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

const BUCKET_NAME = 'hspoint';
const LATEST_IDX_FILENAME = 'latest.txt';

//const _uploadS3 = util.promisify(s3.upload);
async function uploadToS3(fileName, data) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: String(data)
  };

  const res = await s3.upload(params).promise();
  console.log(`${fileName} uploaded successfully.`);
  return res;
}


//const _downloadS3 = util.promisify(s3.getObject);
async function downloadFromS3(filename) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body.toString();
  } catch (err) {
    return undefined;
  }
}

// 이메일 형식 검증
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

async function addNewMail(email, token) {
  if(!validateEmail(email))
    return false;

  try {
    const sql = 'INSERT INTO mails(email, token) VALUES (?, ?)';
    const params = [email, token];
    await db._query(sql, params);
  } catch(err) {
    return false;
  }

  return true;
}

async function verifyMail(email) {
  try {
    const sql = 'UPDATE mails SET verified=1 WHERE email=?';
    const params = [email];
    await db._query(sql, params);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }
}

// return false when email is not valid, given mail is not subscribed. find error.
async function deleteEmail(email) {
  // validate email address
  if(!validateEmail(email))
    return false;

  try {
    const sql = 'DELETE FROM mails WHERE email=?';
    const params = [email];
    await db._query(sql, params);
    return true;
  } catch(err) {
    return false;
  }
}

// Return an array of email address in subscription list.
async function getMails() {
  try {
    const sql = 'SELECT email FROM mails WHERE verified=1';
    const result = await db._query(sql);
    return result.map(x => x.email);
  } catch(err) {
    console.log(err);
    return undefined;
  }
}

// S3 내부에 파일 존재 여부 판별
async function doesTokenExist(email) {
  try {
    const sql = 'SELECT * FROM mails WHERE email=? AND token IS NOT NULL';
    const params = [email];
    const result = await db._query(sql, params);

    return result.length >= 1;
  } catch {
    return false;
  }
}
doesTokenExist('test@mail.com').then(res => console.log(res));

async function updateLatestIndex(latest) {
  await uploadToS3(LATEST_IDX_FILENAME, latest);
}


async function getLatestIndex() {
  const latest = await downloadFromS3(LATEST_IDX_FILENAME);

  if(latest) {
    return latest;
  } else {
    return undefined;
  }
}

async function updateToken(email, token) {
  //await uploadToS3(`token/${email}`, token);
  const sql = 'UPDATE mails SET token=? WHERE email=?';
  const params = [token, email];
  await db._query(sql, params);
}

async function getToken(email) {
  try {
    const sql = 'SELECT token from mails WHERE email=?';
    const params = [email];
    const result = await db._query(sql, params);

    if(result[0].token)
      return result[0].token;
    else
      return undefined;
  } catch(err) {
    return undefined;
  }

}


module.exports = {
  addNewMAil: addNewMail,
  getMails: getMails,
  updateLatestIndex: updateLatestIndex,
  getLatestIndex: getLatestIndex,
  updateToken: updateToken,
  getToken: getToken,
  doesTokenExist: doesTokenExist,
  deleteEmail: deleteEmail,
  verifyMail: verifyMail
};
