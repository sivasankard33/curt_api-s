const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

var app = express();
var PORT = 3000;

app.use(bodyParser());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/employee');


var schema = new mongoose.Schema({
     Empno:Number,
     Empname:String,
     Place:String
   
})

var userdata = mongoose.model('myuser',schema);

app.get('/',function(req,res){
    console.log('Hello world');
    res.json("hello world")
})

app.post('/api/setdata',verifyToken,function(req,res){
     userdata({
        Empno:req.body.Empno,
        Empname:req.body.Empname,
        Place:req.body.Place
       
    }).save(function(err,result){
        if(err){
            throw err;
            console.log(err);
            console.log("Invalid data");
        }else{
            res.json(result);
        }
    })

})

app.get('/api/userdata',verifyToken,function(req,res){
   
    userdata.find({},function(err,result){

        if(err){
            throw err;
        }
        res.json(result);
    })
})

app.put('/api/update/:id',verifyToken,function(req,res){
    userdata.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){
        userdata.findOne({_id:req.params.id}).then(function(userdata){
            res.send(userdata);
        })
    })
});



app.delete('/api/delete/:id',verifyToken,function(req,res){
    
   userdata.findByIdAndRemove({_id:req.params.id},function(err,data){
       if(err){
           throw err
       }else{
           res.send(data);
       }
   })

})

app.post('/api/login', function(req,res){
    const User ={
        id:1,
        username:'siva',
        email:'b@b.com'
    }
    jwt.sign({ User:User, },'secretkey', { expiresIn:'30s' },function(err,token){
    res.json({
        token:token
    });
});
});


function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !=='undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
        Forbidden :{
            message:'Bad request';
        }
    }
}


app.listen(PORT,function(){
    console.log('server is running on this '+ PORT);
})


/* For testing the above api's first run or test the login api and set that token for autharization,then only 
 api's will work*/