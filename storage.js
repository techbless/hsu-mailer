const fs = require('fs');
const util = require('util');

const readStorage = util.promisify(fs.readFile);
const writeStorage = util.promisify(fs.writeFile);


function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

async function addNewMail(email) {
  if(!validateEmail(email)) {
    return false;
  }

  try {
    const mails = await getMails();
    if(!mails.includes(email)) {
      mails.push(email);
      const json = JSON.stringify(mails);

      await writeStorage('./storage/mails.json', json);
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getMails() {
  const data = await readStorage('./storage/mails.json');
  return JSON.parse(data);
}

async function updateLatestIndex(latest) {
  await writeStorage('./storage/latest.txt', latest);
}

async function getLatestIndex() {
  return await readStorage('./storage/latest.txt');
}

module.exports = {
  addNewMAil: addNewMail,
  getMails: getMails,
  updateLatestIndex: updateLatestIndex,
  getLatestIndex: getLatestIndex
};