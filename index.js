const request = require('request');
const fs = require('fs');
const url = 'http://tesseract.projectnaptha.com/img/eng_bw.png';
var filename = 'pic.png';

var writeFileStream = fs.createWriteStream(filename);

request(url)
  .pipe(writeFileStream)
  .on('close', function() {
    console.log(url, 'saved to', filename);
  });
