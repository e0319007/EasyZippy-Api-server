const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config');

const routes = require('./app/routes');

const app = express();
const host = config.get('server.host');
const port = config.get('server.port');

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

if (app.get('env') === 'development') {
  app.locals.pretty = true;
  console.log('Running development');
}

app.listen(port, host, () => {
  console.log(`This server is running on port ${port}`);
});

module.exports = app;