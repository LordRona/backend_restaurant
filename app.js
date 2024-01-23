const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const mongoose = require('mongoose');
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./e-restou-alziron-firebase-adminsdk-37aq4-883e03d2e8.json");
mongoose.set('strictQuery', false);
const Product = require("./app/models/product.model");
const AWS = require('aws-sdk');
const sharp = require("sharp");
require('dotenv').config();

//routers
const productRoute = require("./app/routes/product.routes");
const reviewRoute = require("./app/routes/review.route");
const userRoute = require("./app/routes/user.routes");
const orderRoute  = require("./app/routes/orderRoute");
const searchUser = require("./app/routes/user");
const calculateUserBalancePerDay = require("./app/routes/user");
const user_token = require("./app/routes/user");
const makeUserVerified = require("./app/routes/user");
const recomendation = require("./app/routes/recommendation.route");

const app = express();


app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(process.env.MONGO_URI, {
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

  if (!admin.apps.length) {
    const firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
    });
};

const message = {
  Notification: {
    title: "Test Your luck",
    body: "Not bad then",
  },
  //token: registrationToken
}

//AWS
// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

AWS.config.update({
  accessKeyId: 'AKIAWY2J6GUJWDH5TXPN',
  secretAccessKey: '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',
  region: 'us-east-1'
});
const s3 = new AWS.S3();

app.use(express.static('./uploads'));

// Handle image upload
app.post('/api/product/image', upload.single('image'), async(req, res) => {
  try{ 
  const imageFile = req.file;


  const compressedImageBuffer = await sharp(imageFile.buffer)
  .toFormat("jpeg").jpeg({ quality: 70}).toBuffer();

   // Upload the compressed image file to S3 bucket
   const uploadParams = {
    Bucket: 'newalzironbucket',
    Key: `${Date.now()}-${imageFile.originalname}`,
    Body: compressedImageBuffer,
    ACL: 'public-read',
    ContentType: imageFile.mimetype
  };

  const uploadResult = await s3.upload(uploadParams).promise();

    // Get the S3 image URL
    const imageUrl = uploadResult.Location;
  //.replace(/\s/g, '');
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    image: imageUrl
  });

  const savedProducts = await newProduct.save();
  console.log("Product created successfully!", savedProducts, imageFile);
  res.status(200).json({message: "Product created successfully!" });
  res.json({ imageUrl: req.file.location });

}catch(error){
  res.status(404).json({ message: `Error occured while creating product!` });
  console.log(error);
}
});

app.get("/", (req, res) =>{
  res.send("Welcome to alziron systems app!")
});

// app.get('/search', async (req, res) => {
//   const searchTerm = req.query.q; // Get the search query parameter from the request

//   try {
//     const results = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });

//     res.json(results);
//   } catch (error) {
//     console.error('Error performing search:', error);
//     res.status(500).json({ error: 'An error occurred during the search' });
//   }
// });

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.use("/api/product", productRoute);
app.use("/api/review" ,reviewRoute);
app.use("/api/user", userRoute);
app.use("/api/order", orderRoute);
app.use("/api/search", searchUser);
app.use("/api/", calculateUserBalancePerDay);
app.use("/api/recommendation", recomendation);
app.use("/api", user_token);
app.use("/api/verify", makeUserVerified);


// set port, listen for requests
const PORT = process.env.PORT || 3000;
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
