const router = require("express").Router();

router.use((req, res, next) => {
	/**********************************
	 *   url  /auth/login
	 **********************************/

	/** splitURL => [ '', 'auth', 'login' ] */
	const splitURL = req.originalUrl.toString().split("/");

	/** page => auth */
	const page = splitURL[1];

	/** redirect => /auth */
	var redirect = "/" + page;

	try {
		/** URL =>  /auth/login */
		console.log("\trequested url : ", req.originalUrl);

		/** PAGE => ./auth.route */
		console.log(`\t./${page}.route`);

		/** REQUIRE ROUTE PAGE => ./auth.route.js */
		require.resolve(`./${page}.route.js`);

		/** ROUTING  => ./auth.route.js */
		const Routing = require(`./${page}.route`);

		/** router.use("/auth", require("./auth.route")) =>  */
		router.use(`/${redirect}`, Routing);
	} catch (e) {
		return res.status(404).send({
			success: 0,
			message: e.message || `Requested URL ${req.originalUrl} not found`,
			error: e,
		});
	}

	next();
});

module.exports = router;
