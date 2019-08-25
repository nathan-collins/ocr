const Tesseract = require('tesseract.js');
const request = require('request');
const fs = require('fs');
const sharp = require('sharp');
const url =
  'https://partnersincare.com.au/wp-content/uploads/elementor/thumbs/ndis4-Gives-you-weekly-proiftablity-per-participant-nvt92dzf39xgy7jt64eq7fy84pq0m86smgn0cjssso.jpg';
const filename = 'ndis_invoice.png';

const writeFile = fs.createWriteStream(filename);

function resizeImage(file) {
  return sharp(file)
    .resize({
      top: 370,
      background: { r: 255, g: 255, b: 255, alpha: 0.5 },
    })
    .greyscale()
    .normalise()
    .toBuffer();
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
          console.log(Object.keys(result));
          const words = result.words.map(word => {
            return word.text;
          });
          console.log(words);
        })
        .finally(() => {
          process.exit();
        });
    });
  });
