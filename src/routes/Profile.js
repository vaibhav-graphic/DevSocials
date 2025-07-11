const express = require("express");

const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.get("/profile/view", authMiddleware, (req, res) => {
    try{
        const user = req.user;

        res.json({msg: "user data", data: user});
    }
    catch(err){
        req.status(400).send("Error" + err.message);
    }

    
})

module.exports = router;