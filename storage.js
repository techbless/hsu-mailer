const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();


const BUCKET_NAME = 'hspoint';
const SUBSCRIBERS_FILENAME = 'subscribers.json';
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

// 이메일을 subscribers.json에 추가
async function addNewMail(email) {
  if (!validateEmail(email))
    return false;

  const mails = await getMails();
  if(mails.includes(email))
    return false;

  mails.push(email);

  const mailsJson = JSON.stringify(mails);
  await uploadToS3(SUBSCRIBERS_FILENAME, mailsJson);

  return true;

}

async function getMails() {
  const data = await downloadFromS3(SUBSCRIBERS_FILENAME);

  if (data) {
    return JSON.parse(data);
  } else {
    return undefined;
  }
}

// S3 내부에 파일 존재 여부 판별
async function doesExist(filename) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename
  };
  try {
    await s3.headObject(params).promise();
    return true;
  } catch {
    return false;
  }
}


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

async function uploadToken(email, token) {
  await uploadToS3(`token/${email}`, token);
}

async function getToken(email) {
  try {
    const token = await downloadFromS3(`token/${email}`);

    if(token) {
      return token;
    } else {
      return undefined;
    }

  } catch (err) {
    return undefined;
  }

}


module.exports = {
  addNewMAil: addNewMail,
  getMails: getMails,
  updateLatestIndex: updateLatestIndex,
  getLatestIndex: getLatestIndex,
  uploadToken: uploadToken,
  getToken: getToken,
  doesExist: doesExist,
};