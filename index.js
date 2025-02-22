const exp = require("express");

const app = exp();

const PORT = 3000;

app.use(function(req,res,next){
    console.log(req.method);
    console.log(req.url);
    next();
});

app.get("/",function(req,res){    

});


app.listen(PORT,function(){
    console.log("Server Started on Port", PORT);
});