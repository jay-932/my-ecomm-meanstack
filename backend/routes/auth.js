const express = require("express");
const router = express.Router();
const { registerUser,loginUser } = require("../handlers/auth-handler");

router.post("/register", async (req, res) => {
    let model = req.body;
    if (model.name && model.email && model.password) {
        //to register hoga
        await registerUser(model);
        res.send({
            message: "User registered"
        });
    } else {
        res.status(400).json({
            error: "Please Provide name,email, and password"
        });
    }
});

router.post("/login", async (req, res) => {
    let model = req.body;
    if (model.email && model.password) {
        const result = await loginUser(model);
        if (result) {
            res.send(
                result
            );
        } else {
            res.status(400).json({
                error: "Email or password Incorrect"
            });
        }

    } else {
        res.status(400).json({
            error: "Please Provide email, and password"
        });
    }
});


module.exports = router;