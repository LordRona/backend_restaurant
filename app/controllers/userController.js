const User = require("../models/user.model");
const { VerifyToken } = require("../middlewares/authJwt");

const Signin = require("../controllers/auth.controller");

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

        const { id } = req.params;
        User.findByIdAndUpdate(id, { suspended: true }, { new: true }).then((user) => {
            if(user){
                res.status(200).json({ user });
            }else{
                res.status(400).json({ message: "User not found!" });
            }
        }).catch (error => { res.status(404).json({ message: "Error occured while trying to Suspend User!"})
    });
};


module.exports = {
    updateUserPassword,
    updateUserNameAndPhone,
    showCurrentUser,
    suspendAccount,
}