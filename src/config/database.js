const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.MONGO_URL;

const connectDb = async() => {
    await mongoose.connect(dbUrl);
}

module.exports = connectDb;