const User = require("../models/user.model");
const userLocation = require("../models/user.model");
const { VerifyToken } = require("../middlewares/authJwt");
const db = require("../models");
const Role = db.role;

const Signin = require("./auth.controller");

const updateUserPassword = async (req, res) =>{
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword ) {
        return res.status(500).send("Please provide both fields");
    }

    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);

    if(!isPasswordCorrect) return res.status(404).send("Invalid credentials");

    user.password = newPassword;

    await user.save();
    res.status(StatusCode.OK).json({ msg: "Password changed successfully!" });
}

const showCurrentUser = async (req, res) =>{
    res.status(200).json({ user })
}

const updateUserNameAndPhone = async (req, res) =>{
    const { phone, username } = req.body;

    if(!phone || !username) return res.status(404).send("Please provide both fields! ");

    const user = await User.findOne({
         _id: req.user.userId 
    });

    user.phone = phone;
    user.username = username;

    await user.save();

    const tokenUser = VerifyToken.verifyToken(user);
    Signin.signin({ res, user: tokenUser });
}

const suspendAccount = async (req, res) =>{
    try {
        const user = await User.findOne({ username: req.body.username });
        const userId = user.id;

        if(!userId) return res.status(404).send("User not found!");

        User.findByIdAndUpdate(userId, {
            status: "suspended"
        }, (err, user) => {
            if(err) return res.status(500).send(err);
            res.status(200).json({ msg: "User suspended successfully!" });
        })
    } catch (error) {
        res.status(401).json({ msg: "Internal server error!" });
    }
};

const searchUser = async (req, res) =>{
    try {
        const searchRestaurant = req.query.q;

        const user = await User.find({
            username: { $regex: searchRestaurant, $options: 'i' }
        });

        res.status(200).json(user);
    } catch (error) {
        req.status(401).json({ msg: "Internal server error!" });
    }
}


module.exports = {
    updateUserPassword,
    updateUserNameAndPhone,
    showCurrentUser,
    suspendAccount,
    searchUser,
}