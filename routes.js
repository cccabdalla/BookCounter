const express = require('express');
const StoredProc = require('./storedProcedures/userStoredProc');
const router = express.Router();

router.get('/employees/getemployees',function(req,res,next){
    res.status(200).json({
        msg: 'Menus received from db',
        employees: JSON.stringify(result)
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
