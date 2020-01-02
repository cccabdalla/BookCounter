const express = require('express');
const router = express.Router();
const dbAssist = require('./oracle/oracleDbAssist');
const StoredProc = require('./storedProcedures/userStoredProc');

dbAssist.getConnection(function (err, conn) {
    if (err)
        return console.log('Database connection failed - ' + err);

    var sp;
    console.log('Database connection initialized');

    router.get('/meals/getmealtypes', function (req, res, next) {
        sp = new StoredProc().sp_meal_getmealtypes;

        dbAssist.executeSqlWithConn(sp,false,conn,function(spErr,result){
            if(spErr)
            return console.log('Execute sp - ' + sp.name + ' failed - ' + spErr);
            
            res.status(200).json({
                msg: 'Menus received from db',
                result: JSON.stringify(result)
            });
        });
       
    });

    router.post('/menus/addmenus', function (req, res, next) {
        console.log(req.body);
        res.status(200).json({
            msg: 'Menus added to db',
            req: JSON.stringify(req.body)
        });
    });

});

module.exports.router = router;
