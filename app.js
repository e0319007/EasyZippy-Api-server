const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config');
const multer = require('multer');
const path = require('path');
const moment = require('moment-timezone');

const routes = require('./app/routes');

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
app.set('json replacer', (key, value) => {
  const possibleDate = new Date(value);
  console.log('entered value: ' + value + ' : ' + typeof(value))
  console.log('year: ' +(new Date(value)).getFullYear());
  if (possibleDate.getFullYear() !== 1970) {
    console.log(' is date')
    // const unprocessedDate = moment(this[key]);
    // value = unprocessedDate.tz('Asia/Singapore').format('ha z');
  }
  return value;
});

if (app.get('env') === 'development') {
  app.locals.pretty = true;
  console.log('Running development');
}

app.listen(port, host, () => {
  console.log(`This server is running on port ${port}`);
});

module.exports = app;