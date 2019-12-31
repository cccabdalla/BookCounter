const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const conn;
dbAssist.getConnection(function(err,conn){
    if(err)
        return console.log('Database connection failed');

        console.log('Database connection initialized');

        server.listen(port,function(){
            console.log('Api is running on localhost:'+port);
        });

        conn = conn;
});

module.exports.getConnection = function(){
    return conn;
}