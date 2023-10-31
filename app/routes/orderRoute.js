const express = require("express");
const router = express.Router();

const {
    getOrderUser,
    getOrderRestaurant,
    //getCurrentUserOrders,
    createOrder,
    // updateOrder
} = require("../controllers/order.controller");

router
      .route("/createOrder")
      .post(createOrder);
router.route("/getOrderUser/:orderedBy").get(getOrderUser);
router.route("/getOrderRestaurant/:restaurantId").get(getOrderRestaurant);


module.exports = router;