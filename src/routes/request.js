const express = require("express");

const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/request/send/:status/:toUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.toString() === toUserId.toString()) {
        throw new Error("Cannot send connection request to yourself");
      }

      const ALLOWED_DATA = ["ignored", "interested"];

      if (!ALLOWED_DATA.includes(status)) {
        throw new Error("Invalid status type");
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error("User not found");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({ msg: "connection request sent successfully", data: data });
    } catch (err) {
      res.status(400).send("Request sending error : " + err.message);
    }
  }
);

router.post(
  "/request/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ msg: "Connection Request " + status, data: data });
    } catch (err) {
      res.status(400).send("Request review error : " + err.message);
    }
  }
);

module.exports = router;
