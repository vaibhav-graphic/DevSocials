const express = require("express");

const app = express();

app.use("/", (req, res) => {
    res.send("check");
})

app.listen(3000, () => {
    console.log("Server started successfuly");
});