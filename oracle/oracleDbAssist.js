var oracledb = require('oracledb');
var dbConfig = require('../config/dbconfig');
var dbParams = require('../oracle/dbParams');

function getConnection(next) {
    oracledb.getConnection(dbConfig, function (err, connection) {
        if (err) {
            console.error('*********** create connection failed err: ' + err.message);

            next(err, null);
            return;
        }

        next(null, connection);
    });
}
function executeSql(spName, params, next) {
    var sql = createProcedureSqlString(spName, params);
    params = buildParams(params);
    getConnection(function(err, connection) {
        if(err) {
            console.error('*********** create connection failed err: ' + err.message);

            releaseConnection(connection);
            return;
        }
        console.log('params:\t'+ JSON.stringify(params));
        connection.execute(sql, params, {autoCommit: true}, function(err, result) {
            if (err) {
                console.error('*********** execute sql failed err: ' + err.message);
                console.error(sql);
                console.error(params);

                next(err, null);
                releaseConnection(connection);
                return;
            }

            console.log('*********** execute result: ' + JSON.stringify(result));

            if(result.rowsAffected) {
                next(null, result);
                releaseConnection(connection);
                return;
            }

            if(result.outBinds) {
                next(null, result.outBinds);
                releaseConnection(connection);
                return;
            }

            var columns = [];
            var c = -1;
            result.metaData.forEach(function (rCols) {
                c++;
                columns[c] = rCols.name.toLowerCase();
            });

            var jsonObj = {resultSet: []};
            var columnsLength = columns.length;
            for (var r = 0; r < result.rows.length; r++) {
                jsonObj.resultSet[r] = {};
                var jsonRowObj = jsonObj.resultSet[r];
                for (c = 0; c < columnsLength; c++) {
                    var colName = columns[c];
                    jsonRowObj[colName] = result.rows[r][c];
                }
            }

            next(null, jsonObj.resultSet);
            releaseConnection(connection);
        });
    });
}

function releaseConnection(connection, next) {
    connection.release(
        function (err) {
            if (err) {
                console.error('*********** Connection release err: ' + err.message);
                if(next)
                    next(err, null);
                return;
            }

            console.log('*********** Connection released');

            if(next)
                next(null, null);
        });
}

function rollback(connection, next) {
    connection.release(
        function (err) {
            if (err) {
                console.error('*********** transaction rollback err: ' + err.message);
                if(next)
                    next(err, null);
                return;
            }

            console.log('*********** transaction rolledback');

            if(next)
                next(null, null);
        });
}

function commit(connection, next) {
    connection.commit(
        function (err) {
            if (err) {
                console.error('*********** transaction commit err: ' + err.message);
                if(next)
                    next(err, null);
                return;
            }

            console.log('*********** transaction committed');

            if(next)
                next(null, null);
        });
}

function buildParams(params) {
    
    for(var attributeName in params) {
        params[attributeName].val = typeof params[attributeName].val === 'undefined' ? null : params[attributeName].val;
        //console.log('params:\t'+JSON.stringify(params));
        
        if(params[attributeName].type.is(dbParams.DATE))
            params[attributeName].val = params[attributeName].val ? new Date(params[attributeName].val) : null;

        params[attributeName].type = params[attributeName].type.value;
        params[attributeName].dir = params[attributeName].dir.value;
   
    }
   
    return params;
}

function createProcedureSqlString( spName, spParams) {
    var sqlStart = 'begin ';
    var sqlEnd = '); end;';
    var sql = sqlStart + spName + '(';
    for(var attributeName in spParams) {
        sql = sql + ':' + attributeName + ', ';
    }
    sql = sql + sqlEnd;
    sql = replaceLast(sql, ',', '');
    return sql;
}

function replaceLast(haystack, needle, replacement) {
    // you may want to escape needle for the RegExp
    var re = new RegExp(needle + '(?![\\s\\S]*?' + needle + ')');
    return haystack.replace(re, replacement);
}
function executeSqlWithConn(sp, autoCommit, connection, next) {
    var sql = createProcedureSqlString(sp.name, sp.params);
    var params = buildParams(sp.params);
    connection.execute(sql, params, {autoCommit: autoCommit}, function(err, result) {
        if (err) {
            next(err, null);
            return;
        }

        var allRows = [];
        var numRows = 50;  // number of rows to return from each call to getRows()

        for(var attributeName in result.outBinds) {
            if(result.outBinds[attributeName] && result.outBinds[attributeName].metaData) { // db response is a result set

                function fetchRowsFromResultSet(pResultSet, pNumRows) {
                    pResultSet.getRows(pNumRows, function(readErr, rows) {
                        if(err) {
                            pResultSet.close(function (err) { // always close the result set
                                next(readErr);                                
                            });
                            return;
                        }

                        allRows.push(rows);
                        if (rows.length === pNumRows) {
                            fetchRowsFromResultSet(result.outBinds[attributeName], numRows);
                            return;
                        }

                        var allRowsResult = Array.prototype.concat.apply([], allRows);

                        generateJsonFromDbResultSet(pResultSet.metaData, allRowsResult, sp, function(resultSet) {
                            pResultSet.close(function (err) { // always close the result set
                                next(null, resultSet);
                            });
                        });
                    });
                }

                fetchRowsFromResultSet(result.outBinds[attributeName], numRows);
                return;
            }
        }

        next(null, result.outBinds);

        //console.log('*********** select result: ' + JSON.stringify(result));

        /*        if(result.rowsAffected) {
         next(null, result);
         return;
         }

         if(result.outBinds) {
         next(null, result.outBinds);
         return;
         }

         var columns = [];
         var c = -1;
         result.metaData.forEach(function (rCols) {
         c++;
         columns[c] = rCols.name.toLowerCase();
         });

         var jsonObj = {resultSet: []};
         var columnsLength = columns.length;
         for (var r = 0; r < result.rows.length; r++) {
         jsonObj.resultSet[r] = {};
         var jsonRowObj = jsonObj.resultSet[r];
         for (c = 0; c < columnsLength; c++) {
         var colName = columns[c];
         jsonRowObj[colName] = result.rows[r][c];
         }
         }

        next(null, jsonObj.resultSet);*/
    });
}
function generateJsonFromDbResultSet(metaData, rows, sp, next) {
    var jsonObj = {resultSet: []};
    var columns = [];

    var c = -1;

    if (sp.resultSetColumns) {
        metaData.forEach(function (rCols) {
            c++;
            var found = false;
            sp.resultSetColumns.forEach(function (spCols) {
                if (rCols.name.toUpperCase() === spCols.toUpperCase()) {
                    columns[c] = sp.resultSetColumnsToLowerCase ? spCols.toLowerCase() : spCols;
                    found = true;
                }
            });

            if (!found) {
                columns[c] = sp.resultSetColumnsToLowerCase ? rCols.name.toLowerCase() : rCols.name;
            }
        });
    } else {
        metaData.forEach(function (column) {
            c++;
            columns[c] = sp.resultSetColumnsToLowerCase ? column.name.toLowerCase() : column.name;
        });
    }


    var columnsLength = columns.length;
    for (var r = 0; r < rows.length; r++) {
        jsonObj.resultSet[r] = {};
        var jsonRowObj = jsonObj.resultSet[r];
        for (c = 0; c < columnsLength; c++) {
            var colName = columns[c];
            jsonRowObj[colName] = rows[r][c];
        }
    }

    next(jsonObj.resultSet);
}
module.exports.executeSql = executeSql;
module.exports.getConnection = getConnection;
module.exports.executeSqlWithConn = executeSqlWithConn;