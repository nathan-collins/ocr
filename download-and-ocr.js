const Tesseract = require('tesseract.js');
const request = require('request');
const fs = require('fs');
const sharp = require('sharp');
const url =
  'https://planpartners.com.au/sites/default/files/inline-images/Plan%20Partners%20Example%20Invoice%20Cleaning%20and%20Home%20Maintenance-1.jpg';
const filename = 'ndis_invoice.png';

const writeFile = fs.createWriteStream(filename);

function resizeImage(file) {
  return sharp(file)
    .resize({})
    .greyscale()
    .normalise()
    .toBuffer();
}

function getTableHeaderPosition(words) {
  return words.findIndex(word => {
    console.log(word);
    return word[0].toLowerCase() === 'date';
  });
}

function getEndOfTablePosition(words) {
  return words.findIndex(word => {
    console.log(word);
    return word[0].toLowerCase() === 'gst';
  });
}

request(url)
  .pipe(writeFile)
  .on('close', function() {
    console.log(url, 'saved to', filename);
    const alteredFile = resizeImage(filename);
    alteredFile.then(outputBuffer => {
      Tesseract.recognize(outputBuffer)
        .progress(function(p) {
          console.log('progress', p);
        })
        .catch(err => console.error(err))
        .then(function(result) {
          // html
          // confidence
          // blocks
          // psm
          // oem
          // version
          // paragraphs
          // lines
          // words
          // symbols

          let tidiedWords;
          result.lines.forEach(line => {
            tidiedWords = line.words.map(word => {
              const tidiedWord = word.text.replace('/()/gi', '');
              return tidiedWord;
            });
          });

          const tableHeaderPosition = getTableHeaderPosition(tidiedWords);
          const endTablePosition = getEndOfTablePosition(tidiedWords);
        })
        .finally(() => {
          process.exit();
        });
    });
  });
