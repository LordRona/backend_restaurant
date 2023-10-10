const Review = require("../models/reviews.model");
const Product = require("../models/product.model");

const createReview = async (req, res) => {
    try {
        const { productId } = req.params;
        const { title, rating } = req.body;
    
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
    
        const review = new Review({
          productId,
          title,
          rating,
        });
    
        const savedReview = await review.save();
    
        // product.reviews.push(savedReview._id);
        // await product.save();
    
        res.json(savedReview);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};

//Get all reviews for single product!
const getSingleReview = async (req, res) => {
    const { productId } = req.params;
    Review.findOne({ productId }).then((review) => res.status(200).json({ review }))
    .catch((error) => {
        res.status(404).json({ message: error})
    })
};

// GET a specific review for a product
const getSpecificReview = async (req, res) => {
    const { reviewId } = req.params;
  
    // Retrieve the specific review based on the reviewId
    Review.findById(reviewId)
      .then((review) => {
        if (!review) {
          return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  };

  const updateReview = async (req, res) =>{
        const { reviewId } = req.params;
        const { rating } = req.body;
      
        // Find the review by ID and update its properties
        Review.findByIdAndUpdate(
          reviewId,
          { rating },
          { new: true }
        )
          .then((updatedReview) => {
            if (!updatedReview) {
              return res.status(404).json({ error: 'Review not found' });
            }
            res.json(updatedReview);
          })
          .catch((err) => res.status(500).json({ error: err.message }));
  };

// DELETE a review for a product
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
  
    // Find the review by ID and remove it
    Review.findByIdAndDelete(reviewId)
      .then((deletedReview) => {
        if (!deletedReview) {
          return res.status(404).json({ error: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  };

// const getSingleProductReviews = async (req, res) =>{
//     const { id: productId } = req.params;
//     const review = await Review.findOne({ product: productId });
//     res.status(200).json({ review, count: review.length });
// };

module.exports = {
    createReview,
    getSpecificReview,
    // getSingleProductReviews,
    deleteReview,
    getSingleReview,
    updateReview
}