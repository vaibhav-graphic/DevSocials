const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  const { firstName, lastName, emailId, password } = data;

  try {
    if (
      firstName.trim().length === 0 ||
      lastName.trim().length === 0 ||
      emailId.trim().length === 0 ||
      password.trim().length === 0
    ) {
      throw new Error("Input field is empty");
    }

    const ALLOWED_DATA = ["firstName", "lastName", "emailId", "password"];

    const isAllowedData = Object.keys(data).every((k) => {
      return ALLOWED_DATA.includes(k);
    });

    if (!isAllowedData) {
      throw new Error("Trying to add extra field");
    }

    data.emailId = data.emailId.toLowerCase();
    const user = new User(data);
    const existingEmail = await User.findOne({ emailId: data.emailId });

    if (existingEmail) {
      throw new Error("User with this email already exists");
    }

    const userData = await user.save();

    res.json({ msg: "User signup successfully", data: userData });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = router;
