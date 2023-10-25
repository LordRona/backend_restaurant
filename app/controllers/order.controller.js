const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
// const Cart = require("../models/cart.model");
const Notification = require("../models/notification.model");
const { user } = require("../models");

const createOrder = async (req, res) => {
    // try {
      const { quantity, productName, totalBill, createdBy, orderedBy, status } = req.body;
      const user = await User.findOne({ username: req.body.username });

      const newOrder = new Order({
        quantity,
        productName,
        totalBill,
        createdBy,
        orderedBy,
        status
      })
  
      // Query the database to find the products
      const products = await Product.find({ _id: { $in: createdBy } });
  
      // Save the order to the database
      await newOrder.save();
      res.status(200).json({ message: "Order Placed successfully!" });

      //Notification by NodeJS
      const message = `Your food ${productName}, is being ordered!`;
      await User.updateMany({ _id: { $in: createdBy } }, { $push: { notifications: message }});  
      // // Notify the user who created the product
      // const productCreators = products.map(product => product.owner);
  
      // // Assuming you have a User model
      // const creators = await User.find({ _id: { $in: productCreators } });
  
      // // Send a notification or perform any action to notify the creators
      // creators.forEach(creator => {
      //   // Send a notification to the creator
      //   // const notification = new Notification({
      //   //     recipient: creator._id,
      //   //     message: `Your product has been ordered by user ${userId}.`
      //   //   });
        
      //   //   // Save the notification to the database
      //   //   notification.save();
        
      //   //   // Emit a WebSocket event to the creator
      //   //   io.to(creator._id).emit('new-notification', notification);
      //   // io.emit('new-order', order);
      //   // // For example, you can use a messaging service or send an email
      //   // console.log(`Notifying user ${creator.name} that their product has been ordered.`);

      //   const message = {
      //     notification: {
      //       title: "Order placed",
      //       body: `Your product ${products._id} has been ordered.`
      //     },
      //     token: tokenAddress,
      //   }

      //   admin.messaging().send(message);
      // });
  
      res.json(newOrder);
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  };

  const getOrderUser = async (req, res) =>{
    try{
      const userId = req.params.userId;
      
      const order = await Order.find({ owner: userId });

      res.status(202).json({ order });
    }catch(error){
      res.status(404).json({ message: "Error occured while getting Order" });
    }
  }

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



module.exports = {
    getOrderUser,
    // getSingleOrder,
    createOrder,
    deleteOrder
}