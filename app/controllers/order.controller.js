const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const firebase = require('firebase-admin');
const createOrder = async (req, res) => {
  const serviceAccount = require('../../alien-aileron-390207-firebase-adminsdk-vk283-b0523d8a44.json');
    try {
     
      const newOrder = req.body;
      const registrationToken = req.body.token;

      let products = await Order.create(newOrder);
      console.log(products);
      // Query the database to find the products
    
      // newOrder.forEach(order => {
      //   const { createdBy, productName, quantity, orderedBy } = order;
      // const restaurantSocket = restaurantConnections.get(createdBy);
      // if (restaurantSocket) {
      //   const orderData = {
      //     productName,
      //     quantity,
      //     orderedBy
      //   }
      //   restaurantSocket.emit('Your product has been Ordered!', orderData);
      // }
  
      // });

      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
      });
      
      // const messaging = firebase.messaging();

      const message = {
        token: registrationToken,
        notification: {
          title: 'My Push Notification',
          body: 'This is the body of my push notification.',
        },
      };
      
      admin.messaging().send(message)
        .then((response) => {
          console.log('Push notification sent successfully:', response);
        })
        .catch((error) => {
          console.log('Error sending push notification:', error);
        });


      res.status(200).json({ message: "Order Placed successfully!" });
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getOrderUser = async (req, res) =>{
    try{
      const orderedBy  = req.params.orderedBy;
      
      const order = await Order.find({ orderedBy });

      res.status(202).json({ order });
    }catch(error){
      res.status(404).json({ message: "Error occured while getting Order" });
    }
  }

const getOrderRestaurant = async (req, res) =>{
  try{
    const  restaurantId  = req.params.restaurantId;

    const food = await Order.find({ restaurantId });

    if(!food){
      res.status(404).json({ message: "No Food present present in Cart" });
    };

    res.status(200).json({ food });
  }catch(error){
    res.status(404).json({ message: "Error occured while getting food!" });
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
    getOrderRestaurant,
    createOrder,
    deleteOrder
}

//google maps API key = AIzaSyD6s-1OllYQhM8mfw_5nqwwKPtym_IPO20