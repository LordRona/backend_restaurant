const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

//An async function to create Order
// const createOrder = async (req, res) =>{
//     const product = await Product.findOne({ name: req.body.name });
//     const user = await User.findOne({ username: req.body.username });
//     const cart = await Cart.findOne({ product });
//     try {
//         if(!user && !product && !cart){
//             res.status(404).json({ message: "User or product or cart not found!" });
//         }else{
//             const order = new Order({
//                 owner: user.id,
//                 product: product.id,
//                 name: req.body.name,
//                 quantity: req.body.quantity,
//                 adress: req.body.adress,
//                 bill: req.body.quantity * product.price,
//                 status: "pending"
//             });
//         }
//             const price = product.price;
//             const name = product.name;
//             const quantity = req.body.quantity;

//             res.status(200).json({ order });
//             console.log(`Order created!, price: ${price}, name: ${name}, quantity: ${quantity}`);
//     } catch (error) {
//         res.status(404).json({ message: "Error occured while trying to create order!" });
//     }  
//     };

    //Get all orders

const createOrder = async (req, res) =>{
    const { items: cartItems, tax, shippingFee } = req.body;

    if(!cartItems || cartItems.length < 1 ){
        return res.status(404).json({ message: "No cart items provided!" });
    }
    if(!tax || !shippingFee ){
        return res.status(404).json({ message: "Please provide taxt and shipping fee" });
    };
    
    let orderItems = [];
    let subTotal = 0;
    
    for(const item of cartItems){
        const dbProduct = await Product.findOne({ _id: item.product });
        if(!dbProduct) {
            res.status(404).json({ message: `No product with id: ${item.product}` });
        }
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        // add item to order
        orderItems = [...orderItems, singleOrderItem];
        // calculate subtotal
        subTotal += item.amount * price;
    };
    
    // calculate total
    const total = tax + shippingFee + subTotal;

    
  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    // clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res.status(404).json({ order });
};


const getAllOrders = async (req, res) =>{
    try {
        const orders = await Order.find({});
        res.status(200).json({ orders });
    } catch (error) {
        res.status(404).json({ message: "Error occured while trying to get orders!" });
    };
};

//get single order

const getSingleOrder = async (req, res) =>{
    try {
        const order = await Order.findById(req.params.id);
        res.status(200).json({ order });
    } catch (error) {
        res.status(404).json({ message: "Error occured while trying to get order!" });
    };
}

//code to delete order

const deleteOrder = async (req, res) =>{
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id });

        if(!order){
            res.status(400).json({ message: "Order not found!" });
        };
        
        order.remove();
        res.status(200).json({ message: "Order successfully deleted!" });
    } catch (error) {
        res.status(404).json({ message: "Error occured while trying to delete order!" });
    };
};

//code to update order

const updateOrder = async (req, res) =>{
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });

        if(!order){
            res.status(400).json({ message: "Error occured while trying to update order!" });
        }

        order.update();
        res.status(200).json({ order });

    } catch (error) {
        res.status(404).json({ message: "Error occured while trying to update order!" });
    };
};


module.exports = {
    getAllOrders,
    getSingleOrder,
    createOrder,
    updateOrder,
    deleteOrder
}