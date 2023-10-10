const express = require("express");
const router = express.Router();

const verifySignup = require("../middlewares/verifySignUp");
const authJwt = require("../middlewares/authJwt");
const controller = require("../controllers/user.controller");

const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require("../controllers/product.controller");

// const { getSingleProductReviews } = require("../controllers/reviewContoller");

router.route("/createProduct").post([authJwt.verifyToken], createProduct);
router.route("/getProducts").get(getAllProduct);
router.route("/:id").get(getSingleProduct).patch(updateProduct).delete(deleteProduct);

router.route("/uploadImage")
.post([authJwt.verifyToken], uploadImage);

// router.route("/:id/reviews").get(getSingleProductReviews);


module.exports = router;