const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares");

const {
    createReview,
    getSpecificReview,
    getSingleReview,
    deleteReview,
    updateReview,
} = require("../controllers/reviewContoller");

router.route("/:productId/reviews").post(createReview)
                                    .get(getSingleReview);
router.route('/:productId/reviews/:reviewId').get(getSingleReview)
                                             .put(updateReview)
                                             .delete(deleteReview);

// router.route("/:id/review").get(getSingleReview)
//                     .patch([authJwt.verifyToken], updateReview)
//                     .delete([authJwt.verifyToken], deleteReview);

module.exports = router;