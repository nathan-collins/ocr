const Tesseract = require('tesseract.js');
const request = require('request');
const fs = require('fs');
const sharp = require('sharp');

class ReadInvoice {
  /**
   */
  constructor(url, filename) {
    this.url = url;
    this.filename = filename;
    this.writeFile = fs.createWriteStream(filename);
  }

  /**
   */
  download() {
    request(this.url)
      .pipe(this.writeFile)
      .on('close', () => {
        console.log(this.url, 'saved to', this.filename);
        const alteredFile = this.resizeImage(this.filename);
        alteredFile.then(outputBuffer => {
          this.scanImage(outputBuffer);
        });
      });
  }

  /**
   *
   * @param {Object} outputBuffer The image output buffer
   */
  scanImage(outputBuffer) {
    Tesseract.recognize(outputBuffer)
      .progress(p => {
        console.log('progress', p);
      })
      .catch(err => console.error(err))
      .then(result => {
        result.lines.forEach(line => {
          const tableHeaderPosition = this.getTableHeaderPosition(line.words);
          const endTablePosition = this.getEndOfTablePosition(line.words);
        });
      })
      .finally(() => {
        process.exit();
      });
  }

  /**
   */
  resizeImage(filename) {
    return this.alterImage(filename);
  }

  /**
   * @param {String} file File
   */
  alterImage(file) {
    return sharp(file)
      .resize({})
      .greyscale()
      .normalise()
      .toBuffer();
  }

  /**
   * @param {Array} words All words from image
   * @return {Number} Index position of the value retrieved or -1
   */
  getTableHeaderPosition(words) {
    return words.findIndex(word => {
      console.log(word.text);
      return word.text.toLowerCase() === 'date';
    });
  }

  /**
   * @param {Array} words All words from image
   * @return {NUmber} Index position of of the searched value or -1
   */
  getEndOfTablePosition(words) {
    return words.findIndex(word => {
      console.log(word.text);
      return word.text.toLowerCase() === 'gst';
    });
  }
}

module.exports = ReadInvoice;
