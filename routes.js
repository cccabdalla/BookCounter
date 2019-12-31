const express = require('express');
const dbAssist = require('./oracle/oracleDbAssist');
const StoredProc = require('./storedProcedures/userStoredProc');
const router = express.Router();

router.get('/employees/getemployees',function(req,res,next){
dbAssist.getConnection(function(err,conn){
    if(err)
        return console.log('Database connection failed');
    const sp = new StoredProc().sp_emp_getemployees;
    dbAssist.executeSqlWithConn(sp,false,conn,function(err,result){
        if(err)
            return console.log('Executing sp - ' + sp.name + ' failed - ' + err);

            res.status(200).json({
                msg: 'Menus received from db',
                employees: JSON.stringify(result)
            });

    });
}); 
});

router.post('/menus/addmenus',function(req,res,next){
    console.log(req.body);
    res.status(200).json({
        msg: 'Menus added to db',
        req: JSON.stringify(req.body)
    });
});

module.exports.router = router;
