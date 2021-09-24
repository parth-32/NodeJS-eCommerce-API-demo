const router = require("express").Router();
const auth = require("../auth/verify.auth");

const {
	productTypeValidation,
	productValidation,
	productEditValidation,
	commentValidation,
} = require("../validation/product.validation");

const {
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
} = require("../controller/product.controller");

/** Create Product Type */
router.post("/type", auth, productTypeValidation, createProductType);

/** Get Product Type */
router.get("/type", auth, getProductType);

/** Create Product */
router.post("/", auth, productValidation, creatProduct);

/** Get All Product */
router.get("/", auth, getAllProduct);

/** Edit Product */
router.patch("/:productId", auth, productEditValidation, editProduct);

/** Delete Product */
router.delete("/:productId", auth, deleteProduct);

/** Give Like On Product */
router.post("/like/:productId", auth, giveLikeOnProduct);

/** Give Like On Product */
router.post("/dislike/:productId", auth, giveDislikeOnProduct);

/** Give Comment on Product **/
router.post(
	"/:productId/comment",
	auth,
	commentValidation,
	giveCommentOnProduct
);

/** Get Comment On Product */
router.get("/:productId/comment", auth, getCommentOnProduct);

module.exports = router;

