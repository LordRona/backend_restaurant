const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { suspendAccount, searchUser} = require("../controllers/userController");
const { app } = require("firebase-admin");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/restaurant",
    [authJwt.verifyToken, authJwt.isRestaurant],
    controller.restaurantBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.put(
    "/api/test/suspend",
    [authJwt.verifyToken, authJwt.isAdmin, suspendAccount],
    controller.suspendAccount
  );

  app.get("/api/test/search", 
  [authJwt.verifyToken, authJwt.isAdmin], searchUser
  );
};

