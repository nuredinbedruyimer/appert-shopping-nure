const app = require("./app")

const databaseConnect = require("./config/database")

const dotenv = require("dotenv")
const cloudinary = require("cloudinary")

process.on("uncaughtException", (err) => {
    console.log("error: "+err.message)
    console.log("server shutdown due to uncaughtException")
    process.exit(1)
})

//setting up config file
dotenv.config({path: "backend/config/config.env"})

//setting up cloudinary config

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

databaseConnect()
const server = app.listen(process.env.PORT, () => {
    console.log
    ("Server is running: "+process.env.PORT + " in "+ process.env.NODE_ENV+" mode")
})
// handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log("error: "+err.message)
    console.log("server shutdown due to unhandled promise rejections")
    server.close(() => {
        process.exit(1)
        })
})

