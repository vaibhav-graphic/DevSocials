const express = require("express");
const connectDb = require("./config/database");

const app = express();

app.use("/", (req, res) => {
  res.send("check");
});

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
