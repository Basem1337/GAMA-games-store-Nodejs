function validateSchema(schema){
return (req,res,next)=>{
let result
    try{
        result = schema.parse(req.body)
        next()
    }catch(err){
        return res.status(400).json({
            message: 'Invalid request body',
            errors: err.errors || null,
        });
    }

}
}

module.exports = validateSchema