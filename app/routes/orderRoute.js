const express = require("express");
const router = express.Router();

const {
    getOrderUser,
    // getSingleOrder,
    //getCurrentUserOrders,
    createOrder,
    // updateOrder
} = require("../controllers/order.controller");

router
      .route("/createOrder")
      .post(createOrder);
router.route("/getOrder/:userId").get(getOrderUser);


module.exports = router;