const Product  = require("../models/product.model");
const User = require("../models/user.model");
const path = require("path");

const createProduct = async (req, res) =>{
    try{
    // Get the user from the request.
     const user = await User.findOne({ username: req.body.username });
        
    // Create a new product.
     const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    owner: user.id,
  });

  // Save the product to the database.
  await product.save();

  // Return the product to the client.
  res.status(200).json(product);
  console.log("Product created successfully!");


    }catch(error){
        res.status(400).json({ message: "Error occured while trying to create product" });
        console.log(req.body);
    }
};

const getAllProduct = async (req, res) =>{
    const products = await Product.find({});

    res.status(200).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) =>{
    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: 
    productId }).populate("reviews");

    if(!product) throw res.status(419).json({ message: `Product not found!` });

    res.status(200).json({ product });
};

const updateProduct = async (req, res) =>{
    const { id: productID } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
        new: true,
        runValidators: true,
    });

    if(!product) return res.status(404).send("Product not found to be updated!");

    res.status(200).json({ product });
};

const deleteProduct = async (req, res) =>{
    const { id: productId } = req.params;

    const product = await Product.findOneAndDelete({ _id: productId });

    if(!product) return res.status(404).json({ message: `Product not found!` });

    await product.remove();
    res.status(200).json({ msg: "Product successfully deleted!" });
};

const uploadImage = async (req, res) =>{
    if(!req.file) return res.status(419).json({ message: `No file uploaded!` });

    const productImage = req.files.image;

    if(!productImage.mimetype.startsWith("image")) return res.status(419).json({ message: `File type has to be image!` });

    const maxSize = 1024 * 1024;

    if(productImage.size > maxSize) return res.status(419).json({ message: `Please upload image less than 1MB` });

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);

    await productImage.mv(imagePath);

    res.status(200).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}