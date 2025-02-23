const exp = require("express");
require('dotenv').config();
const cors = require('cors');
const httpStatusText=require('./utils/httpStatusText');
const mongoose = require('mongoose');

// const url = process.env.mongo_url;
// mongoose.connect(url).then(()=>{
//     console.log("Connected");}
// ) 


const app = exp();

const PORT = 3000;

app.use(function(req,res,next){
    console.log(req.method);
    console.log(req.url);
    next();
});

app.get("/",function(req,res){    

});
//wrong Routes Handling
app.all('*',(req,res,next)=>{
    res.status(404).json({status:httpStatusText.ERROR,message:"This resource is not available"});
    })
//global error handling 
    app.use((err,req,res,next)=>{
        res.status(err.statusCode || 500).json({status: err.statusText || httpStatusText.ERROR,message:err.message , code: err.statusCode || 500});
    })


app.listen(PORT,function(){
    console.log("Server Started on Port", PORT);
});