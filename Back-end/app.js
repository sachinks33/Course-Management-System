const express = require('express');
const cors=require('cors');
const mongoose= require("mongoose");
const multer = require('multer');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const userModel= require('./models/user-model');
const courseModel=require('./models/course-model');
const enrollData= require('./models/enroll-model');
const { response } = require('express');
const app=new express();
const port=3000;
mongoose.connect('mongodb://localhost/cms');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const path= require('path');
const fs=require('fs')

// multer configure
    const storage= multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null, "./images");
        },
        filename:(req,file,cb)=>{
            cb(null,Date.now() +"-"+ file.originalname);
        }
    });
    const upload=multer({storage:storage});

//token verification middlewear
    function verifyToken(req, res, next){
        //console.log(req.headers.authorization);
        if(!req.headers.authorization){
            console.log(1111)
            return res.status(401).send("unauthorized requiest");
        }
        let token= req.headers.authorization.split(' ')[1];
        if(token==null){
            console.log(2222)
            return res.status(401).send("unauthorized requiest")
        }
        let payload=jwt.verify(token, 'secretKey');
        if(!payload){
            console.log(3333)
            return res.status(401).send("unauthorized requiest");
        }
        req.userId= payload.subject;
        next();
    }

app.post("/register",(req, res)=>{
    //console.log(req.body)
    userModel.findOne({email:req.body.email},(err, dbRes)=>{
        if(err){
            res.status(401).send("email already used");
        }
        else if(!dbRes){
            userData= {
                userName:req.body.fullName,
                email:req.body.email,
                mobile: req.body.mobile,
                userType: req.body.userType,
                password: req.body.password
            }
            userModel.create(userData).then((response)=>{
                response.password="******";
                let payload={subject: response._id};
                let token=jwt.sign(payload, "secretKey");
                res.status(200).send({response,token});
            });
        }
        else if(dbRes){
            res.status(401).send("email already used");
        }
    })
    
});
app.post("/login",(req,res)=>{
    loginData=req.body;
    console.log(loginData.password)
    userModel.findOne({email:loginData.email}, (error, data)=>{
        //console.log(data)
        //console.log(loginData.password,data.password)
        if(error){
            console.log("error: " +error);
        }
        else{
            if(!data){
                console.log("Invalid email")
                res.status(401).send("Invalid email");
            }
            
            else if(data.password!=loginData.password){
                console.log("invalid passw");
                res.status(401).send("Invalid password");
            }
            else{
                data.password="******";
                let payload={subject: data._id};
                let token=jwt.sign(payload, "secretKey");
                res.status(200).send({data,token});
            }
        }
    });
});
app.get("/courses", verifyToken, (req,res)=>{
    courseModel.find({}).then(dbRes=>{
        res.send(dbRes);
    });
});
app.post("/publish-course",upload.single('image'),(req, res)=>{
    if(req.file==undefined)
    {
        image=null
    }
    else{
        //image=path.join(__dirname + '/images/' + req.file.filename);
        image=fs.readFileSync(path.join(__dirname + '/images/' + req.file.filename)).toString("base64");
    }
    courseData={
        title:req.body.title,
        aim:req.body.aim,
        duration:req.body.duration,
        requirement:req.body.requirement,
        content:req.body.content,
        description:req.body.description,
        image:image};
    // courseData=req.body;
    // courseData.image=req.file.path;
    courseModel.create(courseData).then(response=>{
        res.send(response);
    });
    
});
app.post("/enroll", (req,res)=>{
    let sId= req.headers.authorization.split(' ')[1];
    console.log(sId);
    enrollData={
        courseId:req.body.courseId,
        studentId:sId,
        status:"Pending"
    }
})

app.listen(port, ()=>{console.log("Server ready at "+port )});