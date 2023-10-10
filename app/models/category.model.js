const mongoose = require("mongoose");

const Category = mongoose.model("Category",
new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}));

const CategoryAll = mongoose.model("CategoryAll", 
new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
})
);

const CategoryAfrican = mongoose.model("CategoryAfrican", 
new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
})
);

const CategoryForiegn = mongoose.model("CategoryForiegn", 
new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
})
);

module.exports = { Category, CategoryAll, CategoryAfrican, CategoryForiegn };