const express = require("express");

const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

const SAVE_USER_DATA = "firstName lastName photoUrl age gender about skills";

router.get("/user/requests/received", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAVE_USER_DATA);

    res.json({ msg: "Data fetch succesfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

router.get("/user/connections", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAVE_USER_DATA)
      .populate("toUserId", SAVE_USER_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data: data });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAVE_USER_DATA);

    res.send(users);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = router;
