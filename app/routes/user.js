const express = require("express");
const router = express.Router();
const { searchUser } =  require("../controllers/userController");

router.route("/search-user").get(searchUser);

module.exports = router;