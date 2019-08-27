const readInvoice = require('./readInvoice');

const urlPath =
  'https://planpartners.com.au/sites/default/files/inline-images/';
const url =
  urlPath +
  'Plan%20Partners%20Example%20Invoice%20Cleaning%20and%20Home%20Maintenance-1.jpg';
const filename = 'ndis_invoice.png';

const invoice = new readInvoice(url, filename);
invoice.download();
