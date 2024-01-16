const Product  = require("../models/product.model");
const User = require("../models/user.model");
const multer = require("multer");
const sharp = require("sharp");
const mongoose = require("mongoose")
const dbConfig = require("../config/db.config");
const AWS = require("aws-sdk");

require('dotenv').config()

//Firebase
var admin = require("firebase-admin");

var serviceAccount = require("./erestau-1-firebase.json");
const { collection } = require("../models/order.model");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
  storageBucket: process.env.BUCKET_URL
}, "bucket");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createProduct = async (req, res) => {
  try {

    const { originalname, buffer } = req.file;

    const compressedImageBuffer = await sharp(buffer)
    .resize({ width: 800 }).jpeg({ quality: 70 }).toBuffer();

    // Create a unique filename for the uploaded image
    const filename = `${Date.now()}_${originalname}`;

    // Upload the image file to Firebase Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(filename);
    const uploadResult = await file.save(compressedImageBuffer, {
      metadata: {
        contentType: req.file.mimetype, // Set the appropriate content type for your image
      },
    });

    // Get the public URL of the uploaded image
    const url = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500' // Set an appropriate expiration date
    });

    const user = await User.findOne({ username: req.body.username });

    const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            image: url[0],
            owner: user._id,
            ownerName: req.body.username,
            ownerLocation: user.location,
            path: filename
          });
        
          const savedProducts = await newProduct.save();
         console.log(savedProducts);

    res.status(200).json({ url });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('An error occurred while uploading the image.');
  }
}

const getProductByCategory = async(req, res)=>{
  try {
    const categoryName = req.body.category;

    const date = new Date();
    date.setHours(0,0,0,0);

    const category = await Product.find({ 
      categoryName,
      createdAt: { $gte: date },
    });

    res.status(200).json({ category });
  } catch (error) {
    res.status(404).json({ msg: "Error occured while getting product by category" });
  }
}


const getAllProduct = async (req, res) =>{
    const products = await Product.find({});

res.status(200).json({ products/*, count: products.length*/ });
};

const getALLProductsBySingleUser = async (req, res) =>{
    const userId = req.params.userId

    const products = await Product.find({ owner: userId });

    res.status(200).json({ products });
}

const getSingleProduct = async (req, res) =>{
const product = await Product.findById(req.params.id);
      res.status(200).json(product);
};

//Get recent products

const getDashboard = async (req, res) =>{
    try{
        const product = await Product.find({})
        .sort({ createdAt: -1 }).limit(20)

        res.status(200).json({ product });
    }catch(error){
        res.status(404).json({ message: "Error occured while getting recent product!" });
    }
}

// const updateProduct = async (req, res) =>{
//     const { id: productID } = req.params;
//     const { key, file } = req.body;
//     const params = {
//         Bucket: "newalzironbucket",
//         Key: key,
//         Body: file
//     }

//     await s3Storage.upload(params).promise();

//     const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
//         new: true,
//         runValidators: true,
//     });

//     if(!product) return res.status(404).send("Product to be updated not found!");

//     res.status(200).json({ product });
// };

const deleteProduct = async (req, res) =>{
    const { id } = req.params;
   try{
    const image = await Product.findOne({ _id: id });

    if(!image){
      res.status(200).json("Image not found!");
    };

     // Delete the image from Firebase Storage
     admin.storage().bucket().file(image.path).delete();

     // Delete the image record from MongoDB
    await Product.deleteOne({ _id : id });

    res.status(200).json({ message: 'Image deleted successfully!' });
   }catch(err){
    res.status(404).json({ msg: "Error while deleting picture!" });
   }
};

const searchProduct = async (req, res) => {
    const searchTerm = req.query.q; // Get the search query parameter from the request
  
    try {
      const results = await Product.find({ 
        $or: [ 
        { name: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
        ]
     });
  
      res.json(results);
    } catch (error) {
      console.error('Error performing search:', error);
      res.status(500).json({ error: 'An error occurred during the search' });
    }
  };


module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    getProductByCategory,
    deleteProduct,
    getALLProductsBySingleUser,
    getDashboard,
    searchProduct,
    upload,
}

