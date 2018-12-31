const secrets = require('secrets.js-grempe');
const readline = require('readline');
const assert = require('assert');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const shares = [];

console.log('Enter your shares, when finished, submit an empty share (just hit ENTER)');

function next(callback) {
  rl.question(': ', share  => {
    if (share.length > 0) {
      shares.push(share.replace(/ /g, ''));
      next(callback);
    } else {
      rl.close();
      callback();
    }
  });
}

next(() => {
  const data = secrets.combine(shares);
  console.log();
  console.log(secrets.hex2str(data));
});

