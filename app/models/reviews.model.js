const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating!'],
    },
    title: {
        type: String,
        trim: true,
        require: [true, "Please provide review title"],
        maxlenght: 150
    },
    comment: {
        type: String,
        required: [true, "Please provide review text!"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
    },
},
    { timestamps : true },
);

// ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// async (productId) =>{
//     const result = await this.aggregate([
//        { $match: { product: productId } },
//        {
//         $group: {
//             _id: null,
//             averageRating: { $avg: "$rating" },
//             numberOfReiews: { $sum: 1 },
//         },
//        },
//     ]);
    
//     try{
//         await this.model("Product").findOneAndUpdate(
//             { _id: productId },
//             {
//                 averageRating: Math.ceil(result[0]?.averageRating || 0),
//                 numberOfReiews: result[0]?.numberOfReiews || 0,
//             }
//             )
//         } catch(error){
//             console.log(error);
//         }
//     };

//     ReviewSchema.post("save", async ()=>{
//         await this.constructor.calculateAverageRating(this.product);
//     });

//     ReviewSchema.post("remove", async ()=>{
//         await this.constructor.calculateAverageRating(this.product);
//     });

    module.exports = mongoose.model("Review", ReviewSchema);