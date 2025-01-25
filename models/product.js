const mongoose = require("mongoose")


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["Baju", "Celana", "Aksesoris", "Jaket"],

    },
})

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product