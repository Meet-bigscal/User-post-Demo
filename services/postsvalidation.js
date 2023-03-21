const { required } = require("joi");
const Joi = require("joi");
// const postvalidator = Joi.object({
//     title : Joi.string().min(5).max(30),
//     description:Joi.string().min(5),
// })

const postvalidator = {
    body: Joi.object({
        title: Joi.string()
               .min(5),
        description: Joi.string()
                .min(5)
    })
}
module.exports = { postvalidator}