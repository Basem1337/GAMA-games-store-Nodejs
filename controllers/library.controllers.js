const Library = require("../models/library")

async function getLibrary(req,res,next){
    const userId = req.userId

    const library = await Library.findOne({user:userId}).populate("games")

    if(!library){
        return res.status(404).json("library not found")
    }

    res.json(library)
}

module.exports = {getLibrary}