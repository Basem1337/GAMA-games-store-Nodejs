const JWT = require("jsonwebtoken")

async function isAuthenticated(req,res,next){
    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json("Unauthorized")
    }
    
    try{
        const tokenPayload = JWT.verify(token,process.env.JWT_SECRET)
        req.userId = tokenPayload.userId
        next();
    }catch(err){
        return res.status(401).json("Unauthorized")
    }
}

module.exports = isAuthenticated