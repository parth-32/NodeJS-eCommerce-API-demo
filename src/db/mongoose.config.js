const mongoose = require("mongoose");

mongoose.connect(`mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}`, {
	useNewUrlParser: true,
	// useCreateIndex: true,
	useUnifiedTopology: true,
});
