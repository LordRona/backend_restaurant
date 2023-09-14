const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

//An async function to add product to cart

const createCart = async (req, res) =>{
    try{ 
    const user = await User.findOne({ username: req.body.username });
    const product = await Product.findOne({ name: req.body.name });

    if(user && product){
        const cart = new Cart({
            owner: user.id,
            product: product.id,
            name: req.body.name,
            quantity: req.body.quantity,
            bill: req.body.quantity
        })

        await cart.save();

        res.status(200).json({ cart });
        console.log("Cart created!");
    }else{
        res.status(404).json({ message: "User or product not found!" });
    }
    }catch(error){
        res.status(404).json({ message: "Error Occured while adding to cart" });
    };
};

const addToCart = async (req, res) =>{
    
}