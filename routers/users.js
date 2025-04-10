const router = require("express").Router()
const {registerUser,loginUser, getUser} = require("../controllers/users")
const validateSchema = require("../middleware/validateSchema")
const {registerSchema,loginSchema} = require("../validations/user.schemas")
const isAuthenticated = require("../middleware/isAuthenticated")

router.route("/register").post(validateSchema(registerSchema),registerUser)
router.route("/login").post(validateSchema(loginSchema),loginUser)
router.route("/me").get(isAuthenticated,getUser)

module.exports = router