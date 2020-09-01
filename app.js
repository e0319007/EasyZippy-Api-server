const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./app/routes');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes)

if (app.get('env') === 'development') {
  app.locals.pretty = true;
  console.log('Running development');
}

module.exports = app;