const { promiseImpl } = require('ejs');
var express = require('express');
var router = express.Router();
var pool=require('./pool.js');
var upload=require('./upload.js')

/* GET users listing. */
router.post('/addregistration', function(req, res, next) {
    console.log("Body",req.body)
    pool.query("insert into registration (name,icon,mobile,emailid,jobtype,dob,state,city) values(?,?,?,?,?,?,?,?)",
    [   req.body.name,
        req.files[0].originalname,
        req.body.mobile,
        req.body.emailid,
        req.body.jobtype,
        req.body.dob,
        req.body.state,
        req.body.city],function(error,result){
            if(error)
            {console.log("error",error)
                res.status(500).json({result:false})
            }
            else
            {
                res.status(200).json({result:"success"})
            }

    })
   
  
});

router.get('/displayall',function(req,res){

    pool.query("select * from registration",function(error,result){
        if(error)
        {
            res.status(500).json([])
        }
        else
        {
            res.status(200).json(result)
        }
    })
});

// router.get('/readall/:registrationid/:x',function(req,res){
//     console.log(req.params)
//     pool.query("select * from registration ",function(error,result){
//         if(error)
//         {
//             res.status(500).json([])
//         }
//         else
//         {
//             res.status(200).json(result)
//         }
//     })
// });

router.post('/editData',function(req,res) {
    pool.query("update registration set name=?,mobile=?,emailid=?,jobtype=?,dob=?,state=?,city=? where registrationid=?",
    [req.body.name,req.body.mobile,req.body.emailid,req.body.jobtype,req.body.dob,req.body.state,req.body.city,req.body.registrationid],function(error,result){
        if(error)
        {
            res.status(500).json({result:false})
        }
        else
        {
            res.status(200).json({result:true})
        }
    })

});

router.post('/editpicture',upload.single('icon'),function(req,res){
    pool.query("update registration set icon=? where registrationid=?",[req.file.originalname,req.body.registrationid],function(error,result){
        if(error)
        {
            res.status(500).json({result:false})
        }
        else
        {
            res.status(200).json({result:true})
        }
    })
})

router.post('/deletedata',function(req,res){
    pool.query("delete from registration where registrationid=?",[req.body.registrationid],function(error,result){
        if(error)
        {
            res.status(500).json([])
        }
        else
        {
            res.status(200).json(result)
        }
    })
})

// router.delete('/deletedata/:registrationid',function(req,res){
//     console.log(req.query)
//     console.log(req.body)
//     console.log(req.params)
//     pool.query("delete from registration where registrationid=?",[req.body.registrationid],function(error,result){
//         if(error)
//         {
//             res.status(500).json([])
//         }
//         else
//         {
//             res.status(200).json(result)
//         }
//     })
// })

// router.put('/updatedata',function(req,res){
//         console.log(req.query)
//         console.log(req.body)
//         console.log(req.params)
//         pool.query("update registration set name=?,jobtype=?,state=?,city=? where registrationid=?",[req.body.name,req.body.jobtype,req.body.state,req.body.city,req.body.registrationid],function(error,result){
//             if(error)
//             {
//                 res.status(500).json([])
//             }
//             else
//             {
//                 res.status(200).json({result:"Success"})
//             }
//         })
//     })

// router.patch('/updatedata',function(req,res){
//             console.log(req.query)
//             console.log(req.body)
//             console.log(req.params)
//             pool.query("update registration set name=?,emailid=? where registrationid=?",[req.body.name,req.body.emailid,req.body.registrationid],function(error,result){
//                 if(error)
//                 {
//                     res.status(500).json([])
//                 }
//                 else
//                 {
//                     res.status(200).json({result:"Success"})
//                 }
//             })
//         })

// router.get('/expromise',funtion(req,res){
//     let P=new Promise((resolve,reject)=>{
//         let x=100+200
//         if(x==300)
//         {
//             resolve("Success")
//         }
//         else
//         {
//             reject("Fail")
//         }

//     })
    
//     P.then((message)=>{
//         console.log("Problem Solved"+message)

//     }).catch(message){
//         console.log("Fail to solve"+message)

//     }
//     res.render("index",{title:"Express"});
// })

module.exports = router;
