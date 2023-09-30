import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
    phone: Joi.string().max(100).required(),
    age: Joi.string().max(100).required(),
    gender: Joi.string().max(100).required(),
    weight: Joi.string().max(100).required(),
    height: Joi.string().max(100).required()
    
});

const loginUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
});

const getUserValidation = Joi.string().max(100).required();

const getUserValidationid = Joi.number().max(100).required();


const updateUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required(),
    phone: Joi.string().max(100).required(),
    age: Joi.string().max(100).required(),
    gender: Joi.string().max(100).required(),
    weight: Joi.string().max(100).required(),
    height: Joi.string().max(100).required(),
    id: Joi.number().max(100).required(),
    

})

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation,
    getUserValidationid
}
