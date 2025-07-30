const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const initializeSocket = require("./utils/socket");

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/Profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    server.listen(process.env.PORT, () => {
      console.log("Server started successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
