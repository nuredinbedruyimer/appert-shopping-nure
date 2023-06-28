const mongoose = require("mongoose")

const databaseConnect = () => {
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(con=>{
        console.log(`database connected successfully with ${con.connection.host}`)
    })
}

module.exports = databaseConnect