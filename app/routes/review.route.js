const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");

const {
    createReview,
    getAllReviews,
    getSingleReview,
    deleteReview,
    updateReview,
} = require("../controllers/reviewContoller");

router.route("/createReview").post([authJwt.verifyToken,], createReview)
.get(getAllReviews);

router.route("/:id/review").get(getSingleReview)
                    .patch([authJwt.verifyToken], updateReview)
                    .delete([authJwt.verifyToken], deleteReview);


module.exports = router;