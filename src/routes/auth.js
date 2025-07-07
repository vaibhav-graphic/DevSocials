const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async(req, res) => {
    try{
        const userData = req.body;
        const user = new User(userData);

        const data = await user.save();

        res.send(data);
    }
    catch(err){
        res.send("Error: " + err.message);
    }
});

module.exports = router;