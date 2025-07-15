const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/Profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server started successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
