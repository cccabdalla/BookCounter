const express = require('express');
const app = express();
const morgan = require('morgan');
const routes = require('./routes');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',routes.router);

module.exports = app;
