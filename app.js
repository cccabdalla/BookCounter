const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(function(req,res,next){
    res.status(200).json({
        msg: 'it works'
    });
});

module.exports = app;
