const express = require("express");
const router = express.Router();
const { searchUser, calculateUserBalancePerDay } =  require("../controllers/userController");

router.route("/search-user").get(searchUser);
router.route("/user-balance-per-day").get(calculateUserBalancePerDay);

module.exports = router;