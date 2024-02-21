const express = require("express");
const router = express.Router();
const { 
    searchUser, 
    calculateUserBalancePerDay,
    makeUserVerified,
    getUnverifiedUsers,
} =  require("../controllers/userController");

router.route("/make-user-verified").post(makeUserVerified);
router.route("/search-user").get(searchUser);
router.route("/user-balance-per-day").get(calculateUserBalancePerDay);
router.route("/get-unverified-users").get(getUnverifiedUsers);

module.exports = router;