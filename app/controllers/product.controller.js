const Product  = require("../models/product.model");
const User = require("../models/user.model");


const createProduct = async (req, res) =>{
    try {
        const user = await User.findOne({ username: req.body.username });
        if(!req.file) {
            return res.status(419).json({ message: `No file uploaded!` });
        };

        const image = req.file.image;

       if(!image.mimetype.startsWith("image")){ 
         return res.status(419).json({ message: `File type has to be image!` });
        };

       if(image.size > maxSize) {
        return res.status(419).json({ message: `Please upload image less than 1MB` });
       };

       const imagePath = path.join(__dirname, '../public/uploads/' + `${image.name}`);

       
       await image.mv(imagePath);

       res.status(200).json({ image: `/uploads/${image.name}` });

        const product = new Product({
            name: req.body.name,
            // description: req.body.description,
            price: req.body.price,
            // category: req.body.category,
            image: image.name,
            quantity: req.body.quantity,
            user: user.id,
        });

        await product.save();
        res.status(200).json({ message: "Product created successfully!" });

    } catch (error) {
        res.status(404).json({ message: "Error occured while creating product!" });
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

    S3.deleteObject(params).promise();
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
    getALLProductsBySingleUser,
    getDashboard,
    searchProduct,
}