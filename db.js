const mongoose = require('mongoose')
const config = require('config')
const dbURI = config.get('dbURI')

async function connectDb(callback){
    try{
        await mongoose.connect(dbURI)
        console.log('DB connected')
        callback()
    }
    catch(error){
        console.log(error)
    }
}


module.exports = connectDb