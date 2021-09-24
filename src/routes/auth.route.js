const router = require("express").Router();

const {
	registerValidation,
	loginValidation,
} = require("../validation/auth.validation");

const {
	registerController,
	loginController,
} = require("../controller/auth.controller");

/** Register */
router.post("/register", registerValidation, registerController);

/** Login */
router.post("/login", loginValidation, loginController);

module.exports = router;
