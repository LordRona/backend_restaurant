const Product  = require("../models/product.model");
const User = require("../models/user.model");
const multer = require("multer");
const AWS = require('aws-sdk');
const sharp = require("sharp");

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRETE_ACCESS,
    region: process.env.REGION,
  });
  const s3 = new AWS.S3();


const createProduct = async(req, res) => {
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
  };  

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
        .sort({ createdAt: -1 }).limit(20).populate("owner", "username");

        res.status(200).json({ product });
    }catch(error){
        res.status(404).json({ message: "Error occured while getting recent product!" });
    }
}

const updateProduct = async (req, res) =>{
    const { id: productID } = req.params;
    const { key, file } = req.body;
    const params = {
        Bucket: "newalzironbucket",
        Key: key,
        Body: file
    }

    await s3Storage.upload(params).promise();

    const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
        new: true,
        runValidators: true,
    });

    if(!product) return res.status(404).send("Product to be updated not found!");

    res.status(200).json({ product });
};

const deleteProduct = async (req, res) =>{
    const { id: productId, key } = req.params;
    //Deleting from the S3 bucket
    const params = {
        Bucket: "newalzironbucket",
        Key: key
    }

    s3.deleteObject(params).promise();
    console.log("Picture deleted successfully!", key);

    const product = await Product.findOneAndDelete({ _id: productId });

    if(!product) return res.status(404).json({ message: `Product not found!` });

    await product.remove();
    res.status(200).json({ msg: "Product successfully deleted!" });
};

const searchProduct = async (req, res) => {
    const searchTerm = req.query.q; // Get the search query parameter from the request
  
    try {
      const results = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });
  
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
    updateProduct,
    deleteProduct,
    getALLProductsBySingleUser,
    getDashboard,
    searchProduct,
    upload,
}

