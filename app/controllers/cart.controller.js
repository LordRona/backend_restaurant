// const Cart = require("../models/cart.model");
// const Product = require("../models/product.model");
// const User = require("../models/user.model");
// const mongoose = require("mongoose");

// const addProductToCart = async (req, res) =>{
//     try {
//         const { products } = req.body;
//         const user = await User.findOne({ username: req.body.username });
        
//         // Extract the product IDs from the received JSON object
//         const productIds = products.map(product => product._id);
//         // console.log(productIds);
    
//         // Use the productIds array in your Mongoose query
//         const foundProducts = await Product.find({ _id: { $in: productIds } });

//             // Create a new cart document and store the product IDs
//             if(foundProducts.length !== productIds.length){ 
//                 return res.status(404).json({ error: 'One or more products not found' });
//             }
//         const cart = new Cart({
//         productIds,
//         user: user.id,
//         });

//         const productCreators = foundProducts.filter(product => product.owner).map(product => product.owner);
//         const productids = productCreators.map(creatorId => mongoose.Types.ObjectId(creatorId))
//         //getting owner
//         console.log(productids);
//         const creators = await User.find({ _id: { $in: productids } });
        
//         console.log(creators);
  
//       // Save the cart document to the database
//        await cart.save();
  
//       res.status(200).json(cart);
//       } catch (error) {
//         res.status(400).json({ error: 'Invalid request' });
//       }
// }

// module.exports = { addProductToCart } //updateCart, deleteCart, getAllProductsInCart };