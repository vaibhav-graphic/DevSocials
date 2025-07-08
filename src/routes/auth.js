const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { validateSignupData, validateLoginData } = require("../utils/validate");
const { encryptPassword } = require("../utils/encryption");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;

  try {
    const clearData = await validateSignupData(data);
    clearData.password = await encryptPassword(clearData.password);

    const user = new User(clearData);
    const userData = await user.save();

    res.json({ msg: "User signup successfully", data: userData });
  } catch (err) {
    res.status(400).send("Signup failed : " + err.message);
  }
});

router.post("/login", async (req, res) => {
  const data = req.body;
  const {emailId, password} = data;

  try {
    validateLoginData(data);

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invaild credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invaild credentials");
    }

    res.json({ msg: "Login successfully" });
  } catch (err) {
    res.status(401).send("Login fail : " + err.message);
  }
});

module.exports = router;
