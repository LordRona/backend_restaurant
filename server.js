const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const mongoose = require('mongoose');
const path = require("path");
const bodyParser = require("body-parser");
mongoose.set('strictQuery', false);
const User = require("./app/models/user.model")

//routers
const productRoute = require("./app/routes/product.routes");
const reviewRoute = require("./app/routes/review.route");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


app.use(express.static("./public"));

app.get("/", (req, res) =>{
  res.sendFile(path.join(__dirname, "app/public/index.html"));
})

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.use("/api/product", productRoute);
app.use("/api", reviewRoute);

// set port, listen for requests
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'restaurant' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
