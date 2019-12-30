const express = require('express');
const app = express();
const morgan = require('morgan');
const routes = require('./routes');

app.use(morgan('dev'));
app.use('/',routes.router);

module.exports = app;
