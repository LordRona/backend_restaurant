const express = require("express");
const router = express.Router();
// const upload = require("../controllers/product.controller");

const verifySignup = require("../middlewares/verifySignUp");
const authJwt = require("../middlewares/authJwt");
const controller = require("../controllers/user.controller");

// const upload = multer({ dest: "upload/"});

const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getALLProductsBySingleUser,
    getDashboard,
    searchProduct,
    upload,
} = require("../controllers/product.controller");

router.route("/createProduct").post(upload.single('image'),createProduct);
router.route("/getall").get(getAllProduct);
router.route("/getDashboard").get(getDashboard);
router.route("/search").get(searchProduct);
router.route("/getAllProductsBySingleUser/:userId").get(getALLProductsBySingleUser);
router.route("/:id").get(getSingleProduct).patch(updateProduct).delete(deleteProduct);

// router.route("/uploadImage")
// .post([authJwt.verifyToken], uploadImage);


module.exports = router;
