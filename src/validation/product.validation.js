const joi = require("joi");

/**********************************
 * PRODUCT TYPE VALIDATION
 **********************************/
const productTypeSchema = joi.object({
	name: joi.string().min(3).max(20).required(),
	status: joi.boolean(),
});

const productTypeValidation = async (req, res, next) => {
	try {
		await productTypeSchema.validateAsync(req.body);
		next();
	} catch (err) {
		next(err);
	}
};

/**********************************
 * CREATE PRODUCT VALIDATION
 **********************************/
const productSchema = joi.object({
	name: joi.string().min(3).max(20).required(),
	type: joi.string().required(),
	price: joi.number().min(1).required(),
	image: joi.optional(),
});

const productValidation = async (req, res, next) => {
	try {
		await productSchema.validateAsync(req.body);
		next();
	} catch (err) {
		next(err);
	}
};

/**********************************
 * EDIT PRODUCT VALIDATION
 **********************************/
const productEditSchema = joi.object({
	name: joi.string().min(3).max(20).optional(),
	type: joi.string().optional(),
	price: joi.number().min(1).optional(),
	image: joi.optional(),
});

const productEditValidation = async (req, res, next) => {
	try {
		if (!req.params.productId) {
			throw new Error("ProductID required");
		}
		await productEditSchema.validateAsync(req.body);
		next();
	} catch (err) {
		next(err);
	}
};

/**********************************
 * COMMENT VALIDATION
 **********************************/
const commentSchema = joi.object({
	comment: joi.string().min(3).required(),
});

const commentValidation = async (req, res, next) => {
	try {
		if (!req.params.productId) {
			throw new Error("ProductID required");
		}
		await commentSchema.validateAsync(req.body);
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = {
	productTypeValidation,
	productValidation,
	productEditValidation,
	commentValidation,
};
