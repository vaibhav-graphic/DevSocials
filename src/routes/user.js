const express = require("express");

const { authMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

const SAVE_USER_DATA = "firstName lastName photoUrl age gender about skills"

router.get("/user/requests/received", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      SAVE_USER_DATA
    );

    res.json({ msg: "Data fetch succesfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = router;
