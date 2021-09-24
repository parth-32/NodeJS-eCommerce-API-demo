const { ProductType, Product } = require("../model/product.model");
const appError = require("../utils/appError");

const { ObjectId } = require("bson");

/**********************************
 * CREATE PRODUCT TYPE
 **********************************/
const createProductType = async (req, res, next) => {
	try {
		const type = new ProductType(req.body);

		/** Check Type exist or not **/
		const checkType = await ProductType.findOne({ name: type.name });
		if (checkType) {
			throw new appError("Product Type Already Exists", 409);
		}

		/** All Ok **/
		await type.save();

		res.status(201).send({
			data: type,
		});
	} catch (error) {
		next(error);
	}
};

/**********************************
 * GET PRODUCT TYPES
 **********************************/
const getProductType = async (req, res, next) => {
	const types = await ProductType.find();

	res.send({ data: types });
};

/**********************************
 * CREATE PRODUCT
 **********************************/
const creatProduct = async (req, res, next) => {
	try {
		req.body.uploadBy = req.userData._id;

		/** Check Type valid or not **/
		const checkType = await ProductType.findById(
			new ObjectId(req.body.type)
		);
		if (!checkType) throw new appError("Product type invalid", 400);

		/** Check Product exist or not for this user **/
		const checkProduct = await Product.findOne({
			uploadBy: req.userData._id,
			name: req.body.name,
		});
		if (checkProduct)
			throw new appError("Product already uploaded by you", 409);

		/** All Ok **/
		const product = await Product(req.body).populate({
			path: "uploadBy",
			select: "name ",
		});
		await product.save();

		res.send({
			data: {
				...product._doc,
				type: { _id: checkType._id, name: checkType.name },
			},
		});
	} catch (error) {
		next(error);
	}
};

/**********************************
 * GET ALL PRODUCT
 *
 *   /product
 *
 *   /product?type=typeId
 *
 *   /product?filter=recent
 *
 *   /product?filter=most_liked
 *
 **********************************/
const getAllProduct = async (req, res, next) => {
	try {
		const match = {};

		const sort = {};

		const typeId = req.query.type;
		typeId && (match.type = typeId);

		if (req.query?.filter == "recent") {
			sort.createdAt = -1;
		} else if (req.query?.filter == "most_liked") {
			sort.like = -1;
		}

		const products = await Product.find(match)
			.sort(sort)
			.populate({
				path: "type",
				select: "name ",
			})
			.populate({
				path: "uploadBy",
				select: "name",
			})
			.populate({
				path: "comments.user",
				select: "name ",
			});

		/** Update like/dislike array data with length **/
		const updated = products.map((product) => ({
			...product._doc,
			like: product.like.length,
			dislike: product.dislike.length,
		}));

		res.send({
			data: updated,
		});
	} catch (error) {
		next(error);
	}
};

/**********************************
 * EDIT PRODUCT DETAIL
 **********************************/
const editProduct = async (req, res, next) => {
	const updates = Object.keys(req.body);

	try {
		/** Check Type valid or not **/
		if (req.body?.type) {
			const checkType = await ProductType.findById(req.body.type);
			console.log(req.body.type);

			if (!checkType) throw new appError("Product type invalid", 400);
		}

		/** Check Product exist or not **/
		const checkProduct = await Product.findOne({
			uploadBy: req.userData._id,
			name: req.body.name,
			_id: { $ne: req.params.productId },
		});
		if (checkProduct)
			throw new appError("Product Name Already Exists", 409);

		/** All Ok **/
		const product = await Product.findOne({
			uploadBy: req.userData._id,
		})
			.populate({
				path: "uploadBy",
				select: "name ",
			})
			.populate({
				path: "type",
				select: "name ",
			});

		if (!product || product.length == 0) {
			throw new appError("Product Not Found", 404);
		}

		updates.forEach((ele) => (product[ele] = req.body[ele]));

		await product.save();

		res.send({ data: product });
	} catch (error) {
		next(error);
	}
};

/**********************************
 * DELETE PRODUCT
 **********************************/
const deleteProduct = async (req, res, next) => {
	try {
		const product = await Product.findOneAndDelete({
			_id: req.params.productId,
			uploadBy: req.userData._id,
		});

		res.send({
			data: `${product.name} product deleted successfully`,
		});
	} catch (error) {
		next(error);
	}
};

/**********************************
 * GIVE LIKE ON PRODUCT
 **********************************/
const giveLikeOnProduct = async (req, res, next) => {
	try {
		/** If Have dislike then remove it before like **/
		await Product.findOneAndUpdate(
			{
				_id: req.params.productId,
				"dislike.user": req.userData._id,
			},
			{
				$pull: {
					dislike: { user: req.userData._id },
				},
			}
		);
		const products = await Product.findOneAndUpdate(
			{
				_id: req.params.productId,
			},
			{
				$push: {
					like: {
						user: req.userData._id,
					},
				},
			},
			{
				returnOriginal: false,
			}
		);

		res.send({ data: products });
	} catch (error) {
		next(error);
	}
};

const giveDislikeOnProduct = async (req, res, next) => {
	try {
		/** If Have like then remove it before dislike **/
		await Product.findOneAndUpdate(
			{
				_id: req.params.productId,
				"like.user": req.userData._id,
			},
			{
				$pull: {
					like: { user: req.userData._id },
				},
			}
		);

		const products = await Product.findOneAndUpdate(
			{
				_id: req.params.productId,
			},
			{
				$push: {
					dislike: {
						user: req.userData._id,
					},
				},
			},
			{ returnOriginal: false }
		);

		res.send({
			data: products,
		});
	} catch (error) {
		next(error);
	}
};

/**********************************
 * GIVE COMMENT
 **********************************/
const giveCommentOnProduct = async (req, res, next) => {
	try {
		const product = await Product.findByIdAndUpdate(
			req.params.productId,
			{
				$push: {
					comments: {
						user: req.userData._id,
						comment: req.body.comment,
					},
				},
			},
			{
				returnOriginal: false,
			}
		);

		res.send({ data: product });
	} catch (error) {
		next(error);
	}
};

/**********************************
 * GET COMMENT ON PRODUCT
 **********************************/
const getCommentOnProduct = async (req, res, next) => {
	try {
		const comments = await Product.findOne({
			_id: req.params.productId,
		}).populate({
			path: "comments.user",
			select: "name ",
		});

		/** Update like array data with length **/
		res.send({
			data: {
				...comments._doc,
				like: comments.like.length,
				dislike: comments.dislike.length,
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createProductType,
	getProductType,
	creatProduct,
	getAllProduct,
	editProduct,
	deleteProduct,
	giveLikeOnProduct,
	giveDislikeOnProduct,
	giveCommentOnProduct,
	getCommentOnProduct,
};
