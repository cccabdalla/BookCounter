const express = require('express');
const router = express.Router();


router.get('/menus/getmenus',function(req,res,next){
    res.status(200).json({
        msg: 'Menus received from db'
    });
});

module.exports.router = router;
