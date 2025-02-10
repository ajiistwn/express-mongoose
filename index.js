const path = require("path")
const express = require("express")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const app = express()
const ErrorHandler = require("./ErrorHandler")

// Models
const Product = require("./models/product")
const { error } = require("console")

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

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err))
    }
}

// Route
app.get("/", (req, res) => {
    res.render("home/index")
})


app.get("/products/create", (req, res) => {
    // throw new ErrorHandler("this is custom error", 503)
    res.render("product/create")
})

app.post("/products", wrapAsync(async (req, res) => {
    const product = new Product(req.body)
    await product.save()
    res.redirect(`/products/${product._id}`)
}))

app.get("/products", wrapAsync(async (req, res) => {
    const { category } = req.query
    if (category) {
        const products = await Product.find({ category })
        res.render("product/index", { products, category })
    } else {
        const products = await Product.find({})
        res.render("product/index", { products, category: "All" })
    }


}))

app.get("/products/:id", wrapAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render("product/detail", { product })
}))

app.get("/products/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render("product/edit", { product })
}))

app.put("/products/:id", wrapAsync(async (req, res) => {
    console.log(req.params.body)
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body)
    res.redirect(`/products/${product._id}`)
}))

app.delete("/products/:id", wrapAsync(async (req, res) => {
    const { id } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect(`/products`)
}))


const validatorHandler = err => {
    err.status = Object.values(err.errors).map(item => item.message)
    err.status = 400
}

app.use((err, req, res, next) => {
    if (err.name === "ValidatorError") err = validatorHandler(err)
    if (err.name === "CastError") {
        err.status = 404
        err.message = "Product Not Found"
    }
    next(err)

})


app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).send(message);
});

app.listen(3000, () => {
    console.log("shop app listen on port http://localhost:3000")
})



