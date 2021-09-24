const joi = require("joi");

/**********************************
 * REGISTER VALIDATION
 **********************************/
const registerSchema = joi.object({
	name: joi.string().min(3).max(20).required(),
	email: joi.string().email().required(),
	phone: joi.number().required(),
	address: joi.string().min(10),
	password: joi
		.string()
		.required()
		.min(7)
		.message("Password Length should not be less than 7 characters"),
	repeat_password: joi.ref("password"),
});

const registerValidation = async (req, res, next) => {
	try {
		await registerSchema.validateAsync(req.body);
		next();
	} catch (err) {
		next(err);
	}
};

/**********************************
 * LOGIN VALIDATION
 **********************************/
const loginSchema = joi.object({
	email: joi.string().email().required(),
	password: joi
		.string()
		.required()
		.min(7)
		.message("Password Length should not be less than 7 characters"),
});

const loginValidation = async (req, res, next) => {
	try {
		await loginSchema.validateAsync(req.body);
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = { registerValidation, loginValidation };
