const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        maxLength:[100,"Product name cannot be more than 100 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        maxLength:[5,"Price cannot be more than 5 characters"],
        default:0
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    ratings: 
     {
        type: Number,
        default:0 
    },
    images: [
        {
            public_id : {
                type: String,
                required: [true, "Image is required"]
            },
            url : {
                type: String,
                required: [true, "Image is required"]
                }
        }
    ],
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values : [
                "Electronics",
                "Laptops",
                "Acessories",
                "Cameras",
                "Headphones",
                "Food",
                "Books",
                "Clothes/Shoes",
                "Beauty/Health",
                "Sports",
                "Outdoor",
                "Home"
            ],
            message: "please select a valid category"
        }
    },
    seller: {
        type: String,
        required: [true, "Address is required"],
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, "Stock is required"],
        maxLength:[5,"Stock cannot be more than 5 characters"]
    },
    numberOfReviews:{
        type: Number,
        default: 0
    },
    reviews: [
        {
            name:{
                type: String,
                required: [true, "Reviewer is required"],
            },
            ratings: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required : true
            },
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
                required: true
            }

        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema)