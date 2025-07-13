const express = require("express");

const { authMiddleware } = require("../middlewares/auth");
const { validateEditData } = require("../utils/validate");

const router = express.Router();

router.get("/profile/view", authMiddleware, (req, res) => {
  try {
    const user = req.user;

    res.json({ msg: "user data", data: user });
  } catch (err) {
    req.status(400).send("Error" + err.message);
  }
});

router.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    validateEditData(req.body);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      msg: `${loggedInUser.firstName} your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Profilr Edit Error : " + err.message);
  }
});

module.exports = router;
