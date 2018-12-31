const secrets = require('secrets.js-grempe');
const readline = require('readline');
const assert = require('assert');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

console.log();
console.group('Shamir\'s Secret Sharing Scheme Tool');
console.log();
console.log('This tool splits a secret data into N-of-M shares. It generates M shares,');
console.log('any N of them allowing to decode data. E.g. in 3 of 5 configuration, there');
console.log('will be 5 shares generated and any 3 of them will decode the data. They can');
console.log('be any N shares, in any order, but knowning less than N shares is totally');
console.log('useless and won\'t give any information about the encrypted data.');
console.log('================================================================================');
console.log();
console.groupEnd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var lines = [];

function getLine(callback) {
  rl.question(': ', line  => {
    if (line.length > 0) {
      lines.push(line);
      getLine(callback);
    } else {
      rl.close();
      callback();
    }
  });
}

rl.question('Total number of shares: ', numTotal => {
  assert(parseInt(numTotal).toString() === numTotal, 'should be a number');

  rl.question('Number of shares to decode: ', numRequired => {
    assert(parseInt(numRequired).toString() === numRequired, 'should be a number');

    rl.question('Description to be displayed with share data (can be empty): ', description => {

      rl.question('Filename prefix (no extension) if you want shares wrote to txt files (empty if no): ', prefix => {

        console.log('Data to encode. Enter empty line to finish.');
        console.log();
        getLine(data => {

          rl.close();
          const shares = secrets.share(secrets.str2hex(lines.join(`\n`)), parseInt(numTotal), parseInt(numRequired));
          console.log();
          console.log(`Any ${numRequired} of the ${numTotal} following will be able to decrypt the data:`);
          let output = '';
          for (let share of shares) {
            output = '';
            console.log();
            console.log('=========================================');
            if (description.length > 0) {
              output += description + `\n`;
            }
            shareId = secrets.extractShareComponents(share).id;
            output += `Share #${shareId} of ${numTotal}:\n\n`;
            output += share.toUpperCase().match(/.{1,4}/g).join(' ');
            output += `\n`;
            console.log(output);
            code = qrcode.generate(share, { small: true });
            if (prefix.length > 0) {
              fs.writeFileSync(`${prefix}-${shareId}.txt`, output + `\n` + code);
            }
          }
        });
      });
    });
  });
});
