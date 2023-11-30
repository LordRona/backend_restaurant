const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrPhone,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", authJwt.checkSuspendedAccount,  controller.signin);

  //logout 
  app.post('/api/auth/signout', verifySignUp.loginAuth)
};
