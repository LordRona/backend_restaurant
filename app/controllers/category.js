const mongoose = require("mongoose");
const Product = require("../models/product.model");

module.exports = async (req, res) =>{
    try{
  const category = Product.find({ category: "all" });
  res.status(200).json({ category });
}catch(error){
  res.status(404).json({ message: "Error occured while looking for category" });
};
};