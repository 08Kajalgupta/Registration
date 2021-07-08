var express = require('express');
var pool = require('./pool.js');
var upload = require('./upload.js');
var router = express.Router();



router.get('/displayAll',function(req,res){

    pool.query("select * from state", function(error,result){
        if(error)
        {
            res.status(500).json([])
        }
        else{
            res.status(200).json(result)
        }
    })
})

router.post('/displaycitybystateid',function(req,res){

    pool.query("select * from city where stateid=?",[req.body.stateid], function(error,result){
        if(error)
        {
            res.status(500).json([])
        }
        else{
            res.status(200).json(result)
        }
    })
}) 

module.exports = router;