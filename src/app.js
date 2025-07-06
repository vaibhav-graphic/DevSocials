const express = require("express");
const connectDb = require("./config/database");

const app = express();

const authRouter = require("./routes/auth");


connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server started successfully");
    });
  })
  .catch(err => {
    console.log(err);
  });
