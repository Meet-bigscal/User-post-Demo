


// const Validator=[
//     check('name').isLength({min:5}).not().isEmpty().withMessage("name is required"),
//     check('username').isLength({min:3}).not().isEmpty().withMessage("username is required"),
//     check('email').isEmail().normalizeEmail().not().isEmpty().withMessage("email is required"),
//     check('password').matches(/^[a-zA-Z0-9._!@#%^&*]{6,30}$/).not().isEmpty().withMessage("password required")
// ]

// const result=(req,res,next)=>{
//     const result=validationResult(req)
//     const hasError=!result.isEmpty()

//     if(hasError){
//         const error=result.array()[0].msg
//        return res.status(400).send({error})
//     }
//     next()
// }


// const userRegistervalidator = Joi.object({
//     name : Joi.string().min(5).max(30).required(),
//     username : Joi.string().max(50).required(),
//     email:Joi.string().email().min(5).max(50).required(),
//     password:Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")).required(),
// })

// const loginvalidator=Joi.object({
//     email:Joi.string().email().min(5).max(50).required(),
//     password: Joi.string().pattern(/^[a-zA-Z0-9._!@#%^&*]{6,30}$/).required(),
// })
const Joi = require('joi')
const loginValidation = {
    body: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .regex(/[a-zA-Z0-9]{3,30}/)
            .required(),
    }),
}
const registerValidation = {
    body: Joi.object({
        name: Joi.string()
            .min(5)
            .max(30)
            .required(),

        username: Joi.string()
            .min(3).
            required(),

        email: Joi.string()
            .email()
            .min(5)
            .max(50)
            .required(),

        password: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
            .required(),
        confirmpassword: Joi.string()
            .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
            .required(),


    })
}

module.exports = { loginValidation, registerValidation }

