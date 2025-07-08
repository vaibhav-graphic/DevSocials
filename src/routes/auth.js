const express = require("express");

const User = require("../models/user");
const { validateSignupData } = require("../utils/validate");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;

  try {

    const clearData = await validateSignupData(data);

    const user = new User(clearData);
    const userData = await user.save();

    res.json({ msg: "User signup successfully", data: userData });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = router;
