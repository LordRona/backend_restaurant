const Review = require("../models/reviews.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

//const { StatusCodes } = require("http-status-codes");
const  verifySignUp  = require("../middlewares/verifySignUp");
const { findById } = require("../models/user.model");

const createReview = async (req, res) =>{
    try{ 

    const user = await User.findOne({ username: req.body.username });
    const product = await Product.findOne({ name: req.body.name });

    if(!user){
        res.status(404).json({ message: "User does not exist!"});
    };
    if(!product){
        res.status(404).json({ message: "Product does not exist!"});
    };

    
    const review = new Review({
        rating: req.body.rating,
        title: req.body.title,
        comment: req.body.comment,
        user: user.id,
        product: product.id
    });
    
    try{ 
    const isSubmitted = await review.save();
    res.status(200).json({ review });

    if(isSubmitted){
        res.json({ message: "Already submitted review!" });
    }

    }catch(err){
    res.status(404).json({ message: "Error occured while trying to save Review!"});
    }

    console.log(`Review successfully created!`); 
    }catch(error){
        res.status(404).json({ message: `Error occured while trying to create product!`, error });
    }
};

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate({
        path: "product",
        select: "name description price",
    });

    res.status(200).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) =>{
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if(!review) return res.status(404).send("No review with that ID");

   // verifySignup(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(200).json({ review });
};

const updateReview = async (req, res) =>{
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;
    
    const review = await Review.findOne({ _id: reviewId });

    if(!review) return res.status(404).send("Error! Review does not exixts");

    //verifySignUp.loginAuth(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(200).json({ review });
}

const deleteReview = async (req, res) =>{
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if(!review) return res.status(404).send("No review with this ID");

   // verifySignUp.loginAuth(req.user, review.user);
    await review.remove();
    res.status(200).json({ msg: "Success! Review removed!" });
};

const getSingleProductReviews = async (req, res) =>{
    const { id: productId } = req.params;
    const review = await Review.findOne({ product: productId });
    res.status(200).json({ review, count: review.length });
};

module.exports = {
    createReview,
    getAllReviews,
    getSingleProductReviews,
    deleteReview,
    getSingleReview,
    updateReview
}