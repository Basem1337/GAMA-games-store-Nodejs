const router = require("express").Router()
const {registerUser,loginUser} = require("../controllers/users")
const validateSchema = require("../middleware/validateSchema")
const {registerSchema,loginSchema} = require("../validations/user.schemas")

router.route("/register").post(validateSchema(registerSchema),registerUser)
router.route("/login").post(validateSchema(loginSchema),loginUser)


module.exports = router