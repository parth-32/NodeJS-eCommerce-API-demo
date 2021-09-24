const { ref } = require("joi");
const mongoose = require("mongoose");

/**********************************
 * PRODUCT TYPE SCHEMA
 **********************************/
const productTypeSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

/**********************************
 * PRODUCT SCHEMA
 **********************************/
const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		price: {
			type: Number,
			trim: true,
			required: true,
		},
		uploadBy: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		type: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "product_type",
		},
		like: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
		dislike: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
		comments: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				comment: {
					type: String,
				},
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

productTypeSchema.virtual("type", {
	ref: "Product",
	localField: "_id",
	foreignField: "type",
});

const ProductType = mongoose.model("product_type", productTypeSchema);
const Product = mongoose.model("Product", productSchema);

module.exports = { ProductType, Product };
