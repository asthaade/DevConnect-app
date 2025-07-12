const mongoose = require('mongoose');

const connectDB = async() =>{
    await mongoose.connect(process.env.DB_Connection_String);
};

module.exports = connectDB;