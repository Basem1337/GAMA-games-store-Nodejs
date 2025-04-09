const mongoose = require("mongoose")

const librarySchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    games: {type:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      ],
    default:[]},
})

const Library = mongoose.model("Library",librarySchema)

module.exports = Library