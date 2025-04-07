const Joi = require("joi");

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().required(), // No regex, accepts anything
        password: Joi.string().required(), // No restrictions, any input allowed
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(), // No restrictions on password
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation
};
