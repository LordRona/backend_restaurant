const Order = require("../models/order.model");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const Product = require("../models/product.model");
const firebase = require('firebase-admin');
const { user } = require("../models");
const { restaurantConnections } = require("../../app");

function generateOTP() {
  const min = 100000; // Minimum value (inclusive)
  const max = 999999; // Maximum value (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const otp = generateOTP();


//Create Order controller
const createOrder = async (req, res) => {
  // const serviceAccount = require('../../e-restou-alziron-firebase-adminsdk-37aq4-883e03d2e8.json');

  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  // });
    try {
      const uniqueCode = generateOTP();
     
      const newOrder = {...req.body,uniqueCode:uniqueCode}
      
      const registrationToken = req.body.token;

      let products = await Order.create(newOrder);

      // const savedOrder = await order.save();
      // console.log('Order saved:', savedOrder);
      // res.json(savedOrder);
      
      // const messaging = firebase.messaging();

      // const message = {
      //   token: registrationToken,
      //   notification: {
      //     title: 'New Order!',
      //     body: 'Your order has been created!',
      //   },
      // };
      
      // admin.messaging().send(message)
      //   .then((response) => {
      //     console.log('Push notification sent successfully:', response);
      //   })
      //   .catch((error) => {
      //     console.log('Error sending push notification:', error);
      //   });


      // res.status(200).json({ message: "Order Placed successfully!" });
  
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

const getOrdersOfTheDay = async (req, res) =>{
  try{
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const order = await Order.find({
      createdAt: { $gte: today },
    });

    const totalPricePerUser = order.reduce((acc, order) => {
      const { createdBy, price } = order;
      if (!acc[createdBy]) {
        acc[createdBy] = {
          order: [order],
          totalPrice: price,
        };
      }else{
        acc[createdBy].order.push(order);
        acc[createdBy].totalPrice += price;
      }

      return acc;
    }, {});
    console.log(totalPricePerUser);
    // console.log(order);

    res.json(totalPricePerUser);

  }catch(error){
    res.status(404).json({ message: "Error occured while getting food!" });
  }
};

const getTotalAmountPerWeekPerUser = async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date()
    weekAgo.setDate(today.getDate() - 7);

    const orders = await Order.find({
      createdAt: { $gte: weekAgo, $lte: today },
    });

    const totalPricePerUser = orders.reduce((acc, order) => {
      const { createdBy, price } = order;
      if (!acc[createdBy]) {
        acc[createdBy] = {
          order: [order],
          totalPrice: price,
        };
      } else {
        acc[createdBy].order.push(order);
        acc[createdBy].totalPrice += price;
      }

      return acc;
    }, {});

    res.json({ totalPricePerUser });
  } catch (error) {
    res.status(400).json({ msg: "Error occured!" });
  }
};

const getTotalAmountPerMonthPerUser = async (req, res) => {
  try {
    const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    const orders = await Order.find({
      createdAt: { $gte: monthAgo, $lte: today },
    });

    const totalPricePerUser = orders.reduce((acc, order) => {
      const { createdBy, price } = order;
      if (!acc[createdBy]) {
        acc[createdBy] = {
          order: [order],
          totalPrice: price,
        };
      } else {
        acc[createdBy].order.push(order);
        acc[createdBy].totalPrice += price;
      }

      return acc;
    }, {});

    res.json({ totalPricePerUser });
  } catch (error) {
    res.status(401).json({ msg: "Error occured!" });
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
    const code = req.body.uniqueCode;
    const orderedBy = req.body.orderedBy;

    Order.findOne({ uniqueCode: code }, (err, result) =>{
      if(err) res.status(404).json({ msg: "Error Occured!" });

      const orderId = result.orderedBy.toString()
      if(result.uniqueCode === code.toString() && orderedBy === orderId){
        res.status(200).json({ msg: "Delivery confirmed!" });
      }else{
        res.status(404).json({ msg: "Wrong code inserted" });
      }
    });
  
  } catch (error) {
    res.status(400).json({ msg: "Error occured!" });
  }
}


module.exports = {
    getOrderUser,
    getOrderRestaurant,
    createOrder,
    deleteOrder,
    tokenRoute,
    validateCode,
    getOrdersOfTheDay,
    getTotalAmountPerWeekPerUser,
    getTotalAmountPerMonthPerUser
}

//google maps API key = AIzaSyD6s-1OllYQhM8mfw_5nqwwKPtym_IPO20