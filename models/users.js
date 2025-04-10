const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username:{
        type:String,
        minlength:3,
        maxlength:28,
        // validate: {
        //     validator: function(v) {
        //         return /^[A-Za-z]+[0-9]*$/.test(v);
        //     },},
        trim: true,
        unique: true,
        required: true
    },
    email:{
        type:String,
        // validate: {
        //     validator: function(v) {
        //         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        //     },},
        unique: true,
        lowercase:true,
        trim:true,
        required: true
    },
    password:{
        type:String,
        minlength: 8,
        maxlength:265,
        required: true
    },
    gender:{
        type:String,
        enum:["male","female"],
        required: true,
        
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User