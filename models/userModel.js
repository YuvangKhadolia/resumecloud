const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

async function createUser(name, email, password) {
    const user = await User.create({
        name,
        email,
        password
    });

    return user;
}

async function findUserByEmail(email) {
    return await User.findOne({ email });
}

module.exports = {
    createUser,
    findUserByEmail
};