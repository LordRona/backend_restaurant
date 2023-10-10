const express = require("express");
const router = express.Router();

const {
    getAllOrders,
    getSingleOrder,
    //getCurrentUserOrders,
    createOrder,
    updateOrder
} = require("../controllers/order.controller");

router
      .route("/")
      .post(createOrder)


module.exports = router;