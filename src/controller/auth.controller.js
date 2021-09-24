const User = require("../model/user.model");

/**********************************
 * REGISTER
 **********************************/
const registerController = async (req, res, next) => {
	try {
		const user = new User(req.body);

		/** Check User Exist or Not  **/
		const checksEmail = await User.findOne({ email: user.email });
		const checksPhone = await User.findOne({ phone: user.phone });
		if (checksEmail) {
			throw new Error("Email Address already registered");
		}
		if (checksPhone) {
			throw new Error("Phone already registered");
		}

		/** All Ok */
		await user.save();

		const token = await user.generateJwtToken();
		res.status(201).send({ data: await user.getPublicData(), token });
	} catch (error) {
		next(error);
	}
};

/**********************************
 * LOGIN
 **********************************/
const loginController = async (req, res, next) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateJwtToken();
		res.status(200).send({
			data: await user.getPublicData(),
			token,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { registerController, loginController };
