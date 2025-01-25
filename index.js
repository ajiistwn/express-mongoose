const path = require("path")
const express = require("express")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const app = express()

// Models
const Product = require("./models/product")

//connect to mongodb
mongoose.connect("mongodb://127.0.0.1/shop_db")
    .then((result) => {
        console.log("Connect to mongodb")
    })
    .catch((err) => {
        console.log(err)
    })

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true })) //menangkap form html
app.use(methodOverride("_method"))

// Route

app.get("/", (req, res) => {
    res.render("home/index")
})


app.get("/products/create", (req, res) => {
    res.render("product/create")
})

app.post("/products", async (req, res) => {
    const product = new Product(req.body)
    await product.save()
    res.redirect(`/products/${product._id}`)
})

app.get("/products", async (req, res) => {
    const { category } = req.query
    if (category) {
        const products = await Product.find({ category })
        res.render("product/index", { products, category })
    } else {
        const products = await Product.find({})
        res.render("product/index", { products, category : "All" })
    }


})

app.get("/products/:id", async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render("product/detail", { product })
})

app.get("/products/:id/edit", async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render("product/edit", { product })
})

app.put("/products/:id", async (req, res) => {
    console.log(req.params.body)
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body)
    res.redirect(`/products/${product._id}`)
})

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect(`/products`)
})

app.listen(3000, () => {
    console.log("shop app listen on port http://localhost:3000")
})



