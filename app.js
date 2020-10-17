const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config');
const multer = require('multer');
const path = require('path');
const paypal = require('paypal-rest-sdk');
const engines = require('consolidate');
const moment = require('moment-timezone');

const routes = require('./app/routes');
const scheduleHelper = require('./app/common/scheduleHelper'); 

const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const msAjaxDateRegex = /^\/Date\((d|-|.*)\)[\/|\\]$/;

const app = express();
const host = config.get('server.host');
const port = config.get('server.port');
const assetsDir = path.join(__dirname, '/app/assets');
let i = 0;
const storage = multer.diskStorage({
  destination: './app/assets',
  filename: (req, file, next) => {
    next(
      null,
      `${Date.now() + i}.${file.mimetype.split('/')[1]}`
    );
    i++;
  },
});

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ storage }).any());
app.use(routes);
app.use('/assets', express.static(assetsDir));
app.engine('ejs', engines.ejs);
app.set('views', './app/views');
app.set('view engine', 'ejs');

paypal.configure({
  'mode': 'sandbox',
  'client_id': 'AeLQtNhjP44F0ZWXSSCnU7Zm-cXIafF5PpA0DsyoiXBravHNvvdgcDoPVn-fTFPvFrkb8OR_e3hDqt9y',
  'client_secret': 'EC46h5nKXA2KTdgbWC13BakM3bE-sxkFdngr9Ezi436-FGOTjG7Sh27IKbql8904ToMJuYPpdXbjux4l'
});

app.get('/', (req, res) => res.render('index'));
app.set('json replacer', (key, value) => {
  if (isoDateRegex.exec(value)) {
    value = (moment(value)).tz('Asia/Singapore').format();
  }
  return value;
});

const initialiseScheduler = async () => {
  scheduleHelper.scheduleSetExpiredAdvertisement();
  scheduleHelper.scheduleSetExpiredBookingPackage();
  scheduleHelper.scheduleSetExpiredPromotion();
}

if (app.get('env') === 'development') {
  app.locals.pretty = true;
  console.log('Running development');
}

app.listen(port, host, () => {
  console.log(`This server is running on port ${port}`);
});

module.exports = app;