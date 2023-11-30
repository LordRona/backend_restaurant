const express = require("express");
const router = express.Router();

const {
    getOrderUser,
    getOrderRestaurant,
    getOrdersOfTheDay,
    createOrder,
    tokenRoute,
    validateCode
} = require("../controllers/order.controller");

router
      .route("/createOrder")
      .post(createOrder);
router.route("/deliveryCode").post(validateCode);
router.route("/getOrderUser/:orderedBy").get(getOrderUser);
router.route("/getOrderRestaurant/:restaurantId").get(getOrderRestaurant);
router.route("/get-orders-per-day").get(getOrdersOfTheDay);

router.route("/token").post(tokenRoute);


module.exports = router;