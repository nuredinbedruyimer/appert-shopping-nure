const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const fileupload = require('express-fileupload')
const dotenv = require("dotenv")
//setting up config file
dotenv.config({path: "backend/config/config.env"})
//Import error middlewares
const errorMiddleware = require("./middlewares/errors")

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileupload())




//Import all routes
const productRoutes = require("./routes/product")
const userRoutes = require("./routes/auth")
const orderRoutes = require("./routes/order")
const paymentRoutes = require("./routes/payment")


app.use("/api/v1", productRoutes)
app.use("/api/v1", userRoutes)
app.use("/api/v1",orderRoutes)
app.use("/api/v1",paymentRoutes)
app.use(errorMiddleware)

module.exports = app