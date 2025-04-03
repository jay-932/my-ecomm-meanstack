const User = require("../db/user"); // ✅ Corrected Import
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(userData) {
    try {
        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        // ✅ Hash Password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // ✅ Save User in DB with Correct Password Field
        const user = new User({
            name: userData.name,
            email: userData.email,
            password: hashedPassword, // ✅ Now correctly saving hashed password
        });

        await user.save();
        console.log("✅ User Registered:", user);
        return user;
        
    } catch (error) {
        console.error("❌ Error in registerUser:", error.message);
        throw error;
    }
}

async function loginUser(userData) {
    try {
        const user = await User.findOne({ email: userData.email });

        if (!user) {
            console.log("❌ User not found!");
            return null;
        }

        console.log("🔍 User Found:", user);
        console.log("🔑 Entered Password:", userData.password);
        console.log("🔒 Stored Hashed Password:", user.password);

        const isMatched = await bcrypt.compare(userData.password, user.password);
        
        if (!isMatched) {
            console.log("❌ Password does not match!");
            return null;
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email
            },
            "seceret", // ❌ Yeh hardcoded hai, ise env variable me rakhein
            { expiresIn: "1h" }
        );

        console.log("✅ Login Successful! Token Generated.");
        return { token, user };

    } catch (error) {
        console.error("❌ Error in loginUser:", error.message);
        throw error;
    }
}

module.exports = { registerUser, loginUser };
