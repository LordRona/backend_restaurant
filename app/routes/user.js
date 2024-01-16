const express = require("express");
const router = express.Router();
const { 
    searchUser, 
    calculateUserBalancePerDay,
    createUserToken,
} =  require("../controllers/userController");

router.route("/search-user").get(searchUser);
router.route("/user-balance-per-day").get(calculateUserBalancePerDay);
router.route("/create-user-token").post(createUserToken);

module.exports = router;