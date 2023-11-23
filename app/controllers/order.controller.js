const Order = require("../models/order.model");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const Product = require("../models/product.model");
const firebase = require('firebase-admin');
const { user } = require("../models");
const { restaurantConnections } = require("../../app");

function generateUniqueCode (){
  const digits = '0123456789';
  const codeLength = 6
  let code = '';

  for(let i = 0; i< codeLength; i++){
    const randomIndex = Math.floor(Math.random() * digits);

    code += digits[randomIndex];
  };
  return code;
};


//Create Order controller
const createOrder = async (req, res) => {
  const serviceAccount = require('../../alien-aileron-390207-firebase-adminsdk-vk283-b0523d8a44.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
    try {
      const uniqueCode = generateUniqueCode();
     
      const newOrder = req.body.orders;
      const registrationToken = req.body.token;

      // let products = await Order.create(newOrder);
      // console.log(products);

      const order = new Order({
        newOrder,
        uniqueCode
      });

      const savedOrder = await order.save();
      console.log('Order saved:', savedOrder);
      res.json(savedOrder);
      
      // const messaging = firebase.messaging();

      const message = {
        token: registrationToken,
        notification: {
          title: 'New Order!',
          body: 'Your order has been created!',
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

    const order = await Order.findOne().select("uniqueCode").sort({ _id: -1 });

    if(!food && !order){
      res.status(404).json({ message: "No Food present present in Cart" });
    };

    res.status(200).json({ food, order });
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

const tokenRoute = async(req, res) =>{
  try{
    const user = await User.findOne({ username: req.body.username });
    const token = req.body.token;

    const notificationToken = new Token({
      token: notificationToken,
      userId: user.id,
    });

    const savedToken = notificationToken.save();

    res.status(200).json({ savedToken });
  }catch(error){
    res.status(400).json({ error: "Error occured!" });
  }
};

const validateCode = async(req, res) =>{
  try {
    const { code, orderedBy } = req.body;

    const order = Order.findOne({ code });

    if(order && order.orderedBy.toString() === orderedBy){
      res.status(200).json({ valid: true });
    }else{
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(400).json({ msg: "Error occured1" });
  }
}


module.exports = {
    getOrderUser,
    getOrderRestaurant,
    createOrder,
    deleteOrder,
    tokenRoute,
    validateCode,
}

//google maps API key = AIzaSyD6s-1OllYQhM8mfw_5nqwwKPtym_IPO20