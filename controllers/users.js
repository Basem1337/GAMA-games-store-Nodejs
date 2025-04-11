const User = require("../models/users.js")
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")

async function registerUser(req,res,next){
const {username,gender,email,password} = req.body;

const isEmailRegistered = await User.findOne({email})
const isUsernameRegisted = await User.findOne({username})

if(isEmailRegistered){
    return res.status(409).json("Email is already registered")
}
if(isUsernameRegisted){
    return res.status(409).json("Username is already registered")
}

const hashedPassword = await bcrypt.hash(password,10)

const newUser = await User.create({
    username,
    email,
    gender,
    password:hashedPassword,
})

res.status(200).json("User successfully created")

}

async function loginUser(req,res,next){
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json("Invalid email or password.") //User not found
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(401).json("Invalid email or password.")
    }

    const tokenPayload = {
        userId: user._id
    }

    const token = JWT.sign(tokenPayload,process.env.JWT_SECRET)

    res.status(200).json(token)
}

async function getUser(req,res,next){
    const userId = req.userId

    const user = await User.findById(userId)

    res.json(user)
}

module.exports = {registerUser,loginUser,getUser}