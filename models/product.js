const mongoose = require("mongoose")


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Nama tidak boleh kosong!"],
    },
    brand: {
        type: String,
        required:  [true, "Brand tidak boleh kosong!"]
    },
    color: {
        type: String,
        required:  [true, "Warna tidak boleh kosong!"]
    },
    price: {
        type: Number,
        required:  [true, "Harga tidak boleh kosong!"]
    },
    category: {
        type: String,
        enum: ["Baju", "Celana", "Aksesoris", "Jaket"],

    },
})

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product