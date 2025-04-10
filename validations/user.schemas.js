const {z} = require("zod")

const registerSchema = z.object({
    username: z.string().min(3).max(28).regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
    email: z.string().email(),
    password: z.string().min(8).max(256),
    gender: z.enum(["male","female"]),
}).strict()


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(256),
}).strict()

module.exports = {registerSchema,loginSchema}