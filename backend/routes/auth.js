const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../handlers/auth-handler");

router.post("/register", async (req, res) => {
    try {
        const model = req.body;
        if (!model.name || !model.email || !model.password) {
            return res.status(400).json({ error: "Please provide name, email, and password" });
        }

        await registerUser(model);
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const model = req.body;
        if (!model.email || !model.password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        const result = await loginUser(model);
        if (!result) {
            return res.status(400).json({ error: "Email or password incorrect" });
        }

        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
      const result = await forgotPassword(req.body.email);
      res.json(result); // returns { message, previewLink }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

router.post("/reset-password/:token", async (req, res) => {
    try {
        const result = await resetPassword(req.params.token, req.body.password);
        res.json({ message: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
