const dbAssist = require('./oracle/oracleDbAssist');


module.exports = {
    dbConnection: dbAssist.getConnection(function(err,conn){return {err: err,conn: conn}})
}