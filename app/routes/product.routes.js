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

const { getSingleProductReviews } = require("../controllers/reviewContoller");

router.route('/createProduct').post([authJwt.verifyToken, authJwt.isAdmin], createProduct);

router.route("/uploadImage")
.post([authJwt.verifyToken, authJwt.isAdmin], uploadImage);

router.route("/:id")
.get(getSingleProduct)
.patch([authJwt.verifyToken, authJwt.isAdmin], updateProduct);

router.route("/:id")
      .get(getAllProduct)
      .patch([authJwt.verifyToken, authJwt.isAdmin], updateProduct)
      .delete([authJwt.verifyToken, authJwt.isAdmin], deleteProduct);


router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;