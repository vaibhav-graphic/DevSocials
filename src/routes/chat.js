const express = require("express");

const { authMiddleware } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const router = express.Router();

router.get("/chat/:targetUserId", authMiddleware, async (req, res) => {
  try {
    const {targetUserId} = req.params;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
        path: "messages.senderId",
        select: "firstName lastName"
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(400).json({ msg: `Chat Error + ${err}` });
  }
});

module.exports = router;
